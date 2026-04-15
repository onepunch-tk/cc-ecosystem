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
- [ ] Services section displays 4 service cards in a responsive grid
- [ ] Contact section renders a form with name, email, message fields
- [ ] Form fields use common Input and Textarea components
- [ ] Both sections are fully responsive
- [ ] Unit tests for both section components
- [ ] `bun run typecheck` passes

## Implementation Steps

### Step 1: Implement Services Section
- [ ] Update `ServicesSection.tsx` with 4 Card components from dummy data
- [ ] Responsive grid: 1 col mobile, 2 tablet, 4 desktop

### Step 2: Implement Contact Form UI
- [ ] Update `ContactSection.tsx` with React Router `<Form>` component
- [ ] Add Input (name, email), Textarea (message), submit Button

### Step 3: Write Unit Tests
- [ ] Test ServicesSection renders 4 cards
- [ ] Test ContactSection renders all form fields and submit button

## Change History
| Date | Changes |
|------|---------|
| | |
