// Renderiza o relatório Markdown (formato em references/report-template.md).
import { formatMinutes } from "./util.mjs";
import { SCANNER_IMAGE, SEVERITIES } from "./config.mjs";

const SEV_ICON = { BLOCKER: "🔴", CRITICAL: "🟠", MAJOR: "🟡", MINOR: "🔵", INFO: "⚪" };
const SEV_MEANING = {
  BLOCKER: "Bugs ou vulnerabilidades que podem causar falhas em produção",
  CRITICAL: "Problemas de segurança ou bugs com alto impacto",
  MAJOR: "Code smells significativos que dificultam manutenção",
  MINOR: "Pequenos desvios de convenção ou boas práticas",
  INFO: "Sugestões de melhoria e observações",
};
const EMPTY = "Nenhuma violação encontrada nesta fase.";

// Texto padrão (sem enriquecimento do LLM) para regras com falso positivo conhecido.
const RULE_HINTS = {
  "Web:S5256": "Verifique primeiro se os `<th>` já existem em conteúdo projetado (`<ng-content>`/slot) ou em outro template: o Sonar analisa o arquivo isolado e não os vê — nesse caso é falso positivo (marcar como \"False Positive\"). Se não existirem, incluir `<th scope>`. Use `role=\"presentation\"` somente se o `<table>` for de layout, nunca em tabela de dados.",
};

const PHASES = [
  { n: 1, icon: "🔴", title: "Correções Urgentes e Rápidas", desc: "🔴🟠 BLOCKER + CRITICAL | ⚡ Esforço ≤ 5min por item", sev: ["BLOCKER", "CRITICAL"], easy: true },
  { n: 2, icon: "🟠", title: "Correções Urgentes com Refatoração", desc: "🔴🟠 BLOCKER + CRITICAL | 🔧 Esforço > 5min por item", sev: ["BLOCKER", "CRITICAL"], easy: false },
  { n: 3, icon: "🟡", title: "Melhorias de Qualidade Rápidas", desc: "🟡 MAJOR | ⚡ Esforço ≤ 5min por item", sev: ["MAJOR"], easy: true },
  { n: 4, icon: "🔵", title: "Melhorias com Refatoração", desc: "🟡 MAJOR | 🔧 Esforço > 5min por item", sev: ["MAJOR"], easy: false },
  { n: 5, icon: "🟢", title: "Ajustes Finos", desc: "🔵⚪ MINOR + INFO", sev: ["MINOR", "INFO"], easy: null },
];

const GLOSSARY = [
  ["BLOCKER", "Bug ou vulnerabilidade que pode causar falha em produção. Deve ser corrigido imediatamente."],
  ["CRITICAL", "Problema de segurança ou bug com alto impacto no sistema. Prioridade alta."],
  ["MAJOR", "Code smell que dificulta a manutenção, legibilidade ou evolução do código."],
  ["MINOR", "Pequeno desvio de convenção ou boa prática. Baixo impacto."],
  ["INFO", "Sugestão de melhoria. Não é uma violação obrigatória."],
  ["Code Smell", "Código que funciona mas tem problemas de design que dificultam manutenção."],
  ["Vulnerabilidade", "Falha de segurança que pode ser explorada por atacantes."],
  ["Bug", "Erro no código que pode causar comportamento incorreto em tempo de execução."],
  ["Hotspot", "Código sensível a segurança que requer revisão manual. Não conta como vulnerabilidade até ser revisado."],
  ["Impacto (MQR)", "Modelo de qualidade do SonarQube: cada issue afeta uma qualidade de software (Segurança, Confiabilidade, Manutenibilidade) com impacto Alto/Médio/Baixo."],
];

const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const sevRank = (s) => SEVERITIES.indexOf(s);
const IMPACT = { HIGH: "Alto", MEDIUM: "Médio", LOW: "Baixo" };
const QUAL = { SECURITY: "Seg.", RELIABILITY: "Conf.", MAINTAINABILITY: "Manut." };

function impactText(i) {
  return (i.impacts || []).map((x) => `${QUAL[x.quality] || x.quality}:${IMPACT[x.severity] || x.severity}`).join(", ");
}

