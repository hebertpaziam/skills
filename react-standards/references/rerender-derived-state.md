---
title: Assine Estado Derivado
impact: MEDIUM
impactDescription: reduz a frequência de re-render
tags: rerender, derived-state, média-query, optimization
---

## Assine Estado Derivado

Assine estado booleano derivado em vez de valores continuos para reduzir a frequência de re-render.

**Incorreto (re-renderiza a cada pixel):**

```tsx
function Sidebar() {
  const width = useWindowWidth()  // updates continuously
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

**Correto (re-renderiza apenas quando o booleano muda):**

```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```
