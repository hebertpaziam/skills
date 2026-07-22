# Types generics

## When to Use

- Creating reusable APIs, typed helpers, or parametric contracts.

## Local Rules

- Use generics when the type truly varies and that variation needs to be propagated.
- Prefer small, constrained generics with clearly named parameters.
- Do not introduce generics just to appear more flexible.
- When an explicit union is sufficient, prefer the simpler form.

## Quality Checklist

- The generic solves a real problem.
- The signature remains readable.
- There is no speculative generic complexity.
