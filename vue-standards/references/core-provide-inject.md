# Core provide inject

## When to Use

- Sharing dependencies across tree depth.
- Implementing group context, form containers, themes, or plugin-like resources.

## Local Rules

- Prefer props and emits for simple local flows.
- Use `provide` and `inject` when the cost of prop drilling is real and the dependency is structural.
- Type injection keys with `InjectionKey`.
- Centralize keys in a dedicated file when reused by more than one component.
- Avoid using `inject` to hide diffuse business dependencies.

## Quality Checklist

- `provide/inject` used only for legitimate structural context.
- Typed keys.
- Dependencies remain traceable.
