# Inputs (Signals)

## Regra local

- Preferir `input()` e `model()`; evitar `@Input()`.
- Sem getters/setters; usar `computed`.

## Input com Signals

```ts
import {Component, input, computed} from '@angular/core';

@Component({
  selector: 'app-user',
  template: `{{ label() }}`,
})
export class User {
  name = input('Guest');
  age = input.required<number>();

  label = computed(() => `${this.name()} (${this.age()})`);
}
```

## Model (two-way)

```ts
import {Component, model} from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `<button (click)="inc()">+</button>`,
})
export class Counter {
  value = model(0);

  inc() {
    this.value.update((v) => v + 1);
  }
}
```

## Boas práticas

- Use `input.required()` para entradas obrigatórias.
- Evite nomes que colidam com DOM (ex: `title`).
- Transformações devem ser puras.
