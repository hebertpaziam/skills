---
title: Use SWR for Automatic Deduplication
impact: MEDIUM-HIGH
impactDescription: deduplicacao automatica
tags: client, swr, deduplication, data-fetching
---

## Use SWR for Automatic Deduplication

SWR permite deduplicacao de requests, cache e revalidacao entre instancias de componentes.

### Incorrect (sem deduplicacao, cada instancia faz fetch)

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

### Correct (varias instancias compartilham um request)

```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

**Para dados imutaveis:**

```tsx
import { useImmutableSWR } from '@/lib/swr'

function StaticContent() {
  const { data } = useImmutableSWR('/api/config', fetcher)
}
```

**Para mutacoes:**

```tsx
import { useSWRMutation } from 'swr/mutation'

function UpdateButton() {
  const { trigger } = useSWRMutation('/api/user', updateUser)
  return <button onClick={() => trigger()}>Update</button>
}
```

Referência: [https://swr.vercel.app](https://swr.vercel.app)
