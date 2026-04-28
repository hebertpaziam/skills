# Composables design

## When to Use

- Creating reusable logic with state, lifecycle, or reactive integration.

## Local Rules

- Name composables with the `use` prefix.
- A composable should encapsulate a coherent concern, not a grab bag of utilities.
- Accept plain values, refs, or getters when it improves the public ergonomics.
- Return a plain object with refs and functions, not an aggregated `reactive`.
- If the composable depends on lifecycle or `inject`, it must be called in `setup` or `<script setup>`.

## Internal Design

- Clearly separate state, derivation, effects, and public API.
- Reuse other composables before duplicating behavior.
- Keep effects with predictable cleanup.

## Quality Checklist

- Name starts with `use`.
- Single responsibility.
- Small public API.
- Return with clear refs and functions.
