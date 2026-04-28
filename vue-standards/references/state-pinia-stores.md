# State Pinia stores

## When to Use

- Share state across screens, flows, modules, or multiple disconnected components.

## Local Rules

- Prefer Pinia for shared application state.
- Avoid reactive singletons at module scope as a general solution.
- A store should represent a coherent domain or aggregate, not a generic catch-all container.
- Prefer setup stores when the Composition API brings better readability and composability.

## Quality Checklist

- Shared state with Pinia when the scope justifies it.
- Store with a clear responsibility.
- No ad-hoc global state outside the app's strategy.
