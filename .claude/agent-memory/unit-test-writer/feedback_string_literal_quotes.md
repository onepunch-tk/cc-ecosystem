---
name: Korean curly quotes inside double-quoted string literals
description: Using curly/typographic double quotes inside a double-quoted it() description string causes TS1005 parse errors caught by the typecheck hook
type: feedback
---

Never embed ASCII double-quote characters (or their lookalikes) inside a double-quoted `it()` / `describe()` string literal. In Korean descriptions this often happens when referencing a format name like `"YYYY-MM-DD"` inside a sentence.

**Why:** TypeScript parses the inner `"` as the end of the string, producing TS1005 errors. The typecheck hook catches this and blocks the file write.

**How to apply:** When a test description contains a quoted term (e.g., a format string token), wrap the outer string with single quotes instead:

```ts
// Bad — inner " terminates the string
it("월이 한 자리일 때 "MM/DD/YYYY" 형식에서 두 자리로 패딩한다", ...)

// Good — outer single quotes avoid the conflict
it('월이 한 자리일 때 "MM/DD/YYYY" 형식에서 두 자리로 패딩한다', ...)
```
