# Boundaries SSR and hydration

## When to Use

- Working on Vue projects with SSR, hydration, or universal code.

## Local Rules

- Browser side effects must be client-only.
- Do not assume `window`, `document`, or platform APIs in universal code.
- Avoid state pollution between requests in SSR; stores and app should be created per request when the architecture requires it.
- Prevent hydration mismatch by eliminating invalid HTML, unstabilized random values, and avoidable client/server differences.
- `Teleport` and other features with special SSR behavior require additional care.

## Quality Checklist

- Universal code separated from client-only code.
- No cross-request state pollution.
- Predictable hydration.
