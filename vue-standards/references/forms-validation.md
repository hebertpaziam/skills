# Forms validation

## Quando usar

- Validar formularios e campos em componentes ou fluxos Vue.

## Regras locais

- Reutilize a biblioteca, schema validator ou estrategia de validacao ja adotada no projeto.
- Separe estado do formulario, regras de validacao e apresentacao visual de erro.
- Erros devem ser exibidos de forma acessivel e conectada ao campo.
- Validacao sincrona e assincrona devem ter estados observaveis e previsiveis.
- Nao acople o componente a uma biblioteca especifica se o projeto ja abstrai isso em composables ou helpers.

## Checklist de qualidade

- Stack de validacao do projeto respeitada.
- Erros acessiveis.
- Sem duplicação desnecessaria de regras.
