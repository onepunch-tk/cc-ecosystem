---
name: tdd
description: "TDD (Test-Driven Development) rules and patterns. Use when: (1) Writing unit tests, (2) Determining test targets, (3) Following TDD cycle. Supports Expo, React Native, React Router, NestJS using Vitest/Jest."
---

# TDD Skill

TDD rules and patterns for Node/TypeScript/React projects.

---

## Test Target Rules

### Priority Order (IMPORTANT)

**Exclusions are evaluated FIRST, then Must Test patterns apply.**

```
1. Check Exclusion patterns → If matched, SKIP
2. Check Must Test patterns → If matched, WRITE TEST
3. If neither matched → SKIP (not a test target)
```

### Must Test

| Pattern | CA Layer | Description |
|---------|----------|-------------|
| `*.entity.ts` | Domain | Entity classes |
| `*.vo.ts` | Domain | Value Objects |
| `*.schema.ts` | Domain | Zod validation schemas |
| `*.service.ts` | Application | Service functions |
| `*.command.ts`, `*.query.ts` | Application | CQRS handlers |
| `*.mapper.ts` | Application | Entity ↔ DTO mappers |
| `*.helper.ts`, `*.util.ts` | Shared | Helper/utility functions |
| `*.tsx` (components) | Presentation | React components (**except** paths matching exclusions) |
| `loader`, `action` | Presentation | Route loaders/actions |
| `use*.ts` | Presentation | Custom hooks |

### Exclude from Testing (Evaluated First)

| Pattern | Reason |
|---------|--------|
| `**/components/ui/**` | shadcn/ui auto-generated (takes priority over `*.tsx`) |
| `*.d.ts` | Type declarations only |
| `**/types.ts`, `**/types/**` | Type definitions only |
| `**/*.port.ts` | Interface definitions only |
| `**/index.ts` | Barrel files (re-exports) |
| `*.config.ts` | Configuration files |
| `**/constants.ts`, `**/const.ts` | Static values only |
| `**/*.css`, `**/*.scss` | Style files |

---

## Naming Convention

Source → Test path mapping:

| Source Path | Test Path |
|-------------|-----------|
| `{root}/{domain-layer}/user/user.entity.ts` | `__tests__/{domain-layer}/user/user.entity.test.ts` |
| `{root}/{domain-layer}/user/email.vo.ts` | `__tests__/{domain-layer}/user/email.vo.test.ts` |
| `{root}/{app-layer}/auth/auth.service.ts` | `__tests__/{app-layer}/auth/auth.service.test.ts` |
| `{root}/{presentation-layer}/components/Button.tsx` | `__tests__/{presentation-layer}/components/Button.test.tsx` |

> `{root}`, `{domain-layer}`, `{app-layer}`, `{presentation-layer}` are actual paths from `docs/PROJECT-STRUCTURE.md`.

**Pattern**: Replace root folder with `__tests__/`, mirror the CA layer path, and add `.test` before extension.

---

## TDD Cycle

### Red → Green → Refactor

1. **Red** - Write a failing test
2. **Green** - Write minimal code to pass
3. **Refactor** - Improve code (keep tests passing)

---

## TDD Priority Order (Inside-Out by CA Layer)

When multiple files need tests, write and implement in this order:

| Priority | CA Layer | What to test | Mock rule |
|----------|----------|-------------|-----------|
| 1 | **Domain** | Entity, VO, Schema, Error | **No mocks** — pure logic only |
| 2 | **Application** | Service, Command, Query, Mapper | Mock ports (interfaces), use real Domain |
| 3 | **Infrastructure** | Repository impl, API client | Mock external I/O (DB, HTTP) |
| 4 | **Presentation** | Component, Hook, Route handler | Mock Application services |

> **Domain layer tests MUST NOT use mocks.** If a Domain test needs mocks, the design is wrong — domain logic should be pure.

---

## AAA Pattern

All tests follow AAA (Arrange-Act-Assert) pattern:

| Phase | Role | Example |
|-------|------|---------|
| **Arrange** | Prepare test data and environment | Mocking, input creation |
| **Act** | Execute test target | Function call, event trigger |
| **Assert** | Verify results | expect statements |

---

## Framework Test Environment

| Framework | Test Runner | Note |
|-----------|-------------|------|
| **Expo** | Jest | Vitest NOT supported |
| **React Native** | Jest | Vitest NOT supported |
| **React Router v7** | Vitest/Jest | Vitest recommended |
| **NestJS** | Jest | Official default |

### Vitest + React Testing Library Setup

When using **Vitest** with `@testing-library/react`, automatic cleanup between tests does NOT work by default. To prevent DOM accumulation across tests, add cleanup to `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
```

> If `vitest.setup.ts` already includes this cleanup, individual test files do NOT need their own `afterEach(cleanup)`.

### ESM Import Rules

All modern projects use ESM (`"type": "module"` in `package.json`). When writing tests:
- **Always use static `import`** — never `require()`
- Use relative paths from the test file to the source: `import Component from "../../../app/presentation/components/Component"`

### Red Phase: Missing Source Files Are Expected

During Red Phase, the source file being tested **does not exist yet**. This is normal and expected in TDD.

- **DO** use static `import` even though the file doesn't exist — vitest resolves imports at runtime, not compile time
- **DO NOT** use `require()` to "work around" missing modules — this breaks in ESM and defeats the purpose of Red Phase
- **DO NOT** treat TypeScript/LSP import errors as problems to solve — they are expected diagnostics that disappear after Green Phase
- The test should **fail at runtime** because the module is missing, confirming the Red Phase is correct

---

## Test Utility Structure

| Path | Purpose |
|------|---------|
| `__tests__/fixtures/` | Mock data builders |
| `__tests__/utils/` | Test helper functions |

**Rules**:
1. No inline helpers in test files - use shared locations
2. Check existing utilities before creating new ones
3. Support `overrides` parameter for customization

---

## Code Examples

Based on detected framework, read the corresponding reference file (paths relative to `.claude/skills/tdd/`):

| Framework | Reference File |
|-----------|----------------|
| React Router v7 | [references/react-router.example.md](./references/react-router.example.md) |
| React Component | [references/react-component.example.md](./references/react-component.example.md) |
| Zod Schema | [references/zod-schema.example.md](./references/zod-schema.example.md) |
| NestJS | [references/nestjs.example.md](./references/nestjs.example.md) |
| Expo/React Native | [references/expo-react-native.example.md](./references/expo-react-native.example.md) |

> **Note**: Reference examples use English test descriptions for universal accessibility. When writing actual tests, follow the Output Language Rules below.

---

## Output Language Rules

| Item | Language |
|------|----------|
| Test descriptions (`it`, `describe`) | Korean |
| Variable/function names | English |
| Code comments | Korean |

---

## Quality Checklist

Before completing tests:

- [ ] Test file follows naming convention
- [ ] All tests have Korean descriptions
- [ ] AAA pattern followed
- [ ] Mocks initialized in `beforeEach`
- [ ] No `any` type in test code
- [ ] Shared helpers in `__tests__/fixtures/` or `__tests__/utils/`
- [ ] Domain layer tests have zero mocks
- [ ] Test order follows CA Inside-Out priority (Domain first)
- [ ] All tests pass
