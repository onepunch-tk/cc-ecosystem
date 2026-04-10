#!/bin/bash
set -euo pipefail

# Pipeline Guardian — Stop hook
# Monitors workflow compliance and reminds about doc updates at phase completion.
# Detects: TDD violations, review skipping, doc update needs.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

INPUT=$(cat)

# ─── Anti-loop: stop_hook_active prevents infinite re-fires ───
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
[[ "$STOP_HOOK_ACTIVE" == "true" ]] && exit 0

# ─── Pipeline state check ───
STATE_FILE="$PROJECT_DIR/.claude/pipeline-state.json"
[[ ! -f "$STATE_FILE" ]] && exit 0

PHASE=$(jq -r '.current_phase // "none"' "$STATE_FILE")
[[ "$PHASE" == "none" ]] && exit 0

MODE=$(jq -r '.mode // "none"' "$STATE_FILE")
BRANCH=$(jq -r '.branch // ""' "$STATE_FILE")

# ─── Hook state (dedup + cooldown tracking) ───
HOOK_STATE="$PROJECT_DIR/.claude/hook-state.json"
if [[ ! -f "$HOOK_STATE" ]]; then
    echo '{"last_reminded_phase":"","doc_reminders_sent":{},"workflow_warnings_sent":{},"cooldown_until":""}' > "$HOOK_STATE"
fi

# Cooldown check (30s window)
COOLDOWN=$(jq -r '.cooldown_until // ""' "$HOOK_STATE")
if [[ -n "$COOLDOWN" ]]; then
    COOLDOWN_TS=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$COOLDOWN" "+%s" 2>/dev/null || echo 0)
    NOW_TS=$(date "+%s")
    if [[ $NOW_TS -lt $COOLDOWN_TS ]]; then
        exit 0
    fi
fi

REMINDERS=()

# ─── Concern A: Workflow Enforcement ───

