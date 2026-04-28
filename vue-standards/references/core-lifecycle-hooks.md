# Core lifecycle hooks

## When to Use

- Adding setup and teardown of effects tied to the component lifecycle.

## Local Rules

- `onMounted` and `onUnmounted` should encapsulate effects tied to the browser, DOM, or listeners.
- Do not use hooks for work that can be expressed as pure reactive derivation.
- Every effect that registers external resources must have a corresponding cleanup.
- In SSR scenarios, browser side effects should remain client-only.

## Quality Checklist

- Each effect has a clear reason.
- External resources are cleaned up correctly.
- Hooks are not being used to compensate for poor reactive modeling.
