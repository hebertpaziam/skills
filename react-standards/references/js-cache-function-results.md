---
title: Cache de Chamadas Repetidas
impact: MEDIUM
impactDescription: evita computação redundante
tags: javascript, cache, memoization, performance
---

## Cache de Chamadas Repetidas

Use um Map em nível de módulo para cachear resultados quando a função e chamada repetidamente com os mesmos inputs durante render.

**Incorreto (computação redundante):**

```typescript
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // slugify() chamado 100+ vezes para o mesmo nome
        const slug = slugify(project.name)
        
        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**Correto (resultados cacheados):**

```typescript
// Cache em nível de módulo
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
        // Computado uma vez por nome único
        const slug = cachedSlugify(project.name)
        
        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**Padrão simples para funções de valor único:**

```typescript
let isLoggedInCache: boolean | null = null

function isLoggedIn(): boolean {
  if (isLoggedInCache !== null) {
    return isLoggedInCache
  }
  
  isLoggedInCache = document.cookie.includes('auth=')
  return isLoggedInCache
}

// Limpa o cache quando auth muda
function onAuthChange() {
  isLoggedInCache = null
}
```

Use um Map (não hook) para funcionar em todo lugar: utils, handlers, não só componentes React.

Referência: [How we made the Vercel Dashboard twice as fast](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)
