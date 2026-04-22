---
title: Cache LRU Entre Requisições
impact: HIGH
impactDescription: cache entre requisições
tags: server, cache, lru, cross-request
---

## Cache LRU Entre Requisições

`React.cache()` funciona apenas dentro de uma requisição. Para dados compartilhados entre requisições sequenciais (usuário clica no botão A e depois no B), use um cache LRU.

**Implementação:**

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000  // 5 minutes
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}

// Requisição 1: query no DB, resultado em cache
// Requisição 2: cache hit, sem query no DB
```

Use quando ações sequenciais do usuário atingem múltiplos endpoints com a mesma informação em poucos segundos.

**Com o [Fluid Compute](https://vercel.com/docs/fluid-compute) da Vercel:** o cache LRU e especialmente efetivo porque multiplas requisições concorrentes compartilham a mesma instância da função e o cache. Isso significa que o cache persiste entre requisições sem precisar de armazenamento externo como Redis.

**Em serverless tradicional:** cada invocação roda isolada, então considere Redis para cache entre processos.

Referência: [https://github.com/isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache)
