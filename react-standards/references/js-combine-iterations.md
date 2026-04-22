---
title: Combine Iterações de Array
impact: LOW-MEDIUM
impactDescription: reduz iterações
tags: javascript, arrays, loops, performance
---

## Combine Iterações de Array

Multiplas chamadas de `.filter()` ou `.map()` iteram o array varias vezes. Combine em um loop.

**Incorreto (3 iterações):**

```typescript
const admins = users.filter(u => u.isAdmin)
const testers = users.filter(u => u.isTester)
const inactive = users.filter(u => !u.isActive)
```

**Correto (1 iteração):**

```typescript
const admins: User[] = []
const testers: User[] = []
const inactive: User[] = []

for (const user of users) {
  if (user.isAdmin) admins.push(user)
  if (user.isTester) testers.push(user)
  if (!user.isActive) inactive.push(user)
}
```
