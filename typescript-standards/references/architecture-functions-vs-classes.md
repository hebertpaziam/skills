# Architecture functions vs classes

## Quando usar

- Decidir a forma estrutural de um modulo novo ou refatorado.

## Regras locais

- Prefira funcoes e modulos como default em TypeScript.
- Use classes quando estado interno, identidade, ciclo de vida, invariantes encapsulados ou polimorfismo real justificarem isso.
- Nao crie classes apenas para acomodar principios OO de forma ritualistica.
- Nao introduza services, managers ou handlers genericos sem pressao real de design.

## Exemplo

```ts
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
```

## Checklist de qualidade

- A escolha entre funcao e classe foi feita por necessidade real.
- Nao ha class-heavy design sem ganho concreto.
