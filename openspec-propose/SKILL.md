---
name: openspec-propose
description: Proponha uma nova change do OpenSpec e gere todos os artifacts em uma etapa. Use quando o usuário quiser descrever rapidamente o que quer construir e sair com proposal, design, specs e tasks prontas para implementação.
license: MIT
metadata:
  author: openspec
  version: '1.0'
  generatedBy: '1.3.0'
---

Proponha uma nova change: crie a change e gere todos os artifacts em um único passo.

## Pré-requisito

- O ambiente precisa ter a CLI `openspec` instalada e acessível no terminal.

Vou criar uma change com os seguintes artifacts:

- proposal.md (what & why)
- design.md (how)
- tasks.md (implementation steps)

Quando estiver pronto para implementar, execute `/opsx:apply`.

**Input**: A solicitação do usuário deve incluir um nome de change em kebab-case ou uma descrição do que ele quer construir.

## Etapas

1. **Se não houver input claro, pergunte o que o usuário quer construir**

   Quando precisar pedir esclarecimento:
   - use `request_user_input` se o ambiente expuser esse recurso;
   - caso contrário, faça uma pergunta direta curta no chat.

   Exemplo:

   > Em qual change você quer trabalhar? Descreva o que você quer construir ou corrigir.

   A partir da descrição, derive um nome em kebab-case.

2. **Crie o diretório da change**

   ```bash
   openspec new change "<name>"
   ```

3. **Obtenha a ordem de criação dos artifacts**

   ```bash
   openspec status --change "<name>" --json
   ```

   Analise o JSON para obter:
   - `applyRequires`: artifacts necessários antes da implementação;
   - `artifacts`: lista completa de artifacts com status e dependências.

4. **Acompanhe o progresso**

   Enquanto cria os artifacts:
   - se o ambiente expuser `update_plan`, use-o para acompanhar o progresso;
   - caso contrário, mantenha uma checklist textual curta na própria resposta.

5. **Crie os artifacts em sequência até ficar apply-ready**

   Percorra os artifacts em ordem de dependência.

   Para cada artifact que estiver `ready`:
   - obtenha as instruções:

     ```bash
     openspec instructions <artifact-id> --change "<name>" --json
     ```

   - leia os dependency artifacts já concluídos para obter contexto;
   - crie o arquivo usando `template` como estrutura;
   - aplique `context` e `rules` como constraints, sem copiá-los para dentro do arquivo;
   - mostre um progresso breve: `Created <artifact-id>`.

   Depois de criar cada artifact:
   - execute novamente `openspec status --change "<name>" --json`;
   - pare quando todos os artifacts de `applyRequires` estiverem com `status: "done"`.

   Se algum artifact exigir input do usuário, esclareça e continue.

6. **Mostre o status final**

   ```bash
   openspec status --change "<name>"
   ```

## Saída

Depois de concluir todos os artifacts, resuma:

- nome e localização da change;
- lista dos artifacts criados com descrições curtas;
- o que está pronto: `All artifacts created! Ready for implementation.`
- prompt sugerido: `Run /opsx:apply or ask me to implement to start working on the tasks.`

## Diretrizes de criação de artifacts

- Siga o campo `instruction` vindo de `openspec instructions` para cada tipo de artifact.
- O schema define o que cada artifact deve conter; siga-o.
- Leia os dependency artifacts para contexto antes de criar novos.
- Use `template` como estrutura do arquivo de saída e preencha suas seções.
- `context` e `rules` são constraints para você, não conteúdo para o arquivo.

## Guardrails

- Crie todos os artifacts necessários para a implementação.
- Sempre leia os dependency artifacts antes de criar um novo.
- Se o contexto estiver criticamente pouco claro, pergunte ao usuário; mas prefira decisões razoáveis para manter o ritmo.
- Se já existir uma change com esse nome, pergunte se o usuário quer continuá-la ou criar uma nova.
- Verifique se cada arquivo de artifact existe após escrevê-lo antes de prosseguir.
