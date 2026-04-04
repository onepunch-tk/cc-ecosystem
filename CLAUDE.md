# ClaudeCode & React Router Framework Starterkit

## Project Overview
- **Service Name**: [your service name]
- **Goal**: [Problem to solve and value to provide]
- **Target Users**: [Primary user target]

## Core Principles
> **TDD-First**: All implementations must be preceded by writing tests first.
> **DDD Architecture**: All projects use Domain-Driven Design — domain modeling before implementation, inside-out TDD order.
> **Side Effect Awareness**: All code modifications (except tests) must be written with careful consideration of potential side effects.

## Tech Stack
- **Package Manager**
  - bun
- **Language**: TypeScript
- **Lint & Formatter**
  - biome

## Critical Documents
- Project Structure [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md): **MANDATORY** - Reference before ANY task
- PRD Document [docs/PRD.md](docs/PRD.md): **MANDATORY** - Defines "what" to build (features, requirements)
- Development RoadMap [docs/ROADMAP.md](docs/ROADMAP.md): **MANDATORY** - Defines "in what order" to build (implementation phases)
- Domain Models [docs/domain/](docs/domain/): **MANDATORY** - Bounded Contexts, Aggregates, Events, Glossary

## Workflow
> Before starting any implementation task, load the `harness-pipeline` skill.
> The pipeline always starts with domain modeling (Phase 0) using the `domain-modeling` skill.

## Code Conventions [MANDATORY]

### File Naming Convention (React Router Framework) [CRITICAL]
- `*.client.ts` / `*.client.tsx` → **Client-side ONLY** (browser execution)
- `*.server.ts` / `*.server.tsx` → **Server-side ONLY** (SSR execution)

⚠️ **CRITICAL WARNING**:
Files with `.client.ts` suffix are EXCLUDED from server bundles.
If you name a server-side utility `something.client.ts`, it will be bundled as `void 0` and cause runtime errors like `X is not a function`.

**Correct naming**:
- ✅ `notion-client.ts` — Hyphen, not dot before "client"
- ✅ `notion.service.ts` — Different suffix
- ❌ `notion.client.ts` — Treated as client-only, causes SSR errors

### React 19 Optimization [STRICT]
- **Trust React Compiler**: `useCallback` and `useMemo` **strictly prohibited** unless empirically justified.
- Prioritize code readability over premature optimization.

### Function Definitions
- **Utility/Handler functions**: Arrow syntax → `export const fn = () => { ... }`
- **React Components**: Named export → `export default function Component() { ... }`

### Type Safety
- **NO `any`**: Use `unknown` + type guards (Zod, `is` keyword)
- **Generics**: Always use `extends` constraints → `<T extends Record<string, unknown>>`

## File Creation Rules
| Pattern | Rule |
|---------|------|
| `*.client.ts(x)` | **CLIENT-SIDE ONLY** — excluded from SSR bundle |
| `*.server.ts(x)` | **SERVER-SIDE ONLY** — not available in browser |
| `*.d.ts` | Type declarations only |
| `**/types.ts` | Type definitions only |
| `**/*.port.ts` | Interface definitions only |
| `**/index.ts` | Barrel files (re-exports) |
| `*.entity.ts` | Aggregate Roots and Entities |
| `*.vo.ts` | Value Objects (immutable) |
| `*.event.ts` | Domain Events |
| `*.factory.ts` | Aggregate Factories |

## Commands
| Command | Description |
|---------|-------------|
| `bun run test` | Run all unit tests once |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:coverage` | Run tests with coverage report |
| `bun run test:coverage:check` | Run tests with coverage (flexible thresholds) |
| `bun run typecheck` | TypeScript type checking |

## Post-Completion Documentation
After workflow completion, update **as needed**:

| Document | Update When |
|----------|-------------|
| `docs/PROJECT-STRUCTURE.md` | New directories, files, or architectural changes |
| `docs/PRD.md` | Feature scope changes or new requirements |
| `docs/domain/glossary.md` | New domain terms or definition changes |
| `docs/domain/context-map.md` | New Bounded Contexts or relationship changes |
| `CLAUDE.md` | Workflow improvements or new conventions |