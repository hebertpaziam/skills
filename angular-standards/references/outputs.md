# Outputs (Signals)

## Regra local

- Preferir `output()`; evitar `@Output()` e `EventEmitter`.

## Output com Signals

```ts
import {Component, output} from '@angular/core';

@Component({
  selector: 'app-slider',
  template: `<button (click)="setValue(50)">Set</button>`,
})
export class Slider {
  valueChanged = output<number>();

  setValue(value: number) {
    this.valueChanged.emit(value);
  }
}
```

## Boas práticas

- Use `camelCase` sem prefixo `on`.
- Evite colidir com eventos nativos (ex: `click`).
