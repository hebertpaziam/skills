---
title: Use Resource Hints do React DOM
impact: HIGH
impactDescription: reduz tempo de carga de recursos críticos
tags: rendering, preload, preconnect, prefetch, resource-hints
---

## Use Resource Hints do React DOM

### Impacto: ALTO (reduz tempo de carga de recursos críticos)

O React DOM oferece APIs para sugerir recursos ao browser. São especialmente úteis em server components para iniciar o carregamento antes do HTML chegar ao client.

- **`prefetchDNS(href)`**: Resolve DNS para um domínio que você espera conectar
- **`preconnect(href)`**: Estabelece conexão (DNS + TCP + TLS) com um servidor
- **`preload(href, options)`**: Faz fetch de recurso (stylesheet, font, script, imagem)
- **`preloadModule(href)`**: Faz fetch de um módulo ES que você usará logo
- **`preinit(href, options)`**: Faz fetch e avalia stylesheet ou script
- **`preinitModule(href)`**: Faz fetch e avalia um módulo ES

**Exemplo (preconnect em APIs third-party):**

```tsx
import { preconnect, prefetchDNS } from 'react-dom'

export default function App() {
  prefetchDNS('https://analytics.example.com')
  preconnect('https://api.example.com')

  return <main>{/* content */}</main>
}
```

**Exemplo (preload de fontes e estilos críticos):**

```tsx
import { preload, preinit } from 'react-dom'

export default function RootLayout({ children }) {
  // Preload do arquivo de fonte
  preload('/fonts/inter.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })

  // Busca e aplica stylesheet crítico imediatamente
  preinit('/styles/critical.css', { as: 'style' })

  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

**Exemplo (preload de módulos para rotas code-split):**

```tsx
import { preloadModule, preinitModule } from 'react-dom'

function Navigation() {
  const preloadDashboard = () => {
    preloadModule('/dashboard.js', { as: 'script' })
  }

  return (
    <nav>
      <a href="/dashboard" onMouseEnter={preloadDashboard}>
        Dashboard
      </a>
    </nav>
  )
}
```

**Quando usar cada um:**

| API | Use case |
|-----|----------|
| `prefetchDNS` | Domínios third-party que você conectará depois |
| `preconnect` | APIs ou CDNs que você vai buscar de imediato |
| `preload` | Recursos críticos da página atual |
| `preloadModule` | Módulos JS para a próxima navegação provável |
| `preinit` | Stylesheets/scripts que devem executar cedo |
| `preinitModule` | Módulos ES que devem executar cedo |

Referência: [React DOM Resource Preloading APIs](https://react.dev/reference/react-dom#resource-preloading-apis)
