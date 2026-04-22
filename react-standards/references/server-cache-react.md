---
title: Desduplicação por Requisição com React.cache()
impact: MEDIUM
impactDescription: desduplica por requisição
tags: server, cache, react-cache, deduplication
---

## Desduplicação por Requisição com React.cache()

Use `React.cache()` para desduplicar requisições no server. Autenticação e queries de banco são os maiores ganhos.

**Uso:**

```typescript
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null
  return await db.user.findUnique({
    where: { id: session.user.id }
  })
})
```

Dentro de uma requisição, múltiplas chamadas a `getCurrentUser()` executam a query apenas uma vez.

**Evite objetos inline como argumentos:**

`React.cache()` usa igualdade rasa (`Object.is`) para determinar cache hits. Objetos inline criam novas referências a cada chamada, impedindo cache hits.

**Incorreto (sempre cache miss):**

```typescript
const getUser = cache(async (params: { uid: number }) => {
  return await db.user.findUnique({ where: { id: params.uid } })
})

// Cada chamada cria novo objeto, nunca bate cache
getUser({ uid: 1 })
getUser({ uid: 1 })  // Falha de cache, roda a query de novo
```

**Correto (cache hit):**

```typescript
const getUser = cache(async (uid: number) => {
  return await db.user.findUnique({ where: { id: uid } })
})

// Args primitivos usam igualdade por valor
getUser(1)
getUser(1)  // Acerto de cache, retorna o resultado em cache
```

Se precisar passar objetos, passe a mesma referência:

```typescript
const params = { uid: 1 }
getUser(params)  // Query roda
getUser(params)  // Acerto de cache (mesma referência)
```

**Nota específica do Next.js:**

No Next.js, a API `fetch` é automaticamente estendida com memoização por requisição. Requisições com a mesma URL e opções são desduplicadas dentro da mesma requisição, então você não precisa de `React.cache()` para chamadas `fetch`. Ainda assim, `React.cache()` é essencial para outras tarefas async:

- Queries de banco (Prisma, Drizzle, etc.)
- Computações pesadas
- Checagens de autenticação
- Operações de sistema de arquivos
- Qualquer trabalho async não fetch

Use `React.cache()` para desduplicar essas operações pela árvore de componentes.

Referência: [React.cache documentation](https://react.dev/reference/react/cache)
