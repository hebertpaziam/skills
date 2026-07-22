# Types utility types

## When to Use

- Adapt existing shapes with `Partial`, `Pick`, `Omit`, `Record`, `Readonly` and similar utilities.

## Local Rules

- Prefer native utilities when they clearly express the desired transformation.
- Do not chain utilities in a way that makes the type unreadable without real benefit.
- If the transformation is recurrent and semantic, consider naming the resulting type.

## Quality Checklist

- Utility types improved clarity.
- No overly opaque final type.
