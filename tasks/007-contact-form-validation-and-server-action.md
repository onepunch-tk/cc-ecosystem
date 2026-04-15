# Task 007: Contact Form Validation and Server Action

## Overview
Wire up Contact form with Zod validation, React Router server action, and feedback display.

## Dependencies
- **blockedBy**: Task 002, Task 006
- **blocks**: Task 008

## Related Features
- F004 Contact Form (server action)
- F006 Form Validation
- F008 Form Submission Feedback

## Related Files
- `app/routes/home.tsx` (add action export)
- `app/presentation/components/sections/ContactSection.tsx` (update)
- `app/domain/schemas/contact-form.schema.ts` (use)
- `app/application/services/contact.service.ts` (new)
- `app/infrastructure/contact-console.repository.ts` (new)

## Acceptance Criteria
- [x] Client-side validation with field-level errors
- [x] React Router action processes form server-side
- [x] Server validates with Zod and logs to console
- [x] Success/error feedback displayed
- [x] Form resets after success
- [x] Submit button loading state
- [x] Unit tests
- [x] `bun run typecheck` passes

## Implementation Steps

### Step 1: Implement Service and Infrastructure
- [x] Create contact.service.ts and contact-console.repository.ts
- [x] Write unit tests

### Step 2: Implement Server Action
- [x] Add action export to home.tsx
- [x] Parse FormData, validate with Zod, log, return response

### Step 3: Wire Client-Side Form
- [x] Use useActionData and useNavigation
- [x] Display errors, success message, loading state

## Change History
| Date | Changes |
|------|---------|
| 2026-04-15 | Completed all steps. Implemented contact service and console repository (infrastructure layer), React Router server action with Zod validation and console logging, client-side form wiring with useActionData, error display, success feedback, and loading state. |
