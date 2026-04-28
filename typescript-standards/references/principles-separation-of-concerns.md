# Principles separation of concerns

## When to Use

- Organizing modules, types, adapters, validation, side effects, and domain rules.

## Local Rules

- Separate domain modeling, IO, external adaptation, validation, and presentation.
- Do not mix boundary parsing, business logic, and transport details in the same module without necessity.
- Each module should have a comprehensible boundary and clear responsibility.

## Quality Checklist

- Distinct concerns are separated.
- The module did not become a coupling point between too many layers.
