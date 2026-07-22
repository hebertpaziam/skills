---
name: angular-standards
description: 'Generates Angular code and provides architectural guidance. Trigger when creating projects, components, or services, or for best practices on reactivity (signals, linkedSignal, resource), forms, dependency injection, routing, SSR, accessibility (ARIA), animations, styling (component styles, Tailwind CSS), testing, or CLI tooling. Enforces project conventions including LIFT principle, OnPush, inject(), signal-first state, BEM/SCSS standards, and opinionated testing rules.'
---
* **.
* **Prós:**
  * Excelente gerenciamento de VMs no Proxmox.
  * Plataforma AM4 consolidada no Brasil: permite memórias **DDR4** e placas-mãe maduras (ex: Gigabyte B450M DS3H V2 ou B550M) com **4 portas SATA nativas**.
  * TDP de 65W com baixíssimo consumo em repouso (expansível com o recurso *Modo ECO / 35W* via BIOS).

---

## 💾 Estratégia de Armazenamento e Preço no Brasil

> **Aviso Importante (Tecnologia de HDs):** HDs mecânicos comuns de desktop (Seagate Barracuda, WD Blue) usam tecnologia **SMR** e devem ser evitados em servidores 24/7. NAS exige discos **CMR** (Seagate IronWolf, WD Red Plus, Seagate SkyHawk, WD Purple).

### O Cenário do Mercado Nacional e o Pivot para SSD
* Devido à inflação nos preços nacionais de HDs mecânicos dedicados para NAS (com unidades de 4TB custando cerca de R$ 1.400,00 no e-commerce nacional), a abordagem de disco mecânico perdeu competitividade para capacidades de até 2TB.

### A Solução: NAS All-Flash com SSD NVMe
* **Hardware Recomendado:** SSD NVMe PCIe 4.0 de 2TB (ex: Kingston NV2).
* **Faixa de Preço Nacional:** R$ 750,00 – R$ 850,00 (em e-commerces brasileiros com NF e garantia).
* **Vantagens:** Silêncio absoluto, menor consumo de energia, ausência de peças móveis e velocidade de acesso extremamente alta para fotos e mídias.

### ⚠️ Cuidados Obrigatórios com SSD no Proxmox (Prevenção de Desgaste):
1. **Sistema de Arquivos:** Ao instalar o Proxmox em SSD comum, preferir **ext4** ou **XFS** (LVM-thin). O sistema ZFS sem ajustes causa *Amplificação de Escrita* acentuada no SSD devido ao registro contínuo de logs.
2. **Otimização de Logs (Se usar ZFS):** Caso opte por ZFS, desativar serviços de Alta Disponibilidade (HA) desnecessários e direcionar logs temporários do `systemd-journald` para a memória RAM.
3. **TRIM:** Garantir a execução semanal do comando `fstrim` para manutenção da saúde dos blocos flash.

---

## 🚀 Opção Pronta (All-in-One): UGREEN NASync DXP480T Plus

Dispositivo compacto e de alta performance que atua como um mini PC voltado a armazenamento All-Flash.

+-----------------------------------------------------------------+
|                    UGREEN DXP480T Plus                          |
|                                                                 |
|  +--------------------+   +----------------------------------+  |
|  | CPU: Intel i5-1235U|   |  RAM: 8GB DDR5 (SO-DIMM)         |  |
|  | 10 Cores / 12 Th  |   |  * Expansível até 64GB           |  |
|  +--------------------+   +----------------------------------+  |
|                                                                 |
|  +--------------------+   +----------------------------------+  |
|  | OS Drive Integrado |   |  Armazenamento: 4x Slots M.2     |  |
|  | 128GB (para OS)    |   |  NVMe (All-Flash)                |  |
|  +--------------------+   +----------------------------------+  |
|                                                                 |
|  +------------------------------------------------------------+  |
|  | Conectividade: Rede 10 GbE, Wi-Fi 6, USB 3.2, Thunderbolt 4   |  |
|  +------------------------------------------------------------+  |
+-----------------------------------------------------------------+

### Avaliação do Hardware
* **BIOS Desbloqueada:** Permite substituir o sistema original (UGOS) diretamente pela instalação limpa do Proxmox VE via pendrive.
* **Processador:** Intel Core i5-1235U (10 Cores / 12 Threads, TDP otimizado para notebooks/mini PCs, consumo de 6W–9W em *idle*).
* **Melhorias Necessárias:** Realizar upgrade da memória RAM (adicionar módulo DDR5 SO-DIMM para totalizar 16GB ou mais), garantindo margem de folga para as VMs do Proxmox.

