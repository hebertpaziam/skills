---
name: sonarqube-audit
description: 'Audita o codebase completo contra regras SonarQube e gera um relatório de saúde em Markdown na pasta sonarqube-reports/ do projeto, refletindo o ESTADO ATUAL verificado no código (não presumido do histórico). Cobre ~976 regras (TypeScript + Java). Reanalisa 100% dos arquivos elegíveis a cada execução, re-verifica issues do relatório anterior mais recente contra o código real (marcando corrigida/persiste/nova) e inclui plano de ação faseado por criticidade.'
---

# SonarQube Audit

Audita **todos** os arquivos do projeto contra regras SonarQube e produz um relatório `.md` completo na pasta `sonarqube-reports/` do projeto, que reflete o **estado atual de saúde** da aplicação verificado diretamente no código.

**Idioma do relatório:** pt-BR
**Output no terminal:** NENHUM durante a execução. Apenas uma linha final com o nome do arquivo gerado. O LLM deve trabalhar silenciosamente usando tools — sem emitir texto intermediário ao usuário.

---

## Princípios Fundamentais (não negociáveis)

Estes princípios governam **toda** execução da skill e prevalecem sobre qualquer outra instrução em caso de conflito.

### 1. Estado verificado, nunca presumido

O relatório reflete o **estado atual real do código**, apurado nesta execução. É **PROIBIDO**:

- Copiar contagens, violações ou listas de relatórios anteriores como se ainda fossem verdade.
- Presumir que uma issue reportada no passado ainda existe. **Toda** issue precisa ser confirmada relendo o código atual.
- Gerar seções de "reconciliação" comparando as próprias versões anteriores do relatório entre si. O código é a única fonte de verdade — não os relatórios passados.

### 2. Relatórios anteriores = checklist de re-verificação (não conteúdo)

Relatórios anteriores (`sonarqube-reports/<nome>_<timestamp>.md`) servem **apenas** como:

- **Checklist de re-verificação:** para cada issue previamente reportada, reabrir o arquivo/linha e confirmar no código atual se ela **persiste** (`❌ persiste`) ou foi **corrigida** (`✅ corrigida`).
- **Garantia de cobertura:** a união dos arquivos citados em relatórios anteriores serve para checar que nenhum arquivo previamente analisado ficou de fora desta execução.

Issues novas encontradas nesta passada (que não constavam antes) são marcadas `🆕 nova`.

### 3. Cobertura total e auditável

- Reanalisar **100% dos arquivos elegíveis** em toda execução — nunca amostrar, nunca reaproveitar resultados antigos.
- **Elegível** = todo arquivo de texto do projeto, **exceto** o que está no `.gitignore` e dependências/libs vendorizadas (ex.: `node_modules/`, `vendor/`, `dist/`, `build/`, `target/`, `*.min.js`, `jquery*.js`).
- Antes de gerar o relatório, **auditar a cobertura**: `N_analisados` deve ser igual a `N_elegíveis`. Se divergir, investigar e corrigir antes de prosseguir — um número de cobertura incompleto invalida o relatório.

---

## Quando Ativar

### Invocação explícita obrigatória

Esta skill **NUNCA** deve ser ativada automaticamente ou por inferência. Ela só deve ser executada quando o usuário **explicitamente** solicitar uma auditoria SonarQube.

**Frases que ativam a skill:**
- "audit sonarqube" / "sonarqube audit"
- "scan sonarqube" / "sonarqube scan"
- "relatório sonarqube" / "relatório de qualidade"
- "verificar violações" / "check violations"
- "revisar compliance" / "review compliance"

**Frases ambíguas que NÃO devem ativar diretamente:**
- "verifica esse código" → pode ser code review, não audit
- "tem algum problema aqui?" → pode ser debug, não audit
- "analisa o projeto" → pode ser arquitetura, não compliance
- "qualidade do código" → pode ser refactoring, não audit

### Protocolo de confirmação

Se a intenção do usuário não for 100% clara, **sempre pergunte antes de executar**:

