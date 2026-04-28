# Component styles

## When to Use

- Create or update local styles for Vue components.
- Maintain cohesion between the component's template and styles.
- Respect the styling stack, design tokens, conventions, and utilities already adopted by the project.
- Avoid style leakage and unpredictable selectors.

## Local Rules

- Follow the styling strategy already configured in the project: CSS Modules, scoped CSS, utility classes, SCSS, design system, or another existing stack.
- Do not introduce a parallel styling stack without a real need.
- Keep alignment between classes used in the template and rules actually needed in the stylesheet.
- Avoid accidental selectors, excessive depth, and dead styles.
- Use existing tokens, CSS variables, and conventions instead of loose values when the project provides them.

## Quality Checklist

- Project's styling stack respected.
- No dead styles.
- No fragile selectors or unpredictable scope.
- Template and stylesheet aligned.
