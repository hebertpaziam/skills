---
name: git-commit
description: 'Execute git commit com análise de Conventional Commit messages, intelligent staging e geração de messages. Use quando o usuário pedir para fazer commit de mudanças, criar um git commit ou mencionar "/commit". Suporta: (1) Auto-detectar type e scope a partir das mudanças, (2) Gerar Conventional Commit messages a partir do diff, (3) Commit interativo com overrides opcionais de type/scope/description, (4) Intelligent file staging para logical grouping'
license: MIT
allowed-tools: Bash
---

# Git Commit com Conventional Commits

## Visão Geral

Crie git commits padronizados e semânticos usando a especificação Conventional Commits. Analise o diff real para determinar o type, o scope e a message apropriados.

## Formato de Conventional Commit

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Tipos de Commit

| Type       | Objetivo                             |
| ---------- | ------------------------------------ |
| `feat`     | Nova feature                         |
| `fix`      | Bug fix                              |
| `docs`     | Apenas documentation                 |
| `style`    | Formatting/style (sem lógica)        |
| `refactor` | Code refactor (sem feature/fix)      |
| `perf`     | Melhoria de performance              |
| `test`     | Adicionar/atualizar tests            |
| `build`    | Build system/dependencies            |
| `ci`       | Mudanças de CI/config                |
| `chore`    | Maintenance/misc                     |
| `revert`   | Reverter commit                      |

## Breaking Changes

```
# Exclamation mark após type/scope
feat!: remove deprecated endpoint

# Footer de BREAKING CHANGE
feat: allow config to extend other configs

BREAKING CHANGE: `extends` key behavior changed
```

## Fluxo

### 1. Analisar Diff

```bash
# Se houver files staged, use staged diff
git diff --staged

# Se nada estiver staged, use working tree diff
git diff

# Também verifique o status
git status --porcelain
```

### 2. Stage Files (se necessário)

Se nada estiver staged ou se você quiser agrupar as mudanças de forma diferente:

```bash
# Fazer stage de files específicos
git add path/to/file1 path/to/file2

# Fazer stage por pattern
git add *.test.*
git add src/components/*

# Interactive staging
git add -p
```

**Nunca faça commit de secrets** (`.env`, `credentials.json`, private keys).

### 3. Gerar Commit Message

Analise o diff para determinar:

- **Type**: Que tipo de mudança é esta?
- **Scope**: Qual área/module foi afetada?
- **Description**: Resumo em uma linha do que mudou (present tense, imperative mood, `<72 chars>`)

### 4. Executar Commit

```bash
# Single line
git commit -m "<type>[scope]: <description>"

# Multi-line com body/footer
git commit -m "$(cat <<'EOF'
<type>[scope]: <description>

<optional body>

<optional footer>
EOF
)"
```

## Best Practices

- Uma mudança lógica por commit
- Use present tense: `add` e não `added`
- Use imperative mood: `fix bug` e não `fixes bug`
- Referencie issues: `Closes #123`, `Refs #456`
- Mantenha a description com menos de 72 caracteres

## Git Safety Protocol

- NEVER atualize o git config
- NEVER execute destructive commands (`--force`, `hard reset`) sem pedido explícito
- NEVER pule hooks (`--no-verify`) a menos que o usuário peça
- NEVER faça force push para `main`/`master`
- Se o commit falhar por causa de hooks, corrija e crie um NEW commit (`don't amend`)
