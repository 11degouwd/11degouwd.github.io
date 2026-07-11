#!/usr/bin/env bash
# Usage: ./new-feature-branch.sh <issue-number> [feature|fix]
# Creates a branch named <type>/<issue-number>-<slug> from the issue title
# and checks it out. Repo is on GitHub — uses gh CLI.
set -euo pipefail

ISSUE_NUM="${1:?Usage: $0 <issue-number> [feature|fix]}"
TYPE="${2:-feature}"

if ! command -v gh &>/dev/null; then
  echo "gh CLI not found. Install: https://cli.github.com" >&2
  exit 1
fi

slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g' | cut -c1-50
}

TITLE=$(gh issue view "$ISSUE_NUM" --json title -q .title)

if [[ -z "$TITLE" ]]; then
  echo "Could not fetch issue #$ISSUE_NUM title" >&2
  exit 1
fi

SLUG=$(slugify "$TITLE")
BRANCH="${TYPE}/${ISSUE_NUM}-${SLUG}"

git fetch origin main
git checkout -b "$BRANCH" origin/main

echo "Created and checked out: $BRANCH"
echo "Issue: $TITLE"

