---
title: Adie Leitura de Estado para o Ponto de Uso
impact: MEDIUM
impactDescription: evita assinaturas desnecessárias
tags: rerender, searchParams, localStorage, optimization
---

## Adie Leitura de Estado para o Ponto de Uso

Não assine estado dinâmico (searchParams, localStorage) se você só lê dentro de callbacks.

**Incorreto (assina todas as mudanças de searchParams):**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

**Correto (lê sob demanda, sem assinatura):**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```
