# Testing fundamentals (logica Angular)

## Quando usar

- Criar ou atualizar testes unitarios para recursos Angular.
- Validar comportamento de metodos e funcoes em components, services, directives e afins.
- Garantir cobertura total de cenarios de sucesso e falha.
- Usar esta reference sempre que a tarefa Angular envolver criacao ou edicao de `*.spec.ts`.
- Reutilizar exclusivamente a stack de testes ja configurada no projeto.

## Objetivo

- Testar apenas logica do recurso, sem validar HTML, renderizacao, textos ou cores.
- Reutilizar o runner, a API de assercao, o ambiente de execucao, os utilitarios de spy/mock e o provedor de cobertura ja padronizados no repositorio.
- Evitar a introducao de stack paralela de testes, helpers ad hoc ou convencoes divergentes da base atual.
- Usar dados gerados com `faker.js` e com geradores locais do projeto quando existirem.
- Evitar stubs; usar spies para validar chamadas a dependencias.
- Manter testes legiveis, deterministas e com estrutura consistente.

## Regras locais

- Nao introduzir ferramentas, adapters ou camadas paralelas de teste quando o projeto ja possui scripts, config e utilitarios definidos.
- Ao precisar de spies, mocks, fake timers, helpers async ou matchers, usar os equivalentes nativos da stack configurada no projeto.
- Nunca testar HTML ou renderizacao por padrao.
- Sempre gerar dados com `faker.js` ou com geradores locais do projeto.
- Nunca usar dados fixos nos testes.
- Evitar stubs manuais; preferir spies e doubles fornecidos pela ferramenta configurada no projeto para validar chamadas a dependencias.
- Evitar sub-contextos (`describe` dentro de `describe`) salvo necessidade real.
- Nunca validar objetos ou valores inline; sempre atribuir a variáveis.
- Preferir matchers semanticos fornecidos pela stack configurada no projeto em vez de assercoes genericas quando houver opcao mais descritiva.
- Buscar 100% de cobertura do recurso, cobrindo todos os comportamentos possiveis.
- Ordenar cenarios: primeiro sucesso, depois falha.

## Fronteira de escopo

- Esta reference define as regras operacionais para unit tests de logica em Angular.
- `component-harnesses` e `router-testing` cobrem excecoes de UI e navegacao quando o escopo exigir.

## Procedimento

1. Identifique o recurso e os metodos e funcoes publicos e privados relevantes.
2. Levante todos os comportamentos possiveis, cobrindo sucesso e falha.
3. Confirme quais scripts, helpers e convencoes de teste ja estao configurados no projeto e reutilize-os sem introduzir uma stack paralela.
4. Gere dados com `faker.js` ou com geradores locais do projeto.
5. Monte a suite usando um unico contexto raiz por recurso, sempre que possível.
6. Crie `spies` para dependencias e valide chamadas com as APIs nativas da stack do projeto.
7. Armazene entradas e resultados em variáveis nomeadas antes dos `expect`.
8. Escreva os testes de sucesso primeiro, depois os de falha.
9. Revise a cobertura para garantir 100% de comportamento coberto.

## Checklist de qualidade

- Suite aderente a ferramenta e aos utilitarios de teste ja configurados no projeto.
- Nenhuma stack paralela de testes foi introduzida.
- Nenhum teste usa DOM ou HTML por padrao.
- Dados gerados com `faker.js` ou geradores locais, sem valores fixos.
- Sem stubs; apenas spies quando houver dependencias.
- Sem `describe` aninhado, a menos que justificado.
- `expect` usa variáveis nomeadas, sem objetos inline.
- Matchers semanticos priorizados.
- Cobertura completa do recurso, com sucesso antes de falha.

## Exemplo

```ts
import { faker } from '@faker-js/faker';

const inputValue = faker.string.alpha();
const expectedResult = faker.number.int();

const result = service.calculate(inputValue);

expect(result).toEqual(expectedResult);
```