---

## 📡 Integração com Home Assistant & Hub Zigbee

Para utilizar a máquina como central da automação Zigbee da residência, atentar-se às seguintes boas práticas de infraestrutura:

### 1. Mitigação de Interferência Eletromagnética (Frequência 2.4 GHz)
* As portas USB 3.2/Thunderbolt e a carcaça de alumínio do mini PC geram ruído que afeta a rede Zigbee.
* **Regra de Ouro:** **Nunca** conectar o dongle USB Zigbee diretamente no painel traseiro/frontal. Utilizar um **cabo extensor USB 2.0 de no mínimo 1,5 metro** para distanciar o adaptador da máquina.

### 2. Encaminhamento de Hardware no Proxmox (USB Passthrough)
* No painel do Proxmox: `VM do Home Assistant` ➔ `Hardware` ➔ `Add` ➔ `USB Device`.
* Selecionar **Use USB Vendor/Device ID** e associar o dongle físico (ex: Sonoff ZBDongle-E/P) para repasse direto à VM/Zigbee2MQTT/ZHA.

### 3. Alternativa Avançada: Coordenador Zigbee via Rede (LAN/PoE)
* Utilizar adaptadores Zigbee baseados em rede Ethernet (ex: SMLIGHT SLZB-06/SLZB-M04).
* Comunicação via Soquete TCP/IP na rede local, eliminando completamente a dependência de portas USB físicas e permitindo o reposicionamento do coordenador no centro físico da residência.

---

## 📊 Matriz Comparativa Resumida

| Parâmetro                   | Setup Customizado (Ryzen 5 5600GT)   | UGREEN NASync DXP480T Plus                 |
| :-------------------------- | :----------------------------------- | :----------------------------------------- |
| **Formato**                 | Gabinete Desktop / Server            | Mini PC Ultramoderno (All-Flash)           |
| **Soquete / Arquitetura**   | AM4 (DDR4)                           | Integrado (Intel i5-1235U, DDR5)           |
| **Expansão SATA / NVMe**    | 4+ SATA3 (via MoBo B450/B550) + NVMe | Exclusivo 4x Slots NVMe M.2                |
| **Consumo Elétrico (Idle)** | ~20W - 30W                           | ~6W - 9W                                   |
| **Facilidade de Reparo**    | Peças de desktop padrão de mercado   | Componentes integrados (exceto RAM e SSDs) |
## When to Load

Load this skill when the task involves:
- Creating or modifying Angular Resources: components, services, directives, pipes, routes, guards, resolvers, interceptors
- Angular-specific features: Dependency Injection, Signals, Forms, Routing, SSR, Animations, Styling
- CLI tooling (`ng generate`, `ng serve`, `ng build`, etc.)
- Angular component tests (`.spec.ts`)
- Angular architecture decisions (OnPush, standalone, module structure)

## Composition

Load `typescript-standards` ALONGSIDE this skill when the task involves:

| Scenario | Reason |
|---|---|
| Services, Guards, Resolvers, Interceptors | Business logic + new contracts |
| Interfaces, Types, Enums (creation/modification) | Project typing rules |
| UI Library components (`libs/ui/`) | Export public API with types |
| Utility functions, helpers, complex pipes | TypeScript design decisions |
| Uncertainty about need | Missing rules cost more than extra tokens |

Do NOT load `typescript-standards` when the task is exclusively:
- App component that only consumes existing imported types
- Pure visual Pipe or Directive (masks, simple formatting)
- HTML template or SCSS/CSS styles
- Component tests (`.spec.ts`) without new types

## Do Not Load When

- Pure TypeScript tasks without Angular context (use `typescript-standards` instead)
- Commit tasks (use `git-commit`)
- Build/deploy/infra tasks

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
2. Use Signals Forms for form management in new projects (available in Angular v21 and newer) [Find out more](signal-forms.md).

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
- When creating or updating unit tests, follow [testing-conventions.md](testing-conventions.md).
- When creating or updating unit tests, reuse only the test tool, scripts, and utilities already configured in the project.
- Every new interface must have a corresponding generator using `faker.js`, with a single random seed per execution, respecting the project's folder hierarchy.
- Use `Generator` only for mock/test data; otherwise, prefer `Factory` or `Builder`.
- When creating or modifying component styles, follow [component-styles.md](component-styles.md) and [bem-reference.md](bem-reference.md); consult [utility-classes.md](utility-classes.md) before creating new classes.
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
- When modifying `*.component.scss`, `*.directive.scss`, or template classes, follow [component-styles.md](component-styles.md) and [bem-reference.md](bem-reference.md); consult [utility-classes.md](utility-classes.md) before adding new classes.
- When creating or modifying `*.spec.ts` files, follow [testing-conventions.md](testing-conventions.md).
- When suggesting or running project scripts, respect the stack and scripts already configured in the project.
- When preparing commits, follow `git-commit`.
- In case of conflict, this order prevails: [component-styles.md](component-styles.md) for component styles, [testing-conventions.md](testing-conventions.md) for unit tests, `typescript-standards` for general TypeScript rules, `git-commit` for commits, and `angular-standards` for Angular architecture, code organization, reactivity, and accessibility.

