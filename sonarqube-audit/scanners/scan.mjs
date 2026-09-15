#!/usr/bin/env node
// ============================================================================
// SonarQube Audit Scanner - Cross-platform orchestrator (Node.js)
// ============================================================================
// Single-file, dependency-free (Node stdlib only) replacement for the previous
// bash + python pipeline. Runs identically on Linux, macOS and Windows.
//
// Two layers, merged into one findings.json:
//   1. Deterministic layer  - pure-Node regex over source files (baseline,
//                             always runs; it is the SOURCE OF TRUTH).
//   2. AST layer            - `ast-grep` tree-sitter rules (higher precision;
//                             detects patterns regex cannot, e.g. hard-coded
//                             credentials in assignments, unclosed resources).
// AST findings duplicated against a deterministic finding on file:line:rule are
// dropped - the deterministic layer wins.
//
// Only external tool: `ast-grep` (installed via npm). If missing, scan.mjs
// tries `npm i -g @ast-grep/cli`; if that fails, it runs the deterministic
// layer only and warns.
//
// Usage:  node scan.mjs <project_root> [output_dir]
// Output: <output_dir>/findings.json   (also prints its path on stdout)
// ============================================================================

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const IS_WIN = process.platform === "win32";

// ----------------------------------------------------------------------------
// Args
// ----------------------------------------------------------------------------
const projectArg = process.argv[2];
if (!projectArg) {
  process.stderr.write("Usage: node scan.mjs <project_root> [output_dir]\n");
  process.exit(1);
}
const PROJECT_ROOT = path.resolve(projectArg);
const OUTPUT_DIR = path.resolve(process.argv[3] || PROJECT_ROOT);
const FINDINGS_FILE = path.join(OUTPUT_DIR, "findings.json");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const log = (msg) => process.stderr.write(msg + "\n");

// ----------------------------------------------------------------------------
// Exclusions - vendored libs / build artifacts (ALWAYS applied, git or not).
// ----------------------------------------------------------------------------
const EXCLUDE_DIRS = new Set([
  "node_modules", "bower_components", "vendor", "dist", "build", "target", ".git",
]);
const EXCLUDE_FILE = (name) =>
  /\.min\.(js|css)$/i.test(name) || /^jquery.*\.(js|css)$/i.test(name);

// ----------------------------------------------------------------------------
// Minimal .gitignore support (per-directory, negation-aware). Covers the
// common forms used to ignore build output; not a full git implementation.
// ----------------------------------------------------------------------------
function gitignoreToRegex(pattern) {
  let p = pattern.trim();
  let dirOnly = false;
  let anchored = false;
  if (p.endsWith("/")) { dirOnly = true; p = p.slice(0, -1); }
  if (p.startsWith("/")) { anchored = true; p = p.slice(1); }
  if (!p.includes("/")) {
    // basename match at any depth
    const re = p.replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*\*/g, "\u0000").replace(/\*/g, "[^/]*")
      .replace(/\?/g, "[^/]").replace(/\u0000/g, ".*");
    return { re: new RegExp(`(^|/)${re}$`), dirOnly };
  }
  const re = p.replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "\u0000").replace(/\*/g, "[^/]*")
    .replace(/\?/g, "[^/]").replace(/\u0000/g, ".*");
  return { re: new RegExp(`${anchored ? "^" : "(^|/)"}${re}$`), dirOnly };
}

function loadGitignore(dir) {
  const file = path.join(dir, ".gitignore");
  if (!fs.existsSync(file)) return null;
  const rules = [];
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const negate = line.startsWith("!");
    const pat = negate ? line.slice(1) : line;
    rules.push({ ...gitignoreToRegex(pat), negate });
  }
  return { base: dir, rules };
}

// Returns true if `absPath` is ignored by any active matcher.
function isIgnored(absPath, isDir, matchers) {
  let ignored = false;
  for (const m of matchers) {
    let rel = path.relative(m.base, absPath).split(path.sep).join("/");
    if (rel.startsWith("..")) continue;
    for (const r of m.rules) {
      if (r.dirOnly && !isDir) continue;
      if (r.re.test(rel)) ignored = !r.negate;
    }
  }
  return ignored;
}

