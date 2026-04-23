# Principles separation of concerns

## Quando usar

- Organizar modulos, tipos, adaptadores, validacao, side effects e regras de dominio.

## Regras locais

- Separe modelagem de dominio, IO, adaptacao externa, validacao e apresentacao.
- Nao misture parsing de boundary, logica de negocio e detalhes de transporte no mesmo modulo sem necessidade.
- Cada modulo deve ter uma fronteira compreensivel e responsabilidade clara.

## Checklist de qualidade

- Preocupacoes distintas estao separadas.
- O modulo nao virou ponto de acoplamento entre camadas demais.
