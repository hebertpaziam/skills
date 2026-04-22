# Data resolvers

## Regras

- Resolver deve ser leve e focado no dado crítico.
- Preferir `withComponentInputBinding` para inputs de componente.

## Exemplo

```ts
export const userResolver: ResolveFn<User> = (route) => {
  const service = inject(UserService);
  return service.getUser(route.paramMap.get('id')!);
};
```
