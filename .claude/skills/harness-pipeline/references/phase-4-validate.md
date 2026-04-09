# Phase 4: Validate & Finalize

> **Pipeline State → `validate`**: Update before Phase 4 starts:
> ```bash
> cat > .claude/pipeline-state.json << EOF
> {
>   "current_phase": "validate",
>   "mode": "$(jq -r .mode .claude/pipeline-state.json)",
>   "branch": "$(git branch --show-current)",
>   "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
> }
> EOF
> ```

## Sequential Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 12 | Run `e2e-tester` sub-agent | `Agent(subagent_type="e2e-tester")` |
| 13 | Fix bugs discovered in E2E (skip if all pass) | — (main agent) |
| 14 | Run `development-planner` sub-agent | `Agent(subagent_type="development-planner")` |
| 15 | Merge feature branch to `development` | — |
| 16 | **Pipeline State → `complete`**: Update `pipeline-state.json` and reset `hook-state.json` | — |

## Team Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 15 | Fix integration issues found in Phase 3 | — (lead) |
| 16 | Run `development-planner` sub-agent | `Agent(subagent_type="development-planner")` |
| 17 | Merge working branch → `development` | — |
| 18 | Update `ROADMAP.md` and `PROJECT-STRUCTURE.md` | — |
| 19 | **Cleanup**: Reset `ownership.json`, `pipeline-state.json`, `hook-state.json` to defaults (Team session ended) | — |

**Commit**: Per [workflow-commits.md](../../git/references/workflow-commits.md) — E2E fix phase (if needed)
