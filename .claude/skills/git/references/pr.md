# Git PR

Create PR + merge + cleanup. **GitHub Mode only** — requires `Remote Platform: GitHub` in CLAUDE.md.

## Language Rule

> **PR title and body MUST be written in the user's language** (detected from conversation context).
> Template section headers (Summary, Changes, etc.) remain in English for consistency.

## Agent Role (intelligence)

1. Compose PR title: Conventional Commits format **in user's language**
   - e.g., `✨ feat: 로그인 기능 구현 (#42)` (Korean user)
   - e.g., `✨ feat: implement login (#42)` (English user)
2. Fill in the template below (**content in user's language**, headers in English)
3. Retrieve issue number: from `pipeline-state.json` `issue_number` or branch name

## PR Body Template (MUST follow)

```markdown
## Summary
{1-line change summary}

## Changes
| File | Description |
|------|-------------|
| `file1.ts` | {what changed} |
| `file2.ts` | {what changed} |

## Test Results
- Total: {N} tests, {N} passed
- Coverage: {if available}

## Review
- Report: `docs/reports/code-review/{report}.md`
- Issues found: {N}, Issues fixed: {N}

---
Related: #{issue_number}
```

## Execution (delegate to script)

```bash
.claude/hooks/git-pr.sh \
  --title "<emoji> <type>: <description in user's language>" \
  --body "<body following template above>" \
  --issue <issue_number>
```

Script handles automatically: push, PR creation, merge (--merge), issue close, branch deletion, pipeline-state reset, development checkout.

## Cautions

- Uncommitted changes must be committed first
- Cannot run from main/development branch
- On conflict, script returns error — guide user to resolve manually
