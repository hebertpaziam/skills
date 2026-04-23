---
name: typescript-standards
description: 'Aplique padroes TypeScript do projeto ao criar ou refatorar arquivos .ts, .tsx e contratos compartilhados. Use para tipagem, modelagem de dominio, design pragmatico, principios de arquitetura e references internas de SOLID, GoF, KISS, YAGNI, SoC e Object Calisthenics.'
---

# TypeScript Standards

## Quando usar

- Criar ou refatorar arquivos TypeScript do projeto.
- Definir interfaces, types, contratos compartilhados e fronteiras de modulo.
- Modelar dominio, resultados, erros, colecoes e APIs publicas.
- Tomar decisoes de design e arquitetura que nao sao especificas de um framework.

## Objetivo

- Manter tipagem forte, previsivel e legivel.
- Preservar simplicidade, coesao e evolucao saudavel do codigo.
- Concentrar regras detalhadas em references locais para evitar duplicação e manter precedencia clara.
- Aplicar principios de design de forma pragmatica, sem overengineering.

## Principio LIFT

- Antes de criar novo tipo, helper, modulo, classe, adapter, factory, port ou abstracao, aplicar o principio `LIFT`.
- `Locate`: localizar contratos, tipos, helpers, patterns, modulos e references ja existentes.
- `Identify`: identificar o que ja resolve parte do problema e onde ha duplicação real ou potencial.
- `Find`: encontrar o menor ponto coerente de reutilização, extensao ou composicao antes de introduzir algo novo.
- `Try to be DRY`: tentar eliminar duplicação real sem criar abstracoes prematuras, camadas genericas demais ou estruturas opacas.

## Integracao com outras skills e referencias

- Esta skill e transversal e language-level: frameworks como Angular e Vue devem continuar ditando arquitetura especifica de framework.
- `typescript-standards` define modelagem, contratos, desenho de modulos, validacao de boundaries e design pragmatico em TypeScript.
- Em caso de conflito, prevalece a skill de framework para organizacao especifica do ecossistema e `typescript-standards` para regras gerais de linguagem e design.

## Regras principais

- Aplicar `LIFT` antes de introduzir novos tipos, modulos, classes, helpers, adapters, factories ou patterns.
- Nunca usar `any`; quando o tipo for incerto, usar `unknown`.
- Interfaces devem começar com `I`.
- Nao criar interfaces dentro de arquivos que nao sejam dedicados a interface.
- Toda interface deve ter um generator correspondente usando `faker.js`.
- O generator da interface deve viver em arquivo dedicado e respeitar a hierarquia de pastas adotada pelo projeto.
- O generator deve criar ou receber um unico `seed` aleatorio por execucao e derivar dele todos os dados do contrato.
- Nao criar enums dentro de arquivos que nao sejam dedicados a enum.
- Manter apenas um enum por arquivo.
- Todo enum deve ter no mesmo arquivo uma estrutura de mapeamento para labels de seus valores.
- Preferir funcoes e modulos antes de classes.
- Preferir composicao antes de heranca.
- Aplicar `KISS`, `YAGNI` e `SoC` por padrao.
- Tratar `SOLID` como heuristica pragmatica, nao como checklist dogmatico.
- Tratar `Object Calisthenics` como pressao de design opcional, nao como lei.
- Usar padroes GoF apenas quando houver pressao real de mudanca, repeticao ou desacoplamento.
- Preferir `Record` a `Map` quando chaves de objeto forem suficientes.
- Usar `Map` apenas quando sua API especifica ou suporte a chaves nao serializaveis for realmente necessario.
- Preferir um contrato por arquivo, a menos que os tipos sejam fortemente relacionados.
- Antes de introduzir novos tipos, verificar se ja existe um contrato equivalente no dominio.
- Validar boundaries de runtime quando dados entram de fora do sistema.
- Usar aspas simples e ponto e virgula.

## Procedimento

1. Aplique `LIFT` antes de criar novos tipos, modulos ou abstracoes.
2. Identifique os contratos, tipos e fronteiras realmente necessarios para a mudanca.
3. Se houver interface, planeje tambem o generator correspondente na hierarquia correta do projeto.
4. Reutilize tipos existentes antes de criar novos.
5. Modele com a opcao mais restritiva, clara e simples possivel.
6. Se houver incerteza, use `unknown` e faca narrowing explicito.
7. Escolha entre funcao, modulo, objeto ou classe com base na necessidade real de estado, identidade, ciclo de vida ou polimorfismo.
8. Se considerar um pattern GoF, verifique primeiro se uma composicao simples resolve o caso.
9. Revise o resultado com `KISS`, `YAGNI`, `SoC` e leitura de dominio.

