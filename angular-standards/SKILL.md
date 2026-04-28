---
name: angular-standards
description: 'Generates Angular code and provides architectural guidance. Trigger when creating projects, components, or services, or for best practices on reactivity (signals, linkedSignal, resource), forms, dependency injection, routing, SSR, accessibility (ARIA), animations, styling (component styles, Tailwind CSS), testing, or CLI tooling. Enforces project conventions including LIFT principle, OnPush, inject(), signal-first state, BEM/SCSS standards, and opinionated testing rules.'
---

# Angular Standards

1. Always analyze the project's Angular version before providing guidance, as best practices and available features can vary significantly between versions. If creating a new project with Angular CLI, do not specify a version unless prompted by the user.

2. When generating code, follow Angular's style guide and best practices for maintainability and performance. Use the Angular CLI for scaffolding components, services, directives, pipes, and routes to ensure consistency.

3. Once you finish generating code, run the project's configured build script to ensure there are no build errors. If there are errors, analyze the error messages and fix them before proceeding.

## LIFT Principle

Before creating any new component, service, directive, guard, helper, generator, or test, apply the LIFT principle:

- **Locate**: Find existing code, contracts, generators, patterns, and references in the project and domain.
- **Identify**: Determine what already solves part of the problem and where there is potential duplication.
- **Find**: Find the smallest coherent point of reuse, extension, or composition before introducing new code.
- **Try to be DRY**: Eliminate real duplication without creating premature abstractions or unnecessary generic structures.

## Creating New Projects

If no guidelines are provided by the user, here are some default rules to follow when creating a new Angular project:

1. Use the latest stable version of Angular unless the user specifies otherwise.
2. Use Signals Forms for form management in new projects (available in Angular v21 and newer) [Find out more](references/signal-forms.md).

**Execution Rules for `ng new`:**
When asked to create a new Angular project, you must determine the correct execution command by following these strict steps:

**Step 1: Check for an explicit user version.**

- **IF** the user requests a specific version (e.g., Angular 15), bypass local installations and strictly use `npx`.
- **Command:** `npx @angular/cli@<requested_version> new <project-name>`

**Step 2: Check for an existing Angular installation.**

- **IF** no specific version is requested, run `ng version` in the terminal to check if the Angular CLI is already installed on the system.
- **IF** the command succeeds and returns an installed version, use the local/global installation directly.
- **Command:** `ng new <project-name>`

**Step 3: Fallback to Latest.**

- **IF** no specific version is requested AND the `ng version` command fails (indicating no Angular installation exists), you must use `npx` to fetch the latest version.
- **Command:** `npx @angular/cli@latest new <project-name>`

## Main Rules

- Standalone by default. Do not set `standalone: true` explicitly.
- Apply LIFT before introducing new components, services, directives, guards, helpers, generators, or tests.
- Always create the corresponding `.spec.ts` file when the resource requires unit testing.
- When creating or updating unit tests, follow [testing-conventions.md](references/testing-conventions.md).
- When creating or updating unit tests, reuse only the test tool, scripts, and utilities already configured in the project.
- Every new interface must have a corresponding generator using `faker.js`, with a single random seed per execution, respecting the project's folder hierarchy.
- Use `Generator` only for mock/test data; otherwise, prefer `Factory` or `Builder`.
- When creating or modifying component styles, follow [component-styles.md](references/component-styles.md) and keep the template aligned with HTML classes.
- Use Signals for all component state.
- Avoid getters and setters; prefer `computed`.
- Use Signal-based APIs: `input`, `output`, `model`, `viewChild`.
- Use `inject()` instead of constructor injection.
- Always use `ChangeDetectionStrategy.OnPush`.
- Use `NgOptimizedImage` for static images.
- Use native control flow (`@if`, `@for`, `@switch`).
- Prefer `class` and `style` bindings over `ngClass` and `ngStyle`.
- Property ordering: `enums`, `injects`, `queries`, `inputs`, `models`, `signals`, `outputs`, `computed`, `public properties`, `private properties`.
- Method ordering: `constructor`, `angular hooks`, `public methods`, `private methods`.
- Avoid complex `effects`; use RxJS for complex logic and API calls.
- In RxJS, do not place logic inside `subscribe`; use `pipe` with operators (e.g., `tap`).
- Prefer semantic operators.
- Avoid unnecessary subscriptions; always use `takeUntilDestroyed` for automatic unsubscribe.
- Methods must be testable and readable; avoid unnecessary coupling.
- Keep implementations separate; create new components/services when there is complexity or reuse.
- Keep components simple (KISS, YAGNI).
- Maintain 100% AXE and WCAG AA compliance.
- Do not expose accessibility as configurable API (e.g., `aria-label`, `aria-describedby`, helper-text for a11y only).
- Prefer self-contained internal semantics and accessible behavior.

## Integration with Local References

