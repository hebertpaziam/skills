---
title: Adie await até ser necessário
impact: HIGH
impactDescription: evita bloquear caminhos de código não utilizados
tags: async, await, conditional, optimization
---

## Adie await até ser necessário

Mova operações `await` para os ramos em que elas são usadas para evitar bloquear caminhos que não precisam delas.

**Incorreto (bloqueia ambos os ramos):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)
  
  if (skipProcessing) {
    // Retorna imediatamente, mas ainda aguardou userData
    return { skipped: true }
  }
  
  // Apenas este ramo usa userData
  return processUserData(userData)
}
```

**Correto (bloqueia apenas quando necessário):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // Retorna imediatamente sem aguardar
    return { skipped: true }
  }
  
  // Buscar somente quando necessário
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

**Outro exemplo (otimização de retorno antecipado):**

```typescript
// Incorreto: sempre busca permissões
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

// Correto: busca somente quando necessário
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

Esta otimização é especialmente valiosa quando o ramo ignorado é frequente, ou quando a operação adiada é cara.

Para `await getFlag()` combinado com um guard síncrono barato (`flag && someCondition`), veja [Check Cheap Conditions Before Async Flags](./async-cheap-condition-before-await.md).
