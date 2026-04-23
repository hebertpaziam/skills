# Types generics

## Quando usar

- Criar APIs reutilizaveis, helpers tipados ou contratos parametricos.

## Regras locais

- Use generics quando o tipo realmente varia e essa variacao precisa ser propagada.
- Prefira generics pequenos, restritos e nomeados de forma clara.
- Nao introduza generics apenas para parecer mais flexivel.
- Quando uma uniao explicita e suficiente, prefira a forma mais simples.

## Checklist de qualidade

- O generic resolve um problema real.
- A assinatura continua legivel.
- Nao ha complexidade generica especulativa.
