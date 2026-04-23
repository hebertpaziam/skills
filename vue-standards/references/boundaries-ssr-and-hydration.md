# Boundaries SSR and hydration

## Quando usar

- Trabalhar em projetos Vue com SSR, hydration ou codigo universal.

## Regras locais

- Side effects de browser devem ser client-only.
- Nao assuma `window`, `document` ou APIs de plataforma em codigo universal.
- Evite poluicao de estado entre requests em SSR; stores e app devem ser criados por request quando a arquitetura exigir.
- Previna hydration mismatch eliminando HTML invalido, valores aleatorios nao estabilizados e diferencas client/server evitaveis.
- `Teleport` e outras features com comportamento especial em SSR exigem cuidado adicional.

## Checklist de qualidade

- Codigo universal separado de codigo client-only.
- Sem cross-request state pollution.
- Hydration previsivel.
