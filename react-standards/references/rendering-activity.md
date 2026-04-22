---
title: Use Activity para Mostrar/Esconder
impact: MEDIUM
impactDescription: preserva estado/DOM
tags: rendering, activity, visibility, state-preservation
---

## Use Activity para Mostrar/Esconder

Use o `<Activity>` do React para preservar estado/DOM em componentes caros que alternam visibilidade com frequência.

**Uso:**

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

Evita re-renders caros e perda de estado.
