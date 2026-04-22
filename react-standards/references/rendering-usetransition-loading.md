---
title: Use useTransition em vez de Loading Manual
impact: LOW
impactDescription: reduz re-renders e melhora clareza
tags: rendering, transitions, useTransition, loading, state
---

## Use useTransition em vez de Loading Manual

Use `useTransition` em vez de `useState` manual para loading. Isso fornece `isPending` nativo e gerencia transitions automaticamente.

**Incorreto (loading manual):**

```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value: string) => {
    setIsLoading(true)
    setQuery(value)
    const data = await fetchResults(value)
    setResults(data)
    setIsLoading(false)
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**Correto (useTransition com pending nativo):**

```tsx
import { useTransition, useState } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value) // Atualiza input imediatamente
    
    startTransition(async () => {
      // Busca e atualiza resultados
      const data = await fetchResults(value)
      setResults(data)
    })
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**Benefícios:**

- **Pending automático**: Não precisa gerenciar `setIsLoading(true/false)`
- **Resiliência a erros**: Pending reseta mesmo se a transition falhar
- **Melhor responsividade**: Mantém a UI responsiva durante atualizações
- **Cancelamento**: Novas transitions cancelam as pendentes

Referência: [useTransition](https://react.dev/reference/react/useTransition)
