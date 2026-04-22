---
title: Use Atualizações Funcionais do setState
impact: MEDIUM
impactDescription: evita closures obsoletas e recriações
tags: react, hooks, useState, useCallback, callbacks, closures
---

## Use Atualizações Funcionais do setState

Ao atualizar estado com base no valor atual, use a forma funcional do setState em vez de referenciar a variável de estado. Isso evita closures obsoletas, elimina dependências desnecessárias e cria callbacks estáveis.

**Incorreto (exige estado como dependência):**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)
  
  // Callback depende de items, recriado a cada mudança
  const addItems = useCallback((newItems: Item[]) => {
    setItems([...items, ...newItems])
  }, [items])  // ❌ dependência de items recria callbacks
  
  // Risco de closure obsoleta se esquecer dependência
  const removeItem = useCallback((id: string) => {
    setItems(items.filter(item => item.id !== id))
  }, [])  // ❌ Sem dependência, usa items obsoletos!
  
  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

O primeiro callback é recriado sempre que `items` muda, o que pode re-renderizar filhos sem necessidade. O segundo callback tem bug de closure obsoleta e sempre referência o valor inicial de `items`.

**Correto (callbacks estáveis, sem closures obsoletas):**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)
  
  // Callback estável, nunca recriado
  const addItems = useCallback((newItems: Item[]) => {
    setItems(curr => [...curr, ...newItems])
  }, [])  // ✅ Sem dependências
  
  // Sempre usa o estado atual, sem closure obsoleta
  const removeItem = useCallback((id: string) => {
    setItems(curr => curr.filter(item => item.id !== id))
  }, [])  // ✅ Seguro e estável
  
  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

**Benefícios:**

1. **Referências de callback estáveis** - Callbacks não precisam ser recriados quando o estado muda
2. **Sem closures obsoletas** - Sempre opera no estado mais recente
3. **Menos dependências** - Simplifica arrays de dependências e reduz leaks
4. **Evita bugs** - Elimina a causa mais comum de bugs de closures

**Quando usar atualizações funcionais:**

- Qualquer setState que depende do valor atual
- Dentro de useCallback/useMemo quando precisa de estado
- Handlers de eventos que referenciam estado
- Operações async que atualizam estado

**Quando atualizações diretas bastam:**

- Definir estado para valor estático: `setCount(0)`
- Definir estado apenas com props/args: `setName(newName)`
- Estado não depende do valor anterior

**Nota:** Se o projeto usa [React Compiler](https://react.dev/learn/react-compiler), o compilador pode otimizar alguns casos, mas atualizações funcionais ainda são recomendadas por corretude e para evitar closures obsoletas.
