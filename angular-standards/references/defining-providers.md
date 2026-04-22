# Defining providers

## Regra local

- Preferir `providedIn: 'root'`.
- Use `InjectionToken` para configurações e valores primitivos.

## Exemplo

```ts
export const API_URL = new InjectionToken<string>('api.url', {
  providedIn: 'root',
  factory: () => '/api',
});
```

## Quando usar `providers`

- Instância isolada no componente.
- Configuração por rota.
