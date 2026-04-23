# Testing composables

## Quando usar

- Testar composables com ou sem dependencia de host component.

## Regras locais

- Se o composable usa apenas reatividade pura, teste-o por invocacao direta.
- Se depende de lifecycle ou provide/inject, teste-o com host component ou helper equivalente da stack atual.
- Valide contrato publico do composable: estado retornado, funcoes expostas e efeitos observaveis.

## Checklist de qualidade

- Estrategia de teste alinhada ao tipo de composable.
- Sem host component desnecessario.
- Sem detalhismo excessivo em internals.
