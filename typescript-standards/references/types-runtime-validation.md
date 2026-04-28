# Types runtime validation

## When to Use

- Consume data from APIs, storage, environment, query strings, queues or any external boundary.

## Local Rules

- TypeScript types do not replace runtime validation.
- Validate at input boundaries and convert to safe internal shapes.
- Prefer centralizing boundary validation in dedicated adapters or parsers.
- Do not spread partial parsing and inconsistent checks throughout the system.

## Example

```ts
function parseUser(input: unknown): IUser {
  if (typeof input !== 'object' || input === null || !('id' in input)) {
    throw new Error('Invalid user payload');
  }

  return { id: String((input as { id: unknown }).id) } as IUser;
}
```

## Quality Checklist

- External boundaries were validated.
- The system does not assume external data is already correct just because the type exists.
