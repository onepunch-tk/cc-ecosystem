---
name: harness-pipeline
description: |
  Unified development pipeline for all implementation tasks.
  Auto-detects execution mode (Sequential, Delegated, Team) based on task scope.
  Covers single-file fixes through cross-cutting multi-agent parallel work.
  Do NOT use for research, documentation-only, or planning-only tasks.
---

# Harness Pipeline

Unified development pipeline. Follow these steps **sequentially**. Each step MUST complete before proceeding.

---

## Mode Detection (Auto-Detect)

After Phase 1 planning, auto-detect execution mode based on task scope:

| Criteria | Mode | Description |
|----------|------|-------------|
| 1-3 files, single feature | **Sequential** | Main agent handles all phases directly |
| 4-10 files, 2-3 features | **Delegated** | Supervisor pattern with worker agents |
| 10+ files, complex features | **Team** | Lead + teammate agents via TeamCreate |

```
Mode Detection Algorithm (Standard):
1. Count files to be modified from plan
2. Count distinct features/components
3. IF files <= 3 AND features == 1:
     → Sequential Mode
   ELSE IF files <= 10:
     → Delegated Mode (Supervisor)
   ELSE:
     → Team Mode (Lead + Teammates)

Mode Detection Algorithm (DDD — when DDD_MODE = true):
1. Count Bounded Contexts involved in this task
2. Count files per domain layer (VO, Aggregate, Service, App, Infra, Presentation)
3. IF bounded_contexts == 1 AND total_files <= 5:
     → Sequential Mode (multi-cycle TDD per layer)
   ELSE IF bounded_contexts <= 2 AND total_files <= 12:
     → Delegated Mode (task-executor per Bounded Context)
   ELSE IF bounded_contexts >= 3:
     → Team Mode (1 teammate per Bounded Context + 1 shared-kernel lead)
   ELSE:
     → Delegated Mode (default for multi-context)
```

**User Override**: User can explicitly request mode: "use sequential mode", "use delegated mode", or "use team mode"

---

## Phase 0: Domain Modeling (DDD Projects Only)

> **Skip this phase** if the project does not use DDD architecture.

### DDD Detection Algorithm

```
DDD Detection (run BEFORE Phase 1):
1. Check CLAUDE.md for "DDD" or "Domain-Driven Design" in Core Principles or Architecture
2. Check if docs/domain/ directory exists (previously modeled)
3. Check docs/PRD.md for DDD indicators:
   - Section "Domain Model Overview" exists
   - Keywords: "bounded context", "aggregate", "domain event", "ubiquitous language"
4. Check user's explicit request: "use DDD", "DDD architecture", etc.

IF any of (1-4) is TRUE → DDD_MODE = true → execute Phase 0
ELSE → DDD_MODE = false → skip to Phase 1
```

### Phase 0 Steps

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 0-1 | Check if `docs/domain/glossary.md` and `docs/domain/context-map.md` exist | — |
| 0-2 | IF missing: Load `domain-modeling` skill and run full workflow | Skill |
| 0-3 | IF exists: Read domain models, verify alignment with current task | — |
| 0-4 | Identify which Bounded Context(s) the current task belongs to | — |

**Phase 0 Output**:
- `DDD_MODE = true` (carry this flag through all subsequent phases)
- Target Bounded Context(s) for this task
- Relevant Aggregates and Domain Events
- Integration points with other contexts (if any)

> After Phase 0, **recommend `/clear`** — domain modeling context is no longer needed. Carry only the Phase 0 Output into Phase 1.

---

## Phase 1: Plan (All Modes)

| Step | Action |
|------|--------|
| 1 | Enter `PlanMode` |
| 2 | Read `CLAUDE.md`, `docs/PROJECT-STRUCTURE.md`, `docs/ROADMAP.md` |
| 2a | (DDD) Read `docs/domain/glossary.md`, relevant `docs/domain/aggregates/[context].md` |
| 3 | Analyze current state thoroughly |
| 4 | Create detailed step-by-step plan |
| 4a | (DDD) Plan follows Domain-First TDD order: Value Objects → Aggregates → Domain Services → Application → Infrastructure → Presentation |
| 5 | **Count files and features** → determine execution mode |
| 6 | Exit `PlanMode` → wait for plan approval |

