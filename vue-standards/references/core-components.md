# Core components

## Quando usar

- Criar ou refatorar componentes Vue.
- Revisar a fronteira entre componente, composable e store.

## Regras locais

- Componentes devem encapsular uma responsabilidade visual ou interacional clara.
- Componentes pequenos e focados; extraia child components quando a leitura ou o reuso justificar.
- Nao transformar o componente em coordenador de todos os detalhes de dominio se uma store ou composable for fronteira melhor.
- Prefira API publica pequena: props, emits, slots e `v-model` quando fizer sentido.
- Evite logica de negocio densa no template; derive e prepare os dados no script.

## Sinais para extrair

- Mais de uma preocupacao logica relevante no mesmo arquivo.
- Regras repetidas em multiplos componentes.
- Muitos props booleanos tentando controlar variacoes demais.
- Grande volume de branches no template.

## Checklist de qualidade

- Responsabilidade unica.
- API publica pequena e clara.
- Sem acoplamento desnecessario a detalhes externos.
- Template legivel.
