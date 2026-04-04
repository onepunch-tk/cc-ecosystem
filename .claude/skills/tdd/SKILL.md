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

| Pattern | Description |
|---------|-------------|
| `*.service.ts` | Service functions |
| `*.helper.ts`, `*.util.ts` | Helper/utility functions |
| `*.tsx` (components) | React components (**except** paths matching exclusions) |
| `loader`, `action` | Route loaders/actions |
| `*.schema.ts` | Zod schemas |
| `use*.ts` | Custom hooks |
| `*.entity.ts` | Aggregate Roots and Entities |
| `*.vo.ts` | Value Objects |
| `*.event.ts` | Domain Events |
| `**/domain/**/services/*.ts` | Domain Services |
| `*.factory.ts` | Aggregate Factories |

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
| `app/services/auth.service.ts` | `__tests__/services/auth.service.test.ts` |
| `app/components/Button.tsx` | `__tests__/components/Button.test.tsx` |
| `src/domain/order/entities/order.entity.ts` | `__tests__/domain/order/entities/order.entity.test.ts` |
| `src/domain/shared/value-objects/money.vo.ts` | `__tests__/domain/shared/value-objects/money.vo.test.ts` |
| `src/domain/order/events/order-placed.event.ts` | `__tests__/domain/order/events/order-placed.event.test.ts` |
| `app/domain/user/user.schema.ts` | `__tests__/domain/user/user.schema.test.ts` |

**Pattern**: Replace root folder with `__tests__/` and add `.test` before extension.

---

## TDD Cycle

### Red → Green → Refactor

1. **Red** - Write a failing test
2. **Green** - Write minimal code to pass
3. **Refactor** - Improve code (keep tests passing)

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
| Aggregate Root | [references/ddd-aggregate.example.md](./references/ddd-aggregate.example.md) |
| Value Object | [references/ddd-value-object.example.md](./references/ddd-value-object.example.md) |
| Domain Event & Domain Service | [references/ddd-domain-event.example.md](./references/ddd-domain-event.example.md) |

> **Note**: Reference examples use English test descriptions for universal accessibility. When writing actual tests, follow the Output Language Rules below.

---

## Output Language Rules

| Item | Language |
|------|----------|
| Test descriptions (`it`, `describe`) | Korean |
| Variable/function names | English |
| Code comments | Korean |

---

## TDD Priority Order (Inside-Out)

```
1. Value Objects     → Pure logic, no dependencies, test first
2. Domain Events     → Simple data carriers, test payload & naming
3. Aggregate Root    → Invariants, state transitions, event raising
4. Domain Services   → Cross-aggregate logic, pure domain
5. Application Layer → Use cases, port mocking
6. Infrastructure    → Repository implementations, external adapters
7. Presentation      → Controllers, routes, UI
```

**Key Testing Rules**:
- **No infrastructure in domain tests** — If you need to mock DB/HTTP, it's in the wrong layer
- **Test invariants explicitly** — Every aggregate invariant gets its own test
- **Test create vs reconstitute** — Factory creation raises events, reconstitution does not
- **Test immutability** — Value Object operations return new instances

---

## Quality Checklist

Before completing tests:

- [ ] Test file follows naming convention
- [ ] All tests have Korean descriptions
- [ ] AAA pattern followed
- [ ] Mocks initialized in `beforeEach`
- [ ] No `any` type in test code
- [ ] Shared helpers in `__tests__/fixtures/` or `__tests__/utils/`
- [ ] All tests pass
- [ ] Domain layer tests have zero mocks (no infrastructure leaking)
- [ ] All aggregate invariants have explicit test cases
