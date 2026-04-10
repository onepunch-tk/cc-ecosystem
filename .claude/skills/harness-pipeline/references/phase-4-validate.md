# Phase 4: Validate & Finalize

> **Pipeline State → `validate`**: Update before Phase 4 starts:
> ```bash
> cat > .claude/pipeline-state.json << EOF
> {
>   "current_phase": "validate",
>   "mode": "$(jq -r .mode .claude/pipeline-state.json)",
>   "branch": "$(git branch --show-current)",
>   "github_mode": $(jq -r .github_mode .claude/pipeline-state.json),
>   "issue_number": $(jq -r .issue_number .claude/pipeline-state.json),
>   "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
> }
> EOF
> ```

## Sequential Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 12 | Run `e2e-tester` sub-agent | `Agent(subagent_type="e2e-tester")` |
| 13 | Fix bugs discovered in E2E (skip if all pass) | — (main agent) |
| 14 | Run `development-planner` sub-agent to update docs | `Agent(subagent_type="development-planner")` |
| 14a | Run `project-structure-analyzer` if new directories were created | `Agent(subagent_type="project-structure-analyzer")` |
| 15 | Commit docs updates (if any) | — (main agent) |
| 16 | **Merge to development** — see GitHub/Local Mode below | — (main agent) |
| 17 | **Pipeline State → `complete`**: Update `pipeline-state.json` and reset `hook-state.json` | — |

### Step 16: Merge to Development

Read `github_mode` from `pipeline-state.json` to determine merge method:

#### GitHub Mode (`github_mode: true`)

Agent composes title/body and delegates to script:

```bash
# Read issue number
ISSUE_NUMBER=$(jq -r '.issue_number // empty' .claude/pipeline-state.json)

# Agent composes PR title/body, then calls script (single Bash call)
"$CLAUDE_PROJECT_DIR"/.claude/hooks/git-pr.sh \
  --title "<emoji> <type>: <description>" \
  --body "## Summary
<change summary>

## Changes
<changed file list>

## Test Results
<test results>" \
  --issue "$ISSUE_NUMBER"
```

> Script handles automatically: push → PR create → merge (--merge) → branch delete → development checkout

#### Local Mode (`github_mode: false`)

```bash
FEATURE_BRANCH=$(git branch --show-current)

# Checkout and update development
git checkout development
git pull origin development 2>/dev/null || true

# Merge with merge commit
git merge --no-ff "$FEATURE_BRANCH" -m "🔀 merge: $FEATURE_BRANCH → development

- <change summary>"

# Push development
git push origin development

# Delete feature branch
git branch -d "$FEATURE_BRANCH"

# Reset pipeline state (Local Mode must do this manually — GitHub Mode is handled by git-pr.sh)
cat > .claude/pipeline-state.json << EOF
{
  "current_phase": "none",
  "mode": "none",
  "branch": "development",
  "plan_approved": false,
  "github_mode": false,
  "issue_number": null,
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
echo '{"last_reminded_phase":"","doc_reminders_sent":{},"workflow_warnings_sent":{},"cooldown_until":""}' > .claude/hook-state.json
```

## Team Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 15 | Fix integration issues found in Phase 3 | — (lead) |
| 16 | Run `development-planner` sub-agent | `Agent(subagent_type="development-planner")` |
| 16a | Run `project-structure-analyzer` if new directories were created | `Agent(subagent_type="project-structure-analyzer")` |
| 17 | Commit docs updates (if any) | — (lead) |
| 18 | **Merge to development** — same GitHub/Local Mode logic as Sequential Step 16 | — (lead) |
| 19 | **Cleanup**: Reset `ownership.json`, `pipeline-state.json`, `hook-state.json` to defaults (Team session ended) | — |

**Commit**: Per [workflow-commits.md](../../git/references/workflow-commits.md) — E2E fix phase (if needed)
