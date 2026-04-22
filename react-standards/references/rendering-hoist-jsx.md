---
title: Mova JSX Estático para Fora
impact: LOW
impactDescription: evita recriação
tags: rendering, jsx, static, optimization
---

## Mova JSX Estático para Fora

Extraia JSX estático para fora do componente para evitar recriação.

**Incorreto (recria elemento a cada render):**

```tsx
function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />
}

function Container() {
  return (
    <div>
      {loading && <LoadingSkeleton />}
    </div>
  )
}
```

**Correto (reusa o mesmo elemento):**

```tsx
const loadingSkeleton = (
  <div className="animate-pulse h-20 bg-gray-200" />
)

function Container() {
  return (
    <div>
      {loading && loadingSkeleton}
    </div>
  )
}
```

Isso ajuda especialmente para SVGs grandes e estáticos, que podem ser caros de recriar a cada render.

**Nota:** Se o projeto usa [React Compiler](https://react.dev/learn/react-compiler), o compilador move JSX estático automaticamente e otimiza re-renders, tornando o hoist manual desnecessário.
