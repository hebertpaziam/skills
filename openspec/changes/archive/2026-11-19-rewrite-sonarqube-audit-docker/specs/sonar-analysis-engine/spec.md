## ADDED Requirements

### Requirement: Seleção de modo de execução
O sistema SHALL escolher o modo de análise nesta ordem de preferência: `server` (quando `SONAR_URL` e `SONAR_TOKEN` estiverem definidos), `docker` (quando o daemon Docker responder), `approximate` (fallback). O modo escolhido SHALL ser registrado em `issues.json` e exibido no relatório.

#### Scenario: Servidor existente informado
- **WHEN** `SONAR_URL` e `SONAR_TOKEN` estão definidos
- **THEN** o sistema usa o modo `server` e não inicia nenhum container

#### Scenario: Docker disponível
- **WHEN** não há servidor configurado e `docker info` retorna sucesso
- **THEN** o sistema usa o modo `docker`

#### Scenario: Nenhum modo possível
- **WHEN** não há servidor, Docker nem `node`/`npx` com arquivos JS/TS
- **THEN** o sistema aborta com mensagem clara indicando o que instalar

### Requirement: Ciclo de vida do SonarQube Community em Docker
O sistema SHALL executar `sonarqube:community` (tag fixada) em um container dedicado `sonarqube-audit-server` com volumes nomeados, reaproveitar um container já saudável, aguardar `status=UP` com timeout e parar o container ao final, exceto quando solicitado a mantê-lo.

#### Scenario: Container já em execução
- **WHEN** o container dedicado responde `UP` em `/api/system/status`
- **THEN** o sistema o reutiliza sem recriá-lo

#### Scenario: Container falha ao iniciar
- **WHEN** o container encerra antes de ficar `UP`
- **THEN** o sistema exibe os últimos logs e a dica de ajustar `vm.max_map_count` quando aplicável

#### Scenario: Porta ocupada
- **WHEN** a porta 9000 do host já está em uso por outro processo
- **THEN** o sistema escolhe uma porta livre e usa essa porta em todas as chamadas

#### Scenario: Encerramento padrão
- **WHEN** a coleta termina sem a opção de manter o servidor
- **THEN** o container é parado

### Requirement: Bootstrap automatizado e idempotente
O sistema SHALL, sem interação do usuário, trocar a senha padrão do `admin`, gerar um token de usuário e criar o projeto (key derivada do nome da pasta, sanitizada). Repetir o processo SHALL NOT falhar nem duplicar recursos. As credenciais geradas SHALL ser armazenadas fora do repositório do projeto e o token SHALL NOT ser impresso.

#### Scenario: Primeira execução
- **WHEN** o SonarQube local acaba de ser criado com a senha padrão
- **THEN** a senha é trocada, um token é gerado e o projeto é criado

#### Scenario: Execução subsequente
- **WHEN** credenciais e projeto já existem
- **THEN** o sistema as reutiliza sem recriar o projeto

### Requirement: Execução do scanner
O sistema SHALL executar `sonarsource/sonar-scanner-cli` via Docker sobre a raiz do projeto, excluindo caminhos do `.gitignore` e diretórios de dependências/build, e SHALL apontar `sonar.java.binaries` para `target/classes` ou `build/classes` quando existirem, ou para um diretório vazio caso contrário, registrando o aviso de bytecode ausente.

#### Scenario: Projeto Java compilado
- **WHEN** existe `target/classes`
- **THEN** `sonar.java.binaries` aponta para esse diretório

#### Scenario: Projeto Java sem build
- **WHEN** não existe diretório de classes compiladas
- **THEN** o scan prossegue com diretório vazio e o relatório registra a limitação de precisão

#### Scenario: Arquivos ignorados
- **WHEN** um arquivo está no `.gitignore` ou em `node_modules`/`target`/`dist`
- **THEN** ele não é enviado ao scan

### Requirement: Coleta paginada de issues e hotspots
O sistema SHALL coletar todas as issues via `api/issues/search` com paginação e SHALL contornar o limite de 10.000 resultados particionando a consulta; SHALL coletar hotspots via `api/hotspots/search` em lista separada; SHALL deduplicar por chave.

#### Scenario: Mais de 10.000 issues
- **WHEN** uma consulta retorna total acima de 10.000
- **THEN** o sistema particiona por severidade/tipo/regra e obtém todas as issues sem duplicatas

#### Scenario: Hotspots separados
- **WHEN** o projeto possui security hotspots
- **THEN** eles aparecem em `hotspots[]` e NÃO são contados como issues nem como vulnerabilidades

### Requirement: Normalização em issues.json
O sistema SHALL produzir `issues.json` contendo, para cada issue: `key`, `rule`, `type`, `severity`, `impacts` (MQR quando disponível), `status`, `file` (relativo à raiz, com `/`), `line`, `message`, `effort` e `source`; e o bloco `meta` com modo, versão do SonarQube, versão do scanner e timestamp.

#### Scenario: Campos obrigatórios
- **WHEN** `issues.json` é gerado
- **THEN** toda issue contém todos os campos listados, usando `null` quando a informação não existir

#### Scenario: Metadados de regra sob demanda
- **WHEN** o relatório precisa explicar uma regra presente nas issues
- **THEN** o sistema obtém nome e descrição por `api/rules/show` apenas para as regras presentes
