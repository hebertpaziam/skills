## ADDED Requirements

### Requirement: Cross-language references use dual prefixes
Every rule in `universal/scan-all.md`, `config/xml.md`, `config/secrets.md`, and `web/jsp.md` SHALL list the rule ID with prefixes for all applicable languages.

#### Scenario: Universal rule with dual prefix
- **WHEN** rule S2068 is listed in `universal/scan-all.md`
- **THEN** it SHALL appear as `java:S2068` / `javascript:S2068` (or all applicable prefixes)

#### Scenario: JSP rule with java prefix
- **WHEN** rule S5131 is listed in `web/jsp.md`
- **THEN** it SHALL appear with `java:S5131` prefix (JSP runs in Java context)

### Requirement: JavaScript uses TypeScript references
The SKILL.md SHALL NOT have a separate `web` category for `.js` files. JavaScript files SHALL use `typescript/*` references.

#### Scenario: JS file in project without tsconfig
- **WHEN** a `.js` file is found in any project
- **THEN** it SHALL be classified as `typescript` category and use `typescript/*` references

#### Scenario: web/javascript.md removed
- **WHEN** the change is implemented
- **THEN** `references/web/javascript.md` SHALL no longer exist
