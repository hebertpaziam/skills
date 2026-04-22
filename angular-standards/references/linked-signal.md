# linkedSignal

## Quando usar

- Estado derivado que precisa ser manualmente sobrescrito.

## Exemplo

```ts
selected = linkedSignal(() => this.options()[0]);

select(index: number) {
  this.selected.set(this.options()[index]);
}
```

## Regra local

- Nunca usar `effect` para sincronizar sinais.
- Use `computed` quando o estado for somente derivado.
