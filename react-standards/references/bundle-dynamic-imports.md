---
title: Imports Dinamicos para Componentes Pesados
impact: CRITICAL
impactDescription: afeta diretamente TTI e LCP
tags: bundle, dynamic-import, code-splitting, next-dynamic
---

## Imports Dinamicos para Componentes Pesados

Use `next/dynamic` para lazy-load de componentes grandes que não são necessários no primeiro render.

**Incorreto (Monaco entra no chunk principal com ~300KB):**

```tsx
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**Correto (Monaco carrega sob demanda):**

```tsx
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```
