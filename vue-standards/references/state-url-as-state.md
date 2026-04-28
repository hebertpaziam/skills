# State URL as state

## When to Use

- Model search, filters, sorting, pagination, tabs, or selections that need to survive reload, sharing, or navigation.

## Local Rules

- Move to the URL any state that needs to be shareable, restorable, or deep-linkable.
- Do not move purely ephemeral and local UI state to the URL without a real benefit.
- Centralize parsing, serialization, and defaults of query params.
- Keep param types and naming predictable and stable.

## Quality Checklist

- URL-driven state actually provides value.
- No opaque or inconsistent query params.
- Parsing and serialization are controlled.
