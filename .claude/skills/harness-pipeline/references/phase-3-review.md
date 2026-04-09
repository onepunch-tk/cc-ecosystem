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
| 11 | Read report in `/docs/reports/code-review/` → fix ALL issues where status ≠ "complete" | — (main agent) |

## Team Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 11 | Run the project's test command to verify integration | — (lead) |
| 12 | Run `code-reviewer` sub-agent on all changed files | `Agent(subagent_type="code-reviewer")` |
| 13 | Run `e2e-tester` sub-agent to validate user flows | `Agent(subagent_type="e2e-tester")` |
| 14 | Read report in `/docs/reports/code-review/` → fix ALL issues where status ≠ "complete" | — (lead) |

> **Why lead calls directly**: Lead is the integration reviewer across multiple teammates' work. Direct invocation gives better control over the review scope.

**Commit**: Per [workflow-commits.md](../../git/references/workflow-commits.md) — Review phase

> Context tip: Consider `/clear` here. Review details are no longer needed.
