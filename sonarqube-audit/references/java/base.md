# base — Java

This file is ALWAYS loaded when editing Java files. It contains universal BLOCKER rules (SHALL NEVER be violated), default baseline loads, and the reference catalog.

## Universal BLOCKERs

These SHALL NEVER be violated.

- `java:S2068` — Never hard-code credentials, passwords, tokens, API keys (credentialWords=password,passwd,pwd,passphrase,java.naming.security.credentials)
- `java:S2755` — Never parse XML without disabling external entity resolution
- `java:S1313` — Never hard-code IP addresses
- `java:S2077` — Never format SQL queries by concatenating user input
- `java:S4502` — Never disable CSRF protections
- `java:S6437` — Credentials should not be hard-coded
- `java:S6418` — Secrets should not be committed to source code
- `javasecurity:S2076` — OS commands should not be vulnerable to command injection attacks
- `javasecurity:S3649` — SQL queries should not be vulnerable to injection attacks
- `javasecurity:S5131` — Endpoints should not be vulnerable to reflected cross-site scripting (XSS) attacks
- `java:S1451` — All source files SHALL have copyright/license headers
- `java:S4721` — Never execute OS commands with shell interpreter

## Default baseline

When no specific construct is detected in `.java` files, these are always relevant:
- `java/core-unused` (dead code, unused imports, redundant casts)
- `java/core-formatting` (code style, API preferences, modern Java idioms)
- `java/core-naming` (naming conventions for methods, classes, fields, packages)

## Reference Catalog

| Reference ID | Rules | When to load |
|--------------|-------|-------------|
| `java/core-naming` | 14 | Naming conventions for classes, methods, fields, packages |
| `java/core-control-flow` | 24 | Writing if/else, switch, for/while loops |
| `java/core-oop` | 99 | Classes, inheritance, interfaces, constructors, equals/hashCode |
| `java/core-unused` | 17 | Dead code, unused imports, redundant casts |
| `java/core-formatting` | 70 | Code style, API preferences, modern Java idioms |
| `java/core-concurrency` | 35 | Threading, synchronization, volatile, locks |
| `java/core-errors` | 25 | Exception handling, try-with-resources |
| `java/core-types` | 43 | Generics, casts, serialization, null safety |
| `java/core-complexity` | 6 | Cognitive complexity, method parameters, brain methods |
| `java/core-collections` | 9 | Collection, Map, List, Set API usage |
| `java/core-streams` | 10 | Stream API, lambdas, functional interfaces |
| `java/core-regex` | 19 | Regular expressions, Pattern, Matcher |
| `java/core-operators` | 17 | Comparison, equality, bitwise, math operators |
| `java/core-comments` | 4 | TODO, FIXME, commented-out code |
| `java/security-hotspot` | 39 | Security hotspots (hardcoded credentials, CORS, CSRF) |
| `java/security-injection` | 38 | SQL, command, LDAP, XSS, SSRF injection |
| `java/security-crypto` | 11 | Cryptography, TLS/SSL, certificate validation |
| `java/testing` | 32 | JUnit assertions, test lifecycle, mocking |
| `java/fw-spring` | 36 | Spring/Jakarta framework, REST controllers, DI |
| `java/audit` | — | User requests full Java codebase scan for violations |
