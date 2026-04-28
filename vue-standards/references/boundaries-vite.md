# Boundaries Vite

## When to Use

- Working on Vite-based Vue projects or evaluating bundling and transform pipeline limits.

## Local Rules

- Only apply Vite-specific guidance when the project actually uses Vite.
- Prefer statically analyzable imports and route-level lazy loading when it aligns with the architecture.
- Do not treat Vite as a universal requirement of `vue-standards`.

## Quality Checklist

- Vite rules applied only when the project uses Vite.
- No undue bundler assumptions.
