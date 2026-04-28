# Rendering Teleport KeepAlive Transition

## When to Use

- Work with overlays, view caching, or transitions.

## Local Rules

- Use `Teleport` for overlays and content that needs to escape the local visual hierarchy.
- Use `KeepAlive` only when instance and state caching is desired and understood.
- Use `Transition` and `TransitionGroup` for genuine visual changes, not as coupling between logic and animation.
- In SSR scenarios, handle `Teleport` with extra care and follow [boundaries-ssr-and-hydration.md](boundaries-ssr-and-hydration.md).

## Quality Checklist

- `Teleport`, `KeepAlive`, and `Transition` used semantically.
- No unexpected hidden state kept in cache.
- Transitions do not harm accessibility or predictability.
