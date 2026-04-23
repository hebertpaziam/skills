# Core provide inject

## Quando usar

- Compartilhar dependencias por profundidade de arvore.
- Implementar contexto de grupo, form containers, temas ou recursos plugin-like.

## Regras locais

- Prefira props e emits para fluxos locais simples.
- Use `provide` e `inject` quando o custo de prop drilling for real e a dependencia for estrutural.
- Tipar chaves de injection com `InjectionKey`.
- Centralizar chaves em arquivo dedicado quando reutilizadas por mais de um componente.
- Evitar usar `inject` para esconder dependencias de negocio difusas.

## Checklist de qualidade

- `provide/inject` usado apenas para contexto estrutural legitimo.
- Chaves tipadas.
- Dependencias continuam rastreaveis.
