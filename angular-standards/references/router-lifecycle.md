# Router lifecycle

## Regras

- Use eventos para loading/analytics quando necessário.
- Evite lógica de negócio aqui.

## Exemplo

```ts
this.router.events
  .pipe(filter((e) => e instanceof NavigationEnd))
  .subscribe(() => trackPageView());
```
