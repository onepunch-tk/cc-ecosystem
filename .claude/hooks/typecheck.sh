#!/bin/bash
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# No file path — exit
[[ -z "$FILE_PATH" ]] && exit 0

# TypeScript file extension check
case "$FILE_PATH" in
    *.ts|*.tsx)
        # Run typecheck — find nearest package.json from file path
        SEARCH_DIR=$(dirname "$FILE_PATH")
        PROJECT_ROOT=""
        while [[ "$SEARCH_DIR" != "/" ]]; do
            if [[ -f "$SEARCH_DIR/package.json" ]]; then
                PROJECT_ROOT="$SEARCH_DIR"
                break
            fi
            SEARCH_DIR=$(dirname "$SEARCH_DIR")
        done
        [[ -z "$PROJECT_ROOT" ]] && exit 0
        cd "$PROJECT_ROOT"
        # Detect package manager
        if [[ -f "bun.lock" ]]; then PKG_CMD="bun run"
        elif [[ -f "pnpm-lock.yaml" ]]; then PKG_CMD="pnpm run"
        elif [[ -f "yarn.lock" ]]; then PKG_CMD="yarn"
        else PKG_CMD="npm run"; fi

        # ─── TDD Red Phase awareness ───
        # During TDD phase, test files may import non-existent source files.
        # This is expected (Red Phase). Filter out test file errors only.
        STATE_FILE="$CLAUDE_PROJECT_DIR/.claude/pipeline-state.json"
        PHASE=$(jq -r '.current_phase // "none"' "$STATE_FILE" 2>/dev/null || echo "none")

        if [[ "$PHASE" == "tdd" ]]; then
            TSC_OUTPUT=$($PKG_CMD typecheck 2>&1) || true
            NON_TEST_ERRORS=$(echo "$TSC_OUTPUT" | grep 'error TS' | \
                grep -vE '^[^(]*\.(test|spec)\.(ts|tsx)(\(|:)' || true)
            if [[ -n "$NON_TEST_ERRORS" ]]; then
                echo "$TSC_OUTPUT" >&2
                echo "TypeCheck failed for: $FILE_PATH (source errors detected during TDD)" >&2
                exit 2
            fi
            # Test-only errors during TDD → allowed (Red Phase normal)
            exit 0
        fi

        # Non-TDD phases: full typecheck enforcement
        if ! $PKG_CMD typecheck 2>&1; then
            echo "TypeCheck failed for: $FILE_PATH" >&2
            exit 2
        fi
        ;;
esac

exit 0
