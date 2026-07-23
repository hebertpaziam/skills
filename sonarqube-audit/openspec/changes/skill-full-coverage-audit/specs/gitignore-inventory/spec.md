## ADDED Requirements

### Requirement: Gitignore-based file discovery
The audit's first step (Etapa 1) SHALL read the project's `.gitignore` file and use it to build an exclusion list. It SHALL then discover ALL text files not matching exclusion patterns.

#### Scenario: No extension filtering
- **WHEN** the inventory step runs
- **THEN** it SHALL NOT filter by file extension — all text files are included

#### Scenario: Gitignore exclusions respected
- **WHEN** `.gitignore` contains `node_modules/`, `target/`, `*.class`
- **THEN** files matching those patterns SHALL be excluded from inventory

#### Scenario: Binary files excluded
- **WHEN** a file is binary (images, compiled classes, archives)
- **THEN** it SHALL be excluded from the inventory automatically

### Requirement: Category classification
After discovery, each file SHALL be classified into a category for routing to the appropriate reference rules.

#### Scenario: JSP classified as template
- **WHEN** a file has extension `.jsp`
- **THEN** it SHALL be classified as `template` category and routed to `web/jsp.md`

#### Scenario: Properties classified as config
- **WHEN** a file has extension `.properties`, `.yml`, `.yaml`, or `.env`
- **THEN** it SHALL be classified as `config` category and routed to `config/secrets.md`

#### Scenario: XML classified as config
- **WHEN** a file has extension `.xml`
- **THEN** it SHALL be classified as `config` category and routed to `config/xml.md`

#### Scenario: Java classified as source
- **WHEN** a file has extension `.java`
- **THEN** it SHALL be classified as `source` category and routed to existing Java references

#### Scenario: Unknown extension gets universal only
- **WHEN** a file has an unmapped extension (e.g., `.txt`, `.csv`, `.sh`)
- **THEN** it SHALL still receive universal rules from `scan-all.md`
