# Loading strategies

## Regra local

- Eager somente para páginas principais.
- Lazy para features e rotas secundárias.

## Exemplo

```ts
{ path: 'admin', loadComponent: () => import('./admin/admin.component') }
{ path: 'settings', loadChildren: () => import('./settings/settings.routes') }
```
