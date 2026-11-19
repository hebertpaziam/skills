// Ciclo de vida do SonarQube Community e do scanner via Docker.
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import {
  CONTAINER_NAME, DEFAULT_PORT, NETWORK_NAME, SCANNER_IMAGE, SONAR_IMAGE,
  STARTUP_TIMEOUT_MS, VOLUMES, WORK_ROOT,
} from "./config.mjs";
import { AuditError, fetchWithTimeout, gitignoreToSonarExclusions, log, run, sleep } from "./util.mjs";
import { EXCLUDE_DIRS, EXCLUDE_FILE_GLOBS } from "./config.mjs";

const docker = (...args) => run("docker", args);

// -> { ok, reason }
export function dockerStatus() {
  const r = docker("info", "--format", "{{.ServerVersion}}");
  if (r.error) return { ok: false, reason: "docker não encontrado no PATH" };
  if (r.status === 0) return { ok: true };
  const err = `${r.stderr || ""}`;
  if (/permission denied/i.test(err)) {
    return { ok: false, reason: "sem permissão no socket do Docker (adicione o usuário ao grupo `docker` ou use sudo)" };
  }
  return { ok: false, reason: "daemon do Docker não está em execução" };
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const s = net.createServer().once("error", () => resolve(false))
      .once("listening", () => s.close(() => resolve(true))).listen(port, "127.0.0.1");
  });
}

async function pickPort(preferred) {
  if (await isPortFree(preferred)) return preferred;
  return new Promise((resolve, reject) => {
    const s = net.createServer().once("error", reject).listen(0, "127.0.0.1", () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });
}

function containerState() {
  const r = docker("inspect", "--format", "{{.State.Running}}|{{(index (index .HostConfig.PortBindings \"9000/tcp\") 0).HostPort}}", CONTAINER_NAME);
  if (r.status !== 0) return null;
  const [running, port] = r.stdout.trim().split("|");
  return { running: running === "true", port: Number(port) || null };
}

export async function fetchStatus(baseUrl) {
  try {
    const res = await fetchWithTimeout(`${baseUrl}/api/system/status`, {}, 5000);
    return (await res.json()).status;
  } catch { return null; }
}

// Garante o container rodando e `UP`. Retorna { baseUrl, port, startedByUs }.
export async function ensureServer(preferredPort = DEFAULT_PORT) {
  docker("network", "create", NETWORK_NAME); // idempotente (falha se já existe)
  let st = containerState();
  let port;
  let startedByUs = false;

  if (st?.running) {
    port = st.port;
  } else if (st) {
    log("iniciando container SonarQube existente...");
    const r = docker("start", CONTAINER_NAME);
    if (r.status === 0) {
      port = st.port;
      startedByUs = true;
    } else if (/port is already allocated|address already in use/i.test(r.stderr || "")) {
      // porta original ocupada: recria o container (os volumes nomeados preservam os dados) em porta livre
      log(`porta ${st.port} ocupada; recriando o container em outra porta...`);
      docker("rm", "-f", CONTAINER_NAME);
      st = null;
    } else {
      throw new AuditError(`falha ao iniciar o container: ${r.stderr}`);
    }
  }
  if (!st) {
    port = await pickPort(preferredPort);
    log(`criando container SonarQube Community (${SONAR_IMAGE}) na porta ${port}; o primeiro uso baixa a imagem e demora...`);
    const r = docker(
      "run", "-d", "--name", CONTAINER_NAME, "--network", NETWORK_NAME,
      "-p", `127.0.0.1:${port}:9000`,
      "-e", "SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true",
      "-v", `${VOLUMES.data}:/opt/sonarqube/data`,
      "-v", `${VOLUMES.extensions}:/opt/sonarqube/extensions`,
      "-v", `${VOLUMES.logs}:/opt/sonarqube/logs`,
      SONAR_IMAGE,
    );
    if (r.status !== 0) throw new AuditError(`falha ao criar o container: ${r.stderr}`);
    startedByUs = true;
  }

  const baseUrl = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const status = await fetchStatus(baseUrl);
    if (status === "UP") return { baseUrl, port, startedByUs };
    if (status === "DB_MIGRATION_NEEDED") {
      await fetchWithTimeout(`${baseUrl}/api/system/migrate_db`, { method: "POST" }, 10000).catch(() => {});
    }
    const s = containerState();
    if (!s?.running) throw serverFailure("o container encerrou antes de ficar UP");
    await sleep(3000);
  }
  throw serverFailure("timeout aguardando o SonarQube ficar UP");
}

