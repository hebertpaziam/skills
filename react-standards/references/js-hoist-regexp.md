---
title: Mova RegExp para Fora
impact: LOW-MEDIUM
impactDescription: evita recriação
tags: javascript, regexp, optimization, memoization
---

## Mova RegExp para Fora

Não crie RegExp dentro do render. Mova para o escopo do módulo ou memoize com `useMemo()`.

**Incorreto (RegExp novo a cada render):**

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**Correto (memoize ou hoist):**

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**Aviso (regex global tem estado mutável):**

Regex global (`/g`) tem estado mutável em `lastIndex`:

```typescript
const regex = /foo/g
regex.test('foo')  // true, lastIndex = 3
regex.test('foo')  // false, lastIndex = 0
```
