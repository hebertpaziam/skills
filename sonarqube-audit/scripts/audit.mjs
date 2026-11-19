#!/usr/bin/env node
// SonarQube Audit - orquestrador.
//   node audit.mjs detect <projeto>                     -> JSON com o modo escolhido
//   node audit.mjs scan   <projeto> [opções]            -> executa análise, imprime o caminho do issues.json
//   node audit.mjs render <projeto> --issues <arq> [--enrich <arq>]  -> grava o relatório
// Opções (scan): --mode docker|server|approximate  --keep  --port N
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_PORT, WORK_ROOT } from "./lib/config.mjs";
import { dockerStatus, ensureServer, runScanner, stopServer } from "./lib/docker.mjs";
import { JS_TS_EXT, detectLanguages, runEslintFallback } from "./lib/fallback-eslint.mjs";
import { computeDiff } from "./lib/diff.mjs";
import { normalizeSonar } from "./lib/normalize.mjs";
import { renderReport } from "./lib/render.mjs";
import { SonarClient, bootstrap, parseSonarDate } from "./lib/sonar-api.mjs";
import { AuditError, log, readJson, run, sanitizeKey } from "./lib/util.mjs";

const [cmd, projectArg, ...rest] = process.argv.slice(2);
const opt = (name) => { const i = rest.indexOf(`--${name}`); return i >= 0 ? rest[i + 1] : undefined; };
const flag = (name) => rest.includes(`--${name}`);

function usage() {
  process.stderr.write("Uso: node audit.mjs <detect|scan|render> <projeto> [opções]\n");
  process.exit(2);
}
if (!cmd || !projectArg) usage();

const projectRoot = path.resolve(projectArg);
const projectName = path.basename(projectRoot);
const projectKey = sanitizeKey(projectName);
const reportsDir = path.join(projectRoot, "sonarqube-reports");

function detectMode(files) {
  const forced = opt("mode");
  const hasJsTs = files.some((f) => JS_TS_EXT.has(path.extname(f).slice(1).toLowerCase()));
  const notes = [];
  const serverOk = Boolean(process.env.SONAR_URL && process.env.SONAR_TOKEN);
  const dk = dockerStatus();
  if (!dk.ok) notes.push(`Docker indisponível: ${dk.reason}`);
  const npmOk = run("npm", ["--version"]).status === 0;

  let mode = forced;
  if (!mode) mode = serverOk ? "server" : dk.ok ? "docker" : "approximate";
  if (mode === "server" && !serverOk) throw new AuditError("modo server exige as variáveis SONAR_URL e SONAR_TOKEN");
  if (mode === "docker" && !dk.ok) throw new AuditError(`modo docker indisponível: ${dk.reason}`);
  if (mode === "approximate") {
    if (!npmOk) throw new AuditError("nenhum modo disponível: instale o Docker (recomendado) ou o Node.js com npm para o modo aproximado");
    if (!hasJsTs) throw new AuditError("nenhum modo disponível: sem Docker/servidor o modo aproximado só analisa JS/TS e o projeto não possui esses arquivos. Habilite o Docker.");
  }
  return { mode, notes };
}

