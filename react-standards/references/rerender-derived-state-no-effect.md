---
title: Calcule Estado Derivado Durante o Render
impact: MEDIUM
impactDescription: evita renders redundantes e desvio de estado
tags: rerender, derived-state, useEffect, state
---

## Calcule Estado Derivado Durante o Render

Se um valor pode ser calculado a partir de props/estado atuais, não o armazene em estado nem o atualize em um effect. Derive durante o render para evitar renders extras e desvio de estado. Não atualize estado em effects apenas por mudança de props; prefira valores derivados ou resets por key.

**Incorreto (estado e effect redundantes):**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return <p>{fullName}</p>
}
```

**Correto (derivar durante o render):**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const fullName = firstName + ' ' + lastName

  return <p>{fullName}</p>
}
```

Referências: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
