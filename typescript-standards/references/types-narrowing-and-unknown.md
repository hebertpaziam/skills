# Types narrowing and unknown

## When to Use

- Receive uncertain data, parse external inputs or deal with dynamic APIs.

## Local Rules

- Use `unknown` as the type for uncertain input.
- Perform explicit narrowing with guards, predicates or validation.
- Do not use `as` to skip verification when uncertainty still exists.

## Example

```ts
function isUser(value: unknown): value is IUser {
  return typeof value === 'object' && value !== null && 'id' in value;
}
```

## Quality Checklist

- No `any` introduced.
- Explicit narrowing before use.
- Unsafe casts avoided.
