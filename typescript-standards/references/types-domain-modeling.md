# Types domain modeling

## Quando usar

- Modelar entidades, value objects, DTOs, comandos, eventos e resultados de dominio.

## Regras locais

- Nomeie tipos pelo dominio, nao pelo detalhe tecnico acidental.
- Separe tipos internos de dominio de formatos externos de transporte quando isso reduzir ambiguidade.
- Use tipos para expressar invariantes e estados validos sempre que possivel.
- Nao replique o shape externo da API como se ele fosse o modelo de dominio definitivo sem necessidade.

## Checklist de qualidade

- Tipos refletem o dominio real.
- Nomes sao semanticos.
- Ha separacao entre modelo interno e boundary externo quando necessario.
