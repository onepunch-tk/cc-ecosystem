# Phase 3: Review

> **Pipeline State → `review`**: Update before Phase 3 starts:
> ```bash
> cat > .claude/pipeline-state.json << EOF
> {
>   "current_phase": "review",
>   "mode": "$(jq -r .mode .claude/pipeline-state.json)",
>   "branch": "$(git branch --show-current)",
>   "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
> }
> EOF
> ```

**Pre-step**: Ensure report directory exists: `mkdir -p docs/reports/code-review`

## Sequential Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 10 | Run `code-reviewer` sub-agent (unified: quality + security + performance) | `Agent(subagent_type="code-reviewer")` |
| 11 | Read report in `/docs/reports/code-review/` → fix ALL issues, then **update the report** (see Report Update Protocol below) | — (main agent) |

## Team Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 11 | Run the project's test command to verify integration | — (lead) |
| 12 | Run `code-reviewer` sub-agent on all changed files | `Agent(subagent_type="code-reviewer")` |
| 13 | Run `e2e-tester` sub-agent to validate user flows | `Agent(subagent_type="e2e-tester")` |
| 14 | Read report in `/docs/reports/code-review/` → fix ALL issues, then **update the report** (see Report Update Protocol below) | — (lead) |

> **Why lead calls directly**: Lead is the integration reviewer across multiple teammates' work. Direct invocation gives better control over the review scope.

## Report Update Protocol [CRITICAL]

After fixing each issue in the code-review report, you **MUST** update the report file:

1. **Check off each resolved issue**: Change `- [ ]` to `- [x]` for the fixed item
2. **After ALL issues are resolved**: Change the report header `**Status**: Pending` to `**Status**: Complete`
3. **The `pipeline-guardian` hook will BLOCK Phase 4 entry** if:
   - Any `- [ ]` unchecked items remain in the report
   - Report `Status` is not `Complete`

**Example**:
```markdown
# Before fix
**Status**: Pending
- [ ] #1 [Critical] Remove vitest import

# After fix
**Status**: Complete
- [x] #1 [Critical] Remove vitest import
```

**Commit**: Per [workflow-commits.md](../../git/references/workflow-commits.md) — Review phase

> Context tip: Consider `/clear` here. Review details are no longer needed.
