---
title: Adie Bibliotecas de Terceiros Não Críticas
impact: MEDIUM
impactDescription: carrega após a hidratação
tags: bundle, third-party, analytics, defer
---

## Adie Bibliotecas de Terceiros Não Críticas

Analytics, logging e error tracking não bloqueiam a interação do usuário. Carregue depois da hidratação.

**Incorreto (bloqueia o bundle inicial):**

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Correto (carrega após a hidratação):**

```tsx
import dynamic from 'next/dynamic'

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(m => m.Analytics),
  { ssr: false }
)

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```
