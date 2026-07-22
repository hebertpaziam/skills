# SonarQube Audit Mode — TypeScript

## Trigger Phrases
Scan the full codebase when the user says:
- "scan sonarqube" / "sonarqube scan"
- "check sonarqube violations" / "check sonarqube rules"
- "list sonarqube issues" / "list violations"
- "audit sonarqube" / "sonarqube audit"
- "review code for sonarqube compliance"

## Methodology

### Phase 1 — Load references
Load all `.md` files under `references/typescript/` to get the full title text for each rule.

### Phase 2 — Hybrid scanning
For each source file in the project (`src/**/*.ts`, `src/**/*.html`, `src/**/*.json`):
1. **Structural scan**: Check code for known anti-patterns from the most relevant categories (e.g., `security-injection` for `eval()`, SQL concatenation; `security-hotspot` for `debugger`, `console.log`; `core-unused` for dead code patterns).
2. **Heuristic scan**: For rules that can't be mechanically detected (e.g., naming conventions, complexity thresholds), apply best-effort static analysis and flag potential issues.

### Phase 3 — Structured report
Output a dual-format report: JSON block (machine-parseable) followed by markdown tables (human-readable).

## Reporting Format

### JSON Block
```json
{
  "summary": {
    "total": 47,
    "blocker": 3,
    "critical": 8,
    "major": 22,
    "minor": 14,
    "info": 0
  },
  "top_files": [
    {"file": "src/app/auth.service.ts", "issues": 12},
    {"file": "src/app/payment.controller.ts", "issues": 8}
  ],
  "top_rules": [
    {"rule": "typescript:S1523", "count": 5, "description": "eval() should not be used"},
    {"rule": "typescript:S4507", "count": 3, "description": "Debug features should not be shipped"}
  ],
  "phases": [
    {
      "name": "Phase 1 — BLOCKERs",
      "rationale": "Must fix immediately — security vulnerabilities and hard violations",
      "total_issues": 3,
      "estimated_effort": "15min",
      "issues": [
        {
          "file": "src/app/auth.service.ts",
          "line": 42,
          "rule": "typescript:S1523",
          "severity": "BLOCKER",
          "description": "eval() should not be used",
          "fix_instruction": "Replace eval() with JSON.parse() for JSON data, or use a safer evaluation method",
          "estimated_effort": "5min"
        }
      ]
    },
    {
      "name": "Phase 2 — Critical Security",
      "rationale": "Security hotspots and injection risks",
      "total_issues": 8,
      "estimated_effort": "30min",
      "issues": []
    },
    {
      "name": "Phase 3 — Major (Code Quality)",
      "rationale": "Code smells, dead code, complexity",
      "total_issues": 22,
      "estimated_effort": "2h",
      "issues": []
    },
    {
      "name": "Phase 4 — Minor / Info",
      "rationale": "Suggestions and low-priority improvements",
      "total_issues": 14,
      "estimated_effort": "1h",
      "issues": []
    }
  ]
}
```

### Markdown Tables

## SonarQube Audit Report

### Summary
- **Total**: 47 issues
- **BLOCKER**: 3 | **CRITICAL**: 8 | **MAJOR**: 22 | **MINOR**: 14 | **INFO**: 0
- **Top files**: `auth.service.ts` (12), `payment.controller.ts` (8)
- **Top rules**: `S1523` eval (5), `S4507` debug (3)

### Phase 1 — BLOCKERs (3 issues, ~15min)
| File | Line | Rule | Description | Fix Instruction |
|------|------|------|-------------|----------------|
| `auth.service.ts` | 42 | `S1523` | eval() should not be used | Replace with JSON.parse() |

### Phase 2 — Critical Security (8 issues, ~30min)
| File | Line | Rule | Description | Fix Instruction |
|------|------|------|-------------|----------------|

### Phase 3 — Major (22 issues, ~2h)
| File | Line | Rule | Description | Fix Instruction |
|------|------|------|-------------|----------------|

### Phase 4 — Minor / Info (14 issues, ~1h)
| File | Line | Rule | Description | Fix Instruction |
|------|------|------|-------------|----------------|

## OpenSpec Integration

This project has OpenSpec configured. After presenting the report, offer to create changes:

**For audits with ≤ 10 issues:**
> "Quer que eu crie uma change consolidada `fix-sonarqube-issues` para corrigir todas as {total} issues?"

**For audits with > 10 issues (recommended phased approach):**
> "São {total} issues. Sugiro dividir em fases:
> 1. **`fix-sonarqube-security`** — Phase 1 + 2 ({blocker + critical} issues, ~{effort})
> 2. **`fix-sonarqube-code-quality`** — Phase 3 + 4 ({major + minor} issues, ~{effort})
>
> Quer que eu crie a change para a Fase 1 primeiro?"

When user confirms, use the data from the JSON block to create the change:
```bash
openspec new change "<phase-name>"
```
Then populate proposal.md with the audit findings, design.md with remediation strategy, and tasks.md with each issue as a task.
