# Types interface generators

## Quando usar

- Criar uma nova interface.
- Atualizar uma interface existente.
- Gerar dados de mock, fixture ou teste para contratos TypeScript.

## Regras locais

- Toda interface deve ter um generator correspondente.
- O generator deve usar `faker.js`.
- O generator deve viver em arquivo dedicado de generator.
- O generator deve respeitar a hierarquia de pastas adotada pelo projeto para a interface correspondente.
- Se o projeto centralizar generators em uma arvore propria, espelhe nessa arvore a mesma hierarquia logica da interface.
- O generator deve criar ou receber um unico `seed` aleatorio por execucao.
- Todos os campos gerados para a interface devem derivar desse mesmo `seed`.
- Nao gere um `seed` por campo, por objeto aninhado ou por chamada isolada dentro da mesma arvore de dados.
- Quando o generator compuser outros generators, compartilhe o mesmo contexto seeded em toda a arvore.
- O generator deve preencher pelo menos todos os campos obrigatorios da interface.
- Overrides sao aceitaveis quando simplificam o uso sem quebrar o contrato base.

## Exemplo de estrutura

- `src/domain/user/user.interface.ts`
- `src/domain/user/user.generator.ts`
- `src/domain/user/user.interface.ts`
- `src/mock/generators/domain/user/user.generator.ts`

## Checklist de qualidade

- A interface possui generator correspondente.
- O generator usa `faker.js`.
- O generator esta em arquivo dedicado.
- O generator respeita a hierarquia de pastas do projeto.
- Um unico `seed` aleatorio e usado por execucao.
- Todos os dados do contrato derivam do mesmo `seed`.
- O generator cobre os campos obrigatorios da interface.
