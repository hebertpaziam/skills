# Core custom directives

## Quando usar

- Encapsular manipulacao de DOM de baixo nivel que nao cabe melhor em componente ou composable.

## Regras locais

- So criar diretiva quando a preocupacao principal for DOM imperativo reutilizavel.
- Se a necessidade for reaproveitar estado ou logica reativa, prefira composable.
- Se a necessidade for reaproveitar UI, prefira componente.
- Diretivas devem ter escopo pequeno, efeito previsivel e cleanup claro.

## Checklist de qualidade

- Diretiva justificada tecnicamente.
- Sem sobreposicao com componente ou composable.
- Cleanup implementado quando necessario.
