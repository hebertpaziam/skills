# Rendering performance basics

## Quando usar

- Revisar componentes com render custoso, listas grandes ou updates frequentes.

## Regras locais

- Mantenha props estaveis para reduzir atualizacoes desnecessarias em children.
- Use `v-once` apenas para subarvores realmente imutaveis apos o primeiro render.
- Use `v-memo` apenas quando houver subarvores grandes e criterio objetivo de memorizacao.
- Evite criar objetos novos em `computed` sem necessidade quando a estabilidade importa.
- Virtualize listas grandes em vez de renderizar milhares de nos de uma vez.
- Evite abstracoes de componente sem ganho real, principalmente em listas extensas.

## Checklist de qualidade

- Props estaveis quando possivel.
- Sem render desnecessario em massa.
- Virtualizacao considerada para listas grandes.
- Sem excesso de wrappers/componentes sem funcao clara.
