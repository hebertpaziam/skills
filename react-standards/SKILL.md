---
name: react-standards
description: Boas práticas de performance para React e Next.js, baseadas no guia da Vercel e adaptadas ao projeto. Use em criação, revisão e refatoração de código React/Next.js.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# React Standards

Guia de boas práticas de performance para React e Next.js, adaptado para o projeto. Contém 70 regras em 8 categorias, priorizadas por impacto para guiar refatorações e geração de código.

## Quando usar

Use estas diretrizes quando:

- Criar componentes React ou páginas Next.js
- Implementar data fetching (client ou server-side)
- Revisar código para performance
- Refatorar código React/Next.js
- Otimizar bundle ou tempos de carregamento

## Princípio LIFT

Antes de criar novo componente, hook, utilitário, cache, fluxo async ou abstração estrutural, aplique `LIFT`:

- `Locate` - localize componentes, hooks, helpers, padrões e referências já existentes no projeto.
- `Identify` - identifique o que já resolve parte do problema e onde existe duplicação real.
- `Find` - encontre o menor ponto coerente de reutilização, extensão ou composição antes de introduzir código novo.
- `Try to be DRY` - tente ser DRY sem criar abstrações prematuras, wrappers desnecessários ou camadas genéricas que prejudiquem legibilidade e performance.

Use `LIFT` para preferir reaproveitamento claro e consistente, sem sacrificar simplicidade local.

## Integracao com outras skills

- Ao alterar tipagem geral, contratos compartilhados ou modelagem TypeScript, seguir `typescript-standards`.
- Ao sugerir ou executar scripts do projeto, respeitar a stack e os scripts ja configurados no projeto.
- Ao preparar commits, seguir `git-commit`.
- Em caso de conflito, `react-standards` prevalece para performance, rendering e arquitetura React/Next.js; `typescript-standards` para regras gerais de TypeScript; `git-commit` para commits.

## Categorias por prioridade

| Prioridade | Categoria | Impacto | Prefixo |
|---|---|---|---|
| 1 | Eliminating Waterfalls | CRITICAL | `async-` |
| 2 | Bundle Size Optimization | CRITICAL | `bundle-` |
| 3 | Server-Side Performance | HIGH | `server-` |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | `client-` |
| 5 | Re-render Optimization | MEDIUM | `rerender-` |
| 6 | Rendering Performance | MEDIUM | `rendering-` |
| 7 | JavaScript Performance | LOW-MEDIUM | `js-` |
| 8 | Advanced Patterns | LOW | `advanced-` |

## Referência rápida

### 1. Eliminating Waterfalls (CRITICAL)

- `async-cheap-condition-before-await` - Verifique condições síncronas baratas antes de aguardar flags ou valores remotos
- `async-defer-await` - Mova await para os ramos onde é usado
- `async-parallel` - Use Promise.all() para operações independentes
- `async-dependencies` - Use better-all para dependências parciais
- `async-api-routes` - Inicie promises cedo, aguarde tarde em API routes
- `async-suspense-boundaries` - Use Suspense para streaming de conteúdo

### 2. Bundle Size Optimization (CRITICAL)

- `bundle-barrel-imports` - Importação direta, evitar barrel files
- `bundle-analyzable-paths` - Preferir caminhos analisáveis estaticamente para evitar bundles amplos
- `bundle-dynamic-imports` - Usar next/dynamic para componentes pesados
- `bundle-defer-third-party` - Carregar analytics/logging após hydration
- `bundle-conditional` - Carregar módulos apenas quando a feature estiver ativa
- `bundle-preload` - Preload em hover/focus para ganho de velocidade percebida

### 3. Server-Side Performance (HIGH)

- `server-auth-actions` - Autenticar server actions como API routes
- `server-cache-react` - Usar React.cache() para deduplicação por request
- `server-cache-lru` - Usar cache LRU entre requests
- `server-dedup-props` - Evitar serialização duplicada em props de RSC
- `server-hoist-static-io` - Elevar I/O estático (fonts, logos) para nível de módulo
- `server-no-shared-module-state` - Evitar estado mutável de request em nível de módulo (RSC/SSR)
- `server-serialization` - Minimizar dados enviados para client components
- `server-parallel-fetching` - Reestruturar componentes para paralelizar fetches
- `server-parallel-nested-fetching` - Encadear fetches por item com Promise.all
- `server-after-nonblocking` - Usar after() para operações não bloqueantes

