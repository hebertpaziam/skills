---
title: Autentique Server Actions como API Routes
impact: CRITICAL
impactDescription: evita acesso não autorizado a mutações
tags: server, server-actions, authentication, security, authorization
---

## Autentique Server Actions como API Routes

### Impacto: CRÍTICO (evita acesso não autorizado a mutações)

Server Actions (funções com "use server") são expostas como endpoints públicos, assim como API routes. Sempre valide autenticação e autorização **dentro** de cada Server Action — não dependa apenas de middleware, guards de layout ou checks de página, porque Server Actions podem ser chamadas diretamente.

A documentação do Next.js afirma explicitamente: "Treat Server Actions with the same security considerations as public-facing API endpoints, and verify if the user is allowed to perform a mutation."

**Incorreto (sem checagem de autenticação):**

```typescript
'use server'

export async function deleteUser(userId: string) {
  // Qualquer um pode chamar! Sem auth
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**Correto (autenticação dentro da action):**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { unauthorized } from '@/lib/errors'

export async function deleteUser(userId: string) {
  // Sempre checar auth dentro da action
  const session = await verifySession()

  if (!session) {
    throw unauthorized('Must be logged in')
  }

  // Checar autorização também
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('Cannot delete other users')
  }

  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**Com validação de input:**

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
  // Valida o input primeiro
  const validated = updateProfileSchema.parse(data)

  // Depois autentica
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  // Depois autoriza
  if (session.user.id !== validated.userId) {
    throw new Error('Can only update own profile')
  }

  // Por fim executa a mutação
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
