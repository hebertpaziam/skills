## 1. Criar template compartilhado

- [x] 1.1 Criar `references/_shared/report-template.md` extraindo o template completo do `typescript/audit.md` (do bloco ````markdown até ````), substituindo "TypeScript" por `{linguagem}` no header
- [x] 1.2 Mover o bloco "## Importante" do `java/audit.md` para o final do template compartilhado (aplica-se a todas as linguagens)
- [x] 1.3 Mover o bloco "## Bloco OpenSpec (condicional)" para o template compartilhado

## 2. Reduzir audit.md por linguagem

- [x] 2.1 Reescrever `references/typescript/audit.md` — manter apenas: título, Fase 1-3 da metodologia (linhas 1-25), e instrução "O template do relatório está em `_shared/report-template.md`"
- [x] 2.2 Reescrever `references/java/audit.md` — manter apenas: título, Fases 1-3 da metodologia (linhas 1-26), e instrução "O template do relatório está em `_shared/report-template.md`"

## 3. Remover redundâncias do SKILL.md

- [x] 3.1 Manter tabela de ícones no SKILL.md (não remover — serve como referência rápida para o agente)
- [x] 3.2 Remover bloco inline do formato "Arquivos com Violações" (linhas 246-253) — já está no template
- [x] 3.3 Remover bloco inline do prompt de correção (linhas 258-270) — já está no template
- [x] 3.4 Condensar seção "Consistência do Relatório" (linhas 44-75) para no máximo 10 linhas, mantendo a tabela de ícones intacta

## 4. Atualizar referências no SKILL.md

- [x] 4.1 Na Etapa 5, atualizar instrução para mencionar `_shared/report-template.md` como fonte do template
- [x] 4.2 Verificar que a Etapa 3 (sub-agentes) instrui carregar o template compartilhado junto das referências da categoria

## 5. Validação

- [x] 5.1 Verificar que os audit.md não contêm mais template duplicado
- [x] 5.2 Verificar que o SKILL.md não repete conteúdo do template
- [x] 5.3 Conferir que o template compartilhado contém todas as seções do relatório original (Índice, Resumo, Metodologia, Severidade, Arquivos, Regras, Plano de Ação 1-5, Glossário, Prompt, OpenSpec)
