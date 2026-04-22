# Signals overview

## Regra local

- Signals para qualquer estado em componentes.
- Evitar getters/setters; usar `computed`.

## Writable signal

```ts
const count = signal(0);
count.set(1);
count.update((v) => v + 1);
```

## Readonly

```ts
private readonly _state = signal<State>({/* ... */});
readonly state = this._state.asReadonly();
```

## Computed

```ts
const doubleCount = computed(() => count() * 2);
```

## Untracked

```ts
effect(() => {
  const current = untracked(count);
  log(current);
});
```

## Observações

- Leituras após `await` não são rastreadas; leia sinais antes de async.
- Evite usar `effect` para sincronizar estado (use `computed`/`linkedSignal`).
