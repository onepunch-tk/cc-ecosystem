#!/bin/bash
set -euo pipefail

# Load environment variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[[ -f "$SCRIPT_DIR/.env.hooks" ]] && source "$SCRIPT_DIR/.env.hooks"

[[ -z "${SLACK_WEBHOOK_URL:-}" ]] && exit 1

INPUT=$(cat)

# Conditional debug logging (enabled only when DEBUG=1)
if [[ "${DEBUG:-0}" == "1" ]]; then
    LOG_DIR="${SCRIPT_DIR}/logs"
    mkdir -p "$LOG_DIR"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $INPUT" >> "$LOG_DIR/claude-hook-debug.log"
fi

HOOK_EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // "unknown"')
NOTIFICATION_TYPE=$(echo "$INPUT" | jq -r '.notification_type // "unknown"')
FULL_SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
SESSION_ID=$(echo "$FULL_SESSION_ID" | cut -c1-8)
CWD=$(echo "$INPUT" | jq -r '.cwd // "unknown"')
PERMISSION_MODE=$(echo "$INPUT" | jq -r '.permission_mode // "default"')
MESSAGE=$(echo "$INPUT" | jq -r '.message // ""')
PROJECT_NAME="${PROJECT_NAME:-$(basename "$CWD")}"
TIMESTAMP=$(date '+%H:%M:%S')

# Shorten CWD (replace home directory with ~)
SHORT_CWD="${CWD/#$HOME/~}"

# Session ID validation (alphanumeric and hyphens only — prevent command injection)
validate_session_id() {
    local id="$1"
    if [[ "$id" =~ ^[a-zA-Z0-9-]+$ ]]; then
        return 0
    fi
    return 1
}

# Transcript path validation (prevent path traversal)
validate_transcript_path() {
    local path="$1"
    local resolved_path

    # Check file exists and is a regular file
    [[ ! -f "$path" ]] && return 1

    # Resolve actual path (follow symlinks)
    resolved_path=$(realpath "$path" 2>/dev/null) || return 1

    # Verify file is under ~/.claude directory
    local claude_dir
    claude_dir=$(realpath "$HOME/.claude" 2>/dev/null) || return 1

    if [[ "$resolved_path" == "$claude_dir"/* ]]; then
        return 0
    fi
    return 1
}

# Extract last assistant message from transcript (deduplicated)
# Structure: { "type": "assistant", "message": { "role": "assistant", "content": [{ "type": "text", "text": "..." }] } }
extract_last_assistant_message() {
    local file="$1"
    tail -50 "$file" 2>/dev/null | \
        jq -rs '[.[] | select(.type=="assistant")] | last | .message.content[] | select(.type=="text") | .text' 2>/dev/null | \
        head -1 | head -c 200
}

# Build safe JSON payload using jq
build_payload() {
    local color="$1"
    local title="$2"
    local text="$3"

    jq -n \
        --arg color "$color" \
        --arg title "$title" \
        --arg text "$text" \
        --arg project "$PROJECT_NAME" \
        --arg time "$TIMESTAMP" \
        --arg mode "$PERMISSION_MODE" \
        --arg cwd "$SHORT_CWD" \
        --arg session "Session: $SESSION_ID" \
        '{
            attachments: [{
                color: $color,
                title: $title,
                text: $text,
                fields: [
                    { title: "Project", value: $project, short: true },
                    { title: "Time", value: $time, short: true },
                    { title: "Mode", value: $mode, short: true },
                    { title: "CWD", value: $cwd, short: true }
                ],
                footer: $session
            }]
        }'
}

send_slack() {
    # Timeout: connect 5s, max 10s
    curl -s -X POST -H 'Content-type: application/json' \
        --connect-timeout 5 \
        --max-time 10 \
        --data "$1" "$SLACK_WEBHOOK_URL" > /dev/null
}

case "$HOOK_EVENT" in
    "Notification")
        case "$NOTIFICATION_TYPE" in
            "permission_prompt")
                TEXT="${MESSAGE:-Permission approval required}"
                PAYLOAD=$(build_payload "#FFA500" ":key: Permission Request" "$TEXT")
                send_slack "$PAYLOAD"
                ;;

            "idle_prompt")
                TEXT="${MESSAGE:-Claude Code is waiting for user input}"
                PAYLOAD=$(build_payload "#2196F3" ":bell: Waiting for Input" "$TEXT")
                send_slack "$PAYLOAD"
                ;;

            "elicitation_dialog")
                TEXT="${MESSAGE:-Claude Code is requesting additional information}"
                PAYLOAD=$(build_payload "#9C27B0" ":question: Information Request" "$TEXT")
                send_slack "$PAYLOAD"
                ;;
        esac
        ;;

    "PermissionRequest")
        TEXT="${MESSAGE:-Tool execution permission approval required}"
        PAYLOAD=$(build_payload "#FFA500" ":key: Permission Request (PermissionRequest)" "$TEXT")
        send_slack "$PAYLOAD"
        ;;

    "Stop")
        # Check stop_hook_active (prevent infinite loop)
        STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
        if [[ "$STOP_HOOK_ACTIVE" == "true" ]]; then
            exit 0
        fi

        # Attempt to extract work summary
        SUMMARY=""

        # Method 1: transcript_path provided (with path validation)
        TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // ""')
        if [[ -n "$TRANSCRIPT_PATH" ]] && validate_transcript_path "$TRANSCRIPT_PATH"; then
            SUMMARY=$(extract_last_assistant_message "$TRANSCRIPT_PATH")
        fi

        # Method 2: Find transcript file by session_id (with validation)
        if [[ -z "$SUMMARY" && "$FULL_SESSION_ID" != "unknown" ]] && validate_session_id "$FULL_SESSION_ID"; then
            # Limit search depth to 3 (performance optimization)
            TRANSCRIPT_FILE=$(find ~/.claude -maxdepth 3 -name "${FULL_SESSION_ID}*.jsonl" 2>/dev/null | head -1)
            if [[ -n "$TRANSCRIPT_FILE" ]] && validate_transcript_path "$TRANSCRIPT_FILE"; then
                SUMMARY=$(extract_last_assistant_message "$TRANSCRIPT_FILE")
            fi
        fi

        # Include summary if available, otherwise default message
        if [[ -n "$SUMMARY" && "$SUMMARY" != "null" ]]; then
            # Replace newlines with spaces and trim (POSIX sed compatible)
            SUMMARY=$(echo "$SUMMARY" | tr '\n' ' ' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            if [[ ${#SUMMARY} -ge 200 ]]; then
                SUMMARY="${SUMMARY}..."
            fi
            TEXT=$'*Completed work:*\n'"${SUMMARY}"
        else
            TEXT="Claude Code response completed"
        fi

        PAYLOAD=$(build_payload "#36A64F" ":white_check_mark: Response Complete" "$TEXT")
        send_slack "$PAYLOAD"
        ;;
esac

exit 0
