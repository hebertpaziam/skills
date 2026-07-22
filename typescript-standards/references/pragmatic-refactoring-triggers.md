# Pragmatic refactoring triggers

## When to Use

- Evaluate whether it is time to refactor types, modules, classes, or boundaries.

## Real Triggers

- Recurring changes at the same point with increasing friction.
- Frequent testing difficulty due to coupling or mixed side effects.
- Bloated and ambiguous contracts.
- Class or module with too many responsibilities.
- Growing conditionals for behavior variants.
- Real duplication across multiple points with the same semantics.

## Local Rule

- Refactor when the pain is present and recurring; not because a pattern theoretically fits.

## Quality Checklist

- The refactoring responded to a real pressure.
- The final design became simpler or clearer.
