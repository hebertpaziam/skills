## ADDED Requirements

### Requirement: JSP audit reference
The skill SHALL have a `references/web/jsp.md` file covering all SonarQube JSP rules, with focus on XSS via unescaped EL expressions.

#### Scenario: Unescaped EL in HTML context
- **WHEN** a JSP contains `${variable}` without `<c:out>` or `fn:escapeXml()` in HTML text content
- **THEN** the rule S5131 SHALL flag it as CRITICAL

#### Scenario: Unescaped EL in JavaScript context
- **WHEN** a JSP contains `${variable}` inside a `<script>` block
- **THEN** the rule S5131 SHALL flag it as BLOCKER

#### Scenario: Password in hidden field
- **WHEN** a JSP renders a password value in an HTML field (e.g., `<input type="hidden" value="${vo.senha}">`)
- **THEN** the rule S2068 SHALL flag it as BLOCKER

#### Scenario: Scriptlet with exception message
- **WHEN** a JSP uses `<%= e.getMessage() %>` or similar scriptlet rendering
- **THEN** the rule S5131 SHALL flag it as BLOCKER

#### Scenario: Open redirect
- **WHEN** a JSP uses an unvalidated parameter in form action or redirect (e.g., `<form action="${parametros.url}">`)
- **THEN** the rule S5146 SHALL flag it as CRITICAL

### Requirement: JavaScript legacy audit reference
The skill SHALL have a `references/web/javascript.md` file covering rules for standalone JS files (non-module, non-framework).

#### Scenario: eval usage
- **WHEN** a JS file uses `eval()`
- **THEN** the rule S1523 SHALL flag it as BLOCKER

#### Scenario: console.log in production
- **WHEN** a JS file contains `console.log` or `console.debug`
- **THEN** the rule S106 SHALL flag it as MAJOR

### Requirement: JSP verification procedure
The `web/jsp.md` reference SHALL include a step-by-step procedure for the audit agent: list ALL EL expressions, check each for escaping, identify context (HTML/attribute/JS/URL), classify severity by context, count per file.

#### Scenario: Agent follows procedure
- **WHEN** the agent audits a JSP file
- **THEN** it SHALL enumerate every `${...}` expression and verify each individually
