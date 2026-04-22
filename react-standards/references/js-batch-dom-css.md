---
title: Evite Layout Thrashing
impact: MEDIUM
impactDescription: evita layouts síncronos e gargalos
tags: javascript, dom, css, performance, reflow, layout-thrashing
---

## Evite Layout Thrashing

Evite intercalar escrita de estilos com leitura de layout. Ao ler propriedades como `offsetWidth`, `getBoundingClientRect()` ou `getComputedStyle()` entre mudanças de estilo, o browser é forçado a reflow síncrono.

**OK (browser agrupa mudanças de estilo):**

```typescript
function updateElementStyles(element: HTMLElement) {
  // Cada linha invalida estilo, mas o browser agrupa o recálculo
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
}
```

**Incorreto (leituras/escritas intercaladas forçam reflow):**

```typescript
function layoutThrashing(element: HTMLElement) {
  element.style.width = '100px'
  const width = element.offsetWidth  // Força reflow
  element.style.height = '200px'
  const height = element.offsetHeight  // Força outro reflow
}
```

**Correto (agrupa writes, depois lê uma vez):**

```typescript
function updateElementStyles(element: HTMLElement) {
  // Agrupa todas as writes
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
  
  // Lê depois das writes (um reflow)
  const { width, height } = element.getBoundingClientRect()
}
```

**Correto (agrupa reads, depois writes):**

```typescript
function avoidThrashing(element: HTMLElement) {
  // Fase de leitura - queries primeiro
  const rect1 = element.getBoundingClientRect()
  const offsetWidth = element.offsetWidth
  const offsetHeight = element.offsetHeight
  
  // Fase de escrita - mudanças depois
  element.style.width = '100px'
  element.style.height = '200px'
}
```

### Melhor: use classes CSS

```css
.highlighted-box {
  width: 100px;
  height: 200px;
  background-color: blue;
  border: 1px solid black;
}
```

```typescript
function updateElementStyles(element: HTMLElement) {
  element.classList.add('highlighted-box')
  
  const { width, height } = element.getBoundingClientRect()
}
```

### Exemplo React

```tsx
// Incorrect: interleaving style changes with layout queries
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (ref.current && isHighlighted) {
      ref.current.style.width = '100px'
      const width = ref.current.offsetWidth // Forces layout
      ref.current.style.height = '200px'
    }
  }, [isHighlighted])
  
  return <div ref={ref}>Content</div>
}

// Correct: toggle class
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  return (
    <div className={isHighlighted ? 'highlighted-box' : ''}>
      Content
    </div>
  )
}
```

Prefira classes CSS em vez de inline styles quando possível. Arquivos CSS são cacheados pelo browser e classes separam melhor responsabilidades.

Veja [este gist](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) e [CSS Triggers](https://csstriggers.com/) para mais informações sobre operações que forçam layout.
