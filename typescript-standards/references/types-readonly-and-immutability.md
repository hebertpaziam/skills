# Types readonly and immutability

## Quando usar

- Modelar dados que nao devem ser mutados apos criacao ou expor contratos mais seguros.

## Regras locais

- Use `readonly` para explicitar intencao de imutabilidade em contratos compartilhados.
- Prefira expor leitura e encapsular mutacao onde a regra de dominio exigir.
- Nao imponha imutabilidade ritualistica se a mutacao local controlada for a forma mais simples e clara.

## Checklist de qualidade

- Imutabilidade foi aplicada onde ela protege invariantes ou consumo publico.
- Nao ha rigidez desnecessaria sem beneficio real.
