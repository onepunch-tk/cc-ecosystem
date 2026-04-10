#!/bin/bash
set -euo pipefail

# git-release.sh — Release PR + merge + tag utility
# Creates development → main PR, merges, creates tag and GitHub Release
#
# Usage:
#   .claude/hooks/git-release.sh --version "v1.2.0" --body "## Release Summary ..."
#
# Note: --version is required. Agent confirms version with user before calling.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

# ─── Parse arguments ───
VERSION=""
BODY=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --version) VERSION="$2"; shift 2 ;;
        --body) BODY="$2"; shift 2 ;;
        *) echo "❌ Unknown option: $1" >&2; exit 1 ;;
    esac
done

if [[ -z "$VERSION" ]]; then
    echo "❌ --version is required (e.g., v1.0.0)" >&2
    exit 1
fi

# Ensure version starts with 'v'
[[ "$VERSION" != v* ]] && VERSION="v$VERSION"

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
if [[ "$CURRENT_BRANCH" != "development" ]]; then
    echo "❌ Release can only run from development branch. (current: $CURRENT_BRANCH)" >&2
    exit 1
fi

# ─── Check for unreleased changes ───
git fetch origin main 2>/dev/null || true

DIFF_COUNT=$(git log origin/main..development --oneline 2>/dev/null | wc -l | tr -d ' ')
if [[ "$DIFF_COUNT" -eq 0 ]]; then
    echo "❌ No unreleased changes on development. Already in sync with main." >&2
    exit 1
fi

# ─── Check tag doesn't already exist ───
if git tag -l "$VERSION" | grep -q "$VERSION"; then
    echo "❌ Tag $VERSION already exists." >&2
    exit 1
fi

echo "═══════════════════════════════════════"
echo "🚀 Release $VERSION"
echo "═══════════════════════════════════════"
echo ""

# ─── Step 1: Push development ───
echo "[1/5] Pushing development..."
git push origin development 2>&1
echo "      ✅ Push complete"
echo ""

# ─── Step 2: Create Release PR ───
echo "[2/5] Creating release PR..."
PR_CMD=(gh pr create --base main --head development --title "🚀 Release $VERSION")
if [[ -n "$BODY" ]]; then
    PR_CMD+=(--body "$BODY")
else
    # Auto-generate body from merged PRs
    MERGED_PRS=$(git log origin/main..development --merges --oneline 2>/dev/null || echo "No merge commits found")
    CHANGE_STAT=$(git diff origin/main..development --stat 2>/dev/null | tail -1 || echo "")
    PR_CMD+=(--body "## Release $VERSION

### Included Changes
\`\`\`
$MERGED_PRS
\`\`\`

### Stats
$CHANGE_STAT")
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
echo "[3/5] Merging release PR..."
# Do NOT delete development branch
if gh pr merge "$PR_NUMBER" --merge 2>&1; then
    echo "      ✅ Merge complete"
else
    echo "      ❌ Merge failed" >&2
    echo "      PR URL: $PR_URL" >&2
    exit 1
fi
echo ""

# ─── Step 4: Create tag + GitHub Release ───
echo "[4/5] Creating tag & release..."
git checkout main 2>/dev/null
git pull origin main 2>/dev/null

git tag "$VERSION"
git push origin "$VERSION" 2>&1

# Generate release notes
RELEASE_NOTES="${BODY:-Release $VERSION}"
gh release create "$VERSION" \
    --title "Release $VERSION" \
    --notes "$RELEASE_NOTES" 2>&1

echo "      ✅ Tag $VERSION created"
echo "      ✅ GitHub Release published"
echo ""

# ─── Step 5: Return to development ───
echo "[5/5] Returning to development..."
git checkout development 2>/dev/null
git pull origin development 2>/dev/null || true
echo "      ✅ Checked out to development"

echo ""
echo "───────────────────────────────────────"
echo "✅ Release $VERSION Complete"
echo "   PR:      #$PR_NUMBER"
echo "   Tag:     $VERSION"
RELEASE_URL=$(gh release view "$VERSION" --json url --jq '.url' 2>/dev/null || echo "")
[[ -n "$RELEASE_URL" ]] && echo "   Release: $RELEASE_URL"
echo "   Branch:  development (current)"
echo "───────────────────────────────────────"
