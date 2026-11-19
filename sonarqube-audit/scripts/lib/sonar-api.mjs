// Cliente da API web do SonarQube (fetch nativo, Node >= 18).
import fs from "node:fs";
import crypto from "node:crypto";
import { ANALYSIS_TIMEOUT_MS, CONFIG_DIR, CREDENTIALS_FILE } from "./config.mjs";
import { AuditError, fetchWithTimeout, log, sleep } from "./util.mjs";

const PAGE = 500;

// "2026-11-19T15:52:57+0000" -> epoch ms
export const parseSonarDate = (d) => Date.parse(String(d).replace(/([+-]\d\d)(\d\d)$/, "$1:$2"));
const MAX_WINDOW = 10000;

export class SonarClient {
  constructor(baseUrl, auth) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.auth = auth; // { token } | { login, password }
  }

  headers() {
    if (this.auth.token) return { Authorization: `Bearer ${this.auth.token}` };
    const b = Buffer.from(`${this.auth.login}:${this.auth.password}`).toString("base64");
    return { Authorization: `Basic ${b}` };
  }

  async request(method, pathname, params = {}, { raw = false, allow = [] } = {}) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null) qs.set(k, String(v));
    const isGet = method === "GET";
    const url = `${this.baseUrl}${pathname}${isGet && qs.size ? `?${qs}` : ""}`;
    let res;
    for (let attempt = 1; ; attempt++) {
      try {
        res = await fetchWithTimeout(url, {
          method,
          headers: { ...this.headers(), ...(isGet ? {} : { "Content-Type": "application/x-www-form-urlencoded" }) },
          body: isGet ? undefined : qs.toString(),
        }, 60000);
        break;
      } catch (e) { // falha de rede transitória (ex.: "other side closed" durante o processamento do CE)
        if (attempt >= 4) throw new AuditError(`falha de rede em ${method} ${pathname}: ${e.cause?.code || e.message}`);
        await sleep(1500 * attempt);
      }
    }
    if (!res.ok && !allow.includes(res.status)) {
      throw new AuditError(`SonarQube API ${method} ${pathname} -> HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    if (raw) return res;
    const text = await res.text();
    try { return text ? JSON.parse(text) : {}; } catch { return { _text: text, _status: res.status }; }
  }

  get(p, params, opts) { return this.request("GET", p, params, opts); }
  post(p, params, opts) { return this.request("POST", p, params, opts); }

  async version() {
    const res = await this.get("/api/server/version", {}, { raw: true });
    return (await res.text()).trim();
  }

  // ----- coleta -----------------------------------------------------------
  async fetchIssues(projectKey) {
    const byKey = new Map();
    const base = { componentKeys: projectKey, resolved: "false" };
    const head = await this.get("/api/issues/search", { ...base, ps: 1 });
    await this.collect(base, ["severities", "types", "rules", "files"], byKey);
    const truncated = byKey.size < head.paging.total;
    if (truncated) log(`AVISO: coletadas ${byKey.size} de ${head.paging.total} issues (particionamento incompleto)`);
    return { issues: [...byKey.values()], total: head.paging.total, truncated };
  }

  // Pagina; se total > 10k, particiona pela próxima dimensão usando facets.
  async collect(filters, dims, byKey) {
    const first = await this.get("/api/issues/search", { ...filters, ps: PAGE, p: 1, facets: dims[0] });
    if (first.paging.total <= MAX_WINDOW) {
      for (const i of first.issues) byKey.set(i.key, i);
      for (let p = 2; (p - 1) * PAGE < first.paging.total; p++) {
        const page = await this.get("/api/issues/search", { ...filters, ps: PAGE, p });
        for (const i of page.issues) byKey.set(i.key, i);
      }
      return;
    }
    if (!dims.length) throw new AuditError("não foi possível particionar a consulta de issues abaixo de 10.000 resultados");
    const [dim, ...rest] = dims;
    const facet = first.facets?.find((f) => f.property === dim);
    const values = (facet?.values || []).map((v) => v.val);
    if (!values.length) return this.collect(filters, rest, byKey);
    const param = dim === "files" ? "files" : dim;
    log(`particionando issues por ${dim} (${values.length} valores)`);
    for (const v of values) await this.collect({ ...filters, [param]: v }, rest, byKey);
  }

  async fetchHotspots(projectKey) {
    const out = [];
    for (let p = 1; ; p++) {
      const page = await this.get("/api/hotspots/search", { project: projectKey, ps: PAGE, p, status: "TO_REVIEW" });
      out.push(...page.hotspots);
      if (p * PAGE >= page.paging.total) break;
    }
    return out;
  }

  async ruleInfo(key) {
    const r = await this.get("/api/rules/show", { key }, { allow: [404] });
    if (!r.rule) return null;
    const text = (r.rule.mdDesc || r.rule.htmlDesc || (r.rule.descriptionSections || []).map((s) => s.content).join("\n") || "")
      .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 600);
    return { name: r.rule.name, type: r.rule.type, description: text };
  }

  async measures(projectKey) {
    const r = await this.get("/api/measures/component", { component: projectKey, metricKeys: "files,ncloc,ncloc_language_distribution" }, { allow: [404] });
    const m = {};
    for (const x of r.component?.measures || []) m[x.metric] = x.value;
    return m;
  }

  async lastAnalysisDate(projectKey) {
    const r = await this.get("/api/project_analyses/search", { project: projectKey, ps: 1 }, { allow: [404] });
    return r.analyses?.[0]?.date || null;
  }

  // Datas das análises, da mais recente para a mais antiga.
  async analysisDates(projectKey, ps = 2) {
    const r = await this.get("/api/project_analyses/search", { project: projectKey, ps }, { allow: [404] });
    return (r.analyses || []).map((a) => a.date);
  }

  // Issues fechadas (FIXED/REMOVED) depois de `sinceMs`; pára de paginar ao passar do baseline.
  async fetchClosedSince(projectKey, sinceMs) {
    const out = [];
    for (let p = 1; ; p++) {
      const page = await this.get("/api/issues/search", {
        componentKeys: projectKey, resolved: "true", resolutions: "FIXED,REMOVED",
        s: "CLOSE_DATE", asc: "false", ps: PAGE, p,
      });
      let older = false;
      for (const i of page.issues) {
        if (i.closeDate && parseSonarDate(i.closeDate) > sinceMs) out.push(i); else older = true;
      }
      if (older || p * PAGE >= page.paging.total) break;
    }
    return out;
  }

  async waitForTask(ceTaskId) {
    const deadline = Date.now() + ANALYSIS_TIMEOUT_MS;
    while (Date.now() < deadline) {
      const { task } = await this.get("/api/ce/task", { id: ceTaskId });
      if (task.status === "SUCCESS") return;
      if (task.status === "FAILED" || task.status === "CANCELED") {
        throw new AuditError(`processamento do relatório no SonarQube terminou com status ${task.status}`);
      }
      await sleep(2000);
    }
    throw new AuditError("timeout aguardando o processamento da análise no SonarQube");
  }

  async waitForProjectIdle(projectKey) {
    const deadline = Date.now() + ANALYSIS_TIMEOUT_MS;
    while (Date.now() < deadline) {
      const r = await this.get("/api/ce/component", { component: projectKey });
      if (!r.queue?.length && r.current?.status === "SUCCESS") return;
      if (r.current?.status === "FAILED") throw new AuditError("processamento da análise falhou no SonarQube");
      await sleep(2000);
    }
    throw new AuditError("timeout aguardando o processamento da análise no SonarQube");
  }
}

// ---------------------------------------------------------------------------
// Credenciais do SonarQube local (fora do repositório do projeto).
// ---------------------------------------------------------------------------
function readCreds() {
  try { return JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf8")); } catch { return {}; }
}

function writeCreds(c) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(c, null, 2), { mode: 0o600 });
}

// Bootstrap idempotente: senha admin, token e projeto. Retorna { token }.
export async function bootstrap(baseUrl, projectKey, projectName) {
  const creds = readCreds();
  let password = creds.password;
  let client = new SonarClient(baseUrl, { login: "admin", password: password || "admin" });

  const valid = async (c) => (await c.get("/api/authentication/validate", {}, { allow: [401] })).valid === true;

  if (!(password && (await valid(client)))) {
    const def = new SonarClient(baseUrl, { login: "admin", password: "admin" });
    if (await valid(def)) {
      password = `${crypto.randomBytes(18).toString("base64url")}aA1!`;
      await def.post("/api/users/change_password", { login: "admin", previousPassword: "admin", password });
      writeCreds({ ...creds, password });
      client = new SonarClient(baseUrl, { login: "admin", password });
      log("senha padrão do admin trocada (credenciais em ~/.config/sonarqube-audit/)");
    } else {
      throw new AuditError(
        "não foi possível autenticar como admin no SonarQube local (senha padrão alterada e credencial salva inválida).\n" +
        "Remova o container e os volumes `sonarqube-audit-*` (docker rm -f sonarqube-audit-server; docker volume rm sonarqube-audit-data sonarqube-audit-extensions sonarqube-audit-logs) e rode novamente.",
      );
    }
  }

  await client.post("/api/projects/create", { project: projectKey, name: projectName }, { allow: [400] });
  await client.post("/api/user_tokens/revoke", { name: "sonarqube-audit" }, { allow: [400, 404] });
  const gen = await client.post("/api/user_tokens/generate", { name: "sonarqube-audit", type: "USER_TOKEN" });
  return { token: gen.token };
}
