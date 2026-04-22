# effects

## Regra local

- Effects devem ser simples e de escopo reduzido.
- Não usar effects para sincronizar estado.
- Lógica complexa e API devem ficar em RxJS (services).

## Uso válido

- Logging, analytics, sync com localStorage.

```ts
effect((onCleanup) => {
  const current = this.count();
  saveToStorage(current);
  onCleanup(() => cleanup());
});
```