function header(d, ctx) {
  const m = d.meta;
  const modeText = m.mode === "approximate"
    ? "aproximado (eslint-plugin-sonarjs)"
    : `SonarQube Community ${m.sonar_version || ""} (${m.mode === "server" ? "servidor" : "Docker"})`.replace(/\s+\)/, ")");
  const lines = [
    "# 🔍 Relatório de Auditoria SonarQube", "",
    `> **Projeto:** ${ctx.projectName}`,
    `> **Data:** ${ctx.date}`,
    `> **Modo de análise:** ${modeText}`,
    `> **Linguagens:** ${ctx.languages}`,
    `> **Arquivos analisados:** ${m.files_analyzed ?? "n/d"}`,
    `> **Perfil de regras:** ${m.mode === "approximate" ? "regras `sonarjs/*` recomendadas" : "padrão do SonarQube (Sonar way)"}`,
    "",
  ];
  if (m.mode === "approximate") {
    lines.push(
      "> ⚠️ **RESULTADO APROXIMADO — NÃO EQUIVALE AO SONARQUBE.** Docker/servidor SonarQube não estavam disponíveis; " +
      "esta análise usou apenas `eslint-plugin-sonarjs` em arquivos JS/TS. Java, JSP, XML e arquivos de configuração **não foram analisados**, " +
      "e severidades/regras podem divergir do SonarQube real. Para um resultado fiel, execute novamente com Docker habilitado.", "",
    );
  }
  lines.push("---", "");
  return lines;
}

function summary(d, ctx, issuesByFile) {
  const m = d.meta;
  const filesWith = issuesByFile.size;
  const total = m.files_analyzed;
  const clean = total != null ? Math.max(0, total - filesWith) : null;
  const pct = total ? Math.round((clean / total) * 100) : null;
  const grade = pct == null ? "n/d" : pct >= 95 ? "A" : pct >= 85 ? "B" : pct >= 70 ? "C" : pct >= 50 ? "D" : "E";
  const effort = d.issues.reduce((a, i) => a + (i.effortMinutes || 0), 0);
  return [
    "## 📊 Resumo Executivo", "",
    "Este relatório reflete o **estado atual** do código conforme a análise executada nesta rodada. Os números vêm diretamente " +
    (m.mode === "approximate" ? "do ESLint (aproximação)." : "do SonarQube; nenhuma contagem é estimada por IA."), "",
    "| Indicador | Valor |", "|-----------|-------|",
    `| Arquivos analisados | **${total ?? "n/d"}** |`,
    `| Total de violações | **${d.issues.length}** |`,
    `| Arquivos com violações | **${filesWith}**${total != null ? ` / ${total}` : ""} |`,
    `| Arquivos limpos | **${clean ?? "n/d"}** |`,
    `| Security Hotspots a revisar | **${d.hotspots.length}** |`,
    `| Esforço estimado total | **${m.mode === "approximate" ? "n/d (modo aproximado)" : formatMinutes(effort)}** |`,
    `| Nota de saúde | **${grade}**${pct != null ? ` (${pct}% dos arquivos sem violações)` : ""} |`, "",
    "---", "",
  ];
}

function previousState(diff) {
  const out = ["## 🔁 Estado das Issues Anteriores", ""];
  if (!diff) {
    out.push("Primeira auditoria do projeto — sem histórico para comparar. Todas as violações abaixo são novas.", "", "---", "");
    return out;
  }
  if (diff.skipped) {
    out.push(`Comparação com execuções anteriores indisponível: ${diff.skipped}. Para ter histórico, use o modo SonarQube (Docker ou servidor).`, "", "---", "");
    return out;
  }
  const c = diff.counts;
  out.push(
    `Comparação determinística, feita pelo histórico do próprio SonarQube, entre esta execução e a análise anterior (${diff.baseline}).`, "",
    "| Indicador | Quantidade |", "|-----------|:----------:|",
    `| ✅ Corrigidas (não existem mais) | ${c.corrigidas} |`,
    `| ❌ Persistem (ainda no código) | ${c.persistem} |`,
    `| ➖ N/A (arquivo removido) | ${c.na} |`,
    `| 🆕 Novas (surgiram nesta execução) | ${c.novas} |`, "",
  );
  out.push("**Issues corrigidas desde o último relatório:**", "");
  if (!diff.corrigidas.length) out.push("Nenhuma issue corrigida desde o último relatório.");
  else {
    out.push("| # | Arquivo | Linha | Regra | Status |", "|---|---------|:-----:|-------|:------:|");
    diff.corrigidas.forEach((p, i) => out.push(`| ${i + 1} | \`${esc(p.file)}\` | ${p.line ?? "-"} | \`${esc(p.rule)}\` | ✅ corrigida |`));
  }
  out.push("", "---", "");
  return out;
}

function methodology(d, ctx) {
  const m = d.meta;
  const out = ["## ⚠️ Metodologia e Limitações", ""];
  if (m.mode === "approximate") {
    out.push(
      "**Modo de análise: aproximado (eslint-plugin-sonarjs).**", "",
      "- Apenas arquivos JS/TS foram analisados; severidades são mapeadas manualmente e podem divergir do SonarQube.",
      "- Esforço e impacto (MQR) não estão disponíveis neste modo; itens sem esforço entram como \"fácil\" no faseamento.",
      "- Não foram analisados: " + (m.not_analyzed?.length ? m.not_analyzed.map((x) => `\`.${x.ext}\` (${x.count})`).join(", ") : "nenhum outro tipo de arquivo") + ".",
    );
  } else {
    out.push(
      `**Modo de análise:** SonarQube Community ${m.sonar_version || ""} via ${m.mode === "server" ? "servidor existente" : "Docker"}` +
      (m.mode === "docker" ? ` (scanner \`${SCANNER_IMAGE.split("/").pop()}\`)` : "") + ".", "",
      "- Os resultados são os do próprio SonarQube com o perfil de regras padrão do servidor; severidade e impacto vêm do Sonar.",
      "- A edição Community não inclui análise de taint (fluxo de dados), então vulnerabilidades dependentes dela (ex.: injeções rastreadas entre métodos) podem não aparecer.",
      "- Security Hotspots são apresentados à parte e não contam como vulnerabilidades.",
    );
    if (m.java_binaries === "empty") out.push("- ⚠️ Projeto Java analisado **sem bytecode** (`target/classes`/`build/classes` ausentes): regras semânticas perdem precisão. Compile o projeto e execute novamente para maior fidelidade.");
    if (m.mode === "server" && m.analysis_date) out.push(`- Dados coletados da última análise do servidor (${m.analysis_date}); a skill não executou um novo scan neste modo.`);
    if (m.truncated) out.push("- ⚠️ A coleta de issues ficou incompleta (limite de 10.000 resultados do Sonar não totalmente contornado).");
  }
  out.push("", "---", "");
  return out;
}

function severityOverview(d) {
  const out = ["## 🎯 Visão Geral por Severidade", "", "| Severidade | Quantidade | Significado |", "|------------|:----------:|-------------|"];
  for (const s of SEVERITIES) out.push(`| ${SEV_ICON[s]} ${s} | ${d.issues.filter((i) => i.severity === s).length} | ${SEV_MEANING[s]} |`);
  out.push("", "---", "");
  return out;
}

function filesSection(issuesByFile) {
  const rows = [...issuesByFile.entries()].map(([file, list]) => ({
    file, count: list.length, max: list.reduce((a, i) => (sevRank(i.severity) < sevRank(a) ? i.severity : a), "INFO"),
  })).sort((a, b) => sevRank(a.max) - sevRank(b.max) || b.count - a.count || a.file.localeCompare(b.file));
  const out = [
    "## 📁 Arquivos com Violações", "",
    "Todos os arquivos com violações, ordenados por severidade máxima (BLOCKER → INFO) e, em empate, por quantidade decrescente.", "",
    "| # | Arquivo | Issues | Sev. Máxima |", "|---|---------|:------:|-------------|",
  ];
  if (!rows.length) out.push("| - | Nenhum arquivo com violações | 0 | - |");
  rows.forEach((r, i) => out.push(`| ${i + 1} | \`${esc(r.file)}\` | ${r.count} | ${SEV_ICON[r.max]} ${r.max} |`));
  out.push("", "---", "");
  return out;
}

function rulesSection(d) {
  const by = new Map();
  for (const i of d.issues) {
    const e = by.get(i.rule) || { rule: i.rule, count: 0, severity: i.severity };
    e.count++;
    if (sevRank(i.severity) < sevRank(e.severity)) e.severity = i.severity;
    by.set(i.rule, e);
  }
  const rows = [...by.values()].sort((a, b) => b.count - a.count || sevRank(a.severity) - sevRank(b.severity));
  const out = ["## 📏 Regras Mais Violadas", "", "| # | Regra | Ocorrências | Severidade | Descrição |", "|---|-------|:-----------:|------------|-----------|"];
  if (!rows.length) out.push("| - | Nenhuma regra violada | 0 | - | - |");
  rows.forEach((r, i) => out.push(`| ${i + 1} | \`${esc(r.rule)}\` | ${r.count} | ${r.severity} | ${esc(d.rules?.[r.rule]?.name || "")} |`));
  out.push("", "---", "");
  return out;
}

function hotspotsSection(d, enrich) {
  const out = [
    "## 🔥 Security Hotspots (a revisar)", "",
    "Hotspots exigem **revisão manual** (seguro/ação necessária) e **não** entram nas contagens de severidade nem como vulnerabilidades.", "",
    "| # | Arquivo | Linha | Regra | Probabilidade | Descrição |", "|---|---------|:-----:|-------|:-------------:|-----------|",
  ];
  if (!d.hotspots.length) out.push("| - | Nenhum hotspot a revisar | - | - | - | - |");
  [...d.hotspots].sort((a, b) => sevRank(a.severity) - sevRank(b.severity))
    .forEach((h, i) => out.push(`| ${i + 1} | \`${esc(h.file)}\` | ${h.line ?? "-"} | \`${esc(h.rule)}\` | ${h.probability || "-"} | ${esc(enrich.rules?.[h.rule]?.problema || h.message)} |`));
  out.push("", "---", "");
  return out;
}

function phaseOf(i) {
  const easy = (i.effortMinutes ?? 5) <= 5;
  return PHASES.find((p) => p.sev.includes(i.severity) && (p.easy === null || p.easy === easy));
}

function actionPlan(d, diff, enrich) {
  const out = [
    "## 🚀 Plano de Ação", "",
    "O plano está organizado em **5 fases**, priorizando por criticidade (eixo principal) e facilidade de correção (desempate). Comece pela Fase 1 e avance sequencialmente.", "",
  ];
  for (const p of PHASES) {
    const items = d.issues.filter((i) => phaseOf(i) === p)
      .sort((a, b) => sevRank(a.severity) - sevRank(b.severity) || a.file.localeCompare(b.file) || (a.line ?? 0) - (b.line ?? 0));
    const effort = items.reduce((a, i) => a + (i.effortMinutes || 0), 0);
    out.push(`### ${p.icon} Fase ${p.n} — ${p.title}`, `> ${p.desc}`,
      `> **Total:** ${items.length} violações | **Esforço estimado:** ${d.meta.mode === "approximate" ? "n/d" : formatMinutes(effort)}`, "");
    if (!items.length) { out.push(EMPTY, ""); continue; }
    out.push("| # | Arquivo | Linha | Regra | Problema | Como Corrigir | Esforço | Estado |", "|---|---------|:-----:|-------|----------|---------------|:-------:|:------:|");
    items.forEach((i, n) => {
      const st = diff && !diff.skipped ? (diff.status.get(i.key) === "persiste" ? "❌ persiste" : "🆕 nova") : "🆕 nova";
      const how = enrich.rules?.[i.rule]?.como_corrigir || RULE_HINTS[i.rule] || `Consulte a regra ${i.rule}${d.rules?.[i.rule]?.name ? ` — ${d.rules[i.rule].name}` : ""} no SonarQube.`;
      const imp = impactText(i);
      out.push(`| ${n + 1} | \`${esc(i.file)}\` | ${i.line ?? "-"} | \`${esc(i.rule)}\` | ${esc(i.message)}${imp ? ` _(${imp})_` : ""} | ${esc(how)} | ${i.effort || "-"} | ${st} |`);
    });
    out.push("");
  }
  out.push("---", "");
  return out;
}

function glossary(enrich) {
  const out = ["## 📖 Glossário", "", "| Termo | Significado |", "|-------|-------------|"];
  for (const [t, m] of GLOSSARY) out.push(`| **${t}** | ${m} |`);
  for (const g of enrich.glossario || []) out.push(`| **${esc(g.termo)}** | ${esc(g.significado)} |`);
  out.push("", "---", "");
  return out;
}

function promptSection(ctx, enrich) {
  const out = ["## 🤖 Prompt para Correção Automatizada", "",
    "Copie o prompt abaixo e cole no seu agente de IA para iniciar a correção automatizada das violações.", ""];
  if (ctx.hasOpenspec) {
    out.push("### 📦 Integração OpenSpec", "",
      "Este projeto utiliza OpenSpec. Para iniciar a correção via change proposal, use o comando:", "",
      ` > \`/opsx-propose Corrigir violações SonarQube da Fase 1 conforme relatório sonarqube-reports/${ctx.fileName}\``, "");
  }
  out.push("~~~",
    enrich.prompt || [
      `Corrija as violações SonarQube do projeto conforme o relatório \`${ctx.fileName}\`.`, "",
      "Instruções:",
      "1. Leia o relatório referenciado acima como fonte de verdade",
      "2. Comece pela Fase 1 (correções urgentes e rápidas) e avance sequencialmente",
      "3. Para cada violação, localize o arquivo e linha indicados no Plano de Ação",
      "4. Aplique a correção descrita na coluna \"Como Corrigir\"",
      "5. Certifique-se de que a correção não introduz novos problemas",
      "6. Mantenha o comportamento funcional existente", "",
      "Fases a corrigir: 1 a 5 (priorize as fases iniciais).",
    ].join("\n"),
    "~~~", "");
  return out;
}

export function renderReport({ data, diff, enrich = {}, ctx }) {
  const issuesByFile = new Map();
  for (const i of data.issues) {
    const k = i.file || "(projeto)";
    if (!issuesByFile.has(k)) issuesByFile.set(k, []);
    issuesByFile.get(k).push(i);
  }
  const index = [
    "## 📋 Índice", "",
    "- [Resumo Executivo](#📊%20Resumo%20Executivo)",
    "- [Estado das Issues Anteriores](#🔁%20Estado%20das%20Issues%20Anteriores)",
    "- [Metodologia e Limitações](#⚠️%20Metodologia%20e%20Limitações)",
    "- [Visão Geral por Severidade](#🎯%20Visão%20Geral%20por%20Severidade)",
    "- [Arquivos com Violações](#📁%20Arquivos%20com%20Violações)",
    "- [Regras Mais Violadas](#📏%20Regras%20Mais%20Violadas)",
    "- [Security Hotspots](#🔥%20Security%20Hotspots%20(a%20revisar))",
    "- [Plano de Ação](#🚀%20Plano%20de%20Ação)",
    ...PHASES.map((p) => `  - [${p.icon} Fase ${p.n} — ${p.title}](#${p.icon}%20Fase%20${p.n}%20—%20${p.title.replace(/ /g, "%20")})`),
    "- [Glossário](#📖%20Glossário)",
    "- [Prompt para Correção Automatizada](#🤖%20Prompt%20para%20Correção%20Automatizada)",
    "", "---", "",
  ];
  const parts = [
    header(data, ctx), index, summary(data, ctx, issuesByFile), previousState(diff), methodology(data, ctx),
    severityOverview(data), filesSection(issuesByFile), rulesSection(data), hotspotsSection(data, enrich),
    actionPlan(data, diff, enrich), glossary(enrich), promptSection(ctx, enrich),
  ];
  return parts.flat().join("\n");
}
