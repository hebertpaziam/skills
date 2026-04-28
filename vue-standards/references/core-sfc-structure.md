# Core SFC structure

## When to Use

- Creating or reorganizing `*.vue` files.
- Reviewing the internal structure of an SFC component.

## Local Rules

- For new code, prefer `<script setup lang="ts">`.
- Keep a single component per file.
- Prefer a single `<script setup>`; only use a regular `<script>` when there is a real need for module scope or named exports.
- Keep `template` simple and only include `style` when the component actually has its own styles.
- Split components when a file accumulates more than one relevant visual or behavioral concern.

## Recommended Order

1. `<script setup lang="ts">`
2. `<template>`
3. `<style>`

## Suggested Script Structure

1. imports
2. local types
3. `defineOptions`, `defineProps`, `defineEmits`, `defineModel`, `defineSlots`
4. injects and template refs
5. local state (`ref`, `reactive`, `shallowRef`)
6. derived state (`computed`)
7. composables
8. watchers and effects
9. handlers and helper functions
10. exposes when truly necessary

## Quality Checklist

- File has a single responsibility and a coherent name.
- No unnecessary mixing of Options API and Composition API.
- No accidental exports or side effects in the SFC.
- Template, script, and style aligned with the actual scope of the component.
