# Architecture API design

## When to Use

- Define public functions, factories, builders, adapters, or modules consumed by other parts of the system.

## Local Rules

- Public APIs should be small, semantic, and hard to misuse.
- Name functions and arguments after the domain.
- Prefer clear parameters over giant configuration objects when the case is simple.
- Introduce an options object only when there is real complexity and cohesion among parameters.

## Quality Checklist

- API is readable and predictable.
- Low chance of misuse.
- No inflated public surface.
