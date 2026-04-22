---
title: Paralelização baseada em dependências
impact: CRITICAL
impactDescription: melhoria de 2-10x
tags: async, parallelization, dependencies, better-all
---

## Paralelização baseada em dependencias

Para operações com dependências parciais, use `better-all` para maximizar o paralelismo. Ele inicia cada tarefa no primeiro momento possível.

**Incorreto (profile aguarda config sem necessidade):**

```typescript
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)
```

**Correto (config e profile em paralelo):**

```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})
```

**Alternativa sem dependências extras:**

Também é possível criar todas as promises primeiro e fazer `Promise.all()` no final.

```typescript
const userPromise = fetchUser()
const profilePromise = userPromise.then(user => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([
  userPromise,
  fetchConfig(),
  profilePromise
])
```

Referência: [https://github.com/shuding/better-all](https://github.com/shuding/better-all)
