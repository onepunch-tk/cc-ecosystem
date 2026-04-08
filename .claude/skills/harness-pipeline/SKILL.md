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
  "updated_at": "2026-04-08T10:00:00Z"
}
```

**Phase order:** `none` → `plan` → `tdd` → `review` → `validate` → `complete`

**Update command (run at each Phase transition):**
```bash
cat > .claude/pipeline-state.json << EOF
{
  "current_phase": "PHASE",
  "mode": "MODE",
  "branch": "$(git branch --show-current)",
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

> ⚠ **ReBAC scope (verified)**: Team teammate PreToolUse stdin does NOT contain `agent_id`/`agent_type`/`teammate_name`.
> PreToolUse ReBAC blocking only works for **agents spawned via subagent_type**.
> Team teammate ownership violations are **detected post-hoc by the TeammateIdle hook**.

**When to write:** Immediately after TeamCreate. Use the same `name` parameter specified when spawning teammates.

**Cleanup:** Run `rm -f .claude/ownership.json` after Phase 4 completion.

---

## Phase 1: Plan (All Modes)

> **Default**: `EnterPlanMode` (local planning — always available)
> **Upgrade**: ultraplan (cloud-based planning — requires user to manually trigger via `/ultraplan` command)

| Step | Action |
|------|--------|
| 1 | Read `CLAUDE.md`. Read `docs/ROADMAP.md` if it exists (skip if not — e.g., bug fix without roadmap) |
| 1a | **CA Structure Check**: Read `docs/PROJECT-STRUCTURE.md`. If it does NOT exist → auto-invoke `project-structure` skill to generate it from the CA template |
| 1b | **Load CA Template**: Detect framework type and load the matching CA template from `.claude/skills/project-structure/references/` (react-router, nestjs, or expo). Use the template's **File Location Summary by Task** table as the file placement guide |
| 2 | **Enter plan mode**: Call `EnterPlanMode` to start local planning. Output a summary of gathered context and task description for the user. Inform the user they can upgrade to ultraplan via `/ultraplan` if desired. |
| 2a | **Pipeline State → `plan`**: Set `pipeline-state.json` `current_phase` to `"plan"` (ABAC hook blocks source code modifications during plan phase). Mode is finalized after Step 4, so set `"pending"` for now. (see [Pipeline State Management](#pipeline-state-management)) |
| 3 | Analyze current state and create detailed step-by-step plan in the plan file. **File placement MUST follow the CA template's layer structure**: Domain → Application → Infrastructure → Presentation |
| 4 | **Count files and features** → determine execution mode (Sequential / Team) |
| 4z | **Pipeline State mode finalized**: Update `pipeline-state.json` with the mode determined in Step 4 (`"sequential"` \| `"team"`) |
| 5 | Plan review → approve via `ExitPlanMode` (user may upgrade to ultraplan at this point) |

### Ultraplan (Optional Upgrade)

Ultraplan is a cloud-based planning feature. **Agents cannot trigger ultraplan programmatically** — the keyword trigger only works when typed by the user, not when output by an agent.

The user can upgrade to ultraplan via:

| Method | How It Works |
|--------|-------------|
| **User command** | User runs `/ultraplan <task>` directly in CLI |
| **From local plan** | User chooses "refine with Ultraplan" at local plan approval dialog |

> If the user does not trigger ultraplan, proceed with local plan mode (`EnterPlanMode`) — this is the default path.

### Status Indicators (ultraplan active)

| Status | Meaning |
|--------|---------|
| `◇ ultraplan` | Drafting the plan |
| `◇ ultraplan needs your input` | Clarifying question — open session link |
| `◆ ultraplan ready` | Plan ready for browser review |

### Approval Options

**Default (local plan mode):**
- Call `ExitPlanMode` → user reviews and approves the plan file
- User may upgrade to ultraplan via `/ultraplan` or "refine with Ultraplan"

**If user activated ultraplan:**
- **Approve & execute on the web** → implementation continues in the cloud session, opens PR when done
- **Approve & teleport to terminal** → plan is sent back to CLI for local execution with full environment access

> After approval (either path), the pipeline continues directly to Phase 2 (TDD). No separate confirmation needed.

### CA File Placement Rules (Phase 1)

When planning file locations, refer to the **CA template loaded in Step 1b** and `docs/PROJECT-STRUCTURE.md` for actual layer paths. Place each file type in the matching CA layer:

| File Type | CA Layer |
|-----------|----------|
| Entity, Schema, VO, Error | **Domain** (innermost) |
| Service, Port, DTO, Mapper | **Application** |
| Repository impl, API client, Config | **Infrastructure** |
| Controller, Route, Component, Hook | **Presentation** (outermost) |

> Use the template's **"File Location Summary by Task"** table for exact directory paths — do NOT assume fixed folder names.

> **Dependency Rule**: Domain ← Application ← Infrastructure/Presentation. Inner layers MUST NOT import from outer layers.

> After plan approval, create ALL tasks for the entire pipeline upfront via `TaskCreate`, then execute sequentially. No separate confirmation needed.

### Task Creation (Immediately After Plan Approval)

> **CRITICAL**: Create tasks for ALL phases at once so the user can track overall progress. Tasks must describe **what to actually do**, not just pipeline flow labels. Break down into the smallest actionable units — each task should be a concrete, executable action that the agent performs.

**Bad** (pipeline flow labels — too abstract):
```
- TDD Red: hero-section test
- TDD Green: hero-section implementation
```

**Good** (concrete actions — what actually gets done):
```
- Install React Router Framework via bun create react-router
- Remove demo welcome page and home route
- Create CA directories (domain, application, infrastructure, presentation)
- Install vitest, @testing-library/react, jsdom and configure vitest.config.ts
- Update routes.ts to point to presentation/routes/_index.tsx
- Write test: HeroSection renders company name and tagline
- Write test: HeroSection renders "Get Started" and "Learn More" CTA buttons
- Write test: ServiceSection renders 3 service cards (AI Consulting, ML Pipeline, Computer Vision)
- Implement HeroSection — company name, tagline, gradient background, 2 CTA buttons
- Implement ServiceSection — 3-column grid, icon + title + description per card
- Implement _index route — Nav + Hero + Services + Footer
- Update app.css with Tailwind global styles
- Run code-reviewer and fix reported issues
- Run E2E test to verify page renders correctly
- Merge feature/company-intro-page → development
```

> **NOTE**: The example above is for reference only. Actual tasks MUST be derived from the approved plan and the current project state — not copied from this example. If the project already has scaffolding, skip those tasks. If the tech stack differs, adjust accordingly.

### Git Setup (Immediately After Plan Approval)

> **CRITICAL**: Branch creation MUST happen immediately after plan approval, BEFORE any code changes — including scaffolding, dependency installation, or file creation. Every code-modifying action belongs on a feature branch, never on `main` directly.

| Step | Action |
|------|--------|
| 5a | Fetch latest and switch to `development` branch: `git fetch origin && git checkout development 2>/dev/null \|\| git checkout -b development main && git pull origin development 2>/dev/null \|\| true` |
| 5b | Create feature branch from `development`. Branch name MUST follow the naming convention in [commit-prefix-rules.md](../git/references/commit-prefix-rules.md): `feature/*`, `fix/*`, `docs/*`, `refactor/*`, `test/*`, `chore/*`. Derive the name dynamically from the task content (e.g., `feature/company-intro-page`, `fix/login-session-bug`) |

### Team Mode Addition (Phase 1)

| Step | Action |
|------|--------|
| 4a | Break work into tasks with **clear file ownership** (no overlapping files) |
| 4b | Verify NO file overlap between tasks before spawning teammates |
| 4c | Prepare teammate task prompts with file ownership lists |

> **WARNING: File Ownership is CRITICAL**
> Overlapping file assignments = merge conflicts = wasted work.
> Lead MUST verify NO file overlap before spawning teammates.

---

## Phase 2: TDD (after user approval)

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

### Sequential Mode (1-5 files)

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

### Team Mode (6+ files)

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 8 | Spawn teammates with detailed prompts (see Spawn Template below) | `TeamCreate` |
| 8a | **Ownership registration**: Run `cat ~/.claude/teams/{team-name}/config.json` → verify `members[].agentId` and `members[].name` mapping | — |
| 8b | **Write `.claude/ownership.json`**: Record each teammate's name → `{files}` mapping (see [Pipeline State Management](#pipeline-state-management)) | — |
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

### Sequential Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 10 | Run `code-reviewer` sub-agent (unified: quality + security + performance) | `Agent(subagent_type="code-reviewer")` |
| 11 | Read report in `/docs/reports/code-review/` → fix ALL issues where status ≠ "complete" | — (main agent) |

### Team Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 11 | Run the project's test command to verify integration | — (lead) |
| 12 | Run `code-reviewer` sub-agent on all changed files | `Agent(subagent_type="code-reviewer")` |
| 13 | Run `e2e-tester` sub-agent to validate user flows | `Agent(subagent_type="e2e-tester")` |
| 14 | Read report in `/docs/reports/code-review/` → fix ALL issues where status ≠ "complete" | — (lead) |

> **Why lead calls directly**: Lead is the integration reviewer across multiple teammates' work. Direct invocation gives better control over the review scope.

**Commit**: Per [workflow-commits.md](../git/references/workflow-commits.md) — Review phase

> 💡 **Context tip**: Consider `/clear` here. Review details are no longer needed.

---

## Phase 4: Validate & Finalize

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

### Sequential Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 12 | Run `e2e-tester` sub-agent | `Agent(subagent_type="e2e-tester")` |
| 13 | Fix bugs discovered in E2E (skip if all pass) | — (main agent) |
| 14 | Run `development-planner` sub-agent | `Agent(subagent_type="development-planner")` |
| 15 | Merge feature branch to `development` | — |
| 16 | **Pipeline State → `complete`**: Update `pipeline-state.json` and reset state | — |

### Team Mode

| Step | Action | Sub-Agent |
|------|--------|-----------|
| 15 | Fix integration issues found in Phase 3 | — (lead) |
| 16 | Run `development-planner` sub-agent | `Agent(subagent_type="development-planner")` |
| 17 | Merge working branch → `development` | — |
| 18 | Update `ROADMAP.md` and `PROJECT-STRUCTURE.md` | — |
| 19 | **Cleanup**: `rm -f .claude/ownership.json` (Team session ended) + update pipeline-state to `complete` | — |

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

## Mode Comparison

| Aspect | Sequential | Team |
|--------|------------|------|
| Context usage | All in main | Per teammate |
| Cost | Opus for all | Opus teammates |
| Parallelization | None | Full parallel |
| Recovery | Manual | Autonomous + lead |
| Scalability | Limited | High |

### When to Use Each Mode

| Scenario | Recommended Mode |
|----------|------------------|
| Quick bug fix (1-2 files) | Sequential |
| New component (3-5 files) | Sequential |
| Feature with multiple components (6+) | Team |
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
- **Lead**: Runs `code-reviewer` + `e2e-tester` as the single review gate post-merge
- Minimize sub-agent calls per teammate
- Avoid broadcast messages — message lead directly
