# Types interface generators

## When to Use

- Creating a new interface.
- Updating an existing interface.
- Generating mock, fixture, or test data for TypeScript contracts.

## Local Rules

- Every interface must have a corresponding generator.
- The generator must use `faker.js`.
- The generator must live in a dedicated generator file.
- The generator must respect the folder hierarchy adopted by the project for the corresponding interface.
- If the project centralizes generators in a separate tree, mirror the same logical hierarchy of the interface in that tree.
- The generator must create or receive a single random `seed` per execution.
- All fields generated for the interface must derive from that same `seed`.
- Do not generate a `seed` per field, per nested object, or per isolated call within the same data tree.
- When the generator composes other generators, share the same seeded context across the entire tree.
- The generator must fill at least all required fields of the interface.
- Overrides are acceptable when they simplify usage without breaking the base contract.

## Example structure

- `src/domain/user/user.interface.ts`
- `src/domain/user/user.generator.ts`
- `src/domain/user/user.interface.ts`
- `src/mock/generators/domain/user/user.generator.ts`

## Quality Checklist

- The interface has a corresponding generator.
- The generator uses `faker.js`.
- The generator is in a dedicated file.
- The generator respects the project's folder hierarchy.
- A single random `seed` is used per execution.
- All contract data derives from the same `seed`.
- The generator covers the required fields of the interface.
