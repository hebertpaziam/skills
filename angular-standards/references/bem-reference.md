# BEM Reference Guide — SCSS Nested Syntax

## Convention

This project adopts **BEM (Block-Element-Modifier)** with **SCSS nested syntax** as mandatory for new components and recommended for refactoring.

---

## Standard Syntax

```scss
.block-name {
  // block styles

  &__element-name {
    // element styles

    &--modifier-name {
      // element modifier styles
    }
  }

  &--modifier-name {
    // block modifier styles
  }
}
```

---

## Practical Examples

### Block

A block represents an independent component. The name uses **kebab-case** and should match the Angular component selector.

```scss
// Component: app-beneficiary-form → block: .beneficiary-form
.beneficiary-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

### Element

Elements are internal parts of the block, separated by `__`. They use **kebab-case**.

```scss
.beneficiary-form {
  &__header {
    font-size: 1.25rem;
    font-weight: 600;
  }

  &__field-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  &__submit-button {
    align-self: flex-end;
  }
}
```

### Modifier

Modifiers represent variations or states. Separated by `--`, they use **kebab-case**.

```scss
.beneficiary-form {
  &--compact {
    gap: 8px;
  }

  &__header {
    &--highlighted {
      color: var(--primary-color);
      border-bottom: 2px solid currentColor;
    }
  }

  &__submit-button {
    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}
```

### Complete Example

```scss
.family-member-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;

  &--selected {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;

    &--placeholder {
      background-color: #f0f0f0;
    }
  }

  &__name {
    font-weight: 600;
    margin-top: 8px;
  }

  &__relationship {
    font-size: 0.875rem;
    color: #666;
  }

  &__actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }
}
```

---

## Rules

### 1. No nested elements

BEM **does not allow** elements inside elements. Always reference the block directly.

```scss
// WRONG — element of an element
.card {
  &__header {
    &__title {} // ❌ Produces .card__header__title
  }
}

// CORRECT — elements are direct children of the block
.card {
  &__header {}
  &__header-title {} // ✓ Compound element name
}
```

### 2. No tag selectors in components

Angular components **must not** use tag selectors in SCSS. All styling must be done via BEM classes.

```scss
// WRONG
h1 { font-size: 2rem; }
p { margin-bottom: 16px; }

// CORRECT
.my-component {
  &__title { font-size: 2rem; }
  &__description { margin-bottom: 16px; }
}
```

### 3. No inline `style` in templates

Do not use `style="..."`, `[style.prop]` or `[ngStyle]` in HTML templates. Replace with BEM or utility classes.

```html
<!-- WRONG -->
<div style="margin-top: 16px; color: red;">...</div>
<div [style.margin-top.px]="16">...</div>

<!-- CORRECT -->
<div class="my-component__section my-component__section--highlighted">...</div>
```

### 4. Reuse existing classes before creating new ones

Before creating a new class, consult:
- `5-objects/_utilities.scss` — generic utility classes
- `5-objects/_grid.scss` — layout and grid
- `5-objects/_buttons.scss` — buttons
- `5-objects/_forms.scss` — forms
- Catalog at `utility-classes.md`

### 5. kebab-case naming

Blocks and elements use **kebab-case**. Never camelCase or PascalCase.

```scss
// WRONG
.beneficiaryForm {}
.BeneficiaryForm {}

// CORRECT
.beneficiary-form {}
```

### 6. Flat syntax is acceptable for simple cases

For simple selectors without nesting, flat syntax is acceptable:

```scss
// Acceptable for simple cases
.alert {}
.alert--success {}
.alert__icon {}
```

---

## Angular Mapping

| Angular Selector | BEM Block Name |
|---|---|
| `app-beneficiary-form` | `.beneficiary-form` |
| `app-family-member-card` | `.family-member-card` |
| `app-modal-assinatura` | `.modal-assinatura` |

---

## References

- [BEM Methodology](https://en.bem.info/methodology/)
- [CSS Guidelines — BEM](https://cssguidelin.es/#bem-like-naming)
