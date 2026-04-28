# Types domain modeling

## When to Use

- Modeling entities, value objects, DTOs, commands, events, and domain results.

## Local Rules

- Name types after the domain, not after accidental technical details.
- Separate internal domain types from external transport formats when it reduces ambiguity.
- Use types to express invariants and valid states whenever possible.
- Do not replicate the external API shape as if it were the definitive domain model without necessity.

## Quality Checklist

- Types reflect the real domain.
- Names are semantic.
- There is separation between internal model and external boundary when necessary.
