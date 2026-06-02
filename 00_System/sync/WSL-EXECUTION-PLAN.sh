#!/usr/bin/env bash
# SUPERSEDED: do not run for the current ROS setup.
#
# This historical plan makes WSL canonical and points Windows at WSL. The
# current contract makes Windows canonical and points Hermes/WSL at the Windows
# tree instead:
#
#   /home/guyru/ROS -> /mnt/c/Users/dguyr/ROS
#
# Use:
#   bash /mnt/c/Users/dguyr/ROS/00_System/sync/repair-wsl-ros-path.sh

echo "SUPERSEDED: use 00_System/sync/repair-wsl-ros-path.sh instead." >&2
exit 2

# WSL execution plan — merge Claude/Cowork's pending work into Hermes's pushed state.
# Run this in WSL (Ubuntu) as the guyru user. Read every comment before running.
# Re-runnable: each step is idempotent except the first commit+push.
#
# Pre-conditions (already true per Hermes's report):
#   - GitHub repo github.com/guyrubin/ROS exists and Hermes pushed to it
#   - ~/ROS is the live working tree, ahead/behind 0/0 with origin/main
#   - Hermes plugin install hasn't been run yet
#   - Notion ROS KK Con integration is verified for both Command Centers
#
# What this script does:
#   A. Sanity check
#   B. Make C:\Users\dguyr\ROS a symlink to ~/ROS (so Cowork and Hermes see the same files)
#   C. Copy Claude/Cowork-side additions into ~/ROS (only files that don't conflict)
#   D. Append a sync-layer pointer to Hermes's AGENTS.md
#   E. Commit + push as claude-cowork
#   F. Install the Hermes plugin
#   G. Verify everything
#
# Run pieces by hand the first time. Don't `bash WSL-EXECUTION-PLAN.sh` blind.

set -euo pipefail

ROS="$HOME/ROS"
COWORK="/mnt/c/Users/dguyr/ROS"

# -----------------------------------------------------------------------------
# A. Sanity check
# -----------------------------------------------------------------------------
echo "==== A. Sanity check ===="
[ -d "$ROS/.git" ] || { echo "FATAL: $ROS is not a git repo. Stop."; exit 2; }
cd "$ROS"
git fetch --prune origin
[ "$(git rev-parse @)" = "$(git rev-parse @{u})" ] || {
  echo "WARN: ~/ROS is not in sync with origin/main. Run 'git pull --rebase' first."
  exit 3
}
echo "  ~/ROS is clean and synced with origin/main."
echo "  Last commit: $(git log --oneline -1)"
[ -d "$COWORK" ] || { echo "WARN: $COWORK not present. Skip step C (nothing to copy)."; }

# -----------------------------------------------------------------------------
# B. Reconcile the two ROS copies into one (symlink)
#    Goal: C:\Users\dguyr\ROS becomes a junction pointing at \\wsl$\Ubuntu\home\guyru\ROS,
#    so Cowork and Hermes see the SAME files going forward.
#    This step is done from POWERSHELL (Administrator), not WSL. Print the commands and exit.
# -----------------------------------------------------------------------------
echo ""
echo "==== B. Symlink Cowork-mounted ROS to WSL ROS (RUN IN POWERSHELL AS ADMIN) ===="
cat <<'POWERSHELL'

    # Open PowerShell as Administrator, then run:
    cd C:\Users\dguyr
    # 1) Back up Claude/Cowork-side ROS so we don't lose the uncommitted work:
    if (Test-Path .\ROS) {
        Rename-Item -Path .\ROS -NewName ('ROS_cowork_backup_' + (Get-Date -Format 'yyyy-MM-dd_HHmm'))
    }
    # 2) Create the symlink. WSL paths use forward slashes inside \\wsl$\<distro>\...
    New-Item -ItemType SymbolicLink -Path 'C:\Users\dguyr\ROS' -Target '\\wsl$\Ubuntu\home\guyru\ROS'
    # 3) Verify:
    Get-Item C:\Users\dguyr\ROS | Format-List Name,LinkType,Target

