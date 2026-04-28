# Reactivity computed vs watch

## When to Use

- Deciding between deriving state or reacting to changes with a side effect.

## Main Rule

- If a value can be calculated from the current state, use `computed`.
- If the change needs to trigger an external side effect, synchronization, persistence, fetch, or integration, use `watch`.

## Typical `computed` Examples

- derived filters
- derived labels
- disabled state
- list aggregations

## Typical `watch` Examples

- update URL
- persist to storage
- call API in response to input change
- integrate imperative external libraries

## Anti-pattern

- using `watch` to populate a second state that could be a `computed`

## Quality Checklist

- No `watch` was used for pure derivation.
- No `computed` is executing side effects.
