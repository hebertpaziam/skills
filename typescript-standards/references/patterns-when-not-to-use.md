# Patterns when not to use

## When to Use

- Review whether a GoF pattern is being introduced too early.

## Warning Signs

- There is only one implementation and no real pressure for variation.
- The pattern was introduced for a hypothetical future.
- A simple function, module, or object literal would suffice.
- The code became harder to navigate or explain.
- The new layer only forwards calls without adding real semantics.

## Pragmatic Rule

- If the pattern violates `KISS` and `YAGNI`, remove the pattern and prefer the simplest form.

## Quality Checklist

- The pattern survived an honest simplicity test.
- The abstraction brought present value, not just future potential.
