## Context

A skill sonarqube-audit tem ~50 arquivos de referência com regras SonarQube. Atualmente 3 formatos coexistem, causando inconsistência na análise e no faseamento do relatório.

## Goals / Non-Goals

**Goals:**
- Formato único e previsível em todas as referências
- Severidade explícita em 100% das regras para faseamento correto
- IDs sem ambiguidade — qualquer referência cross-linguagem lista prefixos de todas as linguagens
- JS standalone coberto pelas mesmas ~300 regras que TypeScript

**Non-Goals:**
- Converter todas as regras para formato narrativo expandido (só regras complexas)
- Alterar o conteúdo semântico das regras (só formato e metadados)
- Adicionar regras novas (só padronizar as existentes)

## Decisions

### 1. Severidade em todas as regras — formato `(SEVERIDADE)` no final

Regras simples ficam compactas com severidade adicionada:
```
- java:S127 — "for" loop stop conditions should be invariant (MAJOR)
```

Regras complexas (segurança, patterns) mantêm formato expandido que já têm.

### 2. JS standalone usa typescript/* — eliminar web/javascript.md

O SonarQube usa regras idênticas para JS e TS (~95% overlap). Em vez de manter 5 regras em web/javascript.md, o SKILL.md instrui que `.js` carrega `typescript/*`. Regras TS-only (S3353 const assertion, type intersections) são ignoradas pelo agente quando o arquivo é `.js` puro.

### 3. Prefixos duplos nas referências cross-linguagem

```
Antes: - `S2068` — Credenciais hardcoded (BLOCKER)
Depois: - `java:S2068` / `javascript:S2068` — Credenciais hardcoded (BLOCKER)
```

Isso elimina ambiguidade no relatório — o agente sabe exatamente qual ID reportar.

### 4. Critério para formato expandido vs compacto

Expandir quando: pattern matching com regex, exceções de falso positivo, severidade variável por contexto, procedimento de verificação.
Compacto quando: título autoexplicativo, sem edge cases.

## Risks / Trade-offs

- **[Regras TS-only aplicadas a JS]** → Mitigação: nota no SKILL.md instruindo agente a ignorar regras de tipos/const quando arquivo é .js
- **[Volume de edição]** → ~50 arquivos precisam de severidade adicionada — mecânico mas volumoso
