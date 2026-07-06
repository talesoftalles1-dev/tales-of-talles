#!/usr/bin/env bash
# scripts/create_pr.sh
# Usage: run from local clone with 'gh' installed and authenticated (gh auth login)
# This script creates a pull request from bootstrap/jarvis-os -> main using the body from pr_body.txt
set -euo pipefail

BRANCH="bootstrap/jarvis-os"
BASE="main"
TITLE="chore(bootstrap): add Jarvis OS volumes & Volume I drafts"
BODY_FILE="$(dirname "$0")/pr_body.txt"

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI not found. Install GitHub CLI (https://cli.github.com/) and authenticate with 'gh auth login'." >&2
  exit 2
fi

if [ ! -f "$BODY_FILE" ]; then
  echo "Error: PR body file not found: $BODY_FILE" >&2
  exit 3
fi

BODY=$(<"$BODY_FILE")

echo "Creating PR '$TITLE' ($BRANCH -> $BASE) ..."

gh pr create --base "$BASE" --head "$BRANCH" --title "$TITLE" --body "$BODY"

echo "Done. Open the PR in your browser to review."