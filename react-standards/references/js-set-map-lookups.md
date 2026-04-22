---
title: Use Set/Map para Lookups O(1)
impact: LOW-MEDIUM
impactDescription: O(n) para O(1)
tags: javascript, set, map, data-structures, performance
---

## Use Set/Map para Lookups O(1)

Converta arrays para Set/Map em checagens repetidas.

**Incorreto (O(n) por check):**

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

**Correto (O(1) por check):**

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```
