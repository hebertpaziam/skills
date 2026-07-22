# Principles KISS YAGNI

## When to Use

- Making decisions about modeling, refactoring, and introducing abstractions.

## Local Rules

- `KISS`: choose the simplest solution that remains correct and readable.
- `YAGNI`: do not introduce extensibility, generics, strategies, factories, or extra layers without a current need.
- If an abstraction only exists for a hypothetical future, it probably should not exist yet.

## Quality Checklist

- The solution became simpler to understand.
- No layer was created in anticipation.
- The code is not prepared for scenarios the project does not yet have.
