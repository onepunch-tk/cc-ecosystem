# Project Structure Guide

## Overview

TechFlow Landing Page -- an IT consulting company landing page built with React Router Framework v7. The project introduces professional services and drives potential client inquiries via a single-page experience with section-based navigation (Hero, About, Services, Contact).

**Architecture Pattern**: Clean Architecture (4-layer separation)
**Framework**: React Router Framework v7+ (SSR enabled)
**Key Characteristics**:
- Server-side rendering enabled by default via `react-router.config.ts`
- Strict dependency flow: Presentation → Application → Domain
- Infrastructure isolated via Dependency Injection
- Design tokens defined in `app.css` using TailwindCSS v4 `@theme` directive
- Unit tests co-located with source code using `__tests__/` subdirectories

---

## Top-Level Directory Structure

```
example/
├── app/                    # Core application (Clean Architecture layers)
│   ├── domain/             # Business rules and entity definitions
│   ├── application/        # Business logic and use cases
│   ├── infrastructure/     # External system implementations
│   ├── presentation/       # UI, routing, components, hooks
│   ├── root.tsx            # React Router root component and Layout
│   ├── routes.ts           # Route definitions
│   └── app.css             # Global styles and TailwindCSS design tokens
├── public/                 # Static assets (favicon, images)
├── biome.json              # Biome linter and formatter configuration
├── Dockerfile              # Multi-stage Docker build for production
├── package.json            # Dependencies and scripts
├── react-router.config.ts  # React Router Framework configuration
├── tsconfig.json           # TypeScript configuration with path aliases
├── vite.config.ts          # Vite build configuration
├── vitest.config.ts        # Vitest test runner configuration
└── vitest.setup.ts         # Test setup (jest-dom matchers)
```

**Key directories**:
- `app/` - Core application (Clean Architecture layers)
- `public/` - Static assets

---

## app/ Directory (Core Application)

Follows Clean Architecture 4-layer structure.

### app/domain/

**Role**: Business rules and entity definitions (no external dependencies)

**Contains**:
- Entity - Core business objects (e.g., ContactSubmission)
- Types - Domain-related TypeScript types
- Schemas - Zod validation schemas (e.g., contact form validation)
- Errors - Domain-specific error classes

**When to use**:
- Adding new business concepts (e.g., contact form data model)
- When form validation schemas are needed
- Defining custom business errors

**Structure**:
```
app/domain/
└── contact/
    ├── contact-submission.entity.ts
    ├── contact-submission.schema.ts
    ├── types.ts
    └── __tests__/
        └── contact-submission.entity.test.ts
```

**Example entities/schemas**:
- `ContactSubmission` entity with name, email, company, phone, message fields
- Zod schema for contact form validation (required fields, email format, length constraints)

---

### app/application/

**Role**: Business logic and use case implementation

**Contains**:
- Service - Business logic implementation
- Port - External system interface definitions

**When to use**:
- Adding new business logic (e.g., contact form submission processing)
- When communication with external systems is needed

**Structure**:
```
app/application/
└── contact/
    ├── contact.service.ts
    ├── contact.port.ts
    └── __tests__/
        └── contact.service.test.ts
```

**Port and Service relationship**:
- `*.port.ts` - Interface definition (what can be done)
- `*.service.ts` - Business logic (how to do it)

**Example services**:
- `ContactService` - Processes contact form submissions via port interface
- `ContactRepositoryPort` - Interface for persisting contact submissions

---

### app/infrastructure/

**Role**: External system integration and implementations

**Contains**:
- **config/**: DI container (Composition Root)
- **persistence/**: Repository implementations (e.g., console logger for contact submissions)

**When to use**:
- Creating new repository implementations → `persistence/`
- Registering new services to DI container → `config/container.ts`

**Structure**:
```
app/infrastructure/
├── config/
│   └── container.ts
└── persistence/
    └── contact/
        └── console-contact.repository.ts
```

**Example integrations**:
- `ConsoleContactRepository` - Implements ContactRepositoryPort by logging to console
- DI container wiring services with their infrastructure implementations

---

### app/presentation/

**Role**: UI, routing, user interface related

**Contains**:
- **components/**: UI components (common reusable components and section-specific components)
- **hooks/**: Custom React hooks
- **routes/**: Pages (React Router v7 route modules)

**When to use**:
- Adding new pages → `routes/`
- Creating UI components → `components/`
- When custom hooks are needed → `hooks/`

**Structure**:
```
app/presentation/
├── components/
│   ├── common/          # Reusable UI primitives (Button, Card, Input, etc.)
│   └── sections/        # Page section components (Hero, About, Services, Contact)
├── hooks/
└── routes/
    └── home.tsx         # Landing page index route
```

**Route file conventions (React Router v7)**:
- `_layout.tsx` - Layout wrapper
- `_index.tsx` - Index route
- `$param.tsx` - Dynamic segment
- `route.tsx` - Route component

**Example routes**:
- `home.tsx` - Landing page with all sections (Hero, About, Services, Contact)

---

### app/ Root Files

| File | Role | When to modify |
|------|------|----------------|
| `root.tsx` | React Router root component, Layout with HTML shell, ErrorBoundary | When adding global Providers |
| `routes.ts` | Route definitions (currently: index route to `routes/home.tsx`) | When adding new pages/layouts |
| `app.css` | Global styles, TailwindCSS v4 design tokens (`@theme` block with brand colors, shadows) | When adding global CSS variables or design tokens |

---

## Other Key Directories

### public/

**Role**: Static asset storage (served directly without build)

**Contains**: Favicon and other static assets

---

## Path Aliases

```typescript
// Defined in tsconfig.json
"~/*" → "./app/*"
```

**Usage example**:
```typescript
import { ContactSubmission } from "~/domain/contact/contact-submission.entity";
import { ContactService } from "~/application/contact/contact.service";
```

---

## File Location Summary by Task

| Task | Location |
|------|----------|
| Add new page | `app/presentation/routes/` |
| Add UI component | `app/presentation/components/` |
| Add business logic | `app/application/{domain}/` |
| Define types/entities | `app/domain/{domain}/` |
| Add repository implementation | `app/infrastructure/persistence/` |
| Add DI wiring | `app/infrastructure/config/` |
| Write test files | Co-located `__tests__/` directories (e.g., `app/{layer}/{domain}/__tests__/`) |
| Add static files | `public/` |
| Modify design tokens | `app/app.css` (`@theme` block) |
