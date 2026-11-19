# audit-report Specification

## Purpose

Renderizar o relatório de auditoria de forma determinística no formato definido, com diff pelo histórico do SonarQube e papel restrito do LLM.

## Requirements

### Requirement: Relatório determinístico no formato atual
O sistema SHALL gerar o relatório por script, seguindo `references/report-template.md`: mesmas seções, mesma ordem, ícones obrigatórios nos títulos, cinco fases, glossário e prompt de correção, em pt-BR, no arquivo `sonarqube-reports/<nome-da-pasta>_<AAAA-MM-DDTHHMMSS>.md`. Seções sem itens SHALL aparecer com "Nenhuma violação encontrada nesta fase."

#### Scenario: Estrutura completa
- **WHEN** o relatório é gerado
- **THEN** todas as seções do template aparecem na ordem definida, com seus ícones

#### Scenario: Fase sem violações
- **WHEN** nenhuma issue se enquadra em uma fase
- **THEN** a fase aparece com "Nenhuma violação encontrada nesta fase."

#### Scenario: Nome do arquivo
- **WHEN** o projeto está na pasta `meu-projeto` e a execução ocorre em 2026-09-15 14:25:30
- **THEN** o arquivo é `sonarqube-reports/meu-projeto_2026-09-15T142530.md`

### Requirement: Faseamento por severidade e esforço
O sistema SHALL distribuir as issues nas fases 1–5 (BLOCKER+CRITICAL fácil/difícil, MAJOR fácil/difícil, MINOR+INFO) usando a severidade do Sonar e `effort` ≤ 5 minutos como "fácil", e SHALL exibir o impacto MQR junto de cada issue quando disponível.

#### Scenario: Issue crítica e rápida
- **WHEN** uma issue tem severidade CRITICAL e esforço de 2 min
- **THEN** ela aparece na Fase 1

#### Scenario: Issue major demorada
- **WHEN** uma issue tem severidade MAJOR e esforço de 30 min
- **THEN** ela aparece na Fase 4

### Requirement: Hotspots apresentados separadamente
O relatório SHALL apresentar os security hotspots em subseção própria identificada como "a revisar", fora das contagens de severidade e dos totais de vulnerabilidades.

#### Scenario: Projeto com hotspots
- **WHEN** `hotspots[]` não está vazio
- **THEN** os hotspots aparecem na subseção dedicada e os totais de severidade não os incluem

### Requirement: Diff determinístico pelo histórico do SonarQube
O sistema SHALL classificar cada issue como `✅ corrigida`, `❌ persiste`, `🆕 nova` ou `➖ N/A` usando o histórico do próprio SonarQube, comparando com a análise anterior à mais recente (`creationDate` das issues abertas; `closeDate` e `resolution` das fechadas), sem intervenção do LLM e SHALL NOT criar arquivos de estado no projeto. Com apenas uma análise, todas SHALL ser `🆕 nova` e a seção de comparação SHALL indicar "Primeira auditoria". No modo aproximado a seção SHALL informar que a comparação está indisponível.

#### Scenario: Issue corrigida
- **WHEN** uma issue foi fechada com resolução FIXED depois da análise anterior
- **THEN** ela é listada como `✅ corrigida`

#### Scenario: Issue persistente
- **WHEN** uma issue aberta foi criada até a análise anterior
- **THEN** ela é listada como `❌ persiste`

#### Scenario: Issue nova
- **WHEN** uma issue aberta foi criada depois da análise anterior
- **THEN** ela é listada como `🆕 nova`

#### Scenario: Primeira execução
- **WHEN** o projeto possui apenas uma análise no SonarQube
- **THEN** todas as issues são `🆕 nova` e a seção indica "Primeira auditoria"

#### Scenario: Modo aproximado
- **WHEN** o modo é `approximate`
- **THEN** a seção informa que a comparação com execuções anteriores está indisponível

#### Scenario: Nenhum arquivo extra
- **WHEN** o relatório é gerado
- **THEN** a pasta `sonarqube-reports/` contém apenas os relatórios `.md`

### Requirement: Indicação do modo de análise
O relatório SHALL informar o modo de análise (SonarQube Docker, SonarQube servidor ou aproximado), as versões do SonarQube e do scanner quando aplicável, e as limitações conhecidas da execução (ex.: ausência de bytecode Java, Community sem taint analysis).

#### Scenario: Modo Docker com Java sem build
- **WHEN** o scan Docker foi feito sem `target/classes`
- **THEN** a seção de metodologia informa o modo, as versões e a limitação de precisão por falta de bytecode

### Requirement: Papel restrito do LLM
O LLM SHALL ser usado apenas para explicar regras, sugerir correções por regra, agrupar/priorizar e escrever o prompt de correção, a partir de `issues.json`; SHALL NOT detectar violações, alterar contagens, reclassificar severidade nem reintroduzir issues ausentes do `issues.json`.

#### Scenario: Contagens inalteradas
- **WHEN** o LLM fornece o enriquecimento textual
- **THEN** as contagens e a lista de issues do relatório são idênticas às de `issues.json`

#### Scenario: Prompt de correção sem lista de arquivos
- **WHEN** o prompt de correção é gerado
- **THEN** ele segue o formato do template e não lista arquivos ou violações individuais
