---
title: Initialize App Once, Not Per Mount
impact: LOW-MEDIUM
impactDescription: evita inicialização duplicada em desenvolvimento
tags: initialization, useEffect, app-startup, side-effects
---

## Initialize App Once, Not Per Mount

Nao coloque inicialização global da aplicação (que deve rodar uma vez por carga) dentro de `useEffect([])` de um componente. Componentes podem remontar e effects vao reexecutar. Em vez disso, use um guard no nível do modulo ou inicialização no modulo de entrada.

### Incorrect (roda duas vezes em dev, reexecuta no remount)

```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

### Correct (uma vez por carga da aplicação)

```tsx
let didInit = false

function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

Referencia: [Initializing the application](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)
