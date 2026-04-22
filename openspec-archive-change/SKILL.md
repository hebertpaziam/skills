---
name: openspec-archive-change
description: Arquive uma change concluída no experimental workflow do OpenSpec. Use quando o usuário quiser finalizar e arquivar uma change após concluir a implementação.
license: MIT
metadata:
  author: openspec
  version: '1.0'
  generatedBy: '1.3.0'
---

Arquive uma change concluída no experimental workflow.

## Pré-requisito

- O ambiente precisa ter a CLI `openspec` instalada e acessível no terminal.

**Input**: Opcionalmente, especifique o nome de uma change. Se for omitido, verifique se ele pode ser inferido pelo contexto da conversa. Se estiver vago ou ambíguo, peça ao usuário para selecionar entre as changes disponíveis.

## Etapas

1. **Se nenhum nome de change for fornecido, peça uma seleção**

   Execute `openspec list --json` para obter as changes disponíveis.

   Mostre apenas changes ativas e inclua o schema usado por cada change, se estiver disponível.

   Quando houver mais de uma opção:
   - se o ambiente expuser `request_user_input`, use-o para a seleção;
   - caso contrário, liste as opções e faça uma pergunta direta curta no chat.

   Não faça suposições nem auto-select quando existir mais de uma change viável.

2. **Verifique o status de conclusão dos artifacts**

   Execute `openspec status --change "<name>" --json` para verificar a conclusão dos artifacts.

   Analise o JSON para entender:
   - `schemaName`: o workflow em uso;
   - `artifacts`: lista de artifacts com seus status.

   Se algum artifact não estiver `done`:
   - exiba um aviso listando os artifacts incompletos;
   - confirme se o usuário quer prosseguir.

   Para confirmações:
   - use `request_user_input` quando o ambiente suportar;
   - caso contrário, faça uma pergunta direta curta no chat.

3. **Verifique o status de conclusão das tasks**

   Leia o arquivo de tasks, quando existir, e conte as tasks marcadas com `- [ ]` versus `- [x]`.

   Se houver tasks incompletas:
   - exiba um aviso com a quantidade de tasks incompletas;
   - confirme se o usuário quer prosseguir.

   Se não existir arquivo de tasks, prossiga sem aviso relacionado a tasks.

4. **Avalie o estado de sync das delta specs**

   Verifique se existem delta specs em `openspec/changes/<name>/specs/`. Se não existirem, prossiga sem pedir sync.

   Se existirem delta specs:
   - compare cada delta spec com sua spec principal correspondente em `openspec/specs/<capability>/spec.md`;
   - determine quais mudanças seriam aplicadas;
   - mostre um resumo consolidado antes de perguntar.

   Opções recomendadas:
   - se houver mudanças pendentes: `Sync now`, `Archive without syncing`;
   - se já estiver synced: `Archive now`, `Sync anyway`, `Cancel`.

   Se o usuário escolher sync, faça a sincronização diretamente no codebase antes do archive:
   - atualize as specs principais com base nas delta specs analisadas;
   - valide o resultado;
   - prossiga para o archive independentemente da escolha inicial.

5. **Execute o archive**

   Crie o diretório de archive se ele ainda não existir:

   ```bash
   mkdir -p openspec/changes/archive
   ```

   Gere o nome de destino usando a data atual: `YYYY-MM-DD-<change-name>`.

   Verifique se o destino já existe:
   - se sim, falhe com erro e sugira renomear o archive existente ou usar outra data;
   - se não, mova o diretório da change para archive.

   ```bash
   mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
   ```

6. **Exiba o resumo**

   Mostre um resumo incluindo:
   - nome da change;
   - schema usado;
   - local do archive;
   - se as specs foram synced;
   - qualquer aviso relevante sobre artifacts ou tasks incompletos.

## Saída em caso de sucesso

```text
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** ✓ Synced to main specs
```

## Guardrails

- Sempre peça seleção da change quando houver ambiguidade.
- Use o graph de artifacts (`openspec status --json`) para verificar a conclusão.
- Não bloqueie o archive por causa de avisos; apenas informe e confirme.
- Preserve `.openspec.yaml` ao mover para archive.
- Mostre um resumo claro do que aconteceu.
- Se existirem delta specs, sempre execute a avaliação de sync antes de perguntar.
