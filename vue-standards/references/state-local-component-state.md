# State local component state

## Quando usar

- Modelar estado que pertence apenas ao ciclo de vida do componente atual.

## Regras locais

- Estado local continua no componente quando seu escopo e estritamente visual ou interacional e nao ha reuso real.
- Nao promover estado para Pinia ou URL sem necessidade.
- Mantenha proximo do consumo o estado que nao precisa ser compartilhado.

## Checklist de qualidade

- Estado permanece no menor escopo que atende o caso.
- Nao houve subida prematura para store global.
