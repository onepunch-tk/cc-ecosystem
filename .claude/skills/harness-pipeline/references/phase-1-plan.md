# Phase 1: Plan (All Modes)

> **Default**: `EnterPlanMode` (local planning — always available)
> **Upgrade**: ultraplan (cloud-based planning — requires user to manually trigger via `/ultraplan` command)

| Step | Action |
|------|--------|
| 1 | Read `CLAUDE.md`. Read `docs/ROADMAP.md` if it exists (skip if not — e.g., bug fix without roadmap) |
| 1a | **CA Structure Check**: Read `docs/PROJECT-STRUCTURE.md`. If it does NOT exist → auto-invoke `project-structure` skill to generate it from the CA template |
| 1b | **Load CA Template**: Detect framework type and load the matching CA template from `.claude/skills/project-structure/references/` (react-router, nestjs, or expo). Use the template's **File Location Summary by Task** table as the file placement guide |
| 2 | **Enter plan mode**: Call `EnterPlanMode` to start local planning. Output a summary of gathered context and task description for the user. Inform the user they can upgrade to ultraplan via `/ultraplan` if desired. |
| 2a | **Pipeline State → `plan`**: Set `pipeline-state.json` `current_phase` to `"plan"`, `plan_approved` to `false` (ABAC hook blocks source code modifications during plan phase). Mode is finalized after Step 4, so set `"pending"` for now. (see Pipeline State Management in SKILL.md) |
| 3 | Analyze current state and create detailed step-by-step plan in the plan file. **File placement MUST follow the CA template's layer structure**: Domain → Application → Infrastructure → Presentation |
| 4 | **Count files and features** → determine execution mode (Sequential / Team) |
| 4z | **Pipeline State mode finalized**: Update `pipeline-state.json` with the mode determined in Step 4 (`"sequential"` \| `"team"`) |
| 5 | Plan review → approve via `ExitPlanMode` (user may upgrade to ultraplan at this point) |
| 5z | **CRITICAL**: After plan approval, update `pipeline-state.json` with `"plan_approved": true`. The `pipeline-guardian` hook will **block Phase 2 entry** if this is `false`. |

## Ultraplan (Optional Upgrade)

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

## CA File Placement Rules

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

## Task Creation (Immediately After Plan Approval)

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
- Implement HeroSection — company name, tagline, gradient background, 2 CTA buttons
- Run code-reviewer and fix reported issues
- Run E2E test to verify page renders correctly
- Merge feature/company-intro-page → development
```

> **NOTE**: The example above is for reference only. Actual tasks MUST be derived from the approved plan and the current project state.

## Git Setup (Immediately After Plan Approval)

> **CRITICAL**: Branch creation MUST happen immediately after plan approval, BEFORE any code changes.

| Step | Action |
|------|--------|
| 5a | Fetch latest and switch to `development` branch: `git fetch origin && git checkout development 2>/dev/null \|\| git checkout -b development main && git pull origin development 2>/dev/null \|\| true` |
| 5b | Create feature branch from `development`. Branch name MUST follow the naming convention in [commit-prefix-rules.md](../../git/references/commit-prefix-rules.md): `feature/*`, `fix/*`, `docs/*`, `refactor/*`, `test/*`, `chore/*`. Derive the name dynamically from the task content |

## Team Mode Addition (Phase 1)

| Step | Action |
|------|--------|
| 4a | Break work into tasks with **clear file ownership** (no overlapping files) |
| 4b | Verify NO file overlap between tasks before spawning teammates |
| 4c | Prepare teammate task prompts with file ownership lists |

> **WARNING: File Ownership is CRITICAL**
> Overlapping file assignments = merge conflicts = wasted work.
> Lead MUST verify NO file overlap before spawning teammates.
