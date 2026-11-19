## 1. Preparação e decisões abertas

- [x] 1.1 Verificar e fixar as tags estáveis de `sonarqube:community` e `sonarsource/sonar-scanner-cli` (constantes em um único lugar)
- [x] 1.2 Definir o local de armazenamento das credenciais do Sonar local (`~/.config/sonarqube-audit/`, permissão restrita) e o schema do JSON de enriquecimento do LLM
- [x] 1.3 Criar a estrutura `sonarqube-audit/scripts/` (`audit.mjs` + `lib/`) com CLI e flags (`--keep`, `--port`, `--mode`)

## 2. Motor Docker (sonar-analysis-engine)

- [x] 2.1 Implementar `lib/docker.mjs`: detecção do daemon, `docker run/start/stop` do container `sonarqube-audit-server` com volumes nomeados e escolha de porta livre
- [x] 2.2 Implementar espera por `status=UP` com timeout, reuso de container saudável e diagnóstico de falha (logs + dica de `vm.max_map_count`)
- [x] 2.3 Implementar `lib/sonar-api.mjs`: cliente com `fetch` nativo, autenticação, bootstrap idempotente (trocar senha admin, gerar token, criar projeto)
- [x] 2.4 Implementar execução do `sonar-scanner-cli` via Docker (montagem somente leitura, exclusões de `.gitignore` e vendor/build, `sonar.java.binaries` com fallback para diretório vazio, rede host/`host.docker.internal` por SO)
- [x] 2.5 Implementar coleta paginada de issues com particionamento para o limite de 10k e deduplicação por key
- [x] 2.6 Implementar coleta de hotspots em lista separada e obtenção de metadados de regra via `api/rules/show`
- [x] 2.7 Implementar `lib/normalize.mjs` e a gravação de `issues.json` com bloco `meta` (modo, versões, timestamp)
- [x] 2.8 Implementar o modo `server` (SONAR_URL + SONAR_TOKEN) reutilizando coleta/normalização e pulando Docker

## 3. Fallback aproximado (sonar-fallback-mode)

- [x] 3.1 Implementar `lib/fallback-eslint.mjs`: instalar `eslint`, `eslint-plugin-sonarjs` e parser TS em diretório temporário (sem `-g`)
- [x] 3.2 Gerar config ESLint apenas com regras `sonarjs/*`, executar sobre JS/TS respeitando `.gitignore` e mapear saída para o schema normalizado (`source: "eslint-sonarjs"`)
- [x] 3.3 Criar tabela de mapeamento `sonarjs/*` → código Sonar para as regras mais comuns
- [x] 3.4 Listar extensões não analisadas (Java/JSP/XML/config) em `meta` para uso no relatório

## 4. Relatório (audit-report)

- [x] 4.1 Adaptar `references/report-template.md` (migrar de `_shared/`): campo "Modo de análise", versões, limitações, aviso de resultado aproximado e subseção de hotspots
- [x] 4.2 Implementar `lib/diff.mjs` derivando `corrigida/persiste/nova/N-A` do histórico do SonarQube (`creationDate` das issues abertas, `closeDate`/`resolution` das fechadas, baseline = análise anterior), sem arquivos de estado
- [x] 4.3 Implementar `lib/render.mjs`: faseamento (severidade × esforço), impacto MQR, seções vazias, ícones, nome `<pasta>_<timestamp>.md`
- [x] 4.4 Definir e implementar a leitura do JSON de enriquecimento do LLM (texto de correção por regra, glossário, prompt de correção) validando que contagens/issues não são alteradas
- [x] 4.5 Implementar o banner de aviso do modo aproximado e a omissão da seção de estado anterior sem histórico

## 5. SKILL.md e invocação (audit-skill-invocation)

- [x] 5.1 Reescrever `SKILL.md` (< 120 linhas): ativação explícita, confirmação informativa (modo, consumo, local), fluxo com comando único, papel do LLM e saída de uma linha
- [x] 5.2 Atualizar a `description` do frontmatter removendo "~976 regras" e refletindo o novo escopo
- [x] 5.3 Garantir ausência de caminhos fixos e de `npm i -g`; usar `os.tmpdir()` e resolução via `import.meta.url`

## 6. Validação

- [x] 6.1 Testar em projeto Java+JSP: contagens de issues e hotspots por severidade devem bater com a UI do SonarQube
- [x] 6.2 Reproduzir o caso original: corrigir um alerta em JSP e confirmar que a execução seguinte o marca como `✅ corrigida`
- [x] 6.3 Testar em projeto Angular/TS nos modos docker e approximate, conferindo o banner e o campo de modo
- [x] 6.4 Testar reexecução (reuso de container, bootstrap idempotente, diff persiste/corrigida) e cenário de porta 9000 ocupada
- [x] 6.5 Testar em WSL2 e, se possível, Windows/macOS (caminhos e rede do container) (validado apenas em WSL2; Windows/macOS não testados)

## 7. Remoção do legado

- [x] 7.1 Remover `scanners/` (`scan.mjs`, `sgconfig.yml`, `sg-rules/`) e `references/` por linguagem (`java/`, `typescript/`, `web/`, `config/`, `universal/`)
- [x] 7.2 Remover referências a sub-agentes, árvore de decisão e categorias de qualquer documentação restante
- [x] 7.3 Atualizar README/documentação do repositório com requisitos (docker + node), modos e limitações
