---
title: Coloque Lógica de Interação em Handlers
impact: MEDIUM
impactDescription: evita reexecuções e efeitos duplicados
tags: rerender, useEffect, events, side-effects, dependencies
---

## Coloque Lógica de Interação em Handlers

Se um efeito colateral é acionado por uma ação específica (submit, click, drag), execute no handler do evento. Não modele a ação como estado + effect; isso faz o effect reexecutar em mudanças não relacionadas e pode duplicar a ação.

**Incorreto (evento modelado como estado + effect):**

```tsx
function Form() {
  const [submitted, setSubmitted] = useState(false)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    if (submitted) {
      post('/api/register')
      showToast('Registered', theme)
    }
  }, [submitted, theme])

  return <button onClick={() => setSubmitted(true)}>Submit</button>
}
```

**Correto (faça no handler):**

```tsx
function Form() {
  const theme = useContext(ThemeContext)

  function handleSubmit() {
    post('/api/register')
    showToast('Registered', theme)
  }

  return <button onClick={handleSubmit}>Submit</button>
}
```

Referencia: [Should this code move to an event handler?](https://react.dev/learn/removing-effect-dependencies#should-this-code-move-to-an-event-handler)
