---
title: Use after() para Operações Não Bloqueantes
impact: MEDIUM
impactDescription: tempos de resposta mais rápidos
tags: server, async, logging, analytics, side-effects
---

## Use after() para Operações Não Bloqueantes

Use o `after()` do Next.js para agendar trabalho que deve executar após a resposta ser enviada. Isso evita que logging, analytics e outros efeitos colaterais bloqueiem a resposta.

**Incorreto (bloqueia a resposta):**

```tsx
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Executa a mutação
  await updateDatabase(request)
  
  // Logging bloqueia a resposta
  const userAgent = request.headers.get('user-agent') || 'unknown'
  await logUserAction({ userAgent })
  
  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

**Correto (não bloqueante):**

```tsx
import { after } from 'next/server'
import { headers, cookies } from 'next/headers'
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Executa a mutação
  await updateDatabase(request)
  
  // Loga após a resposta ser enviada
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

A resposta é enviada imediatamente enquanto o logging roda em background.

**Casos de uso comuns:**

- Tracking de analytics
- Audit logging
- Envio de notificações
- Invalidação de cache
- Tarefas de cleanup

**Notas importantes:**

- `after()` roda mesmo se a resposta falhar ou redirecionar
- Funciona em Server Actions, Route Handlers e Server Components

Referência: [https://nextjs.org/docs/app/api-reference/functions/after](https://nextjs.org/docs/app/api-reference/functions/after)
