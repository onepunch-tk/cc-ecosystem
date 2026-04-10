---
name: Review Report Skill — Output Conventions
description: How to generate and save review reports using the review-report skill in this project
type: feedback
---

## Report File Naming
Format: `{git_rev_parse_short_HEAD}_{YYYYMMDD}.md`
Example: `46689be_20260410.md`

## Output Directory
Always save to: `docs/reports/code-review/`
Always run `mkdir -p docs/reports/code-review/` before writing.

## Template Location
`/Users/tkstart/Desktop/project/cc-ecosystem/.claude/skills/review-report/references/report-template.md`

## Confidence Filtering
- High (90%+): Include in main findings tables
- Medium (70-89%): Include in main findings with advisory note
- Low (<70%): Include in Advisory section only

**Why:** The parent agent reads text output AND saved report files. The report file is the durable artifact the developer uses to track fixes.
**How to apply:** Always create the file — do not skip even for small reviews.
