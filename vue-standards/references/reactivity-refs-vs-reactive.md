# Reactivity refs vs reactive

## When to Use

- Choosing the main reactive API for a component, composable, or store.

## Local Rules

- Prefer `ref` by default for isolated state, primitives, and values whose identity needs to be explicit.
- Use `reactive` when a cohesive object truly benefits from grouped access and will not be freely destructured.
- Avoid returning `reactive` objects directly from composables; prefer a plain object with refs.
- If the structure is large and treated as immutable, consider `shallowRef` or `shallowReactive`.

## Quick Heuristic

- `ref`: safe and explicit default.
- `reactive`: local grouping of tightly related state.
- `shallowRef` / `shallowReactive`: large structures with root-level replacement.

## Quality Checklist

- Reactive API chosen by semantics, not by habit.
- No reactivity loss from careless destructuring.
- No unnecessary overhead on large structures.
