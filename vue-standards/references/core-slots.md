# Core slots

## When to Use

- Designing compositional components.
- Reviewing components with an overly large props-based API.

## Local Rules

- Slots are the first choice when the consumer needs to control visual structure or content.
- Use slot props to expose only the minimum necessary to the consumer.
- Name slots when there is more than one clear area of composition.
- Do not use slots to mask excessive coupling or implicit dependency on fragile markup.

## Quality Checklist

- Slots with clear names and roles.
- Minimal and well-named slot props.
- Component remains readable for consumers.
