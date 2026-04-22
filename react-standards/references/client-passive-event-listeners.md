---
title: Use Passive Event Listeners for Scrolling Performance
impact: MEDIUM
impactDescription: elimina delay de scroll causado por event listeners
tags: client, event-listeners, scrolling, performance, touch, wheel
---

## Use Passive Event Listeners for Scrolling Performance

Adicione `{ passive: true }` a listeners de touch e wheel para permitir scroll imediato. Browsers normalmente esperam o listener terminar para verificar se `preventDefault()` foi chamado, causando delay de scroll.

### Incorrect

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)
  
  document.addEventListener('touchstart', handleTouch)
  document.addEventListener('wheel', handleWheel)
  
  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

### Correct

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)
  
  document.addEventListener('touchstart', handleTouch, { passive: true })
  document.addEventListener('wheel', handleWheel, { passive: true })
  
  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**Use passive quando:** tracking/analytics, logging, qualquer listener que nao chama `preventDefault()`.

**Don't use passive quando:** implementar gestos customizados de swipe, controles customizados de zoom, ou qualquer listener que precise de `preventDefault()`.
