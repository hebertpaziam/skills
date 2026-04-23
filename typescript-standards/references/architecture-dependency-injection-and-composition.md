# Architecture dependency injection and composition

## Quando usar

- Compor modulos, desacoplar dependencias externas ou facilitar teste em boundaries relevantes.

## Regras locais

- Prefira composicao explicita e injecao simples por parametro antes de containers complexos.
- Use contratos pequenos para dependencias quando o desacoplamento for valioso.
- Nao transforme toda funcao em DI por antecipacao.
- Em muitos casos, passar dependencia diretamente e suficiente e mais legivel.

## Checklist de qualidade

- A injecao simplificou teste ou desacoplamento real.
- Nenhuma infraestrutura de DI foi introduzida sem necessidade forte.
