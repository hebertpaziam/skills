# Testing E2E

## Quando usar

- Validar fluxos ponta a ponta, navegacao real, integracao com backend e comportamento multi-pagina.

## Regras locais

- E2E cobre fluxos criticos de negocio e navegacao, nao cada detalhe micro de UI.
- Reutilize a ferramenta E2E configurada no projeto.
- Priorize cenarios que unit e component tests nao conseguem cobrir com confianca suficiente.
- Minimize flakiness com dados, esperas e seletores previsiveis.

## Checklist de qualidade

- Fluxos criticos cobertos.
- Sem excesso de sobreposicao com testes unitarios/componentes.
- Ferramenta atual do projeto respeitada.
