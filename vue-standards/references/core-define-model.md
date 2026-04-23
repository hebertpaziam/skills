# Core defineModel

## Quando usar

- Implementar componentes customizados integrados com `v-model`.
- Revisar fluxo de two-way binding em componentes.

## Regras locais

- `defineModel` e apropriado para componentes de input e wrappers de formulario cujo contrato primario e sincronizar um valor.
- Evite `defineModel` quando ele esconder ownership de estado que deveria continuar explicito.
- Para modelos nomeados, use nomes que representem claramente o valor sincronizado.
- Evite defaults que possam desalinhar pai e filho quando o pai nao fornece valor inicial.

## Quando preferir props + emits

- Quando o fluxo de dados precisa permanecer explicito.
- Quando ha varias mudancas independentes sem semantica de `v-model`.
- Quando o componente expoe eventos de negocio, nao apenas sincronizacao de valor.

## Checklist de qualidade

- `defineModel` usado apenas quando simplifica uma API legitima de input.
- Sem sincronizacao opaca entre pai e filho.
- Sem default enganoso que introduza dessintonia.
