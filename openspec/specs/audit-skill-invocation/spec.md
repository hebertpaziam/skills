# audit-skill-invocation Specification

## Purpose

Regras de ativação explícita, confirmação, saída mínima no terminal e portabilidade da skill sonarqube-audit.

## Requirements

### Requirement: Invocação explícita obrigatória
A skill SHALL ser executada somente quando o usuário solicitar explicitamente uma auditoria SonarQube (ex.: "audit sonarqube", "scan sonarqube", "relatório sonarqube", "verificar violações", "revisar compliance") e SHALL NOT ser ativada por inferência a partir de pedidos ambíguos.

#### Scenario: Pedido explícito
- **WHEN** o usuário diz "audit sonarqube"
- **THEN** a skill inicia o fluxo após a confirmação

#### Scenario: Pedido ambíguo
- **WHEN** o usuário diz "analisa o projeto" ou "qualidade do código"
- **THEN** a skill NÃO é executada diretamente

### Requirement: Confirmação prévia informativa
Quando a intenção não for inequívoca, a skill SHALL pedir confirmação antes de executar, informando o modo que será usado, o consumo esperado (download de imagens Docker, ~2–4 GB de RAM, tempo de primeira execução) e o local do relatório; SHALL executar apenas após confirmação explícita.

#### Scenario: Confirmação com Docker
- **WHEN** a intenção é ambígua e o modo detectado é `docker`
- **THEN** a pergunta menciona uso de Docker, consumo de recursos e a pasta `sonarqube-reports/`

#### Scenario: Confirmação em modo aproximado
- **WHEN** o modo detectado é `approximate`
- **THEN** a pergunta informa que o resultado será apenas aproximado e restrito a JS/TS

### Requirement: Saída mínima no terminal
Durante a execução o agente SHALL NOT emitir texto intermediário ao usuário e, ao final, SHALL emitir apenas a linha `Relatório gerado: <nome-do-arquivo>.md`.

#### Scenario: Execução bem-sucedida
- **WHEN** o relatório é gravado
- **THEN** a única saída final ao usuário é `Relatório gerado: <nome-do-arquivo>.md`

#### Scenario: Falha acionável
- **WHEN** a execução não pode prosseguir (ex.: sem modo disponível)
- **THEN** o agente emite uma única mensagem de erro com a ação corretiva, em vez do silêncio

### Requirement: Portabilidade e ausência de efeitos colaterais globais
A skill SHALL funcionar em Linux, macOS e Windows exigindo no máximo `docker` e `node` >= 18, SHALL NOT depender de caminhos fixos (como `.agents/skills/...` ou `/tmp/opencode`), SHALL usar `os.tmpdir()` para temporários e SHALL NOT instalar pacotes globalmente.

#### Scenario: Localização dos scripts
- **WHEN** a skill é instalada em qualquer diretório
- **THEN** os scripts são localizados relativamente ao próprio arquivo e funcionam sem configuração de caminho

#### Scenario: Sem instalação global
- **WHEN** uma dependência do fallback é necessária
- **THEN** ela é instalada em diretório temporário local e nenhum `npm i -g` é executado

#### Scenario: Remoção do legado
- **WHEN** a reescrita é concluída
- **THEN** `scanners/`, `references/` por linguagem e os sub-agentes por categoria não existem mais na skill
