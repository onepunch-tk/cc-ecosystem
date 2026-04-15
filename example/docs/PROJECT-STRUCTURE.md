# Project Structure Guide

## Overview

TechFlow Landing Page - IT 컨설팅 회사의 소개 랜딩 페이지.

**Architecture Pattern**: Clean Architecture (4-layer separation)
**Framework**: React Router Framework v7.14.0

---

## Top-Level Directory Structure

```
example/
├── app/                    # Core application (Clean Architecture layers)
│   ├── domain/             # Layer 1: Business rules and entities
│   ├── application/        # Layer 2: Use cases and business logic
│   ├── infrastructure/     # Layer 3: External system integrations
│   ├── presentation/       # Layer 4: UI components and hooks
│   ├── routes/             # React Router v7 route entries
│   ├── root.tsx            # Root component
│   ├── routes.ts           # Route definitions
│   └── app.css             # Global styles (Tailwind)
├── docs/                   # Documentation
├── tasks/                  # Task specifications
├── public/                 # Static assets
└── [config files]
```

## app/domain/

Business rules and entity definitions (no external dependencies).

```
app/domain/
├── entities/           # Core business objects (ContactSubmission)
└── schemas/            # Zod validation schemas
```

## app/application/

Business logic and use case implementation.

```
app/application/
├── services/           # Business logic implementations
└── ports/              # External system interface definitions
```

## app/infrastructure/

External system integration and implementations.

```
app/infrastructure/
├── config/             # DI container
└── (repository implementations)
```

## app/presentation/

UI, routing, user interface related.

```
app/presentation/
├── components/
│   ├── common/         # Reusable UI primitives (Button, Card, Input, etc.)
│   ├── sections/       # Page sections (Hero, About, Services, Contact)
│   └── layout/         # Layout components (Header, Footer)
└── hooks/              # Custom React hooks
```

## app/routes/

React Router v7 route entry points.

- `home.tsx` - Landing page index route

## Path Aliases

```typescript
"~/*" → "./app/*"
```

## File Location Summary by Task

| Task | Location |
|------|----------|
| UI 컴포넌트 | `app/presentation/components/` |
| 비즈니스 로직 | `app/application/services/` |
| 인터페이스 정의 | `app/application/ports/` |
| 엔터티/타입 | `app/domain/entities/` |
| 검증 스키마 | `app/domain/schemas/` |
| 인프라 구현체 | `app/infrastructure/` |
| 라우트 | `app/routes/` |
| 테스트 | `app/**/*.test.{ts,tsx}` |
