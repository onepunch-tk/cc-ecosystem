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

## Acceptance Criteria
- [ ] TailwindCSS design tokens defined
- [ ] Button, Card, Input, Textarea, SectionWrapper components implemented
- [ ] Barrel export index file created
- [ ] Dummy data for sections available
- [ ] Unit tests exist for all common components
- [ ] `bun run typecheck` passes

## Implementation Steps

### Step 1: Define Design Tokens
- [ ] Update `app/app.css` with CSS custom properties for colors, typography, spacing

### Step 2: Implement Common UI Components
- [ ] Create SectionWrapper, Button, Card, Input, Textarea
- [ ] Create barrel index.ts

### Step 3: Write Component Unit Tests
- [ ] Tests for all 5 common components

### Step 4: Create Dummy Data Utilities
- [ ] Create `app/infrastructure/dummy-data.ts` with hero, about, services data

## Change History
| Date | Changes |
|------|---------|
| | |
