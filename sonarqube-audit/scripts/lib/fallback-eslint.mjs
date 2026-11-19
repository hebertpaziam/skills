// Modo aproximado: eslint-plugin-sonarjs sobre JS/TS. Nunca instala globalmente.
import fs from "node:fs";
import path from "node:path";
import { WORK_ROOT } from "./config.mjs";
import { AuditError, listProjectFiles, log, run } from "./util.mjs";
import { addFingerprints } from "./normalize.mjs";

export const JS_TS_EXT = new Set(["js", "jsx", "mjs", "cjs", "ts", "tsx"]);

// sonarjs/<regra> -> [código Sonar, severidade, tipo, hotspot?]
const MAP = {
  "cognitive-complexity": ["S3776", "CRITICAL", "CODE_SMELL"],
  "no-duplicate-string": ["S1192", "CRITICAL", "CODE_SMELL"],
  "no-identical-functions": ["S4144", "MAJOR", "CODE_SMELL"],
  "no-collapsible-if": ["S1066", "MAJOR", "CODE_SMELL"],
  "no-small-switch": ["S1301", "MINOR", "CODE_SMELL"],
  "no-redundant-boolean": ["S1125", "MINOR", "CODE_SMELL"],
  "no-inverted-boolean-check": ["S1940", "MINOR", "CODE_SMELL"],
  "prefer-immediate-return": ["S1488", "MINOR", "CODE_SMELL"],
  "no-nested-template-literals": ["S4624", "MAJOR", "CODE_SMELL"],
  "no-gratuitous-expressions": ["S2589", "MAJOR", "CODE_SMELL"],
  "no-all-duplicated-branches": ["S3923", "MAJOR", "BUG"],
  "no-identical-conditions": ["S1862", "MAJOR", "BUG"],
  "no-identical-expressions": ["S1764", "MAJOR", "BUG"],
  "no-empty-collection": ["S4158", "MAJOR", "BUG"],
  "no-unused-collection": ["S4030", "MAJOR", "CODE_SMELL"],
  "no-use-of-empty-return-value": ["S3699", "CRITICAL", "BUG"],
  "no-ignored-return": ["S2201", "MAJOR", "BUG"],
  "no-redundant-jump": ["S3626", "MINOR", "CODE_SMELL"],
  "no-same-line-conditional": ["S3972", "MAJOR", "CODE_SMELL"],
  "no-element-overwrite": ["S4143", "MAJOR", "BUG"],
  "no-hardcoded-passwords": ["S2068", "BLOCKER", "HOTSPOT"],
  "no-hardcoded-secrets": ["S6418", "BLOCKER", "HOTSPOT"],
  "pseudo-random": ["S2245", "CRITICAL", "HOTSPOT"],
  "no-ip": ["S1313", "MINOR", "HOTSPOT"],
};
const PROB = { BLOCKER: "HIGH", CRITICAL: "HIGH", MAJOR: "MEDIUM", MINOR: "LOW", INFO: "LOW" };

const CONFIG = `import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";
export default [{
  files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
  languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } },
  linterOptions: { reportUnusedDisableDirectives: "off" },
  plugins: { sonarjs },
  rules: { ...sonarjs.configs.recommended.rules },
}];
`;

function ensureToolchain() {
  const dir = path.join(WORK_ROOT, "eslint-env");
  fs.mkdirSync(dir, { recursive: true });
  const bin = path.join(dir, "node_modules", "eslint", "bin", "eslint.js");
  if (!fs.existsSync(bin)) {
    log("instalando eslint + eslint-plugin-sonarjs em diretório temporário (sem instalação global)...");
    fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ name: "sonarqube-audit-eslint", private: true, type: "module" }));
    const r = run("npm", ["install", "--prefix", dir, "--no-audit", "--no-fund", "--loglevel=error",
      "eslint@^9", "eslint-plugin-sonarjs", "typescript-eslint", "typescript"]);
    if (r.status !== 0 || !fs.existsSync(bin)) {
      throw new AuditError(`falha ao instalar o toolchain do modo aproximado:\n${(r.stderr || "").slice(-600)}`);
    }
  }
  const cfg = path.join(dir, "eslint.config.mjs");
  fs.writeFileSync(cfg, CONFIG);
  return { bin, cfg };
}

export function detectLanguages(projectRoot) {
  const files = listProjectFiles(projectRoot);
  const counts = {};
  for (const f of files) {
    const ext = path.extname(f).slice(1).toLowerCase() || "(sem extensão)";
    counts[ext] = (counts[ext] || 0) + 1;
  }
  return { files, counts };
}

export function runEslintFallback(projectRoot, files) {
  const targets = files.filter((f) => JS_TS_EXT.has(path.extname(f).slice(1).toLowerCase()));
  if (!targets.length) throw new AuditError("o modo aproximado só analisa JS/TS e o projeto não possui esses arquivos");
  const { bin, cfg } = ensureToolchain();

  const issues = [];
  const hotspots = [];
  for (let i = 0; i < targets.length; i += 80) {
    const chunk = targets.slice(i, i + 80);
    const r = run(process.execPath, [bin, "--config", cfg, "--format", "json", "--no-warn-ignored", ...chunk],
      { cwd: projectRoot, shell: false });
    let report;
    try { report = JSON.parse(r.stdout); } catch {
      throw new AuditError(`falha ao executar o ESLint:\n${(r.stderr || r.stdout || "").slice(-600)}`);
    }
    for (const res of report) {
      const file = path.relative(projectRoot, res.filePath).split(path.sep).join("/");
      for (const m of res.messages) {
        if (!m.ruleId || !m.ruleId.startsWith("sonarjs/")) continue; // ignora erros de parse
        const name = m.ruleId.slice("sonarjs/".length);
        const [code, severity, type] = MAP[name] || [m.ruleId, "MAJOR", "CODE_SMELL"];
        const base = { rule: code, file, line: m.line ?? null, message: m.message, source: "eslint-sonarjs", eslintRule: m.ruleId };
        if (type === "HOTSPOT") {
          hotspots.push({ key: null, ...base, category: null, probability: PROB[severity], severity, status: "TO_REVIEW" });
        } else {
          issues.push({ key: null, ...base, type, severity, impacts: [], status: "OPEN", effort: null, effortMinutes: null });
        }
      }
    }
  }
  addFingerprints(issues);
  addFingerprints(hotspots);
  for (const x of [...issues, ...hotspots]) x.key = `fb:${x.fingerprint}`;
  return { issues, hotspots, analyzedFiles: targets.length };
}
