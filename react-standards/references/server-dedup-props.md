---
title: Evite Serialização Duplicada em Props RSC
impact: LOW
impactDescription: reduz payload evitando serialização duplicada
tags: server, rsc, serialization, props, client-components
---

## Evite Serialização Duplicada em Props RSC

### Impacto: BAIXO (reduz payload evitando serialização duplicada)

A serialização RSC→client desduplica por referência de objeto, não por valor. Mesma referência = serializa uma vez; nova referência = serializa de novo. Faça transformações (`.toSorted()`, `.filter()`, `.map()`) no client, não no server.

**Incorreto (duplica array):**

```tsx
// RSC: sends 6 strings (2 arrays × 3 items)
<ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
```

**Correto (envia 3 strings):**

```tsx
// RSC: envia uma vez
<ClientList usernames={usernames} />

// Client: transforma lá
'use client'
const sorted = useMemo(() => [...usernames].sort(), [usernames])
```

**Comportamento de desduplicação aninhada:**

A desduplicação funciona recursivamente. O impacto varia por tipo de dado:

- `string[]`, `number[]`, `boolean[]`: **ALTO impacto** - array + todos os primitivos duplicados
- `object[]`: **BAIXO impacto** - array duplicada, mas objetos aninhados desduplicados por referência

```tsx
// string[] - duplica tudo
usernames={['a','b']} sorted={usernames.toSorted()} // sends 4 strings

// object[] - duplica só a estrutura do array
users={[{id:1},{id:2}]} sorted={users.toSorted()} // sends 2 arrays + 2 unique objects (not 4)
```

**Operações que quebram a desduplicação (criam novas referências):**

- Arrays: `.toSorted()`, `.filter()`, `.map()`, `.slice()`, `[...arr]`
- Objects: `{...obj}`, `Object.assign()`, `structuredClone()`, `JSON.parse(JSON.stringify())`

**Mais exemplos:**

```tsx
// ❌ Bad
<C users={users} active={users.filter(u => u.active)} />
<C product={product} productName={product.name} />

// ✅ Good
<C users={users} />
<C product={product} />
// Filtre/desestruture no client
```

**Exceção:** Passe dados derivados quando a transformação for cara ou o client não precisar do original.
