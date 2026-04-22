---
title: Fetch Paralelo de Dados Aninhados
impact: CRITICAL
impactDescription: elimina waterfalls no server
tags: server, rsc, parallel-fetching, promise-chaining
---

## Fetch Paralelo de Dados Aninhados

Ao buscar dados aninhados em paralelo, encadeie fetches dependentes dentro da promise de cada item para que um item lento não bloqueie o resto.

**Incorreto (um item lento bloqueia todos os fetches aninhados):**

```tsx
const chats = await Promise.all(
  chatIds.map(id => getChat(id))
)

const chatAuthors = await Promise.all(
  chats.map(chat => getUser(chat.author))
)
```

Se um `getChat(id)` dentre 100 for extremamente lento, os autores dos outros 99 chats não conseguem começar a carregar mesmo que seus dados estejam prontos.

**Correto (cada item encadeia seu proprio fetch aninhado):**

```tsx
const chatAuthors = await Promise.all(
  chatIds.map(id => getChat(id).then(chat => getUser(chat.author)))
)
```

Cada item encadeia `getChat` → `getUser` de forma independente, então um chat lento não bloqueia o fetch de autores dos outros.
