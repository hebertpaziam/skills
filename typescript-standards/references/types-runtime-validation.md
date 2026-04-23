# Types runtime validation

## Quando usar

- Consumir dados de API, storage, ambiente, query string, fila ou qualquer boundary externo.

## Regras locais

- Tipos TypeScript nao substituem validacao em runtime.
- Valide em boundaries de entrada e converta para formas internas seguras.
- Prefira centralizar validacao de boundary em adapters ou parsers dedicados.
- Nao espalhe parsing parcial e checagens inconsistentes pelo sistema.

## Exemplo

```ts
function parseUser(input: unknown): IUser {
  if (typeof input !== 'object' || input === null || !('id' in input)) {
    throw new Error('Invalid user payload');
  }

  return { id: String((input as { id: unknown }).id) } as IUser;
}
```

## Checklist de qualidade

- Boundaries externas foram validadas.
- O sistema nao assume que dado externo ja esta correto porque o tipo existe.
