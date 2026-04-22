---
name: vitest-unit-tests
description: 'Implemente testes unitários em Vitest para projetos Angular, focando somente em funções/métodos do recurso (components, services, directives). Use faker.js, evite stubs, prefira spies, e não teste HTML. Use junto com a skill angular-standards ao criar ou alterar arquivos .spec.ts.'
---

# Vitest Unit Tests (Angular, lógica apenas)

## Quando usar

- Criar ou atualizar testes unitários em Vitest para recursos Angular.
- Validar comportamento de métodos/funções em components, services, directives e afins.
- Garantir cobertura total de cenários de sucesso e falha.
- Usar junto com a skill `angular-standards` quando a tarefa Angular envolver criação ou edição de `*.spec.ts`.

## Objetivo

- Testar apenas lógica do recurso, sem validar HTML, renderização, textos ou cores.
- Usar dados gerados com faker.js (sem dados fixos).
- Evitar stubs; usar spies para validar chamadas a dependencias.
- Manter testes legíveis e com estrutura consistente.

## Integração com angular-standards

- Em tarefas Angular, esta skill é a fonte de verdade para unit tests em arquivos `*.spec.ts`.
- Se a demanda vier via `angular-standards`, esta skill deve ser carregada e prevalece para regras operacionais de testes unitários.

## Regras principais

- Nunca testar HTML ou renderização (sem asserts de DOM, textos ou estilos).
- Sempre gerar dados com faker.js ou geradores em `src/mock/generators`.
- Nunca usar dados fixos nos testes.
- Evitar stubs; preferir spies para validar chamadas a dependencias.
- Evitar sub-contextos (describe dentro de describe) salvo necessidade real.
- Nunca validar objetos/valores inline; sempre atribuir a variáveis.
- Preferir matchers semânticos do Vitest (evitar `toBe` quando houver opção mais descritiva).
- Buscar 100% de cobertura do recurso, cobrindo todos os comportamentos possíveis.
- Ordenar cenários: primeiro sucesso, depois falha.

## Procedimento

1. Identifique o recurso e os métodos/funções públicos e privados relevantes.
2. Levante todos os comportamentos possíveis (sucesso e falha).
3. Gere dados com faker.js ou com geradores de `src/mock/generators`.
4. Monte o teste no Vitest usando um único `describe` por recurso, sempre que possível.
5. Crie `spies` para dependencias e valide chamadas (sem stubs).
6. Armazene entradas e resultados em variáveis nomeadas antes dos `expect`.
7. Escreva os testes de sucesso primeiro, depois os de falha.
8. Revise a cobertura para garantir 100% de comportamento coberto.

## Checklist de qualidade

- Nenhum teste usa DOM/HTML.
- Dados gerados com faker.js ou geradores locais; sem valores fixos.
- Sem stubs; apenas spies quando houver dependências.
- Sem `describe` aninhado, a menos que justificado.
- `expect` usa variáveis nomeadas (sem objetos inline).
- Preferência por matchers semânticos em vez de `toBe`.
- Cobertura completa do recurso, com sucesso antes de falha.

## Exemplo

```ts
import { faker } from '@faker-js/faker';

const inputValue = faker.string.alpha();
const expectedResult = faker.number.int();

const result = service.calculate(inputValue);

expect(result).toEqual(expectedResult);
```
