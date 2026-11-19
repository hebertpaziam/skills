# sonar-fallback-mode Specification

## Purpose

Análise aproximada de JS/TS com eslint-plugin-sonarjs quando Docker e servidor não estão disponíveis, sempre sinalizada como resultado aproximado.

## Requirements

### Requirement: Fallback aproximado para JS/TS
Quando Docker e servidor estiverem indisponíveis, o sistema SHALL analisar arquivos `.js`, `.jsx`, `.ts` e `.tsx` com `eslint-plugin-sonarjs`, instalado localmente em diretório temporário (nunca globalmente), e SHALL normalizar os achados para o mesmo schema de `issues.json` com `source: "eslint-sonarjs"`.

#### Scenario: Projeto JS/TS sem Docker
- **WHEN** não há Docker nem servidor e existem arquivos JS/TS
- **THEN** o sistema roda o ESLint com regras `sonarjs/*` e gera `issues.json` com `meta.mode = "approximate"`

#### Scenario: Instalação local
- **WHEN** as dependências do fallback ainda não estão instaladas
- **THEN** o sistema as instala em diretório temporário sem alterar pacotes globais nem o `package.json` do projeto

#### Scenario: Mapeamento de regra
- **WHEN** uma regra `sonarjs/*` possui código Sonar equivalente conhecido
- **THEN** o achado usa o código Sonar (ex.: `sonarjs/cognitive-complexity` → `S3776`), caso contrário usa o id da regra ESLint

### Requirement: Cobertura limitada declarada
No modo aproximado o sistema SHALL NOT analisar Java, JSP, XML nem arquivos de configuração, e SHALL listar no relatório as extensões presentes no projeto que não foram analisadas.

#### Scenario: Projeto Java + JSP em modo aproximado
- **WHEN** o projeto contém `.java` e `.jsp` e o modo é `approximate`
- **THEN** esses arquivos são listados como "não analisados" e nenhum achado é gerado para eles

### Requirement: Sinalização obrigatória de resultado aproximado
No modo aproximado o relatório SHALL exibir, no topo, um aviso destacado de que o resultado é apenas aproximado e não equivale ao SonarQube, SHALL exibir `Modo de análise: aproximado (eslint-plugin-sonarjs)` na seção de metodologia e SHALL NOT apresentar os números como resultado do SonarQube.

#### Scenario: Relatório em modo aproximado
- **WHEN** o relatório é gerado com `meta.mode = "approximate"`
- **THEN** o aviso de resultado aproximado aparece antes do Resumo Executivo e o campo de modo reflete o fallback

#### Scenario: Relatório em modo docker ou server
- **WHEN** o modo é `docker` ou `server`
- **THEN** o aviso de aproximação NÃO aparece e o modo é exibido como SonarQube com sua versão
