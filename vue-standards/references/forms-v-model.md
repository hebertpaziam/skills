# Forms v-model

## Quando usar

- Implementar inputs nativos ou componentes de formulario customizados.

## Regras locais

- Use `v-model` quando ele expressa claramente ownership e sincronizacao de valor.
- Para inputs customizados, mantenha contrato previsivel com `defineModel` ou props + emits explicitos.
- Nao esconda validacao, formatacao e side effects relevantes dentro do binding sem deixar o fluxo claro.
- Prefira normalizacao no limite do input ou em composable dedicado.

## Checklist de qualidade

- Fluxo de dados previsivel.
- `v-model` usado por semantica, nao por conveniencia cega.
- Sem sincronizacao opaca.
