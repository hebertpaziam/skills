# Patterns when not to use

## Quando usar

- Revisar se um pattern GoF esta sendo introduzido cedo demais.

## Sinais de alerta

- Existe apenas uma implementacao e nenhuma pressao real por variacao.
- O pattern foi introduzido para um futuro hipotetico.
- Uma funcao, modulo ou objeto literal simples resolveria.
- O codigo ficou mais dificil de navegar ou explicar.
- A nova camada so repassa chamadas sem agregar semantica real.

## Regra pragmatica

- Se o pattern viola `KISS` e `YAGNI`, remova o pattern e prefira a forma mais simples.

## Checklist de qualidade

- O pattern sobreviveu a um teste honesto de simplicidade.
- A abstracao trouxe valor presente, nao apenas potencial futuro.