> Você quer executar uma auditoria completa SonarQube no projeto? Isso vai analisar todos os arquivos e gerar um relatório detalhado em Markdown na pasta `sonarqube-reports/` do projeto. Confirma? (sim/não)

**Só execute após confirmação explícita do usuário.**

---

## Consistência do Relatório

O relatório gerado **DEVE** seguir rigorosamente o template definido em `_shared/report-template.md`.

- **Todas as seções do template são obrigatórias** — mesmo que uma seção tenha zero itens, ela deve aparecer com a indicação "Nenhuma violação encontrada nesta fase."
- **A ordem das seções nunca muda** — seguir exatamente a sequência do template
- **Ícones nos títulos são OBRIGATÓRIOS** — NUNCA omitir os ícones. Referência rápida:

  | Seção | Título com Ícone |
  |-------|-----------------|
  | Título principal | `# 🔍 Relatório de Auditoria SonarQube` |
  | Índice | `## 📋 Índice` |
  | Resumo Executivo | `## 📊 Resumo Executivo` |
  | Estado Issues Anteriores | `## 🔁 Estado das Issues Anteriores` (só se houver relatório anterior) |
  | Metodologia | `## ⚠️ Metodologia e Limitações` |
  | Severidade | `## 🎯 Visão Geral por Severidade` |
  | Arquivos | `## 📁 Arquivos com Violações` |
  | Regras | `## 📏 Regras Mais Violadas` |
  | Plano de Ação | `## 🚀 Plano de Ação` |
  | Fase 1 | `### 🔴 Fase 1 — Correções Urgentes e Rápidas` |
  | Fase 2 | `### 🟠 Fase 2 — Correções Urgentes com Refatoração` |
  | Fase 3 | `### 🟡 Fase 3 — Melhorias de Qualidade Rápidas` |
  | Fase 4 | `### 🔵 Fase 4 — Melhorias com Refatoração` |
  | Fase 5 | `### 🟢 Fase 5 — Ajustes Finos` |
  | Glossário | `## 📖 Glossário` |
  | Prompt | `## 🤖 Prompt para Correção Automatizada` |

- **Seções vazias devem aparecer** com "Nenhuma violação encontrada nesta fase."
- **Adaptações permitidas:** nome do projeto, data, linguagem detectada, dados quantitativos, conteúdo das violações encontradas, presença/ausência do bloco OpenSpec

---

## Fluxo de Execução

### Etapa 0 — Scan Determinístico (pré-análise automatizada)

**Esta etapa é 100% mecânica — não requer julgamento do LLM.**

Antes de qualquer análise por sub-agentes, executar o scanner determinístico para detectar violações mecânicas com precisão exata.

**Execução:**

```bash
node .agents/skills/sonarqube-audit/scanners/scan.mjs <project_root> /tmp/opencode
```

O scanner é um único arquivo Node.js (`scan.mjs`), sem dependência de bash/shell — roda **idêntico em Linux, macOS e Windows**. Executa **duas camadas** e mescla os resultados:
1. **Camada determinística (Node puro):** regex de alta precisão sobre o código-fonte, lendo cada arquivo uma vez (baseline, sempre roda). É a **fonte de verdade** dos números. Respeita `.gitignore` (por diretório) e exclui libs vendorizadas/artefatos de build.
2. **Camada AST (`ast-grep`):** patterns tree-sitter que detectam padrões que regex não alcança de forma confiável (ex.: S2068 credencial hardcoded em atribuição, S2095 recurso não fechado). Achados AST duplicados sobre o mesmo `file:line:rule` são descartados — a camada determinística vence.
3. Gera `/tmp/opencode/findings.json` com todas as violações mescladas.

**Pré-requisitos:** `node` (>= 18) e `ast-grep`. O `ast-grep` é a única ferramenta externa — instale-o ao adicionar a skill ao projeto:

```bash
npm i -g @ast-grep/cli    # ou: cargo install ast-grep / brew install ast-grep
```

Se ausente, o `scan.mjs` tenta instalá-lo automaticamente via `npm i -g @ast-grep/cli`; não sendo possível, o scan segue **apenas com a camada determinística** (emitindo um WARNING). O binário correto é `ast-grep` — nunca `sg` (no Linux `sg` é o `newgrp`). As regras AST ficam em `scanners/sg-rules/` e são carregadas via `scanners/sgconfig.yml`.

