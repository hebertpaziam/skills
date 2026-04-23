# TypeScript SFC macros

## Quando usar

- Tipar `defineProps`, `defineEmits`, `defineModel`, `withDefaults` e macros correlatas.

## Regras locais

- Em codigo novo, prefira declaracao baseada em tipos para `defineProps` e `defineEmits` quando isso mantiver o contrato claro.
- Use defaults de props de forma previsivel, evitando mutaveis compartilhados.
- Para props complexas, prefira interfaces ou types nomeados quando isso melhorar leitura.
- Nao combine declaracao runtime e type-based da mesma macro.
- Ao usar generics em SFC, mantenha a API do componente compreensivel para consumo normal.

## Checklist de qualidade

- Macros com tipagem coerente.
- Defaults seguros.
- Sem abuso de tipos complexos que prejudiquem manutenibilidade.