## Checklist de qualidade

- `LIFT` aplicado antes de introduzir novas estruturas.
- Nenhum `any` foi introduzido.
- Interfaces seguem o prefixo `I`.
- Interfaces vivem em arquivos dedicados.
- Interfaces possuem generator correspondente.
- O generator da interface usa `faker.js`.
- O generator da interface respeita a hierarquia de pastas do projeto.
- O generator da interface usa um unico `seed` aleatorio por execucao.
- Enums vivem em arquivos dedicados.
- Ha apenas um enum por arquivo.
- Todo enum possui no mesmo arquivo um mapeamento de labels para seus valores.
- A solucao mais simples que atende o caso foi preferida.
- Nao houve abstracao especulativa.
- `Record` foi preferido quando suficiente.
- `Map` so foi usado com justificativa tecnica real.
- Boundaries externos foram tratados com validacao adequada quando necessario.
- O arquivo usa aspas simples e ponto e virgula.
- Nao houve proliferacao desnecessaria de tipos, classes ou patterns.

## Observacoes

- Esta skill nao exige design orientado a objetos como default; em TypeScript, funcoes, modulos e composicao costumam ser o melhor ponto de partida.
- `SOLID`, GoF e `Object Calisthenics` existem aqui para melhorar design e manutencao, nao para justificar complexidade extra.
- Quando a skill de framework definir uma estrutura especifica, siga o framework e aplique esta skill na camada de linguagem e design.

## Referencias (carregar quando fizer sentido)

- `LIFT`: [references/principles-lift.md](references/principles-lift.md)
- SOLID: [references/principles-solid.md](references/principles-solid.md)
- KISS e YAGNI: [references/principles-kiss-yagni.md](references/principles-kiss-yagni.md)
- Separation of Concerns: [references/principles-separation-of-concerns.md](references/principles-separation-of-concerns.md)
- Object Calisthenics: [references/principles-object-calisthenics.md](references/principles-object-calisthenics.md)
- Interface vs type: [references/types-interface-vs-type.md](references/types-interface-vs-type.md)
- Interface generators: [references/types-interface-generators.md](references/types-interface-generators.md)
- Enums: [references/types-enums.md](references/types-enums.md)
- Domain modeling: [references/types-domain-modeling.md](references/types-domain-modeling.md)
- Unions vs class hierarchies: [references/types-unions-vs-class-hierarchies.md](references/types-unions-vs-class-hierarchies.md)
- Narrowing e unknown: [references/types-narrowing-and-unknown.md](references/types-narrowing-and-unknown.md)
- Runtime validation: [references/types-runtime-validation.md](references/types-runtime-validation.md)
- Record vs Map: [references/types-record-vs-map.md](references/types-record-vs-map.md)
- Generics: [references/types-generics.md](references/types-generics.md)
- Utility types: [references/types-utility-types.md](references/types-utility-types.md)
- Readonly e imutabilidade: [references/types-readonly-and-immutability.md](references/types-readonly-and-immutability.md)
- Errors e result shapes: [references/types-errors-and-result-shapes.md](references/types-errors-and-result-shapes.md)
- Funcoes vs classes: [references/architecture-functions-vs-classes.md](references/architecture-functions-vs-classes.md)
- Modulos e boundaries: [references/architecture-modules-and-boundaries.md](references/architecture-modules-and-boundaries.md)
- DI e composicao: [references/architecture-dependency-injection-and-composition.md](references/architecture-dependency-injection-and-composition.md)
- Side effects e ports: [references/architecture-side-effects-and-ports.md](references/architecture-side-effects-and-ports.md)
- API design: [references/architecture-api-design.md](references/architecture-api-design.md)
- File organization: [references/architecture-file-organization.md](references/architecture-file-organization.md)
- Patterns overview: [references/patterns-overview.md](references/patterns-overview.md)
- Patterns creational: [references/patterns-creational.md](references/patterns-creational.md)
- Patterns structural: [references/patterns-structural.md](references/patterns-structural.md)
- Patterns behavioral: [references/patterns-behavioral.md](references/patterns-behavioral.md)
- Quando nao usar patterns: [references/patterns-when-not-to-use.md](references/patterns-when-not-to-use.md)
- Duplication vs abstraction: [references/pragmatic-duplication-vs-abstraction.md](references/pragmatic-duplication-vs-abstraction.md)
- Refactoring triggers: [references/pragmatic-refactoring-triggers.md](references/pragmatic-refactoring-triggers.md)
