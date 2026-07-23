## ADDED Requirements

### Requirement: XML audit reference
The skill SHALL have a `references/config/xml.md` file covering XXE, web.xml security, Spring datasource, and logging configuration rules.

#### Scenario: XXE via external DTD
- **WHEN** an XML file has a DOCTYPE referencing an HTTP DTD
- **THEN** the rule S2755 SHALL flag it as BLOCKER

#### Scenario: Missing HttpOnly in web.xml
- **WHEN** a web.xml lacks `<http-only>true</http-only>` in session config, or has it commented out
- **THEN** the rule S3330 SHALL flag it as CRITICAL

#### Scenario: Missing Secure flag in web.xml
- **WHEN** a web.xml lacks `<secure>true</secure>` in cookie config
- **THEN** the rule S2092 SHALL flag it as CRITICAL

#### Scenario: Credentials in datasource XML
- **WHEN** an XML file contains username/password in plaintext for a datasource bean
- **THEN** the rule S2068 SHALL flag it as BLOCKER

#### Scenario: Debug logging in production config
- **WHEN** a log4j.xml or logback.xml has root level set to DEBUG
- **THEN** the rule S4507 SHALL flag it as MAJOR

### Requirement: Secrets audit reference
The skill SHALL have a `references/config/secrets.md` file covering .properties, .yml, .yaml, and .env files for hardcoded credentials, tokens, and keys.

#### Scenario: Password in properties
- **WHEN** a .properties file has a key like `mail.password=actualvalue` (not a placeholder)
- **THEN** the rule S2068 SHALL flag it as BLOCKER

#### Scenario: JWT token in properties
- **WHEN** a .properties file contains a value matching JWT pattern `eyJ...`
- **THEN** the rule S6418 SHALL flag it as BLOCKER

#### Scenario: Cryptographic key in properties
- **WHEN** a .properties file has `APP_KEY=` or `APP_IV=` with a literal value
- **THEN** the rule S6437 SHALL flag it as BLOCKER

#### Scenario: Placeholder values are not flagged
- **WHEN** a config file has `password=${DB_PASSWORD}` (environment variable placeholder)
- **THEN** it SHALL NOT be flagged as a violation
