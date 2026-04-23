# Principles LIFT

## Quando usar

- Antes de criar novo tipo, helper, modulo, classe, adapter, factory ou abstracao.

## Regras locais

- `Locate`: localize contratos, tipos, helpers, patterns e modulos ja existentes.
- `Identify`: identifique o que ja resolve parte do problema e onde a duplicação esta surgindo.
- `Find`: encontre o menor ponto coerente de reutilização, extensao ou composicao.
- `Try to be DRY`: tente remover duplicação real sem introduzir sobreengenharia.

## Checklist de qualidade

- O codigo existente foi revisado antes de criar algo novo.
- A duplicação combatida era real, nao hipotetica.
- A nova abstracao nao aumentou opacidade sem necessidade.
