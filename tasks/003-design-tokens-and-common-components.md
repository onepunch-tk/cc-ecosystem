# Task 003: Design Tokens and Common Component Library

## Overview
Establish design system with TailwindCSS tokens and build reusable UI primitives.

## Dependencies
- **blockedBy**: Task 001
- **blocks**: Task 004, Task 005, Task 006

## Related Features
- All features (shared component foundation)

## Related Files
- `app/app.css` (update with design tokens)
- `app/presentation/components/common/Button.tsx` (new)
- `app/presentation/components/common/Card.tsx` (new)
- `app/presentation/components/common/Input.tsx` (new)
- `app/presentation/components/common/Textarea.tsx` (new)
- `app/presentation/components/common/SectionWrapper.tsx` (new)
- `app/presentation/components/common/index.ts` (new barrel)
- `app/infrastructure/dummy-data.ts` (new)
- `app/domain/landing/types.ts` (new - types moved from infrastructure)
- `app/presentation/utils/to-id.ts` (new - shared utility)

## Acceptance Criteria
- [x] TailwindCSS design tokens defined
- [x] Button, Card, Input, Textarea, SectionWrapper components implemented
- [x] Barrel export index file created
- [x] Dummy data for sections available
- [x] Unit tests exist for all common components
- [x] `bun run typecheck` passes

## Implementation Steps

### Step 1: Define Design Tokens
- [x] Update `app/app.css` with CSS custom properties for colors, typography, spacing

### Step 2: Implement Common UI Components
- [x] Create SectionWrapper, Button, Card, Input, Textarea
- [x] Create barrel index.ts

### Step 3: Write Component Unit Tests
- [x] Tests for all 5 common components

### Step 4: Create Dummy Data Utilities
- [x] Create `app/infrastructure/dummy-data.ts` with hero, about, services data

## Change History
| Date | Changes |
|------|---------|
| 2026-04-15 | Design tokens synced with tokens.json. Button (solid/ghost/accent), Card, Input, Textarea, SectionWrapper implemented with unit tests. Dummy data and barrel export created. Types moved to domain/landing/types.ts per code review. |
