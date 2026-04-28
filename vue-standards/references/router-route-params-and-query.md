# Router route params and query

## When to Use

- Read or write params and query string.

## Local Rules

- Treat params and query as the screen's external contract.
- Normalize types and defaults before spreading usage across the component.
- Prefer `computed` with getter/setter or a dedicated composable when bidirectional sync with the URL is needed.
- Do not couple the rest of the screen to repeated manual parsing.

## Quality Checklist

- Centralized parsing.
- Clear defaults.
- Route state treated as source of truth when appropriate.
