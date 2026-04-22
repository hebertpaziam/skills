# Creating services

## Regra local

- Services para lógica e integração; componentes devem ficar simples.
- Usar `inject()` e `providedIn: 'root'` quando fizer sentido.

## Exemplo

```ts
@Injectable({ providedIn: 'root' })
export class DataStore {
  private http = inject(HttpClient);

  fetchAll() {
    return this.http.get('/api/items');
  }
}
```
