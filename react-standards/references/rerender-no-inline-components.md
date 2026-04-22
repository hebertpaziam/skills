---
title: Não Defina Componentes Dentro de Componentes
impact: HIGH
impactDescription: evita remount a cada render
tags: rerender, components, remount, performance
---

## Não Defina Componentes Dentro de Componentes

### Impacto: ALTO (evita remount a cada render)

Definir um componente dentro de outro cria um novo tipo a cada render. React vê um componente diferente e remonta tudo, destruindo estado e DOM.

Um motivo comum é acessar variáveis do pai sem passar props. Sempre passe props.

**Incorreto (remonta a cada render):**

```tsx
function UserProfile({ user, theme }) {
  // Definido dentro para acessar `theme` - RUIM
  const Avatar = () => (
    <img
      src={user.avatarUrl}
      className={theme === 'dark' ? 'avatar-dark' : 'avatar-light'}
    />
  )

  // Definido dentro para acessar `user` - RUIM
  const Stats = () => (
    <div>
      <span>{user.followers} followers</span>
      <span>{user.posts} posts</span>
    </div>
  )

  return (
    <div>
      <Avatar />
      <Stats />
    </div>
  )
}
```

Toda vez que `UserProfile` renderiza, `Avatar` e `Stats` são novos tipos. React desmonta as instâncias antigas e monta novas, perdendo estado interno, reexecutando effects e recriando o DOM.

**Correto (passe props):**

```tsx
function Avatar({ src, theme }: { src: string; theme: string }) {
  return (
    <img
      src={src}
      className={theme === 'dark' ? 'avatar-dark' : 'avatar-light'}
    />
  )
}

function Stats({ followers, posts }: { followers: number; posts: number }) {
  return (
    <div>
      <span>{followers} followers</span>
      <span>{posts} posts</span>
    </div>
  )
}

function UserProfile({ user, theme }) {
  return (
    <div>
      <Avatar src={user.avatarUrl} theme={theme} />
      <Stats followers={user.followers} posts={user.posts} />
    </div>
  )
}
```

**Sintomas desse bug:**

- Inputs perdem foco a cada tecla
- Animações reiniciam inesperadamente
- `useEffect` cleanup/setup roda a cada render do pai
- Posição de scroll reseta dentro do componente
