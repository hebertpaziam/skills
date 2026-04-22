---
title: Crie Maps de Indice para Lookups Repetidos
impact: LOW-MEDIUM
impactDescription: 1M ops para 2K ops
tags: javascript, map, indexing, optimization, performance
---

## Crie Maps de Indice para Lookups Repetidos

Multiplos `.find()` pela mesma chave devem usar Map.

**Incorreto (O(n) por lookup):**

```typescript
function processOrders(orders: Order[], users: User[]) {
  return orders.map(order => ({
    ...order,
    user: users.find(u => u.id === order.userId)
  }))
}
```

**Correto (O(1) por lookup):**

```typescript
function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map(u => [u.id, u]))

  return orders.map(order => ({
    ...order,
    user: userById.get(order.userId)
  }))
}
```

Crie o map uma vez (O(n)) e os lookups ficam O(1).
Para 1000 orders × 1000 users: 1M ops → 2K ops.
