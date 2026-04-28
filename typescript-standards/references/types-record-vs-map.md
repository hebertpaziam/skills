# Types Record vs Map

## When to Use

- Choose the data structure for lookup, indexing and key-based aggregation.

## Local Rules

- Prefer `Record` when string or number keys are sufficient.
- Use `Map` when the specific `Map` API, controlled iteration order or non-serializable keys are actually needed.
- Do not use `Map` just out of personal preference when a plain object suffices.

## Quality Checklist

- `Record` was used as the default when sufficient.
- `Map` was chosen for a real technical reason.
