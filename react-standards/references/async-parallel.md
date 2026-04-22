---
title: Promise.all() para operações independentes
impact: CRITICAL
impactDescription: melhoria de 2-10x
tags: async, parallelization, promises, waterfalls
---

## Promise.all() para operações independentes

Quando operações async não possuem interdependências, execute-as de forma concorrente com `Promise.all()`.

**Incorreto (execução sequencial, 3 round trips):**

```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

**Correto (execução paralela, 1 round trip):**

```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```
