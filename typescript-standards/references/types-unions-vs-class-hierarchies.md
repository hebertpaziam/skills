# Types unions vs class hierarchies

## Quando usar

- Escolher entre unions discriminadas, objetos literais e hierarquias de classes.

## Regras locais

- Em TypeScript, prefira unions discriminadas e composicao antes de hierarquias de classes.
- Use classes quando estado, identidade, ciclo de vida, invariantes encapsulados ou polimorfismo real justificarem isso.
- Nao introduza heranca apenas para representar variantes de dados.

## Exemplo

```ts
type TPaymentResult =
  | { status: 'approved'; receiptId: string }
  | { status: 'denied'; reason: string };
```

## Checklist de qualidade

- Hierarquia de classes so existe se substituibilidade e comportamento justificam.
- Variacoes de estado nao viraram heranca por reflexo.
