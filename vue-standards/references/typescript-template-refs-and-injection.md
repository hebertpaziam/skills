# TypeScript template refs and injection

## When to Use

- Type DOM refs, component refs, and injection keys.

## Local Rules

- Prefer automatic inference when the stack supports it clearly.
- When necessary, explicitly type DOM refs, component refs, and `InjectionKey`.
- Consider nullability and mount timing when accessing template refs.
- Avoid unnecessary `as` when a more precise modeling solves it better.

## Quality Checklist

- Refs typed when inference is not enough.
- `InjectionKey` used in reusable provide/inject.
- Nullability handled correctly.
