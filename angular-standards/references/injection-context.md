# Injection context

## Regra local

- `inject()` apenas em contextos válidos.
- Se precisar, use `runInInjectionContext` com `EnvironmentInjector`.

## Exemplo

```ts
runInInjectionContext(this.injector, () => {
  const router = inject(Router);
});
```
