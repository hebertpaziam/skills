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
- Keep dependencies real; use spies only punctually to verify interactions.
- Keep tests readable, deterministic, and consistently structured.

## Runner Agnosticism

- The skill does NOT prescribe a specific test runner (Jest, Vitest, Karma, etc.).
- Always detect and reuse the runner already configured in the project.
- Examples in this skill use Jest-like syntax (`jest.fn()`, `jest.spyOn()`) as illustration; adapt to the runner of your project.

## Dependency Strategy: Real Dependencies + Punctual Spies

The core principle is: **keep dependencies real whenever possible; spy only when verifying a specific interaction.**

### Dependency Pyramid

| Dependency Type | Strategy | Rationale |
|---|---|---|
| Signal stores, state services | **Always real** | Lightweight, no I/O; real state propagation is valuable |
| Services with HTTP | **Real service + `HttpTestingController`** | Service logic tested; I/O controlled without network |
| Platform infrastructure (Router, ActivatedRoute, Window) | **Stub with `useValue`** | Framework plumbing; too complex to keep real in unit tests |
| Heavy third-party services | **Stub with `useValue`** | Not your code; not your test responsibility |

### Punctual Spy Rule

Spies must be created **inside the `it()` block** where the verification is needed, never in `beforeEach`.

```ts
// ✅ CORRECT: spy is punctual, only affects this test
it('should call search on submit', () => {
  const spy = jest.spyOn(service, 'search'); // adapte ao runner do projeto
  component.onSubmit();
  expect(spy).toHaveBeenCalledWith(expectedParams);
});

// ✅ CORRECT: next test uses the real service behavior
it('should update results after search', () => {
  component.onSubmit();
  httpMock.expectOne('/api/search').flush(mockData);
  expect(component.results()).toEqual(expectedResults);
});
```

```ts
// ❌ WRONG: global stub kills the service for the entire suite
beforeEach(() => {
  const mockService = { search: jest.fn().mockReturnValue(of([])) }; // adapte ao runner do projeto
  TestBed.configureTestingModule({
    providers: [{ provide: SearchService, useValue: mockService }],
  });
});
```

### When a Global Stub Is Acceptable

- Router, ActivatedRoute, Window/Document APIs
- Third-party services you don't own and don't test
- Services that require heavy infrastructure not relevant to the unit under test

## Local Rules

- Do not introduce tools, adapters, or parallel testing layers when the project already has defined scripts, config, and utilities.
- When needing spies, mocks, fake timers, async helpers, or matchers, use the native equivalents from the project's configured stack.
- Never test HTML or rendering by default.
- Always generate data with `faker.js` or local project generators.
- Never use hardcoded data in tests.
- Avoid nested contexts (`describe` inside `describe`) unless truly necessary.
- Never validate objects or values inline; always assign to variables first.
- Prefer semantic matchers provided by the project's configured stack over generic assertions when a more descriptive option exists.
- Aim for 100% coverage of the resource, covering all possible behaviors.
- Order scenarios: success first, then failure.

## Naming Convention

- `describe` block: resource name (e.g., `describe('MyService', ...)`).
- `it` block: `should [verb] when [condition]` pattern.

```ts
it('should return empty array when no results found', () => { ... });
it('should emit loading true when request starts', () => { ... });
it('should throw error when input is null', () => { ... });
```

## Test Independence

- Each `it` must be independent and runnable in isolation.
- Tests must NOT depend on execution order.
- Shared mutable state must be reset in `beforeEach`.
- Use `afterEach` for cleanup when tests modify global state or subscriptions.

## TestBed Component Configuration

When configuring `TestBed` for component tests:

- **NEVER** use `CUSTOM_ELEMENTS_SCHEMA` or `NO_ERRORS_SCHEMA` to suppress unknown element errors.
- **NEVER** create stub/mock components to replace child components.
- **ALWAYS** import the real child components used in the template (standalone components go in `imports`, non-standalone in `declarations`).
- **ALWAYS** import `RouterOutlet` from `@angular/router` when the template uses `<router-outlet>`.
- **ALWAYS** provide `provideHttpClient()` and `provideHttpClientTesting()` when any imported component or its dependency tree requires `HttpClient`.
- **ALWAYS** provide `provideRouter([...])` when the component or its children depend on Router services.
- Services decorated with `@Injectable({ providedIn: 'root' })` are automatically available and do not need explicit providers unless you need to override them.

### Example

```ts
import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AppComponent } from './app.component';
import { HeaderNavBarComponent } from '../components/header-nav-bar/header-nav-bar';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterOutlet,
        HeaderNavBarComponent,
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });
});
```

## Scope Boundary

- This reference defines operational rules for logic unit tests in Angular.
- `testing-signals` covers signal-specific testing patterns.
- `testing-services` covers service dependency and HTTP testing patterns.
- `testing-guards-pipes` covers guards, pipes, and interceptors.
- `component-harnesses` and `router-testing` cover UI and navigation exceptions when the scope requires it.

## Procedure

1. Identify the resource and its relevant public and private methods and functions.
2. Map all possible behaviors, covering success and failure.
3. Confirm which test scripts, helpers, and conventions are already configured in the project and reuse them without introducing a parallel stack.
4. Generate data with `faker.js` or local project generators.
5. Set up the suite with real dependencies; stub only platform infrastructure.
6. Create spies **inside `it()` blocks** only when verifying interactions.
7. Store inputs and results in named variables before `expect` statements.
8. Write success tests first, then failure tests.
9. Review coverage to ensure 100% behavior coverage.

## Quality Checklist

- Suite adheres to the test tool and utilities already configured in the project.
- No parallel testing stack was introduced.
- No test uses DOM or HTML by default.
- Data generated with `faker.js` or local generators, no hardcoded values.
- Dependencies kept real; spies are punctual inside `it()` blocks.
- Global stubs only for platform infrastructure (Router, Window, etc.).
- No nested `describe`, unless justified.
- `it` names follow `should [verb] when [condition]`.
- `expect` uses named variables, no inline objects.
- Semantic matchers prioritized.
- Each test is independent and order-agnostic.
- Full resource coverage, with success before failure.
