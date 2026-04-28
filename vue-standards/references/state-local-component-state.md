# State local component state

## When to Use

- Model state that belongs solely to the current component's lifecycle.

## Local Rules

- Local state stays in the component when its scope is strictly visual or interactional and there is no real reuse.
- Do not promote state to Pinia or URL without a real need.
- Keep state close to where it is consumed when it does not need to be shared.

## Quality Checklist

- State remains in the smallest scope that satisfies the use case.
- No premature promotion to a global store.
