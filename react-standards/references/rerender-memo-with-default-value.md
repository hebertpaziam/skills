---

title: Extraia Valor Padrão Não Primitivo para Constante
impact: MEDIUM
impactDescription: restaura memoização usando constante
tags: rerender, memo, optimization

---

## Extraia Valor Padrão Não Primitivo para Constante

Quando um componente memoizado tem valor padrão não primitivo (array, função, objeto), chamar o componente sem esse parâmetro quebra a memoização. Isso ocorre porque novas instâncias são criadas a cada re-render e não passam na comparação de igualdade estrita do `memo()`.

Para resolver, extraia o valor padrão para uma constante.

**Incorreto (`onClick` tem valores diferentes a cada re-render):**

```tsx
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```

**Correto (valor padrão estável):**

```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```
