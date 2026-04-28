# Rendering async components

## When to Use

- Defer loading of heavy components or subtrees.

## Local Rules

- Use `defineAsyncComponent` for large, rarely used, or non-critical-path components.
- Prefer lazy loading at natural boundaries such as screens, modals, or optional features.
- Do not turn small, critical components into async without a real benefit.

## Quality Checklist

- Lazy loading aligned with actual cost.
- No excessive chunk fragmentation.
- Coherent fallback or loading UX when needed.
