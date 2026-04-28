# Testing components

## When to Use

- Testing props, emits, slots, visual states, and behavior of Vue components.

## Local Rules

- Test what the component does, not how it does it.
- Focus on the public interface: props, emits, slots, render, and reaction to user interaction.
- Avoid coupling to private internal state or private methods when observable behavior covers the case.
- Do not rely exclusively on HTML snapshots.

## Quality Checklist

- Assertions anchored in observable behavior.
- No unnecessary coupling to internal implementation.
- Children are mocked only when it improves isolation without losing test value.
