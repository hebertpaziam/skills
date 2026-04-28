# Forms validation

## When to Use

- Validate forms and fields in Vue components or flows.

## Local Rules

- Reuse the library, schema validator, or validation strategy already adopted in the project.
- Separate form state, validation rules, and visual error presentation.
- Errors should be displayed accessibly and connected to the field.
- Synchronous and asynchronous validation should have observable and predictable states.
- Do not couple the component to a specific library if the project already abstracts this in composables or helpers.

## Quality Checklist

- Project's validation stack respected.
- Accessible errors.
- No unnecessary duplication of rules.
