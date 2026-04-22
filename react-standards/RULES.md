<!-- markdownlint-disable MD024 -->
# Boas Práticas de React

Versão 1.0.0

Engenharia Vercel  
Janeiro 2026

> **Nota:**  
> Este documento é principalmente para agentes e LLMs seguirem ao manter,  
> gerar ou refatorar codebases React e Next.js. Humanos  
> também podem achar útil, mas a orientação aqui é otimizada para automação  
> e consistência em workflows assistidos por IA.

---

## Resumo

Guia abrangente de otimização de performance para aplicações React e Next.js, pensado para agentes de IA e LLMs. Contém 40+ regras em 8 categorias, priorizadas por impacto, de crítico (eliminar waterfalls, reduzir bundle) a incremental (advanced patterns). Cada regra inclui explicações detalhadas, exemplos reais comparando implementações incorretas vs corretas e métricas de impacto para orientar refatoração automatizada e geração de código.

---

## Sumário

1. [Eliminating Waterfalls](#1-eliminating-waterfalls) — **CRITICAL**
   - 1.1 [Check Cheap Conditions Before Async Flags](#11-check-cheap-conditions-before-async-flags)
   - 1.2 [Defer Await Until Needed](#12-defer-await-until-needed)
   - 1.3 [Dependency-Based Parallelization](#13-dependency-based-parallelization)
   - 1.4 [Prevent Waterfall Chains in API Routes](#14-prevent-waterfall-chains-in-api-routes)
   - 1.5 [Promise.all() for Independent Operations](#15-promiseall-for-independent-operations)
   - 1.6 [Strategic Suspense Boundaries](#16-strategic-suspense-boundaries)
2. [Bundle Size Optimization](#2-bundle-size-optimization) — **CRITICAL**
   - 2.1 [Avoid Barrel File Imports](#21-avoid-barrel-file-imports)
   - 2.2 [Conditional Module Loading](#22-conditional-module-loading)
   - 2.3 [Defer Non-Critical Third-Party Libraries](#23-defer-non-critical-third-party-libraries)
   - 2.4 [Dynamic Imports for Heavy Components](#24-dynamic-imports-for-heavy-components)
   - 2.5 [Prefer Statically Analyzable Paths](#25-prefer-statically-analyzable-paths)
   - 2.6 [Preload Based on User Intent](#26-preload-based-on-user-intent)
3. [Server-Side Performance](#3-server-side-performance) — **HIGH**
   - 3.1 [Authenticate Server Actions Like API Routes](#31-authenticate-server-actions-like-api-routes)
   - 3.2 [Avoid Duplicate Serialization in RSC Props](#32-avoid-duplicate-serialization-in-rsc-props)
   - 3.3 [Avoid Shared Module State for Request Data](#33-avoid-shared-module-state-for-request-data)
   - 3.4 [Cross-Request LRU Caching](#34-cross-request-lru-caching)
   - 3.5 [Hoist Static I/O to Module Level](#35-hoist-static-io-to-module-level)
   - 3.6 [Minimize Serialization at RSC Boundaries](#36-minimize-serialization-at-rsc-boundaries)
   - 3.7 [Parallel Data Fetching with Component Composition](#37-parallel-data-fetching-with-component-composition)
   - 3.8 [Parallel Nested Data Fetching](#38-parallel-nested-data-fetching)
   - 3.9 [Per-Request Deduplication with React.cache()](#39-per-request-deduplication-with-reactcache)
   - 3.10 [Use after() for Non-Blocking Operations](#310-use-after-for-non-blocking-operations)
4. [Client-Side Data Fetching](#4-client-side-data-fetching) — **MEDIUM-HIGH**
   - 4.1 [Deduplicate Global Event Listeners](#41-deduplicate-global-event-listeners)
   - 4.2 [Use Passive Event Listeners for Scrolling Performance](#42-use-passive-event-listeners-for-scrolling-performance)
   - 4.3 [Use SWR for Automatic Deduplication](#43-use-swr-for-automatic-deduplication)
   - 4.4 [Version and Minimize localStorage Data](#44-version-and-minimize-localstorage-data)
5. [Re-render Optimization](#5-re-render-optimization) — **MEDIUM**
   - 5.1 [Calculate Derived State During Rendering](#51-calculate-derived-state-during-rendering)
   - 5.2 [Defer State Reads to Usage Point](#52-defer-state-reads-to-usage-point)
   - 5.3 [Do not wrap a simple expression with a primitive result type in useMemo](#53-do-not-wrap-a-simple-expression-with-a-primitive-result-type-in-usememo)
   - 5.4 [Don't Define Components Inside Components](#54-dont-define-components-inside-components)
   - 5.5 [Extract Default Non-primitive Parameter Value from Memoized Component to Constant](#55-extract-default-non-primitive-parameter-value-from-memoized-component-to-constant)
   - 5.6 [Extract to Memoized Components](#56-extract-to-memoized-components)
   - 5.7 [Narrow Effect Dependencies](#57-narrow-effect-dependencies)
   - 5.8 [Put Interaction Logic in Event Handlers](#58-put-interaction-logic-in-event-handlers)
   - 5.9 [Split Combined Hook Computations](#59-split-combined-hook-computations)
   - 5.10 [Subscribe to Derived State](#510-subscribe-to-derived-state)
   - 5.11 [Use Functional setState Updates](#511-use-functional-setstate-updates)
   - 5.12 [Use Lazy State Initialization](#512-use-lazy-state-initialization)
   - 5.13 [Use Transitions for Non-Urgent Updates](#513-use-transitions-for-non-urgent-updates)
   - 5.14 [Use useDeferredValue for Expensive Derived Renders](#514-use-usedeferredvalue-for-expensive-derived-renders)
   - 5.15 [Use useRef for Transient Values](#515-use-useref-for-transient-values)
6. [Rendering Performance](#6-rendering-performance) — **MEDIUM**
   - 6.1 [Animate SVG Wrapper Instead of SVG Element](#61-animate-svg-wrapper-instead-of-svg-element)
   - 6.2 [CSS content-visibility for Long Lists](#62-css-content-visibility-for-long-lists)
   - 6.3 [Hoist Static JSX Elements](#63-hoist-static-jsx-elements)
   - 6.4 [Optimize SVG Precision](#64-optimize-svg-precision)
   - 6.5 [Prevent Hydration Mismatch Without Flickering](#65-prevent-hydration-mismatch-without-flickering)
   - 6.6 [Suppress Expected Hydration Mismatches](#66-suppress-expected-hydration-mismatches)
   - 6.7 [Use Activity Component for Show/Hide](#67-use-activity-component-for-showhide)
   - 6.8 [Use defer or async on Script Tags](#68-use-defer-or-async-on-script-tags)
   - 6.9 [Use Explicit Conditional Rendering](#69-use-explicit-conditional-rendering)
   - 6.10 [Use React DOM Resource Hints](#610-use-react-dom-resource-hints)
   - 6.11 [Use useTransition Over Manual Loading States](#611-use-usetransition-over-manual-loading-states)
7. [JavaScript Performance](#7-javascript-performance) — **LOW-MEDIUM**
   - 7.1 [Avoid Layout Thrashing](#71-avoid-layout-thrashing)
   - 7.2 [Build Index Maps for Repeated Lookups](#72-build-index-maps-for-repeated-lookups)
   - 7.3 [Cache Property Access in Loops](#73-cache-property-access-in-loops)
   - 7.4 [Cache Repeated Function Calls](#74-cache-repeated-function-calls)
   - 7.5 [Cache Storage API Calls](#75-cache-storage-api-calls)
   - 7.6 [Combine Multiple Array Iterations](#76-combine-multiple-array-iterations)
   - 7.7 [Defer Non-Critical Work with requestIdleCallback](#77-defer-non-critical-work-with-requestidlecallback)
   - 7.8 [Early Length Check for Array Comparisons](#78-early-length-check-for-array-comparisons)
   - 7.9 [Early Return from Functions](#79-early-return-from-functions)
   - 7.10 [Hoist RegExp Creation](#710-hoist-regexp-creation)
   - 7.11 [Use flatMap to Map and Filter in One Pass](#711-use-flatmap-to-map-and-filter-in-one-pass)
   - 7.12 [Use Loop for Min/Max Instead of Sort](#712-use-loop-for-minmax-instead-of-sort)
   - 7.13 [Use Set/Map for O(1) Lookups](#713-use-setmap-for-o1-lookups)
   - 7.14 [Use toSorted() Instead of sort() for Immutability](#714-use-tosorted-instead-of-sort-for-immutability)
8. [Advanced Patterns](#8-advanced-patterns) — **LOW**
   - 8.1 [Do Not Put Effect Events in Dependency Arrays](#81-do-not-put-effect-events-in-dependency-arrays)
   - 8.2 [Initialize App Once, Not Per Mount](#82-initialize-app-once-not-per-mount)
   - 8.3 [Store Event Handlers in Refs](#83-store-event-handlers-in-refs)
   - 8.4 [useEffectEvent for Stable Callback Refs](#84-useeffectevent-for-stable-callback-refs)

---

## 1. Eliminating Waterfalls

### Impact: CRITICAL

Waterfalls são o principal fator de perda de performance. Cada await sequencial adiciona latência de rede completa. Eliminá-los gera os maiores ganhos.

### 1.1 Check Cheap Conditions Before Async Flags

Impact: HIGH (evita trabalho async desnecessário quando um guard síncrono ja falha)

Quando um ramo usa `await` para uma flag ou valor remoto e também exige uma condição **síncrona barata** (props locais, metadados da request, estado ja carregado), avalie a condição barata **primeiro**. Caso contrario, você paga a chamada async mesmo quando a condição composta nunca pode ser verdadeira.

Isso e uma especialização de [Defer Await Until Needed](./async-defer-await.md) para verificacoes do tipo `flag && cheapCondition`.

#### Incorrect

```typescript
const someFlag = await getFlag()

if (someFlag && someCondition) {
  // ...
}
```

#### Correct

```typescript
if (someCondition) {
  const someFlag = await getFlag()
  if (someFlag) {
    // ...
  }
}
```

Isso importa quando `getFlag` acessa a rede, um servico de feature flag, ou trabalho em `React.cache` / DB: pular essa etapa quando `someCondition` e falso remove esse custo no caminho frio.

Mantenha a ordem original se `someCondition` for cara, depender da flag, ou se você precisar executar efeitos colaterais em uma ordem fixa.

### 1.2 Defer Await Until Needed

Impact: HIGH (evita bloquear caminhos de código não usados)

Mova operações `await` para os ramos onde elas são realmente usadas, evitando bloquear caminhos de código que não precisam delas.

#### Incorrect: blocks both branches

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)
  
  if (skipProcessing) {
    // Returns immediately but still waited for userData
    return { skipped: true }
  }
  
  // Only this branch uses userData
  return processUserData(userData)
}
```

#### Correct: only blocks when needed

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // Returns immediately without waiting
    return { skipped: true }
  }
  
  // Fetch only when needed
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

Outro exemplo: otimização de early return

```typescript
// Incorrect: always fetches permissions
async function updateResource(resourceId: string, userId: string) {
  const permissions = await fetchPermissions(userId)
  const resource = await getResource(resourceId)
  
  if (!resource) {
    return { error: 'Not found' }
  }
  
  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }
  
  return await updateResourceData(resource, permissions)
}

// Correct: fetches only when needed
async function updateResource(resourceId: string, userId: string) {
  const resource = await getResource(resourceId)
  
  if (!resource) {
    return { error: 'Not found' }
  }
  
  const permissions = await fetchPermissions(userId)
  
  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }
  
  return await updateResourceData(resource, permissions)
}
```

Essa otimização e especialmente valiosa quando o ramo ignorado e frequente ou quando a operação adiada e cara.

Para `await getFlag()` combinado com um guard síncrono barato (`flag && someCondition`), veja [Check Cheap Conditions Before Async Flags](./async-cheap-condition-before-await.md).

### 1.3 Dependency-Based Parallelization

Impact: CRITICAL (melhoria de 2-10x)

Para operações com dependências parciais, use `better-all` para maximizar paralelismo. Ele inicia cada tarefa no momento mais cedo possível.

#### Incorrect: profile espera config sem necessidade

```typescript
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)
```

#### Correct: config e profile rodam em paralelo

```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})
```

Alternativa sem dependências extras

```typescript
const userPromise = fetchUser()
const profilePromise = userPromise.then(user => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([
  userPromise,
  fetchConfig(),
  profilePromise
])
```

Também podemos criar todas as promises primeiro e executar `Promise.all()` ao final.

Referência: [https://github.com/shuding/better-all](https://github.com/shuding/better-all)

### 1.4 Prevent Waterfall Chains in API Routes

Impact: CRITICAL (melhoria de 2-10x)

Em API routes e Server Actions, inicie operações independentes imediatamente, mesmo que você ainda não faça await.

#### Incorrect: config espera auth, data espera ambos

```typescript
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}
```

#### Correct: auth e config iniciam imediatamente

```typescript
export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([
    configPromise,
    fetchData(session.user.id)
  ])
  return Response.json({ data, config })
}
```

Para operações com cadeias de dependência mais complexas, use `better-all` para maximizar o paralelismo automaticamente (veja Dependency-Based Parallelization).

### 1.5 Promise.all() for Independent Operations

Impact: CRITICAL (melhoria de 2-10x)

Quando operações async não tem interdependências, execute-as de forma concorrente com `Promise.all()`.

#### Incorrect: execução sequencial, 3 round trips

```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

#### Correct: execução paralela, 1 round trip

```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

### 1.6 Strategic Suspense Boundaries

Impact: HIGH (pintura inicial mais rápida)

Em vez de aguardar dados em componentes async antes de retornar JSX, use limites de Suspense para mostrar a UI externa mais rápido enquanto os dados carregam.

#### Incorrect: wrapper bloqueado por fetch de dados

```tsx
async function Page() {
  const data = await fetchData() // Blocks entire page
  
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  )
}
```

Todo o layout espera pelos dados, mesmo que apenas a seção do meio precise deles.

#### Correct: wrapper aparece imediatamente, dados chegam em streaming

```tsx
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <Suspense fallback={<Skeleton />}>
          <DataDisplay />
        </Suspense>
      </div>
      <div>Footer</div>
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData() // Only blocks this component
  return <div>{data.content}</div>
}
```

Sidebar, Header e Footer renderizam imediatamente. Apenas DataDisplay espera pelos dados.

Alternativa: compartilhar promise entre componentes

```tsx
function Page() {
  // Start fetch immediately, but don't await
  const dataPromise = fetchData()
  
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay dataPromise={dataPromise} />
        <DataSummary dataPromise={dataPromise} />
      </Suspense>
      <div>Footer</div>
    </div>
  )
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Unwraps the promise
  return <div>{data.content}</div>
}

function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Reuses the same promise
  return <div>{data.summary}</div>
}
```

Ambos os componentes compartilham a mesma promise, entao apenas um fetch ocorre. O layout renderiza imediatamente enquanto os dois componentes aguardam juntos.

Quando NÃO usar este padrão

- Dados críticos para decisoes de layout (afetam posicionamento)

- Conteúdo crítico para SEO acima da dobra

- Consultas pequenas e rapidas em que o overhead de suspense não compensa

- Quando você quer evitar layout shift (loading → salto de conteúdo)

**Trade-off:** Pintura inicial mais rápida vs possível layout shift. Escolha com base nas prioridades de UX.

---

## 2. Bundle Size Optimization

Impact: CRITICAL

Reduzir o tamanho inicial do bundle melhora Time to Interactive e Largest Contentful Paint.

### 2.1 Avoid Barrel File Imports

Impact: CRITICAL (custo de importacao de 200-800ms, builds lentos)

Importe diretamente dos arquivos de origem em vez de barrel files para evitar carregar milhares de módulos não usados. **Barrel files** são entry points que reexportam vários módulos (ex.: `index.js` que faz `export * from './module'`).

Bibliotecas populares de ícones e componentes podem ter **até 10.000 re-exports** no entry file. Para muitos pacotes React, **leva 200-800ms apenas para importar**, afetando velocidade de desenvolvimento e cold starts em produção.

**Por que tree-shaking não ajuda:** Quando uma biblioteca é marcada como externa (não bundle), o bundler não consegue otimizar. Se você fizer bundle para habilitar tree-shaking, os builds ficam bem mais lentos ao analisar todo o grafo de módulos.

#### Incorrect: importa a biblioteca inteira

```tsx
import { Check, X, Menu } from 'lucide-react'
// Loads 1,583 modules, takes ~2.8s extra in dev
// Runtime cost: 200-800ms on every cold start

import { Button, TextField } from '@mui/material'
// Loads 2,225 modules, takes ~4.2s extra in dev
```

#### Correct - Next.js 13.5+ (recommended)

```tsx
// Mantenha os imports padrão - o Next.js os transforma em imports diretos
import { Check, X, Menu } from 'lucide-react'
// Suporte completo de TypeScript, sem ajuste manual de paths
```

Esta é a abordagem recomendada porque preserva a segurança de tipos do TypeScript e o autocomplete do editor, enquanto elimina o custo do barrel import.

#### Correct - Direct imports (non-Next.js projects)

```tsx
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// Carrega apenas o que você usa
```

> **Aviso de TypeScript:** Algumas bibliotecas (notavelmente `lucide-react`) não entregam arquivos `.d.ts` para paths de import profundo. Importar de `lucide-react/dist/esm/icons/check` resulta em tipo `any` implícito, causando erros com `strict` ou `noImplicitAny`. Prefira `optimizePackageImports` quando disponível, ou verifique se a biblioteca exporta tipos para seus subpaths antes de usar imports diretos.

Essas otimizações fornecem 15-70% de boot mais rápido em dev, 28% de builds mais rápidos, 40% de cold starts mais rápidos e HMR significativamente mais rápido.

Bibliotecas com impacto comum: `lucide-react`, `@mui/material`, `@mui/icons-material`, `@tabler/icons-react`, `react-icons`, `@headlessui/react`, `@radix-ui/react-*`, `lodash`, `ramda`, `date-fns`, `rxjs`, `react-use`.

Referência: [https://vercel.com/blog/how-we-optimized-package-imports-in-next-js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)

### 2.2 Conditional Module Loading

Impact: HIGH (carrega dados grandes apenas quando necessário)

Carregue dados grandes ou módulos apenas quando uma feature estiver ativa.

Exemplo: lazy-load de frames de animação

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

O check `typeof window !== 'undefined'` evita bundlar este módulo para SSR, otimizando o tamanho do bundle do servidor e a velocidade do build.

### 2.3 Defer Non-Critical Third-Party Libraries

Impact: MEDIUM (carrega após a hidratação)

Analytics, logging e error tracking não bloqueiam a interação do usuário. Carregue depois da hidratação.

#### Incorrect: bloqueia o bundle inicial

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### Correct: carrega após a hidratação

```tsx
import dynamic from 'next/dynamic'

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(m => m.Analytics),
  { ssr: false }
)

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2.4 Dynamic Imports for Heavy Components

Impact: CRITICAL (afeta diretamente TTI e LCP)

Use `next/dynamic` para lazy-load de componentes grandes que não são necessários no render inicial.

#### Incorrect: Monaco bundle com main chunk ~300KB

```tsx
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

#### Correct: Monaco carrega sob demanda

```tsx
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

### 2.5 Prefer Statically Analyzable Paths

#### Impact: HIGH (evita bundles amplos e file traces acidentais)

Ferramentas de build funcionam melhor quando paths de import e file-system são óbvios no build. Se você esconde o path real em uma variável ou compõe de forma muito dinâmica, a ferramenta precisa incluir um conjunto amplo de arquivos possíveis, avisar que não consegue analisar o import ou ampliar o file tracing para ficar segura.

Prefira mapas explícitos ou paths literais para manter o conjunto de arquivos alcançáveis estreito e previsível. Essa regra vale tanto para escolher módulos com `import()` quanto para ler arquivos em código de server/build.

Quando a análise fica ampla demais, o custo é real:

- Bundles de servidor maiores

- Builds mais lentos

- Cold starts piores

- Maior uso de memória

#### Incorrect: o bundler não consegue dizer o que pode ser importado

```ts
const PAGE_MODULES = {
  home: './pages/home',
  settings: './pages/settings',
} as const

const Page = await import(PAGE_MODULES[pageName])
```

#### Correct: use um mapa explícito de módulos permitidos

```ts
const PAGE_MODULES = {
  home: () => import('./pages/home'),
  settings: () => import('./pages/settings'),
} as const

const Page = await PAGE_MODULES[pageName]()
```

#### Incorrect: um enum de 2 valores ainda esconde o path final da análise estatica

```ts
const baseDir = path.join(process.cwd(), 'content/' + contentKind)
```

#### Correct: torne cada path final literal no callsite

```ts
const baseDir =
  kind === ContentKind.Blog
    ? path.join(process.cwd(), 'content/blog')
    : path.join(process.cwd(), 'content/docs')
```

Em código server do Next.js, isso também importa para output file tracing. `path.join(process.cwd(), someVar)` pode ampliar o conjunto rastreado porque o Next.js analisa estaticamente o uso de `import`, `require` e `fs`.

Referência: [https://nextjs.org/docs/app/api-reference/config/next-config-js/output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), [https://nextjs.org/learn/seo/dynamic-imports](https://nextjs.org/learn/seo/dynamic-imports), [https://vite.dev/guide/features.html](https://vite.dev/guide/features.html), [https://esbuild.github.io/api/](https://esbuild.github.io/api/), [https://www.npmjs.com/package/@rollup/plugin-dynamic-import-vars](https://www.npmjs.com/package/@rollup/plugin-dynamic-import-vars), [https://webpack.js.org/guides/dependency-management/](https://webpack.js.org/guides/dependency-management/)

### 2.6 Preload Based on User Intent

Impact: MEDIUM (reduz latência percebida)

Faça preload de bundles pesados antes de serem necessários para reduzir latência percebida.

Exemplo: preload em hover/focus

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

Exemplo: preload quando feature flag está habilitada

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

O check `typeof window !== 'undefined'` evita incluir módulos pré-carregados no bundle de SSR, otimizando o tamanho do bundle de servidor e a velocidade de build.

---

## 3. Server-Side Performance

Impact: HIGH

Otimizar renderização no servidor e data fetching elimina cascatas no servidor e reduz tempos de resposta.

### 3.1 Authenticate Server Actions Like API Routes

Impact: CRITICAL (prevents unauthorized access to server mutations)

Server Actions (funções com `"use server"`) ficam expostas como endpoints públicos, assim como rotas de API. Sempre valide autenticação e autorização **dentro** de cada Server Action — não confie apenas em middleware, guards de layout ou checagens de página, já que Server Actions podem ser chamadas diretamente.

A documentação do Next.js afirma explicitamente: "Treat Server Actions with the same security considerations as public-facing API endpoints, and verify if the user is allowed to perform a mutation."

#### Incorrect: sem verificação de autenticação

```typescript
'use server'

export async function deleteUser(userId: string) {
  // Anyone can call this! No auth check
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

#### Correct: autenticação dentro da action

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { unauthorized } from '@/lib/errors'

export async function deleteUser(userId: string) {
  // Always check auth inside the action
  const session = await verifySession()
  
  if (!session) {
    throw unauthorized('Must be logged in')
  }
  
  // Check authorization too
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('Cannot delete other users')
  }
  
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

Com validação de entrada

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email()
})

export async function updateProfile(data: unknown) {
  // Validate input first
  const validated = updateProfileSchema.parse(data)
  
  // Then authenticate
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  // Then authorize
  if (session.user.id !== validated.userId) {
    throw new Error('Can only update own profile')
  }
  
  // Finally perform the mutation
  await db.user.update({
    where: { id: validated.userId },
    data: {
      name: validated.name,
      email: validated.email
    }
  })
  
  return { success: true }
}
```

Referência: [https://nextjs.org/docs/app/guides/authentication](https://nextjs.org/docs/app/guides/authentication)

### 3.2 Avoid Duplicate Serialization in RSC Props

Impact: LOW (reduz payload de rede ao evitar serialização duplicada)

A serialização RSC→cliente deduplica por referência de objeto, não por valor. Mesma referência = serializa uma vez; nova referência = serializa de novo. Faça transformações (`.toSorted()`, `.filter()`, `.map()`) no cliente, não no servidor.

#### Incorrect: duplica array

```tsx
// RSC: sends 6 strings (2 arrays × 3 items)
<ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
```

#### Correct: envia 3 strings

```tsx
// RSC: send once
<ClientList usernames={usernames} />

// Client: transform there
'use client'
const sorted = useMemo(() => [...usernames].sort(), [usernames])
```

Comportamento de deduplicação aninhada

```tsx
// string[] - duplicates everything
usernames={['a','b']} sorted={usernames.toSorted()} // sends 4 strings

// object[] - duplicates array structure only
users={[{id:1},{id:2}]} sorted={users.toSorted()} // sends 2 arrays + 2 unique objects (not 4)
```

A deduplicação funciona de forma recursiva. O impacto varia por tipo de dado:

- `string[]`, `number[]`, `boolean[]`: **HIGH impact** - array + all primitives fully duplicated

- `object[]`: **LOW impact** - array duplicated, but nested objects deduplicated by reference

Operações que quebram a deduplicação: criam novas referências

- Arrays: `.toSorted()`, `.filter()`, `.map()`, `.slice()`, `[...arr]`

- Objects: `{...obj}`, `Object.assign()`, `structuredClone()`, `JSON.parse(JSON.stringify())`

Mais exemplos

```tsx
// ❌ Bad
<C users={users} active={users.filter(u => u.active)} />
<C product={product} productName={product.name} />

// ✅ Good
<C users={users} />
<C product={product} />
// Do filtering/destructuring in client
```

**Exceção:** Passe dados derivados quando a transformação for cara ou o cliente não precisar do original.

### 3.3 Avoid Shared Module State for Request Data

Impact: HIGH (evita bugs de concorrência e vazamento de dados entre requests)

Para React Server Components e componentes client renderizados durante SSR, evite usar variáveis mutáveis no nível do módulo para compartilhar dados escopados ao request. Renderizações no servidor podem ocorrer em paralelo no mesmo processo. Se um render escreve em estado compartilhado do módulo e outro lê, você pode ter race conditions, contaminação entre requests e bugs de segurança onde dados de um usuário aparecem na resposta de outro.

Trate o escopo do módulo no servidor como memória compartilhada do processo, não como estado local do request.

#### Incorrect: dados do request vazam entre renders concorrentes

```tsx
let currentUser: User | null = null

export default async function Page() {
  currentUser = await auth()
  return <Dashboard />
}

async function Dashboard() {
  return <div>{currentUser?.name}</div>
}
```

Se dois requests se sobrepõem, o request A pode definir `currentUser`, e o request B sobrescreve antes de o request A terminar de renderizar `Dashboard`.

#### Correct: mantenha os dados do request locais à árvore de render

```tsx
export default async function Page() {
  const user = await auth()
  return <Dashboard user={user} />
}

function Dashboard({ user }: { user: User | null }) {
  return <div>{user?.name}</div>
}
```

Exceções seguras:

- Assets estáticos imutáveis ou configs carregadas uma vez no nível do módulo

- Caches compartilhados intencionalmente desenhados para reuso entre requests e corretamente keyados

- Singletons do processo que não armazenam dados mutáveis específicos de request ou usuário

Para assets estáticos e config, veja [Hoist Static I/O to Module Level](./server-hoist-static-io.md).

### 3.4 Cross-Request LRU Caching

Impact: HIGH (cache entre requests)

`React.cache()` funciona apenas dentro de um request. Para dados compartilhados entre requests sequenciais (usuário clica no botão A e depois no botão B), use um cache LRU.

Implementation

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000  // 5 minutes
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}

// Request 1: DB query, result cached
// Request 2: cache hit, no DB query
```

Use quando ações sequenciais do usuário atingem múltiplos endpoints que precisam dos mesmos dados em poucos segundos.

**Com o [Fluid Compute](https://vercel.com/docs/fluid-compute) da Vercel:** cache LRU é especialmente eficaz porque múltiplos requests concorrentes podem compartilhar a mesma instância de função e o cache. Isso significa que o cache persiste entre requests sem precisar de armazenamento externo como Redis.

**Em serverless tradicional:** cada invocação roda isolada, então considere Redis para cache entre processos.

Referência: [https://github.com/isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache)

### 3.5 Hoist Static I/O to Module Level

Impact: HIGH (evita I/O de arquivo/rede repetido por request)

Ao carregar assets estáticos (fontes, logos, imagens, arquivos de configuração) em route handlers ou funções de servidor, eleve a operação de I/O para o nível do módulo. Código no nível do módulo roda uma vez quando o módulo é importado pela primeira vez, não em todo request. Isso elimina leituras redundantes do file system ou fetches de rede que rodariam a cada invocação.

#### Incorrect: lê o arquivo de fonte em todo request

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  // Runs on EVERY request - expensive!
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

#### Correct: carrega uma vez na inicialização do módulo

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

// Module-level: runs ONCE when module is first imported
const fontData = fetch(
  new URL('./fonts/Inter.ttf', import.meta.url)
).then(res => res.arrayBuffer())

const logoData = fetch(
  new URL('./images/logo.png', import.meta.url)
).then(res => res.arrayBuffer())

export async function GET(request: Request) {
  // Await the already-started promises
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

#### Correct: fs síncrono no nível do módulo

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

// Synchronous read at module level - blocks only during module init
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

#### Incorrect: lê config em toda chamada

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

#### Correct: eleva config e template para o nível do módulo

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

- Carregar fontes para geração de imagem OG

- Carregar logos, ícones ou marcas d'agua estáticos

- Ler arquivos de configuração que não mudam em runtime

- Carregar templates de email ou outros templates estáticos

- Qualquer asset estático igual para todos os requests

Quando não usar este padrão:

- Assets que variam por request ou usuário

- Arquivos que podem mudar em runtime (use cache com TTL)

- Arquivos grandes que consumiriam muita memória se mantidos carregados

- Dados sensíveis que não devem persistir em memória

Com o [Fluid Compute](https://vercel.com/docs/fluid-compute) da Vercel, cache no nível do módulo é especialmente eficaz porque múltiplos requests concorrentes compartilham a mesma instância de função. Os assets estáticos permanecem carregados em memória entre requests sem penalidade de cold start.

Em serverless tradicional, cada cold start re-executa o código do módulo, mas invocações aquecidas reaproveitam os assets carregados até a instância ser reciclada.

### 3.6 Minimize Serialization at RSC Boundaries

Impact: HIGH (reduz tamanho de transferência de dados)

A fronteira entre React Server/Client serializa todas as propriedades dos objetos em strings e as embute na resposta HTML e nos requests RSC subsequentes. Esses dados serializados impactam diretamente o peso da página e o tempo de carregamento, então **tamanho importa muito**. Passe apenas os campos que o cliente realmente usa.

#### Incorrect: serializa todos os 50 campos

```tsx
async function Page() {
  const user = await fetchUser()  // 50 fields
  return <Profile user={user} />
}

'use client'
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div>  // uses 1 field
}
```

#### Correct: serializa apenas 1 campo

```tsx
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}

'use client'
function Profile({ name }: { name: string }) {
  return <div>{name}</div>
}
```

### 3.7 Parallel Data Fetching with Component Composition

Impact: CRITICAL (elimina cascatas no servidor)

React Server Components executam de forma sequencial dentro da árvore. Reestruture com composição para paralelizar o data fetching.

#### Incorrect: Sidebar espera o fetch de Page terminar

```tsx
export default async function Page() {
  const header = await fetchHeader()
  return (
    <div>
      <div>{header}</div>
      <Sidebar />
    </div>
  )
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}
```

#### Correct: ambos fazem fetch simultaneamente

```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

export default function Page() {
  return (
    <div>
      <Header />
      <Sidebar />
    </div>
  )
}
```

Alternativa com a prop `children`

```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default function Page() {
  return (
    <Layout>
      <Sidebar />
    </Layout>
  )
}
```

### 3.8 Parallel Nested Data Fetching

Impact: CRITICAL (elimina cascatas no servidor)

Ao fazer fetch de dados aninhados em paralelo, encadeie fetches dependentes dentro da promise de cada item para que um item lento não bloqueie o resto.

#### Incorrect: um item lento bloqueia todos os fetches aninhados

```tsx
const chats = await Promise.all(
  chatIds.map(id => getChat(id))
)

const chatAuthors = await Promise.all(
  chats.map(chat => getUser(chat.author))
)
```

Se um `getChat(id)` entre 100 for extremamente lento, os autores dos outros 99 chats não conseguem iniciar o carregamento, mesmo com dados prontos.

#### Correct: cada item encadeia seu próprio fetch aninhado

```tsx
const chatAuthors = await Promise.all(
  chatIds.map(id => getChat(id).then(chat => getUser(chat.author)))
)
```

Cada item encadeia de forma independente `getChat` → `getUser`, então um chat lento não bloqueia o fetch dos autores dos demais.

### 3.9 Per-Request Deduplication with React.cache()

Impact: MEDIUM (deduplica dentro do request)

Use `React.cache()` para deduplicação por request no servidor. Autenticação e queries de banco são as que mais se beneficiam.

Usage

```typescript
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null
  return await db.user.findUnique({
    where: { id: session.user.id }
  })
})
```

Dentro de um único request, múltiplas chamadas a `getCurrentUser()` executam a query apenas uma vez.

Evite objetos inline como argumentos

`React.cache()` usa igualdade rasa (`Object.is`) para determinar cache hits. Objetos inline criam novas referências a cada chamada, impedindo hits.

#### Incorrect: sempre cache miss

```typescript
const getUser = cache(async (params: { uid: number }) => {
  return await db.user.findUnique({ where: { id: params.uid } })
})

// Each call creates new object, never hits cache
getUser({ uid: 1 })
getUser({ uid: 1 })  // Cache miss, runs query again
```

#### Correct: cache hit

```typescript
const params = { uid: 1 }
getUser(params)  // Query runs
getUser(params)  // Cache hit (same reference)
```

Se precisar passar objetos, passe a mesma referência:

Nota específica de Next.js

No Next.js, a API `fetch` é automaticamente estendida com memoização por request. Requests com a mesma URL e opções são deduplicados automaticamente dentro de um request, então você não precisa de `React.cache()` para chamadas `fetch`. Porém, `React.cache()` continua essencial para outras tarefas assíncronas:

- Database queries (Prisma, Drizzle, etc.)

- Heavy computations

- Authentication checks

- File system operations

- Any non-fetch async work

Use `React.cache()` para deduplicar essas operações em toda a árvore de componentes.

Referência: [https://react.dev/reference/react/cache](https://react.dev/reference/react/cache)

### 3.10 Use after() for Non-Blocking Operations

Impact: MEDIUM (respostas mais rápidas)

Use `after()` do Next.js para agendar trabalho que deve executar depois da resposta ser enviada. Isso evita que logs, analytics e outros efeitos colaterais bloqueiem a resposta.

#### Incorrect: bloqueia a resposta

```tsx
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)
  
  // Logging blocks the response
  const userAgent = request.headers.get('user-agent') || 'unknown'
  await logUserAction({ userAgent })
  
  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

#### Correct: não bloqueia

```tsx
import { after } from 'next/server'
import { headers, cookies } from 'next/headers'
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)
  
  // Log after response is sent
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionCookie = (await cookies()).get('session-id')?.value || 'anonymous'
    
    logUserAction({ sessionCookie, userAgent })
  })
  
  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

A resposta é enviada imediatamente enquanto o log acontece em background.

Casos de uso comuns

- Tracking de analytics

- Logs de auditoria

- Envio de notificações

- Invalidação de cache

- Tarefas de limpeza

Notas importantes

- `after()` roda mesmo se a resposta falhar ou redirecionar

- Funciona em Server Actions, Route Handlers e Server Components

Referência: [https://nextjs.org/docs/app/api-reference/functions/after](https://nextjs.org/docs/app/api-reference/functions/after)

---

## 4. Client-Side Data Fetching

Impact: MEDIUM-HIGH

Deduplicação automática e padrões eficientes de data fetching reduzem requests de rede redundantes.

### 4.1 Deduplicate Global Event Listeners

Impact: LOW (um listener para N componentes)

Use `useSWRSubscription()` para compartilhar listeners globais entre instâncias de componentes.

#### Incorrect: N instâncias = N listeners

```tsx
function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === key) {
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback])
}
```

Ao usar o hook `useKeyboardShortcut` várias vezes, cada instância registra um novo listener.

#### Correct: N instâncias = 1 listener

```tsx
import useSWRSubscription from 'swr/subscription'

// Module-level Map to track callbacks per key
const keyCallbacks = new Map<string, Set<() => void>>()

function useKeyboardShortcut(key: string, callback: () => void) {
  // Register this callback in the Map
  useEffect(() => {
    if (!keyCallbacks.has(key)) {
      keyCallbacks.set(key, new Set())
    }
    keyCallbacks.get(key)!.add(callback)

    return () => {
      const set = keyCallbacks.get(key)
      if (set) {
        set.delete(callback)
        if (set.size === 0) {
          keyCallbacks.delete(key)
        }
      }
    }
  }, [key, callback])

  useSWRSubscription('global-keydown', () => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && keyCallbacks.has(e.key)) {
        keyCallbacks.get(e.key)!.forEach(cb => cb())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })
}

function Profile() {
  // Multiple shortcuts will share the same listener
  useKeyboardShortcut('p', () => { /* ... */ }) 
  useKeyboardShortcut('k', () => { /* ... */ })
  // ...
}
```

### 4.2 Use Passive Event Listeners for Scrolling Performance

Impact: MEDIUM (elimina atraso de scroll causado por listeners)

Adicione `{ passive: true }` a listeners de touch e wheel para habilitar scroll imediato. Os navegadores normalmente esperam os listeners terminarem para checar se `preventDefault()` foi chamado, causando atraso no scroll.

#### Incorrect

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)
  
  document.addEventListener('touchstart', handleTouch)
  document.addEventListener('wheel', handleWheel)
  
  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

#### Correct

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)
  
  document.addEventListener('touchstart', handleTouch, { passive: true })
  document.addEventListener('wheel', handleWheel, { passive: true })
  
  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**Use passive quando:** tracking/analytics, logging, qualquer listener que não chame `preventDefault()`.

**Não use passive quando:** implementar gestos de swipe customizados, controles de zoom customizados ou qualquer listener que precise de `preventDefault()`.

### 4.3 Use SWR for Automatic Deduplication

Impact: MEDIUM-HIGH (automatic deduplication)

SWR habilita deduplicação de requests, cache e revalidação entre instâncias de componentes.

#### Incorrect: sem deduplicação, cada instância faz fetch

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

#### Correct: múltiplas instâncias compartilham um request

```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

Para dados imutáveis

```tsx
import { useImmutableSWR } from '@/lib/swr'

function StaticContent() {
  const { data } = useImmutableSWR('/api/config', fetcher)
}
```

Para mutations

```tsx
import { useSWRMutation } from 'swr/mutation'

function UpdateButton() {
  const { trigger } = useSWRMutation('/api/user', updateUser)
  return <button onClick={() => trigger()}>Update</button>
}
```

Referência: [https://swr.vercel.app](https://swr.vercel.app)

### 4.4 Version and Minimize localStorage Data

Impact: MEDIUM (evita conflitos de schema, reduz tamanho do storage)

Adicione prefixo de versão nas chaves e armazene apenas os campos necessários. Isso evita conflitos de schema e armazenamento acidental de dados sensíveis.

#### Incorrect

```typescript
// No version, stores everything, no error handling
localStorage.setItem('userConfig', JSON.stringify(fullUserObject))
const data = localStorage.getItem('userConfig')
```

#### Correct

```typescript
const VERSION = 'v2'

function saveConfig(config: { theme: string; language: string }) {
  try {
    localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(config))
  } catch {
    // Throws in incognito/private browsing, quota exceeded, or disabled
  }
}

function loadConfig() {
  try {
    const data = localStorage.getItem(`userConfig:${VERSION}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// Migration from v1 to v2
function migrate() {
  try {
    const v1 = localStorage.getItem('userConfig:v1')
    if (v1) {
      const old = JSON.parse(v1)
      saveConfig({ theme: old.darkMode ? 'dark' : 'light', language: old.lang })
      localStorage.removeItem('userConfig:v1')
    }
  } catch {}
}
```

Armazene o mínimo de campos das respostas do servidor

```typescript
// User object has 20+ fields, only store what UI needs
function cachePrefs(user: FullUser) {
  try {
    localStorage.setItem('prefs:v1', JSON.stringify({
      theme: user.preferences.theme,
      notifications: user.preferences.notifications
    }))
  } catch {}
}
```

**Sempre envolva em try-catch:** `getItem()` e `setItem()` lançam erro em modo incógnito/privado (Safari, Firefox), quando a cota estoura ou quando está desabilitado.

**Benefícios:** evolução de schema via versionamento, menor tamanho de storage, evita armazenar tokens/PII/flags internas.

---

## 5. Re-render Optimization

Impact: MEDIUM

Reduzir re-renders desnecessários minimiza computação desperdiçada e melhora a responsividade da UI.

### 5.1 Calculate Derived State During Rendering

Impact: MEDIUM (evita renders redundantes e drift de estado)

Se um valor pode ser calculado a partir de props/state atuais, não o guarde em state nem o atualize em um effect. Derive durante o render para evitar renders extras e drift de estado. Não faça `setState` em effects apenas em resposta a mudanças de props; prefira valores derivados ou resets com key.

#### Incorrect: state e effect redundantes

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return <p>{fullName}</p>
}
```

#### Correct: derive durante o render

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const fullName = firstName + ' ' + lastName

  return <p>{fullName}</p>
}
```

Referência: [https://react.dev/learn/you-might-not-need-an-effect](https://react.dev/learn/you-might-not-need-an-effect)

### 5.2 Defer State Reads to Usage Point

Impact: MEDIUM (evita subscriptions desnecessárias)

Não faça subscribe de estado dinâmico (searchParams, localStorage) se você só lê dentro de callbacks.

#### Incorrect: faz subscribe de todas as mudanças de searchParams

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

#### Correct: lê sob demanda, sem subscription

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

### 5.3 Do not wrap a simple expression with a primitive result type in useMemo

Impact: LOW-MEDIUM (computação desperdiçada em todo render)

Quando a expressão é simples (poucos operadores lógicos ou aritméticos) e tem resultado primitivo (boolean, number, string), não envolva com `useMemo`.

Chamar `useMemo` e comparar dependências do hook pode consumir mais recursos do que a própria expressão.

#### Incorrect

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading
  }, [user.isLoading, notifications.isLoading])

  if (isLoading) return <Skeleton />
  // return some markup
}
```

#### Correct

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = user.isLoading || notifications.isLoading

  if (isLoading) return <Skeleton />
  // return some markup
}
```

### 5.4 Don't Define Components Inside Components

Impact: HIGH (evita remount em todo render)

Definir um componente dentro de outro cria um novo tipo de componente a cada render. O React vê um componente diferente toda vez e remonta por completo, destruindo estado e DOM.

Um motivo comum é acessar variáveis do pai sem passar props. Sempre passe props.

#### Incorrect: remonta em todo render

```tsx
function UserProfile({ user, theme }) {
  // Defined inside to access `theme` - BAD
  const Avatar = () => (
    <img
      src={user.avatarUrl}
      className={theme === 'dark' ? 'avatar-dark' : 'avatar-light'}
    />
  )

  // Defined inside to access `user` - BAD
  const Stats = () => (
    <div>
      <span>{user.followers} followers</span>
      <span>{user.posts} posts</span>
    </div>
  )

  return (
    <div>
      <Avatar />
      <Stats />
    </div>
  )
}
```

Toda vez que `UserProfile` renderiza, `Avatar` e `Stats` são novos tipos de componente. O React desmonta as instâncias antigas e monta novas, perdendo estado interno, rerodando effects e recriando nós do DOM.

#### Correct: passe props

```tsx
function Avatar({ src, theme }: { src: string; theme: string }) {
  return (
    <img
      src={src}
      className={theme === 'dark' ? 'avatar-dark' : 'avatar-light'}
    />
  )
}

function Stats({ followers, posts }: { followers: number; posts: number }) {
  return (
    <div>
      <span>{followers} followers</span>
      <span>{posts} posts</span>
    </div>
  )
}

function UserProfile({ user, theme }) {
  return (
    <div>
      <Avatar src={user.avatarUrl} theme={theme} />
      <Stats followers={user.followers} posts={user.posts} />
    </div>
  )
}
```

Sintomas desse bug

- Campos de input perdem o foco a cada tecla

- Animações reiniciam inesperadamente

- Cleanup/setup de `useEffect` roda a cada render do pai

- Posição de scroll é resetada dentro do componente

### 5.5 Extract Default Non-primitive Parameter Value from Memoized Component to Constant

Impact: MEDIUM (restaura memoização usando constante para valor default)

Quando um componente memoizado tem um valor default para algum parâmetro opcional não primitivo, como array, função ou objeto, chamar o componente sem esse parâmetro quebra a memoização. Isso acontece porque novas instâncias do valor são criadas a cada rerender e não passam na comparação de igualdade estrita do `memo()`.

Para resolver, extraia o valor default para uma constante.

#### Incorrect: `onClick` tem valores diferentes a cada rerender

```tsx
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```

#### Correct: valor default estável

```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```

### 5.6 Extract to Memoized Components

Impact: MEDIUM (permite early returns)

Extraia trabalho caro para componentes memoizados para permitir early returns antes da computação.

#### Incorrect: computa avatar mesmo quando loading

```tsx
function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user)
    return <Avatar id={id} />
  }, [user])

  if (loading) return <Skeleton />
  return <div>{avatar}</div>
}
```

#### Correct: pula computação quando loading

```tsx
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
  const id = useMemo(() => computeAvatarId(user), [user])
  return <Avatar id={id} />
})

function Profile({ user, loading }: Props) {
  if (loading) return <Skeleton />
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  )
}
```

**Nota:** Se seu projeto tem [React Compiler](https://react.dev/learn/react-compiler) habilitado, memoização manual com `memo()` e `useMemo()` não é necessária. O compiler otimiza re-renders automaticamente.

### 5.7 Narrow Effect Dependencies

Impact: LOW (minimiza re-runs de effect)

Especifique dependências primitivas em vez de objetos para minimizar re-runs de effect.

#### Incorrect: re-runs on any user field change

```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

#### Correct: re-runs only when id changes

```tsx
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

Para estado derivado, compute fora do effect

```tsx
// Incorrect: runs on width=767, 766, 765...
useEffect(() => {
  if (width < 768) {
    enableMobileMode()
  }
}, [width])

// Correct: runs only on boolean transition
const isMobile = width < 768
useEffect(() => {
  if (isMobile) {
    enableMobileMode()
  }
}, [isMobile])
```

### 5.8 Put Interaction Logic in Event Handlers

Impact: MEDIUM (evita re-runs de effect e efeitos colaterais duplicados)

Se um efeito colateral é disparado por uma ação específica do usuário (submit, click, drag), execute no handler do evento. Não modele a ação como state + effect; isso faz o effect reexecutar em mudanças não relacionadas e pode duplicar a ação.

#### Incorrect: evento modelado como state + effect

```tsx
function Form() {
  const [submitted, setSubmitted] = useState(false)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    if (submitted) {
      post('/api/register')
      showToast('Registered', theme)
    }
  }, [submitted, theme])

  return <button onClick={() => setSubmitted(true)}>Submit</button>
}
```

#### Correct: faça no handler

```tsx
function Form() {
  const theme = useContext(ThemeContext)

  function handleSubmit() {
    post('/api/register')
    showToast('Registered', theme)
  }

  return <button onClick={handleSubmit}>Submit</button>
}
```

Referência: [https://react.dev/learn/removing-effect-dependencies#should-this-code-move-to-an-event-handler](https://react.dev/learn/removing-effect-dependencies#should-this-code-move-to-an-event-handler)

### 5.9 Split Combined Hook Computations

Impact: MEDIUM (evita recomputar etapas independentes)

Quando um hook contém múltiplas tarefas independentes com dependências diferentes, separe em hooks distintos. Um hook combinado reexecuta todas as tarefas quando qualquer dependência muda, mesmo que algumas tarefas não usem o valor alterado.

#### Incorrect: mudar `sortOrder` recomputa o filtro

```tsx
const sortedProducts = useMemo(() => {
  const filtered = products.filter((p) => p.category === category)
  const sorted = filtered.toSorted((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  )
  return sorted
}, [products, category, sortOrder])
```

#### Correct: o filtro só recomputa quando products ou category mudam

```tsx
const filteredProducts = useMemo(
  () => products.filter((p) => p.category === category),
  [products, category]
)

const sortedProducts = useMemo(
  () =>
    filteredProducts.toSorted((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    ),
  [filteredProducts, sortOrder]
)
```

Esse padrão também vale para `useEffect` quando combinamos efeitos colaterais não relacionados:

#### Incorrect: ambos os effects rodam quando qualquer dependência muda

```tsx
useEffect(() => {
  analytics.trackPageView(pathname)
  document.title = `${pageTitle} | My App`
}, [pathname, pageTitle])
```

#### Correct: effects rodam de forma independente

```tsx
useEffect(() => {
  analytics.trackPageView(pathname)
}, [pathname])

useEffect(() => {
  document.title = `${pageTitle} | My App`
}, [pageTitle])
```

**Nota:** Se seu projeto tem [React Compiler](https://react.dev/learn/react-compiler) habilitado, ele otimiza automaticamente o rastreio de dependências e pode lidar com alguns desses casos.

### 5.10 Subscribe to Derived State

Impact: MEDIUM (reduz a frequência de re-render)

Faça subscribe de estado booleano derivado em vez de valores contínuos para reduzir a frequência de re-render.

#### Incorrect: re-render em toda mudança de pixel

```tsx
function Sidebar() {
  const width = useWindowWidth()  // updates continuously
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

#### Correct: re-render apenas quando o boolean muda

```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

### 5.11 Use Functional setState Updates

Impact: MEDIUM (evita closures desatualizados e recriação desnecessária de callbacks)

Ao atualizar state com base no valor atual, use a forma funcional do setState em vez de referenciar diretamente a variável de state. Isso evita closures desatualizados, elimina dependências desnecessárias e cria referências estáveis de callbacks.

#### Incorrect: exige state como dependência

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)
  
  // Callback must depend on items, recreated on every items change
  const addItems = useCallback((newItems: Item[]) => {
    setItems([...items, ...newItems])
  }, [items])  // ❌ items dependency causes recreations
  
  // Risk of stale closure if dependency is forgotten
  const removeItem = useCallback((id: string) => {
    setItems(items.filter(item => item.id !== id))
  }, [])  // ❌ Missing items dependency - will use stale items!
  
  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

O primeiro callback é recriado toda vez que `items` muda, o que pode causar re-render desnecessário de componentes filhos. O segundo callback tem bug de stale closure — ele sempre referencia o valor inicial de `items`.

#### Correct: callbacks estáveis, sem stale closures

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)
  
  // Stable callback, never recreated
  const addItems = useCallback((newItems: Item[]) => {
    setItems(curr => [...curr, ...newItems])
  }, [])  // ✅ No dependencies needed
  
  // Always uses latest state, no stale closure risk
  const removeItem = useCallback((id: string) => {
    setItems(curr => curr.filter(item => item.id !== id))
  }, [])  // ✅ Safe and stable
  
  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

Benefícios

1. **Referências de callback estáveis** - Callbacks não precisam ser recriados quando o state muda

2. **Sem stale closures** - Sempre opera no valor de state mais recente

3. **Menos dependências** - Simplifica arrays de dependência e reduz leaks de memória

4. **Evita bugs** - Elimina a fonte mais comum de bugs de closure no React

Quando usar updates funcionais

- Qualquer setState que depende do valor atual de state

- Dentro de useCallback/useMemo quando o state é necessário

- Event handlers que referenciam state

- Operações assíncronas que atualizam state

Quando updates diretos são ok

- Definir state para um valor estático: `setCount(0)`

- Definir state apenas a partir de props/argumentos: `setName(newName)`

- State não depende do valor anterior

**Nota:** Se seu projeto tem [React Compiler](https://react.dev/learn/react-compiler) habilitado, o compiler pode otimizar alguns casos automaticamente, mas updates funcionais ainda são recomendados por corretude e para evitar bugs de stale closure.

### 5.12 Use Lazy State Initialization

Impact: MEDIUM (computação desperdiçada em todo render)

Passe uma função para `useState` em valores iniciais caros. Sem a forma de função, o inicializador roda a cada render mesmo que o valor só seja usado uma vez.

#### Incorrect: roda em todo render

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs on EVERY render, even after initialization
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
  const [query, setQuery] = useState('')
  
  // When query changes, buildSearchIndex runs again unnecessarily
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse runs on every render
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings') || '{}')
  )
  
  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

#### Correct: roda apenas uma vez

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs ONLY on initial render
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
  const [query, setQuery] = useState('')
  
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse runs only on initial render
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('settings')
    return stored ? JSON.parse(stored) : {}
  })
  
  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

Use inicialização preguiçosa ao calcular valores iniciais de localStorage/sessionStorage, construir estruturas de dados (índices, maps), ler do DOM ou fazer transformações pesadas.

Para primitivos simples (`useState(0)`), referências diretas (`useState(props.value)`) ou literais baratos (`useState({})`), a forma de função é desnecessária.

### 5.13 Use Transitions for Non-Urgent Updates

Impact: MEDIUM (mantém responsividade da UI)

Marque updates de state frequentes e não urgentes como transições para manter a responsividade da UI.

#### Incorrect: bloqueia a UI em todo scroll

```tsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

#### Correct: updates não bloqueantes

```tsx
import { startTransition } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

### 5.14 Use useDeferredValue for Expensive Derived Renders

Impact: MEDIUM (mantém o input responsivo durante computação pesada)

Quando entrada do usuário dispara computações ou renders caros, use `useDeferredValue` para manter o input responsivo. O valor deferred fica atrasado, permitindo ao React priorizar a atualização do input e renderizar o resultado caro quando estiver ocioso.

#### Incorrect: input fica lento durante o filtro

```tsx
function Search({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const filtered = items.filter(item => fuzzyMatch(item, query))

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ResultsList results={filtered} />
    </>
  )
}
```

#### Correct: input continua rápido, resultados renderizam quando prontos

```tsx
function Search({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const filtered = useMemo(
    () => items.filter(item => fuzzyMatch(item, deferredQuery)),
    [items, deferredQuery]
  )
  const isStale = query !== deferredQuery

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.7 : 1 }}>
        <ResultsList results={filtered} />
      </div>
    </>
  )
}
```

Quando usar

- Filtrar/pesquisar listas grandes

- Visualizações caras (charts, graphs) reagindo a input

- Qualquer estado derivado que cause atrasos perceptíveis de render

**Nota:** Envolva a computação cara em `useMemo` com o valor deferred como dependência; caso contrário, ela ainda roda em todo render.

Referência: [https://react.dev/reference/react/useDeferredValue](https://react.dev/reference/react/useDeferredValue)

### 5.15 Use useRef for Transient Values

Impact: MEDIUM (evita re-renders desnecessários em updates frequentes)

Quando um valor muda frequentemente e você não quer re-render em todo update (ex.: mouse trackers, intervalos, flags transitórias), armazene em `useRef` em vez de `useState`. Mantenha state do componente para a UI; use refs para valores temporários adjacentes ao DOM. Atualizar uma ref não dispara re-render.

#### Incorrect: renderiza em todo update

```tsx
function Tracker() {
  const [lastX, setLastX] = useState(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => setLastX(e.clientX)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: lastX,
        width: 8,
        height: 8,
        background: 'black',
      }}
    />
  )
}
```

#### Correct: sem re-render para tracking

```tsx
function Tracker() {
  const lastXRef = useRef(0)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastXRef.current = e.clientX
      const node = dotRef.current
      if (node) {
        node.style.transform = `translateX(${e.clientX}px)`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 8,
        height: 8,
        background: 'black',
        transform: 'translateX(0px)',
      }}
    />
  )
}
```

---

## 6. Rendering Performance

Impact: MEDIUM

Otimizar o processo de render reduz o trabalho que o navegador precisa fazer.

### 6.1 Animate SVG Wrapper Instead of SVG Element

Impact: LOW (habilita aceleração por hardware)

Muitos navegadores não têm aceleração por hardware para animações CSS3 em elementos SVG. Envolva o SVG em um `<div>` e anime o wrapper.

#### Incorrect: animando o SVG direto - sem aceleração por hardware

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

#### Correct: animando o wrapper div - com aceleração por hardware

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

Isso vale para todas as transforms e transitions (`transform`, `opacity`, `translate`, `scale`, `rotate`). O wrapper div permite ao navegador usar aceleração de GPU para animações mais suaves.

### 6.2 CSS content-visibility for Long Lists

Impact: HIGH (render inicial mais rápido)

Aplique `content-visibility: auto` para adiar renderização fora da tela.

CSS

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

Example

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map(msg => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
```

Para 1000 mensagens, o navegador pula layout/paint de ~990 itens fora da tela (render inicial 10x mais rápido).

### 6.3 Hoist Static JSX Elements

Impact: LOW (evita recriação)

Extraia JSX estático para fora dos componentes para evitar recriação.

#### Incorrect: recria o elemento em todo render

```tsx
function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />
}

function Container() {
  return (
    <div>
      {loading && <LoadingSkeleton />}
    </div>
  )
}
```

#### Correct: reusa o mesmo elemento

```tsx
const loadingSkeleton = (
  <div className="animate-pulse h-20 bg-gray-200" />
)

function Container() {
  return (
    <div>
      {loading && loadingSkeleton}
    </div>
  )
}
```

Isso é especialmente útil para nós SVG grandes e estáticos, que podem ser caros de recriar em todo render.

**Nota:** Se seu projeto tem [React Compiler](https://react.dev/learn/react-compiler) habilitado, o compiler eleva elementos JSX estáticos e otimiza re-renders automaticamente, tornando a elevação manual desnecessária.

### 6.4 Optimize SVG Precision

Impact: LOW (reduz tamanho do arquivo)

Reduza a precisão das coordenadas do SVG para diminuir o tamanho do arquivo. A precisão ideal depende do tamanho do viewBox, mas em geral vale considerar reduzir a precisão.

#### Incorrect: precisão excessiva

```svg
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />
```

#### Correct: 1 casa decimal

```svg
<path d="M 10.3 20.8 L 30.9 40.2" />
```

Automatize com SVGO

```bash
npx svgo --precision=1 --multipass icon.svg
```

### 6.5 Prevent Hydration Mismatch Without Flickering

Impact: MEDIUM (evita flicker visual e erros de hydration)

Ao renderizar conteúdo que depende de storage do cliente (localStorage, cookies), evite quebra de SSR e flicker pós-hydration injetando um script síncrono que atualiza o DOM antes do React hidratar.

#### Incorrect: quebra o SSR

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  // localStorage is not available on server - throws error
  const theme = localStorage.getItem('theme') || 'light'
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

O SSR falha porque `localStorage` é indefinido.

#### Incorrect: flicker visual

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')
  
  useEffect(() => {
    // Runs after hydration - causes visible flash
    const stored = localStorage.getItem('theme')
    if (stored) {
      setTheme(stored)
    }
  }, [])
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

O componente renderiza primeiro com o valor default (`light`) e depois atualiza após o hydration, causando um flash visível de conteúdo incorreto.

#### Correct: sem flicker, sem mismatch de hydration

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="theme-wrapper">
        {children}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('theme-wrapper');
                if (el) el.className = theme;
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  )
}
```

O script inline executa de forma síncrona antes de mostrar o elemento, garantindo que o DOM já tenha o valor correto. Sem flicker, sem mismatch de hydration.

Esse padrão é especialmente útil para toggles de tema, preferências do usuário, estados de autenticação e qualquer dado client-only que deve renderizar imediatamente sem flash do valor default.

### 6.6 Suppress Expected Hydration Mismatches

Impact: LOW-MEDIUM (evita avisos de hydration para diferenças conhecidas)

Em frameworks de SSR (ex.: Next.js), alguns valores são intencionalmente diferentes entre servidor e cliente (IDs aleatórios, datas, formatação de locale/timezone). Para esses mismatches *esperados*, envolva o texto dinâmico em um elemento com `suppressHydrationWarning` para evitar avisos ruidosos. Não use isso para esconder bugs reais. Não exagere.

#### Incorrect: avisos de mismatch conhecidos

```tsx
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>
}
```

#### Correct: suprime apenas mismatch esperado

```tsx
function Timestamp() {
  return (
    <span suppressHydrationWarning>
      {new Date().toLocaleString()}
    </span>
  )
}
```

### 6.7 Use Activity Component for Show/Hide

Impact: MEDIUM (preserva state/DOM)

Use o `<Activity>` do React para preservar state/DOM em componentes caros que alternam visibilidade com frequência.

Usage

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

Evita re-renders caros e perda de state.

### 6.8 Use defer or async on Script Tags

Impact: HIGH (elimina bloqueio de render)

Tags de script sem `defer` ou `async` bloqueiam o parsing do HTML enquanto o script baixa e executa. Isso atrasa First Contentful Paint e Time to Interactive.

- **`defer`**: baixa em paralelo, executa depois que o parsing do HTML termina, mantém ordem de execução

- **`async`**: baixa em paralelo, executa assim que estiver pronto, sem ordem garantida

Use `defer` para scripts que dependem do DOM ou de outros scripts. Use `async` para scripts independentes, como analytics.

#### Incorrect: bloqueia render

```tsx
export default function Document() {
  return (
    <html>
      <head>
        <script src="https://example.com/analytics.js" />
        <script src="/scripts/utils.js" />
      </head>
      <body>{/* content */}</body>
    </html>
  )
}
```

#### Correct: não bloqueia

```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/analytics.js" strategy="afterInteractive" />
      <Script src="/scripts/utils.js" strategy="beforeInteractive" />
    </>
  )
}
```

**Nota:** No Next.js, prefira o componente `next/script` com a prop `strategy` em vez de tags de script diretas:

Referência: [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#defer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#defer)

### 6.9 Use Explicit Conditional Rendering

Impact: LOW (evita renderizar 0 ou NaN)

Use operadores ternários explícitos (`? :`) em vez de `&&` para render condicional quando a condição pode ser `0`, `NaN` ou outros valores falsy que renderizam.

#### Incorrect: renderiza "0" quando count é 0

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count && <span className="badge">{count}</span>}
    </div>
  )
}

// When count = 0, renders: <div>0</div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```

#### Correct: não renderiza nada quando count é 0

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count > 0 ? <span className="badge">{count}</span> : null}
    </div>
  )
}

// When count = 0, renders: <div></div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```

### 6.10 Use React DOM Resource Hints

Impact: HIGH (reduz tempo de carga de recursos críticos)

O React DOM fornece APIs para sinalizar ao navegador recursos que ele vai precisar. Elas são especialmente úteis em server components para começar o carregamento antes mesmo de o cliente receber o HTML.

- **`prefetchDNS(href)`**: Resolve DNS for a domain you expect to connect to

- **`preconnect(href)`**: Establish connection (DNS + TCP + TLS) to a server

- **`preload(href, options)`**: Fetch a resource (stylesheet, font, script, image) you'll use soon

- **`preloadModule(href)`**: Fetch an ES module you'll use soon

- **`preinit(href, options)`**: Fetch and evaluate a stylesheet or script

- **`preinitModule(href)`**: Fetch and evaluate an ES module

Exemplo: preconnect com APIs de terceiros

```tsx
import { preconnect, prefetchDNS } from 'react-dom'

export default function App() {
  prefetchDNS('https://analytics.example.com')
  preconnect('https://api.example.com')

  return <main>{/* content */}</main>
}
```

Exemplo: preload de fontes e styles críticos

```tsx
import { preload, preinit } from 'react-dom'

export default function RootLayout({ children }) {
  // Preload font file
  preload('/fonts/inter.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })

  // Fetch and apply critical stylesheet immediately
  preinit('/styles/critical.css', { as: 'style' })

  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

Exemplo: preload de módulos para rotas com code-split

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

Quando usar cada uma

| API | Use case |

|-----|----------|

| `prefetchDNS` | Third-party domains you'll connect to later |

| `preconnect` | APIs or CDNs you'll fetch from immediately |

| `preload` | Critical resources needed for current page |

| `preloadModule` | JS modules for likely next navigation |

| `preinit` | Stylesheets/scripts that must execute early |

| `preinitModule` | ES modules that must execute early |

Referência: [https://react.dev/reference/react-dom#resource-preloading-apis](https://react.dev/reference/react-dom#resource-preloading-apis)

### 6.11 Use useTransition Over Manual Loading States

Impact: LOW (reduz re-renders e melhora a clareza do código)

Use `useTransition` em vez de `useState` manual para estados de loading. Isso fornece `isPending` embutido e gerencia transições automaticamente.

#### Incorrect: loading state manual

```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value: string) => {
    setIsLoading(true)
    setQuery(value)
    const data = await fetchResults(value)
    setResults(data)
    setIsLoading(false)
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

#### Correct: useTransition com pending state embutido

```tsx
import { useTransition, useState } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value) // Update input immediately
    
    startTransition(async () => {
      // Fetch and update results
      const data = await fetchResults(value)
      setResults(data)
    })
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

Benefícios

- **Pending state automático**: não precisa gerenciar `setIsLoading(true/false)` manualmente

- **Resiliência a erro**: o pending state reseta corretamente mesmo se a transição lançar erro

- **Melhor responsividade**: mantém a UI responsiva durante updates

- **Tratamento de interrupções**: novas transições cancelam pendências automaticamente

Referência: [https://react.dev/reference/react/useTransition](https://react.dev/reference/react/useTransition)

---

## 7. JavaScript Performance

Impact: LOW-MEDIUM

Micro-otimizações para hot paths podem somar ganhos significativos.

### 7.1 Avoid Layout Thrashing

Impact: MEDIUM (evita layouts síncronos forçados e reduz gargalos de performance)

Evite intercalar escritas de estilo com leituras de layout. Quando você lê uma propriedade de layout (como `offsetWidth`, `getBoundingClientRect()` ou `getComputedStyle()`) entre mudanças de estilo, o navegador é forçado a fazer reflow síncrono.

Isto é ok: o navegador agrupa mudanças de estilo

```typescript
function updateElementStyles(element: HTMLElement) {
  // Each line invalidates style, but browser batches the recalculation
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
}
```

#### Incorrect: leituras e escritas intercaladas forçam reflows

```typescript
function layoutThrashing(element: HTMLElement) {
  element.style.width = '100px'
  const width = element.offsetWidth  // Forces reflow
  element.style.height = '200px'
  const height = element.offsetHeight  // Forces another reflow
}
```

#### Correct: agrupe escritas, depois leia uma vez

```typescript
function updateElementStyles(element: HTMLElement) {
  // Batch all writes together
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
  
  // Read after all writes are done (single reflow)
  const { width, height } = element.getBoundingClientRect()
}
```

#### Correct: agrupe leituras, depois escreva

```typescript
function updateElementStyles(element: HTMLElement) {
  element.classList.add('highlighted-box')
  
  const { width, height } = element.getBoundingClientRect()
}
```

Melhor: use classes CSS

Exemplo em React

```tsx
// Incorrect: intercalando mudanças de estilo com leituras de layout
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

// Correct: alternar classe
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  return (
    <div className={isHighlighted ? 'highlighted-box' : ''}>
      Content
    </div>
  )
}
```

Prefira classes CSS a estilos inline quando possível. Arquivos CSS são cacheados pelo navegador, e classes oferecem melhor separação de responsabilidades e são mais fáceis de manter.

Veja [este gist](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) e [CSS Triggers](https://csstriggers.com/) para mais informações sobre operações que forçam layout.

### 7.2 Build Index Maps for Repeated Lookups

Impact: LOW-MEDIUM (1M ops para 2K ops)

Múltiplas chamadas de `.find()` pela mesma chave devem usar Map.

#### Incorrect (O(n) por lookup)

```typescript
function processOrders(orders: Order[], users: User[]) {
  return orders.map(order => ({
    ...order,
    user: users.find(u => u.id === order.userId)
  }))
}
```

#### Correct (O(1) por lookup)

```typescript
function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map(u => [u.id, u]))

  return orders.map(order => ({
    ...order,
    user: userById.get(order.userId)
  }))
}
```

Construa o map uma vez (O(n)) e depois todos os lookups são O(1).

Para 1000 orders × 1000 users: 1M ops → 2K ops.

### 7.3 Cache Property Access in Loops

Impact: LOW-MEDIUM (reduz lookups)

Cacheie buscas de propriedades do objeto em hot paths.

#### Incorrect: 3 lookups × N iterações

```typescript
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value)
}
```

#### Correct: 1 lookup no total

```typescript
const value = obj.config.settings.value
const len = arr.length
for (let i = 0; i < len; i++) {
  process(value)
}
```

### 7.4 Cache Repeated Function Calls

Impact: MEDIUM (evita computação redundante)

Use um Map no nível do módulo para cachear resultados quando a mesma função é chamada repetidamente com as mesmas entradas durante o render.

#### Incorrect: computação redundante

```typescript
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // slugify() called 100+ times for same project names
        const slug = slugify(project.name)
        
        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

#### Correct: resultados em cache

```typescript
// Cache no nível do módulo
const slugifyCache = new Map<string, string>()

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) {
    return slugifyCache.get(text)!
  }
  const result = slugify(text)
  slugifyCache.set(text, result)
  return result
}

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // Computado apenas uma vez por nome de projeto único
        const slug = cachedSlugify(project.name)
        
        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

Padrão mais simples para funções de valor único

```typescript
let isLoggedInCache: boolean | null = null

function isLoggedIn(): boolean {
  if (isLoggedInCache !== null) {
    return isLoggedInCache
  }
  
  isLoggedInCache = document.cookie.includes('auth=')
  return isLoggedInCache
}

// Limpa o cache quando o auth muda
function onAuthChange() {
  isLoggedInCache = null
}
```

Use um Map (não um hook) para funcionar em qualquer lugar: utils, event handlers, não apenas componentes React.

Referência: [https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)

### 7.5 Cache Storage API Calls

Impact: LOW-MEDIUM (reduz I/O caro)

`localStorage`, `sessionStorage` e `document.cookie` são síncronos e caros. Cacheie leituras em memória.

#### Incorrect: lê storage em toda chamada

```typescript
function getTheme() {
  return localStorage.getItem('theme') ?? 'light'
}
// Chamado 10 vezes = 10 leituras de storage
```

#### Correct: cache com Map

```typescript
const storageCache = new Map<string, string | null>()

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key))
  }
  return storageCache.get(key)
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value)
  storageCache.set(key, value)  // keep cache in sync
}
```

Use um Map (não um hook) para funcionar em qualquer lugar: utils, event handlers, não apenas componentes React.

Cache de cookie

```typescript
let cookieCache: Record<string, string> | null = null

function getCookie(name: string) {
  if (!cookieCache) {
    cookieCache = Object.fromEntries(
      document.cookie.split('; ').map(c => c.split('='))
    )
  }
  return cookieCache[name]
}
```

Importante: invalide em mudanças externas

```typescript
window.addEventListener('storage', (e) => {
  if (e.key) storageCache.delete(e.key)
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    storageCache.clear()
  }
})
```

Se o storage pode mudar externamente (outra aba, cookies setados pelo servidor), invalide o cache:

### 7.6 Combine Multiple Array Iterations

Impact: LOW-MEDIUM (reduz iterações)

Múltiplas chamadas de `.filter()` ou `.map()` iteram o array várias vezes. Combine em um loop só.

#### Incorrect: 3 iterações

```typescript
const admins = users.filter(u => u.isAdmin)
const testers = users.filter(u => u.isTester)
const inactive = users.filter(u => !u.isActive)
```

#### Correct: 1 iteração

```typescript
const admins: User[] = []
const testers: User[] = []
const inactive: User[] = []

for (const user of users) {
  if (user.isAdmin) admins.push(user)
  if (user.isTester) testers.push(user)
  if (!user.isActive) inactive.push(user)
}
```

### 7.7 Defer Non-Critical Work with requestIdleCallback

Impact: MEDIUM (mantém a UI responsiva durante tarefas em background)

Use `requestIdleCallback()` para agendar trabalho não crítico durante períodos ociosos do navegador. Isso mantém a main thread livre para interações e animações, reduzindo jank e melhorando a performance percebida.

#### Incorrect: bloqueia a main thread durante interação do usuário

```typescript
function handleSearch(query: string) {
  const results = searchItems(query)
  setResults(results)

  // These block the main thread immediately
  analytics.track('search', { query })
  saveToRecentSearches(query)
  prefetchTopResults(results.slice(0, 3))
}
```

#### Correct: adia trabalho não crítico para o tempo ocioso

```typescript
function handleSearch(query: string) {
  const results = searchItems(query)
  setResults(results)

  // Defer non-critical work to idle periods
  requestIdleCallback(() => {
    analytics.track('search', { query })
  })

  requestIdleCallback(() => {
    saveToRecentSearches(query)
  })

  requestIdleCallback(() => {
    prefetchTopResults(results.slice(0, 3))
  })
}
```

Com timeout para trabalho necessário

```typescript
// Ensure analytics fires within 2 seconds even if browser stays busy
requestIdleCallback(
  () => analytics.track('page_view', { path: location.pathname }),
  { timeout: 2000 }
)
```

Divisão de tarefas grandes em blocos

```typescript
function processLargeDataset(items: Item[]) {
  let index = 0

  function processChunk(deadline: IdleDeadline) {
    // Process items while we have idle time (aim for <50ms chunks)
    while (index < items.length && deadline.timeRemaining() > 0) {
      processItem(items[index])
      index++
    }

    // Schedule next chunk if more items remain
    if (index < items.length) {
      requestIdleCallback(processChunk)
    }
  }

  requestIdleCallback(processChunk)
}
```

Com fallback para navegadores sem suporte

```typescript
const scheduleIdleWork = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1))

scheduleIdleWork(() => {
  // Non-critical work
})
```

Quando usar

- Analytics e telemetria

- Salvar state em localStorage/IndexedDB

- Prefetch de recursos para próximas ações prováveis

- Processar transformações de dados não urgentes

- Inicialização preguiçosa de features não críticas

Quando NÃO usar

- Ações iniciadas pelo usuário que precisam de feedback imediato

- Updates de render que o usuário está esperando

- Operações sensíveis a tempo

### 7.8 Early Length Check for Array Comparisons

Impact: MEDIUM-HIGH (evita operações caras quando os tamanhos diferem)

Ao comparar arrays com operações caras (sorting, deep equality, serialização), cheque o tamanho primeiro. Se os tamanhos diferirem, os arrays não podem ser iguais.

Em aplicações reais, essa otimização é especialmente valiosa quando a comparação roda em hot paths (event handlers, loops de render).

#### Incorrect: sempre roda comparação cara

```typescript
function hasChanges(current: string[], original: string[]) {
  // Always sorts and joins, even when lengths differ
  return current.sort().join() !== original.sort().join()
}
```

Dois sorts O(n log n) rodam mesmo quando `current.length` é 5 e `original.length` é 100. Também há overhead de fazer join dos arrays e comparar as strings.

#### Correct (check de tamanho O(1) primeiro)

```typescript
function hasChanges(current: string[], original: string[]) {
  // Early return if lengths differ
  if (current.length !== original.length) {
    return true
  }
  // Only sort when lengths match
  const currentSorted = current.toSorted()
  const originalSorted = original.toSorted()
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true
    }
  }
  return false
}
```

Essa nova abordagem é mais eficiente porque:

- Evita o overhead de ordenar e fazer join dos arrays quando os tamanhos diferem

- Evita consumir memória para as strings concatenadas (especialmente importante para arrays grandes)

- Evita mutar os arrays originais

- Retorna mais cedo quando encontra uma diferença

### 7.9 Early Return from Functions

Impact: LOW-MEDIUM (evita computação desnecessária)

Retorne cedo quando o resultado já estiver determinado para pular processamento desnecessário.

#### Incorrect: processa todos os itens mesmo depois de achar a resposta

```typescript
function validateUsers(users: User[]) {
  let hasError = false
  let errorMessage = ''
  
  for (const user of users) {
    if (!user.email) {
      hasError = true
      errorMessage = 'Email required'
    }
    if (!user.name) {
      hasError = true
      errorMessage = 'Name required'
    }
    // Continues checking all users even after error found
  }
  
  return hasError ? { valid: false, error: errorMessage } : { valid: true }
}
```

#### Correct: retorna imediatamente no primeiro erro

```typescript
function validateUsers(users: User[]) {
  for (const user of users) {
    if (!user.email) {
      return { valid: false, error: 'Email required' }
    }
    if (!user.name) {
      return { valid: false, error: 'Name required' }
    }
  }

  return { valid: true }
}
```

### 7.10 Hoist RegExp Creation

Impact: LOW-MEDIUM (evita recriação)

Não crie RegExp dentro do render. Eleve para o escopo do módulo ou memoize com `useMemo()`.

#### Incorrect: novo RegExp em todo render

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

#### Correct: memoize ou eleve

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

Aviso: regex global tem estado mutável

```typescript
const regex = /foo/g
regex.test('foo')  // true, lastIndex = 3
regex.test('foo')  // false, lastIndex = 0
```

Regex global (`/g`) tem estado mutável de `lastIndex`:

### 7.11 Use flatMap to Map and Filter in One Pass

Impact: LOW-MEDIUM (elimina array intermediário)

Encadear `.map().filter(Boolean)` cria um array intermediário e itera duas vezes. Use `.flatMap()` para transformar e filtrar em uma única passada.

#### Incorrect: 2 iterações, array intermediário

```typescript
const userNames = users
  .map(user => user.isActive ? user.name : null)
  .filter(Boolean)
```

#### Correct: 1 iteração, sem array intermediário

```typescript
const userNames = users.flatMap(user =>
  user.isActive ? [user.name] : []
)
```

Mais exemplos

```typescript
// Extract valid emails from responses
// Before
const emails = responses
  .map(r => r.success ? r.data.email : null)
  .filter(Boolean)

// After
const emails = responses.flatMap(r =>
  r.success ? [r.data.email] : []
)

// Parse and filter valid numbers
// Before
const numbers = strings
  .map(s => parseInt(s, 10))
  .filter(n => !isNaN(n))

// After
const numbers = strings.flatMap(s => {
  const n = parseInt(s, 10)
  return isNaN(n) ? [] : [n]
})
```

Quando usar

- Transformar itens enquanto filtra alguns

- Mapeamento condicional onde algumas entradas não produzem saída

- Parsing/validação onde entradas inválidas devem ser ignoradas

### 7.12 Use Loop for Min/Max Instead of Sort

Impact: LOW (O(n) em vez de O(n log n))

Encontrar o menor ou maior elemento exige apenas uma passada no array. Ordenar é desperdício e mais lento.

#### Incorrect (O(n log n) - sort para achar o mais recente)

```typescript
interface Project {
  id: string
  name: string
  updatedAt: number
}

function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted[0]
}
```

Ordena o array inteiro apenas para achar o valor máximo.

#### Incorrect (O(n log n) - sort para mais antigo e mais novo)

```typescript
function getOldestAndNewest(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => a.updatedAt - b.updatedAt)
  return { oldest: sorted[0], newest: sorted[sorted.length - 1] }
}
```

Ainda ordena sem necessidade quando só min/max são necessários.

#### Correct (O(n) - loop único)

```typescript
function getLatestProject(projects: Project[]) {
  if (projects.length === 0) return null
  
  let latest = projects[0]
  
  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i]
    }
  }
  
  return latest
}

function getOldestAndNewest(projects: Project[]) {
  if (projects.length === 0) return { oldest: null, newest: null }
  
  let oldest = projects[0]
  let newest = projects[0]
  
  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt < oldest.updatedAt) oldest = projects[i]
    if (projects[i].updatedAt > newest.updatedAt) newest = projects[i]
  }
  
  return { oldest, newest }
}
```

Uma passada no array, sem cópia, sem ordenação.

Alternativa: Math.min/Math.max para arrays pequenos

```typescript
const numbers = [5, 2, 8, 1, 9]
const min = Math.min(...numbers)
const max = Math.max(...numbers)
```

Isso funciona para arrays pequenos, mas pode ser mais lento ou até dar erro para arrays muito grandes por causa do limite do spread. O tamanho máximo do array é aproximadamente 124000 no Chrome 143 e 638000 no Safari 18; os valores exatos podem variar — veja [the fiddle](https://jsfiddle.net/qw1jabsx/4/). Use o loop por confiabilidade.

### 7.13 Use Set/Map for O(1) Lookups

Impact: LOW-MEDIUM (O(n) para O(1))

Converta arrays para Set/Map em verificações de pertencimento repetidas.

#### Incorrect (O(n) por check)

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

#### Correct (O(1) por check)

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```

### 7.14 Use toSorted() Instead of sort() for Immutability

Impact: MEDIUM-HIGH (evita bugs de mutação em state do React)

`.sort()` muta o array no lugar, o que pode causar bugs com state e props no React. Use `.toSorted()` para criar um novo array ordenado sem mutação.

#### Incorrect: muta o array original

```typescript
function UserList({ users }: { users: User[] }) {
  // Mutates the users prop array!
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

#### Correct: cria um novo array

```typescript
function UserList({ users }: { users: User[] }) {
  // Creates new sorted array, original unchanged
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

Por que isso importa no React

1. Mutações de props/state quebram o modelo de imutabilidade do React - o React espera que props e state sejam somente leitura

2. Causa bugs de stale closure - mutar arrays dentro de closures (callbacks, effects) pode levar a comportamento inesperado

Suporte de browser: fallback para navegadores antigos

```typescript
// Fallback for older browsers
const sorted = [...items].sort((a, b) => a.value - b.value)
```

`.toSorted()` está disponível em todos os navegadores modernos (Chrome 110+, Safari 16+, Firefox 115+, Node.js 20+). Em ambientes antigos, use spread:

Outros métodos imutáveis de array

- `.toSorted()` - immutable sort

- `.toReversed()` - immutable reverse

- `.toSpliced()` - immutable splice

- `.with()` - immutable element replacement

---

## 8. Advanced Patterns

Impact: LOW

Padrões avançados para casos específicos que exigem implementação cuidadosa.

### 8.1 Do Not Put Effect Events in Dependency Arrays

Impact: LOW (evita re-runs de effect e erros de lint desnecessários)

Funções Effect Event não têm identidade estável. A identidade muda de propósito a cada render. Não inclua a função retornada por `useEffectEvent` no array de dependências de `useEffect`. Mantenha os valores reativos reais como dependências e chame o Effect Event de dentro do corpo do effect ou de subscriptions criadas por esse effect.

#### Incorrect: Effect Event adicionado como dependência

```tsx
import { useEffect, useEffectEvent } from 'react'

function ChatRoom({ roomId, onConnected }: {
  roomId: string
  onConnected: () => void
}) {
  const handleConnected = useEffectEvent(onConnected)

  useEffect(() => {
    const connection = createConnection(roomId)
    connection.on('connected', handleConnected)
    connection.connect()

    return () => connection.disconnect()
  }, [roomId, handleConnected])
}
```

Incluir o Effect Event nas dependências faz o effect reexecutar em todo render e dispara a regra de lint dos React Hooks.

#### Correct: dependa de valores reativos, não do Effect Event

```tsx
import { useEffect, useEffectEvent } from 'react'

function ChatRoom({ roomId, onConnected }: {
  roomId: string
  onConnected: () => void
}) {
  const handleConnected = useEffectEvent(onConnected)

  useEffect(() => {
    const connection = createConnection(roomId)
    connection.on('connected', handleConnected)
    connection.connect()

    return () => connection.disconnect()
  }, [roomId])
}
```

Referência: [https://react.dev/reference/react/useEffectEvent#effect-event-in-deps](https://react.dev/reference/react/useEffectEvent#effect-event-in-deps)

### 8.2 Initialize App Once, Not Per Mount

Impact: LOW-MEDIUM (evita init duplicado em desenvolvimento)

Não coloque inicialização global da app, que deve rodar uma vez por carga, dentro de `useEffect([])` de um componente. Componentes podem remontar e effects vão rodar de novo. Use um guard no nível do módulo ou init no topo do módulo de entrada.

#### Incorrect: roda duas vezes em dev, reexecuta em remount

```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

#### Correct: uma vez por carga da app

```tsx
let didInit = false

function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

Referência: [https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)

### 8.3 Store Event Handlers in Refs

Impact: LOW (subscriptions estáveis)

Guarde callbacks em refs quando usados em effects que não devem re-subscrever em mudanças de callback.

#### Incorrect: re-subscreve em todo render

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}
```

#### Correct: subscription estável

```tsx
import { useEffectEvent } from 'react'

function useWindowEvent(event: string, handler: (e) => void) {
  const onEvent = useEffectEvent(handler)

  useEffect(() => {
    window.addEventListener(event, onEvent)
    return () => window.removeEventListener(event, onEvent)
  }, [event])
}
```

Alternativa: use `useEffectEvent` se estiver na versão mais recente do React

`useEffectEvent` oferece uma API mais limpa para o mesmo padrão: cria uma referência de função estável que sempre chama a versão mais recente do handler.

### 8.4 useEffectEvent for Stable Callback Refs

Impact: LOW (evita re-runs de effect)

Acesse valores mais recentes em callbacks sem adicioná-los às dependências. Evita re-runs de effect enquanto evita stale closures.

#### Incorrect: effect reexecuta a cada mudança de callback

```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(timeout)
  }, [query, onSearch])
}
```

#### Correct: usando o useEffectEvent do React

```tsx
import { useEffectEvent } from 'react';

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const onSearchEvent = useEffectEvent(onSearch)

  useEffect(() => {
    const timeout = setTimeout(() => onSearchEvent(query), 300)
    return () => clearTimeout(timeout)
  }, [query])
}
```

---

## Referências

1. [https://react.dev](https://react.dev)
2. [https://nextjs.org](https://nextjs.org)
3. [https://swr.vercel.app](https://swr.vercel.app)
4. [https://github.com/shuding/better-all](https://github.com/shuding/better-all)
5. [https://github.com/isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache)
6. [https://vercel.com/blog/how-we-optimized-package-imports-in-next-js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
7. [https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)
