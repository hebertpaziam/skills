# Router lazy loading

## When to Use

- Load screens on demand in Vue Router.

## Local Rules

- Use lazy loading for route components by default, except for small critical paths where the project has decided otherwise.
- Keep chunk boundaries aligned with screens, funnels, or heavy areas.
- Do not over-fragment small routes without measurable gain.

## Quality Checklist

- Consistent route-level code splitting.
- No excessive fragmentation.
