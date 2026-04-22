---
title: Cheque o Length Antes de Comparar Arrays
impact: MEDIUM-HIGH
impactDescription: evita operações caras com tamanhos diferentes
tags: javascript, arrays, performance, optimization, comparison
---

## Cheque o Length Antes de Comparar Arrays

Ao comparar arrays com operações caras (sort, deep equality, serialização), cheque o tamanho primeiro. Se os tamanhos diferem, não podem ser iguais.

Em apps reais, essa otimização é valiosa quando a comparação roda em hot paths (handlers, loops de render).

**Incorreto (sempre roda comparação cara):**

```typescript
function hasChanges(current: string[], original: string[]) {
  // Sempre ordena e junta, mesmo com tamanhos diferentes
  return current.sort().join() !== original.sort().join()
}
```

Duas ordenações O(n log n) rodam mesmo quando `current.length` é 5 e `original.length` é 100. Também há overhead de join e comparação de strings.

**Correto (checa length O(1) primeiro):**

```typescript
function hasChanges(current: string[], original: string[]) {
  // Retorna cedo se tamanhos diferem
  if (current.length !== original.length) {
    return true
  }
  // Só ordena quando tamanhos batem
  const currentSorted = current.toSorted()
  const originalSorted = original.toSorted()
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true
    }
  }
  return false
}
```

Essa abordagem é mais eficiente porque:

- Evita o overhead de ordenar e juntar quando tamanhos diferem
- Evita consumo de memória com strings unidas (importante em arrays grandes)
- Evita mutar os arrays originais
- Retorna cedo ao encontrar diferença
