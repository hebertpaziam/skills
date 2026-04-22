---
title: Separe Computações Combinadas em Hooks
impact: MEDIUM
impactDescription: evita recomputar etapas independentes
tags: rerender, useMemo, useEffect, dependencies, optimization
---

## Separe Computações Combinadas em Hooks

Quando um hook tem multiplas tarefas independentes com dependências diferentes, separe em hooks distintos. Um hook combinado reexecuta tudo quando qualquer dependência muda, mesmo que algumas tarefas não usem o valor mudado.

**Incorreto (mudar `sortOrder` recomputa o filtro):**

```tsx
const sortedProducts = useMemo(() => {
  const filtered = products.filter((p) => p.category === category)
  const sorted = filtered.toSorted((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  )
  return sorted
}, [products, category, sortOrder])
```

**Correto (filtra apenas quando products ou category mudam):**

```tsx
const filteredProducts = useMemo(
  () => products.filter((p) => p.category === category),
  [products, category]
)

const sortedProducts = useMemo(
  () =>
    filteredProducts.toSorted((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    ),
  [filteredProducts, sortOrder]
)
```

Esse padrão também vale para `useEffect` ao combinar efeitos não relacionados:

**Incorreto (ambos effects rodam quando qualquer dependência muda):**

```tsx
useEffect(() => {
  analytics.trackPageView(pathname)
  document.title = `${pageTitle} | My App`
}, [pathname, pageTitle])
```

**Correto (effects rodam de forma independente):**

```tsx
useEffect(() => {
  analytics.trackPageView(pathname)
}, [pathname])

useEffect(() => {
  document.title = `${pageTitle} | My App`
}, [pageTitle])
```

**Nota:** Se o projeto usa [React Compiler](https://react.dev/learn/react-compiler), ele otimiza o tracking de dependências e pode cobrir alguns casos.
