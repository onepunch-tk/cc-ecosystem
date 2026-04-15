# CC-Ecosystem

A **Claude Code ecosystem configuration repository** that can be copied into any project via the `.claude/` directory and config files for immediate use. Includes agents, skills, hooks, MCP server settings, and a CLAUDE.md template.

---

## Project Structure

```
cc-ecosystem/
├── CLAUDE.md                          # Project guide template (lean — conventions in rules/)
├── .mcp.json                          # MCP server configuration
├── .gitignore
└── .claude/
    ├── settings.json                  # Hooks, env vars, plugin settings
    ├── pipeline-state.json            # Pipeline phase state (ABAC + plan_approved)
    ├── hook-state.json                # Pipeline guardian dedup/cooldown state
    ├── ownership.json                 # Team file ownership (ReBAC)
    ├── rules/                         # Conditional instructions (loaded on file edit)
    │   ├── file-conventions.md        # File naming + CA layer rules (*.ts, *.tsx)
    │   ├── react-rules.md             # React 19 optimization (*.tsx)
    │   └── code-style.md              # Function defs + type safety (*.ts, *.tsx)
    ├── agents/
    │   ├── docs/                      # Documentation agents (5)
    │   │   ├── prd-generator.md
    │   │   ├── prd-validator.md
    │   │   ├── development-planner.md
    │   │   ├── roadmap-validator.md
    │   │   └── project-structure-analyzer.md
    │   └── dev/                       # Development agents (4)
    │       ├── unit-test-writer.md
    │       ├── e2e-tester.md
    │       ├── code-reviewer.md
    │       └── starter-cleaner.md
    ├── skills/                        # Skills (6)
    │   ├── prd/
    │   ├── git/
    │   ├── tdd/
    │   ├── project-structure/
    │   ├── review-report/
    │   └── harness-pipeline/
    │       ├── SKILL.md               # Main pipeline (lean — phases in references/)
    │       └── references/            # Phase-specific instructions (loaded on-demand)
    │           ├── phase-1-plan.md
    │           ├── phase-2-tdd.md
    │           ├── phase-3-review.md
    │           ├── phase-4-validate.md
    │           └── team-protocol.md
    └── hooks/                         # Hook scripts (11) + Utility scripts (3)
        ├── .env.hooks
        ├── biome-format.sh
        ├── block-dangerous-commands.sh
        ├── protect-files.sh
        ├── typecheck.sh
        ├── slack-notify.sh
        ├── pipeline-guardian.sh
        ├── gh-auth-check.sh             # PreToolUse: gh auth validation
        ├── rbac-agent-role.sh
        ├── abac-phase-policy.sh
        ├── rebac-ownership.sh
        ├── rebac-teammate-idle.sh
        ├── git-issue.sh                 # Utility: GitHub Issue creation
        ├── git-pr.sh                    # Utility: PR creation + merge + cleanup
        └── git-release.sh              # Utility: Release PR + tag
```

---

## Components

### CLAUDE.md - Project Guide Template

A lean Claude Code configuration file (32 lines) that defines core principles, tech stack, and workflow entry point. Detailed code conventions are loaded conditionally from `.claude/rules/` only when editing matching files.

Key contents:
- **Core Principles**: Clean Architecture (4-layer), TDD-First (Inside-Out), Side Effect Awareness
- **Critical Document Links**: PRD, ROADMAP, PROJECT-STRUCTURE
- **Commands**: `bun run test`, `bun run typecheck`, etc.

### .claude/rules/ - Conditional Instructions

Loaded only when editing files that match the `paths` frontmatter pattern. Reduces session startup token cost by deferring conventions until they are relevant.

| Rule | Loaded When | Contents |
|------|------------|----------|
| `file-conventions.md` | Editing `*.ts`, `*.tsx` | File naming (.client.ts/.server.ts), CA layer file patterns |
| `react-rules.md` | Editing `*.tsx` | React 19 Compiler optimization, useCallback/useMemo guidance |
| `code-style.md` | Editing `*.ts`, `*.tsx` | Function definitions (arrow vs named), type safety (no `any`) |

### Agents

#### Documentation Agents (5)

| Agent | Description |
|-------|-------------|
| `prd-generator` | Unified PRD generation for Web/Backend/Mobile/Multi-platform (uses prd skill) |
| `prd-validator` | Technical feasibility analysis and validation of written PRDs |
| `development-planner` | Project manager that creates, updates, and maintains ROADMAP.md |
| `roadmap-validator` | Validates completeness and consistency of ROADMAP.md and task files |
| `project-structure-analyzer` | Analyzes project structure and writes/updates PROJECT-STRUCTURE.md |

#### Development Agents (4)

| Agent | Description |
|-------|-------------|
| `unit-test-writer` | Test engineer that writes unit tests following TDD principles (uses tdd skill) |
| `e2e-tester` | Validates full user flows in web applications via E2E testing |
| `code-reviewer` | Unified review covering code quality, security (OWASP Top 10), and performance |
| `starter-cleaner` | Removes demo code and boilerplate from starter kits for production readiness |

### Skills (6)

