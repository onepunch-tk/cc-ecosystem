# ClaudeCode & React Router Framework Starterkit

## Project Overview
- **Service Name**: [your service name]
- **Goal**: [Problem to solve and value to provide]
- **Target Users**: [Primary user target]
- **My Role**: [Your persona — e.g., CTO, CEO, Product Manager, Tech Lead. Determines how the agent addresses you during plan consultation. Leave blank to skip consultation step]

## Core Principles
> **Clean Architecture**: All projects use 4-layer CA (Domain → Application → Infrastructure → Presentation). Inner layers MUST NOT depend on outer layers.
> **TDD-First**: All implementations must be preceded by writing tests first. Follow Inside-Out order (Domain → Presentation).
> **Side Effect Awareness**: All code modifications (except tests) must be written with careful consideration of potential side effects.

## Tech Stack
- **Package Manager**: bun
- **Language**: TypeScript
- **Lint & Formatter**: biome

## Critical Documents
- Project Structure [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md): **MANDATORY** - Reference before ANY task
- Development RoadMap [docs/ROADMAP.md](docs/ROADMAP.md): **MANDATORY** - Defines "in what order" to build (implementation phases)

## Git Integration
- **Remote Platform**: GitHub

## Workflow
> Before starting any implementation task, load the `harness-pipeline` skill.

## Commands
| Command | Description |
|---------|-------------|
| `bun run test` | Run all unit tests once |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:coverage` | Run tests with coverage report |
| `bun run test:coverage:check` | Run tests with coverage (flexible thresholds) |
| `bun run typecheck` | TypeScript type checking |
