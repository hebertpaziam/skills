# Types unions vs class hierarchies

## When to Use

- Choose between discriminated unions, literal objects and class hierarchies.

## Local Rules

- In TypeScript, prefer discriminated unions and composition over class hierarchies.
- Use classes when state, identity, lifecycle, encapsulated invariants or real polymorphism justify it.
- Do not introduce inheritance just to represent data variants.

## Example

```ts
type TPaymentResult =
  | { status: 'approved'; receiptId: string }
  | { status: 'denied'; reason: string };
```

## Quality Checklist

- Class hierarchy only exists if substitutability and behavior justify it.
- State variations did not become inheritance by reflex.
