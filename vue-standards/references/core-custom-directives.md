# Core custom directives

## When to Use

- Encapsulating low-level DOM manipulation that does not fit better in a component or composable.

## Local Rules

- Only create a directive when the primary concern is reusable imperative DOM work.
- If the need is to reuse state or reactive logic, prefer a composable.
- If the need is to reuse UI, prefer a component.
- Directives should have a small scope, predictable effect, and clear cleanup.

## Quality Checklist

- Directive technically justified.
- No overlap with component or composable.
- Cleanup implemented when necessary.
