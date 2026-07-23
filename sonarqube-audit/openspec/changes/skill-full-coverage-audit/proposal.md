## Why

A skill atual perde ~42% das violacoes reais do projeto porque filtra arquivos por extensao (apenas `.java`, `.ts`, `.js`, `.html`), ignorando completamente `.jsp` (60 arquivos), `.xml` (7 arquivos), `.properties` (8+ arquivos) e qualquer outro tipo de texto. Em auditoria comparativa, o relatorio novo encontrou 197 violacoes vs 339 do relatorio manual — gap de 142 violacoes, incluindo BLOCKERs como XSS em JSPs, XXE em XMLs, e credenciais hardcoded em properties.

## What Changes

- **Reescrever Etapa 1 (inventario)**: trocar busca por extensao por inventario baseado em `.gitignore` — scanear TODOS os arquivos de texto, excluindo apenas o que o .gitignore exclui
- **Reescrever Etapa 2 (classificacao)**: trocar mapeamento extensao→referencia por classificacao em 3 camadas (universal → categoria → contexto por conteudo)
- **Criar 5 novos arquivos de referencia**: `universal/scan-all.md`, `web/jsp.md`, `web/javascript.md`, `config/xml.md`, `config/secrets.md`
- **Reescrever arvore de decisao**: de extensao-centrica para categoria-centrica com 3 camadas
- **Adicionar instrucao de sub-agentes paralelos por categoria** para manter qualidade em projetos grandes
- **Ajustar template do relatorio**: formato hibrido (contagem por arquivo no corpo, linha-a-linha no prompt de correcao)
- **Substituir `universal/blockers.md`** pelo novo `universal/scan-all.md` com 10 regras cross-linguagem

## Capabilities

### New Capabilities
- `universal-scan`: Regras cross-linguagem (credenciais, IPs, HTTP, codigo morto) aplicadas a QUALQUER arquivo de texto do repositorio
- `web-audit`: Regras especificas para JSP (XSS/EL expressions, scriptlets) e JavaScript legacy (eval, console.log)
- `config-audit`: Regras para XML (XXE, web.xml security, Spring datasource) e arquivos de configuracao (properties, yml, env — secrets, tokens, chaves)
- `gitignore-inventory`: Mecanismo de inventario baseado em .gitignore como primeira etapa obrigatoria, garantindo cobertura de 100% dos arquivos de texto
- `hybrid-report`: Formato de relatorio hibrido — contagem agrupada por arquivo no corpo, detalhamento linha-a-linha no prompt de correcao automatizada
- `parallel-agents`: Instrucoes para execucao de sub-agentes paralelos por categoria (source, template, config) para manter qualidade de analise

### Modified Capabilities
- (nenhuma — as referencias Java e TypeScript existentes permanecem intactas, apenas a orquestracao muda)

## Impact

- **SKILL.md**: Reescrita significativa das Etapas 1-3 e arvore de decisao
- **references/universal/blockers.md**: Substituido por `scan-all.md`
- **references/**: Novos diretorios `web/` e `config/` com 4 arquivos de referencia
- **Compatibilidade**: Nao quebra projetos que so tem Java/TS — esses continuam sendo cobertos pelas referencias existentes. A mudanca e aditiva.
