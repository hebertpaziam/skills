---
title: Preload com Base na Intenção do Usuário
impact: MEDIUM
impactDescription: reduz latência percebida
tags: bundle, preload, user-intent, hover
---

## Preload com Base na Intenção do Usuário

Faça preload de bundles pesados antes de serem necessários para reduzir a latência percebida.

**Exemplo (preload ao passar o mouse/focus):**

```tsx
function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => {
    if (typeof window !== 'undefined') {
      void import('./monaco-editor')
    }
  }

  return (
    <button
      onMouseEnter={preload}
      onFocus={preload}
      onClick={onClick}
    >
      Open Editor
    </button>
  )
}
```

**Exemplo (preload quando feature flag está habilitada):**

```tsx
function FlagsProvider({ children, flags }: Props) {
  useEffect(() => {
    if (flags.editorEnabled && typeof window !== 'undefined') {
      void import('./monaco-editor').then(mod => mod.init())
    }
  }, [flags.editorEnabled])

  return <FlagsContext.Provider value={flags}>
    {children}
  </FlagsContext.Provider>
}
```

A verificação `typeof window !== 'undefined'` evita bundlar módulos preloaded para SSR, otimizando o tamanho do bundle do servidor e a velocidade do build.
