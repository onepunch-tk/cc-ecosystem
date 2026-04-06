---
name: harness-pipeline
description: |
  Unified development pipeline for all implementation tasks.
  Clean Architecture is the default — file placement follows CA layer templates.
  Auto-detects execution mode (Sequential, Delegated, Team) based on task scope.
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
| 1-3 files, single feature | **Sequential** | Main agent handles all phases directly |
| 4-10 files, 2-3 features | **Delegated** | Supervisor pattern with worker agents |
| 10+ files, complex features | **Team** | Lead + teammate agents via TeamCreate |

```
Mode Detection Algorithm:
1. Count files to be modified from plan
2. Count distinct features/components
3. IF files <= 3 AND features == 1:
     → Sequential Mode
   ELSE IF files <= 10:
     → Delegated Mode (Supervisor)
   ELSE:
     → Team Mode (Lead + Teammates)
```

**User Override**: User can explicitly request mode: "use sequential mode", "use delegated mode", or "use team mode"

---

## Phase 1: Plan (All Modes)

| Step | Action |
|------|--------|
| 1 | Enter `PlanMode` |
| 2 | Read `CLAUDE.md`. Read `docs/ROADMAP.md` if it exists (skip if not — e.g., bug fix without roadmap) |
| 2a | **CA Structure Check**: Read `docs/PROJECT-STRUCTURE.md`. If it does NOT exist → auto-invoke `project-structure` skill to generate it from the CA template |
| 2b | **Load CA Template**: Detect framework type and load the matching CA template from `.claude/skills/project-structure/references/` (react-router, nestjs, or expo). Use the template's **File Location Summary by Task** table as the file placement guide |
| 3 | Analyze current state thoroughly |
| 4 | Create detailed step-by-step plan. **File placement MUST follow the CA template's layer structure**: Domain → Application → Infrastructure → Presentation |
| 5 | **Count files and features** → determine execution mode |
| 6 | Exit `PlanMode` → wait for plan approval |

### CA File Placement Rules (Phase 1)

When planning file locations, refer to the **CA template loaded in Step 2b** and `docs/PROJECT-STRUCTURE.md` for actual layer paths. Place each file type in the matching CA layer:

| File Type | CA Layer |
|-----------|----------|
| Entity, Schema, VO, Error | **Domain** (innermost) |
| Service, Port, DTO, Mapper | **Application** |
| Repository impl, API client, Config | **Infrastructure** |
| Controller, Route, Component, Hook | **Presentation** (outermost) |

> Use the template's **"File Location Summary by Task"** table for exact directory paths — do NOT assume fixed folder names.

> **Dependency Rule**: Domain ← Application ← Infrastructure/Presentation. Inner layers MUST NOT import from outer layers.

> After plan approval, create tasks via `TaskCreate` and execute immediately. No separate confirmation needed.

### Team Mode Addition (Phase 1)

| Step | Action |
|------|--------|
| 5a | Break work into tasks with **clear file ownership** (no overlapping files) |
| 5b | Verify NO file overlap between tasks before spawning teammates |
| 5c | Prepare teammate task prompts with file ownership lists |

> **WARNING: File Ownership is CRITICAL**
> Overlapping file assignments = merge conflicts = wasted work.
> Lead MUST verify NO file overlap before spawning teammates.

---

## Phase 2: TDD (after user approval)

### Git Setup (All Modes)

| Step | Action |
|------|--------|
| 6 | Fetch latest and switch to `development` branch: `git fetch origin && git checkout development 2>/dev/null \|\| git checkout -b development && git pull origin development 2>/dev/null \|\| true` |
| 7 | Create feature branch from `development` |

### Sequential Mode (1-3 files)

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

### Delegated Mode (4-10 files)

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 8 | Spawn `task-executor` worker agent with task context | `Agent(subagent_type="task-executor")` |
| 9 | **Supervisor waits** — do NOT implement yourself | — |
| 10 | Receive summary from `task-executor` | — |
| 11 | Verify summary: Status=Success, Coverage>=90% | — |

> `task-executor` internally spawns `unit-test-writer` for Red phase, then implements Green phase.

```
Supervisor Context During Delegation:
- Store only: task ID, file list, expected outcomes
- Do NOT read test code or implementation details
- Wait for worker summary
```

### Team Mode (10+ files)

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 8 | Spawn teammates with detailed prompts (see Spawn Template below) | `TeamCreate` |
| 9 | Use **Delegate Mode** (Shift+Tab) — do NOT implement yourself | — |
| 10 | Monitor teammate progress, unblock as needed | — |

> All teammates work on the **same feature branch**.
> Each teammate internally spawns `unit-test-writer` for Red phase.