// ----------------------------------------------------------------------------
// Deterministic rules (mirror of the former scan-rg.sh).
// exts: file extensions the rule applies to (without dot).
// ----------------------------------------------------------------------------
const RULES = [
  { rule: "S2068", severity: "BLOCKER", category: "security",
    message: "Credencial ou segredo hardcoded no código-fonte",
    exts: ["java","ts","js","jsx","tsx","properties","yml","yaml","env","cfg","conf"],
    re: /(password|passwd|pwd|secret|apikey|api_key|token)\s*[=:]\s*["'][^\s"']{3,}/ },
  { rule: "S5131", severity: "BLOCKER", category: "security",
    message: "Expression Language sem escaping (potencial XSS)",
    exts: ["jsp"], re: /\$\{[^}]+\}/ },
  { rule: "S2115", severity: "BLOCKER", category: "security",
    message: "Senha de banco de dados vazia ou ausente",
    exts: ["properties","yml","yaml","xml","cfg","conf"], re: /password\s*[=:]\s*$/ },
  { rule: "S4830", severity: "BLOCKER", category: "security",
    message: "Verificação de certificado SSL desabilitada",
    exts: ["ts","js","jsx","tsx","env"],
    re: /rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*["']0/ },
  { rule: "S2245", severity: "CRITICAL", category: "security",
    message: "Math.random() não é criptograficamente seguro",
    exts: ["ts","js","jsx","tsx"], re: /Math\.random\s*\(/ },
  { rule: "S2386", severity: "CRITICAL", category: "code-smell",
    message: "Campo mutável public static sem final",
    exts: ["java"], re: /public\s+static\s+(?!final)(List|Map|Set|Array|Collection)/ },
  { rule: "S3330", severity: "CRITICAL", category: "security",
    message: "Cookie sem atributo HttpOnly",
    exts: ["xml","properties","yml","yaml","java","ts","js"],
    re: /httponly\s*=\s*"?false|httpOnly\s*[=:]\s*false/ },
  { rule: "S5122", severity: "CRITICAL", category: "security",
    message: "CORS configurado com wildcard (*)",
    exts: ["java","xml","ts","js","properties","yml","yaml","json"],
    re: /Access-Control-Allow-Origin.*\*|allowedOrigins.*\*|cors.*origin.*\*/ },
  { rule: "S1313", severity: "MAJOR", category: "security",
    message: "Endereço IP hardcoded",
    exts: ["java","ts","js","jsx","tsx","properties","yml","yaml","xml","cfg","conf","jsp"],
    re: /\b([0-9]{1,3}\.){3}[0-9]{1,3}\b/ },
  { rule: "S106", severity: "MAJOR", category: "code-smell",
    message: "Uso de System.out/err ao invés de logger",
    exts: ["java"], re: /System\.(out|err)\.(print|println|printf|format)/ },
  { rule: "S1148", severity: "MAJOR", category: "code-smell",
    message: "Uso de printStackTrace() ao invés de logger",
    exts: ["java"], re: /\.printStackTrace\s*\(/ },
  { rule: "S1186", severity: "MAJOR", category: "code-smell",
    message: "Corpo de método vazio",
    exts: ["java","ts","js","jsx","tsx"], re: /\)\s*\{\s*\}/ },
  { rule: "S6676", severity: "MAJOR", category: "code-smell",
    message: "Uso de console.log (remover antes de produção)",
    exts: ["ts","js","jsx","tsx"], re: /console\.(log|warn|error|info|debug|trace)\s*\(/ },
  { rule: "S2589", severity: "MAJOR", category: "code-smell",
    message: "Condição sempre verdadeira ou falsa",
    exts: ["java","ts","js","jsx","tsx"], re: /\bif\s*\(\s*(true|false)\s*\)/ },
  { rule: "S1128", severity: "MINOR", category: "code-smell",
    message: "Import com wildcard (potencialmente não utilizado)",
    exts: ["java"], re: /import\s+[\w.]+\.\*;/ },
  { rule: "S1135", severity: "INFO", category: "code-smell",
    message: "Comentário TODO/FIXME pendente",
    exts: ["java","ts","js","jsx","tsx","jsp"], re: /\b(TODO|FIXME|HACK|XXX)\b/ },
];

const SCAN_EXTS = new Set(RULES.flatMap((r) => r.exts));

function extOf(name) {
  const dot = name.lastIndexOf(".");
  if (dot < 0) return "";
  return name.slice(dot + 1).toLowerCase();
}

// ----------------------------------------------------------------------------
// Deterministic layer - walk + regex.
// ----------------------------------------------------------------------------
function runDeterministic() {
  const findings = [];
  const rulesByExt = new Map();
  for (const r of RULES) for (const e of r.exts) {
    if (!rulesByExt.has(e)) rulesByExt.set(e, []);
    rulesByExt.get(e).push(r);
  }

  const stack = [{ dir: PROJECT_ROOT, matchers: [] }];
  const rootIgnore = loadGitignore(PROJECT_ROOT);
  if (rootIgnore) stack[0].matchers = [rootIgnore];

  while (stack.length) {
    const { dir, matchers } = stack.pop();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch { continue; }

    const local = loadGitignore(dir);
    const active = local && dir !== PROJECT_ROOT ? [...matchers, local] : matchers;

    for (const ent of entries) {
      const abs = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (EXCLUDE_DIRS.has(ent.name)) continue;
        if (isIgnored(abs, true, active)) continue;
        stack.push({ dir: abs, matchers: active });
      } else if (ent.isFile()) {
        if (EXCLUDE_FILE(ent.name)) continue;
        const ext = extOf(ent.name);
        if (!SCAN_EXTS.has(ext)) continue;
        if (isIgnored(abs, false, active)) continue;
        scanFile(abs, rulesByExt.get(ext) || [], findings);
      }
    }
  }
  return findings;
}

function scanFile(abs, rules, findings) {
  let content;
  try { content = fs.readFileSync(abs, "utf8"); }
  catch { return; }
  const relPath = path.relative(PROJECT_ROOT, abs).split(path.sep).join("/");
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    for (const r of rules) {
      if (r.re.test(line)) {
        findings.push({
          file: relPath,
          line: i + 1,
          rule: r.rule,
          severity: r.severity,
          category: r.category,
          message: r.message,
          match: line.replace(/^\s+/, "").slice(0, 120),
          confidence: "HIGH",
          source: "deterministic",
        });
      }
    }
  }
}

// ----------------------------------------------------------------------------
// ast-grep detection / bootstrap
// ----------------------------------------------------------------------------
function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    shell: IS_WIN, // needed on Windows to resolve .cmd shims (npm, ast-grep)
    ...opts,
  });
}

function hasAstGrep() {
  const r = run("ast-grep", ["--version"]);
  return r.status === 0;
}

function ensureAstGrep() {
  if (hasAstGrep()) return true;
  const npm = run("npm", ["--version"]);
  if (npm.status === 0) {
    log("ast-grep not found. Installing @ast-grep/cli via npm...");
    run("npm", ["i", "-g", "@ast-grep/cli"], { stdio: "ignore" });
    // asdf users need a reshim (Unix only; harmless if absent)
    run("asdf", ["reshim", "nodejs"], { stdio: "ignore" });
    if (hasAstGrep()) return true;
  }
  log("WARNING: ast-grep unavailable - running deterministic layer only.");
  log("         Install it with: npm i -g @ast-grep/cli");
  return false;
}

// ----------------------------------------------------------------------------
// AST layer - run ast-grep and normalize to our finding schema.
// ----------------------------------------------------------------------------
const AST_SEVERITY = { error: "CRITICAL", warning: "MAJOR", info: "INFO", hint: "MINOR" };
const VALID_SEVERITIES = new Set(["BLOCKER","CRITICAL","MAJOR","MINOR","INFO"]);

// ast-grep does NOT emit rule metadata in --json output, so we recover
// sonar_rule/severity/category by parsing the rule files ourselves.
function loadRuleMetadata() {
  const meta = new Map();
  const rulesRoot = path.join(SCRIPT_DIR, "sg-rules");
  const files = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".yml") || e.name.endsWith(".yaml")) files.push(p);
    }
  })(rulesRoot);

  for (const f of files) {
    const docs = fs.readFileSync(f, "utf8").split(/^---\s*$/m);
    for (const doc of docs) {
      const id = /^id:\s*(\S+)/m.exec(doc);
      if (!id) continue;
      const msg = /^message:\s*(.+)$/m.exec(doc);
      // scope to the metadata: block to avoid the top-level `severity:` key
      const mBlock = /^metadata:\s*\n((?:[ \t]+.*\n?)*)/m.exec(doc);
      const block = mBlock ? mBlock[1] : "";
      const sonar = /sonar_rule:\s*(\S+)/.exec(block);
      const sev = /severity:\s*(\S+)/.exec(block);
      const cat = /category:\s*(\S+)/.exec(block);
      meta.set(id[1], {
        sonar_rule: sonar ? sonar[1] : null,
        severity: sev ? sev[1] : null,
        category: cat ? cat[1] : "code-smell",
        message: msg ? msg[1].replace(/^["']|["']$/g, "").trim() : "",
      });
    }
  }
  return meta;
}

function runAst() {
  const config = path.join(SCRIPT_DIR, "sgconfig.yml");
  const globs = [
    "!**/node_modules/**","!**/bower_components/**","!**/vendor/**","!**/dist/**",
    "!**/build/**","!**/target/**","!**/.git/**","!**/*.min.js","!**/*.min.css","!**/jquery*",
  ];
  const args = ["scan", "--config", config];
  for (const g of globs) args.push("--globs", g);
  args.push("--json", PROJECT_ROOT);

  // ast-grep exits non-zero when it finds error-level matches; that is not a
  // failure for us. We only care that stdout parses as a JSON array.
  const r = run("ast-grep", args, { stdio: ["ignore", "pipe", "ignore"] });
  let raw = [];
  try { raw = JSON.parse(r.stdout || "[]"); }
  catch { raw = []; }
  if (!Array.isArray(raw)) raw = [];

  const meta = loadRuleMetadata();
  const root = PROJECT_ROOT.split(path.sep).join("/").replace(/\/$/, "") + "/";
  return raw.map((item) => {
    const md = meta.get(item.ruleId) || {};
    const sonar = md.sonar_rule || (/(S\d+)/.exec(item.ruleId || "")?.[1]) || item.ruleId || "UNKNOWN";
    let severity = md.severity;
    if (!VALID_SEVERITIES.has(severity)) severity = AST_SEVERITY[item.severity] || "MAJOR";
    let file = (item.file || "").split(path.sep).join("/");
    if (file.startsWith(root)) file = file.slice(root.length);
    const line = ((item.range?.start?.line ?? 0) | 0) + 1;
    return {
      file,
      line,
      rule: sonar,
      severity,
      category: md.category || "code-smell",
      message: md.message || item.message || "",
      match: (item.lines || "").trim().replace(/\n/g, " ").slice(0, 120),
      confidence: "HIGH",
      source: "ast",
    };
  });
}

// ----------------------------------------------------------------------------
// Merge + summary
// ----------------------------------------------------------------------------
function buildSummary(findings) {
  const s = { BLOCKER: 0, CRITICAL: 0, MAJOR: 0, MINOR: 0, INFO: 0 };
  for (const f of findings) if (f.severity in s) s[f.severity]++;
  s.total = findings.length;
  return s;
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
const deterministic = runDeterministic();
log(`deterministic scan complete: ${deterministic.length} findings`);

let astFindings = [];
let astTool = "none";
if (ensureAstGrep()) {
  astFindings = runAst();
  astTool = "ast-grep";
}

const findings = [...deterministic];
const seen = new Set(findings.map((f) => `${f.file}\u0000${f.line}\u0000${f.rule}`));
let astAdded = 0;
for (const f of astFindings) {
  const key = `${f.file}\u0000${f.line}\u0000${f.rule}`;
  if (seen.has(key)) continue;
  seen.add(key);
  findings.push(f);
  astAdded++;
}

const output = {
  meta: {
    tool: "node",
    ast_tool: astTool,
    ast_findings_added: astAdded,
    timestamp: new Date().toISOString(),
    project_root: PROJECT_ROOT,
  },
  findings,
  summary: buildSummary(findings),
};

fs.writeFileSync(FINDINGS_FILE, JSON.stringify(output, null, 2), "utf8");
const s = output.summary;
log(`merge complete: ${findings.length} findings (${deterministic.length} deterministic + ${astAdded} ast)`);
log(`summary: ${s.BLOCKER} BLOCKER, ${s.CRITICAL} CRITICAL, ${s.MAJOR} MAJOR, ${s.MINOR} MINOR, ${s.INFO} INFO`);
log(`Scan complete: ${FINDINGS_FILE}`);
process.stdout.write(FINDINGS_FILE + "\n");
