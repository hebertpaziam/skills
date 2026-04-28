# Core script setup

## When to Use

- Creating or modifying Vue 3 components with SFC.
- Reviewing usage of macros, bindings, and component scope.
- Standardize `<script setup>` as the ergonomic and performant default for Vue 3.
- Leverage type inference and reduce boilerplate.

## Local Rules

- For new code, use `<script setup lang="ts">`.
- Treat top-level bindings as the template's internal API.
- Use `defineOptions` for `inheritAttrs` and metadata that truly need to be declared.
- Use `defineExpose` sparingly; components should be closed by default.
- `useAttrs()` and `useSlots()` should be rare and only used when composition truly requires them.
- Avoid combining `<script setup>` with a regular `<script>` without a concrete technical need.
- `top-level await` should only be used when the project and architecture support the resulting flow.

## Quality Checklist

- `lang="ts"` present in new code.
- No unnecessary parallel `<script>` usage.
- Macros used explicitly and concisely.
- No top-level binding accidentally exposed to the template without need.
