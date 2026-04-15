# Task 006: Services and Contact Section UI

## Overview
Implement the Services section with 4 service cards and the Contact section with the inquiry form UI.

## Dependencies
- **blockedBy**: Task 002, Task 003, Task 004
- **blocks**: Task 007, Task 008

## Related Features
- F003 Services Section
- F004 Contact Form
- F006 Form Validation (UI display only)
- F008 Form Submission Feedback (UI display only)

## Related Files
- `app/presentation/components/sections/ServicesSection.tsx`
- `app/presentation/components/sections/ContactSection.tsx`
- `app/infrastructure/dummy-data.ts`
- `app/presentation/components/common/`

## Acceptance Criteria
- [x] Services section displays 4 service cards in a responsive grid
- [x] Contact section renders a form with name, email, message fields
- [x] Form fields use common Input and Textarea components
- [x] Both sections are fully responsive
- [x] Unit tests for both section components
- [x] `bun run typecheck` passes

## Implementation Steps

### Step 1: Implement Services Section
- [x] Update `ServicesSection.tsx` with 4 Card components from dummy data
- [x] Responsive grid: 1 col mobile, 2 tablet, 4 desktop

### Step 2: Implement Contact Form UI
- [x] Update `ContactSection.tsx` with React Router `<Form>` component
- [x] Add Input (name, email), Textarea (message), submit Button

### Step 3: Write Unit Tests
- [x] Test ServicesSection renders 4 cards (6 tests)
- [x] Test ContactSection renders all form fields and submit button (14 tests)

## Change History
| Date | Changes |
|------|---------|
| 2026-04-15 | Completed all steps. Services section with 4 cards in responsive grid, Contact section form UI with Input/Textarea/Button wired with React Router Form. Unit tests: ServicesSection 6 tests, ContactSection 14 tests. |
