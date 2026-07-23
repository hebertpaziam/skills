## Context

A skill `sonarqube-audit` e um agente que audita codebases contra regras SonarQube e gera relatorios em Markdown. Atualmente, ela usa um modelo extensao-centrico: um comando `find` busca apenas `*.java`, `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.html` e mapeia cada extensao a um arquivo de referencia. Qualquer tipo de arquivo nao mapeado e completamente ignorado.

Em auditoria real num projeto Java/JSP, isso resultou em 142 violacoes perdidas (42% do total), incluindo BLOCKERs de seguranca: XSS em 60 JSPs, XXE em XMLs, credenciais hardcoded em properties.

A skill consiste em:
- `SKILL.md` — orquestracao principal (~300 linhas, 5 etapas)
- `references/universal/blockers.md` — 6 regras universais
- `references/java/*.md` — ~10 arquivos de referencia Java
- `references/typescript/*.md` — ~6 arquivos de referencia TypeScript

## Goals / Non-Goals

**Goals:**
- Cobertura de 100% dos arquivos de texto do repositorio (nao apenas extensoes mapeadas)
- Regras cross-linguagem aplicadas a qualquer arquivo (credenciais, IPs, HTTP)
- Cobertura completa de JSP (XSS via EL expressions, scriptlets), XML (XXE, web.xml security), e config (properties/yml secrets)
- Manter qualidade de analise em projetos grandes via sub-agentes paralelos por categoria
- Formato de relatorio hibrido: compacto para leitura, detalhado para correcao automatizada

**Non-Goals:**
- Alterar as referencias Java ou TypeScript existentes (permanecem intactas)
- Suportar linguagens alem das encontradas no projeto-alvo (Go, Rust, etc.)
- Implementar analise de fluxo de dados (data flow) — apenas pattern matching
- Substituir ferramentas de SAST reais (SonarQube, Semgrep) — a skill e complementar

## Decisions

### 1. Inventario baseado em .gitignore (em vez de lista de extensoes)

**Decisao**: A Etapa 1 DEVE ler `.gitignore` e construir uma lista de exclusao, depois listar TODOS os arquivos de texto restantes.

**Alternativa rejeitada**: Adicionar mais extensoes a lista do `find` (ex: `*.jsp`, `*.xml`). Isso perpetua o problema — qualquer extensao nova nao mapeada seria ignorada novamente.

**Razao**: O .gitignore ja define o que NAO pertence ao projeto. Inverter a logica (tudo menos o ignorado) garante cobertura automatica de qualquer tipo de arquivo presente.

### 2. Classificacao em 3 camadas (universal → categoria → contexto)

**Decisao**: Todo arquivo passa por 3 camadas de regras:
1. **Universal** (`scan-all.md`): credenciais, IPs, HTTP, codigo morto — aplica a QUALQUER arquivo
2. **Categoria** (source/template/config): regras especificas do tipo funcional do arquivo
3. **Contexto** (conteudo): regras adicionais baseadas no que o arquivo contem (ex: SQL, imports de crypto)

**Alternativa rejeitada**: Mapeamento direto extensao→referencia. Falha porque a mesma extensao pode ter funcoes diferentes (um `.xml` pode ser Spring config, Maven POM, ou log4j config).

**Classificacao por categoria**:
- `source` → `.java` (referencias existentes), `.js` standalone (`web/javascript.md`)
- `template` → `.jsp`, `.html` com EL (`web/jsp.md`)
- `config` → `.xml` (`config/xml.md`), `.properties`/`.yml`/`.env` (`config/secrets.md`)
- `typescript` → `.ts`, `.tsx` (referencias existentes)

### 3. Sub-agentes paralelos por categoria

**Decisao**: O agente principal classifica os arquivos e dispara sub-agentes em paralelo, um por categoria. Cada sub-agente recebe apenas os arquivos e referencias da sua categoria.

**Alternativa rejeitada**: Agente unico sequencial. Degrada qualidade apos ~50 arquivos por perda de contexto.

**Razao**: Custo de tokens e identico (mesmos arquivos, mesmas regras). Qualidade e superior porque cada agente tem contexto focado.

### 4. Formato hibrido de relatorio (Opcao C)

**Decisao**: O corpo do relatorio usa formato compacto (tipo de violacao + contagem por arquivo). O prompt de correcao anexo lista violacoes linha-a-linha.

**Razao**: Humanos precisam de visao geral rapida para priorizar. Agentes de correcao precisam de localizacao exata para agir.

### 5. scan-all.md como arquivo unico universal

**Decisao**: Um unico arquivo `universal/scan-all.md` substitui `universal/blockers.md`, contendo 10 regras cross-linguagem.

**Alternativa rejeitada**: Multiplos arquivos universais (um por tema). Fragmentacao desnecessaria — sao regras de pattern matching simples que cabem em um arquivo.

## Risks / Trade-offs

- **[Falsos positivos em scan universal]** → Mitigacao: regras universais usam patterns conservadores (ex: ignorar `password` em comentarios de documentacao, verificar se IPs sao em ranges privados)
- **[Performance com muitos arquivos]** → Mitigacao: .gitignore exclui node_modules, target, build; sub-agentes paralelos reduzem tempo wall-clock
- **[Complexidade de classificacao]** → Mitigacao: arvore de decisao simples por extensao para 90% dos casos, com fallback para conteudo apenas quando ambiguo
- **[Regras JSP podem nao cobrir todos os frameworks de template]** → Mitigacao: foco em EL expressions e scriptlets que sao padrao JEE; frameworks especificos (Thymeleaf, Freemarker) ficam para futuro
