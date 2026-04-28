---
name: typescript-standards
description: 'Apply TypeScript design standards when creating or refactoring functions, methods, classes, modules, or shared contracts (interfaces, types, enums). Trigger for: typing decisions, domain modeling, architecture design (boundaries, DI, composition, API design), and design principles (SOLID, GoF, KISS, YAGNI, LIFT). Do NOT trigger for routine component edits already covered by framework-specific skills (angular-standards, vue-standards).'
---

# TypeScript Standards

## When to Use

- Creating or refactoring TypeScript files in the project.
- Defining interfaces, types, shared contracts, and module boundaries.
- Modeling domain, results, errors, collections, and public APIs.
- Making design and architecture decisions that are not specific to a framework.

## Goal

- Maintain strong, predictable, and readable typing.
- Preserve simplicity, cohesion, and healthy code evolution.
- Concentrate detailed rules in local references to avoid duplication and maintain clear precedence.
- Apply design principles pragmatically, without overengineering.

## LIFT Principle

Before creating any new type, helper, module, class, adapter, factory, port, or abstraction, apply the LIFT principle:

- **Locate**: Find existing contracts, types, helpers, patterns, modules, and references.
- **Identify**: Determine what already solves part of the problem and where there is real or potential duplication.
- **Find**: Find the smallest coherent point of reuse, extension, or composition before introducing something new.
- **Try to be DRY**: Eliminate real duplication without creating premature abstractions, overly generic layers, or opaque structures.

## Integration with Other Skills

- This skill is cross-cutting and language-level: frameworks like Angular and Vue should continue dictating framework-specific architecture.
- `typescript-standards` defines modeling, contracts, module design, boundary validation, and pragmatic design in TypeScript.
- In case of conflict, the framework skill prevails for ecosystem-specific organization and `typescript-standards` prevails for general language and design rules.

## Main Rules

- Apply LIFT before introducing new types, modules, classes, helpers, adapters, factories, or patterns.
- Never use `any`; when the type is uncertain, use `unknown`.
- Interfaces must start with `I`.
- Do not create interfaces inside files that are not dedicated to the interface.
- Every interface must have a corresponding generator using `faker.js`.
- The interface generator must live in a dedicated file and respect the folder hierarchy adopted by the project.
- The generator must create or receive a single random seed per execution and derive all contract data from it.
- Do not create enums inside files that are not dedicated to the enum.
- Keep only one enum per file.
- Every enum must have in the same file a mapping structure for its value labels.
- Prefer functions and modules over classes.
- Prefer composition over inheritance.
- Apply KISS, YAGNI, and SoC by default.
- Treat SOLID as pragmatic heuristics, not as a dogmatic checklist.
- Treat Object Calisthenics as optional design pressure, not as law.
- Use GoF patterns only when there is real pressure for change, repetition, or decoupling.
- Prefer `Record` over `Map` when object keys are sufficient.
- Use `Map` only when its specific API or support for non-serializable keys is truly needed.
- Prefer one contract per file, unless the types are strongly related.
- Before introducing new types, check if an equivalent contract already exists in the domain.
- Validate runtime boundaries when data enters from outside the system.
- Use single quotes and semicolons.

## Procedure

1. Apply LIFT before creating new types, modules, or abstractions.
2. Identify the contracts, types, and boundaries truly needed for the change.
3. If there is an interface, also plan the corresponding generator in the correct project hierarchy.
4. Reuse existing types before creating new ones.
5. Model with the most restrictive, clear, and simple option possible.
6. If there is uncertainty, use `unknown` and perform explicit narrowing.
7. Choose between function, module, object, or class based on the real need for state, identity, lifecycle, or polymorphism.
8. If considering a GoF pattern, first check if simple composition solves the case.
9. Review the result with KISS, YAGNI, SoC, and domain readability.

## Quality Checklist

