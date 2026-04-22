---
title: Evite Hydration Mismatch sem Flicker
impact: MEDIUM
impactDescription: evita flicker e erros de hidratação
tags: rendering, ssr, hydration, localStorage, flicker
---

## Evite Hydration Mismatch sem Flicker

Ao renderizar conteúdo que depende de storage no client (localStorage, cookies), evite quebra de SSR e flicker pós-hidratação injetando um script síncrono que atualiza o DOM antes do React hidratar.

**Incorreto (quebra SSR):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  // localStorage não existe no server - erro
  const theme = localStorage.getItem('theme') || 'light'
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

SSR falha porque `localStorage` é undefined.

**Incorreto (flicker visual):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')
  
  useEffect(() => {
    // Roda após a hidratação - causa flash visível
    const stored = localStorage.getItem('theme')
    if (stored) {
      setTheme(stored)
    }
  }, [])
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

O componente renderiza com valor default (`light`) e depois atualiza após a hidratação, causando flash visível de conteúdo incorreto.

**Correto (sem flicker e sem mismatch):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="theme-wrapper">
        {children}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('theme-wrapper');
                if (el) el.className = theme;
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  )
}
```

O script inline executa de forma síncrona antes de mostrar o elemento, garantindo que o DOM já tenha o valor correto. Sem flicker, sem mismatch.

Este padrão é útil para themes, preferências do usuário, estados de autenticação e qualquer dado exclusivo do client que precise render imediato sem flash de valores default.
