## ADDED Requirements

### Requirement: Compact report body
The main audit report SHALL use a compact format: each file with violations is listed once, with violation type and count.

#### Scenario: Grouped violations
- **WHEN** file `login.jsp` has 5 S5131 violations and 2 S2068 violations
- **THEN** the report SHALL show one entry for `login.jsp` with `S5131 (5), S2068 (2)`

#### Scenario: All files listed
- **WHEN** multiple files have the same violation type
- **THEN** ALL files SHALL be listed — not just the first occurrence

### Requirement: Correction prompt with line detail
The report SHALL include a correction prompt section at the end with line-by-line detail for each violation, suitable for automated fixing by an AI agent.

#### Scenario: Line-level detail in prompt
- **WHEN** the correction prompt section is generated
- **THEN** each violation SHALL include file path, line number, violation code, and specific fix instruction

### Requirement: All files with violations listed
The report SHALL list EVERY file that has at least one violation. It SHALL NOT use "first occurrence only" or sampling.

#### Scenario: No sampling
- **WHEN** 60 JSP files have violations
- **THEN** all 60 SHALL appear in the report, not just a representative sample
