# Accessibility

## When to Use

- Creating or refactoring components, layouts, forms, and navigation flows.

## Local Rules

- Maintain a WCAG AA baseline.
- Prefer semantic HTML before resorting to ARIA.
- Structure headings, landmarks, and focus order predictably.
- Forms must use `label`, connected descriptions, and accessible error messages.
- In router navigation, ensure focus and context restoration when the UX requires it.
- Do not hide essential information only in placeholders.
- Do not use `aria-hidden` on focusable elements.

## Quality Checklist

- Correct semantics.
- Viable keyboard navigation.
- Connected labels and descriptions.
- Focus handled deliberately.
