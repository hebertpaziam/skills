# Architecture dependency injection and composition

## When to Use

- Compose modules, decouple external dependencies or facilitate testing at relevant boundaries.

## Local Rules

- Prefer explicit composition and simple parameter injection over complex containers.
- Use small contracts for dependencies when decoupling is valuable.
- Do not turn every function into DI by anticipation.
- In many cases, passing the dependency directly is sufficient and more readable.

## Quality Checklist

- Injection simplified testing or real decoupling.
- No DI infrastructure was introduced without strong need.
