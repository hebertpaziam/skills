# State Pinia store design

## When to Use

- Design or refactor Pinia stores.

## Local Rules

- Separate state, derivations, and actions with domain-oriented names.
- Getters should represent observable and stable derivations.
- Actions should concentrate domain mutations and async coordination.
- Do not turn the store into a UI layer or a generic HTTP wrapper without domain semantics.
- Compose stores carefully to avoid unnecessary circular coupling.

## Quality Checklist

- Store small enough to have a clear boundary.
- Getters and actions with domain semantics.
- No improper mixing of view state and business state.
