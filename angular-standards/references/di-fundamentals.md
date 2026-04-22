# DI fundamentals

## Regra local

- Services para lógica e integração; componentes devem ficar simples.

## Exemplo

```ts
@Injectable({ providedIn: 'root' })
export class Logger {
  log(message: string) {
    console.log(message);
  }
}

@Component({
  selector: 'app-nav',
  template: '',
})
export class Nav {
  private logger = inject(Logger);
}
```
