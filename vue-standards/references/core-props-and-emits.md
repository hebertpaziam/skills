# Core props and emits

## When to Use

- Creating or reviewing a component's public API.
- Typing `defineProps` and `defineEmits`.

## Local Rules

- Props are the input contract; name them after the domain, not implementation details.
- Prefer TypeScript-based typing for `defineProps` and `defineEmits` in new code.
- Optional props should have a clear default when absence would cause ambiguity.
- Do not use props to transport imperative callbacks when an emit better expresses the intent.
- Emits should be explicit, named after an action or observable state change.
- Do not mutate props directly.

## Best Practices

- Prefer a few well-modeled props over multiple conflicting flags.
- Prefer semantically named emits over overly generic events.
- If the component has multiple composition patterns, consider slots before proliferating props.

## Quality Checklist

- Props typed and consistent with the domain.
- Emits typed and semantically named.
- No prop mutation.
- Predictable defaults.
