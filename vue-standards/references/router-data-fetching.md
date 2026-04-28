# Router data fetching

## When to Use

- Decide where screen data should be loaded in route-based flows.

## Local Rules

- Data strictly belonging to a screen can be loaded in the component or in a screen-level composable.
- Data shared across screens or flows tends to fit better in a shared store/composable.
- Do not use a guard solely for fetching if it worsens UX or over-couples navigation.
- Clearly separate loading, error state, and empty state.

## Quality Checklist

- Fetch responsibility sits at the right boundary.
- No fetch hidden in a guard without necessity.
- Clear screen states.