**Saída:** `findings.json` contendo findings com campos: file, line, rule, severity, category, message, match, confidence, source (`deterministic` ou `ast`). O bloco `meta` inclui `tool`, `ast_tool` e `ast_findings_added`.

**Impacto nos sub-agentes (Etapa 3):**
- Sub-agentes recebem o `findings.json` como input
- Para regras já cobertas pelo scanner (S2068, S5131, S106, S1313, S1148, etc.), os sub-agentes **NÃO recontar** — aceitar os números como verdade
- Sub-agentes focam **apenas** em regras que o scanner não cobre (complexidade cognitiva S3776, design patterns, @Override S1161, lógica de negócio)
- Arquivos que só têm violações já detectadas pelo scanner **NÃO precisam ser lidos** pelo sub-agente

**Regras cobertas pelo scanner (não recontar):**
- S2068 (credenciais hardcoded)
- S1313 (IPs hardcoded)
- S5131 (XSS em JSP - EL expressions)
- S2115 (senha de DB vazia)
- S106 (System.out/err)
- S1148 (printStackTrace)
- S1128 (wildcard imports)
- S1135 (TODO/FIXME)
- S2589 (condição always true/false)
- S1186 (método vazio)
- S2386 (mutable public static)
- S6676 (console.log)
- S4830 (SSL reject unauthorized)
- S2245 (Math.random)
- S3330 (cookie sem HttpOnly)
- S5122 (CORS wildcard)
- S2095 (recurso não fechado — camada AST)
- S1442 (debugger statement — camada AST)

**Regras que ficam para os sub-agentes LLM:**
- S3776 (complexidade cognitiva)
- S1161 (@Override ausente)
- S1066 (condições colapsáveis)
- S1452 (wildcard generics)
- S2259 (null dereference)
- S1854 (dead stores — contexto necessário)
- Regras de design/arquitetura
- Regras que requerem análise semântica

### Etapa 1 — Inventário de Arquivos (baseado em .gitignore)

**Esta etapa é mecânica — não requer julgamento.**

1. Ler o arquivo `.gitignore` da raiz do projeto (e `.gitignore` de subdiretórios, se existirem).
2. Construir a lista de exclusão a partir dos patterns do `.gitignore`.
3. Adicionar exclusões padrão (mesmo que não estejam no `.gitignore`):
   - `.git/`
   - **Dependências e libs vendorizadas:** `node_modules/`, `bower_components/`, `vendor/`, `dist/`, `build/`, `target/`, `*.min.js`, `*.min.css`, `jquery*.js`, `jquery*.css` (código de terceiros — não é da aplicação)
   - Binários: `*.class`, `*.jar`, `*.war`, `*.ear`, `*.zip`, `*.tar.gz`, `*.rar`
   - Imagens: `*.png`, `*.jpg`, `*.jpeg`, `*.gif`, `*.svg`, `*.ico`, `*.bmp`
   - Fontes: `*.woff`, `*.woff2`, `*.ttf`, `*.eot`
   - Compilados: `*.pyc`, `*.o`, `*.so`, `*.dll`
4. Listar **TODOS** os arquivos de texto restantes — **sem filtro por extensão**.
5. Registrar o total de arquivos elegíveis (`N_elegíveis`) — este número guia a auditoria de cobertura da Etapa 5.

**CRÍTICO:** Não filtrar por extensão. Arquivos `.jsp`, `.xml`, `.properties`, `.yml`, `.env`, `.cfg`, `.conf`, `.sql`, `.sh`, `.bat`, `.md` — todos devem entrar no inventário. A cobertura deve ser 100% dos arquivos de texto elegíveis.

**ATENÇÃO — projeto sem git:** o projeto pode ter sido clonado sem o diretório `.git`. Não confiar em `git ls-files`. A exclusão de libs/deps deve ser aplicada explicitamente pelos patterns acima (o scanner da Etapa 0 lê os arquivos `.gitignore` diretamente, respeitando-os mesmo sem repositório git).

