# Component Styles (SCSS, BEM + Toolbox)

## When to Use

- Creating or updating SCSS styles for Angular components.
- Refactoring styles to standardize BEM with strict nesting.
- Adjusting template classes alongside the component stylesheet.
- Cleaning up unused rules based on the component's current HTML.

## Goal

- Standardize component stylesheets with BEM, strict nesting, and low coupling between block, elements, and modifiers.
- Ensure adherence to the styling stack already configured in the project, including `toolbox`, tokens, variables, and organizational conventions.
- Maintain structural alignment between HTML and SCSS.
- Limit nesting to a maximum of 4 levels deep.
- Restrict cleanup to the component scope without altering global structures unnecessarily.

## Local Rules

- Every SCSS file must start with `@use 'toolbox' as *;`.
- Apply BEM with strict nesting: `&__element` and `&--modifier` inside the root block.
- Identify one main block per component whenever possible.
- Keep nesting to a maximum of 4 levels deep.
- Use system tokens, variables, and CSS custom properties; avoid hardcoded values.
- Respect the existing ITCSS structure and insert new rules in the correct layer.
- Prefer `@extend` over `@include` when both approaches are semantically equivalent.
- Create styles only for classes present in the current template.
- Remove unused styles based on the component's HTML.
- Do not remove or restructure global styles, tokens, mixins, functions, or shared layers without explicit need.
- Avoid loose selectors outside the main block; keep scope predictable.
- If a global selector is unavoidable, document the reason and minimize its reach.

## Procedure

1. Open the component's SCSS file and ensure `@use 'toolbox' as *;` is at the top.
2. Identify the component's main BEM block.
3. Convert elements to `&__element` and modifiers to `&--modifier`.
4. Review the template to ensure exact correspondence between HTML classes and SCSS selectors.
5. Replace hardcoded values with existing tokens, variables, or CSS custom properties.
6. Remove unused rules and avoid adding selectors outside the block.
7. If a style is missing, place the rule in the correct ITCSS layer already adopted by the project.
8. Review nesting depth, specificity, and actual markup coverage.

## Quality Checklist

- `@use 'toolbox' as *;` present at the top of the file.
- BEM applied with strict nesting.
- Maximum 4 levels of nesting.
- No hardcoded values when a token or variable equivalent exists.
- ITCSS respected.
- `@extend` prioritized when appropriate.
- No orphan classes between HTML and SCSS.
- No dead styles in the component file.
- No unintended changes to global styles.
- Selector scope predictable and centered on the block.

## Example

```scss
@use 'toolbox' as *;

.product {
  display: grid;
  gap: $spacing-3;

  &__name {
    font: $font-body;
  }

  &--featured {
    border: 1px solid $color-brand;
  }
}
```
