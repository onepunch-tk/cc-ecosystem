#!/bin/bash
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# No file path — exit
[[ -z "$FILE_PATH" ]] && exit 0

# TypeScript file extension check
case "$FILE_PATH" in
    *.ts|*.tsx)
        # Run typecheck
        cd "$CLAUDE_PROJECT_DIR"
        # Detect package manager
        if [[ -f "bun.lock" ]]; then PKG_CMD="bun run"
        elif [[ -f "pnpm-lock.yaml" ]]; then PKG_CMD="pnpm run"
        elif [[ -f "yarn.lock" ]]; then PKG_CMD="yarn"
        else PKG_CMD="npm run"; fi

        if ! $PKG_CMD typecheck 2>&1; then
            echo "TypeCheck failed for: $FILE_PATH" >&2
            exit 2
        fi
        ;;
esac

exit 0
