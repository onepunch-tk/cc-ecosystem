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
- [x] ContactSubmission entity defined with all PRD fields
- [x] Zod schema validates name, email, message
- [ ] Component prop types defined (deferred to Phase 2)
- [x] API response types defined
- [x] Port interface defined
- [x] `bun run typecheck` passes

## Implementation Steps

### Step 1: Define Domain Entity
- [x] Create `contact-submission.entity.ts` with id, name, email, company, phone, message, submittedAt

### Step 2: Create Zod Validation Schemas
- [x] Create `contact-submission.schema.ts` with contactFormSchema (name 2-50, email, company max 100, phone max 20, message 10-1000)
- [x] Write 10 unit tests for schema validation — all passing

### Step 3: Define Shared Types and Port Interface
- [ ] Create `app/presentation/types.ts` with section component prop types (deferred to Phase 2)
- [x] Create `app/application/contact/contact.port.ts` with ContactRepositoryPort interface
- [x] Define ActionResponse<T> discriminated union type in `app/domain/contact/types.ts`

## Change History
| Date | Changes |
|------|---------|
| 2026-04-15 | Completed: entity, schema with Zod validation, ActionResponse type, ContactRepositoryPort. 10 schema tests passing. Component prop types deferred to Phase 2. |
