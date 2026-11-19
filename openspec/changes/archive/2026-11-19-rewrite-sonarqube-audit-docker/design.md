## Context

A skill atual (`sonarqube-audit/`) tem ~2.750 linhas: `SKILL.md` (404), `scan.mjs` (414, regex + ast-grep), regras ast-grep, e ~50 arquivos de referência por linguagem consumidos por até 6 sub-agentes. A detecção é feita por regex/LLM e declarada "fonte de verdade", o que produz falsos positivos (ex.: S5131 em todo `${}` de JSP) e divergência do SonarQube real. O usuário usa SonarQube Community, sem servidor corporativo, e quer corrigir o que o Sonar aponta. Docker está disponível (WSL2). Restrições: multiplataforma (Linux/macOS/Windows), mínimo de dependências (docker + node >= 18), relatório em pt-BR no formato atual.

## Goals / Non-Goals

**Goals:**
- Detecção feita pelo SonarQube real (Community, perfil "Sonar way") rodando em Docker, com bootstrap 100% automatizado.
- Pipeline determinístico: scan → `issues.json` → diff por issue key → relatório. O LLM só interpreta.
- Fallback honesto (JS/TS via `eslint-plugin-sonarjs`) com resultado explicitamente marcado como aproximado.
- Manter o formato do relatório e a invocação explícita com confirmação.
- Redução drástica de código/referências e de tokens por execução.

**Non-Goals:**
- Taint analysis / regras exclusivas de Developer Edition.
- Substituir o quality gate de um SonarQube corporativo.
- Analisar Java/JSP/XML sem Docker ou servidor.
- Manter comparabilidade com relatórios gerados pela versão antiga.
- Aplicar correções automaticamente (a skill continua só gerando relatório e prompt).

## Decisions

### D1. SonarQube real como motor; LLM como intérprete
Os números vêm da API do Sonar. O LLM recebe `issues.json` já consolidado e produz apenas: explicação de regra, agrupamento em fases e prompt de correção.
*Alternativas:* manter regex+LLM com ajustes (rejeitada: a causa raiz é a arquitetura, não as regex); só ast-grep (rejeitada: continua não tendo paridade com o Sonar).

### D2. Modos de execução com seleção automática e ordem de preferência
```
  SONAR_URL+SONAR_TOKEN definidos? ──sim──▶ modo "server"  (sem Docker)
            │ não
  docker info OK? ──sim──▶ modo "docker"   (SonarQube Community local)
            │ não
  node/npx disponível e há JS/TS? ──sim──▶ modo "approximate" (sonarjs)
            │ não
  abortar com mensagem clara
```
No modo `server` a skill **apenas coleta** o que já foi analisado no servidor (não executa scanner nem sobe container; a data da última análise vai para o relatório). `server` e `docker` produzem relatório "SonarQube"; `approximate` produz relatório com banner de aviso.

### D3. Estrutura de arquivos
```
sonarqube-audit/
  SKILL.md                      (curto: ativação, confirmação, fluxo, papel do LLM)
  references/report-template.md (template atual, + campo "Modo de análise")
  scripts/
    audit.mjs                   (orquestrador / CLI único)
    lib/docker.mjs  lib/sonar-api.mjs  lib/normalize.mjs
    lib/diff.mjs    lib/render.mjs     lib/fallback-eslint.mjs
```
Node stdlib apenas (fetch nativo do Node 18+, `child_process`, `fs`). Sem caminhos fixos: diretório de trabalho temporário via `os.tmpdir()`; script localizado por `import.meta.url`.

### D4. Ciclo de vida do container (modo docker)
- Imagem `sonarqube:community` (tag fixada em constante) com volumes nomeados para dados/extensões, para reuso e para o scan seguinte ser mais rápido. Container com nome fixo `sonarqube-audit-server`, porta host configurável (padrão 9000, escolhe livre se ocupada).
- Reuso: se o container já roda e responde em `/api/system/status` = `UP`, reaproveita; senão `docker start`/`docker run`.
- Espera por `UP` com timeout (padrão 5 min) e mensagem de erro com dica de `vm.max_map_count` se o container sair.
- Bootstrap idempotente: trocar a senha `admin` (padrão `admin`) para uma senha gerada e persistida em arquivo de credenciais local do usuário (fora do projeto e fora do git); gerar token de usuário; criar o projeto por `api/projects/create` (key derivada do nome da pasta, sanitizada).
- Scan com `sonarsource/sonar-scanner-cli` via `docker run` montando o projeto somente leitura e usando rede do host/`host.docker.internal` conforme SO; `sonar.sources` na raiz, exclusões herdadas de `.gitignore` + padrões de vendor/build, `sonar.java.binaries` apontando para `target/classes`/`build/classes` se existirem, senão para diretório vazio temporário.
- Por padrão o container é **parado** ao final (`docker stop`) para liberar RAM; `--keep` mantém rodando.
*Alternativas:* container efêmero por execução (rejeitada: 1–2 min de boot e perda de histórico a cada vez); sonar-scanner nativo (rejeitada: exige Java/instalação).

### D5. Coleta e normalização
- Issues: `api/issues/search` com `ps=500`, paginação; para contornar o limite de 10.000, fatiar por `severities`/`types`/`rules` (ou por `componentKeys`/diretório) até cada fatia caber; deduplicar por `key`.
- Hotspots: `api/hotspots/search` separado; saem em lista própria (`hotspots[]`), exibidos em seção/subseção própria como "a revisar", nunca somados em vulnerabilidades.
- Campos normalizados: `key`, `rule`, `type`, `severity` (BLOCKER…INFO), `impacts[]` (MQR: qualidade + High/Medium/Low), `status`, `file` (relativo, `/`), `line`, `message`, `effort`, `source: "sonarqube" | "eslint-sonarjs"`.
- Regras: metadados (nome/descrição) sob demanda via `api/rules/show`, cache em `issues.json` apenas para as regras presentes — usado pelo glossário e pela explicação.
- Fases mapeiam a severidade clássica (BLOCKER+CRITICAL / MAJOR / MINOR+INFO) × esforço (`effort` ≤ 5min = Fácil). Impacto MQR é exibido junto, sem substituir o faseamento.

