---
title: Use defer ou async em Script Tags
impact: HIGH
impactDescription: elimina bloqueio de render
tags: rendering, script, defer, async, performance
---

## Use defer ou async em Script Tags

### Impacto: ALTO (elimina bloqueio de render)

Scripts sem `defer` ou `async` bloqueiam o parsing do HTML enquanto baixam e executam. Isso atrasa First Contentful Paint e Time to Interactive.

- **`defer`**: Baixa em paralelo, executa após o parsing, mantém ordem
- **`async`**: Baixa em paralelo, executa quando pronto, sem ordem garantida

Use `defer` para scripts que dependem do DOM ou de outros scripts. Use `async` para scripts independentes como analytics.

**Incorreto (bloqueia render):**

```tsx
export default function Document() {
  return (
    <html>
      <head>
        <script src="https://example.com/analytics.js" />
        <script src="/scripts/utils.js" />
      </head>
      <body>{/* content */}</body>
    </html>
  )
}
```

**Correto (não bloqueante):**

```tsx
export default function Document() {
  return (
    <html>
      <head>
        {/* Independent script - use async */}
        <script src="https://example.com/analytics.js" async />
        {/* DOM-dependent script - use defer */}
        <script src="/scripts/utils.js" defer />
      </head>
      <body>{/* content */}</body>
    </html>
  )
}
```

**Nota:** No Next.js, prefira `next/script` com a prop `strategy` em vez de tags script cruas:

```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/analytics.js" strategy="afterInteractive" />
      <Script src="/scripts/utils.js" strategy="beforeInteractive" />
    </>
  )
}
```

Referência: [MDN - Script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#defer)
