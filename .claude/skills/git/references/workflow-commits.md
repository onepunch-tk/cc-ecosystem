# Workflow Commit & Merge Conventions

Commit and merge conventions for harness-pipeline.

> **Format**: Follow [commit-prefix-rules.md](./commit-prefix-rules.md) — emoji + type + Korean description required.

---

## Phase-Specific Commit Patterns

| Phase | Prefix | Message Pattern | Example |
|-------|--------|-----------------|---------|
| Red (tests) | `✅ test:` | `add failing tests for {feature}` | `✅ test: add failing tests for invoice detail view` |
| Green (impl) | `✨ feat:` | `implement {feature}` | `✨ feat: implement invoice detail view` |
| Review fix | `♻️ refactor:` | `apply review feedback for {feature}` | `♻️ refactor: apply review feedback for invoice detail view` |
| E2E fix | `🐛 fix:` | `fix E2E test failure for {feature}` | `🐛 fix: fix E2E test failure for invoice detail view` |
| Bug fix | `🐛 fix:` | `{description}` | `🐛 fix: fix date format error` |
| Config/Build | `🔧 chore:` | `{description}` | `🔧 chore: update test configuration` |

---

## Merge Convention

When merging a feature branch into `development`:

```
🔀 merge: {branch} → development ({context})
```

**Example**:
```
🔀 merge: feature/task-014-pdf-export → development (Task 014)
```

---

## Rules

1. **Korean description** required (see commit-prefix-rules.md)
2. **No Co-Authored-By** (see commit-prefix-rules.md)
3. **Atomic commits** — one commit per phase (do not split unnecessarily)
4. Replace `{feature}` with a Korean summary of the implementation target