### D6. Diff persiste/corrigida/nova pelo histórico do Sonar
Nenhum arquivo de estado é gravado no projeto. O SonarQube já rastreia issues entre análises do mesmo projeto; o baseline é a **análise anterior à mais recente** (`api/project_analyses/search`). Então: `🆕 nova` = issue aberta com `creationDate` posterior ao baseline; `❌ persiste` = aberta com `creationDate` até o baseline; `✅ corrigida` = fechada com `resolution=FIXED` e `closeDate` posterior ao baseline; `➖ N/A` = fechada com `resolution=REMOVED`. Com uma única análise → "Primeira auditoria". No modo aproximado não há histórico, e o relatório informa que a comparação está indisponível.
*Trade-off:* o histórico mora nos volumes Docker (`sonarqube-audit-*`); apagá-los zera o diff. *Alternativas:* arquivos `.state/` no projeto (rejeitada: poluem o repositório e duplicam o que o Sonar já guarda); LLM relendo relatórios (rejeitada: não determinístico).

### D7. Renderização determinística
`render.mjs` gera o `.md` seguindo `references/report-template.md` (mesmas seções, ordem, ícones, 5 fases, seções vazias com "Nenhuma violação encontrada nesta fase."). O LLM fornece, via arquivo JSON de enriquecimento, apenas: texto de correção por regra, glossário e o prompt de correção; o script faz a montagem. Isso elimina divergência de formato. A seção "Metodologia e Limitações" ganha o campo **Modo de análise** e, em `approximate`, um bloco de aviso no topo do relatório.

### D8. Fallback aproximado
`eslint` + `eslint-plugin-sonarjs` instalados em diretório temporário da skill (`npm install --prefix <tmp>`, nunca `-g`), com consentimento já coberto pela confirmação inicial da skill. Config gerada apenas com regras `sonarjs/*`; apenas `.js/.jsx/.ts/.tsx` (TS exige `typescript-eslint` parser). Findings são mapeados para o schema normalizado com `source: "eslint-sonarjs"`, regra Sonar quando mapeável (`sonarjs/cognitive-complexity` → S3776), senão o id eslint. Java/JSP/XML listados como "não analisados" no relatório.

### D9. Portabilidade e segurança
- Sem `/tmp/opencode`, sem `.agents/skills`: saída padrão em `<projeto>/sonarqube-reports/`; temporários em `os.tmpdir()`.
- Nenhuma instalação global. Credenciais do Sonar local ficam fora do repositório do projeto; token nunca é impresso.
- Windows: `shell` só quando necessário; caminhos convertidos para o formato aceito pelo Docker Desktop.

### D10. Papel e tamanho do SKILL.md
`SKILL.md` descreve: ativação explícita, confirmação, comando único `node scripts/audit.mjs <projeto>`, como ler `issues.json` e produzir o JSON de enriquecimento, e a saída final de uma linha. Remove sub-agentes, árvore de decisão e categorias. Meta: < 120 linhas.

## Risks / Trade-offs

- [Community sem taint analysis → menos achados que um Developer Edition] → Declarar na seção de limitações do relatório.
- [Java sem bytecode perde regras semânticas] → Detectar `target/classes`/`build/classes`; avisar no relatório quando ausentes e sugerir rodar build antes.
- [Container exige RAM e `vm.max_map_count` ≥ 262144] → Pré-checagem e mensagem acionável; `approximate` como saída alternativa.
- [JSP só tem regras do plugin Web, não S5131] → Documentar; é o comportamento real do Sonar do usuário, que é o alvo.
- [Primeira execução lenta (pull de imagens ~1–2 GB + boot)] → Aviso na confirmação; volumes reutilizados nas seguintes.
- [Porta 9000 ocupada / container de outra origem com mesmo nome] → Porta livre automática; nome dedicado `sonarqube-audit-server`.
- [Mudança de versão da imagem altera o conjunto de regras] → Tag fixada e registrada no relatório (versão do Sonar e do scanner).
- [Fallback pode ser confundido com resultado oficial] → Banner obrigatório no topo + campo "Modo de análise" + nenhuma menção a "SonarQube" como fonte nos números.
- [Perda de comparabilidade com relatórios antigos] → Documentado no Impact; primeiro relatório novo = tudo `🆕 nova`.

## Migration Plan

1. Implementar `scripts/` e novo `SKILL.md` em paralelo ao conteúdo antigo.
2. Validar em projeto de exemplo (Java+JSP e Angular) comparando com a UI do Sonar (contagens de issues e hotspots por severidade devem bater).
3. Remover `scanners/` e `references/` antigos num commit separado.
4. Rollback: o histórico do git preserva a skill antiga; reverter o commit de remoção basta.

## Open Questions

- Tag exata de `sonarqube:community` e do `sonar-scanner-cli` a fixar (verificar versão estável vigente na implementação).
- Onde guardar a senha gerada do admin local: arquivo em diretório de config do usuário (`~/.config/sonarqube-audit/`) vs. keychain do SO. Proposta inicial: arquivo com permissão restrita.
- Nome do JSON de enriquecimento e seu schema mínimo (definir na implementação junto ao `render.mjs`).
- Incluir `--keep` e porta configurável como flags públicas ou variáveis de ambiente.
