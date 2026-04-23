# Core SFC structure

## Quando usar

- Criar ou reorganizar arquivos `*.vue`.
- Revisar a estrutura interna de um component SFC.

## Regras locais

- Para codigo novo, preferir `<script setup lang="ts">`.
- Manter um unico componente por arquivo.
- Preferir um unico `<script setup>`; usar `<script>` normal apenas quando houver necessidade real de escopo de modulo ou export nomeado.
- Manter `template` simples e `style` apenas quando o componente realmente possui estilos proprios.
- Separar componentes quando o arquivo acumular mais de uma preocupacao visual ou comportamental relevante.

## Ordem recomendada

1. `<script setup lang="ts">`
2. `<template>`
3. `<style>`

## Estrutura sugerida no script

1. imports
2. types locais
3. `defineOptions`, `defineProps`, `defineEmits`, `defineModel`, `defineSlots`
4. injects e template refs
5. estado local (`ref`, `reactive`, `shallowRef`)
6. estado derivado (`computed`)
7. composables
8. watchers e efeitos
9. handlers e funcoes auxiliares
10. exposes quando realmente necessario

## Checklist de qualidade

- Arquivo com responsabilidade unica e nome coerente.
- Sem mistura desnecessaria de Options API e Composition API.
- Sem exportacoes ou side effects acidentais no SFC.
- Template, script e style alinhados ao escopo real do componente.
