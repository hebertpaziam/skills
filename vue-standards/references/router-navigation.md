# Router navigation

## When to Use

- Implement declarative or programmatic navigation.

## Local Rules

- Prefer `RouterLink` for declarative navigation.
- Use `useRouter()` for programmatic navigation in response to user flows or clear side effects.
- Do not manually manipulate `window.location` for internal SPA flows.
- Prefer navigating by name with typed/coherent params when it reduces fragility.

## Quality Checklist

- Navigation expressed via Vue Router.
- No URL hacks outside the router API.
