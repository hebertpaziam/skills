# Types errors and result shapes

## When to Use

- Model return values of operations that can fail, domain errors and boundary responses.

## Local Rules

- Be explicit about success and failure in contracts that require it.
- Prefer predictable and narrow shapes over overly generic error objects.
- Do not use exceptions as the only mechanism in flows where expected failure is part of the contract.
- If the project uses a `Result` pattern, maintain consistency; if it does not, do not introduce an internal framework without real need.

## Quality Checklist

- Success and failure are clear in the contract.
- The chosen format is consistent with the project's codebase.
