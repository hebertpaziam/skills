# Testing Conventions (Angular Logic)

## When to Use

- Creating or updating unit tests for Angular resources.
- Validating behavior of methods and functions in components, services, directives, and related code.
- Ensuring full coverage of success and failure scenarios.
- Use this reference whenever an Angular task involves creating or editing `*.spec.ts` files.
- Reuse exclusively the testing stack already configured in the project.

## Goal

- Test only resource logic, without validating HTML, rendering, text, or colors.
- Reuse the runner, assertion API, execution environment, spy/mock utilities, and coverage provider already standardized in the repository.
- Avoid introducing a parallel testing stack, ad hoc helpers, or conventions that diverge from the current base.
- Use data generated with `faker.js` and local project generators when available.
- Avoid stubs; use spies to validate dependency calls.
- Keep tests readable, deterministic, and consistently structured.

## Local Rules

- Do not introduce tools, adapters, or parallel testing layers when the project already has defined scripts, config, and utilities.
- When needing spies, mocks, fake timers, async helpers, or matchers, use the native equivalents from the project's configured stack.
- Never test HTML or rendering by default.
- Always generate data with `faker.js` or local project generators.
- Never use hardcoded data in tests.
- Avoid manual stubs; prefer spies and doubles provided by the project's configured tool to validate dependency calls.
- Avoid nested contexts (`describe` inside `describe`) unless truly necessary.
- Never validate objects or values inline; always assign to variables first.
- Prefer semantic matchers provided by the project's configured stack over generic assertions when a more descriptive option exists.
- Aim for 100% coverage of the resource, covering all possible behaviors.
- Order scenarios: success first, then failure.

## Scope Boundary

- This reference defines operational rules for logic unit tests in Angular.
- `component-harnesses` and `router-testing` cover UI and navigation exceptions when the scope requires it.

## Procedure

1. Identify the resource and its relevant public and private methods and functions.
2. Map all possible behaviors, covering success and failure.
3. Confirm which test scripts, helpers, and conventions are already configured in the project and reuse them without introducing a parallel stack.
4. Generate data with `faker.js` or local project generators.
5. Set up the suite using a single root context per resource, whenever possible.
6. Create spies for dependencies and validate calls with the project stack's native APIs.
7. Store inputs and results in named variables before `expect` statements.
8. Write success tests first, then failure tests.
9. Review coverage to ensure 100% behavior coverage.

## Quality Checklist

- Suite adheres to the test tool and utilities already configured in the project.
- No parallel testing stack was introduced.
- No test uses DOM or HTML by default.
- Data generated with `faker.js` or local generators, no hardcoded values.
- No stubs; only spies when there are dependencies.
- No nested `describe`, unless justified.
- `expect` uses named variables, no inline objects.
- Semantic matchers prioritized.
- Full resource coverage, with success before failure.

## Example

```ts
import { faker } from '@faker-js/faker';

const inputValue = faker.string.alpha();
const expectedResult = faker.number.int();

const result = service.calculate(inputValue);

expect(result).toEqual(expectedResult);
```
