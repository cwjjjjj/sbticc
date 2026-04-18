#!/bin/bash
# Install / uninstall the article-bot launchd job.
set -e

PLIST_LABEL="com.jiligulu.article-bot"
REPO_DIR="/Users/jike/Desktop/Developer/sbticc"
SRC_PLIST="$REPO_DIR/scripts/article-bot/$PLIST_LABEL.plist"
DEST_PLIST="$HOME/Library/LaunchAgents/$PLIST_LABEL.plist"

if [ "$1" = "--uninstall" ]; then
  if [ -f "$DEST_PLIST" ]; then
    launchctl unload "$DEST_PLIST" 2>/dev/null || true
    rm "$DEST_PLIST"
    echo "Uninstalled $PLIST_LABEL"
  else
    echo "Not installed (no plist at $DEST_PLIST)"
  fi
  exit 0
fi

# Make run.sh executable
chmod +x "$REPO_DIR/scripts/article-bot/run.sh"
chmod +x "$REPO_DIR/scripts/article-bot/install.sh"

# Ensure log dir exists
mkdir -p "$HOME/Library/Logs"
mkdir -p "$HOME/Library/LaunchAgents"

# Copy plist
cp "$SRC_PLIST" "$DEST_PLIST"

# Reload
launchctl unload "$DEST_PLIST" 2>/dev/null || true
launchctl load "$DEST_PLIST"

echo "Installed $PLIST_LABEL"
echo "Next trigger: tomorrow at 7:00 AM local"
echo "Logs: ~/Library/Logs/jiligulu-article-bot.{log,err}"
echo ""
echo "Commands:"
echo "  launchctl list | grep jiligulu          # verify loaded"
echo "  launchctl start $PLIST_LABEL           # force run now"
echo "  bash $REPO_DIR/scripts/article-bot/install.sh --uninstall  # remove"
