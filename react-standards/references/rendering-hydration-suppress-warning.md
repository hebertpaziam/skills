---
title: Suprima Mismatches Esperados de Hidratação
impact: LOW-MEDIUM
impactDescription: evita warnings para diferenças conhecidas
tags: rendering, hydration, ssr, nextjs
---

## Suprima Mismatches Esperados de Hidratação

Em frameworks SSR (ex.: Next.js), alguns valores diferem entre server e client (IDs aleatórios, datas, formatação por locale/timezone). Para esses mismatches *esperados*, envolva o texto dinâmico em um elemento com `suppressHydrationWarning` para evitar warnings. Não use para esconder bugs reais. Não exagere.

**Incorreto (warnings de mismatch conhecido):**

```tsx
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>
}
```

**Correto (suprimir apenas mismatch esperado):**

```tsx
function Timestamp() {
  return (
    <span suppressHydrationWarning>
      {new Date().toLocaleString()}
    </span>
  )
}
```
