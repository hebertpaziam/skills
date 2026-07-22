# Patterns creational

## When to Use

- Solve non-trivial object construction, configurations, or instance variants.

## Coverage

- Factory Method
- Abstract Factory
- Builder
- Prototype
- Singleton

## Local Rules

- Prefer a simple factory before `Abstract Factory`.
- Use `Builder` when construction is truly incremental, valid, and readable in that form.
- Be skeptical of `Singleton`; it generally increases global coupling and makes testing harder.
- `Prototype` is rare in TypeScript and usually loses to clear factories.

## Quality Checklist

- The problem was truly about construction.
- There was no jump to a pattern larger than necessary.
- `Singleton` was not used for global convenience.
