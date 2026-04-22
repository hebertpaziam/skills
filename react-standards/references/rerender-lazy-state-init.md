---
title: Use Inicialização Lazy de Estado
impact: MEDIUM
impactDescription: computação desperdicada a cada render
tags: react, hooks, useState, performance, initialization
---

## Use Inicialização Lazy de Estado

Passe uma função para `useState` quando o valor inicial for caro. Sem a forma funcional, o inicializador roda em todo render mesmo sendo usado apenas uma vez.

**Incorreto (roda em todo render):**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() roda em TODO render, mesmo após a inicialização
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
  const [query, setQuery] = useState('')
  
  // Quando query muda, buildSearchIndex roda de novo sem necessidade
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse roda em todo render
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings') || '{}')
  )
  
  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

**Correto (roda apenas uma vez):**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() roda APENAS no render inicial
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
  const [query, setQuery] = useState('')
  
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse roda apenas no render inicial
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('settings')
    return stored ? JSON.parse(stored) : {}
  })
  
  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

Use inicialização lazy ao computar valores iniciais a partir de localStorage/sessionStorage, construir estruturas de dados (índices, mapas), ler do DOM ou fazer transformações pesadas.

Para primitivos simples (`useState(0)`), referências diretas (`useState(props.value)`) ou literais baratos (`useState({})`), a forma funcional não é necessária.
