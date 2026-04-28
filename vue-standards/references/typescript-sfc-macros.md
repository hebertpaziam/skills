# TypeScript SFC macros

## When to Use

- Type `defineProps`, `defineEmits`, `defineModel`, `withDefaults`, and related macros.

## Local Rules

- In new code, prefer type-based declaration for `defineProps` and `defineEmits` when it keeps the contract clear.
- Use prop defaults predictably, avoiding shared mutables.
- For complex props, prefer named interfaces or types when it improves readability.
- Do not combine runtime and type-based declaration for the same macro.
- When using generics in SFC, keep the component API understandable for normal consumption.

## Quality Checklist

- Macros with consistent typing.
- Safe defaults.
- No abuse of complex types that harms maintainability.
