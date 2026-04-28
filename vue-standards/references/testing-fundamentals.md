# Testing fundamentals

## When to Use

- Creating or updating tests for components, composables, stores, router, and Vue flows.
- Exclusively reuse the testing stack already configured in the project.
- Ensure coherent coverage across logic, observable behavior, and critical flows.
- Avoid introducing a parallel stack of runners, environments, mocks, or assertions.

## Local Rules

- Respect the repository's test scripts, environments, utilities, and conventions.
- Do not standardize a new tool if the project already has one chosen.
- Tests should prioritize observable behavior and public contracts.
- Use unit tests for isolated logic, component tests for component behavior, and E2E for multi-page flows.
- Do not rely solely on snapshots.

## Quality Checklist

- The project's current stack was preserved.
- No parallel tooling was introduced.
- The test covers behavior, not unnecessary private details.
