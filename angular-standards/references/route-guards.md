# Route guards

## Regras

- Preferir guards funcionais.
- Não usar guard como segurança de backend.

## Exemplo

```ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn();
};
```
