# Router outlets

## Regras

- Parent com children deve ter `<router-outlet />`.
- Use `routerOutletData` para dados contextuais.

## Exemplo

```html
<router-outlet [routerOutletData]="{ theme: 'dark' }" />
```
