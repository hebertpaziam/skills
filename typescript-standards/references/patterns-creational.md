# Patterns creational

## Quando usar

- Resolver construcao nao trivial de objetos, configuracoes ou variantes de instancia.

## Cobertura

- Factory Method
- Abstract Factory
- Builder
- Prototype
- Singleton

## Regras locais

- Prefira factory simples antes de `Abstract Factory`.
- Use `Builder` quando a construcao for realmente incremental, valida e legivel com essa forma.
- Seja cetico com `Singleton`; em geral ele aumenta acoplamento global e dificulta teste.
- `Prototype` e raro em TypeScript e costuma perder para factories claras.

## Checklist de qualidade

- O problema era realmente de construcao.
- Nao houve salto para pattern maior do que o necessario.
- `Singleton` nao foi usado por conveniencia global.
