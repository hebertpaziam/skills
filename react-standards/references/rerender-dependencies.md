---
title: Afine Dependências de Effect
impact: LOW
impactDescription: minimiza reexecuções do effect
tags: rerender, useEffect, dependencies, optimization
---

## Afine Dependências de Effect

Especifique dependências primitivas em vez de objetos para minimizar reexecuções do effect.

**Incorreto (reexecuta em qualquer mudança do user):**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

**Correto (reexecuta apenas quando o id muda):**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

**Para estado derivado, compute fora do effect:**

```tsx
// Incorreto: roda em width=767, 766, 765...
useEffect(() => {
  if (width < 768) {
    enableMobileMode()
  }
}, [width])

// Correto: roda apenas na transição booleana
const isMobile = width < 768
useEffect(() => {
  if (isMobile) {
    enableMobileMode()
  }
}, [isMobile])
```