| Skill | Command | Description |
|-------|---------|-------------|
| `prd` | -- | PRD generation rules, platform-specific templates, consistency validation (Web/Backend/Mobile/Multi-platform) |
| `git` | `/git` | Git operations: commit, push, sync, issue, pr, release, merge. GitHub Mode auto-detected from CLAUDE.md |
| `tdd` | `/tdd` | TDD rules and patterns -- Red-Green-Refactor cycle guide |
| `project-structure` | `/project-structure` | Auto-generate PROJECT-STRUCTURE.md from Clean Architecture templates |
| `review-report` | `/review-report` | Generate standardized code review reports |
| `harness-pipeline` | `/harness-pipeline` | Unified dev pipeline -- phases loaded on-demand from references/, auto-detects Sequential or Team mode |

### Hooks (11) + Utility Scripts (3)

#### Base Hooks (5)

| Hook | Trigger | Description |
|------|---------|-------------|
| `biome-format.sh` | PostToolUse (Edit/Write) | Auto-run Biome formatting on file save |
| `block-dangerous-commands.sh` | PreToolUse (Bash) | Block dangerous commands (`rm -rf /`, `sudo`, `git clean -fd`, device writes) |
| `protect-files.sh` | PreToolUse (Edit/Write) | Block modifications to protected files (lock files, `.env`, credentials) |
| `typecheck.sh` | PostToolUse (Edit/Write) | Auto-run TypeScript type check on file save |
| `slack-notify.sh` | Notification/Stop | Send Slack webhook notifications for permission requests, idle, completion |

#### Workflow Hook (1)

| Hook | Trigger | Description |
|------|---------|-------------|
| `pipeline-guardian.sh` | Stop | Monitors workflow compliance, enforces Failure Recovery, and auto-detects doc update needs. Blocks Claude from stopping when: plan not approved, TDD Green phase incomplete (with configurable retry up to `FAILURE_RECOVERY_MAX_RETRIES`, default 20), review skipped, or docs need updating. Per-session retry tracking for Team Mode safety. |

#### GitHub Integration Hook (1)

| Hook | Trigger | Description |
|------|---------|-------------|
| `gh-auth-check.sh` | PreToolUse (Bash) | Auto-validates `gh` auth when any `gh` command is executed. Blocks if GitHub Mode is not configured or auth is expired. |

#### Git Utility Scripts (3)

Called by the agent via Bash (not event-driven hooks). Handle mechanical git operations — agent only composes title/body (intelligence), scripts handle push/merge/cleanup (automation).

| Script | Description |
|--------|-------------|
| `git-issue.sh` | Creates GitHub Issue via `gh issue create`. Handles prerequisite checks, duplicate detection, returns issue number. |
| `git-pr.sh` | Full PR lifecycle: push → create PR → merge → close issue → delete branch → reset pipeline state. |
| `git-release.sh` | Release workflow: development → main PR → merge → tag → GitHub Release → return to development. |

#### Access Control Hooks (4)

| Hook | Trigger | Description |
|------|---------|-------------|
| `rbac-agent-role.sh` | PreToolUse (Edit/Write) | Role-based write permission -- restricts each agent to designated paths |
| `abac-phase-policy.sh` | PreToolUse (Edit/Write) | Phase-based source code blocking -- prevents code edits during plan phase and when plan is not approved (hard block) |
| `rebac-ownership.sh` | PreToolUse (Edit/Write) | File ownership check for subagent-spawned agents (Team mode) |
| `rebac-teammate-idle.sh` | TeammateIdle | Post-hoc ownership violation detection when teammates go idle |

### MCP Servers (3)

| Server | Type | Description |
|--------|------|-------------|
| `context7` | HTTP | Real-time lookup of latest library documentation and code examples |
| `sequential-thinking` | stdio | Step-by-step analysis tool for complex problems |
| `shadcn` | stdio | Search, install, and browse shadcn/ui component examples |

### Settings

Key settings managed in `.claude/settings.json`:

| Setting | Value | Description |
|---------|-------|-------------|
| `enabledPlugins` | `typescript-lsp`, `discord` | TypeScript LSP and Discord plugins enabled |
| `ENABLE_TOOL_SEARCH` | `true` | Enable tool search feature |
| `MAX_MCP_OUTPUT_TOKENS` | `50000` | MCP output token limit |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | `1` | Enable agent teams feature |
| `FAILURE_RECOVERY_MAX_RETRIES` | `20` | Max stop-block retries during TDD Green phase (0 to disable) |

---

## Workflow Overview

CC-Ecosystem provides agent-assisted support for the entire development cycle from idea to merge.
**Clean Architecture is the default**, and all code is developed in CA layer order (Inside-Out).

