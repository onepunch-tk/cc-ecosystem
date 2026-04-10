# Phase 2: TDD (after user approval)

> **Pipeline State → `tdd`**: Update `pipeline-state.json` before Phase 2 starts (ABAC source code blocking lifted):
> ```bash
> cat > .claude/pipeline-state.json << EOF
> {
>   "current_phase": "tdd",
>   "mode": "$(jq -r .mode .claude/pipeline-state.json)",
>   "branch": "$(git branch --show-current)",
>   "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
> }
> EOF
> ```

> **Note**: Git branch setup (Steps 5a-5b) was already completed in Phase 1. All work below happens on the feature branch.

## Sequential Mode (1-5 files)

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 8 | Run `unit-test-writer` sub-agent → **verify tests FAIL** (Red Phase). **NEVER analyze patterns or write test code yourself — always delegate to the `unit-test-writer` subagent.** | `Agent(subagent_type="unit-test-writer")` |
| 9 | Implement code to pass tests → run the project's test command (see CLAUDE.md Commands) → **verify ALL pass** (Green Phase) | — (main agent) |

**CA Implementation Order (Inside-Out)**: When implementing in Step 9, follow this layer order:

```
1. Domain    — Entity, VO, Schema, Error (no dependencies)
2. Application — Service, Port interface, DTO, Mapper (depends on Domain only)
3. Infrastructure — Repository impl, API client, Config (implements Ports)
4. Presentation — Route, Controller, Component, Hook (calls Application)
```

> Domain code MUST NOT import from Application/Infrastructure/Presentation.
> Application code MUST NOT import from Infrastructure/Presentation.

**Auto-verify (no human wait needed)**:
- After Step 8: If tests pass immediately → review test logic, likely not testing correctly
- After Step 9: If any test fails → fix implementation before proceeding

## Team Mode (6+ files)

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 8 | Spawn teammates with detailed prompts (see Spawn Template below) | `TeamCreate` |
| 8a | **Ownership registration**: Run `cat ~/.claude/teams/{team-name}/config.json` → verify `members[].agentId` and `members[].name` mapping | — |
| 8b | **Write `.claude/ownership.json`**: Record each teammate's name → `{files}` mapping (see Pipeline State Management in SKILL.md) | — |
| 9 | Use **Delegate Mode** (Shift+Tab) — do NOT implement yourself | — |
| 10 | Monitor teammate progress, unblock as needed | — |

> All teammates work on the **same feature branch**.
> Each teammate internally spawns `unit-test-writer` for Red phase.

### Spawn Template

> **IMPORTANT**: When composing the spawn prompt for each teammate, you MUST include the full content
> of the Teammate Protocol section from `references/team-protocol.md` verbatim in the teammate's prompt.

```
Create an agent team with N teammates:
1. "{name}" — {Include full Teammate Protocol section}. Own files: {file-list}. Task: {task-description}.
2. "{name}" — {Include full Teammate Protocol section}. Own files: {file-list}. Task: {task-description}.
Use Opus for all teammates. Require plan approval.
```

> Context tip: Consider `/clear` here. Plan context is no longer needed.

**Commit**: Per [workflow-commits.md](../../git/references/workflow-commits.md) — Red/Green phase
