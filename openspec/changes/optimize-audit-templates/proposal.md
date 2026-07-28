## Why

Os arquivos `typescript/audit.md` e `java/audit.md` da skill sonarqube-audit compartilham ~85% do conteúdo (template do relatório, glossário, prompt de correção). Isso causa manutenção duplicada — qualquer correção no template (como a recente dos links do índice) precisa ser aplicada em ambos. Além disso, o `SKILL.md` repete informações já presentes nos templates (tabela de ícones, formato de tabelas, prompt de correção), inflando o consumo de tokens sem agregar valor.

## What Changes

- Extrair o template de relatório compartilhado para `references/_shared/report-template.md`, parametrizado por `{linguagem}`
- Reduzir os `audit.md` de cada linguagem para conter apenas a metodologia específica + referência ao template compartilhado
- Remover redundâncias do `SKILL.md` que já estão definidas no template (tabela de ícones, formato de tabelas, prompt de correção)
- Condensar a seção "Consistência do Relatório" do SKILL.md em regras compactas
- Remover a "Categorização por domínio" dos `audit.md` (já existe como "Árvore de Decisão" no SKILL.md)

## Capabilities

### New Capabilities
- `shared-report-template`: Template único de relatório compartilhado entre linguagens, parametrizado por variáveis de contexto

### Modified Capabilities

## Impact

- `sonarqube-audit/references/typescript/audit.md` — reduzido para ~30 linhas (apenas metodologia)
- `sonarqube-audit/references/java/audit.md` — reduzido para ~30 linhas (apenas metodologia)
- `sonarqube-audit/references/_shared/report-template.md` — novo arquivo com o template completo
- `sonarqube-audit/SKILL.md` — ~50 linhas removidas (redundâncias)
- Economia total estimada: ~7k tokens por execução da skill
