# Reactivity watch vs watchEffect

## When to Use

- Choosing how to observe reactive dependencies for side effects.

## Local Rules

- Prefer `watch` when dependencies need to be explicit and the trigger must be precise.
- Use `watchEffect` when the effect truly depends on multiple dynamically accessed reactive sources and automatic tracking improves readability.
- In production code, `watch` tends to be more predictable and auditable.
- Do not use `watchEffect` to hide important dependencies.

## Quality Checklist

- Dependencies are clear.
- The effect does not fire from accidental sources.
- Cleanup exists when necessary.
