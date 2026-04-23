# Router data fetching

## Quando usar

- Decidir onde dados de tela devem ser carregados em fluxos baseados em rota.

## Regras locais

- Dados estritamente de tela podem ser carregados no componente ou em composable da tela.
- Dados compartilhados entre telas ou fluxos tendem a caber melhor em store/composable compartilhado.
- Nao use guard apenas para fazer fetch se isso piorar UX ou acoplar demais a navegacao.
- Separe claramente carregamento, estado de erro e estado vazio.

## Checklist de qualidade

- Responsabilidade de fetch esta na fronteira certa.
- Sem fetch escondido em guard sem necessidade.
- Estados de tela claros.
