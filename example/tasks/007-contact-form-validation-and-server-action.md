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
- [ ] Client-side validation with field-level errors
- [ ] React Router action processes form server-side
- [ ] Server validates with Zod and logs to console
- [ ] Success/error feedback displayed
- [ ] Form resets after success
- [ ] Submit button loading state
- [ ] Unit tests
- [ ] `bun run typecheck` passes

## Implementation Steps

### Step 1: Implement Service and Infrastructure
- [ ] Create contact.service.ts and contact-console.repository.ts
- [ ] Write unit tests

### Step 2: Implement Server Action
- [ ] Add action export to home.tsx
- [ ] Parse FormData, validate with Zod, log, return response

### Step 3: Wire Client-Side Form
- [ ] Use useActionData and useNavigation
- [ ] Display errors, success message, loading state

## Change History
| Date | Changes |
|------|---------|
| | |
