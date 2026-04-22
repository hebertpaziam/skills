---
title: Evite cadeias de waterfall em API routes
impact: CRITICAL
impactDescription: melhoria de 2-10x
tags: api-routes, server-actions, waterfalls, parallelization
---

## Evite cadeias de waterfall em API routes

Em API routes e Server Actions, inicie operações independentes imediatamente, mesmo que ainda não faça await.

**Incorreto (config aguarda auth, data aguarda ambos):**

```typescript
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}
```

**Correto (auth e config iniciam imediatamente):**

```typescript
export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([
    configPromise,
    fetchData(session.user.id)
  ])
  return Response.json({ data, config })
}
```

Para cadeias de dependência mais complexas, use `better-all` para maximizar paralelismo automaticamente (ver Dependency-Based Parallelization).
