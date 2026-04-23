# Composables sharing state

## Quando usar

- Decidir entre estado por instancia, shared state local ou store global.

## Regras locais

- Por padrao, cada chamada de composable deve criar estado isolado por instancia.
- Use shared state em composable apenas quando o escopo compartilhado for pequeno, local e conscientemente controlado.
- Quando o estado compartilhado atravessa modulos, paginas ou dominios, prefira Pinia.
- Evite singletons reativos improvisados para estado de aplicacao.

## Checklist de qualidade

- Escopo do estado compartilhado esta claro.
- Nao ha risco de vazamento arquitetural ou acoplamento oculto.
- Pinia foi considerada quando o estado ultrapassa o escopo local.
