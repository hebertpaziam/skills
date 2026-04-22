---
title: Use toSorted() em vez de sort() para Imutabilidade
impact: MEDIUM-HIGH
impactDescription: evita bugs de mutação em state
tags: javascript, arrays, immutability, react, state, mutation
---

## Use toSorted() em vez de sort() para Imutabilidade

`.sort()` muta o array in-place, o que pode causar bugs em state e props. Use `.toSorted()` para criar um novo array ordenado sem mutação.

**Incorreto (muta o array original):**

```typescript
function UserList({ users }: { users: User[] }) {
  // Muta o array de users!
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**Correto (cria novo array):**

```typescript
function UserList({ users }: { users: User[] }) {
  // Cria array ordenado novo, original intacto
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**Por que isso importa no React:**

1. Mutações em props/state quebram o modelo de imutabilidade
2. Causa bugs de closures obsoletas - arrays mutados em closures geram comportamento inesperado

**Suporte de browser (fallback para antigos):**

`.toSorted()` existe em browsers modernos (Chrome 110+, Safari 16+, Firefox 115+, Node.js 20+). Para ambientes antigos, use spread:

```typescript
// Fallback para browsers antigos
const sorted = [...items].sort((a, b) => a.value - b.value)
```

**Outros métodos imutaveis:**

- `.toSorted()` - immutable sort
- `.toReversed()` - immutable reverse
- `.toSpliced()` - immutable splice
- `.with()` - immutable element replacement
