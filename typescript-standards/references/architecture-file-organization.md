# Architecture file organization

## Quando usar

- Criar novos arquivos ou reorganizar modulos TypeScript.

## Regras locais

- Prefira organizacao por dominio ou responsabilidade, nao por sufixos genericos excessivos.
- Um contrato por arquivo, salvo forte coesao.
- Interfaces devem existir apenas em arquivos dedicados a interface.
- Toda interface deve ter um generator correspondente em arquivo dedicado.
- O generator da interface deve respeitar a mesma hierarquia logica do contrato dentro da estrutura adotada pelo projeto.
- Enums devem existir apenas em arquivos dedicados a enum.
- Deve haver apenas um enum por arquivo.
- O arquivo de enum deve conter tambem a estrutura de labels dos valores desse enum.
- Nao espalhe microarquivos sem ganho real de leitura.
- Nomes de arquivo devem refletir responsabilidade, nao vagueza arquitetural.

## Checklist de qualidade

- Estrutura de arquivos acompanha o dominio.
- Sem granularidade artificial.
- Interfaces e enums nao ficaram embutidos em arquivos de implementacao.
- Interfaces possuem generator correspondente na hierarquia correta.
- Cada arquivo de enum contem apenas um enum e seu mapeamento de labels.
- Sem arquivos `manager`, `base`, `common` ou `util` vagos sem contexto forte.
