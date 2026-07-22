# Pragmatic duplication vs abstraction

## When to Use

- Decide whether two similar snippets should be unified now.

## Local Rules

- Not every visual similarity is real duplication.
- Extract an abstraction when there is the same rule, same variation, and same direction of evolution.
- Do not unify snippets that still look alike but evolve for different reasons.
- Small, local duplication can be better than an opaque and premature abstraction.

## Mental Test Example

- If I change one, will the other almost certainly change for the same reason?
- If not, it may not be time to abstract yet.

## Quality Checklist

- The abstraction arose from real duplication.
- There was no loss of local semantics.
