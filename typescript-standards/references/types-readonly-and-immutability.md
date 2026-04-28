# Types readonly and immutability

## When to Use

- Model data that should not be mutated after creation or expose safer contracts.

## Local Rules

- Use `readonly` to make immutability intent explicit in shared contracts.
- Prefer exposing reads and encapsulating mutation where domain rules require it.
- Do not impose ritualistic immutability if controlled local mutation is the simplest and clearest approach.

## Quality Checklist

- Immutability was applied where it protects invariants or public consumption.
- No unnecessary rigidity without real benefit.
