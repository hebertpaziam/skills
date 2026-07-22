# Architecture side effects and ports

## When to Use

- Encapsulate access to network, storage, filesystem, environment, clock, or other external dependencies.

## Local Rules

- Isolate side effects at clear boundaries.
- Treat external adapters as ports/adapters when it simplifies testing and evolution.
- Do not mix domain logic with IO at the same point when separation improves clarity.
- Do not create a full hexagonal architecture if the module does not need it yet.

## Example

```ts
// clock.interface.ts
export interface IClock {
  now(): Date;
}
```

## Quality Checklist

- Side effects remained localized.
- Ports exist only where they add value.
- The design did not grow larger than the problem.
