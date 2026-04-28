# Principles SOLID

## When to Use

- Evaluate the design of types, modules, classes, services, and dependency boundaries.

## Local Rules

- Use `SOLID` as a pragmatic heuristic, not as law.
- `SRP`: keep types, modules, and classes with a single coherent responsibility.
- `OCP`: extract extensibility when there is real variation pressure, not out of speculation.
- `LSP`: do not model inheritance when real substitutability is not guaranteed.
- `ISP`: prefer small, focused contracts over bloated interfaces.
- `DIP`: depend on contracts and clear boundaries when decoupling brings real value.

## Pragmatic Note

- In TypeScript, many design needs are better solved with functions, modules, unions, and composition than with classical hierarchies.

## Quality Checklist

- `SOLID` improved the clarity and evolution of the design.
- No principle was used to justify unnecessary complexity.
