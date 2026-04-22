---
title: Não Envolva Expressão Simples Primitiva em useMemo
impact: LOW-MEDIUM
impactDescription: computação desperdicada a cada render
tags: rerender, useMemo, optimization
---

## Não Envolva Expressão Simples Primitiva em useMemo

Quando uma expressão é simples (poucos operadores lógicos ou aritméticos) e tem resultado primitivo (boolean, number, string), não a envolva em `useMemo`.
Chamar `useMemo` e comparar dependências pode consumir mais recursos do que a expressão.

**Incorreto:**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading
  }, [user.isLoading, notifications.isLoading])

  if (isLoading) return <Skeleton />
  // return some markup
}
```

**Correto:**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = user.isLoading || notifications.isLoading

  if (isLoading) return <Skeleton />
  // return some markup
}
```
