# Testing E2E

## When to Use

- Validating end-to-end flows, real navigation, backend integration, and multi-page behavior.

## Local Rules

- E2E covers critical business flows and navigation, not every micro UI detail.
- Reuse the E2E tool configured in the project.
- Prioritize scenarios that unit and component tests cannot cover with sufficient confidence.
- Minimize flakiness with predictable data, waits, and selectors.

## Quality Checklist

- Critical flows covered.
- No excessive overlap with unit/component tests.
- Project's current tool respected.
