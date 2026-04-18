#!/bin/bash
# Article bot runner. Invoked by launchd daily at 7 AM (or user-triggered).
set -e

REPO_DIR="/Users/jike/Desktop/Developer/sbticc"
PROMPT_FILE="$REPO_DIR/scripts/article-bot/bot-prompt.md"

cd "$REPO_DIR"

# Ensure PATH includes common locations (launchd has minimal env)
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$HOME/.nvm/versions/node/v22.21.0/bin:$PATH"

echo "[article-bot] $(date '+%Y-%m-%d %H:%M:%S') start"

if [ ! -f "$PROMPT_FILE" ]; then
  echo "[article-bot] ERROR: prompt file missing: $PROMPT_FILE" >&2
  exit 1
fi

# Sync main before writing
git checkout main 2>&1 || true
git pull --rebase origin main 2>&1 || {
  echo "[article-bot] WARN: pull failed; proceeding with local main" >&2
}

if [ "$DRY_RUN" = "1" ]; then
  echo "[article-bot] DRY_RUN=1 — would invoke claude with prompt below:"
  echo "---PROMPT---"
  cat "$PROMPT_FILE"
  echo "---END---"
  exit 0
fi

# Check claude CLI is available
if ! command -v claude >/dev/null 2>&1; then
  echo "[article-bot] ERROR: claude CLI not found in PATH. PATH=$PATH" >&2
  exit 1
fi

# Check gh CLI is available
if ! command -v gh >/dev/null 2>&1; then
  echo "[article-bot] ERROR: gh CLI not found in PATH. PATH=$PATH" >&2
  exit 1
fi

# Invoke Claude Code headless with the prompt
# --dangerously-skip-permissions: required because cron can't answer prompts
claude -p "$(cat "$PROMPT_FILE")" --dangerously-skip-permissions 2>&1

echo "[article-bot] $(date '+%Y-%m-%d %H:%M:%S') done"
