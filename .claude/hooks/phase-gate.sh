#!/bin/bash
set -euo pipefail

# PreToolUse Hook: Phase transition precondition gate
# matcher: Bash
#
# Intercepts Bash commands that write to pipeline-state.json.
# Validates preconditions before allowing phase transitions:
#   - review → validate: code-review report must be Complete
#   - review → validate (ui_involved): design-review report must also be Complete

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

[[ -z "$COMMAND" ]] && exit 0

# Only care about commands that write pipeline-state.json
echo "$COMMAND" | grep -q 'pipeline-state\.json' || exit 0

# Detect target phase from heredoc content
TARGET_PHASE=""
if echo "$COMMAND" | grep -qE '"current_phase"[[:space:]]*:[[:space:]]*"validate"'; then
    TARGET_PHASE="validate"
fi

[[ -z "$TARGET_PHASE" ]] && exit 0

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$PWD}"
STATE_FILE="$PROJECT_DIR/.claude/pipeline-state.json"

[[ ! -f "$STATE_FILE" ]] && exit 0

CURRENT_PHASE=$(jq -r '.current_phase // "none"' "$STATE_FILE" 2>/dev/null || echo "none")

# Only gate review → validate transitions
[[ "$CURRENT_PHASE" != "review" ]] && exit 0

# ─── Gate 1: Code Review Report ───

check_report() {
    local report_dir="$1"
    local report_type="$2"

    if [[ ! -d "$report_dir" ]]; then
        echo "Phase Gate BLOCKED [review → validate]: ${report_type} report directory not found." >&2
        echo "  Expected: $report_dir" >&2
        echo "  Run the ${report_type} subagent before proceeding." >&2
        exit 2
    fi

    local latest
    latest=$(find "$report_dir" -name "*.md" -type f 2>/dev/null | sort | tail -1)

    if [[ -z "$latest" ]]; then
        echo "Phase Gate BLOCKED [review → validate]: No ${report_type} report found." >&2
        echo "  Directory: $report_dir" >&2
        echo "  Run the ${report_type} subagent before proceeding." >&2
        exit 2
    fi

    local unchecked
    unchecked=$(grep -c '^\- \[ \]' "$latest" 2>/dev/null || true)

    if [[ "$unchecked" -gt 0 ]]; then
        echo "Phase Gate BLOCKED [review → validate]: ${report_type} report has $unchecked unresolved issue(s)." >&2
        echo "  Report: $latest" >&2
        echo "  Fix each issue and check its checkbox (- [ ] → - [x])." >&2
        echo "  Then update **Status** to Complete." >&2
        exit 2
    fi

    local status_line
    status_line=$(grep -m1 '^\*\*Status\*\*:' "$latest" 2>/dev/null || echo "")

    if ! echo "$status_line" | grep -qi "complete"; then
        echo "Phase Gate BLOCKED [review → validate]: ${report_type} report Status is not Complete." >&2
        echo "  Report: $latest" >&2
        echo "  Current: $status_line" >&2
        echo "  Update **Status**: Pending → **Status**: Complete" >&2
        exit 2
    fi
}

check_report "$PROJECT_DIR/docs/reports/code-review" "code-review"

# ─── Gate 2: Design Review Report (if ui_involved) ───

UI_INVOLVED=$(jq -r '.ui_involved // false' "$STATE_FILE" 2>/dev/null || echo "false")

if [[ "$UI_INVOLVED" == "true" ]]; then
    check_report "$PROJECT_DIR/docs/reports/design-review" "design-review"
fi

# All gates passed
exit 0
