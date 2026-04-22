---
title: Minimize Serialização nas Fronteiras RSC
impact: HIGH
impactDescription: reduz tamanho de transferencia
tags: server, rsc, serialization, props
---

## Minimize Serialização nas Fronteiras RSC

A fronteira Server/Client do React serializa todas as propriedades do objeto em strings e as embute no HTML e nas requisições RSC subsequentes. Esses dados serializados impactam diretamente o peso da página e o tempo de carregamento, então **tamanho importa muito**. Passe apenas os campos que o client realmente usa.

**Incorreto (serializa todos os 50 campos):**

```tsx
async function Page() {
  const user = await fetchUser()  // 50 campos
  return <Profile user={user} />
}

'use client'
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div>  // usa 1 campo
}
```

**Correto (serializa apenas 1 campo):**

```tsx
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}

'use client'
function Profile({ name }: { name: string }) {
  return <div>{name}</div>
}
```
