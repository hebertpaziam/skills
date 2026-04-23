# Core props and emits

## Quando usar

- Criar ou revisar a API publica de um componente.
- Tipar `defineProps` e `defineEmits`.

## Regras locais

- Props sao contrato de entrada; nomeie-as pelo dominio, nao pelo detalhe de implementacao.
- Prefira tipagem baseada em TypeScript para `defineProps` e `defineEmits` em codigo novo.
- Props opcionais devem ter default claro quando a ausencia gerar ambiguidade.
- Nao use props para transportar callbacks imperativas quando um emit expressa melhor a intencao.
- Emits devem ser explicitos, nomeados por acao ou mudanca de estado observavel.
- Nao mutar props diretamente.

## Boas praticas

- Prefira poucos props bem modelados a varias flags conflitantes.
- Prefira emits semanticamente nomeados a eventos genericos demais.
- Se o componente tiver varias formas de composicao, considere slots antes de proliferar props.

## Checklist de qualidade

- Props tipadas e coerentes com o dominio.
- Emits tipados e semanticamente nomeados.
- Sem mutacao de props.
- Defaults previsiveis.
