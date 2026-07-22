# SonarQube Audit Mode — Java

## Trigger Phrases
Scan the full codebase when the user says:
- "scan sonarqube" / "sonarqube scan"
- "check sonarqube violations" / "check sonarqube rules"
- "list sonarqube issues" / "list violations"
- "audit sonarqube" / "sonarqube audit"
- "review code for sonarqube compliance"

## Methodology

### Phase 1 — Inventory
1. List all `.java` source files (exclude generated code, build output)
2. Categorize by domain: controllers, services, repositories, models, DTOs, config, tests, utils

### Phase 2 — Targeted scan
For each category, load the relevant reference files:
- Controllers → fw-spring + security-hotspot + security-injection
- Services → core-oop + core-errors + core-concurrency + fw-spring
- Repositories → security-injection + core-errors
- Models/DTOs → core-naming + core-oop + core-types
- Config → fw-spring + security-hotspot + security-crypto
- Tests → testing
- Utils → core-complexity + core-formatting + core-unused

### Phase 3 — Structured report
Output a dual-format report: JSON block (machine-parseable) followed by markdown tables (human-readable).

## Reporting Format

### JSON Block
```json
{
  "summary": {
    "total": 35,
    "blocker": 2,
    "critical": 5,
    "major": 18,
    "minor": 10,
    "info": 0
  },
  "top_files": [
    {"file": "src/main/java/com/app/PaymentController.java", "issues": 9},
    {"file": "src/main/java/com/app/AuthService.java", "issues": 7}
  ],
  "top_rules": [
    {"rule": "java:S2068", "count": 4, "description": "Credentials should not be hard-coded"},
    {"rule": "java:S1313", "count": 3, "description": "IP addresses should not be hard-coded"}
  ],
  "phases": [
    {
      "name": "Phase 1 — BLOCKERs",
      "rationale": "Must fix immediately — security vulnerabilities and hard violations",
      "total_issues": 2,
      "estimated_effort": "10min",
      "issues": [
        {
          "file": "src/main/java/com/app/AuthService.java",
          "line": 15,
          "rule": "java:S2068",
          "severity": "BLOCKER",
          "description": "Credentials should not be hard-coded",
          "fix_instruction": "Move credentials to environment variables or a secrets manager, inject via @Value or configuration properties",
          "estimated_effort": "5min"
        }
      ]
    },
    {
      "name": "Phase 2 — Critical Security",
      "rationale": "Security hotspots and injection risks",
      "total_issues": 5,
      "estimated_effort": "25min",
      "issues": []
    },
    {
      "name": "Phase 3 — Major (Code Quality)",
      "rationale": "Code smells, dead code, complexity",
      "total_issues": 18,
      "estimated_effort": "2h",
      "issues": []
    },
    {
      "name": "Phase 4 — Minor / Info",
      "rationale": "Suggestions and low-priority improvements",
      "total_issues": 10,
      "estimated_effort": "45min",
      "issues": []
    }
  ]
}
```

### Markdown Tables

## SonarQube Audit Report

### Summary
- **Total**: 35 issues
- **BLOCKER**: 2 | **CRITICAL**: 5 | **MAJOR**: 18 | **MINOR**: 10 | **INFO**: 0
- **Top files**: `PaymentController.java` (9), `AuthService.java` (7)
- **Top rules**: `S2068` hardcoded credentials (4), `S1313` hardcoded IP (3)

### Phase 1 — BLOCKERs (2 issues, ~10min)
| File | Line | Rule | Description | Fix Instruction |
|------|------|------|-------------|----------------|
| `AuthService.java` | 15 | `S2068` | Credentials should not be hard-coded | Move to env vars or secrets manager |

### Phase 2 — Critical Security (5 issues, ~25min)
| File | Line | Rule | Description | Fix Instruction |
|------|------|------|-------------|----------------|

### Phase 3 — Major (18 issues, ~2h)
| File | Line | Rule | Description | Fix Instruction |
|------|------|------|-------------|----------------|

### Phase 4 — Minor / Info (10 issues, ~45min)
| File | Line | Rule | Description | Fix Instruction |
|------|------|------|-------------|----------------|

## Important
- Custom parameters and thresholds are already documented in each reference file description (e.g., S107 max=7, S3776 Threshold=15)
- Do NOT apply rules that are not in the SonarMapfre3.0 profile

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
