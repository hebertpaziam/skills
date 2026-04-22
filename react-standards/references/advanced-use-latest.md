---
title: useEffectEvent for Stable Callback Refs
impact: LOW
impactDescription: evita re-execucoes de effect
tags: advanced, hooks, useEffectEvent, refs, optimization
---

## useEffectEvent for Stable Callback Refs

Acesse valores mais recentes em callbacks sem adiciona-los aos arrays de dependencias. Evita re-execucoes de effect e evita closures obsoletas.

### Incorrect (effect reexecuta a cada mudanca de callback)

```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(timeout)
  }, [query, onSearch])
}
```

### Correct (usando useEffectEvent do React)

```tsx
import { useEffectEvent } from 'react';

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const onSearchEvent = useEffectEvent(onSearch)

  useEffect(() => {
    const timeout = setTimeout(() => onSearchEvent(query), 300)
    return () => clearTimeout(timeout)
  }, [query])
}
```
