#!/bin/bash
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# No file path — exit
[[ -z "$FILE_PATH" ]] && exit 0

# Skip if biome is not configured in the project
if [[ ! -f "$CLAUDE_PROJECT_DIR/biome.json" && ! -f "$CLAUDE_PROJECT_DIR/biome.jsonc" ]]; then
    exit 0
fi

# Biome-supported file extension check
case "$FILE_PATH" in
    *.js|*.jsx|*.ts|*.tsx|*.json|*.css|*.graphql|*.gql)
        # Run biome format (via bunx)
        bunx biome format --write "$FILE_PATH" 2>/dev/null || true
        ;;
esac

exit 0
