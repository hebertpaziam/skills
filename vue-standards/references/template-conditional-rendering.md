# Template conditional rendering

## When to Use

- Choosing between `v-if` and `v-show` and organizing branches in the template.

## Local Rules

- Use `v-if` when the block is truly optional or expensive and does not need to remain in the DOM.
- Use `v-show` when the block needs to toggle visibility frequently and it makes sense to stay mounted.
- Do not stack deep conditionals in the template when a `computed` or child component would improve readability.
- Prefer explicit and semantically clear branches.

## Quality Checklist

- `v-if` and `v-show` chosen by semantics and cost.
- No forest of conditionals in the template.
