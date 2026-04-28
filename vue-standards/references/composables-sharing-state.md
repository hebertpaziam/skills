# Composables sharing state

## When to Use

- Deciding between per-instance state, local shared state, or a global store.

## Local Rules

- By default, each composable call should create isolated per-instance state.
- Use shared state in a composable only when the shared scope is small, local, and consciously controlled.
- When shared state crosses modules, pages, or domains, prefer Pinia.
- Avoid improvised reactive singletons for application state.

## Quality Checklist

- The scope of shared state is clear.
- There is no risk of architectural leakage or hidden coupling.
- Pinia was considered when the state exceeds the local scope.
