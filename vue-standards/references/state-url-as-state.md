# State URL as state

## Quando usar

- Modelar busca, filtros, ordenacao, paginacao, tabs ou selecoes que precisam sobreviver a reload, compartilhamento ou navegacao.

## Regras locais

- Mova para a URL o estado que precisa ser compartilhavel, restauravel ou deep-linkable.
- Nao mova para a URL estado puramente efemero e local de UI sem ganho real.
- Centralize parse, serializacao e defaults dos query params.
- Mantenha tipos e naming dos params previsiveis e estaveis.

## Checklist de qualidade

- Estado URL-driven realmente traz valor.
- Sem query params opacos ou inconsistentes.
- Parse e serializacao controlados.
