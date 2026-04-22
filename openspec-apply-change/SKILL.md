---
name: openspec-apply-change
description: Implemente tasks de uma change do OpenSpec. Use quando o usuário quiser começar a implementar, continuar a implementação ou avançar nas tasks de uma change.
license: MIT
metadata:
  author: openspec
  version: '1.0'
  generatedBy: '1.3.0'
---

Implemente tasks de uma OpenSpec change.

## Pré-requisito

- O ambiente precisa ter a CLI `openspec` instalada e acessível no terminal.

**Input**: Opcionalmente, especifique o nome de uma change. Se for omitido, verifique se ele pode ser inferido pelo contexto da conversa. Se estiver vago ou ambíguo, peça ao usuário para selecionar entre as changes disponíveis.

## Etapas

1. **Selecione a change**

   Se um nome for fornecido, use-o. Caso contrário:
   - infira pelo contexto da conversa se o usuário mencionou uma change;
   - faça seleção automática se existir apenas uma change ativa;
   - se estiver ambíguo, execute `openspec list --json` para obter as changes disponíveis.

   Quando houver mais de uma opção:
   - se o ambiente expuser `request_user_input`, use-o para a seleção;
   - caso contrário, liste as opções e faça uma pergunta direta curta no chat.

   Sempre anuncie: `Using change: <name>` e como sobrescrever (por exemplo, `/opsx:apply <other>`).

2. **Verifique o status para entender o schema**

   ```bash
   openspec status --change "<name>" --json
   ```

   Analise o JSON para entender:
   - `schemaName`: o workflow em uso;
   - qual artifact contém as tasks (normalmente `tasks` para `spec-driven`; para os demais, confira o status).

3. **Obtenha as instruções de apply**

   ```bash
   openspec instructions apply --change "<name>" --json
   ```

   Isso retorna:
   - paths dos arquivos de contexto;
   - progresso (`total`, `complete`, `remaining`);
   - lista de tasks com status;
   - instrução dinâmica com base no `state` atual.

   Trate os states assim:
   - se `state: "blocked"`, explique quais artifacts estão faltando e oriente o usuário a concluir os artifacts pendentes antes de retomar;
   - se `state: "all_done"`, informe que a implementação já está concluída e sugira o archive;
   - caso contrário, prossiga para a implementação.

4. **Leia os arquivos de contexto**

   Leia os arquivos listados em `contextFiles` na saída das instruções de apply.
   Os arquivos dependem do schema em uso:
   - **spec-driven**: proposal, specs, design, tasks;
   - outros schemas: siga o `contextFiles` vindo da saída da CLI.

5. **Mostre o progresso atual**

   Exiba:
   - o schema em uso;
   - progresso: `N/M tasks complete`;
   - visão geral das tasks restantes;
   - instrução dinâmica vinda da CLI.

6. **Implemente as tasks**

   Para cada task pendente:
   - mostre em qual task você está trabalhando;
   - faça as alterações de código necessárias;
   - mantenha as mudanças mínimas e focadas;
   - marque a task como concluída no arquivo de tasks: `- [ ]` → `- [x]`;
   - continue para a próxima task.

   Pause se:
   - a task estiver pouco clara;
   - a implementação revelar um problema de design;
   - surgir um erro ou blocker;
   - o usuário interromper.

7. **Ao concluir ou pausar, mostre o status**

   Exiba:
   - tasks concluídas nesta sessão;
   - progresso geral: `N/M tasks complete`;
   - se tudo estiver concluído, sugira archive;
   - se estiver pausado, explique o motivo e aguarde orientação.

## Saída durante a implementação

```text
## Implementing: <change-name> (schema: <schema-name>)

Working on task 3/7: <task description>
[...implementation happening...]
✓ Task complete

Working on task 4/7: <task description>
[...implementation happening...]
✓ Task complete
```

## Saída na conclusão

```text
## Implementation Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 7/7 tasks complete ✓

### Completed This Session
- [x] Task 1
- [x] Task 2
...

All tasks complete! Ready to archive this change.
```

## Saída em pausa

```text
## Implementation Paused

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 4/7 tasks complete

### Issue Encountered
<description of the issue>

What would you like to do?
```

## Guardrails

- Siga avançando pelas tasks até ficar `done` ou `blocked`.
- Sempre leia os arquivos de contexto antes de começar.
- Se a task estiver ambígua, pause e pergunte antes de implementar.
- Se a implementação revelar problemas, pause e sugira atualização dos artifacts.
- Mantenha as mudanças de código mínimas e limitadas a cada task.
- Atualize o checkbox da task imediatamente após concluí-la.
- Pause em erros, blockers ou requisitos pouco claros; não adivinhe.
- Use `contextFiles` da saída da CLI; não assuma nomes de arquivos específicos.
