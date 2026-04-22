---
title: Verifique condições baratas antes de flags async
impact: HIGH
impactDescription: evita trabalho async desnecessário quando um guard síncrono já falha
tags: async, await, feature-flags, short-circuit, conditional
---

## Verifique condições baratas antes de flags async

Quando um ramo usa `await` para uma flag ou valor remoto e também exige uma condição **síncrona barata** (props locais, metadados da request, estado já carregado), avalie a condição barata **primeiro**. Caso contrário, você paga a chamada async mesmo quando a condição composta nunca pode ser verdadeira.

Esta regra é uma especialização de [Defer Await Until Needed](./async-defer-await.md) para verificações do tipo `flag && cheapCondition`.

**Incorreto:**

```typescript
const someFlag = await getFlag()

if (someFlag && someCondition) {
  // ...
}
```

**Correto:**

```typescript
if (someCondition) {
  const someFlag = await getFlag()
  if (someFlag) {
    // ...
  }
}
```

Isso importa quando `getFlag` acessa a rede, um serviço de feature flag, ou `React.cache` / DB: pular quando `someCondition` é false remove esse custo no caminho frio.

Mantenha a ordem original se `someCondition` for caro, depender da flag, ou se você precisar executar efeitos colaterais em uma ordem fixa.