### 4. Client-Side Data Fetching (MEDIUM-HIGH)

- `client-swr-dedup` - Usar SWR para deduplicação automática
- `client-event-listeners` - Deduplicar listeners globais
- `client-passive-event-listeners` - Usar listeners passive para scroll
- `client-localstorage-schema` - Versionar e minimizar dados no localStorage

### 5. Re-render Optimization (MEDIUM)

- `rerender-defer-reads` - Não assinar estado usado apenas em callbacks
- `rerender-memo` - Extrair trabalho caro para componentes memo-izados
- `rerender-memo-with-default-value` - Elevar props não primitivas padrão
- `rerender-dependencies` - Usar dependências primitivas em effects
- `rerender-derived-state` - Assinar estado derivado, não valores brutos
- `rerender-derived-state-no-effect` - Derivar estado no render, não em effects
- `rerender-functional-setstate` - Usar setState funcional para callbacks estáveis
- `rerender-lazy-state-init` - Passar função para useState em valores caros
- `rerender-simple-expression-in-memo` - Evitar memo para primitivas simples
- `rerender-split-combined-hooks` - Dividir hooks com dependências independentes
- `rerender-move-effect-to-event` - Mover lógica de interação para handlers
- `rerender-transitions` - Usar startTransition para updates não urgentes
- `rerender-use-deferred-value` - Adiar renders caros para manter input responsivo
- `rerender-use-ref-transient-values` - Usar refs para valores transientes frequentes
- `rerender-no-inline-components` - Não definir componentes dentro de componentes

### 6. Rendering Performance (MEDIUM)

- `rendering-animate-svg-wrapper` - Animar wrapper div, não o SVG
- `rendering-content-visibility` - Usar content-visibility para listas longas
- `rendering-hoist-jsx` - Extrair JSX estático fora de componentes
- `rendering-svg-precision` - Reduzir precisão de coordenadas SVG
- `rendering-hydration-no-flicker` - Usar script inline para dados client-only
- `rendering-hydration-suppress-warning` - Suprimir mismatches esperados
- `rendering-activity` - Usar Activity component para show/hide
- `rendering-conditional-render` - Usar ternário, não &&, em condicionais
- `rendering-usetransition-loading` - Preferir useTransition para loading state
- `rendering-resource-hints` - Usar resource hints do React DOM para preload
- `rendering-script-defer-async` - Usar defer ou async em script tags

### 7. JavaScript Performance (LOW-MEDIUM)

- `js-batch-dom-css` - Agrupar mudanças de CSS via classes ou cssText
- `js-index-maps` - Criar Map para buscas repetidas
- `js-cache-property-access` - Cachear propriedades em loops
- `js-cache-function-results` - Cachear resultados em Map de módulo
- `js-cache-storage` - Cachear leituras de localStorage/sessionStorage
- `js-combine-iterations` - Combinar filter/map em um loop
- `js-length-check-first` - Checar tamanho antes de comparações caras
- `js-early-exit` - Retornar cedo em funções
- `js-hoist-regexp` - Elevar RegExp para fora de loops
- `js-min-max-loop` - Usar loop para min/max em vez de sort
- `js-set-map-lookups` - Usar Set/Map para buscas O(1)
- `js-tosorted-immutable` - Usar toSorted() para imutabilidade
- `js-flatmap-filter` - Usar flatMap para map+filter em uma passada
- `js-request-idle-callback` - Adiar trabalho não crítico para idle

### 8. Advanced Patterns (LOW)

- `advanced-effect-event-deps` - Não colocar resultados de `useEffectEvent` nas deps
- `advanced-event-handler-refs` - Armazenar handlers em refs
- `advanced-init-once` - Inicializar app uma vez por carga
- `advanced-use-latest` - useLatest para refs de callback estáveis

## Como usar

Antes de aplicar uma regra ou criar uma nova abstração, aplique `LIFT`.

Leia os arquivos de regras para explicações detalhadas e exemplos de código:

```text
references/async-parallel.md
references/bundle-barrel-imports.md
```

Cada arquivo de regra contém:

- Explicação breve do impacto
- Exemplo incorreto com explicação
- Exemplo correto com explicação
- Contexto adicional e referências

## Documento completo

Para o guia completo com todas as regras: `RULES.md`
