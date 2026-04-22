---
name: typescript-standards
description: 'Aplique padrões TypeScript do projeto ao criar ou refatorar arquivos .ts, .tsx e tipos compartilhados. Use quando a tarefa exigir tipagem, interfaces, escolhas entre Record e Map, ou padronização de estilo TypeScript.'
---

# TypeScript Standards

## Quando usar

- Criar ou refatorar arquivos TypeScript do projeto.
- Definir interfaces, types e contratos compartilhados.
- Padronizar tipagem em `*.ts` e `*.tsx`.
- Escolher entre `Record` e `Map`.
- Ajustar estilo e consistência de código TypeScript.

## Objetivo

- Manter tipagem forte, previsível e legível.
- Evitar `any` e reduzir ambiguidade de tipos.
- Padronizar nomenclatura, estruturas de dados e estilo TypeScript.
- Preservar simplicidade e alinhamento com os padrões existentes do repositório.

## Regras principais

- Nunca usar `any`; quando o tipo for incerto, usar `unknown`.
- Interfaces devem começar com `I`.
- Preferir `Record` a `Map` quando chaves de objeto forem suficientes.
- Usar `Map` apenas quando sua API específica ou suporte a chaves não serializáveis for realmente necessário.
- Usar aspas simples e ponto e vírgula.
- Preferir um contrato por arquivo, a menos que os tipos sejam fortemente relacionados.
- Antes de introduzir novos tipos, verificar se já existe um contrato equivalente no domínio.
- Nomear tipos e interfaces de forma descritiva, sem abreviações desnecessárias.

## Procedimento

1. Identifique os contratos e tipos realmente necessários para a mudança.
2. Reutilize tipos existentes antes de criar novos.
3. Modele o tipo com a opção mais restritiva e clara possível.
4. Se houver incerteza de tipo, use `unknown` e faça narrowing explícito.
5. Escolha `Record` ou `Map` com base na necessidade real de API e de chave.
6. Mantenha nomes de interfaces e types alinhados ao domínio.
7. Revise o arquivo para garantir consistência com o estilo TypeScript do projeto.

## Checklist de qualidade

- Nenhum `any` foi introduzido.
- Interfaces seguem o prefixo `I`.
- `Record` foi preferido quando suficiente.
- `Map` só foi usado com justificativa técnica real.
- O arquivo usa aspas simples e ponto e vírgula.
- Não houve proliferação desnecessária de tipos redundantes.
- Os nomes estão claros e alinhados ao domínio.
