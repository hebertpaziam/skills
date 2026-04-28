# Router guards

## When to Use

- Protect routes, redirect flows, or validate navigation preconditions.

## Local Rules

- Guards should be small, predictable, and focused on navigation.
- Denser authorization or domain logic should live in a service, composable, or store and only be orchestrated by the guard.
- Avoid complex side effects inside guards.
- Redirects should be explicitly modeled and easy to trace.

## Quality Checklist

- Guard with clear responsibility.
- No bloated business logic in the router.
- Predictable redirects.
