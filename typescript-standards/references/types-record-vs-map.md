# Types Record vs Map

## Quando usar

- Escolher a estrutura de dados para lookup, indexacao e agregacao por chave.

## Regras locais

- Prefira `Record` quando chaves string ou number forem suficientes.
- Use `Map` quando a API especifica de `Map`, a ordem de iteracao controlada ou chaves nao serializaveis forem realmente necessarias.
- Nao use `Map` apenas por preferencia pessoal quando um objeto simples resolve.

## Checklist de qualidade

- `Record` foi usado como default quando suficiente.
- `Map` foi escolhido por motivo tecnico real.
