---
name: sonarqube-audit
description: 'Audita o projeto com o SonarQube Community real (rodando em Docker, ou servidor existente via SONAR_URL/SONAR_TOKEN) e gera um relatório de saúde em Markdown em sonarqube-reports/, com plano de ação em 5 fases e diff persiste/corrigida/nova por issue. Sem Docker, cai num modo APROXIMADO (eslint-plugin-sonarjs, só JS/TS) sinalizado no relatório. Use SOMENTE quando o usuário pedir explicitamente uma auditoria SonarQube.'
---

# SonarQube Audit

A detecção é feita pelo **SonarQube** (não por regex nem por LLM). Os scripts executam a análise, coletam issues e hotspots, comparam com a execução anterior e renderizam o relatório. **O LLM apenas explica regras, sugere correções e escreve o prompt de correção.**

**Idioma do relatório:** pt-BR · **Requisitos:** `node` >= 18 + `docker` (modo principal).

## Quando ativar

Somente com pedido **explícito**: "audit sonarqube", "scan sonarqube", "relatório sonarqube", "verificar violações", "revisar compliance". Pedidos ambíguos ("analisa o projeto", "qualidade do código", "verifica esse código") **não** ativam — pergunte antes.

Se a intenção não for 100% clara, rode `detect` (abaixo) e confirme informando o modo:

> Vou rodar uma auditoria SonarQube neste projeto no modo **{modo}**. {Docker: baixa/sobe o SonarQube Community em Docker (~2–4 GB de RAM; a 1ª execução demora alguns minutos) | Aproximado: sem Docker o resultado é apenas aproximado e só cobre JS/TS}. O relatório vai para `sonarqube-reports/`. Confirma? (sim/não)

Só execute após confirmação explícita.

## Fluxo

`SK` = diretório desta skill (onde está este arquivo). `PROJ` = raiz do projeto. Todos os comandos usam apenas Node.

1. **Modo** (opcional, para a confirmação): `node SK/scripts/audit.mjs detect PROJ` → `{"mode": "docker|server|approximate", "notes": [...]}`.
2. **Scan:** `node SK/scripts/audit.mjs scan PROJ` → imprime o caminho do `issues.json`. Escolha automática do modo: `SONAR_URL`+`SONAR_TOKEN` (servidor; só coleta o que já foi analisado) → Docker → aproximado. Opções: `--mode`, `--keep` (mantém o container rodando), `--port N`.
3. **Enriquecimento (LLM):** leia o `issues.json` (campos `issues`, `hotspots`, `rules`) e escreva um JSON de enriquecimento com `como_corrigir` curto em pt-BR para **cada regra presente**, conforme `references/report-template.md`. Use `rules[<regra>].name/description` do próprio `issues.json`; só se faltar contexto consulte `api/rules/show`. Não altere contagens, severidades nem a lista de issues.
4. **Render:** `node SK/scripts/audit.mjs render PROJ --issues <issues.json> --enrich <enriquecimento.json>` → grava `sonarqube-reports/<projeto>_<timestamp>.md`. O diff corrigida/persiste/nova vem do histórico do próprio SonarQube (nenhum arquivo de estado é criado no projeto); no modo aproximado não há diff.

Salve o JSON de enriquecimento em diretório temporário do sistema (nunca dentro do projeto).

## Regras de ouro

- **O Sonar é a fonte de verdade.** Nunca detecte, adicione, remova ou reclassifique violações por conta própria. Se um alerta parecer falso positivo, registre isso no `como_corrigir`; não o oculte.
- **Hotspots não são vulnerabilidades** — o relatório os mostra à parte.
- **Modo aproximado:** o relatório já traz o aviso; nunca descreva esses números como "do SonarQube".
- **Saída no terminal:** nenhum texto intermediário. Ao final, apenas a linha impressa pelo `render` (`Relatório gerado: <arquivo>.md`). Se um script falhar (`ERRO: ...`), emita uma única mensagem com o erro e a ação corretiva.
- Nunca instale nada globalmente; nunca imprima tokens/senhas.

## Falsos positivos conhecidos (reflita no `como_corrigir`)

- `Web:S5256` (tabela sem `<th>`): o Sonar analisa o template isolado e não enxerga `<th>` vindo de `<ng-content>`/slot ou de outro template. Antes de sugerir correção, verifique o uso do componente; se o cabeçalho é projetado, indique "False Positive" (e, se quiserem versionar, `sonar.issue.ignore.multicriteria` em `sonar-project.properties`). Nunca sugira `role="presentation"` para tabela de dados — só para tabela de layout.
- Em geral: se a causa for conteúdo projetado/dinâmico fora do arquivo, diga isso explicitamente em vez de propor uma mudança que degrade acessibilidade ou duplique markup.

## Limitações conhecidas (já descritas no relatório)

- Community não tem análise de taint; JSP é coberto só pelas regras do plugin Web do Sonar.
- Java sem `target/classes`/`build/classes` perde precisão em regras semânticas — compile antes para melhor fidelidade.
- Docker local: o Elasticsearch embutido exige `vm.max_map_count >= 262144` no host.
- Sem permissão no socket do Docker (usuário fora do grupo `docker`) → a skill cai no modo aproximado e avisa.
