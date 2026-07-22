# Types interface vs type

## When to Use

- Choosing between `interface` and `type` for shared contracts.

## Local Rules

- Preserve the repository convention: interfaces must start with `I`.
- Interfaces must live in dedicated interface files.
- Every interface must have a corresponding generator; see [types-interface-generators.md](types-interface-generators.md).
- Use `interface` for object contracts and stable public surfaces.
- Use `type` for unions, utility aliases, type composition, and more expressive modeling.
- Do not create a redundant interface or type when a direct alias is sufficient.
- Do not declare an interface inside implementation, service, helper, component, composable, store, or similar files.

## Quality Checklist

- The choice between `interface` and `type` was made based on the nature of the contract.
- Interfaces follow the `I` prefix.
- Interfaces live in dedicated files.
- Interfaces have a corresponding generator.
