# Types errors and result shapes

## Quando usar

- Modelar retornos de operacoes que podem falhar, erros de dominio e respostas de boundary.

## Regras locais

- Seja explicito sobre sucesso e falha em contratos que exigem isso.
- Prefira shapes previsiveis e estreitos a objetos de erro genericos demais.
- Nao use excecao como unico mecanismo em fluxos onde falha esperada faz parte do contrato.
- Se o projeto usar um padrao de `Result`, mantenha consistencia; se nao usar, nao introduza um framework interno sem necessidade.

## Checklist de qualidade

- Sucesso e falha estao claros no contrato.
- O formato escolhido e coerente com a base do projeto.
