# Router testing

## When to Use

- Test navigation, params, query, guards, and route-based behavior.

## Local Rules

- Reuse the testing tool configured in the project.
- Test observable navigation behavior, not private implementation details of the router.
- For params and query, validate parsing, serialization, and screen reaction.
- For guards, test authorization, redirection, and the happy path.

## Quality Checklist

- Tests cover navigation behavior.
- No unnecessary coupling to internal details.
