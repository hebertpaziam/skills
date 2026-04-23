# Architecture API design

## Quando usar

- Definir funcoes publicas, factories, builders, adapters ou modulos consumidos por outras partes do sistema.

## Regras locais

- APIs publicas devem ser pequenas, semanticas e dificeis de usar errado.
- Nomeie funcoes e argumentos pelo dominio.
- Prefira parametros claros a objetos de configuracao gigantescos quando o caso e simples.
- Introduza objeto de opcoes apenas quando houver complexidade real e coesao entre parametros.

## Checklist de qualidade

- API legivel e previsivel.
- Baixa chance de uso errado.
- Sem superficie publica inflada.
