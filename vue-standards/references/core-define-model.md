# Core defineModel

## When to Use

- Implementing custom components integrated with `v-model`.
- Reviewing two-way binding flow in components.

## Local Rules

- `defineModel` is appropriate for input components and form wrappers whose primary contract is to synchronize a value.
- Avoid `defineModel` when it hides state ownership that should remain explicit.
- For named models, use names that clearly represent the synchronized value.
- Avoid defaults that could misalign parent and child when the parent does not provide an initial value.

## When to Prefer props + emits

- When the data flow needs to remain explicit.
- When there are multiple independent changes without `v-model` semantics.
- When the component exposes business events, not just value synchronization.

## Quality Checklist

- `defineModel` used only when it simplifies a legitimate input API.
- No opaque synchronization between parent and child.
- No misleading default that introduces desynchronization.
