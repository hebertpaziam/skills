# Pragmatic duplication vs abstraction

## Quando usar

- Decidir se dois trechos parecidos devem ser unificados agora.

## Regras locais

- Nem toda semelhanca visual e duplicação real.
- Extraia abstracao quando houver mesma regra, mesma variacao e mesma direcao de evolucao.
- Nao unifique trechos que ainda parecem iguais, mas evoluem por razoes diferentes.
- Duplicacao pequena e local pode ser melhor que abstracao opaca e prematura.

## Exemplo de teste mental

- Se eu mudar um, quase certamente o outro muda pelo mesmo motivo?
- Se nao, talvez ainda nao seja hora de abstrair.

## Checklist de qualidade

- A abstracao surgiu de duplicação real.
- Nao houve perda de semantica local.
