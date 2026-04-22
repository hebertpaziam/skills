---
title: Retorno Antecipado em Funções
impact: LOW-MEDIUM
impactDescription: evita computação desnecessária
tags: javascript, functions, optimization, early-return
---

## Retorno Antecipado em Funções

Retorne cedo quando o resultado já estiver definido para evitar trabalho desnecessário.

**Incorreto (processa tudo mesmo após achar resposta):**

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
    // Continua checando mesmo após encontrar erro
  }
  
  return hasError ? { valid: false, error: errorMessage } : { valid: true }
}
```

**Correto (retorna no primeiro erro):**

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
