# Task 005: Hero and About Section UI

## Overview
Implement the Hero and About section components with full UI using dummy data.

## Dependencies
- **blockedBy**: Task 002, Task 003, Task 004
- **blocks**: Task 008

## Related Features
- F001 Hero Section
- F002 About Section

## Related Files
- `app/presentation/components/sections/HeroSection.tsx`
- `app/presentation/components/sections/AboutSection.tsx`
- `app/infrastructure/dummy-data.ts`
- `app/presentation/components/common/`

## Acceptance Criteria
- [ ] Hero section displays company slogan, description text, and CTA button
- [ ] CTA button scrolls to the Contact section when clicked
- [ ] About section displays vision and mission text
- [ ] About section shows 3 core value cards with icon, title, and description
- [ ] Both sections are fully responsive
- [ ] Unit tests for both section components
- [ ] `bun run typecheck` passes

## Implementation Steps

### Step 1: Implement Hero Section
- [ ] Update `HeroSection.tsx` with headline, description, CTA button
- [ ] Style with full-viewport-height, centered content
- [ ] Apply responsive typography

### Step 2: Implement About Section
- [ ] Update `AboutSection.tsx` with vision/mission text
- [ ] Create grid of 3 core value Card components
- [ ] Responsive grid: 1 col mobile, 3 cols desktop

### Step 3: Write Unit Tests
- [ ] Test HeroSection renders slogan and CTA button
- [ ] Test AboutSection renders vision/mission and 3 value cards

## Change History
| Date | Changes |
|------|---------|
| | |