> After plan approval, create tasks via `TaskCreate` and execute immediately. No separate confirmation needed.

### Team Mode Addition (Phase 1)

| Step | Action |
|------|--------|
| 5a | Break work into tasks with **clear file ownership** (no overlapping files) |
| 5b | Verify NO file overlap between tasks before spawning teammates |
| 5c | (DDD) **Shared Kernel pre-creation**: Lead creates shared domain files BEFORE spawning teammates — `shared/value-objects/`, `shared/base-entity.ts`, `shared/domain-event.ts`, common types. These are NOT owned by any teammate. |
| 5d | Prepare teammate task prompts with file ownership lists |

> **WARNING: File Ownership is CRITICAL**
> Overlapping file assignments = merge conflicts = wasted work.
> Lead MUST verify NO file overlap before spawning teammates.

> **DDD NOTE**: Shared Kernel files (Step 5c) must be committed to the feature branch BEFORE teammates start. Teammates import from shared files but never modify them. If a teammate needs a new shared VO, they message the lead.

---

## Phase 2: TDD (after user approval)

### Git Setup (All Modes)

| Step | Action |
|------|--------|
| 6 | Fetch latest and switch to `development` branch: `git fetch origin development && git checkout development && git pull origin development` (create if not exists) |
| 7 | Create feature branch from `development` |

### Sequential Mode (1-3 files)

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 8 | Run `unit-test-writer` sub-agent → **verify tests FAIL** (Red Phase). **NEVER analyze patterns or write test code yourself — always delegate to the `unit-test-writer` subagent.** | `Agent(subagent_type="unit-test-writer")` |
| 9 | Implement code to pass tests → run the project's test command (see CLAUDE.md Commands) → **verify ALL pass** (Green Phase) | — (main agent) |

**Auto-verify (no human wait needed)**:
- After Step 8: If tests pass immediately → review test logic, likely not testing correctly
- After Step 9: If any test fails → fix implementation before proceeding

#### DDD Multi-Cycle TDD (Sequential Mode)

When `DDD_MODE = true`, repeat Steps 8-9 **per domain layer** in inside-out order:

```
Cycle 1: Value Objects
  → Red: unit-test-writer writes VO tests
  → Green: implement VOs, verify pass

Cycle 2: Aggregate Root
  → Red: unit-test-writer writes Aggregate tests (using VOs from Cycle 1)
  → Green: implement Aggregate, verify pass

Cycle 3: Domain Services (if needed)
  → Red: unit-test-writer writes Domain Service tests
  → Green: implement Domain Services, verify pass

Cycle 4: Application Services
  → Red: unit-test-writer writes use case tests (mock ports)
  → Green: implement Application Services, verify pass

Cycle 5: Infrastructure
  → Red: unit-test-writer writes adapter tests
  → Green: implement adapters/repositories, verify pass

Cycle 6: Presentation
  → Red: unit-test-writer writes controller/route tests
  → Green: implement presentation layer, verify pass
```

> Each cycle builds on the previous. Do NOT skip cycles — later layers depend on earlier ones being tested and stable.

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
| 1 | Read `CLAUDE.md`, `docs/PROJECT-STRUCTURE.md`, assigned task file | — |
| 1a | (DDD) Read `docs/domain/glossary.md` and relevant `docs/domain/aggregates/[context].md` for assigned Bounded Context | — |
| 2 | Run `unit-test-writer` sub-agent (Red Phase). **NEVER analyze patterns or write test code yourself — always delegate to the `unit-test-writer` subagent.** | `Agent(subagent_type="unit-test-writer")` |
| 3 | Implement code to pass tests (Green Phase) → run the project's test command (see CLAUDE.md Commands) | — |
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
