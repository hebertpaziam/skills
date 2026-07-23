## ADDED Requirements

### Requirement: Sub-agents dispatched by category
The SKILL.md SHALL instruct the main agent to dispatch sub-agents in parallel, one per file category (source, template, config, typescript).

#### Scenario: Parallel execution
- **WHEN** the project has Java, JSP, and XML files
- **THEN** the agent SHALL launch 3 sub-agents concurrently: one for source (Java), one for template (JSP), one for config (XML)

#### Scenario: Each agent gets focused context
- **WHEN** a sub-agent is launched for the template category
- **THEN** it SHALL receive only JSP files and `web/jsp.md` + `universal/scan-all.md` references

### Requirement: Universal rules in every sub-agent
Every sub-agent SHALL also apply `universal/scan-all.md` rules to its assigned files, in addition to category-specific rules.

#### Scenario: Config agent applies universal rules
- **WHEN** the config sub-agent audits a .properties file
- **THEN** it SHALL check both `config/secrets.md` rules AND `universal/scan-all.md` rules
