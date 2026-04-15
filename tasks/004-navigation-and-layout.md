# Task 004: Navigation and Layout Implementation

## Overview
Implement fixed header navigation with desktop inline menu and mobile hamburger menu. Add smooth scroll behavior.

## Dependencies
- **blockedBy**: Task 001, Task 003
- **blocks**: Task 005, Task 006

## Related Features
- F005 Responsive Navigation
- F007 Scroll Navigation

## Related Files
- `app/presentation/components/layout/Header.tsx` (update)
- `app/presentation/components/layout/Footer.tsx` (update)
- `app/root.tsx` (no change needed - already integrated)
- `app/presentation/components/layout/MobileMenu.tsx` (new)
- `app/presentation/hooks/scroll-to-section.ts` (new)

## Acceptance Criteria
- [x] Fixed header with logo and navigation links
- [x] Mobile hamburger menu toggle
- [x] Smooth scroll navigation
- [x] Footer with copyright
- [x] Unit tests
- [x] `bun run typecheck` passes

## Implementation Steps

### Step 1: Implement Desktop Header Navigation
- [x] Update Header.tsx with fixed positioning, logo, nav links

### Step 2: Implement Mobile Hamburger Menu
- [x] Create MobileMenu.tsx with open/close toggle

### Step 3: Implement Smooth Scroll Navigation
- [x] Create scrollToSection utility
- [x] Wire nav link clicks

### Step 4: Implement Footer and Integrate Layout
- [x] Update Footer.tsx, verify root.tsx layout

### Step 5: Write Unit Tests
- [x] Test Header, MobileMenu, Footer components

## Change History
| Date | Changes |
|------|---------|
| 2026-04-15 | Header with desktop nav links (소개/서비스/문의) and mobile hamburger toggle. MobileMenu with focus trap and Escape close. scrollToSection smooth scroll utility. Footer with dynamic links. All tests pass. |
