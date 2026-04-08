#!/bin/bash
set -euo pipefail

# PreToolUse Hook: Phase-based source code modification blocking (ABAC)
# matcher: Edit|Write
#
# Reads current_phase from .claude/pipeline-state.json.
# Blocks source code file modifications during plan phase.
# docs/, tasks/, .claude/, test files are allowed even during plan phase.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[[ "$TOOL_NAME" != "Edit" && "$TOOL_NAME" != "Write" ]] && exit 0
[[ -z "$FILE_PATH" ]] && exit 0

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$PWD}"
STATE_FILE="$PROJECT_DIR/.claude/pipeline-state.json"

# No state file — no restrictions (backward compatibility)
[[ ! -f "$STATE_FILE" ]] && exit 0

PHASE=$(jq -r '.current_phase // "none"' "$STATE_FILE" 2>/dev/null || echo "none")

# Only enforce during plan phase (other phases handled by RBAC/ReBAC)
[[ "$PHASE" != "plan" ]] && exit 0

REL="${FILE_PATH#$PROJECT_DIR/}"

# Paths/file types allowed during plan phase
is_allowed_during_plan() {
  local rel="$1"

  # Always allowed: docs, tasks, .claude internals
  [[ "$rel" == docs/* ]] && return 0
  [[ "$rel" == tasks/* ]] && return 0
  [[ "$rel" == .claude/* ]] && return 0

  # Always allowed: test files
  [[ "$rel" == *__tests__/* ]] && return 0
  [[ "$rel" == *.test.ts ]] && return 0
  [[ "$rel" == *.test.tsx ]] && return 0
  [[ "$rel" == *.test.js ]] && return 0
  [[ "$rel" == *.test.jsx ]] && return 0
  [[ "$rel" == *.spec.ts ]] && return 0
  [[ "$rel" == *.spec.tsx ]] && return 0
  [[ "$rel" == *.spec.js ]] && return 0

  # Always allowed: markdown, config files
  [[ "$rel" == *.md ]] && return 0
  [[ "$rel" == *.json ]] && return 0
  [[ "$rel" == *.yaml ]] && return 0
  [[ "$rel" == *.yml ]] && return 0
  [[ "$rel" == *.toml ]] && return 0
  [[ "$rel" == *.env ]] && return 0
  [[ "$rel" == *.env.* ]] && return 0
  [[ "$rel" == .gitignore ]] && return 0
  [[ "$rel" == .gitattributes ]] && return 0

  # Source code extensions — blocked
  [[ "$rel" == *.ts ]] && return 1
  [[ "$rel" == *.tsx ]] && return 1
  [[ "$rel" == *.js ]] && return 1
  [[ "$rel" == *.jsx ]] && return 1
  [[ "$rel" == *.mjs ]] && return 1
  [[ "$rel" == *.cjs ]] && return 1
  [[ "$rel" == *.py ]] && return 1
  [[ "$rel" == *.go ]] && return 1
  [[ "$rel" == *.java ]] && return 1
  [[ "$rel" == *.rs ]] && return 1
  [[ "$rel" == *.rb ]] && return 1
  [[ "$rel" == *.swift ]] && return 1
  [[ "$rel" == *.kt ]] && return 1
  [[ "$rel" == *.css ]] && return 1
  [[ "$rel" == *.scss ]] && return 1
  [[ "$rel" == *.sass ]] && return 1

  # Everything else — allowed
  return 0
}

if ! is_allowed_during_plan "$REL"; then
  echo "ABAC Blocked [plan phase]: Source code modifications are not allowed during plan phase." >&2
  echo "  File: $REL" >&2
  echo "  Update pipeline-state.json to 'tdd' after starting Phase 2." >&2
  exit 2
fi

exit 0
