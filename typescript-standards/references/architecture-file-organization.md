# Architecture file organization

## When to Use

- Create new files or reorganize TypeScript modules.

## Local Rules

- Prefer organization by domain or responsibility, not by excessive generic suffixes.
- One contract per file, unless there is strong cohesion.
- Interfaces should exist only in files dedicated to the interface.
- Every interface must have a corresponding generator in a dedicated file.
- The interface generator must follow the same logical hierarchy as the contract within the structure adopted by the project.
- Enums should exist only in files dedicated to the enum.
- There should be only one enum per file.
- The enum file should also contain the label structure for that enum's values.
- Do not scatter micro-files without real readability gain.
- File names should reflect responsibility, not architectural vagueness.

## Quality Checklist

- File structure follows the domain.
- No artificial granularity.
- Interfaces and enums are not embedded in implementation files.
- Interfaces have a corresponding generator in the correct hierarchy.
- Each enum file contains only one enum and its label mapping.
- No vague `manager`, `base`, `common`, or `util` files without strong context.
