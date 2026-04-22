---
title: Limites Estrategicos de Suspense
impact: HIGH
impactDescription: primeira pintura mais rápida
tags: async, suspense, streaming, layout-shift
---

## Limites Estrategicos de Suspense

Em vez de aguardar dados em componentes async antes de retornar JSX, use limites de Suspense para renderizar a UI externa mais rápido enquanto os dados carregam.

**Incorreto (wrapper bloqueado pelo fetch de dados):**

```tsx
async function Page() {
  const data = await fetchData() // Bloqueia a pagina inteira
  
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

**Correto (wrapper aparece imediatamente, dados entram em streaming):**

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
  const data = await fetchData() // Só bloqueia este componente
  return <div>{data.content}</div>
}
```

Sidebar, Header e Footer renderizam imediatamente. Apenas DataDisplay espera pelos dados.

**Alternativa (compartilhar promise entre componentes):**

```tsx
function Page() {
  // Inicia o fetch imediatamente, mas não aguarda
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
  const data = use(dataPromise) // Desembrulha a promise
  return <div>{data.content}</div>
}

function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Reutiliza a mesma promise
  return <div>{data.summary}</div>
}
```

Ambos os componentes compartilham a mesma promise, então só ocorre um fetch. O layout renderiza imediatamente enquanto ambos os componentes aguardam juntos.

**Quando NÃO usar este padrão:**

- Dados críticos para decisões de layout (afeta posicionamento)
- Conteúdo crítico para SEO acima da dobra
- Consultas pequenas e rápidas onde o overhead do suspense não compensa
- Quando você quer evitar layout shift (carregando → salto de conteúdo)

**Trade-off:** Primeira pintura mais rápida vs possível layout shift. Escolha conforme suas prioridades de UX.