- When modifying general typing, shared contracts, interfaces, enums, or TypeScript modeling, follow `typescript-standards`.
- When modifying `*.component.scss`, `*.directive.scss`, or template classes, follow [component-styles.md](references/component-styles.md).
- When creating or modifying `*.spec.ts` files, follow [testing-conventions.md](references/testing-conventions.md).
- When suggesting or running project scripts, respect the stack and scripts already configured in the project.
- When preparing commits, follow `git-commit`.
- In case of conflict, this order prevails: [component-styles.md](references/component-styles.md) for component styles, [testing-conventions.md](references/testing-conventions.md) for unit tests, `typescript-standards` for general TypeScript rules, `git-commit` for commits, and `angular-standards` for Angular architecture, code organization, reactivity, and accessibility.

## Components

When working with Angular components, consult the following references based on the task:

- **Fundamentals**: Anatomy, metadata, core concepts, and template control flow (@if, @for, @switch). Read [components.md](references/components.md)
- **Inputs**: Signal-based inputs, transforms, and model inputs. Read [inputs.md](references/inputs.md)
- **Outputs**: Signal-based outputs and custom event best practices. Read [outputs.md](references/outputs.md)
- **Host Elements**: Host bindings and attribute injection. Read [host-elements.md](references/host-elements.md)

If you require deeper documentation not found in the references above, read the documentation at `https://angular.dev/guide/components`.

## Reactivity and Data Management

When managing state and data reactivity, use Angular Signals and consult the following references:

- **Signals Overview**: Core signal concepts (`signal`, `computed`), reactive contexts, and `untracked`. Read [signals-overview.md](references/signals-overview.md)
- **Dependent State (`linkedSignal`)**: Creating writable state linked to source signals. Read [linked-signal.md](references/linked-signal.md)
- **Async Reactivity (`resource`)**: Fetching asynchronous data directly into signal state. Read [resource.md](references/resource.md)
- **Side Effects (`effect`)**: Logging, third-party DOM manipulation (`afterRenderEffect`), and when NOT to use effects. Read [effects.md](references/effects.md)

## Forms

In most cases for new apps, **prefer signal forms**. When making a forms decision, analyze the project and consider the following guidelines:

- If the application is using v21 or newer and this is a new form, **prefer signal forms**.
- For older applications or when working with existing forms, use the appropriate form type that matches the application's current form strategy.

- **Signal Forms**: Use signals for form state management. Read [signal-forms.md](references/signal-forms.md)
- **Template-driven forms**: Use for simple forms. Read [template-driven-forms.md](references/template-driven-forms.md)
- **Reactive forms**: Use for complex forms. Read [reactive-forms.md](references/reactive-forms.md)

## Dependency Injection

When implementing dependency injection in Angular, follow these guidelines:

- **Fundamentals**: Overview of Dependency Injection, services, and the `inject()` function. Read [di-fundamentals.md](references/di-fundamentals.md)
- **Creating and Using Services**: Creating services, the `providedIn: 'root'` option, and injecting into components or other services. Read [creating-services.md](references/creating-services.md)
- **Defining Dependency Providers**: Automatic vs manual provision, `InjectionToken`, `useClass`, `useValue`, `useFactory`, and scopes. Read [defining-providers.md](references/defining-providers.md)
- **Injection Context**: Where `inject()` is allowed, `runInInjectionContext`, and `assertInInjectionContext`. Read [injection-context.md](references/injection-context.md)
- **Hierarchical Injectors**: The `EnvironmentInjector` vs `ElementInjector`, resolution rules, modifiers (`optional`, `skipSelf`), and `providers` vs `viewProviders`. Read [hierarchical-injectors.md](references/hierarchical-injectors.md)

## Angular Aria

When building accessible custom components for any of the following patterns: Accordion, Listbox, Combobox, Menu, Tabs, Toolbar, Tree, Grid, consult the following reference:

- **Angular Aria Components**: Building headless, accessible components (Accordion, Listbox, Combobox, Menu, Tabs, Toolbar, Tree, Grid) and styling ARIA attributes. Read [angular-aria.md](references/angular-aria.md)

## Routing

When implementing navigation in Angular, consult the following references:

