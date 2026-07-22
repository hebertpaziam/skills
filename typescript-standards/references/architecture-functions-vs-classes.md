# Architecture functions vs classes

## When to Use

- Decide the structural form of a new or refactored module.

## Local Rules

- Prefer functions and modules as the default in TypeScript.
- Use classes when internal state, identity, lifecycle, encapsulated invariants or real polymorphism justify it.
- Do not create classes just to accommodate OO principles in a ritualistic way.
- Do not introduce generic services, managers or handlers without real design pressure.

## Example

```ts
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
```

## Quality Checklist

- The choice between function and class was made based on real need.
- No class-heavy design without concrete benefit.
