# Reactivity computed vs watch

## Quando usar

- Decidir entre derivar estado ou reagir a mudancas com efeito colateral.

## Regra principal

- Se um valor pode ser calculado a partir do estado atual, use `computed`.
- Se a mudanca precisa acionar um efeito colateral externo, sincronizacao, persistencia, fetch ou integracao, use `watch`.

## Exemplos tipicos de `computed`

- filtros derivados
- labels derivados
- disabled state
- agregacoes de lista

## Exemplos tipicos de `watch`

- atualizar URL
- persistir em storage
- chamar API em resposta a mudanca de entrada
- integrar bibliotecas externas imperativas

## Anti-pattern

- usar `watch` para preencher um segundo estado que poderia ser `computed`

## Checklist de qualidade

- Nenhum `watch` foi usado para derivacao pura.
- Nenhum `computed` esta executando efeitos colaterais.
