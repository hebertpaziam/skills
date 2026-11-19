// Utilitários compartilhados: processos, logging, varredura de arquivos com .gitignore.
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { EXCLUDE_DIRS } from "./config.mjs";

const IS_WIN = process.platform === "win32";

export const log = (msg) => process.stderr.write(`[sonarqube-audit] ${msg}\n`);

export class AuditError extends Error {}

export function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    shell: IS_WIN, // resolve shims .cmd (npm/npx) no Windows
    ...opts,
  });
}

// fetch com timeout "referenciado": AbortSignal.timeout é unref e deixava o Node sair (exit 13) com a requisição pendente.
export async function fetchWithTimeout(url, init = {}, ms = 60000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try { return await fetch(url, { ...init, signal: ac.signal }); } finally { clearTimeout(t); }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const sha1 = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);
export const toPosix = (p) => p.split(path.sep).join("/");

export function sanitizeKey(name) {
  return name.replace(/[^A-Za-z0-9_.:-]/g, "-").replace(/^-+|-+$/g, "") || "project";
}

// "1h30min" | "45min" | "2d" -> minutos (dia = 8h, como no Sonar).
export function effortToMinutes(effort) {
  if (!effort) return null;
  let total = 0;
  for (const [, n, unit] of String(effort).matchAll(/(\d+)\s*(d|h|min)/g)) {
    total += Number(n) * (unit === "d" ? 480 : unit === "h" ? 60 : 1);
  }
  return total || null;
}

export function formatMinutes(min) {
  if (!min) return "0min";
  const d = Math.floor(min / 480), h = Math.floor((min % 480) / 60), m = min % 60;
  return [d && `${d}d`, h && `${h}h`, m && `${m}min`].filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// .gitignore mínimo (por diretório, com negação). Cobre as formas comuns.
// ---------------------------------------------------------------------------
function globToRegex(p) {
  return p.replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "\u0000").replace(/\*/g, "[^/]*")
    .replace(/\?/g, "[^/]").replace(/\u0000/g, ".*");
}

export function parseGitignore(dir) {
  const file = path.join(dir, ".gitignore");
  if (!fs.existsSync(file)) return null;
  const rules = [];
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    let line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const negate = line.startsWith("!");
    if (negate) line = line.slice(1);
    const dirOnly = line.endsWith("/");
    if (dirOnly) line = line.slice(0, -1);
    const anchored = line.startsWith("/") || line.slice(0, -1).includes("/");
    if (line.startsWith("/")) line = line.slice(1);
    const re = new RegExp(`${anchored ? "^" : "(^|/)"}${globToRegex(line)}(/|$)`);
    rules.push({ re, dirOnly, negate, raw: line });
  }
  return { base: dir, rules };
}

function isIgnored(abs, isDir, matchers) {
  let ignored = false;
  for (const m of matchers) {
    const rel = toPosix(path.relative(m.base, abs));
    if (rel.startsWith("..")) continue;
    for (const r of m.rules) {
      if (r.dirOnly && !isDir && !rel.includes("/")) continue;
      if (r.re.test(rel)) ignored = !r.negate;
    }
  }
  return ignored;
}

const BINARY_EXT = new Set(["class","jar","war","ear","zip","gz","rar","png","jpg","jpeg","gif","svg","ico","bmp","woff","woff2","ttf","eot","pyc","o","so","dll","pdf","lock"]);
const VENDORED = (n) => /\.min\.(js|css)$/i.test(n) || /^jquery.*\.(js|css)$/i.test(n);

// Lista arquivos de texto elegíveis (relativos, '/'), respeitando .gitignore.
export function listProjectFiles(root) {
  const out = [];
  const stack = [{ dir: root, matchers: [] }];
  while (stack.length) {
    const { dir, matchers } = stack.pop();
    const local = parseGitignore(dir);
    const active = local ? [...matchers, local] : matchers;
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const ent of entries) {
      const abs = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (EXCLUDE_DIRS.includes(ent.name) || isIgnored(abs, true, active)) continue;
        stack.push({ dir: abs, matchers: active });
      } else if (ent.isFile()) {
        const ext = path.extname(ent.name).slice(1).toLowerCase();
        if (BINARY_EXT.has(ext) || VENDORED(ent.name) || isIgnored(abs, false, active)) continue;
        out.push(toPosix(path.relative(root, abs)));
      }
    }
  }
  return out.sort();
}

// Converte o .gitignore da raiz em globs de `sonar.exclusions` (melhor esforço).
export function gitignoreToSonarExclusions(root) {
  const gi = parseGitignore(root);
  if (!gi) return [];
  const globs = [];
  for (const r of gi.rules) {
    if (r.negate) continue;
    const p = r.raw;
    if (p.includes("/")) globs.push(`${p}/**`, p);
    else globs.push(`**/${p}/**`, `**/${p}`);
  }
  return [...new Set(globs)];
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
