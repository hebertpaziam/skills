---
title: Evite Estado de Módulo Compartilhado para Dados de Requisição
impact: HIGH
impactDescription: evita bugs de concorrencia e vazamentos
tags: server, rsc, ssr, concurrency, security, state
---

## Evite Estado de Módulo Compartilhado para Dados de Requisição

Para React Server Components e componentes client renderizados no SSR, evite usar variáveis mutáveis em nível de módulo para compartilhar dados escopados por requisição. Renderizações no server podem rodar concorrentes no mesmo processo. Se uma renderização escreve em estado de módulo compartilhado e outra lê, você pode ter race conditions, contaminação entre requisições e bugs de segurança onde dados de um usuário aparecem na resposta de outro.

Trate o escopo do módulo no server como memória compartilhada pelo processo, não como estado local por requisição.

**Incorreto (dados vazam entre renders concorrentes):**

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

Se duas requisições se sobrepoem, a requisição A define `currentUser`, e a requisição B sobrescreve antes de a A terminar de renderizar `Dashboard`.

**Correto (mantenha dados locais na árvore de render):**

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

- Assets estáticos imutaveis ou config carregada uma vez no escopo do módulo
- Caches compartilhados projetados para reuso entre requisições e bem chaveados
- Singletons do processo que não guardam dados mutaveis de requisição ou usuário

Para assets estáticos e config, veja [Hoist Static I/O to Module Level](./server-hoist-static-io.md).
