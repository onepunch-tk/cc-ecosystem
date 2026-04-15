# ClaudeCode & React Router Framework Starterkit

## Project Overview
- **Service Name**: TechFlow Landing Page
- **Goal**: IT 컨설팅 회사의 소개 랜딩 페이지. 회사 소개, 서비스, 연락처 정보를 제공
- **Target Users**: 잠재 고객 및 파트너
- **My Role**: 

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
- **Remote Platform**: 

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
