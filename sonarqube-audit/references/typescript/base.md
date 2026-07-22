# base — TypeScript / JavaScript

This file is ALWAYS loaded when editing TypeScript or JavaScript files. It contains universal BLOCKER rules (SHALL NEVER be violated), default baseline loads, and the reference catalog.

## Universal BLOCKERs

These SHALL NEVER be violated.

- `typescript:S1523` / `javascript:S1523` — Never use `eval()` or `Function()` constructor
- `typescript:S4507` / `javascript:S4507` — Never ship debug features in production code
- `typescript:S1525` / `javascript:S1525` — Never leave `debugger` statements in committed code
- `typescript:S2819` / `javascript:S2819` — Always verify origins during cross-origin communications
- `typescript:S4502` / `javascript:S4502` — Never disable CSRF protections
- `typescript:S5131` / `javascript:S5131` — Never render unsanitized user input (reflected XSS)
- `typescript:S5696` / `javascript:S5696` — Never write unsanitized data to the DOM (stored XSS)
- `typescript:S1526` / `javascript:S1526` — Variables declared with `var` SHALL be hoist-safe or use `let`/`const`
- `typescript:S3504` / `javascript:S3504` — Always use `let` or `const`, never bare assignments
- `typescript:S3353` — Mark variables as `const` when never reassigned
- `typescript:S2068` / `javascript:S2068` — Never hard-code credentials, passwords, tokens, API keys
- `typescript:S2755` / `javascript:S2755` — Never parse XML without disabling external entity resolution
- `typescript:S1451` / `javascript:S1451` — All source files SHALL have copyright/license headers
- `typescript:S1313` / `javascript:S1313` — Never hard-code IP addresses
- `typescript:S2077` / `javascript:S2077` — Never format SQL queries by concatenating user input
- `typescript:S4721` / `javascript:S4721` — Never execute OS commands with shell interpreter

## Default baseline

When no specific construct is detected, these are always relevant:
- `typescript/core-unused` (covers dead code, redundant declarations, unused parameters)
- `typescript/core-formatting` (booleans, semicolons, trailing commas, quotes)

## Reference Catalog

| Reference ID | Rules | When to load |
|--------------|-------|-------------|
| `typescript/browser-aria` | 15 | Editing HTML with ARIA roles or accessibility |
| `typescript/browser-dom` | 16 | Editing HTML templates or DOM elements |
| `typescript/cloud-aws` | 1 | Using AWS SDK or referencing AWS resources |
| `typescript/core-arrays` | 8 | Using array methods, delete, or spread |
| `typescript/core-async` | 6 | Using async/await/Promise |
| `typescript/core-comments` | 6 | Writing TODO/FIXME/NOSONAR comments |
| `typescript/core-complexity` | 9 | Writing complex functions or expressions |
| `typescript/core-control-flow` | 38 | Writing if/else, switch, for/while loops |
| `typescript/core-errors` | 10 | Handling exceptions or errors |
| `typescript/core-formatting` | 27 | General code style (booleans, semicolons, quotes) |
| `typescript/core-modules` | 11 | Managing imports and exports |
| `typescript/core-naming` | 4 | Naming conventions for classes, functions, variables |
| `typescript/core-oop` | 9 | Writing classes, getters/setters, constructors |
| `typescript/core-operators` | 14 | Using comparison, bitwise, ternary operators |
| `typescript/core-regex` | 23 | Writing or using regular expressions |
| `typescript/core-types` | 14 | Declaring types, enums, unions, interfaces |
| `typescript/core-unused` | 79 | Dead code, redundant declarations, unused members |
| `typescript/fw-angular` | 1 | Angular-specific code (sanitization) |
| `typescript/fw-react` | 35 | React-specific code or JSX |
| `typescript/security-crypto` | 5 | Cryptographic operations |
| `typescript/security-hotspot` | 68 | Security-sensitive operations (cookies, CORS, CSP) |
| `typescript/security-injection` | 14 | SQL, command injection, XSS, SSRF |
| `typescript/testing` | 15 | Writing test files with Mocha/Chai |
| `typescript/audit` | — | User requests full codebase scan for violations |
