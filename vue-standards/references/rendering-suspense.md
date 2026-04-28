# Rendering suspense

## When to Use

- Coordinate async UI boundaries when the project architecture clearly supports it.

## Local Rules

- Use `Suspense` only when the fallback experience is well defined.
- Avoid `Suspense` as a generic solution for any async fetch.
- Do not introduce it if the project stack does not adopt it or if it complicates hydration and tests without a clear benefit.

## Quality Checklist

- Async boundary has a concrete reason.
- Fallback and UX have been thought through.
- The project supports the strategy without unnecessary friction.
