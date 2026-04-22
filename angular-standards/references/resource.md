# resource

## Regra local

- `resource` é experimental; usar apenas quando houver benefício claro.
- Para chamadas de API complexas, preferir RxJS em services.

## Exemplo básico

```ts
userResource = resource({
  params: () => ({ id: this.userId() }),
  loader: async ({ params, abortSignal }) => {
    const response = await fetch(`/api/users/${params.id}`, { signal: abortSignal });
    if (!response.ok) throw new Error('Network error');
    return response.json();
  },
});
```

## Notas

- Sempre passar `abortSignal` para cancelamento.
- Use `httpResource` quando estiver com `HttpClient`.
