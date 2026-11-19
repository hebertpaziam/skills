# shared-report-template Specification

## Purpose

Define the single shared report template used by the sonarqube-audit skill for every language, and keep the per-language audit files and SKILL.md free of duplicated report structure.

## Requirements

### Requirement: Template único de relatório compartilhado
O sistema SHALL manter um único arquivo de template de relatório em `references/_shared/report-template.md` que serve como fonte de verdade para a estrutura do relatório gerado por qualquer linguagem.

#### Scenario: Template usado por TypeScript
- **WHEN** a skill executa uma auditoria em projeto TypeScript
- **THEN** o agente carrega `_shared/report-template.md` e gera o relatório substituindo `{linguagem}` por "TypeScript"

#### Scenario: Template usado por Java
- **WHEN** a skill executa uma auditoria em projeto Java
- **THEN** o agente carrega `_shared/report-template.md` e gera o relatório substituindo `{linguagem}` por "Java"

#### Scenario: Correção no template aplica-se a todas as linguagens
- **WHEN** um bug é corrigido no `_shared/report-template.md`
- **THEN** ambas as linguagens geram relatórios com a correção aplicada sem necessidade de edição adicional

### Requirement: audit.md contém apenas metodologia
Cada arquivo `audit.md` por linguagem SHALL conter exclusivamente a metodologia de análise específica daquela linguagem e uma referência ao template compartilhado. O template do relatório NÃO SHALL estar duplicado nos audit.md.

#### Scenario: audit.md de TypeScript
- **WHEN** o agente carrega `references/typescript/audit.md`
- **THEN** o arquivo contém apenas: título, fases de análise, categorização por domínio TS, e instrução para usar `_shared/report-template.md`

#### Scenario: audit.md de Java
- **WHEN** o agente carrega `references/java/audit.md`
- **THEN** o arquivo contém apenas: título, fases de análise, categorização por domínio Java, e instrução para usar `_shared/report-template.md`

### Requirement: SKILL.md sem redundâncias do template
O `SKILL.md` NÃO SHALL repetir conteúdo que já está definido no template compartilhado. Referências ao formato do relatório SHALL apontar para o template.

#### Scenario: Tabela de ícones mantida no SKILL.md
- **WHEN** o agente lê o SKILL.md
- **THEN** a tabela de ícones (seção/título e severidade) permanece no SKILL.md como referência rápida para o agente

#### Scenario: Remoção do formato de tabelas inline
- **WHEN** o agente lê o SKILL.md
- **THEN** o formato da tabela "Arquivos com Violações" e o bloco do prompt de correção não estão inline; há referência ao template

#### Scenario: Regras de consistência condensadas
- **WHEN** o agente lê a seção "Consistência do Relatório" do SKILL.md
- **THEN** a seção tem no máximo 10 linhas, contendo apenas regras comportamentais (seções obrigatórias, seções vazias) sem re-descrever o conteúdo do template
