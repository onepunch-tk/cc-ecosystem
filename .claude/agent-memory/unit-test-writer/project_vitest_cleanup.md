---
name: Vitest cleanup workaround
description: vitest.setup.ts lacks afterEach cleanup — component tests must include it inline
type: project
---

vitest.setup.ts only imports `@testing-library/jest-dom/vitest` — no `afterEach(cleanup)`. RBAC blocks writes to that file from the unit-test-writer agent.

**Why:** The setup file is outside agent-allowed paths. Cleanup must be added per-file.

**How to apply:** Every component test file must include:
```ts
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
```

Use `vi.restoreAllMocks()` alongside `cleanup()` when tests use `vi.spyOn` — `vi.clearAllMocks()` only resets call history, not spy implementations.

`@testing-library/user-event` is NOT installed in this project. Use `fireEvent` from `@testing-library/react` for click/input events.