### Etapa 1.5 — Re-verificação do Histórico (checklist)

**Esta etapa garante que o relatório reflete o estado atual, não o passado.**

1. Localizar relatórios anteriores na pasta **`sonarqube-reports/`** (`<nome>_<timestamp>.md`).
2. Se **não houver** relatório anterior: pular esta etapa (auditoria limpa, tudo será `🆕 nova`).
3. Se houver, aplicar a **leitura otimizada**:
   - **Ler apenas o relatório MAIS RECENTE.** Como cada relatório já re-verifica todo o histórico contra o código, o mais recente é um superset cumulativo da verdade — ler versões anteriores é redundante. Identificar o mais recente pela ordenação lexicográfica do timestamp no nome (o último da lista ordenada).
   - **Ler apenas as seções necessárias** desse relatório, não o arquivo inteiro:
     - `📁 Arquivos com Violações` → cross-check de cobertura
     - `🚀 Plano de Ação` (Fases 1–5) → é onde estão `arquivo + linha + regra` de cada issue (o checklist real)
   - **Pular** metodologia, glossário, prompt de correção e demais seções — não são necessárias para a re-verificação.
4. **Cross-check de cobertura:** garantir que todo arquivo citado no relatório mais recente (e ainda existente/elegível) está no inventário desta execução. Nenhum arquivo previamente analisado pode ficar de fora.
5. Cada issue anterior será re-verificada contra o código atual durante a Etapa 3 e receberá um status:
   - `✅ corrigida` — a issue não existe mais no código atual
   - `❌ persiste` — a issue continua presente
   - `➖ N/A` — o arquivo foi removido ou tornou-se inelegível

**NUNCA** copiar a issue anterior para o novo relatório sem reabrir o código e confirmar seu status. **NUNCA** gerar seção de reconciliação entre versões do relatório.

### Etapa 2 — Classificação por Categoria

Classificar cada arquivo inventariado em uma categoria. A categoria determina quais referências de regras serão aplicadas.

**IMPORTANTE:** Todos os arquivos recebem `universal/scan-all.md` — sempre. A categoria adiciona regras específicas.

```
CATEGORIA       EXTENSÕES                                    REFERÊNCIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
source          *.java                                       java/* + universal/scan-all
template        *.jsp                                        web/jsp + universal/scan-all
typescript      *.ts, *.tsx, *.js, *.jsx, *.mjs, *.cjs,      typescript/* + universal/scan-all
                *.html
config-xml      *.xml                                        config/xml + universal/scan-all
config-secrets  *.properties, *.yml, *.yaml, *.env,          config/secrets + universal/scan-all
                *.cfg, *.conf, *.ini
unknown         qualquer outra extensão de texto              universal/scan-all (somente)
```

**Nota sobre JavaScript:** Arquivos `*.js` e `*.jsx` usam as mesmas referências `typescript/*` (o SonarQube aplica regras idênticas para JS e TS). Regras exclusivas de TypeScript (ex: type intersections, const assertions) devem ser **ignoradas** pelo agente quando o arquivo é `.js` puro.

Agrupar os arquivos por categoria para a próxima etapa.

### Etapa 3 — Análise por Sub-agentes Paralelos

Disparar **um sub-agente por categoria** que tenha arquivos. Cada sub-agente recebe:
- A lista de arquivos da sua categoria
- As referências específicas da categoria
- `universal/scan-all.md` (obrigatório para TODOS os sub-agentes)
- `_shared/report-template.md` (template de output do relatório)
- **Os findings determinísticos da Etapa 0** (para não recontar regras mecânicas)

**IMPORTANTE:** O sub-agente deve pular a leitura de arquivos que só possuem violações já detectadas na Etapa 0. Focar apenas em arquivos que precisam de análise semântica.

