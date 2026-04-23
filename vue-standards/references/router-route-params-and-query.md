# Router route params and query

## Quando usar

- Ler ou escrever params e query string.

## Regras locais

- Trate params e query como contrato externo da tela.
- Normalize tipos e defaults antes de espalhar uso pelo componente.
- Prefira `computed` com getter/setter ou composable dedicado quando houver sincronizacao bidirecional com a URL.
- Nao acople o restante da tela a parsing manual repetido.

## Checklist de qualidade

- Parsing centralizado.
- Defaults claros.
- Estado de rota tratado como fonte de verdade quando apropriado.