## Components

When working with Angular components, consult the following references based on the task:

- **Fundamentals**: Anatomy, metadata, core concepts, and template control flow (@if, @for, @switch). Read [components.md](components.md)
- **Inputs**: Signal-based inputs, transforms, and model inputs. Read [inputs.md](inputs.md)
- **Outputs**: Signal-based outputs and custom event best practices. Read [outputs.md](outputs.md)
- **Host Elements**: Host bindings and attribute injection. Read [host-elements.md](host-elements.md)

If you require deeper documentation not found in the references above, read the documentation at `https://angular.dev/guide/components`.

## Reactivity and Data Management

When managing state and data reactivity, use Angular Signals and consult the following references:

- **Signals Overview**: Core signal concepts (`signal`, `computed`), reactive contexts, and `untracked`. Read [signals-overview.md](signals-overview.md)
- **Dependent State (`linkedSignal`)**: Creating writable state linked to source signals. Read [linked-signal.md](linked-signal.md)
- **Async Reactivity (`resource`)**: Fetching asynchronous data directly into signal state. Read [resource.md](resource.md)
- **Side Effects (`effect`)**: Logging, third-party DOM manipulation (`afterRenderEffect`), and when NOT to use effects. Read [effects.md](effects.md)

## Forms

In most cases for new apps, **prefer signal forms**. When making a forms decision, analyze the project and consider the following guidelines:

- If the application is using v21 or newer and this is a new form, **prefer signal forms**.
- For older applications or when working with existing forms, use the appropriate form type that matches the application's current form strategy.

- **Signal Forms**: Use signals for form state management. Read [signal-forms.md](signal-forms.md)
- **Template-driven forms**: Use for simple forms. Read [template-driven-forms.md](template-driven-forms.md)
- **Reactive forms**: Use for complex forms. Read [reactive-forms.md](reactive-forms.md)

## Dependency Injection

When implementing dependency injection in Angular, follow these guidelines:

- **Fundamentals**: Overview of Dependency Injection, services, and the `inject()` function. Read [di-fundamentals.md](di-fundamentals.md)
- **Creating and Using Services**: Creating services, the `providedIn: 'root'` option, and injecting into components or other services. Read [creating-services.md](creating-services.md)
- **Defining Dependency Providers**: Automatic vs manual provision, `InjectionToken`, `useClass`, `useValue`, `useFactory`, and scopes. Read [defining-providers.md](defining-providers.md)
- **Injection Context**: Where `inject()` is allowed, `runInInjectionContext`, and `assertInInjectionContext`. Read [injection-context.md](injection-context.md)
- **Hierarchical Injectors**: The `EnvironmentInjector` vs `ElementInjector`, resolution rules, modifiers (`optional`, `skipSelf`), and `providers` vs `viewProviders`. Read [hierarchical-injectors.md](hierarchical-injectors.md)

## Angular Aria

When building accessible custom components for any of the following patterns: Accordion, Listbox, Combobox, Menu, Tabs, Toolbar, Tree, Grid, consult the following reference:

- **Angular Aria Components**: Building headless, accessible components (Accordion, Listbox, Combobox, Menu, Tabs, Toolbar, Tree, Grid) and styling ARIA attributes. Read [angular-aria.md](angular-aria.md)

## Routing

When implementing navigation in Angular, consult the following references:

- **Define Routes**: URL paths, static vs dynamic segments, wildcards, and redirects. Read [define-routes.md](define-routes.md)
- **Route Loading Strategies**: Eager vs lazy loading, and context-aware loading. Read [loading-strategies.md](loading-strategies.md)
- **Show Routes with Outlets**: Using `<router-outlet>`, nested outlets, and named outlets. Read [show-routes-with-outlets.md](show-routes-with-outlets.md)
- **Navigate to Routes**: Declarative navigation with `RouterLink` and programmatic navigation with `Router`. Read [navigate-to-routes.md](navigate-to-routes.md)
- **Control Route Access with Guards**: Implementing `CanActivate`, `CanMatch`, and other guards for security. Read [route-guards.md](route-guards.md)
- **Data Resolvers**: Pre-fetching data before route activation with `ResolveFn`. Read [data-resolvers.md](data-resolvers.md)
- **Router Lifecycle and Events**: Chronological order of navigation events and debugging. Read [router-lifecycle.md](router-lifecycle.md)
- **Rendering Strategies**: CSR, SSG (Prerendering), and SSR with hydration. Read [rendering-strategies.md](rendering-strategies.md)
- **Route Transition Animations**: Enabling and customizing the View Transitions API. Read [route-animations.md](route-animations.md)

