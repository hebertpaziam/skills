# Testing components

## Quando usar

- Testar props, emits, slots, estados visuais e comportamento de componentes Vue.

## Regras locais

- Teste o que o componente faz, nao como ele faz.
- Foque na interface publica: props, emits, slots, render e reacao a interacao do usuario.
- Evite acoplamento a estado interno privado ou metodos privados quando o comportamento observavel cobre o caso.
- Nao dependa exclusivamente de snapshots de HTML.

## Checklist de qualidade

- Assertions ancoradas em comportamento observavel.
- Sem acoplamento desnecessario a implementacao interna.
- Children sao mockados apenas quando isso melhora isolacao sem perder valor do teste.
