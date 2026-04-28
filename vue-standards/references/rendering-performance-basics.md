# Rendering performance basics

## When to Use

- Review components with expensive renders, large lists, or frequent updates.

## Local Rules

- Keep props stable to reduce unnecessary updates in children.
- Use `v-once` only for subtrees that are truly immutable after the first render.
- Use `v-memo` only when there are large subtrees and an objective memoization criterion.
- Avoid creating new objects in `computed` unnecessarily when stability matters.
- Virtualize large lists instead of rendering thousands of nodes at once.
- Avoid component abstractions with no real benefit, especially in large lists.

## Quality Checklist

- Stable props when possible.
- No unnecessary mass re-renders.
- Virtualization considered for large lists.
- No excess wrappers/components without a clear purpose.
