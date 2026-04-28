# Architecture modules and boundaries

## When to Use

- Organize files, modules and external integration points.

## Local Rules

- Each module should have a comprehensible responsibility.
- Separate domain, external boundary, parsing, persistence and side effects when doing so reduces coupling.
- Do not let the domain module depend directly on transport or IO details if that compromises testing and evolution.
- Prefer simple and direct imports over circular dependency meshes.

## Quality Checklist

- Module boundaries are clear.
- Dependencies point in the correct direction.
- No excessive mixing of concerns.
