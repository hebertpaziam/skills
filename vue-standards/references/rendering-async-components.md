# Rendering async components

## Quando usar

- Adiar carregamento de componentes ou arvores pesadas.

## Regras locais

- Use `defineAsyncComponent` para componentes grandes, raros ou fora do caminho critico.
- Prefira lazy loading em fronteiras naturais de tela, modal ou funcionalidade opcional.
- Nao transformar componentes pequenos e criticos em async sem ganho real.

## Checklist de qualidade

- Lazy loading alinhado ao custo real.
- Sem fragmentacao excessiva de chunk.
- Fallback ou UX de carregamento coerente quando necessario.
