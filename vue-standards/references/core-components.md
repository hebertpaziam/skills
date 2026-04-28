# Core components

## When to Use

- Creating or refactoring Vue components.
- Reviewing the boundary between component, composable, and store.

## Local Rules

- Components should encapsulate a clear visual or interactional responsibility.
- Keep components small and focused; extract child components when readability or reuse justifies it.
- Do not turn a component into a coordinator of all domain details if a store or composable is a better boundary.
- Prefer a small public API: props, emits, slots, and `v-model` when it makes sense.
- Avoid dense business logic in the template; derive and prepare data in the script.

## Signals to Extract

- More than one relevant logical concern in the same file.
- Repeated rules across multiple components.
- Too many boolean props trying to control too many variations.
- Large volume of branches in the template.

## Quality Checklist

- Single responsibility.
- Small and clear public API.
- No unnecessary coupling to external details.
- Readable template.
