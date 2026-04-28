# Security

## When to Use

- Reviewing dynamic content rendering, URL bindings, HTML, and potentially insecure integrations.

## Main Rule

- Never use untrusted content as a Vue template.

## Local Rules

- Avoid `v-html`; use it only when the HTML is trusted or properly sanitized outside the component.
- User URLs must be validated and sanitized at the appropriate boundary, ideally on the backend.
- Do not allow arbitrary user JS or CSS without a real sandbox.
- Never mount Vue on server-rendered HTML that may contain untrusted content interpretable as a template.
- In SSR, be extra careful with universal code and execution boundaries.

## Quality Checklist

- No untrusted templates.
- `v-html` justified and controlled.
- URLs and dynamic content handled securely.
