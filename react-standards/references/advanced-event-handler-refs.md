---
title: Store Event Handlers in Refs
impact: LOW
impactDescription: assinaturas estáveis
tags: advanced, hooks, refs, event-handlers, optimization
---

## Store Event Handlers in Refs

Armazene callbacks em refs quando usados em effects que nao devem re-assinar ao mudar o callback.

**Incorrect (reassina a cada render)**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}
```

**Correct (assinatura estável)**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const listener = (e) => handlerRef.current(e)
    window.addEventListener(event, listener)
    return () => window.removeEventListener(event, listener)
  }, [event])
}
```

**Alternativa: use `useEffectEvent` se estiver no React mais recente:**

```tsx
import { useEffectEvent } from 'react'

function useWindowEvent(event: string, handler: (e) => void) {
  const onEvent = useEffectEvent(handler)

  useEffect(() => {
    window.addEventListener(event, onEvent)
    return () => window.removeEventListener(event, onEvent)
  }, [event])
}
```

`useEffectEvent` fornece uma API mais limpa para o mesmo padrao: cria uma referencia de função estável que sempre chama a versão mais recente do handler.
