# Core lifecycle hooks

## Quando usar

- Adicionar setup e teardown de efeitos ligados ao ciclo de vida do componente.

## Regras locais

- `onMounted` e `onUnmounted` devem encapsular efeitos ligados ao browser, DOM ou listeners.
- Nao usar hooks para trabalho que pode ser expresso como derivacao reativa pura.
- Todo efeito que registra recursos externos deve ter cleanup correspondente.
- Em cenarios SSR, side effects de browser devem permanecer client-only.

## Checklist de qualidade

- Cada efeito possui motivo claro.
- Recursos externos sao limpos corretamente.
- Hooks nao estao sendo usados para compensar modelagem reativa ruim.
