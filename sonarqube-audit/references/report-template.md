# Formato do Relatório

O relatório é gerado por `scripts/lib/render.mjs` (determinístico) — o LLM **não** monta o Markdown, apenas fornece textos via arquivo de enriquecimento. Este documento descreve o formato que o `render.mjs` produz; alterações de formato devem ser feitas nos dois lugares.

Arquivo: `sonarqube-reports/<pasta-do-projeto>_<AAAA-MM-DDTHHMMSS>.md` (pt-BR). Nenhum outro arquivo é gravado no projeto: o diff vem do histórico do SonarQube (análise anterior).

## Seções (ordem fixa, ícones obrigatórios, todas sempre presentes)

| Seção | Título |
|-------|--------|
| Título | `# 🔍 Relatório de Auditoria SonarQube` (cabeçalho: projeto, data, **modo de análise**, linguagens, arquivos analisados, perfil de regras) |
| Aviso | só no modo aproximado: bloco `⚠️ RESULTADO APROXIMADO — NÃO EQUIVALE AO SONARQUBE` |
| Índice | `## 📋 Índice` |
| Resumo | `## 📊 Resumo Executivo` |
| Histórico | `## 🔁 Estado das Issues Anteriores` (✅ corrigida / ❌ persiste / ➖ N/A / 🆕 nova; primeira análise → "Primeira auditoria..."; modo aproximado → "comparação indisponível") |
| Metodologia | `## ⚠️ Metodologia e Limitações` (modo, versões, limitações: sem bytecode Java, Community sem taint, etc.) |
| Severidade | `## 🎯 Visão Geral por Severidade` |
| Arquivos | `## 📁 Arquivos com Violações` (todos, sem corte) |
| Regras | `## 📏 Regras Mais Violadas` |
| Hotspots | `## 🔥 Security Hotspots (a revisar)` — fora das contagens de severidade |
| Plano | `## 🚀 Plano de Ação` com 5 fases |
| Glossário | `## 📖 Glossário` |
| Prompt | `## 🤖 Prompt para Correção Automatizada` (+ bloco OpenSpec se existir `openspec/`) |

## Fases

| Fase | Título | Critério |
|------|--------|----------|
| 🔴 1 | Correções Urgentes e Rápidas | BLOCKER + CRITICAL, esforço ≤ 5min |
| 🟠 2 | Correções Urgentes com Refatoração | BLOCKER + CRITICAL, esforço > 5min |
| 🟡 3 | Melhorias de Qualidade Rápidas | MAJOR, esforço ≤ 5min |
| 🔵 4 | Melhorias com Refatoração | MAJOR, esforço > 5min |
| 🟢 5 | Ajustes Finos | MINOR + INFO |

Seção/fase vazia aparece com "Nenhuma violação encontrada nesta fase." Esforço ausente (modo aproximado) conta como "fácil".

## Arquivo de enriquecimento (escrito pelo LLM)

```json
{
  "rules": { "<rule>": { "como_corrigir": "texto curto em pt-BR", "problema": "opcional" } },
  "glossario": [ { "termo": "...", "significado": "..." } ],
  "prompt": "opcional — substitui o prompt de correção padrão (sem listar arquivos/violações)"
}
```

Somente texto. Contagens, severidades e a lista de issues vêm sempre do `issues.json`.
