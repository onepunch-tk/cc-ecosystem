# Git PR

Create PR + merge + cleanup. **GitHub Mode only** — requires `Remote Platform: GitHub` in CLAUDE.md.

## Agent Role (intelligence)

1. Compose PR title: Conventional Commits format
   - `✨ feat: implement login (#42)`
2. Compose PR body:
   - `## Summary` — change summary
   - `## Changes` — changed file list
   - `## Test Results` — test results (include coverage if available)
3. Retrieve issue number: from `pipeline-state.json` `issue_number` or branch name

## Execution (delegate to script)

```bash
"$CLAUDE_PROJECT_DIR"/.claude/hooks/git-pr.sh \
  --title "<emoji> <type>: <description>" \
  --body "<PR body>" \
  --issue <issue_number>
```

Script handles automatically: push, PR creation, merge (--merge), branch deletion, development checkout.

## Cautions

- Uncommitted changes must be committed first
- Cannot run from main/development branch
- On conflict, script returns error — guide user to resolve manually
