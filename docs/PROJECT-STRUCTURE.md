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
cc-ecosystem/
├── app/                    # Core application (Clean Architecture layers)
│   ├── domain/             # Business rules and entity definitions
│   ├── application/        # Business logic and use cases
│   ├── infrastructure/     # External system implementations (scaffolded, not yet populated)
│   ├── presentation/       # UI, routing, components, hooks
│   ├── root.tsx            # React Router root component and Layout
│   ├── routes.ts           # Route definitions
│   └── app.css             # Global styles and TailwindCSS design tokens
├── docs/                   # Project documentation (root only)
│   ├── design-system/      # Design tokens and source HTML references
│   └── reports/            # Pipeline-generated reports (code-review, design-review, failures)
├── example/                # Reference implementation (standalone, excluded from tsconfig)
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
- `docs/` - All project documentation (root-level only, never in sub-packages)
- `example/` - Standalone reference implementation (excluded from root build/typecheck)
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
        └── contact-submission.schema.test.ts
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
    └── contact.port.ts
```

**Port and Service relationship**:
- `*.port.ts` - Interface definition (what can be done)
- `*.service.ts` - Business logic (how to do it)

**Current state**: `ContactRepositoryPort` interface defined; service implementation pending.

---

### app/infrastructure/

**Role**: External system integration and implementations

**Contains**:
- **config/**: DI container (Composition Root)
- **persistence/**: Repository implementations

**When to use**:
- Creating new repository implementations → `persistence/`
- Registering new services to DI container → `config/container.ts`

**Structure**:
```
app/infrastructure/
├── config/                 # (scaffolded, awaiting DI container)
└── persistence/
    └── contact/            # (scaffolded, awaiting repository implementation)
```

**Current state**: Directory structure scaffolded but not yet populated. Will house concrete implementations of application-layer ports.

---

### app/presentation/

**Role**: UI, routing, user interface related

**Contains**:
- **components/**: UI components organized by concern
  - **common/**: Reusable UI primitives (Button, Card, Input, etc.) -- scaffolded, awaiting implementation
  - **sections/**: Page section components (Hero, About, Services, Contact)
  - **layout/**: Persistent structural components (Header, Footer)
- **hooks/**: Custom React hooks -- scaffolded, awaiting implementation
- **routes/**: Pages (React Router v7 route modules)

**When to use**:
- Adding new pages → `routes/`
- Creating reusable UI primitives → `components/common/`
- Creating page sections → `components/sections/`
- Creating layout components → `components/layout/`
- When custom hooks are needed → `hooks/`

**Structure**:
```
app/presentation/
├── components/
│   ├── common/          # Reusable UI primitives (scaffolded)
│   ├── sections/        # Page section components (Hero, About, Services, Contact)
│   └── layout/          # Structural layout components (Header, Footer)
├── hooks/               # Custom React hooks (scaffolded)
└── routes/
    └── home.tsx         # Landing page index route
```

**Current state**: Section and layout components exist as shell implementations with placeholder content and TailwindCSS styling. Common components and hooks directories are scaffolded for future use.

**Route file conventions (React Router v7)**:
- `_layout.tsx` - Layout wrapper
- `_index.tsx` - Index route
- `$param.tsx` - Dynamic segment
- `route.tsx` - Route component

**Example routes**:
- `home.tsx` - Landing page composing Header, all sections (Hero, About, Services, Contact), and Footer

---

### app/ Root Files

| File | Role | When to modify |
|------|------|----------------|
| `root.tsx` | React Router root component, Layout with HTML shell, ErrorBoundary | When adding global Providers |
| `routes.ts` | Route definitions (currently: index route to `routes/home.tsx`) | When adding new pages/layouts |
| `app.css` | Global styles, TailwindCSS v4 design tokens (`@theme` block with brand colors, shadows) | When adding global CSS variables or design tokens |

---

## Other Key Directories

### docs/

**Role**: All project documentation (root-level only per project convention)

**Contains**:
- **design-system/**: Design tokens (`tokens.json`), design system guide, and source HTML references used for implementation
- **reports/**: Pipeline-generated reports for code review, design review, and failures
- Top-level docs: `PROJECT-STRUCTURE.md`, `ROADMAP.md`, `PRD.md`

### example/

**Role**: Standalone reference implementation of the same landing page concept

**Contains**: A fully implemented version with its own `package.json`, build config, and complete CA layer implementations. Excluded from root `tsconfig.json` and serves as an architectural reference only.

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
import { ContactRepositoryPort } from "~/application/contact/contact.port";
```

---

## File Location Summary by Task

| Task | Location |
|------|----------|
| Add new page | `app/presentation/routes/` |
| Add UI component | `app/presentation/components/` |
| Add layout component | `app/presentation/components/layout/` |
| Add section component | `app/presentation/components/sections/` |
| Add business logic | `app/application/{domain}/` |
| Define types/entities | `app/domain/{domain}/` |
| Add repository implementation | `app/infrastructure/persistence/` |
| Add DI wiring | `app/infrastructure/config/` |
| Write test files | Co-located `__tests__/` directories (e.g., `app/{layer}/{domain}/__tests__/`) |
| Add static files | `public/` |
| Modify design tokens | `app/app.css` (`@theme` block) |
| Update design system docs | `docs/design-system/` |