```
Sub-agente SOURCE     → arquivos .java           + java/* + universal/scan-all
Sub-agente TEMPLATE   → arquivos .jsp            + web/jsp + universal/scan-all
Sub-agente TYPESCRIPT → arquivos .ts/.tsx/.js/.jsx/.html + typescript/* + universal/scan-all
Sub-agente CONFIG-XML → arquivos .xml            + config/xml + universal/scan-all
Sub-agente CONFIG-SEC → arquivos .properties/.yml/.env + config/secrets + universal/scan-all
Sub-agente UNIVERSAL  → arquivos unknown         + universal/scan-all (somente)
```

**Cada sub-agente, para cada arquivo:**

1. Ler o conteúdo do arquivo.
2. Aplicar PRIMEIRO as regras universais (`universal/scan-all.md`).
3. Aplicar as regras específicas da categoria.
4. Para source/typescript, aplicar também regras de domínio e construtos (ver árvore de decisão abaixo).
5. **Re-verificar issues anteriores (se houver):** para cada issue previamente reportada neste arquivo (Etapa 1.5), confirmar no código atual se ela `❌ persiste` ou foi `✅ corrigida`. Nunca presumir — sempre confirmar lendo o código.
6. Registrar cada violação com:
   - Caminho do arquivo (relativo à raiz do projeto)
   - Número da linha
   - Regra violada (código + título)
   - Severidade (BLOCKER, CRITICAL, MAJOR, MINOR, INFO)
   - Descrição do problema em pt-BR
   - Instrução de correção em pt-BR
   - Estimativa de esforço

**Não pular nenhum arquivo. Não usar amostragem. TODOS os arquivos de TODAS as categorias devem ser analisados.**

### Etapa 4 — Classificação e Faseamento

Consolidar as violações de todos os sub-agentes e organizar em fases usando dois eixos:

| Fase | Criticidade | Facilidade | Descrição |
|------|-------------|------------|-----------|
| 1 | BLOCKER + CRITICAL | Fácil | Correções urgentes e rápidas |
| 2 | BLOCKER + CRITICAL | Difícil | Correções urgentes que exigem refatoração |
| 3 | MAJOR | Fácil | Melhorias de qualidade rápidas |
| 4 | MAJOR | Difícil | Melhorias que exigem mais trabalho |
| 5 | MINOR + INFO | Qualquer | Ajustes finos e sugestões |

**Critérios de facilidade:**
- **Fácil** (≤ 5min): Renomear, remover código morto, adicionar tipo, trocar operador
- **Difícil** (> 5min): Refatorar lógica, extrair classe/função, reestruturar fluxo

### Etapa 5 — Gerar Relatório (Formato Híbrido)

Gerar o relatório dentro da pasta **`sonarqube-reports/`** na raiz do projeto (criar a pasta se não existir), com o nome:
```
sonarqube-reports/<nome-da-pasta-do-projeto>_<AAAA-MM-DDTHHMMSS>.md
```

Onde:
- `<nome-da-pasta-do-projeto>` é o basename do diretório raiz do projeto (em kebab-case, como está)
- `<AAAA-MM-DDTHHMMSS>` é o timestamp da execução (data + hora local), formato ordenável — ex.: `2026-09-15T142530`

Exemplo: `sonarqube-reports/br-novo-portal-prestadores-site_2026-09-15T142530.md`

**Por que timestamp (e não v1/v2/vN):** o timestamp no nome garante ordenação cronológica natural (o mais recente é sempre o último na ordem lexicográfica) e identificação imediata, sem precisar rastrear contadores de versão.

O relatório deve seguir **exatamente** o template definido em `_shared/report-template.md`, substituindo `{linguagem}` pela linguagem correspondente. Para projetos multilinguagem, combinar ambos em um único relatório.

**Auditoria de cobertura (obrigatória antes de escrever o relatório):** confirmar que `N_analisados == N_elegíveis` (Etapa 1). Registrar ambos os números no Resumo Executivo. Se divergirem, o relatório é inválido — investigar a lacuna e reanalisar os arquivos faltantes antes de prosseguir.

**Estado das issues anteriores (obrigatório se houver relatório anterior):** incluir a seção de re-verificação do template, mostrando quantas issues anteriores foram `✅ corrigida`, `❌ persiste` e quantas são `🆕 nova` nesta execução. **PROIBIDO** incluir seção de reconciliação comparando versões anteriores do relatório entre si.

