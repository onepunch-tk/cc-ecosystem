---
name: Project Code Style Rules
description: Mandatory code style rules from .claude/rules/code-style.md and file-conventions.md for this project
type: project
---

## Function Syntax
- Utility/handler functions: arrow syntax `export const fn = () => {}`
- React components: `export default function Component() {}`
- Violations: `export function` for utilities is a High severity finding

## Type Safety
- NO `any` — explicit prohibition in code-style.md; flag as High severity
- Correct alternative: `unknown` + type guard (`typeof`, Zod, `is` keyword)
- Generics must use `extends` constraints: `<T extends Record<string, unknown>>`

## File Naming (Critical)
- `*.client.ts` = client-side ONLY, excluded from SSR bundle — causes `X is not a function` errors if misused
- `*.server.ts` = server-side ONLY
- Correct: `notion-client.ts` (hyphen), NOT `notion.client.ts` (dot)

**Why:** The React Router Framework used here excludes `.client.ts` files from server bundles entirely.
**How to apply:** Flag any server-side utility with `.client.ts` suffix as Critical.

## CA Layer File Patterns
| Pattern | Layer |
|---------|-------|
| `*.entity.ts` | Domain |
| `*.vo.ts` | Domain |
| `*.schema.ts` | Domain |
| `*.service.ts` | Application |
| `**/*.port.ts` | Application |
| `*.mapper.ts` | Application |
| `*.repository.ts` | Infrastructure |
