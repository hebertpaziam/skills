# Utility Classes Catalog

> Consult this catalog before creating new classes or using inline styles.
> File location: `sources/libs/ui/src/styles/5-objects/`

---

## Naming Convention

- **Generic utilities:** prefix `u-` (e.g. `u-text-center`, `u-mt-16`)
- **Reusable components:** standard BEM (e.g. `.painel`, `.btn-primary`)
- **Bootstrap classes (grid):** kept without prefix (e.g. `.col`, `.row`, `.d-flex`)

---

## Layout (`_grid.scss`)

| Class | Description |
|-------|-------------|
| `.container` | Responsive container with max-width per breakpoint |
| `.container-fluid` | Full-width container |
| `.row` | Flex row for grid |
| `.col`, `.col-{1-12}` | Grid columns |
| `.col-sm-*`, `.col-md-*`, `.col-lg-*`, `.col-xl-*` | Responsive columns |
| `.g-{0-5}`, `.gx-*`, `.gy-*` | Gutters (gap between columns) |
| `.d-flex` | `display: flex` |
| `.d-inline-flex` | `display: inline-flex` |
| `.d-none` | `display: none` |
| `.d-block` | `display: block` |
| `.d-inline-block` | `display: inline-block` |
| `.flex-column` | `flex-direction: column` |
| `.flex-row` | `flex-direction: row` |
| `.justify-content-center` | `justify-content: center` |
| `.justify-content-between` | `justify-content: space-between` |
| `.justify-content-end` | `justify-content: flex-end` |
| `.align-items-center` | `align-items: center` |
| `.align-items-end` | `align-items: flex-end` |
| `.align-self-center` | `align-self: center` |
| `.text-center` | `text-align: center` |
| `.text-end` | `text-align: end` |
| `.text-start` | `text-align: start` |

### Spacing (Bootstrap)

| Class | Description |
|-------|-------------|
| `.m-{0-5}` | Margin (all sides) |
| `.mt-{0-5}` | Margin top |
| `.mb-{0-5}` | Margin bottom |
| `.ms-{0-5}` | Margin start (left) |
| `.me-{0-5}` | Margin end (right) |
| `.mx-{0-5}` | Margin horizontal |
| `.my-{0-5}` | Margin vertical |
| `.p-{0-5}` | Padding (all sides) |
| `.pt-{0-5}` | Padding top |
| `.pb-{0-5}` | Padding bottom |
| `.ps-{0-5}` | Padding start |
| `.pe-{0-5}` | Padding end |
| `.px-{0-5}` | Padding horizontal |
| `.py-{0-5}` | Padding vertical |

> Bootstrap scale: 0=0, 1=0.25rem, 2=0.5rem, 3=1rem, 4=1.5rem, 5=3rem

### Width

| Class | Description |
|-------|-------------|
| `.w-100` | `width: 100%` |

---

## Buttons (`_buttons.scss`)

| Class | Description |
|-------|-------------|
| `.btn-primary` | Primary button (red background, white text) |
| `.btn-secundary` | Secondary button (red border, white background) |
| `.btn-outline` | Outline button |
| `.btn-ghost` | Ghost button (no border/background) |

---

## Forms (`_forms.scss`)

| Class | Description |
|-------|-------------|
| `.mfc-standard-select` | Project standard select |
| `.mfc-standard-select__label` | Select label |
| `.mfc-standard-input` | Standard input |
| `.mfc-standard-date__calendar` | Date input |
| `.horizontal-row` | Horizontal divider line |

---

## Utility Components (`_utilities.scss`)

| Class | Description |
|-------|-------------|
| `.container` | Gray background (`#f9fafb`) |
| `.painel` | Card with border, padding 32px, border-radius 8px |
| `.title-painel-1` | Title 28px bold (inside `.painel`) |
| `.title-painel-2` | Title 24px bold (inside `.painel`) |
| `.title-painel-3` | Title 20px bold (inside `.painel`) |
| `.painel-line-divider` | Gray horizontal divider |
| `.subtitle-painel-1` | Subtitle 16px (inside `.painel`) |
| `.radio-label` | Radio label (black) |
| `.radio-label-check` | Selected radio label (blue) |
| `.mult-line-text` | Styled textarea |
| `.tag-info` | Informational tag/badge |
| `.section-form-title` | Section title 20px |
| `.tooltip` | Tooltip container |
| `.rounded-checkbox` | Custom circular checkbox |
| `.w-100` | `width: 100%` |
| `.dps-summary__*` | DPS summary components |

---

## Overlay (`_cdk-overlay.scss`)

| Class | Description |
|-------|-------------|
| `.cdk-overlay-container` | Angular CDK overlay container |

---

## New Utility Classes (to be added to `_utilities.scss`)

The following classes will be created to replace inline styles:

| Class | CSS | Justification |
|-------|-----|---------------|
| `.u-text-center` | `text-align: center` | Replace `style="text-align: center"` |
| `.u-text-end` | `text-align: end` | Replace `style="text-align: end"` |
| `.u-text-start` | `text-align: start` | Replace `style="text-align: start"` |
| `.u-gap-6` | `gap: 6px` | Replace `style="gap: 6px"` |
| `.u-gap-8` | `gap: 8px` | Replace `style="gap: 8px"` |
| `.u-mt-16` | `margin-top: 16px` | Replace `style="margin-top: 16px"` |
| `.u-align-self-center` | `align-self: center` | Replace `style="align-self: center"` |
| `.u-cursor-pointer` | `cursor: pointer` | Replace `style="cursor: pointer"` |
| `.u-justify-between` | `justify-content: space-between` | Replace `style="justify-content: space-between"` |
| `.u-justify-end` | `justify-content: flex-end` | Replace `style="justify-content: right"` |
| `.u-flex-row` | `flex-direction: row` | Replace `style="flex-direction: row"` |
| `.u-uppercase` | `text-transform: uppercase` | Replace `style="text-transform: uppercase"` |

> **Note:** Check whether Bootstrap classes (`text-center`, `text-end`, `align-self-center`, etc.) are already available in the copied grid before creating equivalent `u-*` classes.
