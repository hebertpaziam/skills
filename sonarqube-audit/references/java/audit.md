# SonarQube Audit — Java

## Metodologia de Análise

### Fase 1 — Carregar referências

Carregar **todos** os arquivos `.md` em `references/java/` para obter o texto completo de cada regra.

### Fase 2 — Inventário e categorização

1. Listar todos os arquivos `.java` (excluir código gerado, output de build).
2. Categorizar por domínio:
   - **Controllers** → fw-spring + security-hotspot + security-injection
   - **Services** → core-oop + core-errors + core-concurrency + fw-spring
   - **Repositories** → security-injection + core-errors
   - **Models/DTOs** → core-naming + core-oop + core-types
   - **Config** → fw-spring + security-hotspot + security-crypto
   - **Testes** → testing
   - **Utilitários** → core-complexity + core-formatting + core-unused

### Fase 3 — Scanning por categoria

Para cada categoria, carregar as referências correspondentes e analisar cada arquivo:
1. **Scan estrutural**: Verificar anti-patterns conhecidos.
2. **Scan heurístico**: Análise best-effort para regras não-mecânicas.

---

## Template do Relatório

O relatório gerado DEVE seguir exatamente este template. Substituir todos os placeholders `{...}` com dados reais.

````markdown
# 🔍 Relatório de Auditoria SonarQube

> **Projeto:** {nome_do_projeto}
> **Data:** {AAAA-MM-DD}
> **Linguagem:** Java
> **Arquivos analisados:** {total_arquivos}
> **Regras verificadas:** {total_regras}

---

## 📋 Índice

