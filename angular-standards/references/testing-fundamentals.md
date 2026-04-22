# Testing fundamentals (Vitest)

## Regra local

- Testes unitários Angular usam Vitest e, por padrão, não validam HTML.
- Ao criar ou alterar `.spec.ts`, siga `vitest-unit-tests`.
- Use `faker.js` e geradores do projeto.
- Sem stubs; preferir spies.

## Fronteira de escopo

- `vitest-unit-tests` define as regras operacionais para unit tests de lógica.
- `component-harnesses` e `router-testing` cobrem exceções de UI e navegação quando o escopo exigir.

## Estrutura

- Um `describe` por recurso sempre que possível.
- Cenários de sucesso antes dos de falha.

## Exemplo

```ts
import { faker } from '@faker-js/faker';

const inputValue = faker.string.alpha();
const expected = faker.number.int();

const result = service.calculate(inputValue);

expect(result).toEqual(expected);
```
