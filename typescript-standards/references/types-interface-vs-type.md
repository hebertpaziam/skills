# Types interface vs type

## Quando usar

- Escolher entre `interface` e `type` para contratos compartilhados.

## Regras locais

- Preserve a convencao do repositorio: interfaces devem comecar com `I`.
- Interfaces devem viver em arquivos dedicados a interface.
- Toda interface deve ter um generator correspondente; ver [types-interface-generators.md](types-interface-generators.md).
- Use `interface` para contratos de objeto e superficies publicas estaveis.
- Use `type` para unions, aliases utilitarios, composicao de tipos e modelagem mais expressiva.
- Nao crie interface ou type redundante quando o alias direto e suficiente.
- Nao declare interface dentro de arquivos de implementacao, service, helper, component, composable, store ou similares.

## Checklist de qualidade

- A escolha entre `interface` e `type` foi feita pela natureza do contrato.
- Interfaces seguem o prefixo `I`.
- Interfaces vivem em arquivos dedicados.
- Interfaces possuem generator correspondente.
