# Template class and style bindings

## When to Use

- Declaring dynamic classes and styles in the template.

## Local Rules

- Prefer simple bindings with expressive names and minimal inline branching.
- When class logic grows, derive it in the script with `computed`.
- Use `style` binding only for legitimate runtime variations; structural styling should remain in the stylesheet.
- Do not use a large style object as a shortcut to bypass the project's styling stack.

## Quality Checklist

- Template has no excessive class logic.
- Structural styling remains outside the template.
- Classes and styles express observable state, not accidental detail.
