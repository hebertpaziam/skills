# Patterns behavioral

## When to Use

- Vary behavior, model flow, commands, observation, or state transitions.

## Coverage

- Chain of Responsibility
- Command
- Interpreter
- Iterator
- Mediator
- Memento
- Observer
- State
- Strategy
- Template Method
- Visitor

## Local Rules

- `Strategy` is one of the best choices when there is a real interchangeable algorithm.
- `Observer` works well for event flows but should not become diffuse coupling.
- `Command` is useful for encapsulating action, queue, undo, or structured dispatch.
- `State` helps when there are explicit states with different behavior.
- `Template Method`, `Visitor`, and `Interpreter` require very strong justification in application TypeScript.

## Quality Checklist

- The variable behavior was clear.
- The pattern made the flow clearer, not more opaque.
