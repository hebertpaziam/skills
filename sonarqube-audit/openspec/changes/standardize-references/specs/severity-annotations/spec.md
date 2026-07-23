## ADDED Requirements

### Requirement: Every rule has explicit severity
Every rule line in every reference file SHALL end with a severity annotation in the format `(BLOCKER|CRITICAL|MAJOR|MINOR|INFO)`.

#### Scenario: Java rule with severity
- **WHEN** a rule in `java/core-control-flow.md` is listed
- **THEN** it SHALL follow the format `- java:S127 — "for" loop stop conditions should be invariant (MAJOR)`

#### Scenario: TypeScript rule with severity
- **WHEN** a rule in `typescript/core-async.md` is listed
- **THEN** it SHALL follow the format `- typescript:S4123 — "await" should only be used with promises (MAJOR)`

### Requirement: Severity values are from SonarQube defaults
The severity annotation SHALL match the default SonarQube severity for that rule. When unknown, use MAJOR as default.

#### Scenario: Security rules are BLOCKER or CRITICAL
- **WHEN** a rule is in `security-hotspot` or `security-injection`
- **THEN** its severity SHALL be BLOCKER or CRITICAL (never MINOR)
