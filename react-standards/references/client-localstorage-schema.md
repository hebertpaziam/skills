---
title: Version and Minimize localStorage Data
impact: MEDIUM
impactDescription: evita conflitos de schema, reduz tamanho de storage
tags: client, localStorage, storage, versioning, data-minimization
---

## Version and Minimize localStorage Data

Adicione prefixo de versão nas chaves e armazene apenas os campos necessarios. Isso evita conflitos de schema e armazenamento acidental de dados sensiveis.

### Incorrect

```typescript
// No version, stores everything, no error handling
localStorage.setItem('userConfig', JSON.stringify(fullUserObject))
const data = localStorage.getItem('userConfig')
```

### Correct

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

**Armazene apenas campos minimos de respostas do server:**

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

**Sempre use try-catch:** `getItem()` e `setItem()` lancam erro em incognito/private browsing (Safari, Firefox), quando a cota e excedida, ou quando desabilitado.

**Beneficios:** Evolucao de schema via versionamento, reducao do tamanho do storage, evita armazenar tokens/PII/flags internas.
