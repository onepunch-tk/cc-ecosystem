# Project Structure Guide

## Overview

React Router Framework v7 기반 Clean Architecture 스타터킷 예제 프로젝트.

**Architecture Pattern**: Clean Architecture (4-layer separation)
**Framework**: React Router Framework v7.14.0
**Key Characteristics**:
- CA 레이어(domain, application, infrastructure, presentation)는 필요에 따라 점진적으로 추가
- 엄격한 의존성 방향: Presentation -> Application -> Domain
- Infrastructure는 DI를 통해 격리

---

## Top-Level Directory Structure

```
example/
├── app/                    # Core application
│   ├── routes/             # React Router v7 route entries
│   ├── welcome/            # Welcome page assets (scaffold default)
│   ├── root.tsx            # Root component
│   ├── routes.ts           # Route definitions
│   └── app.css             # Global styles (Tailwind)
├── public/                 # Static assets
└── [config files]          # TS, Vite, Vitest, Biome, Docker configs
```

---

## app/ Directory (Core Application)

Clean Architecture 4-layer 구조 구현 완료.

```
app/
├── domain/             # Layer 1: Business rules and entities
│   ├── entities/       # Core business objects (ContactSubmission, ApiResponse)
│   └── schemas/        # Zod v4 validation schemas (contactFormSchema)
├── application/        # Layer 2: Use cases and business logic
│   ├── services/       # Business logic implementations
│   └── ports/          # External system interface definitions
├── infrastructure/     # Layer 3: External system integrations
│   └── config/         # DI container (Composition Root)
└── presentation/       # Layer 4: UI components and hooks
    ├── components/     # UI components (common/, sections/, layout/)
    │   ├── common/     # Reusable UI primitives
    │   ├── sections/   # Page sections (Hero, About, Services, Contact)
    │   └── layout/     # Layout components (Header, Footer)
    └── hooks/          # Custom React hooks
```

---

### app/routes/

**Role**: React Router v7 route entry points

**Contains**:
- `home.tsx` - Landing page index route

**Route file conventions (React Router v7)**:
- `_layout.tsx` - Layout wrapper
- `_index.tsx` - Index route
- `$param.tsx` - Dynamic segment

---

### app/ Root Files

| File | Role | When to modify |
|------|------|----------------|
| `root.tsx` | React Router root component | When adding global Providers |
| `routes.ts` | Route definitions | When adding new pages/layouts |
| `app.css` | Global styles (Tailwind) | When adding global CSS variables |

---

## public/

**Role**: Static asset storage (served directly without build)

**Contains**: favicon 등 정적 에셋

---

## Config Files

| File | Role |
|------|------|
| `react-router.config.ts` | React Router Framework 설정 |
| `vite.config.ts` | Vite 빌드 설정 |
| `vitest.config.ts` | Vitest 테스트 러너 설정 |
| `vitest.setup.ts` | 테스트 환경 setup |
| `tsconfig.json` | TypeScript 컴파일러 설정 |
| `biome.json` | Biome lint/formatter 설정 |
| `Dockerfile` | Docker 컨테이너 빌드 |

---

## Path Aliases

```typescript
// Defined in tsconfig.json
"~/*" -> "./app/*"
```

**Usage example**:
```typescript
import { Something } from "~/domain/entities/something.entity";
```

---

## File Location Summary by Task

| Task | Location |
|------|----------|
| UI 컴포넌트 추가 | `app/presentation/components/` |
| 비즈니스 로직 추가 | `app/application/services/` |
| 인터페이스 정의 | `app/application/ports/` |
| 엔터티/타입 정의 | `app/domain/entities/` |
| 검증 스키마 | `app/domain/schemas/` |
| 인프라 구현체 | `app/infrastructure/` |
| 라우트 추가 | `app/routes/` |
| 테스트 파일 | `app/**/__tests__/*.test.{ts,tsx}` |
| 정적 파일 | `public/` |
