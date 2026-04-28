# Types enums

## When to Use

- Modeling closed sets of named values when an enum truly is the best choice.

## Local Rules

- Enums must live in dedicated enum files.
- There must be only one enum per file.
- Do not declare an enum inside implementation, service, helper, component, composable, store, or similar files.
- Every enum must have a mapping structure in the same file that exposes the labels of its values.
- Before creating an enum, evaluate whether a literal union type would solve it more simply.
- Use an enum only when it brings real clarity, interoperability, or better semantics than literal unions.

## Example

```ts
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'Active',
  [UserStatus.INACTIVE]: 'Inactive',
};
```

## Quality Checklist

- The enum exists for a real semantic reason.
- The enum lives in a dedicated file.
- There is only one enum in the file.
- A label mapping structure for the enum values exists in the same file.
- A simpler alternative with a union type was considered.
