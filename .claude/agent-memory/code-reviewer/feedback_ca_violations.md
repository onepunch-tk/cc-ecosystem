---
name: CA Layer Violations — Domain Layer Import Rules
description: Patterns that violate Clean Architecture inner→outer dependency rule, seen in this codebase
type: feedback
---

Domain layer files (`src/domain/**`) must NOT import from:
- Test frameworks (`vitest`, `jest`, `mocha`) — even unused imports
- Framework packages (`@nestjs/*`, `react`, `express`)
- Application, Infrastructure, or Presentation layer modules

**Why:** CLAUDE.md states "Inner layers MUST NOT depend on outer layers." An import of `vitest` in a domain source file (not a test file) couples the Domain layer to the test toolchain and can bloat production bundles.

**How to apply:** For every Domain-layer file in scope, scan all import statements. Any import from a package that is not a pure TypeScript/JS utility or another Domain-layer module is a CA violation — flag as High severity.

**Example found in `src/domain/utils/string.ts:1`:**
```ts
import { describe } from "vitest"; // unused — intentional violation
```
This must be removed entirely.
