# TypeScript template refs and injection

## Quando usar

- Tipar refs de DOM, refs de componente e chaves de injection.

## Regras locais

- Prefira inferencia automatica quando a stack suportar isso com clareza.
- Quando necessario, tipar explicitamente refs de DOM, refs de componente e `InjectionKey`.
- Considere nulidade e timing de mount ao acessar template refs.
- Evite `as` desnecessario quando uma modelagem mais precisa resolve melhor.

## Checklist de qualidade

- Refs tipadas quando a inferencia nao basta.
- `InjectionKey` usado em provide/inject reutilizavel.
- Nulidade tratada corretamente.
