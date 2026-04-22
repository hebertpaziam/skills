# Define routes

## Regras

- Use `provideRouter` no app config.
- Rotas específicas antes das genéricas.
- `**` sempre no final.

## Exemplo

```ts
export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'admin', component: AdminPage },
  { path: '**', component: NotFoundPage },
];
```
