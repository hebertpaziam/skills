# Forms v-model

## When to Use

- Implement native inputs or custom form components.

## Local Rules

- Use `v-model` when it clearly expresses ownership and value synchronization.
- For custom inputs, keep a predictable contract with `defineModel` or explicit props + emits.
- Do not hide validation, formatting, and relevant side effects inside the binding without making the flow clear.
- Prefer normalization at the input boundary or in a dedicated composable.

## Quality Checklist

- Predictable data flow.
- `v-model` used for semantics, not out of blind convenience.
- No opaque synchronization.
