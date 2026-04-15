# Task 002: Type Definitions and Schema Design

## Overview
Define all TypeScript types, domain entities, Zod validation schemas, and API response types.

## Dependencies
- **blockedBy**: Task 001
- **blocks**: Task 005, Task 006, Task 007

## Related Features
- F004 Contact Form (data model)
- F006 Form Validation (schemas)
- F008 Form Submission Feedback (response types)

## Related Files
- `app/domain/entities/contact-submission.entity.ts` (new)
- `app/domain/schemas/contact-form.schema.ts` (new)
- `app/presentation/types.ts` (new)
- `app/application/ports/contact.port.ts` (new)

## Acceptance Criteria
- [ ] ContactSubmission entity defined with all PRD fields
- [ ] Zod schema validates name, email, message
- [ ] Component prop types defined
- [ ] API response types defined
- [ ] Port interface defined
- [ ] `bun run typecheck` passes

## Implementation Steps

### Step 1: Define Domain Entity
- [ ] Create `contact-submission.entity.ts` with id, name, email, message, submittedAt

### Step 2: Create Zod Validation Schemas
- [ ] Create `contact-form.schema.ts` with contactFormSchema
- [ ] Write unit tests for schema validation

### Step 3: Define Shared Types and Port Interface
- [ ] Create `app/presentation/types.ts` with section component prop types
- [ ] Create `app/application/ports/contact.port.ts` with ContactPort interface
- [ ] Define ActionResponse type

## Change History
| Date | Changes |
|------|---------|
| | |
