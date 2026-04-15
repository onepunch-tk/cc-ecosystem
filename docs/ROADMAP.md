# TechFlow Landing Page Development Roadmap

IT consulting company landing page that introduces professional services and drives potential client inquiries via a single-page experience.

## Overview

TechFlow Landing Page provides the following features as a conversion-focused single-page site for potential clients and partner contacts:

- **Section-Based Navigation**: Fixed header with smooth scroll navigation between Hero, About, Services, and Contact sections (F005, F007)
- **Service Showcase**: Company vision, mission, core values, and 4 service cards presented with responsive layouts (F001, F002, F003)
- **Contact Form with Server Action**: Validated inquiry form processed via React Router action with success/error feedback (F004, F006, F008)

## Development Workflow

1. **Task Planning**

   - Learn the existing codebase and understand the current state
   - Update `ROADMAP.md` to include new tasks
   - Insert priority tasks after the last completed task

2. **Task Creation**

   - Learn the existing codebase and understand the current state
   - Create new task files in the `/tasks` directory
   - Naming format: `XXX-description.md` (e.g., `001-setup.md`)
   - Include high-level specifications, related files, acceptance criteria, and implementation steps
   - Reference the last completed tasks in `/tasks` directory for examples. For instance, if the current task is `012`, reference `011` and `010` as examples.
   - These examples are completed tasks, so their content reflects the final state of completed work (checked boxes and change summaries). For new tasks, the document should have empty boxes and no change summaries. Refer to `000-sample.md` for an initial state sample.

3. **Task Implementation**

   - Follow the specifications in the task file
   - Implement features and functionality
   - Update step progress within the task file after each step
   - Stop after completing each step and wait for further instructions

4. **Task Completion & Roadmap Update**

   - **CRITICAL**: Update `/tasks/XXX-description.md` task file:
     - Mark completed items with `[x]` checkboxes
     - Fill in the Change History table with date and changes summary
   - Mark completed tasks with ✅ in ROADMAP.md
   - Add `**Must** Read:` reference link to completed tasks

## PRD Feature Coverage

| Feature ID | Feature Name | Covered By Tasks |
|-----------|-------------|-----------------|
| F001 | Hero Section | 001 (shell), 005 (UI) |
| F002 | About Section | 001 (shell), 005 (UI) |
| F003 | Services Section | 001 (shell), 006 (UI) |
| F004 | Contact Form | 001 (shell), 006 (UI), 007 (action) |
| F005 | Responsive Navigation | 001 (shell), 004 (implementation) |
| F006 | Form Validation | 002 (schema), 007 (wiring) |
| F007 | Scroll Navigation | 004 (smooth scroll) |
| F008 | Form Submission Feedback | 002 (types), 007 (display) |

## Development Phases

### Phase 1: Application Skeleton Build ✅

- ✅ **Task 001: Project Structure and Route Setup** - Completed
  - blockedBy: none
  - blocks: Task 002, Task 003, Task 004
  - **Must** Read: [001-project-structure-and-route-setup.md](/tasks/001-project-structure-and-route-setup.md)
  - ✅ Create Clean Architecture 4-layer directory structure under `app/`
  - ✅ Create empty shell components for Header, Footer, Hero, About, Services, Contact
  - ✅ Configure `app/routes.ts` with landing page index route and root layout

- ✅ **Task 002: Type Definitions and Schema Design** - Completed
  - blockedBy: Task 001
  - blocks: Task 005, Task 006, Task 007
  - **Must** Read: [002-type-definitions-and-schema-design.md](/tasks/002-type-definitions-and-schema-design.md)
  - ✅ Define ContactSubmission domain entity with all PRD fields
  - ✅ Create Zod validation schemas for contact form
  - ✅ Define shared component prop types, API response types, and port interface

### Phase 2: UI/UX Completion (Using Dummy Data) ✅

- ✅ **Task 003: Design Tokens and Common Component Library** - Completed
  - blockedBy: Task 001
  - blocks: Task 004, Task 005, Task 006
  - **Must** Read: [003-design-tokens-and-common-components.md](/tasks/003-design-tokens-and-common-components.md)
  - ✅ Define TailwindCSS design tokens in `app/app.css`
  - ✅ Implement Button, Card, Input, Textarea, SectionWrapper common components
  - ✅ Write unit tests for all common components and create dummy data utilities

- ✅ **Task 004: Navigation and Layout Implementation** - Completed
  - blockedBy: Task 001, Task 003
  - blocks: Task 005, Task 006
  - **Must** Read: [004-navigation-and-layout.md](/tasks/004-navigation-and-layout.md)
  - ✅ Implement fixed header with desktop inline menu and mobile hamburger menu
  - ✅ Implement smooth scroll navigation between sections
  - ✅ Implement Footer component and integrate layout in root

- ✅ **Task 005: Hero and About Section UI** - Completed
  - blockedBy: Task 002, Task 003, Task 004
  - blocks: Task 008
  - **Must** Read: [005-hero-and-about-section-ui.md](/tasks/005-hero-and-about-section-ui.md)
  - ✅ Implement Hero section with company slogan, description, and CTA button
  - ✅ Implement About section with vision/mission text and 3 core value cards
  - ✅ Write unit tests for both section components with responsive layout

### Phase 3: Core Feature Implementation

- **Task 006: Services and Contact Section UI**
  - blockedBy: Task 002, Task 003, Task 004
  - blocks: Task 007, Task 008
  - Implement Services section with 4 service cards in responsive grid
  - Implement Contact section form UI with Input, Textarea, and submit Button
  - Write unit tests for both section components

- **Task 007: Contact Form Validation and Server Action**
  - blockedBy: Task 002, Task 006
  - blocks: Task 008
  - Implement contact service and console repository (infrastructure layer)
  - Add React Router server action with Zod validation and console logging
  - Wire client-side form with useActionData, error display, success feedback, and loading state

### Phase 4: Quality Assurance and Polish

- **Task 008: Integration Testing, Accessibility, and Final Polish**
  - blockedBy: Task 005, Task 006, Task 007
  - blocks: none
  - Audit semantic HTML, ARIA labels, heading hierarchy, and keyboard accessibility
  - Add SEO meta tags (title, description, OG tags)
  - Write integration tests covering full user journey and verify responsive design at all viewports
