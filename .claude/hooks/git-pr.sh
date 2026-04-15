#!/bin/bash
set -euo pipefail

# git-pr.sh — PR creation + merge + cleanup utility
# Agent composes title/body, this script handles push → PR → merge → cleanup
#
# Usage:
#   .claude/hooks/git-pr.sh --title "✨ feat: implement login" --body "## Summary ..." [--issue 42]
#
# Output: success/failure result

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

# ─── Parse arguments ───
TITLE=""
BODY=""
ISSUE_NUMBER=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --title) TITLE="$2"; shift 2 ;;
        --body) BODY="$2"; shift 2 ;;
        --issue) ISSUE_NUMBER="$2"; shift 2 ;;
        *) echo "❌ Unknown option: $1" >&2; exit 1 ;;
    esac
done

if [[ -z "$TITLE" ]]; then
    echo "❌ --title is required" >&2
    exit 1
fi

cd "$PROJECT_DIR"

# ─── Prerequisites ───
if ! command -v gh &>/dev/null; then
    echo "❌ gh CLI is not installed." >&2
    exit 1
fi

if ! gh auth status &>/dev/null 2>&1; then
    echo "❌ gh authentication required. Run: ! gh auth login" >&2
    exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)

if [[ "$CURRENT_BRANCH" == "main" || "$CURRENT_BRANCH" == "development" ]]; then
    echo "❌ Cannot create PR from main or development branch." >&2
    exit 1
fi

# ─── Auto-commit .claude/ changes (hook/agent artifacts) ───
CLAUDE_CHANGES=$(git status --porcelain -- .claude/)
if [[ -n "$CLAUDE_CHANGES" ]]; then
    git add .claude/
    git commit -m "🔧 chore: auto-commit .claude/ hook and agent artifacts" --no-verify 2>/dev/null || true
fi

# ─── Check for remaining uncommitted changes ───
if [[ -n "$(git status --porcelain)" ]]; then
    echo "❌ Uncommitted changes detected. Please commit first." >&2
    echo "$(git status --short)" >&2
    exit 1
fi

# ─── Append Related #N to body (not Closes — auto-close only works on default branch) ───
if [[ -n "$ISSUE_NUMBER" && -n "$BODY" ]]; then
    BODY="$BODY

---
Related: #$ISSUE_NUMBER"
elif [[ -n "$ISSUE_NUMBER" ]]; then
    BODY="Related: #$ISSUE_NUMBER"
fi

echo "═══════════════════════════════════════"
echo "🔀 Pull Request: $CURRENT_BRANCH → development"
echo "═══════════════════════════════════════"
echo ""

# ─── Step 1: Push ───
echo "[1/4] Pushing branch..."
if git push origin "$CURRENT_BRANCH" 2>&1; then
    echo "      ✅ Push complete"
else
    echo "      ❌ Push failed" >&2
    exit 1
fi
echo ""

# ─── Step 2: Create PR ───
echo "[2/4] Creating PR..."
PR_CMD=(gh pr create --base development --title "$TITLE")
if [[ -n "$BODY" ]]; then
    PR_CMD+=(--body "$BODY")
fi

PR_URL=$("${PR_CMD[@]}" 2>&1)

if [[ $? -ne 0 ]]; then
    echo "      ❌ PR creation failed: $PR_URL" >&2
    exit 1
fi

PR_NUMBER=$(echo "$PR_URL" | grep -oE '[0-9]+$')
echo "      ✅ PR #$PR_NUMBER created"
echo "      URL: $PR_URL"
echo ""

# ─── Step 3: Merge PR ───
echo "[3/4] Merging PR..."
if gh pr merge "$PR_NUMBER" --merge --delete-branch 2>&1; then
    echo "      ✅ Merge complete (merge commit)"
    # Explicitly close issue (auto-close only works on default branch)
    if [[ -n "$ISSUE_NUMBER" ]]; then
        if gh issue close "$ISSUE_NUMBER" 2>/dev/null; then
            echo "      ✅ Issue #$ISSUE_NUMBER closed"
        else
            echo "      ⚠️ Issue #$ISSUE_NUMBER close failed (may need manual close)"
        fi
    fi
else
    echo "      ❌ Merge failed. Possible conflict." >&2
    echo "      PR URL: $PR_URL" >&2
    exit 1
fi
echo ""

# ─── Step 4: Cleanup ───
echo "[4/4] Cleaning up..."
git checkout development 2>/dev/null
git pull origin development 2>/dev/null || true

# Delete local branch (remote handled by --delete-branch)
if git branch -d "$CURRENT_BRANCH" 2>/dev/null; then
    echo "      ✅ Local branch deleted"
else
    echo "      ⚠️ Local branch deletion skipped (may already be deleted)"
fi

# Reset pipeline-state.json and hook-state.json
if [[ -f "$PROJECT_DIR/.claude/pipeline-state.json" ]]; then
    # Read values BEFORE truncating the file (heredoc race condition)
    PREV_GITHUB_MODE=$(jq -r '.github_mode // false' "$PROJECT_DIR/.claude/pipeline-state.json")
    cat > "$PROJECT_DIR/.claude/pipeline-state.json" << STATEEOF
{
  "current_phase": "none",
  "mode": "none",
  "branch": "development",
  "plan_approved": false,
  "github_mode": $PREV_GITHUB_MODE,
  "issue_number": null,
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
STATEEOF
    echo "      ✅ pipeline-state.json reset"
fi

if [[ -f "$PROJECT_DIR/.claude/hook-state.json" ]]; then
    echo '{"last_reminded_phase":"","doc_reminders_sent":{},"workflow_warnings_sent":{},"cooldown_until":""}' > "$PROJECT_DIR/.claude/hook-state.json"
    echo "      ✅ hook-state.json reset"
fi

# Reset ownership.json if exists (Team mode cleanup)
if [[ -f "$PROJECT_DIR/.claude/ownership.json" ]]; then
    cat > "$PROJECT_DIR/.claude/ownership.json" << OWNEREOF
{
  "mode": "none",
  "branch": "development",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "teammates": {},
  "shared": []
}
OWNEREOF
    echo "      ✅ ownership.json reset"
fi

# Commit and push state resets to development
STATE_CHANGES=$(git status --porcelain -- .claude/)
if [[ -n "$STATE_CHANGES" ]]; then
    git add .claude/
    git commit -m "🔧 chore: reset pipeline state after merge" --no-verify 2>/dev/null || true
    git push origin development 2>/dev/null || true
    echo "      ✅ State reset committed to development"
fi

echo "      ✅ Checked out to development"

echo ""
echo "───────────────────────────────────────"
echo "✅ PR Complete"
echo "   PR: #$PR_NUMBER"
[[ -n "$ISSUE_NUMBER" ]] && echo "   Issue: #$ISSUE_NUMBER (closed)"
echo "   Branch: development (current)"
echo "───────────────────────────────────────"
