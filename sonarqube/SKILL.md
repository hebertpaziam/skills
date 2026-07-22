---
name: sonarqube
description: 'Prevents SonarQube rule violations during code generation and audits the full codebase on demand. Routes ~976 rules (428 TypeScript + 548 Java) by code context for token efficiency.'
---

# SonarQube Compliance

This skill ensures code never introduces SonarQube violations. It loads only the rules relevant to what you're writing — not all ~976 at once.

## Precedence

SonarQube rules TAKE PRECEDENCE over angular-standards and typescript-standards in case of conflict.

## Decision Tree — Load References by Context

Follow this tree to determine which references to load. Load ALL matching references in Steps 2 and 3 — not just the first match. A class using Spring + SQL + threading should load `java/fw-spring` + `java/security-injection` + `java/core-concurrency` simultaneously.

### Step 0: Audit mode?

If the user's request is about scanning/auditing the full codebase (keywords: "scan sonarqube", "audit sonarqube", "check violations", "list issues", "review compliance"):
→ load `{lang}/audit` reference and jump to **Phase 1** inside it (skip all steps below).

### Step 1: What language / file type?

```
*.component.ts (Angular)
  → lang = "typescript"; load typescript/base + typescript/fw-angular; go to Step 2-TS + Step 3-TS
*.tsx, *.jsx
  → lang = "typescript"; load typescript/base + typescript/fw-react; go to Step 3-TS
*.spec.ts, *.test.ts
  → lang = "typescript"; load typescript/base + typescript/testing; done
*.html
  → lang = "typescript"; load typescript/base + typescript/browser-aria + typescript/browser-dom; done
*.ts, *.js, *.mjs, *.cjs
  → lang = "typescript"; load typescript/base; go to Step 2-TS + Step 3-TS
*Test.java, *Tests.java, *TestCase.java, *IT.java, *ITCase.java
  → lang = "java"; load java/base + java/testing; done
*.java
  → lang = "java"; load java/base; go to Step 2-Java + Step 3-Java
*.py
  → lang = "python"; go to Step 2-TS (generic)
*.kt, *.kts
  → lang = "kotlin"; go to Step 2-TS (generic)
```

When a `{lang}` directory doesn't exist yet for the detected language, load nothing (no SonarQube rules available).

### Step 2-TS: Domain context — TypeScript/JavaScript (load ALL that apply)

```
Security-sensitive code (auth, crypto, HTTP, cookies)
  → load typescript/security-hotspot
Formats SQL or external commands
  → load typescript/security-injection
Uses regex patterns (/.../, RegExp, new RegExp)
  → load typescript/core-regex
Uses async/await/Promise
  → load typescript/core-async
AWS SDK imports or S3/RDS/SQS references
  → load typescript/cloud-aws
Angular-specific (@angular/* imports)
  → load typescript/fw-angular
React-specific (react imports, JSX)
  → load typescript/fw-react
```

### Step 2-Java: Domain context — Java (load ALL that apply)

```
Spring/Jakarta annotations (@RestController, @Service, @Autowired, @Component, @Bean, @RequestMapping, @Transactional)
  → load java/fw-spring
Security-sensitive code (auth, crypto, cookies, CORS, HTTP security)
  → load java/security-hotspot + java/security-crypto
SQL, JDBC, JPA, PreparedStatement, EntityManager, Hibernate
  → load java/security-injection
Threading, synchronized, Thread, ExecutorService, Lock, volatile, concurrent.*
  → load java/core-concurrency
.stream(), .map(), .filter(), .collect(), lambdas, functional interfaces
  → load java/core-streams
Pattern, Matcher, .matches(), regex patterns
  → load java/core-regex
```

### Step 3-TS: Constructs — TypeScript/JavaScript (load ALL that apply)

```
switch / case
  → load typescript/core-control-flow
for / while / do
  → load typescript/core-control-flow
if / else
  → load typescript/core-control-flow
class / extends / constructor
  → load typescript/core-oop
import / export
  → load typescript/core-modules
enum / type / interface
  → load typescript/core-types
array methods / delete / spread
  → load typescript/core-arrays
string concatenation / template literals / magic numbers
  → load typescript/core-formatting
comments (TODO, FIXME, commented code)
  → load typescript/core-comments
error handling (try/catch/throw)
  → load typescript/core-errors
operator use (===, ==, bitwise, ternary, &&, ||)
  → load typescript/core-operators
```

### Step 3-Java: Constructs — Java (load ALL that apply)

```
switch / case / if / else / for / while / do
  → load java/core-control-flow
class / extends / implements / abstract / constructor / sealed / record
  → load java/core-oop
Collection / Map / List / Set / Queue / Deque
  → load java/core-collections
try / catch / throw / throws / finally
  → load java/core-errors
enum / interface / generics / type casts
  → load java/core-types
== / != / instanceof / bitwise / ternary operators
  → load java/core-operators
TODO / FIXME / NOSONAR / commented-out code
  → load java/core-comments
```
