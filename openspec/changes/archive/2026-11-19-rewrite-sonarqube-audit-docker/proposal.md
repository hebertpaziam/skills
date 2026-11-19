## Why

A skill `sonarqube-audit` tenta *ser* o SonarQube: usa regex (`scan.mjs`) como "fonte de verdade" e sub-agentes LLM para detectar violações a partir de ~2.700 linhas de referências. O resultado não bate com o Sonar real: o S5131 marca todo `${...}` em JSP (inclusive dentro de `<c:out>`/`fn:escapeXml`), então corrigir o código não zera o alerta; S1313 marca versões, S1186 marca construtor de DI do Angular, vários códigos de regra estão errados (S1128, S1442), hotspots são tratados como issues e a severidade usa só a escala antiga. O objetivo do usuário é corrigir o que o SonarQube realmente aponta, então a detecção deve vir do próprio Sonar.

## What Changes

- **BREAKING** Reescrita completa da skill `sonarqube-audit`: a detecção passa a ser feita pelo SonarQube Community (analisadores reais, perfil "Sonar way"), e não mais por regex/LLM.
- Novo orquestrador Node (stdlib, multiplataforma) que executa o ciclo: subir `sonarqube:community` via Docker → bootstrap por API (trocar senha admin, gerar token, criar projeto) → `sonar-scanner-cli` via Docker → coletar issues e hotspots paginados (contornando o limite de 10k) → normalizar em `issues.json`.
- `issues.json` normalizado: issue key estável, regra, tipo, severidade clássica + impacto MQR, status, arquivo:linha; hotspots em lista separada (não contam como vulnerabilidade).
- Diff determinístico entre execuções por issue key (`✅ corrigida` / `❌ persiste` / `🆕 nova`) feito por script, não pelo LLM.
- Renderização determinística do relatório mantendo o formato atual (`_shared/report-template.md`: seções, ordem, ícones, 5 fases, glossário, prompt de correção, `sonarqube-reports/<projeto>_<timestamp>.md`, pt-BR, saída de terminal de uma linha), com novo indicador de modo (Docker/SonarQube vs. aproximado).
- O LLM passa a apenas explicar regras (via `api/rules/show`), agrupar em fases e escrever o prompt de correção.
- Modo fallback sem Docker: `eslint-plugin-sonarjs` somente para JS/TS (Java/JSP não são analisados); o relatório declara de forma destacada que o resultado é **aproximado** e não equivale ao SonarQube.
- Opcional: aceitar URL + token de um servidor SonarQube existente, pulando o Docker.
- Remoção: `references/` por linguagem (~2.700 linhas), `scanners/sg-rules/`, `sgconfig.yml`, `scan.mjs` baseado em regex, sub-agentes por categoria, caminhos fixos `.agents/skills/...` e `/tmp/opencode`, `npm i -g` silencioso.
- Mantidos: invocação explícita obrigatória e protocolo de confirmação.

## Capabilities

### New Capabilities
- `sonar-analysis-engine`: execução do SonarQube Community em Docker (ou servidor existente via URL+token), bootstrap automatizado, scan, coleta paginada de issues/hotspots e normalização em `issues.json`.
- `sonar-fallback-mode`: análise aproximada JS/TS com `eslint-plugin-sonarjs` quando Docker/servidor estão indisponíveis, com cobertura explicitamente limitada e sinalização de resultado aproximado.
- `audit-report`: diff por issue key entre execuções, renderização determinística do relatório no formato atual, indicador de modo, e papel restrito do LLM (explicar, faseear, prompt de correção).
- `audit-skill-invocation`: regras de ativação explícita, confirmação do usuário, saída mínima no terminal e portabilidade (sem caminhos fixos, sem instalações globais silenciosas).

### Modified Capabilities
<!-- Nenhuma: não existem specs em openspec/specs/. -->

## Impact

- Código: `sonarqube-audit/SKILL.md` reescrito; `sonarqube-audit/scanners/*` e `sonarqube-audit/references/**` removidos (exceto `_shared/report-template.md`, adaptado); novos scripts Node em `sonarqube-audit/scripts/`.
- Dependências do usuário: `docker` + `node` >= 18 (modo principal); `node` + `npm`/`npx` (fallback, instalado localmente, não global).
- Recursos: ~2–4 GB de RAM e 1–2 min de bootstrap na primeira execução; `vm.max_map_count` do host precisa atender o Elasticsearch embutido.
- Limitações aceitas: Community não tem taint analysis (ex.: S5131 como no Developer); Java sem bytecode perde precisão em regras semânticas; JSP é coberto apenas pelas regras do plugin Web.
- Comportamento: números do relatório mudam (esperado) e deixam de ser comparáveis com relatórios antigos; o primeiro relatório novo trata tudo como `🆕 nova`.