function serverFailure(reason) {
  const logs = docker("logs", "--tail", "30", CONTAINER_NAME);
  return new AuditError(
    `${reason}.\nÚltimos logs:\n${(logs.stdout || "") + (logs.stderr || "")}\n` +
    "Dica: o Elasticsearch embutido exige `vm.max_map_count >= 262144` no host " +
    "(Linux/WSL2: `sudo sysctl -w vm.max_map_count=262144`) e ~2-4 GB de RAM livres.",
  );
}

export function stopServer() {
  docker("stop", CONTAINER_NAME);
}

// ---------------------------------------------------------------------------
// Scanner
// ---------------------------------------------------------------------------
function findJavaBinaries(root) {
  const candidates = ["target/classes", "build/classes/java/main", "build/classes", "out/production"];
  return candidates.filter((c) => fs.existsSync(path.join(root, c)));
}

// Executa o scanner; retorna { ceTaskId, javaBinaries: "project"|"empty"|"n/a" }.
export function runScanner({ projectRoot, projectKey, token, hasJava }) {
  const binaries = findJavaBinaries(projectRoot);
  const mounts = [
    "--mount", `type=bind,src=${projectRoot},dst=/usr/src,readonly`,
  ];
  const props = [
    `-Dsonar.projectKey=${projectKey}`,
    "-Dsonar.sources=.",
    "-Dsonar.sourceEncoding=UTF-8",
    "-Dsonar.scm.disabled=true",
    "-Dsonar.working.directory=/tmp/.scannerwork",
    `-Dsonar.host.url=http://${CONTAINER_NAME}:9000`,
  ];
  const exclusions = [
    ...EXCLUDE_DIRS.map((d) => `**/${d}/**`),
    ...EXCLUDE_FILE_GLOBS,
    ...gitignoreToSonarExclusions(projectRoot),
  ];
  props.push(`-Dsonar.exclusions=${exclusions.join(",")}`);

  let javaBinaries = "n/a";
  if (hasJava) {
    if (binaries.length) {
      props.push(`-Dsonar.java.binaries=${binaries.map((b) => `/usr/src/${b}`).join(",")}`);
      javaBinaries = "project";
    } else {
      const empty = path.join(WORK_ROOT, "empty-bin");
      fs.mkdirSync(empty, { recursive: true });
      mounts.push("--mount", `type=bind,src=${empty},dst=/opt/empty-bin,readonly`);
      props.push("-Dsonar.java.binaries=/opt/empty-bin");
      javaBinaries = "empty";
    }
  }

  log("executando sonar-scanner (pode levar alguns minutos)...");
  const r = docker(
    "run", "--rm", "--network", NETWORK_NAME,
    "-e", `SONAR_TOKEN=${token}`,
    ...mounts, SCANNER_IMAGE, ...props,
  );
  const out = `${r.stdout || ""}\n${r.stderr || ""}`;
  if (r.status !== 0) {
    throw new AuditError(`sonar-scanner falhou (código ${r.status}):\n${out.split("\n").slice(-25).join("\n")}`);
  }
  const m = /api\/ce\/task\?id=([\w-]+)/.exec(out);
  return { ceTaskId: m ? m[1] : null, javaBinaries };
}