#### Spawn Template

> **IMPORTANT**: When composing the spawn prompt for each teammate, you MUST include the full content
> of the "Teammate Protocol" section below verbatim in the teammate's prompt. This ensures every
> teammate has the complete execution steps, file ownership rules, failure recovery, and communication protocol.

```
Create an agent team with N teammates:
1. "{name}" — {Include full Teammate Protocol section here}. Own files: {file-list}. Task: {task-description}.
2. "{name}" — {Include full Teammate Protocol section here}. Own files: {file-list}. Task: {task-description}.
Use Opus for all teammates. Require plan approval.
```

> 💡 **Context tip**: Consider `/clear` here. Plan context is no longer needed.

**Commit**: Per [workflow-commits.md](../git/references/workflow-commits.md) — Red/Green phase

---

## Phase 3: Review

### Sequential Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 10 | Run `code-reviewer` sub-agent (unified: quality + security + performance) | `Agent(subagent_type="code-reviewer")` |
| 11 | Read report in `/docs/reports/code-review/` → fix ALL issues where status ≠ "complete" | — (main agent) |

### Delegated Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 12 | Spawn `quality-gate` worker agent with changed files list | `Agent(subagent_type="quality-gate")` |
| 13 | **Supervisor waits** — do NOT review yourself | — |
| 14 | Receive pass/fail summary from `quality-gate` | — |
| 15 | IF Status=FAIL: Spawn `task-executor` to fix blocking issues | `Agent(subagent_type="task-executor")` |
| 16 | IF Status=PASS: Proceed to Phase 4 | — |

> `quality-gate` internally spawns `code-reviewer` + `e2e-tester`.

```
Quality Gate Loop:
WHILE quality-gate returns FAIL:
  1. Extract blocking issues from summary
  2. Spawn task-executor with fix instructions
  3. Re-run quality-gate
  4. Max 3 iterations, then escalate to user
```

### Team Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 11 | Run the project's test command to verify integration | — (lead) |
| 12 | Run `code-reviewer` sub-agent on all changed files | `Agent(subagent_type="code-reviewer")` |
| 13 | Run `e2e-tester` sub-agent to validate user flows | `Agent(subagent_type="e2e-tester")` |
| 14 | Read report in `/docs/reports/code-review/` → fix ALL issues where status ≠ "complete" | — (lead) |

> **Why lead calls directly (not quality-gate)**: Lead is the integration reviewer across multiple teammates' work. Direct invocation gives better control over the review scope.

**Commit**: Per [workflow-commits.md](../git/references/workflow-commits.md) — Review phase

> 💡 **Context tip**: Consider `/clear` here. Review details are no longer needed.

---

## Phase 4: Validate & Finalize

### Sequential Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 12 | Run `e2e-tester` sub-agent | `Agent(subagent_type="e2e-tester")` |
| 13 | Fix bugs discovered in E2E (skip if all pass) | — (main agent) |
| 14 | Run `development-planner` sub-agent | `Agent(subagent_type="development-planner")` |
| 15 | Merge feature branch to `development` | — |

### Delegated Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 17 | E2E already run by `quality-gate` — check summary | — |
| 18 | IF E2E failed: Spawn `task-executor` for fixes, re-run `quality-gate` | `Agent(subagent_type="task-executor")` |
| 19 | Run `development-planner` sub-agent (Supervisor handles directly) | `Agent(subagent_type="development-planner")` |
| 20 | Merge feature branch to `development` | — |

### Team Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 15 | Fix integration issues found in Phase 3 | — (lead) |
| 16 | Run `development-planner` sub-agent | `Agent(subagent_type="development-planner")` |
| 17 | Merge working branch → `development` | — |
| 18 | Update `ROADMAP.md` and `PROJECT-STRUCTURE.md` | — |

**Commit**: Per [workflow-commits.md](../git/references/workflow-commits.md) — E2E fix phase (if needed)

---

## Failure Recovery (All Modes)

```
IF any step fails:
  1. Log failure to docs/reports/failures/{timestamp}-{step}.md
  2. Retry SAME approach (1 attempt)
  3. Retry DIFFERENT approach (1 attempt)
  4. After 3 total failures → STOP, report to user, WAIT for instruction
```

### Team Mode Variant (Teammates)

```
IF any step fails (teammate):
  1. Log to docs/reports/failures/{teammate-name}-{timestamp}.md
  2. Retry SAME approach (1 attempt)
  3. Retry DIFFERENT approach (1 attempt)
  4. After 3 failures:
     → Message lead: "Blocked on [issue]. Attempted [approaches]."
     → Pick up next available task
     → DO NOT STOP
```

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

## Supervisor Pattern Architecture (Delegated Mode)

