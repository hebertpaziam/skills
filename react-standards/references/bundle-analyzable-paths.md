---
title: Prefira Caminhos Estáticos Analisáveis
impact: HIGH
impactDescription: evita bundles amplos e rastreamento excessivo
tags: bundle, nextjs, vite, webpack, rollup, esbuild, path
---

## Prefira Caminhos Estáticos Analisáveis

Ferramentas de build funcionam melhor quando caminhos de import e de sistema de arquivos são óbvios no build. Se você esconde o caminho real em uma variável ou o compõe de forma muito dinâmica, a ferramenta precisa incluir um conjunto amplo de arquivos possíveis, avisar que não consegue analisar o import, ou ampliar o file tracing para ficar segura.

Prefira mapas explícitos ou caminhos literais para manter o conjunto de arquivos alcançáveis estreito e previsível. Essa regra vale tanto para escolher módulos com `import()` quanto para ler arquivos em código de servidor/build.

Quando a análise fica ampla demais, o custo é real:

- Bundles de servidor maiores
- Builds mais lentos
- Cold starts piores
- Maior uso de memória

### Caminhos de import

**Incorreto (o bundler não consegue dizer o que pode ser importado):**

```ts
const PAGE_MODULES = {
  home: './pages/home',
  settings: './pages/settings',
} as const

const Page = await import(PAGE_MODULES[pageName])
```

**Correto (use um mapa explícito de módulos permitidos):**

```ts
const PAGE_MODULES = {
  home: () => import('./pages/home'),
  settings: () => import('./pages/settings'),
} as const

const Page = await PAGE_MODULES[pageName]()
```

### Caminhos de sistema de arquivos

**Incorreto (um enum com 2 valores ainda esconde o caminho final da análise estática):**

```ts
const baseDir = path.join(process.cwd(), 'content/' + contentKind)
```

**Correto (torne cada caminho final literal no callsite):**

```ts
const baseDir =
  kind === ContentKind.Blog
    ? path.join(process.cwd(), 'content/blog')
    : path.join(process.cwd(), 'content/docs')
```

Em código server do Next.js, isso também importa para output file tracing. `path.join(process.cwd(), someVar)` pode ampliar o conjunto rastreado porque o Next.js analisa estaticamente o uso de `import`, `require` e `fs`.

Referência: [Next.js output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), [Next.js dynamic imports](https://nextjs.org/learn/seo/dynamic-imports), [Vite features](https://vite.dev/guide/features.html), [esbuild API](https://esbuild.github.io/api/), [Rollup dynamic import vars](https://www.npmjs.com/package/@rollup/plugin-dynamic-import-vars), [Webpack dependency management](https://webpack.js.org/guides/dependency-management/)
