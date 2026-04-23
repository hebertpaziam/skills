# Component harnesses (quando solicitado)

## Regra local

- Evitar testes de HTML por padrão.
- Usar harnesses somente se o escopo exigir validação de interação de UI.
- Para testes unitários de lógica em `.spec.ts`, seguir [testing-fundamentals.md](testing-fundamentals.md).

## Nota

- Se usar harness, mantenha assertions focadas em comportamento, não em estilo.
- Harness complementa testes específicos de UI e não substitui a política principal de unit tests.
