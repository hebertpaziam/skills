# Rendering suspense

## Quando usar

- Coordenar boundaries assicronas de UI quando a arquitetura do projeto suportar isso claramente.

## Regras locais

- Use `Suspense` apenas quando a experiencia de fallback estiver bem definida.
- Evite `Suspense` como solucao generica para qualquer fetch assicrono.
- Nao o introduza se a stack do projeto nao o adota ou se isso complicar hydration e testes sem beneficio claro.

## Checklist de qualidade

- Boundary assicrona tem motivo concreto.
- Fallback e UX foram pensados.
- O projeto suporta a estrategia sem friccao desnecessaria.
