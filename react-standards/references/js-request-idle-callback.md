---
title: Adie Trabalho Não Crítico com requestIdleCallback
impact: MEDIUM
impactDescription: mantém a UI responsiva em background
tags: javascript, performance, idle, scheduling, analytics
---

## Adie Trabalho Não Crítico com requestIdleCallback

### Impacto: MÉDIO (mantém UI responsiva em tarefas de background)

Use `requestIdleCallback()` para agendar trabalho não crítico durante ociosidade do browser. Isso libera a main thread para interações e animações, reduzindo jank.

**Incorreto (bloqueia main thread na interação):**

```typescript
function handleSearch(query: string) {
  const results = searchItems(query)
  setResults(results)

  // Isso bloqueia a main thread imediatamente
  analytics.track('search', { query })
  saveToRecentSearches(query)
  prefetchTopResults(results.slice(0, 3))
}
```

**Correto (adia trabalho não crítico para ociosidade):**

```typescript
function handleSearch(query: string) {
  const results = searchItems(query)
  setResults(results)

  // Adia trabalho não crítico para momentos ociosos
  requestIdleCallback(() => {
    analytics.track('search', { query })
  })

  requestIdleCallback(() => {
    saveToRecentSearches(query)
  })

  requestIdleCallback(() => {
    prefetchTopResults(results.slice(0, 3))
  })
}
```

**Com timeout para trabalho necessário:**

```typescript
// Garante analytics em até 2s mesmo com browser ocupado
requestIdleCallback(
  () => analytics.track('page_view', { path: location.pathname }),
  { timeout: 2000 }
)
```

**Fatiar tarefas grandes:**

```typescript
function processLargeDataset(items: Item[]) {
  let index = 0

  function processChunk(deadline: IdleDeadline) {
    // Processa itens enquanto há tempo ocioso (alvo <50ms)
    while (index < items.length && deadline.timeRemaining() > 0) {
      processItem(items[index])
      index++
    }

    // Agenda o próximo chunk se restar item
    if (index < items.length) {
      requestIdleCallback(processChunk)
    }
  }

  requestIdleCallback(processChunk)
}
```

**Com fallback para browsers sem suporte:**

```typescript
const scheduleIdleWork = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1))

scheduleIdleWork(() => {
  // Trabalho não crítico
})
```

**Quando usar:**

- Analytics e telemetria
- Salvar estado em localStorage/IndexedDB
- Prefetch de recursos para próximas ações
- Transformações não urgentes
- Inicialização lazy de features não críticas

**Quando NÃO usar:**

- Ações do usuário que precisam de feedback imediato
- Atualizações de render que o usuário espera
- Operações sensíveis ao tempo
