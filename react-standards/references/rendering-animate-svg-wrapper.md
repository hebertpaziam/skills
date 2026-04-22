---
title: Anime o Wrapper do SVG, não o SVG
impact: LOW
impactDescription: habilita aceleração de hardware
tags: rendering, svg, css, animation, performance
---

## Anime o Wrapper do SVG, não o SVG

Muitos browsers não tem aceleração de hardware para animações CSS3 em elementos SVG. Envolva o SVG em uma `<div>` e anime o wrapper.

**Incorreto (animar o SVG direto - sem aceleração):**

```tsx
function LoadingSpinner() {
  return (
    <svg 
      className="animate-spin"
      width="24" 
      height="24" 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  )
}
```

**Correto (animar a div wrapper - com aceleração):**

```tsx
function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}
```

Isso vale para todas as transformações e transições CSS (`transform`, `opacity`, `translate`, `scale`, `rotate`). A div wrapper permite usar GPU para animações mais suaves.
