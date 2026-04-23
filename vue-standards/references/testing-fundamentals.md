# Testing fundamentals

## Quando usar

- Criar ou atualizar testes de componentes, composables, stores, router e fluxos Vue.

## Objetivo

- Reutilizar exclusivamente a stack de testes ja configurada no projeto.
- Garantir cobertura coerente entre logica, comportamento observavel e fluxos criticos.
- Evitar introduzir uma stack paralela de runner, ambiente, mocks ou assertions.

## Regras locais

- Respeite os scripts, ambientes, utilitarios e conventions de teste do repositorio.
- Nao padronize ferramenta nova se o projeto ja possui uma escolhida.
- Testes devem priorizar comportamento observavel e contratos publicos.
- Use unit tests para logica isolada, component tests para comportamento de componente e E2E para fluxos multi-pagina.
- Nao confie apenas em snapshots.

## Checklist de qualidade

- A stack atual do projeto foi preservada.
- Nenhuma ferramenta paralela foi introduzida.
- O teste cobre comportamento, nao detalhes privados desnecessarios.
