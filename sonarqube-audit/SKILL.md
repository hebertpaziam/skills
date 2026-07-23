---
name: sonarqube-audit
description: 'Audita o codebase completo contra regras SonarQube e gera um relatório detalhado em Markdown na raiz do projeto. Cobre ~976 regras (TypeScript + Java). O relatório inclui plano de ação faseado por criticidade, referências rápidas e prompt para correção automatizada.'
---

# SonarQube Audit

Audita **todos** os arquivos do projeto contra regras SonarQube e produz um relatório `.md` completo na raiz do projeto.

**Idioma do relatório:** pt-BR
**Output no terminal:** NENHUM durante a execução. Apenas uma linha final com o nome do arquivo gerado. O LLM deve trabalhar silenciosamente usando tools — sem emitir texto intermediário ao usuário.

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

> Você quer executar uma auditoria completa SonarQube no projeto? Isso vai analisar todos os arquivos e gerar um relatório detalhado em Markdown na raiz do projeto. Confirma? (sim/não)

**Só execute após confirmação explícita do usuário.**

---

## Consistência do Relatório

O relatório gerado **DEVE** seguir rigorosamente o template definido nos arquivos `typescript/audit.md` e `java/audit.md`. Independente das características do projeto:

- **Todas as seções do template são obrigatórias** — mesmo que uma seção tenha zero itens, ela deve aparecer com a indicação "Nenhuma violação encontrada nesta fase."
- **A ordem das seções nunca muda** — Índice → Resumo Executivo → Metodologia e Limitações → Severidade → Arquivos com Violações → Regras Mais Violadas → Plano de Ação (Fases 1-5) → Glossário → Prompt
- **O glossário é sempre o mesmo** — termos e definições são fixos, não variam por projeto
- **As 5 fases do plano de ação são sempre as mesmas** — a matriz criticidade x facilidade não muda
- **O formato das tabelas é fixo** — mesmas colunas, mesma ordem, mesmos headers
- **Adaptações permitidas:** nome do projeto, data, linguagem detectada, dados quantitativos, conteúdo das violações encontradas, presença/ausência do bloco OpenSpec

Isso garante que qualquer pessoa que leia relatórios de projetos diferentes reconheça imediatamente o layout e saiba onde encontrar cada informação.

---

## Fluxo de Execução

### Etapa 0 — Scan Determinístico (pré-análise automatizada)

**Esta etapa é 100% mecânica — não requer julgamento do LLM.**

Antes de qualquer análise por sub-agentes, executar o scanner determinístico para detectar violações mecânicas com precisão exata.

**Execução:**

```bash
bash .agents/skills/sonarqube-audit/scanners/scan.sh <project_root> /tmp/opencode
```

O script automaticamente:
1. Detecta ferramentas disponíveis (semgrep > ast-grep > ripgrep)
2. Executa a cascata de detecção apropriada
3. Gera `/tmp/opencode/findings.json` com todas as violações determinísticas

**Saída:** `findings.json` contendo findings com campos: file, line, rule, severity, category, message, match, confidence, source.

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
   - Binários: `*.class`, `*.jar`, `*.war`, `*.ear`, `*.zip`, `*.tar.gz`, `*.rar`
   - Imagens: `*.png`, `*.jpg`, `*.jpeg`, `*.gif`, `*.svg`, `*.ico`, `*.bmp`
   - Fontes: `*.woff`, `*.woff2`, `*.ttf`, `*.eot`
   - Compilados: `*.pyc`, `*.o`, `*.so`, `*.dll`
4. Listar **TODOS** os arquivos de texto restantes — **sem filtro por extensão**.
5. Registrar o total de arquivos que serão analisados.

**CRÍTICO:** Não filtrar por extensão. Arquivos `.jsp`, `.xml`, `.properties`, `.yml`, `.env`, `.cfg`, `.conf`, `.sql`, `.sh`, `.bat`, `.md` — todos devem entrar no inventário. A cobertura deve ser 100% dos arquivos de texto.

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
5. Registrar cada violação com:
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

Gerar o arquivo na raiz do projeto com o nome:
```
<nome-da-pasta-do-projeto>_<AAAA-MM-DD>_v<N>.md
```

Onde:
- `<nome-da-pasta-do-projeto>` é o basename do diretório raiz do projeto (em kebab-case, como está)
- `<AAAA-MM-DD>` é a data da execução
- `<N>` é um número auto-incrementado: verificar quais arquivos `<nome>_<data>_v*.md` já existem na raiz e usar o próximo número (v1, v2, v3...)

Exemplo: `br-novo-portal-prestadores-site_2026-07-23_v1.md`

O relatório deve seguir **exatamente** o template definido no arquivo `audit.md` da linguagem correspondente (`typescript/audit.md` ou `java/audit.md`). Para projetos multilinguagem, combinar ambos os templates em um único relatório.

**Formato da seção "Arquivos com Violações":**

Tabela compacta listando **TODOS** os arquivos com violações, ordenados por severidade máxima (BLOCKER → CRITICAL → MAJOR → MINOR → INFO), com desempate por quantidade decrescente:

```
| # | Arquivo | Issues | Sev. Máxima |
|---|---------|:------:|-------------|
| 1 | `path/to/file.jsp` | 33 | BLOCKER |
| 2 | `path/to/Service.java` | 91 | CRITICAL |
| ... | ... | ... | ... |
```

**CRÍTICO:** Listar **TODOS** os arquivos com violações — sem corte ou amostragem. Se 60 JSPs têm violações, os 60 devem aparecer.

**No prompt de correção (final do relatório)**, usar formato detalhado com linha exata:

```
### Correções para `path/to/file.jsp`
- **Linha 15:** `${error}` → `<c:out value="${error}"/>` (S5131)
- **Linha 23:** `${link}` em `<script>` → escapar com `Encoder.forJavaScript()` (S5131)
```

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
