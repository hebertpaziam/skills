---
title: Use Render Condicional Explícito
impact: LOW
impactDescription: evita renderizar 0 ou NaN
tags: rendering, conditional, jsx, falsy-values
---

## Use Render Condicional Explícito

Use operadores ternários (`? :`) em vez de `&&` quando a condição pode ser `0`, `NaN` ou outros valores falsy que renderizam.

**Incorreto (renderiza "0" quando count é 0):**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count && <span className="badge">{count}</span>}
    </div>
  )
}

// Quando count = 0, renderiza: <div>0</div>
// Quando count = 5, renderiza: <div><span class="badge">5</span></div>
```

**Correto (não renderiza nada quando count é 0):**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count > 0 ? <span className="badge">{count}</span> : null}
    </div>
  )
}

// Quando count = 0, renderiza: <div></div>
// Quando count = 5, renderiza: <div><span class="badge">5</span></div>
```