case "$PHASE" in
    "tdd")
        # Plan approval check: block tdd if plan was not approved
        PLAN_APPROVED=$(jq -r '.plan_approved // false' "$STATE_FILE")
        WARNED_PLAN=$(jq -r '.workflow_warnings_sent.tdd_no_plan // ""' "$HOOK_STATE")
        if [[ "$PLAN_APPROVED" != "true" && -z "$WARNED_PLAN" ]]; then
            REMINDERS+=("[WORKFLOW] PLAN NOT APPROVED: You are in TDD phase but plan_approved is false in pipeline-state.json. You MUST complete Phase 1 (Plan) with ExitPlanMode approval and set plan_approved to true before proceeding. Go back and complete the plan approval step.")
        fi

        # TDD-first: implementation files changed without test files?
        WARNED=$(jq -r '.workflow_warnings_sent.tdd_no_tests // ""' "$HOOK_STATE")
        if [[ -z "$WARNED" ]]; then
            TEST_FILES=$(cd "$PROJECT_DIR" && git diff --name-only HEAD 2>/dev/null | grep -E '\.(test|spec)\.(ts|tsx|js|jsx)$' || true)
            IMPL_FILES=$(cd "$PROJECT_DIR" && git diff --name-only HEAD 2>/dev/null | grep -E '\.(ts|tsx|js|jsx)$' | grep -vE '\.(test|spec)\.' | grep -vE '(\.d\.ts|types\.ts|index\.ts)$' || true)
            if [[ -n "$IMPL_FILES" && -z "$TEST_FILES" ]]; then
                REMINDERS+=("[WORKFLOW] TDD VIOLATION: Implementation files modified but no test files found. Write tests FIRST (Red phase) before implementation (Green phase). Modified impl files: $(echo "$IMPL_FILES" | head -5 | tr '\n' ', ')")
            fi
        fi
        ;;

    "review")
        # Review phase: code-review report must exist
        WARNED=$(jq -r '.workflow_warnings_sent.review_no_report // ""' "$HOOK_STATE")
        if [[ -z "$WARNED" ]]; then
            REPORT_DIR="$PROJECT_DIR/docs/reports/code-review"
            HAS_REPORT=""
            if [[ -d "$REPORT_DIR" ]]; then
                HAS_REPORT=$(find "$REPORT_DIR" -name "*.md" -newer "$STATE_FILE" 2>/dev/null | head -1 || true)
            fi
            if [[ -z "$HAS_REPORT" ]]; then
                REMINDERS+=("[WORKFLOW] REVIEW REMINDER: You are in the review phase but no code-review report found. Run the code-reviewer subagent (Agent with subagent_type=\"code-reviewer\") before proceeding to validate phase.")
            fi
        fi
        ;;

    "validate"|"complete")
        # GitHub Mode: Issue/PR enforcement
        GITHUB_MODE=$(jq -r '.github_mode // false' "$STATE_FILE")
        ISSUE_NUMBER=$(jq -r '.issue_number // null' "$STATE_FILE")
        if [[ "$GITHUB_MODE" == "true" ]]; then
            WARNED_ISSUE=$(jq -r '.workflow_warnings_sent.validate_no_issue // ""' "$HOOK_STATE")
            if [[ ("$ISSUE_NUMBER" == "null" || -z "$ISSUE_NUMBER") && -z "$WARNED_ISSUE" ]]; then
                REMINDERS+=("[WORKFLOW] ISSUE MISSING: GitHub Mode is active but no Issue was created. Verify Issue creation in Phase 1. pipeline-state.json issue_number is empty.")
            fi

            # Check if PR was created (only on complete phase)
            if [[ "$PHASE" == "complete" ]]; then
                WARNED_PR=$(jq -r '.workflow_warnings_sent.validate_no_pr // ""' "$HOOK_STATE")
                if [[ -z "$WARNED_PR" ]]; then
                    CURRENT_BR=$(cd "$PROJECT_DIR" && git branch --show-current 2>/dev/null || echo "")
                    # If still on feature branch, PR hasn't been created yet
                    if echo "$CURRENT_BR" | grep -qE '^(feature|fix|docs|refactor|test|chore)/'; then
                        REMINDERS+=("[WORKFLOW] PR NOT CREATED: Transitioned to complete without creating a PR in GitHub Mode. Use .claude/hooks/git-pr.sh to create and merge a PR.")
                    fi
                fi
            fi
        fi

        # Doc update detection
        REMINDED=$(jq -r '.doc_reminders_sent.validate_docs // ""' "$HOOK_STATE")
        if [[ -z "$REMINDED" ]]; then
            # Get all changed files: committed + uncommitted + untracked
            COMMITTED=""
            if [[ -n "$BRANCH" ]]; then
                COMMITTED=$(cd "$PROJECT_DIR" && git diff --name-only development...HEAD 2>/dev/null || true)
            fi
            if [[ -z "$COMMITTED" ]]; then
                COMMITTED=$(cd "$PROJECT_DIR" && git diff --name-only HEAD~10...HEAD 2>/dev/null || true)
            fi
            # Staged + unstaged changes on tracked files
            MODIFIED=$(cd "$PROJECT_DIR" && git diff --name-only HEAD 2>/dev/null || true)
            # Untracked individual files (respects .gitignore, expands directories)
            # Exclude node_modules, .git, dist, build to avoid noise
            UNTRACKED=$(cd "$PROJECT_DIR" && git ls-files --others --exclude-standard 2>/dev/null | grep -vE '(node_modules/|\.git/|dist/|build/|\.cache/)' | head -500 || true)
            # Merge all sources: committed + modified + untracked
            CHANGED=$(printf "%s\n%s\n%s" "$COMMITTED" "$MODIFIED" "$UNTRACKED" | sort -u | grep -v '^$' || true)

            DOC_NEEDS=()

            # New directories → PROJECT-STRUCTURE.md
            if [[ -n "$CHANGED" ]]; then
                NEW_DIRS=$(echo "$CHANGED" | grep -E '/' | sed 's|/[^/]*$||' | sort -u || true)
                EXISTING_STRUCTURE="$PROJECT_DIR/docs/PROJECT-STRUCTURE.md"
                if [[ -n "$NEW_DIRS" ]]; then
                    UNTRACKED_DIRS=""
                    while IFS= read -r dir; do
                        if [[ -n "$dir" && -f "$EXISTING_STRUCTURE" ]] && ! grep -q "$dir" "$EXISTING_STRUCTURE" 2>/dev/null; then
                            UNTRACKED_DIRS="$UNTRACKED_DIRS $dir"
                        elif [[ -n "$dir" && ! -f "$EXISTING_STRUCTURE" ]]; then
                            UNTRACKED_DIRS="$UNTRACKED_DIRS $dir"
                        fi
                    done <<< "$NEW_DIRS"
                    if [[ -n "$UNTRACKED_DIRS" ]]; then
                        DOC_NEEDS+=("Run project-structure-analyzer to update docs/PROJECT-STRUCTURE.md (new directories detected:$UNTRACKED_DIRS)")
                    fi
                fi
            fi

            # Always remind about ROADMAP on validate/complete
            DOC_NEEDS+=("Run development-planner to update docs/ROADMAP.md (mark completed tasks)")

            # Route/entity/schema changes → PRD.md
            if [[ -n "$CHANGED" ]]; then
                SCOPE_CHANGES=$(echo "$CHANGED" | grep -E '(routes/|\.entity\.|\.schema\.)' || true)
                if [[ -n "$SCOPE_CHANGES" ]]; then
                    DOC_NEEDS+=("Consider running prd-generator to update docs/PRD.md (feature scope changes detected: $(echo "$SCOPE_CHANGES" | head -3 | tr '\n' ', '))")
                fi
            fi

            # Config/dependency changes → CLAUDE.md
            if [[ -n "$CHANGED" ]]; then
                CONFIG_CHANGES=$(echo "$CHANGED" | grep -E '(package\.json|tsconfig|biome\.json|biome\.jsonc)' || true)
                if [[ -n "$CONFIG_CHANGES" ]]; then
                    DOC_NEEDS+=("Review CLAUDE.md for needed updates (config/dependency changes detected: $(echo "$CONFIG_CHANGES" | tr '\n' ', '))")
                fi
            fi

            if [[ ${#DOC_NEEDS[@]} -gt 0 ]]; then
                REMINDER_TEXT="[DOC UPDATE] Before merge, the following documentation updates are needed:"
                for need in "${DOC_NEEDS[@]}"; do
                    REMINDER_TEXT+="\n  - $need"
                done
                REMINDER_TEXT+="\n\nRun each relevant agent as a subagent. After all docs are updated, proceed with merge."
                REMINDERS+=("$REMINDER_TEXT")
            fi
        fi
        ;;
esac

# ─── Output ───

if [[ ${#REMINDERS[@]} -gt 0 ]]; then
    # Set cooldown (30 seconds from now)
    COOLDOWN_UNTIL=$(date -u -v+30S "+%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -d "+30 seconds" "+%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "")
    NOW=$(date -u "+%Y-%m-%dT%H:%M:%SZ")

    # Update hook-state.json with tracking
    UPDATED_STATE=$(jq \
        --arg phase "$PHASE" \
        --arg cooldown "$COOLDOWN_UNTIL" \
        --arg now "$NOW" \
        '
        .last_reminded_phase = $phase |
        .cooldown_until = $cooldown |
        if $phase == "tdd" then .workflow_warnings_sent.tdd_no_tests = $now | .workflow_warnings_sent.tdd_no_plan = $now
        elif $phase == "review" then .workflow_warnings_sent.review_no_report = $now
        elif ($phase == "validate" or $phase == "complete") then .doc_reminders_sent.validate_docs = $now | .workflow_warnings_sent.validate_no_issue = $now | .workflow_warnings_sent.validate_no_pr = $now
        else . end
        ' "$HOOK_STATE")
    echo "$UPDATED_STATE" > "$HOOK_STATE"

    # Build combined context
    CONTEXT=""
    for r in "${REMINDERS[@]}"; do
        CONTEXT+="$r\n\n"
    done

    # Output JSON — decision:block prevents Claude from stopping
    jq -n --arg ctx "$CONTEXT" '{
        decision: "block",
        reason: "Pipeline guardian detected pending actions",
        hookSpecificOutput: {
            hookEventName: "Stop",
            additionalContext: $ctx
        }
    }'
    exit 0
fi

exit 0
