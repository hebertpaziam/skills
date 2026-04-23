# Reactivity shallow APIs

## Quando usar

- Trabalhar com listas grandes, payloads profundos ou estruturas tratadas como imutaveis.

## Regras locais

- Use `shallowRef` ou `shallowReactive` apenas quando houver sinal tecnico de sobrecarga reativa.
- Ao usar APIs rasas, trate os dados aninhados como imutaveis.
- Atualizacoes devem ocorrer por substituicao da raiz, nao por mutacao profunda invisivel.

## Checklist de qualidade

- Existe justificativa tecnica para shallow APIs.
- O time conseguira manter o contrato de imutabilidade.
- Nao ha mutacoes profundas silenciosas.
