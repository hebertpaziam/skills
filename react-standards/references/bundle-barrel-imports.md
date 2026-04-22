---
title: Evite Imports de Barrel
impact: CRITICAL
impactDescription: 200-800ms de custo, builds lentos
tags: bundle, imports, tree-shaking, barrel-files, performance
---

## Evite Imports de Barrel

Importe direto dos arquivos de origem em vez de barrel files para evitar carregar milhares de módulos não usados. **Barrel files** são pontos de entrada que reexportam vários módulos (ex.: `index.js` que faz `export * from './module'`).

Bibliotecas populares de ícones e componentes podem ter **até 10.000 reexports** no arquivo de entrada. Para muitos pacotes React, **leva 200-800ms apenas para importar**, afetando a velocidade de desenvolvimento e os cold starts em produção.

**Por que tree-shaking não ajuda:** Quando uma biblioteca é marcada como externa (não bundlada), o bundler não consegue otimizar. Se você bundlar para habilitar tree-shaking, os builds ficam bem mais lentos ao analisar todo o grafo de módulos.

**Incorreto (importa a biblioteca inteira):**

```tsx
import { Check, X, Menu } from 'lucide-react'
// Carrega 1.583 módulos, leva ~2.8s extra em dev
// Custo em runtime: 200-800ms em cada cold start

import { Button, TextField } from '@mui/material'
// Carrega 2.225 módulos, leva ~4.2s extra em dev
```

**Correto - Next.js 13.5+ (recomendado):**

```js
// next.config.js - otimiza imports de barrel no build
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@mui/material']
  }
}
```

```tsx
// Mantenha os imports padrão - Next.js transforma em imports diretos
import { Check, X, Menu } from 'lucide-react'
// Suporte total a TypeScript, sem manipular paths manualmente
```

Esta é a abordagem recomendada porque preserva a segurança de tipos do TypeScript e o autocomplete do editor enquanto elimina o custo do barrel import.

**Correto - Imports diretos (projetos fora do Next.js):**

```tsx
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// Carrega apenas o que você usa
```

> **Aviso de TypeScript:** Algumas bibliotecas (notavelmente `lucide-react`) não entregam arquivos `.d.ts` para paths de import profundo. Importar de `lucide-react/dist/esm/icons/check` resulta em tipo `any` implícito, causando erros com `strict` ou `noImplicitAny`. Prefira `optimizePackageImports` quando disponível, ou verifique se a biblioteca exporta tipos para seus subpaths antes de usar imports diretos.

Essas otimizações geram dev boot 15-70% mais rápido, builds 28% mais rápidos, cold starts 40% mais rápidos e HMR significativamente mais rápido.

Bibliotecas com impacto comum: `lucide-react`, `@mui/material`, `@mui/icons-material`, `@tabler/icons-react`, `react-icons`, `@headlessui/react`, `@radix-ui/react-*`, `lodash`, `ramda`, `date-fns`, `rxjs`, `react-use`.

Referência: [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
