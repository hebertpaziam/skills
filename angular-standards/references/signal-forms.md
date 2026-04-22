# Signal forms

## Regra local

- Preferir Signal Forms em Angular 21+.
- Não usar null/undefined como valor inicial.

## Exemplo

```ts
userModel = signal({
  name: '',
  age: 0,
  tags: [] as string[],
});

userForm = form(this.userModel, (schemaPath) => {
  required(schemaPath.name);
});
```

## Binding

- Use `[formField]`.
- Não setar `min`, `max`, `value`, `disabled` manualmente no template.

## Quando evitar

- Se o projeto já usa forms legadas e a migração não for parte do escopo.
