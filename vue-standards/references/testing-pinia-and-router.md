# Testing Pinia and Router

## When to Use

- Testing Pinia stores, navigation, params, guards, and minimal integration between views and router/store.

## Local Rules

- Stores should be tested by state, getters, actions, and observable effects.
- Guards and navigation should be tested by redirection, authorization, and visible outcome.
- Use doubles, spies, and helpers from the project's stack instead of parallel mock layers.

## Quality Checklist

- Store and router tested by observable behavior.
- No excessive coupling to internal details.