```
Idea
  |
  v
+---------------+     +------------------+     +------------------+
| PRD Creation  |---->| PRD Validation   |---->| Roadmap Creation |
| prd-generator |     | prd-validator    |     | development-     |
|               |     |                  |     | planner          |
+---------------+     +------------------+     +------------------+
                                                      |
                                                      v
                                            +------------------+
                                            | Roadmap Validation|
                                            | roadmap-validator |
                                            +------------------+
                                                      |
                                                      v
+-----------------------------------------------------------------+
|              Development (CA + TDD Inside-Out)                  |
|                                                                 |
|  /harness-pipeline                                              |
|  Phase 1: Plan -- Load CA template, plan file placement by layer|
|  Phase 2: TDD  -- Domain > App > Infra > Presentation order    |
|  Phase 3: Review -- CA dependency direction check included      |
|  Phase 4: Validate & Finalize -- E2E, ROADMAP update, merge    |
|                                                                 |
|  Mode: Sequential (1-5 files) | Team (6+ files, parallel)      |
|                                                                 |
|  +--------+    +--------+    +--------+    +----------------+   |
|  |Red:    |--->|Green:  |--->|Refactor|--->| Code Review    |   |
|  |Tests   |    |Impl    |    |        |    | + CA Dependency |   |
|  |(Domain |    |(Inside |    |        |    |   Direction     |   |
|  | first) |    | -Out)  |    |        |    |   Check         |   |
|  +--------+    +--------+    +--------+    +----------------+   |
|       ^                                            |            |
|       +--------------------------------------------+            |
+-----------------------------------------------------------------+
                              |
                              v
                    +------------------+
                    | GitHub Mode:     |
                    |  Issue → PR →    |
                    |  Merge → Close   |
                    |                  |
                    | Local Mode:      |
                    |  /git merge      |
                    +------------------+

  pipeline-guardian (Stop hook) monitors each phase transition,
  enforces Failure Recovery (Green phase guard), and reminds
  about doc updates before merge.
  gh-auth-check (PreToolUse hook) validates gh auth on every gh command.
```

---

## Usage

### 1. Clone Repository

```bash
git clone <repository-url> cc-ecosystem
```

### 2. Copy to Project

Copy the required files to your target project's root directory.

```bash
# Full copy (recommended)
cp -r cc-ecosystem/.claude /your/project/
cp cc-ecosystem/.mcp.json /your/project/
cp cc-ecosystem/CLAUDE.md /your/project/

# Or selective copy
cp -r cc-ecosystem/.claude/agents /your/project/.claude/
cp -r cc-ecosystem/.claude/skills /your/project/.claude/
cp -r cc-ecosystem/.claude/hooks /your/project/.claude/
cp -r cc-ecosystem/.claude/rules /your/project/.claude/
```

### 3. Modify CLAUDE.md

Update `CLAUDE.md` to match your project. Key sections to configure:

#### Project Overview

```markdown
## Project Overview
- **Service Name**: My Awesome App
- **Goal**: An app that delivers the best user experience
- **Target Users**: General users
- **My Role**: CTO
```

**`My Role`** determines how the agent interacts with you during plan consultation (Phase 1 Step 3a — Stakeholder Consultation). Examples:

| Value | Effect |
|-------|--------|
| `CTO` | Agent addresses you as CTO, asks for technical direction |
| `Product Manager` | Agent focuses on product requirements, prioritization |
| `Tech Lead` | Agent asks about architecture decisions, team impact |
| *(empty)* | Stakeholder Consultation is skipped entirely |

#### Git Integration

```markdown
## Git Integration
- **Remote Platform**: GitHub
```

**`Remote Platform`** enables Issue-Driven Development with automatic PR workflow:

| Value | Effect |
|-------|--------|
| `GitHub` | `gh` CLI required. Enables `/git issue`, `/git pr`, `/git release`. Pipeline creates Issues, PRs, auto-closes Issues on merge. |
| *(empty or omitted)* | Local Mode. Uses direct `git merge`. No Issue/PR features. |

When GitHub is configured but `gh` is not authenticated, the `gh-auth-check` hook blocks all `gh` commands and instructs the user to run `! gh auth login`.

### 4. Environment Setup

```bash
# Grant execute permissions to hook scripts
chmod +x /your/project/.claude/hooks/*.sh

# Slack notification setup (optional)
vi /your/project/.claude/hooks/.env.hooks
```

### 5. Start Development

```bash
# Launch Claude Code and start workflow
claude

# Start development pipeline (auto-detects mode)
> /harness-pipeline
```

---

## Customization

### Hook Environment Variables (`.claude/hooks/.env.hooks`)

Set the webhook URL to enable Slack notifications.

```bash
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
PROJECT_NAME="your-project-name"
```

### MCP Server API Keys (`.mcp.json`)

Set the API key to use the Context7 server.

```json
{
  "mcpServers": {
    "context7": {
      "headers": {
        "CONTEXT7_API_KEY": "your-actual-api-key"
      }
    }
  }
}
```

### CLAUDE.md Template Customization

Modify `CLAUDE.md` if your project uses a different tech stack or conventions.

- **Tech Stack**: Change package manager, language, linter to match your project
- **Code Conventions**: Add/modify rules in `.claude/rules/` for project-specific conventions
- **Commands**: Update with your project's actual script commands
- **Critical Documents**: Modify if document paths differ

### Selective Hook Disabling

Remove the corresponding hook entry from `.claude/settings.json` if a specific hook is not needed.

### Adding Agents/Skills

Add new markdown files to `.claude/agents/` or `.claude/skills/` directories to create custom agents or skills.
