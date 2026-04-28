# Composables async

## When to Use

- Modeling fetch, revalidation, loading/error states, and reusable async synchronization.

## Local Rules

- Explicitly model loading, success, and error states.
- Accept reactive inputs when the fetch needs to re-execute in response to changes.
- Avoid redundant triggers and silent race conditions.
- Handle cancellation, invalidation, or discarding of stale responses when the flow requires it.
- Do not hide expensive effects behind `watchEffect` without careful consideration.

## Quality Checklist

- Async state is predictable.
- Re-execution dependencies are clear.
- No obvious race conditions.
- No parallel stack duplicating the existing data layer in the project.
