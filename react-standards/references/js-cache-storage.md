---
title: Cache de Chamadas a Storage
impact: LOW-MEDIUM
impactDescription: reduz I/O caro
tags: javascript, localStorage, storage, caching, performance
---

## Cache de Chamadas a Storage

`localStorage`, `sessionStorage` e `document.cookie` são síncronos e caros. Cacheie leituras em memória.

**Incorreto (lê storage em toda chamada):**

```typescript
function getTheme() {
  return localStorage.getItem('theme') ?? 'light'
}
// Chamado 10 vezes = 10 leituras de storage
```

**Correto (cache com Map):**

```typescript
const storageCache = new Map<string, string | null>()

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key))
  }
  return storageCache.get(key)
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value)
  storageCache.set(key, value)  // mantém cache sincronizado
}
```

Use um Map (não hook) para funcionar em todo lugar: utils, handlers, não só componentes React.

**Cache de cookies:**

```typescript
let cookieCache: Record<string, string> | null = null

function getCookie(name: string) {
  if (!cookieCache) {
    cookieCache = Object.fromEntries(
      document.cookie.split('; ').map(c => c.split('='))
    )
  }
  return cookieCache[name]
}
```

**Importante (invalidar em mudanças externas):**

Se o storage pode mudar externamente (outra aba, cookies do server), invalide o cache:

```typescript
window.addEventListener('storage', (e) => {
  if (e.key) storageCache.delete(e.key)
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    storageCache.clear()
  }
})
```