```
┌─────────────────────────────────────────────────────────────┐
│                 Supervisor (Main Agent)                      │
│  • Orchestration only — minimal context                     │
│  • Stores: task IDs, file lists, worker summaries           │
│  • Does NOT: read code, write tests, review details         │
└─────────────────────────────────────────────────────────────┘
                    │                           │
         ┌──────────┴──────────┐     ┌──────────┴──────────┐
         ▼                     ▼     ▼                     ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  task-executor  │     │  quality-gate   │     │ development-    │
│    (Sonnet)     │     │    (Sonnet)     │     │    planner      │
├─────────────────┤     ├─────────────────┤     │   (Opus)        │
│ • TDD cycle     │     │ • Code review   │     └─────────────────┘
│ • Red → Green   │     │ • E2E tests     │
│ • Commits       │     │ • Pass/Fail     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│ unit-test-writer│     │  code-reviewer  │
│    (Sonnet)     │     │    (Sonnet)     │
└─────────────────┘     ├─────────────────┤
                        │   e2e-tester    │
                        │    (Sonnet)     │
                        └─────────────────┘
```

### Mode Comparison

| Aspect | Sequential | Delegated | Team |
|--------|------------|-----------|------|
| Context usage | All in main | Distributed | Per teammate |
| Cost | Higher (Opus all) | Lower (Sonnet workers) | Opus teammates |
| Parallelization | None | Workers can overlap | Full parallel |
| Recovery | Manual | Auto-retry via workers | Autonomous + lead |
| Scalability | Limited | Medium | High |

### When to Use Each Mode

| Scenario | Recommended Mode |
|----------|------------------|
| Quick bug fix (1-2 files) | Sequential |
| New component (3-5 files) | Delegated |
| Feature with multiple components | Delegated |
| Cross-cutting refactor (10+ files) | Team |
| Exploration / research | Sequential (no workers) |

---

## File Ownership Protocol (Team Mode)

- **ONLY modify files** assigned to you
- **NEVER touch** files owned by another teammate
- **Shared files** (barrel `index.ts`, `routes.ts`): message lead before modifying
- **New files**: create freely within your task scope
- **Do NOT create branches** — work on the feature branch created by lead

---

## Teammate Protocol (Team Mode — Auto-Injected)

> **This section is auto-injected by the lead when spawning teammates.**
> **Teammates do NOT invoke `/harness-pipeline` themselves.**

### Execution Steps

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 1 | Read `CLAUDE.md`, `docs/PROJECT-STRUCTURE.md`, assigned task file. Load the CA template for the project's framework type from `.claude/skills/project-structure/references/` | — |
| 2 | Run `unit-test-writer` sub-agent (Red Phase). **NEVER analyze patterns or write test code yourself — always delegate to the `unit-test-writer` subagent.** | `Agent(subagent_type="unit-test-writer")` |
| 3 | Implement code to pass tests (Green Phase) → run the project's test command (see CLAUDE.md Commands). **Follow CA Inside-Out order**: Domain → Application → Infrastructure → Presentation | — |
| 4 | Run the project's coverage command (see CLAUDE.md Commands) | — |
| 5 | Commit per [workflow-commits.md](../git/references/workflow-commits.md) | — |
| 6 | Message lead: files changed, test results, remaining issues | — |

### Teammate Rules

- **ONLY modify files** assigned to you
- **NEVER touch** files owned by another teammate
- **Shared files** (barrel `index.ts`, `routes.ts`): message lead before modifying
- **New files**: create freely within your task scope
- **Do NOT create branches** — work on the feature branch created by lead

### Communication Protocol

| Event | Action |
|-------|--------|
| Task complete | Message lead with summary |
| Blocked by another task | Message lead, pick up next task |
| Found issue in shared code | Message lead (don't fix directly) |
| Need design decision | Message lead with options + recommendation |

---

## Merge Strategy (Team Mode)

```
main
 └── development
      └── {working-branch}  ← single branch, all teammates work here
           ├── teammate-A commits (owns: file-list-A)
           ├── teammate-B commits (owns: file-list-B)
           └── teammate-C commits (owns: file-list-C)

After all teammates done → Phase 3
```

### Git Conventions

See [workflow-commits.md](../git/references/workflow-commits.md)

---

## Cost Notes

- **Teammates**: Use `opus` model — NO `code-reviewer` per teammate (TDD cycle is the quality gate, lead handles all review in Phase 3)
- **Delegated workers**: Use `sonnet` model for cost efficiency
- **Lead**: Runs `code-reviewer` + `e2e-tester` as the single review gate post-merge
- Minimize sub-agent calls per teammate
- Avoid broadcast messages — message lead directly
