# Testing composables

## When to Use

- Testing composables with or without host component dependency.

## Local Rules

- If the composable uses only pure reactivity, test it by direct invocation.
- If it depends on lifecycle or provide/inject, test it with a host component or equivalent helper from the current stack.
- Validate the composable's public contract: returned state, exposed functions, and observable effects.

## Quality Checklist

- Testing strategy aligned with the composable type.
- No unnecessary host component.
- No excessive detail on internals.
