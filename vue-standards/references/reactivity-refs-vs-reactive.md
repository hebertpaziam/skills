# Reactivity refs vs reactive

## Quando usar

- Escolher a API reativa principal de um componente, composable ou store.

## Regras locais

- Prefira `ref` por padrao para estado isolado, primitivos e valores cuja identidade precisa ser explicita.
- Use `reactive` quando um objeto coeso realmente se beneficia de acesso agrupado e nao sera destruturado livremente.
- Evite retornar objetos `reactive` diretamente de composables; prefira objeto plano com refs.
- Se a estrutura e grande e tratada como imutavel, considere `shallowRef` ou `shallowReactive`.

## Heuristica rapida

- `ref`: default seguro e explicito.
- `reactive`: agrupamento local de estado fortemente relacionado.
- `shallowRef` / `shallowReactive`: estruturas grandes com troca por raiz.

## Checklist de qualidade

- API reativa escolhida pela semantica, nao por habito.
- Sem perda de reatividade por destructuring imprudente.
- Sem sobrecarga desnecessaria em estruturas grandes.
