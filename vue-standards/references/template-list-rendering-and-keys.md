# Template list rendering and keys

## When to Use

- Rendering lists, filtered collections, and dynamic items.

## Local Rules

- Every dynamic list must have a stable `key` based on real domain identity.
- Do not use index as `key` when the list can reorder, filter, insert, or remove items.
- Prefer preparing filters, sorts, and groupings in the script instead of overloading `v-for`.
- Do not combine `v-if` and `v-for` on the same element when it can be avoided.

## Quality Checklist

- `key` is stable and semantic.
- List is prepared outside the template when necessary.
- No weak identity based on index for convenience.
