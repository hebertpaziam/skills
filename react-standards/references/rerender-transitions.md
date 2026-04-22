---
title: Use Transitions para Atualizações Não Urgentes
impact: MEDIUM
impactDescription: mantém responsividade da UI
tags: rerender, transitions, startTransition, performance
---

## Use Transitions para Atualizações Não Urgentes

Marque atualizações frequentes e não urgentes como transitions para manter a UI responsiva.

**Incorreto (bloqueia a UI a cada scroll):**

```tsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

**Correto (atualizações não bloqueantes):**

```tsx
import { startTransition } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```
