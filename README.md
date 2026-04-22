# Biblioteca de Skills

Este repositório reúne skills reutilizáveis para agentes de código. Cada skill vive em um diretório próprio na raiz, com `SKILL.md` como ponto de entrada e, quando necessário, materiais complementares no mesmo diretório.

A função deste README é simples: mostrar a organização da biblioteca, facilitar a escolha da skill correta e registrar as combinações mais importantes entre elas.

## Organização

```text
.
├── angular-standards/
├── bem-scss/
├── openspec-apply-change/
├── openspec-archive-change/
├── openspec-explore/
├── openspec-propose/
├── react-standards/
├── typescript-standards/
├── vitest-unit-tests/
└── workflow-commits/
```

Princípios da estrutura atual:

- Cada skill fica em um diretório de topo.
- `SKILL.md` é o documento principal de cada skill.
- Materiais aprofundados, quando existirem, ficam dentro do diretório da própria skill.
- A raiz concentra navegação e composição; as regras detalhadas ficam nas skills.

## Seleção rápida

1. Identifique o tipo principal da tarefa: framework, estilo, testes, workflow operacional ou fluxo OpenSpec.
2. Carregue a skill base da tarefa.
3. Acrescente skills complementares quando a própria skill indicar integração explícita.
4. Consulte materiais aprofundados quando a tarefa exigir regras mais específicas do que o resumo desta raiz.

## Catálogo de skills

### Padrões e implementação

| Skill | Papel |
| --- | --- |
| [angular-standards](angular-standards/SKILL.md) | Padrões Angular 21 para criação e refatoração de recursos, com integração explícita a estilos e testes |
| [bem-scss](bem-scss/SKILL.md) | Regras de SCSS com BEM e nesting estrito para estilos de componente |
| [vitest-unit-tests](vitest-unit-tests/SKILL.md) | Testes unitários em Vitest focados na lógica de recursos Angular |
| [typescript-standards](typescript-standards/SKILL.md) | Padronização de tipagem, contratos e estilo TypeScript |
| [react-standards](react-standards/SKILL.md) | Guia de performance para React e Next.js |
| [workflow-commits](workflow-commits/SKILL.md) | Regras operacionais para comandos, scripts e preparação de commits |

### Fluxo OpenSpec

| Skill | Papel |
| --- | --- |
| [openspec-explore](openspec-explore/SKILL.md) | Explorar ideias, investigar problemas e esclarecer requisitos |
| [openspec-propose](openspec-propose/SKILL.md) | Estruturar proposal, design, specs e tasks |
| [openspec-apply-change](openspec-apply-change/SKILL.md) | Implementar as tasks da change |
| [openspec-archive-change](openspec-archive-change/SKILL.md) | Encerrar e arquivar a change concluída |

## Composição entre skills

As combinações mais recorrentes são:

- Angular + estilos: [angular-standards](angular-standards/SKILL.md) com [bem-scss](bem-scss/SKILL.md).
- Angular + testes: [angular-standards](angular-standards/SKILL.md) com [vitest-unit-tests](vitest-unit-tests/SKILL.md).
- Tipagem compartilhada: [typescript-standards](typescript-standards/SKILL.md) como camada transversal.
- Scripts e commits: [workflow-commits](workflow-commits/SKILL.md) como apoio operacional.
- Mudanças guiadas por OpenSpec: [openspec-explore](openspec-explore/SKILL.md) -> [openspec-propose](openspec-propose/SKILL.md) -> [openspec-apply-change](openspec-apply-change/SKILL.md) -> [openspec-archive-change](openspec-archive-change/SKILL.md).

## Materiais aprofundados

- [angular-standards/references](angular-standards/references/) reúne referências para signals, forms, DI, router, testing, a11y e outros tópicos Angular.
- [react-standards/README.md](react-standards/README.md) explica a estrutura da skill de React, seu processo de manutenção e os scripts locais desse diretório.
- [react-standards/RULES.md](react-standards/RULES.md) consolida o guia completo de regras de React/Next.js.

## Escopo da raiz

Este repositório funciona como biblioteca de documentação operacional para skills. A raiz não define um workflow global único de build, publish ou instalação para todas elas; quando uma skill tiver scripts, artefatos gerados ou regras específicas de manutenção, isso deve ficar documentado no diretório da própria skill.

Para manutenção do repositório, veja [CONTRIBUTING.md](CONTRIBUTING.md).
