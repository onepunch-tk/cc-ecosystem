---
paths:
  - "**/*.tsx"
---

# React 19 Optimization
- **Trust React Compiler**: `useCallback` and `useMemo` are unnecessary in most cases — React Compiler handles memoization automatically.
- Use `useCallback`/`useMemo` **only** when a measured performance bottleneck justifies it (e.g., profiler evidence of expensive re-renders).
- Prioritize code readability over premature optimization.
