---
name: RBAC and Typecheck Hook Constraints
description: unit-test-writer is blocked from writing source files and package.json; typecheck hook fails when the typecheck script is missing, blocking even test file writes
type: feedback
---

The `typecheck.sh` PostToolUse hook runs `bun run typecheck` after every Write/Edit to a `.ts` file. If the `typecheck` script is absent from `package.json`, the hook exits with code 2, blocking the write — even for test files.

**Why:** The hook is strict and does not distinguish between "script missing" and "type error". Both cause exit 2 and roll back the write.

**RBAC boundary:** `unit-test-writer` cannot write to `package.json` or source files (only `__tests__/`, `*.test.ts`, `*.spec.ts`, and own memory). So fixing the missing script or creating source stubs must be done by the main agent.

**How to apply:** Before writing any test file in a new project area, verify two preconditions:
1. `package.json` has a `"typecheck": "tsc --noEmit"` script.
2. The source file being imported exists (even as a stub with `throw new Error("not implemented")` bodies).
If either is missing, surface the blocker to the user immediately — do not attempt to write the test file, as it will be rolled back.

**Red Phase stub pattern** (for main agent to create):
```ts
export function foo(_arg: string): string {
  throw new Error("not implemented");
}
```
This satisfies TypeScript imports (Green for typecheck) while keeping tests Red at runtime.
