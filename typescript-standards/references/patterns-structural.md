# Patterns structural

## Quando usar

- Adaptar interfaces, compor comportamento, simplificar acesso ou controlar delegacao.

## Cobertura

- Adapter
- Bridge
- Composite
- Decorator
- Facade
- Flyweight
- Proxy

## Regras locais

- `Adapter` e excelente quando uma API externa nao encaixa no contrato interno.
- `Decorator` e util para adicionar comportamento sem inflar a implementacao original.
- `Facade` ajuda a reduzir acoplamento com subsistemas complexos.
- `Proxy` pode encapsular cache, lazy access, auth ou controle de acesso.
- `Bridge`, `Composite` e `Flyweight` sao menos comuns e exigem justificativa forte para nao virar sobreengenharia.

## Checklist de qualidade

- O pattern reduziu acoplamento ou simplificou consumo.
- Nao surgiu uma camada estrutural vazia.