POWERSHELL
echo ""
echo "  After running the PowerShell block, return to this WSL terminal and continue with step C."
read -p "  Press Enter once the symlink is in place..."

# -----------------------------------------------------------------------------
# C. Copy Claude/Cowork-side additions into ~/ROS
#    Source: ~/ROS_cowork_backup_*  (we backed it up in step B)
#    These paths don't exist in Hermes's push, so no conflicts.
# -----------------------------------------------------------------------------
echo ""
echo "==== C. Bring across Claude's contributions ===="

# Find the backup path (PowerShell wrote it under C:\Users\dguyr\)
BACKUP_WIN_PATH=$(ls -d /mnt/c/Users/dguyr/ROS_cowork_backup_* 2>/dev/null | sort -r | head -1 || echo "")
if [ -z "$BACKUP_WIN_PATH" ]; then
  echo "  ERROR: no cowork backup found at /mnt/c/Users/dguyr/ROS_cowork_backup_*"
  echo "         You may have skipped step B. Either run B or copy files manually."
  exit 4
fi
echo "  Using backup: $BACKUP_WIN_PATH"

# HERMES.md — the Hermes bootstrap shim (sibling of CLAUDE.md)
cp -v "$BACKUP_WIN_PATH/HERMES.md" "$ROS/HERMES.md" 2>/dev/null || echo "  (no HERMES.md in backup — fine)"

# 00_System/sync/ — the entire multi-agent sync layer
mkdir -p "$ROS/00_System/sync"
cp -rvn "$BACKUP_WIN_PATH/00_System/sync/." "$ROS/00_System/sync/" 2>/dev/null || true

# 00_System/files-index.json — Drive binary registry
cp -vn "$BACKUP_WIN_PATH/00_System/files-index.json" "$ROS/00_System/files-index.json" 2>/dev/null || true

# Make scripts executable
chmod +x "$ROS/00_System/sync/scripts/"*.sh "$ROS/00_System/sync/scripts/"*.py 2>/dev/null || true
chmod +x "$ROS/00_System/sync/hermes-plugin/install.sh" 2>/dev/null || true

echo "  Copy complete. New files under 00_System/sync/:"
find "$ROS/00_System/sync" -type f | sed "s|$ROS/|    |"
[ -f "$ROS/HERMES.md" ] && echo "    HERMES.md ($(wc -l < $ROS/HERMES.md) lines)"
[ -f "$ROS/00_System/files-index.json" ] && echo "    00_System/files-index.json"

# -----------------------------------------------------------------------------
# D. Append a single sync-layer pointer to Hermes's AGENTS.md
#    DO NOT replace AGENTS.md — Hermes's version is canonical.
# -----------------------------------------------------------------------------
echo ""
echo "==== D. Add sync-layer pointer to AGENTS.md ===="

if ! grep -q "multi-agent sync layer" "$ROS/AGENTS.md" 2>/dev/null; then
  cat >> "$ROS/AGENTS.md" <<'EOF'

---

## Multi-agent sync layer

The **implementation** that makes Claude/Cowork and Hermes peers against the same
working tree lives at `00_System/sync/`:

- `HLD.md` — high-level design of the shared-memory architecture
- `ADR-001..003` — GitHub-as-spine, single-host shared tree, journal pattern + identity
- `runbook.md` — one-time setup, daily ops, Stage 2/3 promotion criteria
- `notion-obsidian-boundary.md` — where each kind of content lives
- `hermes-plugin/` — Hermes plugin that bridges to this workspace
- `scripts/` — `sync-pull`, `sync-push`, `notion-sync`, `drive-mirror`

