# Git Issue

Create a GitHub Issue. **GitHub Mode only** — requires `Remote Platform: GitHub` in CLAUDE.md.

## Agent Role (intelligence)

1. Determine Issue title from task context (emoji prefix + description)
2. Compose Issue body (description + task items)
3. Select label matching the type

| Type | Label | Emoji |
|------|-------|-------|
| feature | `enhancement` | ✨ |
| bug | `bug` | 🐛 |
| docs | `documentation` | 📝 |
| refactor | `refactor` | ♻️ |

## Execution (delegate to script)

```bash
"$CLAUDE_PROJECT_DIR"/.claude/hooks/git-issue.sh \
  --title "<emoji> <description>" \
  --body "<body>" \
  --label "<label>"
```

Script handles automatically: prerequisite checks, duplicate detection, issue creation, number extraction.

**Last line of output**: `ISSUE_NUMBER=42` — parse this for branch naming.
