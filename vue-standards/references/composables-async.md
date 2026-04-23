# Composables async

## Quando usar

- Modelar fetch, revalidacao, estados de loading/error e sincronizacao assicrona reutilizavel.

## Regras locais

- Modelar explicitamente estados de loading, success e error.
- Aceitar inputs reativos quando o fetch precisar reexecutar em resposta a mudancas.
- Evitar disparos redundantes e condicoes de corrida silenciosas.
- Tratar cancelamento, invalidacao ou descarte de respostas obsoletas quando o fluxo exigir.
- Nao esconder efeitos caros atras de `watchEffect` sem criterio.

## Checklist de qualidade

- Estado assicrono previsivel.
- Dependencias de reexecucao claras.
- Sem race conditions obvias.
- Sem stack paralela ao data layer ja existente no projeto.
