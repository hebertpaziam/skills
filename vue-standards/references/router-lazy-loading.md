# Router lazy loading

## Quando usar

- Carregar telas por demanda no Vue Router.

## Regras locais

- Use lazy loading para componentes de rota por padrao, salvo caminhos pequenos e criticos onde o projeto tenha decidido diferente.
- Mantenha fronteiras de chunk alinhadas a telas, funis ou areas pesadas.
- Nao fragmente em excesso rotas pequenas sem ganho mensuravel.

## Checklist de qualidade

- Route-level code splitting coerente.
- Sem excesso de fragmentacao.
