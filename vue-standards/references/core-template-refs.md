# Core template refs

## When to Use

- Interacting with the real DOM, focus, measurement, or a public API exposed by another component.

## Local Rules

- Template refs are an escape hatch, not a primary mechanism for inter-component communication.
- Prefer props, emits, and composables before resorting to component refs.
- Type refs explicitly when automatic inference is not sufficient.
- Every DOM operation should account for lifecycle and element nullability.

## Quality Checklist

- Ref used out of genuine necessity.
- No accidental dependency on a child component's private implementation.
- Access guarded against `null`.
