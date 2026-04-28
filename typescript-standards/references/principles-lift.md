# Principles LIFT

## When to Use

- Before creating a new type, helper, module, class, adapter, factory, or abstraction.

## Local Rules

- `Locate`: locate existing contracts, types, helpers, patterns, and modules.
- `Identify`: identify what already solves part of the problem and where duplication is emerging.
- `Find`: find the smallest coherent point of reuse, extension, or composition.
- `Try to be DRY`: try to remove real duplication without introducing over-engineering.

## Quality Checklist

- Existing code was reviewed before creating something new.
- The duplication addressed was real, not hypothetical.
- The new abstraction did not increase opacity unnecessarily.