If you require deeper documentation or more context, visit the [official Angular Routing guide](https://angular.dev/guide/routing).

## Styling and Animations

When implementing styling and animations in Angular, consult the following references:

- **Using Tailwind CSS with Angular**: Integrating Tailwind CSS into Angular projects. Read [tailwind-css.md](tailwind-css.md)
- **Angular Animations**: Using native CSS (recommended) or the legacy DSL for dynamic effects. Read [angular-animations.md](angular-animations.md)
- **Component Styling**: Best practices for component styles and encapsulation. Read [component-styling.md](component-styling.md)
- **Component Styles (Project)**: BEM, SCSS toolbox, ITCSS, and project-specific styling conventions. Read [component-styles.md](component-styles.md)
- **BEM Reference (Project)**: Detailed BEM syntax, rules, and practical examples with SCSS nesting. Read [bem-reference.md](bem-reference.md)
- **Utility Classes Catalog (Project)**: Complete catalog of project utility CSS classes to reuse before creating new ones. Read [utility-classes.md](utility-classes.md)

## Testing

When writing or updating tests, consult the following references based on the task:

- **Testing Conventions (Project)**: Project-specific rules for logic-only unit tests, faker.js, spies, coverage, and test structure. Read [testing-conventions.md](testing-conventions.md)
- **Fundamentals**: Best practices for unit testing (Vitest), async patterns, and `TestBed`. Read [testing-fundamentals.md](testing-fundamentals.md)
- **Component Harnesses**: Standard patterns for robust component interaction. Read [component-harnesses.md](component-harnesses.md)
- **Router Testing**: Using `RouterTestingHarness` for reliable navigation tests. Read [router-testing.md](router-testing.md)
- **End-to-End (E2E) Testing**: Best practices for E2E tests with Cypress. Read [e2e-testing.md](e2e-testing.md)

## Tooling

When working with Angular tooling, consult the following references:

- **Angular CLI**: Creating applications, generating code (components, routes, services), serving, and building. Read [cli.md](cli.md)
- **Angular MCP Server**: Available tools, configuration, and experimental features. Read [mcp.md](mcp.md)

## Procedure

1. Apply LIFT to locate, identify, and reuse what already exists before creating new structures.
2. Model state with Signals and `computed`.
3. Configure `OnPush` and use `inject()`.
4. Structure the template with native control flow and clear `class` and `style` bindings.
5. If there is general typing or shared contracts, also align with `typescript-standards`.
6. If there are component styles or template class changes, apply [component-styles.md](component-styles.md) and [bem-reference.md](bem-reference.md); check [utility-classes.md](utility-classes.md) before creating new classes.
7. Write RxJS with `pipe` and semantic operators.
8. Use `takeUntilDestroyed` when there are subscriptions.
9. If there are unit tests, follow [testing-conventions.md](testing-conventions.md).
10. Ensure WCAG AA accessibility without exposing a11y as configurable API.

## Quality Checklist

- `.spec.ts` file created when applicable.
- LIFT applied before introducing new structures or duplicating implementations.
- If general typing was changed, `typescript-standards` was followed.
- If `*.spec.ts` was changed, [testing-conventions.md](testing-conventions.md) was followed.
- If component SCSS or template classes were changed, [component-styles.md](component-styles.md) and [bem-reference.md](bem-reference.md) were followed; [utility-classes.md](utility-classes.md) was consulted for existing classes.
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
- For component styles, use [component-styles.md](component-styles.md) and [bem-reference.md](bem-reference.md); consult [utility-classes.md](utility-classes.md) for existing utility classes.
- For logic unit tests, use [testing-conventions.md](testing-conventions.md) and preserve the project's configured test stack.
- For project scripts, respect the stack and scripts already configured in the project.
- For commits, use `git-commit`.
- Harnesses and router testing are complementary references for specific UI and navigation cases.
- `effect` only for simple cases; complex logic belongs in RxJS.
- `resource` is experimental; use with caution.
