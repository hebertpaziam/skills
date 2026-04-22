---
title: Do Not Put Effect Events in Dependency Arrays
impact: LOW
impactDescription: evita re-execucoes desnecessarias de effect e erros de lint
tags: advanced, hooks, useEffectEvent, dependencies, effects
---

## Do Not Put Effect Events in Dependency Arrays

Funcoes Effect Event nao tem identidade estável. Essa identidade muda intencionalmente a cada render. Nao inclua a função retornada por `useEffectEvent` em um array de dependencias de `useEffect`. Mantenha os valores reativos reais como dependencias e chame o Effect Event dentro do corpo do effect ou nas subscriptions criadas por esse effect.

### Incorrect (Effect Event adicionado como dependencia)

```tsx
import { useEffect, useEffectEvent } from 'react'

function ChatRoom({ roomId, onConnected }: {
  roomId: string
  onConnected: () => void
}) {
  const handleConnected = useEffectEvent(onConnected)

  useEffect(() => {
    const connection = createConnection(roomId)
    connection.on('connected', handleConnected)
    connection.connect()

    return () => connection.disconnect()
  }, [roomId, handleConnected])
}
```

Incluir o Effect Event nas dependencias faz o effect reexecutar a cada render e aciona a regra de lint do React Hooks.

### Correct (depender de valores reativos, nao do Effect Event)

```tsx
import { useEffect, useEffectEvent } from 'react'

function ChatRoom({ roomId, onConnected }: {
  roomId: string
  onConnected: () => void
}) {
  const handleConnected = useEffectEvent(onConnected)

  useEffect(() => {
    const connection = createConnection(roomId)
    connection.on('connected', handleConnected)
    connection.connect()

    return () => connection.disconnect()
  }, [roomId])
}
```

Referência: [React useEffectEvent: Effect Event in deps](https://react.dev/reference/react/useEffectEvent#effect-event-in-deps)
