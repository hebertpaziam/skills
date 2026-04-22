# Navigate to routes

## Regras

- Preferir `RouterLink` para navegação declarativa.
- Para navegação programática, usar `router.navigate`.

## Exemplo

```ts
this.router.navigate(['/profile'], { queryParams: { q: 'x' } });
```
