# Architecture side effects and ports

## Quando usar

- Encapsular acesso a rede, storage, filesystem, environment, clock ou outras dependencias externas.

## Regras locais

- Isole side effects em boundaries claras.
- Trate adaptadores externos como ports/adapters quando isso simplificar teste e evolucao.
- Nao misture regra de dominio com IO no mesmo ponto quando a separacao melhora clareza.
- Nao crie arquitetura hexagonal completa se o modulo ainda nao precisa disso.

## Exemplo

```ts
// clock.interface.ts
export interface IClock {
  now(): Date;
}
```

## Checklist de qualidade

- Side effects ficaram localizados.
- Ports existem apenas onde agregam valor.
- O design nao ficou maior do que o problema.
