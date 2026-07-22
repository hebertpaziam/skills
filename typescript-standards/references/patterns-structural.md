# Patterns structural

## When to Use

- Adapt interfaces, compose behavior, simplify access, or control delegation.

## Coverage

- Adapter
- Bridge
- Composite
- Decorator
- Facade
- Flyweight
- Proxy

## Local Rules

- `Adapter` is excellent when an external API does not fit the internal contract.
- `Decorator` is useful for adding behavior without bloating the original implementation.
- `Facade` helps reduce coupling with complex subsystems.
- `Proxy` can encapsulate cache, lazy access, auth, or access control.
- `Bridge`, `Composite`, and `Flyweight` are less common and require strong justification to avoid becoming over-engineering.

## Quality Checklist

- The pattern reduced coupling or simplified consumption.
- No empty structural layer appeared.
