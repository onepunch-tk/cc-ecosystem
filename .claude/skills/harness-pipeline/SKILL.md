---
name: harness-pipeline
description: |
  Unified development pipeline for all implementation tasks.
  Clean Architecture is the default — file placement follows CA layer templates.
  Auto-detects execution mode (Sequential or Team) based on task scope.
  Covers single-file fixes through cross-cutting multi-agent parallel work.
  Do NOT use for research, documentation-only, or planning-only tasks.
---

# Harness Pipeline

Unified development pipeline. Follow these steps **sequentially**. Each step MUST complete before proceeding.

**Architecture**: Clean Architecture (4-layer) is the default for all projects.

---

## Mode Detection (Auto-Detect)

After Phase 1 planning, auto-detect execution mode based on task scope:

| Criteria | Mode | Description |
|----------|------|-------------|
| 1-5 files, 1-2 features | **Sequential** | Main agent handles all phases directly |
| 6+ files, 3+ features | **Team** | Lead + teammate agents via TeamCreate |

```
Mode Detection Algorithm:
1. Count files to be modified from plan
2. Count distinct features/components
3. IF files <= 5 AND features <= 2:
     → Sequential Mode
   ELSE:
     → Team Mode (Lead + Teammates)
```

**User Override**: User can explicitly request mode: "use sequential mode" or "use team mode"

---

## Pipeline State Management

The harness enforces Access Control via two state files.

### `.claude/pipeline-state.json`

Updated at each Phase transition. The ABAC hook reads this to block source code modifications during plan phase.

**Format:**
```json
{
  "current_phase": "plan",
  "mode": "sequential",
  "branch": "feature/xxx",
  "plan_approved": false,
  "github_mode": true,
  "issue_number": null,
  "updated_at": "2026-04-08T10:00:00Z"
}
```

- **`github_mode`**: `true` if `Remote Platform: GitHub` is set in CLAUDE.md, `false` otherwise. Determines whether Issue/PR operations are available.
- **`issue_number`**: GitHub Issue number (GitHub Mode only). Set during Phase 1 Issue creation. Used for PR `Closes #N` linking.

**Phase order:** `none` → `plan` → `tdd` → `review` → `validate` → `complete`

> **`plan_approved`**: Set to `true` only after `ExitPlanMode` approval. The `pipeline-guardian` hook blocks plan→tdd transition if this is `false`.

**Update command (run at each Phase transition):**
```bash
cat > .claude/pipeline-state.json << EOF
{
  "current_phase": "PHASE",
  "mode": "MODE",
  "branch": "$(git branch --show-current)",
  "plan_approved": PLAN_APPROVED,
  "github_mode": GITHUB_MODE,
  "issue_number": ISSUE_NUMBER,
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
```

### `.claude/ownership.json` (Team Mode only)

Written by lead after TeamCreate. The ReBAC hook checks per-teammate file ownership.

**Format (teammate_name as key — verified):**
```json
{
  "mode": "team",
  "branch": "feature/xxx",
  "created_at": "2026-04-08T10:00:00Z",
  "teammates": {
    "hero-builder":   { "files": ["src/presentation/components/HeroSection.tsx"] },
    "service-builder": { "files": ["src/presentation/components/ServiceSection.tsx"] }
  },
  "shared": ["src/presentation/routes.ts", "src/presentation/routes/index.ts"]
}
```

> **ReBAC scope (verified 2026-04-09)**: Team teammate PreToolUse stdin does NOT contain `agent_id`/`agent_type`.
> PreToolUse ReBAC blocking only works for **agents spawned via subagent_type**.
> Team teammate ownership violations are **detected post-hoc by the TeammateIdle hook**.

**When to write:** Immediately after TeamCreate. Use the same `name` parameter specified when spawning teammates.

**Cleanup:** Reset `ownership.json` to defaults after Phase 4 completion (do NOT delete).

---

## Phase Execution

Each phase has detailed steps in its reference file. **Read the reference for the current phase before starting.**

| Phase | Reference | Key Actions |
|-------|-----------|-------------|
| **1. Plan** | [references/phase-1-plan.md](references/phase-1-plan.md) | Load docs, gh check, create Issue (GitHub Mode), create plan, stakeholder consultation (if persona set), detect mode, create branch + tasks |
| **2. TDD** | [references/phase-2-tdd.md](references/phase-2-tdd.md) | Red (unit-test-writer) → Green (implement) → commit |
| **3. Review** | [references/phase-3-review.md](references/phase-3-review.md) | code-reviewer → fix issues → commit |
| **4. Validate** | [references/phase-4-validate.md](references/phase-4-validate.md) | E2E test → docs update → PR create + merge (GitHub) or direct merge (Local) → cleanup |

**Team Protocol**: [references/team-protocol.md](references/team-protocol.md) — teammate execution steps, file ownership, communication, merge strategy

---

## Failure Recovery (Enforced by pipeline-guardian Stop Hook)

The pipeline-guardian Stop hook automatically guards TDD Green Phase completion.

**Detection**: Red phase commit (`✅ test:`) exists + Green phase commit (`✨ feat:`) missing → stop blocked
**Retries**: `FAILURE_RECOVERY_MAX_RETRIES` env variable (default: 20) — configurable in `.claude/settings.json`
**Reporting**: On final retry, agent is instructed to write failure report to `docs/reports/failures/`
**Reset**: Retry counters auto-reset on phase transition (tdd → review)

### Sequential Mode
Agent stop blocked while Green phase incomplete. Up to 20 retries with increasing context about what to fix. On success (✨ feat: commit detected), stop is immediately allowed regardless of retry count.

### Team Mode
Each teammate's retries tracked independently per session. When max retries reached, teammate stops → TeammateIdle hook notifies lead. Failure report written to `docs/reports/failures/{teammate-name}-{timestamp}.md`.

---

## Context Management

- `/clear` after Phase 2 (TDD complete): plan + test exploration no longer needed
- `/clear` after Phase 3 (review complete): review reports no longer needed
- Target: stay under 60k tokens per phase
- If unsure: `/context` to check usage

### Context Limit Warning Protocol

```
IF context exceeds 80k tokens before Phase completion:
  1. Summarize current progress to user (completed steps, pending steps)
  2. Recommend `/clear` with checkpoint description
  3. Provide resume instructions:
     - Current phase and step number
     - Files modified so far
     - Next action to take
  4. After `/clear`, resume from checkpoint
```

### Checkpoint Template

```markdown
## Checkpoint Summary
- **Phase**: [1-4] - [Phase Name]
- **Last Completed Step**: [Step Number]
- **Files Modified**: [List]
- **Next Action**: [Description]
- **Blockers**: [If any]
```

---

## Mode Comparison

| Aspect | Sequential | Team |
|--------|------------|------|
| Context usage | All in main | Per teammate |
| Parallelization | None | Full parallel |
| Recovery | Manual | Autonomous + lead |

| Scenario | Recommended Mode |
|----------|------------------|
| Quick bug fix (1-2 files) | Sequential |
| New component (3-5 files) | Sequential |
| Feature with multiple components (6+) | Team |
| Cross-cutting refactor (10+ files) | Team |
| Exploration / research | Sequential (no workers) |