**Formato da seção "Arquivos com Violações":** Seguir exatamente o template em `_shared/report-template.md`. Listar **TODOS** os arquivos com violações — sem corte ou amostragem.

**No prompt de correção (final do relatório):** Seguir exatamente o formato definido em `_shared/report-template.md`. **NÃO listar arquivos/violações no prompt.** O relatório já contém toda a informação necessária.

### Etapa 6 — Output no Terminal

O agente **NÃO deve emitir nenhum texto ao usuário durante a execução**. Todo o trabalho intermediário (scanner, inventário, sub-agentes) acontece silenciosamente via tools.

Após gerar o relatório, emitir **apenas uma linha**:

```
Relatório gerado: <nome-do-arquivo>.md
```

Nada mais. O relatório é autocontido.

---

## Árvore de Decisão — Referências por Contexto

Use esta árvore para determinar quais referências carregar para cada arquivo durante a análise. A árvore opera em 3 camadas:

### Camada 1 — Universal (TODOS os arquivos)

Sempre aplicar `universal/scan-all.md` a qualquer arquivo de texto. Sem exceção.

### Camada 2 — Categoria (por extensão/tipo)

#### Template (JSP)
```
*.jsp → web/jsp (procedimento completo de verificação EL obrigatório)
```

#### Config
```
*.xml                                    → config/xml
*.properties, *.yml, *.yaml, *.env, etc. → config/secrets
```

#### TypeScript/JavaScript
```
*.component.ts    → typescript/base + typescript/fw-angular
*.tsx, *.jsx      → typescript/base + typescript/fw-react
*.spec.ts         → typescript/base + typescript/testing
*.test.ts         → typescript/base + typescript/testing
*.html            → typescript/base + typescript/browser-aria + typescript/browser-dom
*.ts, *.js, etc.  → typescript/base + verificar domínio e construtos
```

**Nota:** Para arquivos `*.js` puros, ignorar regras que dependem de tipos TypeScript (ex: S4335 type intersections, S4204 `any` type, S3353 `const` assertions). Todas as outras regras se aplicam igualmente.

#### Java
```
*Test.java, *Tests.java  → java/base + java/testing
*.java                    → java/base + verificar domínio e construtos
```

### Camada 3 — Contexto (por conteúdo do arquivo)

Para arquivos `source` e `typescript`, inspecionar o conteúdo e carregar referências adicionais:

**TypeScript — Domínio (carregar TODOS que se aplicam):**
- Segurança (auth, crypto, cookies) → `typescript/security-hotspot`
- SQL, comandos externos → `typescript/security-injection`
- Regex → `typescript/core-regex`
- Async/await/Promise → `typescript/core-async`
- AWS SDK → `typescript/cloud-aws`
- Angular → `typescript/fw-angular`
- React → `typescript/fw-react`

**TypeScript — Construtos (carregar TODOS que se aplicam):**
- switch/if/for/while → `typescript/core-control-flow`
- class/extends → `typescript/core-oop`
- import/export → `typescript/core-modules`
- enum/type/interface → `typescript/core-types`
- arrays → `typescript/core-arrays`
- strings/números mágicos → `typescript/core-formatting`
- comentários → `typescript/core-comments`
- try/catch/throw → `typescript/core-errors`
- operadores → `typescript/core-operators`

**Java — Domínio (carregar TODOS que se aplicam):**
- Spring/Jakarta → `java/fw-spring`
- Segurança → `java/security-hotspot` + `java/security-crypto`
- SQL/JPA/JDBC → `java/security-injection`
- Threading → `java/core-concurrency`
- Streams/lambdas → `java/core-streams`
- Regex → `java/core-regex`

**Java — Construtos (carregar TODOS que se aplicam):**
- switch/if/for/while → `java/core-control-flow`
- class/extends/implements → `java/core-oop`
- Collection/Map/List → `java/core-collections`
- try/catch/throw → `java/core-errors`
- enum/interface/generics → `java/core-types`
- operadores → `java/core-operators`
- comentários → `java/core-comments`