async function scan() {
  const { files, counts } = detectLanguages(projectRoot);
  const { mode, notes } = detectMode(files);
  for (const n of notes) log(n);
  log(`modo de análise: ${mode}`);
  const hasJava = files.some((f) => f.endsWith(".java"));
  const meta = { mode, timestamp: new Date().toISOString(), project_root: projectRoot, project_key: projectKey };
  let issues, hotspots, rules = {}, history; // history: undefined = sem histórico (aproximado), null = 1ª análise

  if (mode === "approximate") {
    const r = runEslintFallback(projectRoot, files);
    ({ issues, hotspots } = r);
    meta.files_analyzed = r.analyzedFiles;
    meta.languages = ["JavaScript/TypeScript"];
    meta.not_analyzed = Object.entries(counts)
      .filter(([ext]) => !JS_TS_EXT.has(ext)).map(([ext, count]) => ({ ext, count }))
      .sort((a, b) => b.count - a.count).slice(0, 15);
    for (const x of [...issues, ...hotspots]) rules[x.rule] ||= { name: x.eslintRule || x.rule };
  } else {
    let client, keepRunning = flag("keep");
    try {
      if (mode === "server") {
        client = new SonarClient(process.env.SONAR_URL, { token: process.env.SONAR_TOKEN });
        meta.project_key = process.env.SONAR_PROJECT_KEY || projectKey;
        meta.analysis_date = await client.lastAnalysisDate(meta.project_key);
      } else {
        const srv = await ensureServer(Number(opt("port")) || DEFAULT_PORT);
        const { token } = await bootstrap(srv.baseUrl, projectKey, projectName);
        client = new SonarClient(srv.baseUrl, { token });
        const sc = runScanner({ projectRoot, projectKey, token, hasJava });
        meta.java_binaries = sc.javaBinaries;
        if (sc.ceTaskId) await client.waitForTask(sc.ceTaskId); else await client.waitForProjectIdle(projectKey);
      }
      meta.sonar_version = await client.version();
      const key = meta.project_key;
      const col = await client.fetchIssues(key);
      const rawHotspots = await client.fetchHotspots(key);
      ({ issues, hotspots } = normalizeSonar({ issues: col.issues, hotspots: rawHotspots, projectKey: key }));
      meta.truncated = col.truncated;
      // histórico vem do Sonar: baseline = análise anterior à mais recente
      const dates = await client.analysisDates(key, 2);
      if (dates.length >= 2) {
        const closed = await client.fetchClosedSince(key, parseSonarDate(dates[1]));
        history = {
          baseline: dates[1],
          closed: closed.map((x) => ({ key: x.key, rule: x.rule, file: x.component.split(":").slice(1).join(":"), line: x.line ?? x.textRange?.startLine ?? null, resolution: x.resolution })),
        };
      } else history = null;
      const m = await client.measures(key);
      meta.files_analyzed = m.files ? Number(m.files) : null;
      meta.languages = (m.ncloc_language_distribution || "").split(";").map((s) => s.split("=")[0]).filter(Boolean);
      for (const r of new Set([...issues, ...hotspots].map((x) => x.rule))) {
        rules[r] = (await client.ruleInfo(r)) || { name: r };
      }
    } finally {
      if (mode === "docker" && !keepRunning) stopServer();
    }
  }

  const out = path.join(WORK_ROOT, projectKey);
  fs.mkdirSync(out, { recursive: true });
  const file = path.join(out, "issues.json");
  fs.writeFileSync(file, JSON.stringify({ meta, issues, hotspots, rules, history }, null, 2));
  log(`${issues.length} issues, ${hotspots.length} hotspots`);
  process.stdout.write(`${file}\n`);
}

function validateEnrich(e) {
  if (e == null || typeof e !== "object") throw new AuditError("arquivo de enriquecimento inválido (esperado objeto JSON)");
  const clean = {};
  if (e.rules && typeof e.rules === "object") clean.rules = e.rules;
  if (Array.isArray(e.glossario)) clean.glossario = e.glossario.filter((g) => g?.termo && g?.significado);
  if (typeof e.prompt === "string" && e.prompt.trim()) clean.prompt = e.prompt;
  return clean; // só texto: contagens/issues nunca vêm do enriquecimento
}

function render() {
  const issuesFile = opt("issues");
  if (!issuesFile) throw new AuditError("render exige --issues <arquivo>");
  const data = readJson(issuesFile);
  const enrich = opt("enrich") ? validateEnrich(readJson(opt("enrich"))) : {};
  const diff = computeDiff(data);

  const now = new Date();
  const p = (n) => String(n).padStart(2, "0");
  const date = `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
  const stamp = `${date}T${p(now.getHours())}${p(now.getMinutes())}${p(now.getSeconds())}`;
  const fileName = `${projectName}_${stamp}.md`;
  const ctx = {
    projectName, date, fileName,
    languages: (data.meta.languages || []).join(", ") || "n/d",
    hasOpenspec: fs.existsSync(path.join(projectRoot, "openspec")),
  };
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, fileName), renderReport({ data, diff, enrich, ctx }));
  process.stdout.write(`Relatório gerado: ${fileName}\n`);
}

try {
  if (cmd === "detect") {
    const { files } = detectLanguages(projectRoot);
    process.stdout.write(JSON.stringify(detectMode(files)) + "\n");
  } else if (cmd === "scan") await scan();
  else if (cmd === "render") render();
  else usage();
} catch (e) {
  if (e instanceof AuditError) { process.stderr.write(`ERRO: ${e.message}\n`); process.exit(1); }
  throw e;
}
