// Normaliza issues/hotspots do Sonar (ou do fallback) para o schema de issues.json.
import { effortToMinutes, sha1 } from "./util.mjs";

const PROB_TO_SEV = { HIGH: "CRITICAL", MEDIUM: "MAJOR", LOW: "MINOR" };

// "projeto:src/Foo.java" -> "src/Foo.java"
function fileOf(component, projectKey) {
  if (!component) return null;
  return component.startsWith(`${projectKey}:`) ? component.slice(projectKey.length + 1) : component;
}

// fingerprint estável entre execuções: regra + arquivo + mensagem + ocorrência.
export function addFingerprints(list) {
  const seen = new Map();
  for (const i of list) {
    const base = `${i.rule}|${i.file}|${i.message}`;
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    i.fingerprint = sha1(`${base}|${n}`);
  }
  return list;
}

export function normalizeSonar({ issues, hotspots, projectKey }) {
  const normIssues = issues.map((i) => ({
    key: i.key,
    rule: i.rule,
    type: i.type,
    severity: i.severity,
    impacts: (i.impacts || []).map((x) => ({ quality: x.softwareQuality, severity: x.severity })),
    status: i.issueStatus || i.status,
    file: fileOf(i.component, projectKey),
    line: i.line ?? null,
    message: i.message,
    effort: i.effort || null,
    effortMinutes: effortToMinutes(i.effort),
    creationDate: i.creationDate || null,
    source: "sonarqube",
  }));
  const normHotspots = hotspots.map((h) => ({
    key: h.key,
    rule: h.ruleKey,
    category: h.securityCategory,
    probability: h.vulnerabilityProbability,
    severity: PROB_TO_SEV[h.vulnerabilityProbability] || "MAJOR",
    status: h.status,
    file: fileOf(h.component, projectKey),
    line: h.line ?? null,
    message: h.message,
    source: "sonarqube",
  }));
  addFingerprints(normIssues);
  addFingerprints(normHotspots);
  return { issues: normIssues, hotspots: normHotspots };
}
