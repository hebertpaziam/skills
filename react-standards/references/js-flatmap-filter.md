---
title: Use flatMap para Mapear e Filtrar em Uma Passada
impact: LOW-MEDIUM
impactDescription: elimina array intermediario
tags: javascript, arrays, flatMap, filter, performance
---

## Use flatMap para Mapear e Filtrar em Uma Passada

### Impacto: BAIXO-MÉDIO (elimina array intermediario)

Encadear `.map().filter(Boolean)` cria um array intermediario e itera duas vezes. Use `.flatMap()` para transformar e filtrar em uma passada.

**Incorreto (2 iterações, array intermediario):**

```typescript
const userNames = users
  .map(user => user.isActive ? user.name : null)
  .filter(Boolean)
```

**Correto (1 iteração, sem array intermediario):**

```typescript
const userNames = users.flatMap(user =>
  user.isActive ? [user.name] : []
)
```

**Mais exemplos:**

```typescript
// Extrair emails validos das respostas
// Before
const emails = responses
  .map(r => r.success ? r.data.email : null)
  .filter(Boolean)

// After
const emails = responses.flatMap(r =>
  r.success ? [r.data.email] : []
)

// Parsear e filtrar numeros validos
// Before
const numbers = strings
  .map(s => parseInt(s, 10))
  .filter(n => !isNaN(n))

// After
const numbers = strings.flatMap(s => {
  const n = parseInt(s, 10)
  return isNaN(n) ? [] : [n]
})
```

**Quando usar:**

- Transformar itens enquanto filtra
- Mapeamento condicional onde alguns não geram saida
- Parsing/validação quando itens invalidos devem ser ignorados
