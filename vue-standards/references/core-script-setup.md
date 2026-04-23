# Core script setup

## Quando usar

- Criar ou alterar componentes Vue 3 com SFC.
- Revisar uso de macros, bindings e escopo do componente.

## Objetivo

- Padronizar `<script setup>` como default ergonomico e performatico para Vue 3.
- Aproveitar inferencia de tipos e reduzir boilerplate.

## Regras locais

- Para codigo novo, usar `<script setup lang="ts">`.
- Tratar top-level bindings como API interna do template.
- Usar `defineOptions` para `inheritAttrs` e metadados que realmente precisam ser declarados.
- Usar `defineExpose` com parcimonia; componentes devem ser fechados por padrao.
- `useAttrs()` e `useSlots()` devem ser raros e usados apenas quando a composicao realmente exigir.
- Evitar combinar `<script setup>` com `<script>` normal sem necessidade tecnica concreta.
- `top-level await` so deve ser usado quando o projeto e a arquitetura suportarem o fluxo resultante.

## Checklist de qualidade

- `lang="ts"` presente em codigo novo.
- Sem uso desnecessario de `<script>` paralelo.
- Macros usadas de forma explicita e enxuta.
- Nenhum binding top-level exposto ao template por acidente sem necessidade.
