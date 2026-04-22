---
title: Cache de Acesso a Propriedades em Loops
impact: LOW-MEDIUM
impactDescription: reduz acessos
tags: javascript, loops, optimization, caching
---

## Cache de Acesso a Propriedades em Loops

Cacheie acessos a propriedades em hot paths.

**Incorreto (3 acessos × N iterações):**

```typescript
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value)
}
```

**Correto (1 acesso total):**

```typescript
const value = obj.config.settings.value
const len = arr.length
for (let i = 0; i < len; i++) {
  process(value)
}
```
