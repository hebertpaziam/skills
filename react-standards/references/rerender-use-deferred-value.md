---
title: Use useDeferredValue para Renders Derivados Caros
impact: MEDIUM
impactDescription: mantém input responsivo em computação pesada
tags: rerender, useDeferredValue, optimization, concurrent
---

## Use useDeferredValue para Renders Derivados Caros

Quando input do usuário dispara computações ou renders caros, use `useDeferredValue` para manter o input responsivo. O valor deferido fica atrasado, permitindo que o React priorize a atualização do input e renderize o resultado caro quando estiver ocioso.

**Incorreto (input fica lento ao filtrar):**

```tsx
function Search({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const filtered = items.filter(item => fuzzyMatch(item, query))

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ResultsList results={filtered} />
    </>
  )
}
```

**Correto (input fica rápido, resultados renderizam quando prontos):**

```tsx
function Search({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const filtered = useMemo(
    () => items.filter(item => fuzzyMatch(item, deferredQuery)),
    [items, deferredQuery]
  )
  const isStale = query !== deferredQuery

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.7 : 1 }}>
        <ResultsList results={filtered} />
      </div>
    </>
  )
}
```

**Quando usar:**

- Filtrar/pesquisar listas grandes
- Visualizações caras (gráficos) reagindo ao input
- Qualquer estado derivado com atraso perceptível de render

**Nota:** Envolva a computação cara em `useMemo` com o valor deferido como dependência, caso contrário ela roda em todo render.

Referência: [React useDeferredValue](https://react.dev/reference/react/useDeferredValue)