- LIFT applied before introducing new structures.
- No `any` was introduced.
- Interfaces follow the `I` prefix.
- Interfaces live in dedicated files.
- Interfaces have a corresponding generator.
- The interface generator uses `faker.js`.
- The interface generator respects the project's folder hierarchy.
- The interface generator uses a single random seed per execution.
- Enums live in dedicated files.
- Only one enum per file.
- Every enum has a label mapping structure in the same file.
- The simplest solution that meets the case was preferred.
- No speculative abstraction.
- `Record` was preferred when sufficient.
- `Map` was only used with real technical justification.
- External boundaries were treated with proper validation when needed.
- The file uses single quotes and semicolons.
- No unnecessary proliferation of types, classes, or patterns.

## Notes

- This skill does not require object-oriented design as default; in TypeScript, functions, modules, and composition are usually the best starting point.
- SOLID, GoF, and Object Calisthenics exist here to improve design and maintainability, not to justify extra complexity.
- When the framework skill defines a specific structure, follow the framework and apply this skill at the language and design layer.

## Typing Decisions

Consult when defining interfaces, types, enums, generics, or modeling domain contracts.

- Interface vs type: [references/types-interface-vs-type.md](references/types-interface-vs-type.md)
- Interface generators: [references/types-interface-generators.md](references/types-interface-generators.md)
- Enums: [references/types-enums.md](references/types-enums.md)
- Domain modeling: [references/types-domain-modeling.md](references/types-domain-modeling.md)
- Generics: [references/types-generics.md](references/types-generics.md)
- Utility types: [references/types-utility-types.md](references/types-utility-types.md)
- Unions vs class hierarchies: [references/types-unions-vs-class-hierarchies.md](references/types-unions-vs-class-hierarchies.md)
- Narrowing and unknown: [references/types-narrowing-and-unknown.md](references/types-narrowing-and-unknown.md)
- Readonly and immutability: [references/types-readonly-and-immutability.md](references/types-readonly-and-immutability.md)
- Record vs Map: [references/types-record-vs-map.md](references/types-record-vs-map.md)
- Errors and result shapes: [references/types-errors-and-result-shapes.md](references/types-errors-and-result-shapes.md)
- Runtime validation: [references/types-runtime-validation.md](references/types-runtime-validation.md)

## Architecture and Module Design

Consult when designing functions, classes, modules, boundaries, or API surfaces.

- Functions vs classes: [references/architecture-functions-vs-classes.md](references/architecture-functions-vs-classes.md)
- Modules and boundaries: [references/architecture-modules-and-boundaries.md](references/architecture-modules-and-boundaries.md)
- DI and composition: [references/architecture-dependency-injection-and-composition.md](references/architecture-dependency-injection-and-composition.md)
- Side effects and ports: [references/architecture-side-effects-and-ports.md](references/architecture-side-effects-and-ports.md)
- API design: [references/architecture-api-design.md](references/architecture-api-design.md)
- File organization: [references/architecture-file-organization.md](references/architecture-file-organization.md)

## Design Principles

Consult when making structural or design decisions that affect maintainability.

- LIFT: [references/principles-lift.md](references/principles-lift.md)
- SOLID: [references/principles-solid.md](references/principles-solid.md)
- KISS and YAGNI: [references/principles-kiss-yagni.md](references/principles-kiss-yagni.md)
- Separation of Concerns: [references/principles-separation-of-concerns.md](references/principles-separation-of-concerns.md)
- Object Calisthenics: [references/principles-object-calisthenics.md](references/principles-object-calisthenics.md)

## Design Patterns

Consult only when there is real pressure for change, repetition, or decoupling.

- Patterns overview: [references/patterns-overview.md](references/patterns-overview.md)
- Creational: [references/patterns-creational.md](references/patterns-creational.md)
- Structural: [references/patterns-structural.md](references/patterns-structural.md)
- Behavioral: [references/patterns-behavioral.md](references/patterns-behavioral.md)
- When not to use patterns: [references/patterns-when-not-to-use.md](references/patterns-when-not-to-use.md)

## Pragmatic Design

Consult when evaluating duplication, abstraction trade-offs, or refactoring triggers.

- Duplication vs abstraction: [references/pragmatic-duplication-vs-abstraction.md](references/pragmatic-duplication-vs-abstraction.md)
- Refactoring triggers: [references/pragmatic-refactoring-triggers.md](references/pragmatic-refactoring-triggers.md)
