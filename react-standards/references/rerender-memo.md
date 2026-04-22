---
title: Extraia para Componentes Memoizados
impact: MEDIUM
impactDescription: permite retornos antecipados
tags: rerender, memo, useMemo, optimization
---

## Extraia para Componentes Memoizados

Extraia trabalho caro para componentes memoizados a fim de permitir retornos antecipados antes da computação.

**Incorreto (calcula avatar mesmo carregando):**

```tsx
function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user)
    return <Avatar id={id} />
  }, [user])

  if (loading) return <Skeleton />
  return <div>{avatar}</div>
}
```

**Correto (evita computação quando carregando):**

```tsx
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
  const id = useMemo(() => computeAvatarId(user), [user])
  return <Avatar id={id} />
})

function Profile({ user, loading }: Props) {
  if (loading) return <Skeleton />
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  )
}
```

**Nota:** Se o projeto usa [React Compiler](https://react.dev/learn/react-compiler), memoização manual com `memo()` e `useMemo()` não é necessária. O compilador otimiza re-renders automaticamente.
