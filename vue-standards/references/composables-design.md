# Composables design

## Quando usar

- Criar logica reutilizavel com estado, lifecycle ou integracao reativa.

## Regras locais

- Nomear composables com prefixo `use`.
- Composable deve encapsular uma preocupacao coerente, nao um saco de utilidades.
- Aceitar valores simples, refs ou getters quando isso melhorar a ergonomia publica.
- Retornar objeto plano com refs e funcoes, nao um `reactive` agregado.
- Se o composable depende de lifecycle ou `inject`, ele deve ser chamado em `setup` ou `<script setup>`.

## Design interno

- Separar claramente estado, derivacao, efeitos e API publica.
- Reaproveitar outros composables antes de duplicar comportamento.
- Manter efeitos com cleanup previsivel.

## Checklist de qualidade

- Nome com `use`.
- Responsabilidade unica.
- API publica pequena.
- Retorno com refs e funcoes claras.
