---
title: Carregamento Condicional de Módulos
impact: HIGH
impactDescription: carrega dados grandes quando necessário
tags: bundle, conditional-loading, lazy-loading
---

## Carregamento Condicional de Módulos

Carregue dados grandes ou módulos apenas quando a feature estiver ativa.

**Exemplo (lazy-load de frames de animação):**

```tsx
function AnimationPlayer({ enabled, setEnabled }: { enabled: boolean; setEnabled: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [frames, setFrames] = useState<Frame[] | null>(null)

  useEffect(() => {
    if (enabled && !frames && typeof window !== 'undefined') {
      import('./animation-frames.js')
        .then(mod => setFrames(mod.frames))
        .catch(() => setEnabled(false))
    }
  }, [enabled, frames, setEnabled])

  if (!frames) return <Skeleton />
  return <Canvas frames={frames} />
}
```

A verificação `typeof window !== 'undefined'` evita bundlar esse módulo para SSR, otimizando o tamanho do bundle do servidor e a velocidade do build.
