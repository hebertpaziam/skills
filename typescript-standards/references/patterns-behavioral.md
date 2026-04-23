# Patterns behavioral

## Quando usar

- Variar comportamento, modelar fluxo, comandos, observacao ou transicoes de estado.

## Cobertura

- Chain of Responsibility
- Command
- Interpreter
- Iterator
- Mediator
- Memento
- Observer
- State
- Strategy
- Template Method
- Visitor

## Regras locais

- `Strategy` e uma das melhores escolhas quando existe algoritmo intercambiavel real.
- `Observer` funciona bem para fluxos de eventos, mas nao deve virar acoplamento difuso.
- `Command` e util para encapsular acao, fila, undo ou dispatch estruturado.
- `State` ajuda quando ha estados explicitos com comportamento diferente.
- `Template Method`, `Visitor` e `Interpreter` exigem justificativa muito forte em TypeScript de aplicacao.

## Checklist de qualidade

- O comportamento variavel estava claro.
- O pattern tornou o fluxo mais claro, nao mais opaco.
