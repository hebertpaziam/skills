# Reactivity shallow APIs

## When to Use

- Working with large lists, deep payloads, or structures treated as immutable.

## Local Rules

- Use `shallowRef` or `shallowReactive` only when there is a technical signal of reactive overhead.
- When using shallow APIs, treat nested data as immutable.
- Updates should happen by replacing the root, not through invisible deep mutation.

## Quality Checklist

- There is a technical justification for shallow APIs.
- The team will be able to maintain the immutability contract.
- There are no silent deep mutations.
