# Testing Pinia and Router

## Quando usar

- Testar stores Pinia, navegacao, params, guards e integracao minima entre tela e router/store.

## Regras locais

- Stores devem ser testadas por estado, getters, actions e efeitos observaveis.
- Guards e navegacao devem ser testados por redirecionamento, autorizacao e resultado visivel.
- Use doubles, spies e helpers da stack do projeto em vez de camadas paralelas de mock.

## Checklist de qualidade

- Store e router testados por comportamento observavel.
- Sem acoplamento excessivo a detalhes internos.
