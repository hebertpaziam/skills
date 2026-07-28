## Context

A skill `sonarqube-audit` possui dois arquivos de auditoria (`typescript/audit.md` e `java/audit.md`) que contêm cada um ~225 linhas. Desse total, ~190 linhas são idênticas (template de relatório). Além disso, o `SKILL.md` (366 linhas) repete informações já presentes nos templates: tabela de ícones, formato de tabelas, prompt de correção.

Estrutura atual:
```
references/
├── typescript/audit.md   (225 linhas — metodologia + template completo)
├── java/audit.md         (229 linhas — metodologia + template completo)
└── universal/scan-all.md
SKILL.md                  (366 linhas — com redundâncias do template)
```

## Goals / Non-Goals

**Goals:**
- Eliminar duplicação do template de relatório (single source of truth)
- Reduzir tokens consumidos pela skill (~7k tokens a menos por execução)
- Simplificar manutenção (corrigir template uma vez, aplicar em todas as linguagens)
- Manter o comportamento e output da skill inalterados

**Non-Goals:**
- Alterar a estrutura do relatório gerado
- Modificar regras de análise ou referências de regras SonarQube
- Adicionar suporte a novas linguagens (facilitado, mas não é o escopo)

## Decisions

### 1. Template compartilhado em `references/_shared/report-template.md`

**Decisão:** Extrair todo o bloco de template markdown (do `# 🔍 Relatório` até o bloco OpenSpec) para um arquivo único em `references/_shared/report-template.md`, usando `{linguagem}` como placeholder.

**Alternativa considerada:** Usar include/partial no SKILL.md. Descartado porque o agente consome arquivos inteiros — não há sistema de includes.

**Rationale:** O agente já carrega múltiplos arquivos de referência por design. Adicionar um arquivo compartilhado não muda o fluxo.

### 2. `audit.md` reduzido a metodologia + ponteiro

**Decisão:** Cada `audit.md` conterá apenas:
- Título e metodologia específica da linguagem (fases, categorização por domínio)
- Instrução explícita: "O template do relatório está em `_shared/report-template.md`"

**Rationale:** A categorização por domínio é específica de cada linguagem e deve ficar no audit.md. Já a "Árvore de Decisão" no SKILL.md cobre o mesmo, mas de forma mais detalhada — manter ambas porque servem propósitos diferentes (audit.md = instrução ao sub-agente, SKILL.md = orquestração geral).

### 3. Remover redundâncias do SKILL.md

**Decisão:** Remover do SKILL.md:
- Formato da tabela "Arquivos com Violações" (linhas 246-253) — já está no template
- Bloco do prompt de correção (linhas 258-270) — já está no template

**Manter no SKILL.md:**
- Tabela de ícones (linhas 52-68) — referência rápida importante para o agente; a duplicação é aceitável pelo valor de consulta direta

Substituir por referência: "Seguir exatamente o template em `_shared/report-template.md`".

**Manter no SKILL.md:** A regra "todas as seções são obrigatórias" e "seções vazias devem aparecer" — condensada em 2-3 linhas.

### 4. Seção "Importante" do Java movida para o template compartilhado

**Decisão:** O bloco `## Importante` que só existe no `java/audit.md` será incorporado como nota no template compartilhado (aplica-se a todas as linguagens).

## Risks / Trade-offs

- **[Risco] Agente pode não carregar o template compartilhado** → Mitigação: Instrução explícita no audit.md + menção no SKILL.md na Etapa 5
- **[Risco] Perda de contexto ao separar** → Mitigação: O audit.md aponta diretamente para o template; o SKILL.md menciona o template na etapa de geração
- **[Trade-off] Um arquivo a mais para carregar** → Aceitável: o agente já carrega dezenas de referências; um a mais é negligível comparado à economia de ~190 linhas duplicadas
