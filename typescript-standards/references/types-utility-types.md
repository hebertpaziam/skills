# Types utility types

## Quando usar

- Adaptar shapes existentes com `Partial`, `Pick`, `Omit`, `Record`, `Readonly` e utilitarios similares.

## Regras locais

- Prefira utilitarios nativos quando eles expressam claramente a transformacao desejada.
- Nao encadeie utilitarios de forma a tornar o tipo ilegivel sem ganho real.
- Se a transformacao for recorrente e semantica, considere nomear o tipo resultante.

## Checklist de qualidade

- Utility types melhoraram clareza.
- Nao ha tipo final opaco demais.