Both Claude and Hermes consume this layer. Per-agent runtime shims:
`CLAUDE.md` (this file's sibling) and `HERMES.md`.
EOF
  echo "  AGENTS.md now has the sync pointer (new line count: $(wc -l < $ROS/AGENTS.md))"
else
  echo "  AGENTS.md already references the sync layer — skipped."
fi

# -----------------------------------------------------------------------------
# E. Commit + push as claude-cowork
# -----------------------------------------------------------------------------
echo ""
echo "==== E. Commit + push as claude-cowork ===="

# Per-repo identity (doesn't affect other repos)
git -C "$ROS" config user.name  "claude-cowork"
git -C "$ROS" config user.email "claude-cowork@rubin-os.local"

git -C "$ROS" add -A
git -C "$ROS" status -s
echo ""
read -p "  Press Enter to commit and push as claude-cowork (or Ctrl-C to inspect first)..."

git -C "$ROS" commit -m "[claude] sync layer: HLD, ADRs, hermes-plugin, scripts, runbook, boundary doc"
git -C "$ROS" push origin main
echo "  Pushed. HEAD: $(git -C "$ROS" log --oneline -1)"

# -----------------------------------------------------------------------------
# F. Install the Hermes plugin
# -----------------------------------------------------------------------------
echo ""
echo "==== F. Install Hermes plugin ===="
if ! command -v hermes >/dev/null 2>&1; then
  echo "  WARN: 'hermes' CLI not on PATH. Skip; install later with:"
  echo "         bash ~/ROS/00_System/sync/hermes-plugin/install.sh"
else
  bash "$ROS/00_System/sync/hermes-plugin/install.sh"
fi

# -----------------------------------------------------------------------------
# G. Notion token alignment
#    Hermes uses 'ROS KK Con' integration token. Make sure notion-sync.py finds it.
# -----------------------------------------------------------------------------
echo ""
echo "==== G. Notion token ===="
mkdir -p "$HOME/.config/agent-os"
if [ -f "$HOME/.config/agent-os/notion-token" ]; then
  echo "  Token already at ~/.config/agent-os/notion-token"
else
  echo "  Token NOT YET at ~/.config/agent-os/notion-token"
  echo "  How to copy it from the Hermes integration:"
  echo "    1) In Notion → Settings → Connections → 'Develop or manage integrations'"
  echo "    2) Open 'ROS KK Con' → copy the Internal Integration Token"
  echo "    3) Run: printf '%s' '<TOKEN>' > ~/.config/agent-os/notion-token && chmod 600 ~/.config/agent-os/notion-token"
fi

# -----------------------------------------------------------------------------
# H. Verify
# -----------------------------------------------------------------------------
echo ""
echo "==== H. Verify ===="
echo "  Repo:       $(git -C $ROS rev-parse --short HEAD)  ($(git -C $ROS branch --show-current))"
echo "  Ahead/behind origin: $(git -C $ROS rev-list --left-right --count HEAD...origin/main 2>/dev/null || echo n/a)"
echo "  AGENTS.md:  $(wc -l < $ROS/AGENTS.md) lines"
echo "  CLAUDE.md:  $(wc -l < $ROS/CLAUDE.md) lines"
echo "  HERMES.md:  $(wc -l < $ROS/HERMES.md 2>/dev/null || echo missing) lines"
echo "  MEMORY.md:  $(wc -l < $ROS/MEMORY.md) lines"
echo "  Sync layer files:"
find "$ROS/00_System/sync" -maxdepth 2 -type f -name '*.md' | wc -l | xargs echo "    markdown:"
find "$ROS/00_System/sync/scripts" -type f | wc -l | xargs echo "    scripts:"
find "$ROS/00_System/sync/hermes-plugin" -type f -not -path '*__pycache__*' 2>/dev/null | wc -l | xargs echo "    plugin:"
echo ""
echo "DONE. Test from a fresh Hermes session:"
echo "    hermes"
echo "    /plugins                   # should list rubin-os"
echo "    /route what's on for HV today?"
echo "    /remember HV WWS for Groenewegje 154 is 142 (test sync 2026-05-19)."
echo "    /sync push '[hermes] test: round-trip from rubin-os plugin'"
echo ""
echo "Then in a fresh Claude/Cowork session, run /sync pull (or just open a new session — the"
echo "on_session_start hook will pull) and ask 'what's the latest on HV?' — the line should appear."
