---
title: Otimize a Precisão de SVG
impact: LOW
impactDescription: reduz tamanho do arquivo
tags: rendering, svg, optimization, svgo
---

## Otimize a Precisão de SVG

Reduza a precisão de coordenadas do SVG para diminuir o tamanho do arquivo. A precisão ideal depende do viewBox, mas em geral vale reduzir.

**Incorreto (precisão excessiva):**

```svg
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />
```

**Correto (1 casa decimal):**

```svg
<path d="M 10.3 20.8 L 30.9 40.2" />
```

**Automatize com SVGO:**

```bash
npx svgo --precision=1 --multipass icon.svg
```