- **Define Routes**: URL paths, static vs dynamic segments, wildcards, and redirects. Read [define-routes.md](references/define-routes.md)
- **Route Loading Strategies**: Eager vs lazy loading, and context-aware loading. Read [loading-strategies.md](references/loading-strategies.md)
- **Show Routes with Outlets**: Using `<router-outlet>`, nested outlets, and named outlets. Read [show-routes-with-outlets.md](references/show-routes-with-outlets.md)
- **Navigate to Routes**: Declarative navigation with `RouterLink` and programmatic navigation with `Router`. Read [navigate-to-routes.md](references/navigate-to-routes.md)
- **Control Route Access with Guards**: Implementing `CanActivate`, `CanMatch`, and other guards for security. Read [route-guards.md](references/route-guards.md)
- **Data Resolvers**: Pre-fetching data before route activation with `ResolveFn`. Read [data-resolvers.md](references/data-resolvers.md)
- **Router Lifecycle and Events**: Chronological order of navigation events and debugging. Read [router-lifecycle.md](references/router-lifecycle.md)
- **Rendering Strategies**: CSR, SSG (Prerendering), and SSR with hydration. Read [rendering-strategies.md](references/rendering-strategies.md)
- **Route Transition Animations**: Enabling and customizing the View Transitions API. Read [route-animations.md](references/route-animations.md)

If you require deeper documentation or more context, visit the [official Angular Routing guide](https://angular.dev/guide/routing).

## Styling and Animations

When implementing styling and animations in Angular, consult the following references:

- **Using Tailwind CSS with Angular**: Integrating Tailwind CSS into Angular projects. Read [tailwind-css.md](references/tailwind-css.md)
- **Angular Animations**: Using native CSS (recommended) or the legacy DSL for dynamic effects. Read [angular-animations.md](references/angular-animations.md)
- **Component Styling**: Best practices for component styles and encapsulation. Read [component-styling.md](references/component-styling.md)
- **Component Styles (Project)**: BEM, SCSS toolbox, ITCSS, and project-specific styling conventions. Read [component-styles.md](references/component-styles.md)

## Testing

When writing or updating tests, consult the following references based on the task:

- **Testing Conventions (Project)**: Project-specific rules for logic-only unit tests, faker.js, spies, coverage, and test structure. Read [testing-conventions.md](references/testing-conventions.md)
- **Fundamentals**: Best practices for unit testing (Vitest), async patterns, and `TestBed`. Read [testing-fundamentals.md](references/testing-fundamentals.md)
- **Component Harnesses**: Standard patterns for robust component interaction. Read [component-harnesses.md](references/component-harnesses.md)
- **Router Testing**: Using `RouterTestingHarness` for reliable navigation tests. Read [router-testing.md](references/router-testing.md)
- **End-to-End (E2E) Testing**: Best practices for E2E tests with Cypress. Read [e2e-testing.md](references/e2e-testing.md)

## Tooling

When working with Angular tooling, consult the following references:

- **Angular CLI**: Creating applications, generating code (components, routes, services), serving, and building. Read [cli.md](references/cli.md)
- **Angular MCP Server**: Available tools, configuration, and experimental features. Read [mcp.md](references/mcp.md)

## Procedure

1. Apply LIFT to locate, identify, and reuse what already exists before creating new structures.
2. Model state with Signals and `computed`.
3. Configure `OnPush` and use `inject()`.
4. Structure the template with native control flow and clear `class` and `style` bindings.
5. If there is general typing or shared contracts, also align with `typescript-standards`.
6. If there are component styles or template class changes, apply [component-styles.md](references/component-styles.md).
7. Write RxJS with `pipe` and semantic operators.
8. Use `takeUntilDestroyed` when there are subscriptions.
9. If there are unit tests, follow [testing-conventions.md](references/testing-conventions.md).
10. Ensure WCAG AA accessibility without exposing a11y as configurable API.

## Quality Checklist

- `.spec.ts` file created when applicable.
- LIFT applied before introducing new structures or duplicating implementations.
- If general typing was changed, `typescript-standards` was followed.
- If `*.spec.ts` was changed, [testing-conventions.md](references/testing-conventions.md) was followed.
- If component SCSS or template classes were changed, [component-styles.md](references/component-styles.md) was followed.
- New interfaces with corresponding generator using `faker.js`, unique seed, and correct hierarchy.
- `Generator` names only for mocks/tests.
- Signals used for all component state.
- No getters/setters; `computed` used when necessary.
- `OnPush` active and `inject()` used.
- Native control flow used.
- RxJS without logic inside `subscribe`.
- Subscriptions with automatic unsubscribe via `takeUntilDestroyed`.
- Methods readable, testable, and with low complexity.
- Properties and methods in the defined order.
- Component simple, without excess code.
- AXE and WCAG AA met.
- No configurable accessibility API; internal semantics used.

## Notes

- Do not run `ng build` automatically; follow the project's `package.json` scripts.
- This skill defines architectural standards; do not duplicate SCSS and unit test operational rules here.
- For component styles, use [component-styles.md](references/component-styles.md).
- For logic unit tests, use [testing-conventions.md](references/testing-conventions.md) and preserve the project's configured test stack.
- For project scripts, respect the stack and scripts already configured in the project.
- For commits, use `git-commit`.
- Harnesses and router testing are complementary references for specific UI and navigation cases.
- `effect` only for simple cases; complex logic belongs in RxJS.
- `resource` is experimental; use with caution.
