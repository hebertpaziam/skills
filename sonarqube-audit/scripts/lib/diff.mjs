// Diff por issue, derivado do histórico do próprio SonarQube (sem arquivos de estado):
//   ✅ corrigida = fechada (FIXED) depois da análise anterior
//   ➖ N/A       = fechada por REMOVED (arquivo/componente removido)
//   ❌ persiste  = aberta e criada até a análise anterior
//   🆕 nova      = aberta e criada depois da análise anterior
import { parseSonarDate } from "./sonar-api.mjs";

// data.history: undefined = modo sem histórico (aproximado) | null = primeira análise | { baseline, closed }
export function computeDiff(data) {
  const h = data.history;
  if (h === undefined) return { skipped: "o modo aproximado não mantém histórico entre execuções" };
  if (h === null) return null;

  const base = parseSonarDate(h.baseline);
  const status = new Map();
  let persist = 0, novas = 0;
  for (const i of data.issues) {
    const old = i.creationDate && parseSonarDate(i.creationDate) <= base;
    status.set(i.key, old ? "persiste" : "nova");
    old ? persist++ : novas++;
  }
  const corrigidas = h.closed.filter((x) => x.resolution === "FIXED");
  const na = h.closed.filter((x) => x.resolution === "REMOVED");
  return { status, corrigidas, na, baseline: h.baseline, counts: { corrigidas: corrigidas.length, persistem: persist, na: na.length, novas } };
}
