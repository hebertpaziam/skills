# Rendering Teleport KeepAlive Transition

## Quando usar

- Trabalhar com overlays, cache de views ou transicoes.

## Regras locais

- Use `Teleport` para overlays e conteudo que precisa sair da hierarquia visual local.
- Use `KeepAlive` apenas quando o cache de instancia e estado for desejado e compreendido.
- Use `Transition` e `TransitionGroup` para mudancas visuais genuinas, nao como acoplamento entre logica e animacao.
- Em cenarios SSR, trate `Teleport` com cuidado extra e siga [boundaries-ssr-and-hydration.md](boundaries-ssr-and-hydration.md).

## Checklist de qualidade

- `Teleport`, `KeepAlive` e `Transition` usados por semantica.
- Nao ha estado oculto inesperado mantido em cache.
- Transicoes nao prejudicam acessibilidade ou previsibilidade.
