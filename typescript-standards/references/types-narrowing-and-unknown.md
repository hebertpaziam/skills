# Types narrowing and unknown

## Quando usar

- Receber dados incertos, parsear entradas externas ou lidar com APIs dinamicas.

## Regras locais

- Use `unknown` como tipo de entrada incerta.
- Faca narrowing explicito com guards, predicates ou validacao.
- Nao use `as` para pular verificacao quando a incerteza continua existindo.

## Exemplo

```ts
function isUser(value: unknown): value is IUser {
  return typeof value === 'object' && value !== null && 'id' in value;
}
```

## Checklist de qualidade

- Nenhum `any` introduzido.
- Narrowing explicito antes do uso.
- Casts inseguros evitados.
