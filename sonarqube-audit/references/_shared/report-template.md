# Template do Relatório

O relatório gerado DEVE seguir exatamente este template. Substituir todos os placeholders `{...}` com dados reais.

````markdown
# 🔍 Relatório de Auditoria SonarQube

> **Projeto:** {nome_do_projeto}
> **Data:** {AAAA-MM-DD}
> **Linguagem:** {linguagem}
> **Arquivos analisados:** {total_arquivos}
> **Regras verificadas:** {total_regras}

---

## 📋 Índice

- [Resumo Executivo](#📊%20Resumo%20Executivo)
- [Metodologia e Limitações](#⚠️%20Metodologia%20e%20Limitações)
- [Visão Geral por Severidade](#🎯%20Visão%20Geral%20por%20Severidade)
- [Arquivos com Violações](#📁%20Arquivos%20com%20Violações)
- [Regras Mais Violadas](#📏%20Regras%20Mais%20Violadas)
- [Plano de Ação](#🚀%20Plano%20de%20Ação)
  - [🔴 Fase 1 — Correções Urgentes e Rápidas](#🔴%20Fase%201%20—%20Correções%20Urgentes%20e%20Rápidas)
  - [🟠 Fase 2 — Correções Urgentes com Refatoração](#🟠%20Fase%202%20—%20Correções%20Urgentes%20com%20Refatoração)
  - [🟡 Fase 3 — Melhorias de Qualidade Rápidas](#🟡%20Fase%203%20—%20Melhorias%20de%20Qualidade%20Rápidas)
  - [🔵 Fase 4 — Melhorias com Refatoração](#🔵%20Fase%204%20—%20Melhorias%20com%20Refatoração)
  - [🟢 Fase 5 — Ajustes Finos](#🟢%20Fase%205%20—%20Ajustes%20Finos)
- [Glossário](#📖%20Glossário)
- [Prompt para Correção Automatizada](#🤖%20Prompt%20para%20Correção%20Automatizada)

---

## 📊 Resumo Executivo

Este relatório apresenta os resultados da auditoria de qualidade de código baseada nas regras do SonarQube. O objetivo é identificar violações, classificá-las por impacto e fornecer um plano de ação claro para resolução.

| Indicador | Valor |
|-----------|-------|
| Total de violações | **{total}** |
| Arquivos com violações | **{arquivos_com_violacoes}** / {total_arquivos} |
| Arquivos limpos | **{arquivos_limpos}** |
| Esforço estimado total | **{esforco_total}** |
| Nota de saúde | **{nota}** ({percentual_limpo}% dos arquivos sem violações) |

---

## ⚠️ Metodologia e Limitações

Este relatório combina duas camadas de análise com níveis de precisão distintos:

| Camada | Método | Precisão | Regras |
|--------|--------|----------|--------|
| **Determinística** | Scanner baseado em regex/AST (ripgrep, semgrep, ast-grep) | ~98% | S106, S5131, S1148, S1313, S2068, S6437, S6418, S1186, S1128, S1135, S6676, S2245, S2115, S2386, S4830, S3330, S5122, S2589 |
| **Heurística** | Análise semântica por LLM (interpretação de contexto) | Variável | S3776, S2259, S1854, S1066, S3740, S112, S2095, S1874, S1161, S1168, S1192, S107, S3735, S125 (blocos complexos), entre outras |

**Importante:**
- Violações da camada determinística são altamente confiáveis (falsos positivos < 2%).
- Violações da camada heurística são identificadas por interpretação do LLM e **podem conter falsos positivos ou falsos negativos**. Recomenda-se validação manual para itens críticos desta camada.
- A contagem de linhas na análise heurística pode ter desvio de ±5 linhas em relação à posição exata da violação.

---

## 🎯 Visão Geral por Severidade

| Severidade | Quantidade | Significado |
|------------|:----------:|-------------|
| 🔴 BLOCKER | {blocker} | Bugs ou vulnerabilidades que podem causar falhas em produção |
| 🟠 CRITICAL | {critical} | Problemas de segurança ou bugs com alto impacto |
| 🟡 MAJOR | {major} | Code smells significativos que dificultam manutenção |
| 🔵 MINOR | {minor} | Pequenos desvios de convenção ou boas práticas |
| ⚪ INFO | {info} | Sugestões de melhoria e observações |

---

## 📁 Arquivos com Violações

Lista completa de todos os arquivos com violações detectadas, ordenados por severidade máxima (BLOCKER → CRITICAL → MAJOR → MINOR → INFO) e desempate por quantidade decrescente.

| # | Arquivo | Issues | Sev. Máxima |
|---|---------|:------:|-------------|
| 1 | `{arquivo_1}` | {count_1} | {severidade_1} |
| 2 | `{arquivo_2}` | {count_2} | {severidade_2} |
| ... | ... | ... | ... |

> Listar **TODOS** os arquivos com violações — sem corte ou amostragem.

---

## 📏 Regras Mais Violadas

| # | Regra | Ocorrências | Severidade | Descrição |
|---|-------|:-----------:|------------|-----------|
| 1 | `{rule_id_1}` | {count_1} | {sev_1} | {descricao_1} |
| 2 | `{rule_id_2}` | {count_2} | {sev_2} | {descricao_2} |
| ... | ... | ... | ... | ... |

---

## 🚀 Plano de Ação

O plano está organizado em **5 fases**, priorizando por criticidade (eixo principal) e facilidade de correção (desempate). Comece pela Fase 1 e avance sequencialmente.

### 🔴 Fase 1 — Correções Urgentes e Rápidas
> 🔴🟠 BLOCKER + CRITICAL | ⚡ Esforço ≤ 5min por item
> **Total:** {fase1_total} violações | **Esforço estimado:** {fase1_esforco}

| # | Arquivo | Linha | Regra | Problema | Como Corrigir | Esforço |
|---|---------|:-----:|-------|----------|---------------|:-------:|
| 1 | `{arquivo}` | {linha} | `{rule}` | {problema} | {como_corrigir} | {esforco} |
| ... | ... | ... | ... | ... | ... | ... |

### 🟠 Fase 2 — Correções Urgentes com Refatoração
> 🔴🟠 BLOCKER + CRITICAL | 🔧 Esforço > 5min por item
> **Total:** {fase2_total} violações | **Esforço estimado:** {fase2_esforco}

| # | Arquivo | Linha | Regra | Problema | Como Corrigir | Esforço |
|---|---------|:-----:|-------|----------|---------------|:-------:|
| ... | ... | ... | ... | ... | ... | ... |

### 🟡 Fase 3 — Melhorias de Qualidade Rápidas
> 🟡 MAJOR | ⚡ Esforço ≤ 5min por item
> **Total:** {fase3_total} violações | **Esforço estimado:** {fase3_esforco}

| # | Arquivo | Linha | Regra | Problema | Como Corrigir | Esforço |
|---|---------|:-----:|-------|----------|---------------|:-------:|
| ... | ... | ... | ... | ... | ... | ... |

### 🔵 Fase 4 — Melhorias com Refatoração
> 🟡 MAJOR | 🔧 Esforço > 5min por item
> **Total:** {fase4_total} violações | **Esforço estimado:** {fase4_esforco}

| # | Arquivo | Linha | Regra | Problema | Como Corrigir | Esforço |
|---|---------|:-----:|-------|----------|---------------|:-------:|
| ... | ... | ... | ... | ... | ... | ... |

### 🟢 Fase 5 — Ajustes Finos
> 🔵⚪ MINOR + INFO
> **Total:** {fase5_total} violações | **Esforço estimado:** {fase5_esforco}

| # | Arquivo | Linha | Regra | Problema | Como Corrigir | Esforço |
|---|---------|:-----:|-------|----------|---------------|:-------:|
| ... | ... | ... | ... | ... | ... | ... |

---

## 📖 Glossário

| Termo | Significado |
|-------|-------------|
| **BLOCKER** | Bug ou vulnerabilidade que pode causar falha em produção. Deve ser corrigido imediatamente. |
| **CRITICAL** | Problema de segurança ou bug com alto impacto no sistema. Prioridade alta. |
| **MAJOR** | Code smell que dificulta a manutenção, legibilidade ou evolução do código. |
| **MINOR** | Pequeno desvio de convenção ou boa prática. Baixo impacto. |
| **INFO** | Sugestão de melhoria. Não é uma violação obrigatória. |
| **Code Smell** | Código que funciona mas tem problemas de design que dificultam manutenção. |
| **Vulnerabilidade** | Falha de segurança que pode ser explorada por atacantes. |
| **Bug** | Erro no código que pode causar comportamento incorreto em tempo de execução. |
| **Hotspot** | Código sensível a segurança que requer revisão manual. |

---

## 🤖 Prompt para Correção Automatizada

Copie o prompt abaixo e cole no seu agente de IA para iniciar a correção automatizada das violações.

{openspec_block}

~~~
Corrija as violações SonarQube do projeto conforme o relatório `{nome_do_arquivo_gerado}`.

Instruções:
1. Leia o relatório referenciado acima como fonte de verdade
2. Comece pela Fase 1 (correções urgentes e rápidas) e avance sequencialmente
3. Para cada violação, localize o arquivo e linha indicados no Plano de Ação
4. Aplique a correção descrita na coluna "Como Corrigir"
5. Certifique-se de que a correção não introduz novos problemas
6. Mantenha o comportamento funcional existente

Fases a corrigir: 1 a 5 (priorize as fases iniciais).
~~~
````

---

## Bloco OpenSpec (condicional)

Se o projeto possui OpenSpec configurado (diretório `openspec/` na raiz), incluir o seguinte bloco **antes** do prompt de correção:

```markdown
### 📦 Integração OpenSpec

Este projeto utiliza OpenSpec. Para iniciar a correção via change proposal, use o comando:

 > `/opsx-propose Corrigir violações SonarQube da Fase {N} conforme relatório {nome-do-projeto}_{AAAA-MM-DD}_v{N}.md`
```

Se o projeto **não** possui OpenSpec, omitir este bloco completamente e substituir `{openspec_block}` por string vazia.

---

## Importante

- Parâmetros customizados e thresholds estão documentados em cada arquivo de referência (ex: S107 max=7, S3776 Threshold=15)
