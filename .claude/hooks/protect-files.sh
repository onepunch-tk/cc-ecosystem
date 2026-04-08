#!/bin/bash
set -euo pipefail

# PreToolUse Hook: Block modifications to protected files
# matcher: Edit|Write

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# No file path — pass through
[[ -z "$FILE_PATH" ]] && exit 0

# Protected file patterns
PROTECTED_PATTERNS=(
    "package-lock.json"
    "bun.lock"
    "yarn.lock"
    "pnpm-lock.yaml"
    ".git/"
    "credentials.json"
    "secrets."
)

for pattern in "${PROTECTED_PATTERNS[@]}"; do
    if [[ "$FILE_PATH" == *"$pattern"* ]]; then
        echo "Blocked: '$FILE_PATH' is a protected file (matches '$pattern')" >&2
        exit 2
    fi
done

exit 0
