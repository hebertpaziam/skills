## Why

As referências da skill usam 3 formatos inconsistentes: Java/TS são "lista seca" sem severidade, web/config são narrativos com exemplos, e universal usa regex + exceções. Isso impacta assertividade (severidade chutada no faseamento) e cobertura (JS standalone tem 5 regras vs ~300 do TS). Padronizar formato + eliminar ambiguidade de IDs + unificar JS com TS resolve os 3 problemas.

## What Changes

- **Adicionar severidade explícita `(BLOCKER|CRITICAL|MAJOR|MINOR|INFO)` em TODAS as regras** dos arquivos Java e TypeScript (hoje não têm)
- **Eliminar `web/javascript.md`** — projetos com JS standalone passam a usar `typescript/*` (mesmas regras do SonarQube, cobertura salta de 5 para ~300)
- **Adicionar prefixo de linguagem nos IDs das referências cross-linguagem** — `universal/scan-all.md`, `config/xml.md`, `config/secrets.md`, `web/jsp.md` passam a listar IDs com ambos os prefixos (`java:S2068` / `javascript:S2068`)
- **Atualizar SKILL.md** — remover categoria `web` para JS, unificar com `typescript`; ajustar árvore de decisão

## Capabilities

### New Capabilities
- `severity-annotations`: Todas as regras em todas as referências têm severidade explícita no formato `(SEVERIDADE)`
- `dual-prefix-ids`: Referências cross-linguagem listam IDs com prefixos de todas as linguagens aplicáveis, eliminando ambiguidade

### Modified Capabilities

## Impact

- **50+ arquivos de referência** em `references/java/` e `references/typescript/` — adição de severidade em cada linha
- **`references/web/javascript.md`** — removido
- **`references/universal/scan-all.md`**, `config/xml.md`, `config/secrets.md`, `web/jsp.md` — IDs ganham prefixos duplos
- **SKILL.md** — categoria `web` para JS eliminada, árvore de decisão ajustada