- [Resumo Executivo](#-resumo-executivo)
- [Visão Geral por Severidade](#-visão-geral-por-severidade)
- [Arquivos Mais Afetados](#-arquivos-mais-afetados)
- [Regras Mais Violadas](#-regras-mais-violadas)
- [Plano de Ação](#-plano-de-ação)
  - [Fase 1 — Correções Urgentes e Rápidas](#fase-1--correções-urgentes-e-rápidas)
  - [Fase 2 — Correções Urgentes com Refatoração](#fase-2--correções-urgentes-com-refatoração)
  - [Fase 3 — Melhorias de Qualidade Rápidas](#fase-3--melhorias-de-qualidade-rápidas)
  - [Fase 4 — Melhorias com Refatoração](#fase-4--melhorias-com-refatoração)
  - [Fase 5 — Ajustes Finos](#fase-5--ajustes-finos)
- [Detalhamento por Arquivo](#-detalhamento-por-arquivo)
- [Glossário](#-glossário)
- [Prompt para Correção Automatizada](#-prompt-para-correção-automatizada)

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

## 🎯 Visão Geral por Severidade

| Severidade | Quantidade | Significado |
|------------|:----------:|-------------|
| 🔴 BLOCKER | {blocker} | Bugs ou vulnerabilidades que podem causar falhas em produção |
| 🟠 CRITICAL | {critical} | Problemas de segurança ou bugs com alto impacto |
| 🟡 MAJOR | {major} | Code smells significativos que dificultam manutenção |
| 🔵 MINOR | {minor} | Pequenos desvios de convenção ou boas práticas |
| ⚪ INFO | {info} | Sugestões de melhoria e observações |

---

## 📁 Arquivos Mais Afetados

| # | Arquivo | Violações | Severidade mais alta |
|---|---------|:---------:|---------------------|
| 1 | [`{arquivo_1}`]({link_arquivo_1}) | {count_1} | {severidade_1} |
| 2 | [`{arquivo_2}`]({link_arquivo_2}) | {count_2} | {severidade_2} |
| ... | ... | ... | ... |

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

### Fase 1 — Correções Urgentes e Rápidas
> 🔴🟠 BLOCKER + CRITICAL | ⚡ Esforço ≤ 5min por item
> **Total:** {fase1_total} violações | **Esforço estimado:** {fase1_esforco}

| # | Arquivo | Linha | Regra | Problema | Como Corrigir | Esforço |
|---|---------|:-----:|-------|----------|---------------|:-------:|
| 1 | [`{arquivo}`](#detalhamento-{arquivo_anchor}) | {linha} | `{rule}` | {problema} | {como_corrigir} | {esforco} |
| ... | ... | ... | ... | ... | ... | ... |

### Fase 2 — Correções Urgentes com Refatoração
> 🔴🟠 BLOCKER + CRITICAL | 🔧 Esforço > 5min por item
> **Total:** {fase2_total} violações | **Esforço estimado:** {fase2_esforco}

| # | Arquivo | Linha | Regra | Problema | Como Corrigir | Esforço |
|---|---------|:-----:|-------|----------|---------------|:-------:|
| ... | ... | ... | ... | ... | ... | ... |

### Fase 3 — Melhorias de Qualidade Rápidas
> 🟡 MAJOR | ⚡ Esforço ≤ 5min por item
> **Total:** {fase3_total} violações | **Esforço estimado:** {fase3_esforco}

| # | Arquivo | Linha | Regra | Problema | Como Corrigir | Esforço |
|---|---------|:-----:|-------|----------|---------------|:-------:|
| ... | ... | ... | ... | ... | ... | ... |

### Fase 4 — Melhorias com Refatoração
> 🟡 MAJOR | 🔧 Esforço > 5min por item
> **Total:** {fase4_total} violações | **Esforço estimado:** {fase4_esforco}

| # | Arquivo | Linha | Regra | Problema | Como Corrigir | Esforço |
|---|---------|:-----:|-------|----------|---------------|:-------:|
| ... | ... | ... | ... | ... | ... | ... |

### Fase 5 — Ajustes Finos
> 🔵⚪ MINOR + INFO
> **Total:** {fase5_total} violações | **Esforço estimado:** {fase5_esforco}

| # | Arquivo | Linha | Regra | Problema | Como Corrigir | Esforço |
|---|---------|:-----:|-------|----------|---------------|:-------:|
| ... | ... | ... | ... | ... | ... | ... |

---

## 📂 Detalhamento por Arquivo

Para cada arquivo com violações, uma seção dedicada com todas as issues encontradas.

### <a id="detalhamento-{arquivo_anchor}"></a> `{caminho/do/Arquivo.java}`

**Violações:** {total} | **Severidade mais alta:** {severidade}

| Linha | Regra | Severidade | Problema | Como Corrigir |
|:-----:|-------|------------|----------|---------------|
| {linha} | `{rule}` | {sev} | {problema} | {como_corrigir} |
| ... | ... | ... | ... | ... |

> Repetir esta seção para **cada arquivo** com violações, em ordem decrescente de quantidade de violações.

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
Corrija as violações SonarQube listadas abaixo. Para cada item:
1. Localize o arquivo e a linha indicados
2. Aplique a correção descrita na coluna "Como Corrigir"
3. Certifique-se de que a correção não introduz novos problemas
4. Mantenha o comportamento funcional existente

## Fase 1 — Correções Urgentes e Rápidas ({fase1_total} itens)

{lista_fase1_com_arquivo_linha_regra_e_correcao}

## Fase 2 — Correções Urgentes com Refatoração ({fase2_total} itens)

{lista_fase2_com_arquivo_linha_regra_e_correcao}

## Fase 3 — Melhorias de Qualidade Rápidas ({fase3_total} itens)

{lista_fase3_com_arquivo_linha_regra_e_correcao}

## Fase 4 — Melhorias com Refatoração ({fase4_total} itens)

{lista_fase4_com_arquivo_linha_regra_e_correcao}

## Fase 5 — Ajustes Finos ({fase5_total} itens)

{lista_fase5_com_arquivo_linha_regra_e_correcao}
~~~
````

---

## Bloco OpenSpec (condicional)

Se o projeto possui OpenSpec configurado (diretório `openspec/` na raiz), incluir o seguinte bloco **antes** do prompt de correção:

```markdown
### 📦 Integração OpenSpec

Este projeto utiliza OpenSpec. Para iniciar a correção via change proposal, use o comando:

> `/opsx-propose Corrigir violações SonarQube da Fase {N} conforme relatório sonarqube-audit--{AAAA-MM-DD}.md`
```

Se o projeto **não** possui OpenSpec, omitir este bloco completamente e substituir `{openspec_block}` por string vazia.

## Importante
- Parâmetros customizados e thresholds estão documentados em cada arquivo de referência (ex: S107 max=7, S3776 Threshold=15)
