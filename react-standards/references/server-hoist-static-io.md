---
title: Movimente I/O Estático para o Escopo do Módulo
impact: HIGH
impactDescription: evita I/O repetido por requisição
tags: server, io, performance, next.js, route-handlers, og-image
---

## Movimente I/O Estático para o Escopo do Módulo

### Impacto: ALTO (evita I/O repetido por requisição)

Ao carregar assets estáticos (fonts, logos, imagens, arquivos de config) em route handlers ou funções de server, mova o I/O para o escopo do módulo. Código em nível de módulo roda uma vez quando o módulo é importado, não a cada requisição. Isso elimina leituras repetidas no sistema de arquivos ou fetches de rede que rodariam em toda chamada.

**Incorreto (lê o arquivo de fonte a cada requisição):**

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  // Roda em TODA requisição - caro!
  const fontData = await fetch(
    new URL('./fonts/Inter.ttf', import.meta.url)
  ).then(res => res.arrayBuffer())

  const logoData = await fetch(
    new URL('./images/logo.png', import.meta.url)
  ).then(res => res.arrayBuffer())

  return new ImageResponse(
    <div style={{ fontFamily: 'Inter' }}>
      <img src={logoData} />
      Hello World
    </div>,
    { fonts: [{ name: 'Inter', data: fontData }] }
  )
}
```

**Correto (carrega uma vez na inicialização do módulo):**

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

// Nível de módulo: roda UMA vez quando o módulo é importado
const fontData = fetch(
  new URL('./fonts/Inter.ttf', import.meta.url)
).then(res => res.arrayBuffer())

const logoData = fetch(
  new URL('./images/logo.png', import.meta.url)
).then(res => res.arrayBuffer())

export async function GET(request: Request) {
  // Aguarda as promises já iniciadas
  const [font, logo] = await Promise.all([fontData, logoData])

  return new ImageResponse(
    <div style={{ fontFamily: 'Inter' }}>
      <img src={logo} />
      Hello World
    </div>,
    { fonts: [{ name: 'Inter', data: font }] }
  )
}
```

**Correto (fs síncrono no nível do módulo):**

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

// Leitura síncrona no nível do módulo - bloqueia só na init do módulo
const fontData = readFileSync(
  join(process.cwd(), 'public/fonts/Inter.ttf')
)

const logoData = readFileSync(
  join(process.cwd(), 'public/images/logo.png')
)

export async function GET(request: Request) {
  return new ImageResponse(
    <div style={{ fontFamily: 'Inter' }}>
      <img src={logoData} />
      Hello World
    </div>,
    { fonts: [{ name: 'Inter', data: fontData }] }
  )
}
```

**Incorreto (lê config a cada chamada):**

```typescript
import fs from 'node:fs/promises'

export async function processRequest(data: Data) {
  const config = JSON.parse(
    await fs.readFile('./config.json', 'utf-8')
  )
  const template = await fs.readFile('./template.html', 'utf-8')

  return render(template, data, config)
}
```

**Correto (move config e template para o nível do módulo):**

```typescript
import fs from 'node:fs/promises'

const configPromise = fs
  .readFile('./config.json', 'utf-8')
  .then(JSON.parse)
const templatePromise = fs.readFile('./template.html', 'utf-8')

export async function processRequest(data: Data) {
  const [config, template] = await Promise.all([
    configPromise,
    templatePromise,
  ])

  return render(template, data, config)
}
```

Quando usar este padrão:

- Carregar fontes para gerar OG image
- Carregar logos, ícones ou marcas d'água estáticas
- Ler arquivos de configuração que não mudam em runtime
- Carregar templates de email ou outros templates estáticos
- Qualquer asset estático igual para todas as requisições

Quando não usar este padrão:

- Assets que variam por requisição ou usuário
- Arquivos que podem mudar em runtime (use cache com TTL)
- Arquivos grandes que consumiriam muita memória se mantidos carregados
- Dados sensíveis que não devem ficar persistidos em memória

Com o [Fluid Compute](https://vercel.com/docs/fluid-compute) da Vercel, cache em nível de módulo é especialmente efetivo porque múltiplas requisições concorrentes compartilham a mesma instância da função. Os assets estáticos ficam carregados na memória entre requisições sem penalidade de cold start.

Em serverless tradicional, cada cold start reexecuta código em nível de módulo, mas invocações quentes subsequentes reutilizam os assets carregados até a instância ser reciclada.
