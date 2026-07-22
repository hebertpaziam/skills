---
name: sonarqube-audit
description: 'Audita o codebase completo contra regras SonarQube e gera um relatório detalhado em Markdown na raiz do projeto. Cobre ~976 regras (TypeScript + Java). O relatório inclui plano de ação faseado por criticidade, referências rápidas e prompt para correção automatizada.'
---

# SonarQube Audit

Audita **todos** os arquivos do projeto contra regras SonarQube e produz um relatório `.md` completo na raiz do projeto.

**Idioma do relatório:** pt-BR
**Idioma do output no terminal:** mínimo — o valor está no arquivo gerado.

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
- **A ordem das seções nunca muda** — Índice → Resumo Executivo → Severidade → Arquivos Mais Afetados → Regras Mais Violadas → Plano de Ação (Fases 1-5) → Detalhamento por Arquivo → Glossário → Prompt
- **O glossário é sempre o mesmo** — termos e definições são fixos, não variam por projeto
- **As 5 fases do plano de ação são sempre as mesmas** — a matriz criticidade x facilidade não muda
- **O formato das tabelas é fixo** — mesmas colunas, mesma ordem, mesmos headers
- **Adaptações permitidas:** nome do projeto, data, linguagem detectada, dados quantitativos, conteúdo das violações encontradas, presença/ausência do bloco OpenSpec

Isso garante que qualquer pessoa que leia relatórios de projetos diferentes reconheça imediatamente o layout e saiba onde encontrar cada informação.

---

## Fluxo de Execução

### Etapa 1 — Inventário de Arquivos

1. Listar **todos** os arquivos do projeto.
2. Respeitar **todos** os `.gitignore` encontrados (raiz e subdiretórios).
3. Excluir automaticamente:
   - `node_modules/`, `dist/`, `build/`, `target/`, `.git/`
   - Arquivos gerados (`*.min.js`, `*.map`, `*.d.ts`)
   - Assets não-código (`*.png`, `*.jpg`, `*.svg`, `*.ico`, `*.woff`, `*.ttf`)
4. Registrar o total de arquivos que serão analisados.

### Etapa 2 — Detecção de Linguagem e Carregamento de Regras

Analisar as extensões dos arquivos inventariados para determinar quais conjuntos de regras carregar:

```
Arquivos *.ts, *.tsx, *.js, *.jsx, *.mjs, *.cjs, *.html encontrados?
  → Carregar referências de typescript/
  → Seguir árvore de decisão em typescript/audit.md

Arquivos *.java encontrados?
  → Carregar referências de java/
  → Seguir árvore de decisão em java/audit.md

Ambos encontrados?
  → Carregar ambos + universal/blockers.md

Nenhum encontrado?
  → Informar que não há regras disponíveis para as linguagens detectadas e encerrar.
```

**Importante:** Carregar APENAS as referências da(s) linguagem(ns) detectada(s). Nunca carregar Java para um projeto TypeScript puro e vice-versa.

### Etapa 3 — Análise Arquivo por Arquivo

Para **cada** arquivo inventariado:

1. Ler o conteúdo do arquivo.
2. Aplicar as regras relevantes com base no contexto do arquivo:
   - Tipo de arquivo (componente, serviço, controller, teste, config, etc.)
   - Domínio (segurança, async, OOP, SQL, etc.)
   - Construtos presentes (switch, class, try/catch, etc.)
3. Registrar cada violação encontrada com:
   - Caminho do arquivo (relativo à raiz do projeto)
   - Número da linha
   - Regra violada (código + título)
   - Severidade (BLOCKER, CRITICAL, MAJOR, MINOR, INFO)
   - Descrição do problema em pt-BR
   - Instrução de correção em pt-BR
   - Estimativa de esforço

**Não pular nenhum arquivo.** A cobertura deve ser 100%.

### Etapa 4 — Classificação e Faseamento

Organizar as violações em fases usando dois eixos:

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

### Etapa 5 — Gerar Relatório

Gerar o arquivo na raiz do projeto com o nome:
```
sonarqube-audit--AAAA-MM-DD.md
```

Onde `AAAA-MM-DD` é a data da execução.

O relatório deve seguir **exatamente** o template definido no arquivo `audit.md` da linguagem correspondente (`typescript/audit.md` ou `java/audit.md`). Para projetos multilinguagem, combinar ambos os templates em um único relatório.

### Etapa 6 — Output no Terminal

Após gerar o relatório, o output no terminal deve ser **mínimo e direto**:

```
Relatório gerado: sonarqube-audit--2026-07-22.md
```

Nada mais. O relatório é autocontido.

---

## Árvore de Decisão — Referências por Contexto

Use esta árvore para determinar quais referências carregar para cada arquivo durante a análise. Carregar **TODAS** as referências que se aplicam — não apenas a primeira.

### TypeScript/JavaScript

```
*.component.ts    → typescript/base + typescript/fw-angular
*.tsx, *.jsx      → typescript/base + typescript/fw-react
*.spec.ts         → typescript/base + typescript/testing
*.test.ts         → typescript/base + typescript/testing
*.html            → typescript/base + typescript/browser-aria + typescript/browser-dom
*.ts, *.js, etc.  → typescript/base + verificar domínio e construtos
```

**Domínio (carregar TODOS que se aplicam):**
- Segurança (auth, crypto, cookies) → `typescript/security-hotspot`
- SQL, comandos externos → `typescript/security-injection`
- Regex → `typescript/core-regex`
- Async/await/Promise → `typescript/core-async`
- AWS SDK → `typescript/cloud-aws`
- Angular → `typescript/fw-angular`
- React → `typescript/fw-react`

**Construtos (carregar TODOS que se aplicam):**
- switch/if/for/while → `typescript/core-control-flow`
- class/extends → `typescript/core-oop`
- import/export → `typescript/core-modules`
- enum/type/interface → `typescript/core-types`
- arrays → `typescript/core-arrays`
- strings/números mágicos → `typescript/core-formatting`
- comentários → `typescript/core-comments`
- try/catch/throw → `typescript/core-errors`
- operadores → `typescript/core-operators`

### Java

```
*Test.java, *Tests.java  → java/base + java/testing
*.java                    → java/base + verificar domínio e construtos
```

**Domínio (carregar TODOS que se aplicam):**
- Spring/Jakarta → `java/fw-spring`
- Segurança → `java/security-hotspot` + `java/security-crypto`
- SQL/JPA/JDBC → `java/security-injection`
- Threading → `java/core-concurrency`
- Streams/lambdas → `java/core-streams`
- Regex → `java/core-regex`

**Construtos (carregar TODOS que se aplicam):**
- switch/if/for/while → `java/core-control-flow`
- class/extends/implements → `java/core-oop`
- Collection/Map/List → `java/core-collections`
- try/catch/throw → `java/core-errors`
- enum/interface/generics → `java/core-types`
- operadores → `java/core-operators`
- comentários → `java/core-comments`
