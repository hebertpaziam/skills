---
title: Use Loop para Min/Max em vez de Sort
impact: LOW
impactDescription: O(n) em vez de O(n log n)
tags: javascript, arrays, performance, sorting, algorithms
---

## Use Loop para Min/Max em vez de Sort

Encontrar o menor ou maior elemento só precisa de uma passada no array. Sort é desperdício e mais lento.

**Incorreto (O(n log n) - sort para achar o mais recente):**

```typescript
interface Project {
  id: string
  name: string
  updatedAt: number
}

function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted[0]
}
```

Ordena o array inteiro apenas para achar o máximo.

**Incorreto (O(n log n) - sort para mais velho e mais novo):**

```typescript
function getOldestAndNewest(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => a.updatedAt - b.updatedAt)
  return { oldest: sorted[0], newest: sorted[sorted.length - 1] }
}
```

Ainda ordena sem necessidade quando só precisa de min/max.

**Correto (O(n) - loop único):**

```typescript
function getLatestProject(projects: Project[]) {
  if (projects.length === 0) return null
  
  let latest = projects[0]
  
  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i]
    }
  }
  
  return latest
}

function getOldestAndNewest(projects: Project[]) {
  if (projects.length === 0) return { oldest: null, newest: null }
  
  let oldest = projects[0]
  let newest = projects[0]
  
  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt < oldest.updatedAt) oldest = projects[i]
    if (projects[i].updatedAt > newest.updatedAt) newest = projects[i]
  }
  
  return { oldest, newest }
}
```

Uma passada no array, sem cópia, sem sort.

**Alternativa (Math.min/Math.max para arrays pequenos):**

```typescript
const numbers = [5, 2, 8, 1, 9]
const min = Math.min(...numbers)
const max = Math.max(...numbers)
```

Funciona para arrays pequenos, mas pode ser mais lento ou falhar em arrays grandes por limite do spread. O máximo é ~124000 no Chrome 143 e 638000 no Safari 18; os números variam - veja [o fiddle](https://jsfiddle.net/qw1jabsx/4/). Use o loop por confiabilidade.
