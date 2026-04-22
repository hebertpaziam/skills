# Host elements

## Regra local

- Preferir a chave `host` no `@Component`.
- Evitar `@HostBinding` e `@HostListener` em novos recursos.

## Exemplo

```ts
@Component({
  selector: 'app-chip',
  host: {
    'role': 'status',
    '[attr.aria-live]': 'live()',
    '[class.active]': 'active()',
  },
})
export class Chip {
  live = signal('polite');
  active = signal(false);
}
```

## Acessibilidade

- Não exponha inputs para `aria-*` como API configurável.
- Prefira semântica interna e comportamento acessível auto-contido.
