# State Pinia stores

## Quando usar

- Compartilhar estado entre telas, fluxos, modulos ou varios componentes desconectados.

## Regras locais

- Prefira Pinia para estado compartilhado de aplicacao.
- Evite singletons reativos em escopo de modulo como solucao geral.
- Store deve representar um dominio ou agregado coerente, nao um deposito generico de tudo.
- Prefira setup stores quando a Composition API trouxer legibilidade e composicao melhores.

## Checklist de qualidade

- Shared state com Pinia quando o escopo justificar.
- Store com responsabilidade clara.
- Sem estado global improvisado fora da estrategia da app.
