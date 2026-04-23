# Architecture modules and boundaries

## Quando usar

- Organizar arquivos, modulos e pontos de integracao externa.

## Regras locais

- Cada modulo deve ter uma responsabilidade compreensivel.
- Separar dominio, boundary externa, parsing, persistencia e efeitos colaterais quando isso reduz acoplamento.
- Nao deixar o modulo de dominio depender diretamente de detalhes de transporte ou IO se isso comprometer teste e evolucao.
- Prefira imports simples e diretos a malhas de dependencia circulares.

## Checklist de qualidade

- Boundaries do modulo estao claras.
- Dependencias estao orientadas na direcao correta.
- Nao ha mistura excessiva de concerns.
