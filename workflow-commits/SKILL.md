---
name: workflow-commits
description: 'Aplique o workflow operacional do projeto ao sugerir comandos, executar scripts e preparar commits. Use quando a tarefa envolver package.json, packageManager, scripts de setup/dev/build/test/lint, ou mensagens de commit.'
---

# Workflow and Commits

## Quando usar

- Sugerir ou executar comandos do projeto.
- Decidir como rodar setup, dev, build, test ou lint.
- Validar scripts disponíveis no `package.json`.
- Preparar commits ou orientar mensagens de commit.

## Objetivo

- Usar o workflow real do repositório, sem assumir comandos genéricos.
- Priorizar scripts e package manager já configurados.
- Manter consistência nas mensagens de commit.
- Evitar ações destrutivas ou fora do fluxo acordado.

## Regras principais

- Antes de sugerir ou executar comandos, inspecione `package.json` para identificar `packageManager` e `scripts` disponíveis.
- Não assuma comandos padrão como `npm start` ou `npm test` sem confirmação explícita no projeto.
- Prefira scripts já definidos para setup, dev, build, test e lint.
- Se o script necessário não existir, informe isso claramente e use a alternativa válida mais próxima.
- Use Conventional Commits em English, curtos e objetivos.
- Faça commit apenas do que estiver staged.
- Nunca faça push para o remoto automaticamente.

## Procedimento

1. Abra `package.json` antes de decidir qualquer comando.
2. Identifique `packageManager` e os `scripts` relevantes para a tarefa.
3. Escolha o script existente mais específico para a ação necessária.
4. Se não houver script adequado, informe a limitação antes de propor alternativa.
5. Ao preparar commit, confirme que apenas mudanças staged serão incluídas.
6. Escreva a mensagem de commit usando Conventional Commits em English.

## Checklist de qualidade

- `package.json` foi inspecionado antes de sugerir ou executar comandos.
- O `packageManager` do projeto foi respeitado.
- Nenhum comando padrão foi presumido sem suporte no projeto.
- Scripts existentes foram priorizados.
- A limitação foi explicitada quando faltou script.
- A mensagem de commit segue Conventional Commits em English.
- Não há push automático.
