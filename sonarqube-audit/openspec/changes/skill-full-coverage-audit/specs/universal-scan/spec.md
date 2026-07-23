## ADDED Requirements

### Requirement: Universal rules file
The skill SHALL have a `references/universal/scan-all.md` file containing 10 cross-language rules that apply to ANY text file in the repository.

#### Scenario: Rules cover credentials
- **WHEN** any text file contains hardcoded passwords, API keys, tokens, or secrets
- **THEN** rules S2068, S6437, S6418 SHALL detect them regardless of file extension

#### Scenario: Rules cover network patterns
- **WHEN** any text file contains hardcoded IPs, HTTP URLs, or hardcoded URIs
- **THEN** rules S1313, S5332, S1075 SHALL detect them

#### Scenario: Rules cover dead code
- **WHEN** any text file contains commented-out code, FIXME, or TODO tags
- **THEN** rules S125, S1134, S1135 SHALL detect them

### Requirement: Universal rules applied to all files
The audit agent SHALL apply `universal/scan-all.md` rules to EVERY text file discovered in the inventory, before any category-specific rules.

#### Scenario: JSP gets universal rules
- **WHEN** a .jsp file contains a hardcoded IP address
- **THEN** the universal scan SHALL flag it with S1313, in addition to any JSP-specific rules

### Requirement: Replaces blockers.md
The `universal/scan-all.md` file SHALL replace `universal/blockers.md`. The old file SHALL be removed.

#### Scenario: Old file removed
- **WHEN** the change is implemented
- **THEN** `references/universal/blockers.md` SHALL no longer exist and all references in SKILL.md SHALL point to `scan-all.md`
