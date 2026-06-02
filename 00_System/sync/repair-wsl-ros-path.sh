#!/usr/bin/env bash
# Repair Hermes/WSL ROS path so it points at the canonical Windows tree.
#
# Current contract:
#   /home/guyru/ROS -> /mnt/c/Users/dguyr/ROS
#
# Run inside WSL as the guyru user:
#   bash /mnt/c/Users/dguyr/ROS/00_System/sync/repair-wsl-ros-path.sh

set -euo pipefail

CANONICAL="${CANONICAL:-/mnt/c/Users/dguyr/ROS}"
LINK="${LINK:-/home/guyru/ROS}"
STAMP="$(date +%Y%m%d-%H%M%S)"

log() { printf '[ros-path-repair] %s\n' "$*"; }
die() { printf '[ros-path-repair] ERROR: %s\n' "$*" >&2; exit 1; }

[[ -d "$CANONICAL" ]] || die "Canonical Windows-mounted tree not found: $CANONICAL"
[[ -f "$CANONICAL/AGENTS.md" ]] || die "Canonical tree is missing AGENTS.md: $CANONICAL"
[[ -d "$CANONICAL/.git" ]] || die "Canonical tree is not a git repo: $CANONICAL"

if [[ -L "$LINK" ]]; then
  target="$(readlink -f "$LINK")"
  if [[ "$target" == "$CANONICAL" ]]; then
    log "Already healthy: $LINK -> $target"
  else
    log "Replacing wrong symlink: $LINK -> $target"
    rm "$LINK"
    ln -s "$CANONICAL" "$LINK"
  fi
elif [[ -e "$LINK" ]]; then
  backup="${LINK}.backup-before-windows-canonical-${STAMP}"
  log "Existing non-symlink found at $LINK"
  log "Moving it to $backup"
  mv "$LINK" "$backup"
  ln -s "$CANONICAL" "$LINK"
else
  log "Creating symlink: $LINK -> $CANONICAL"
  mkdir -p "$(dirname "$LINK")"
  ln -s "$CANONICAL" "$LINK"
fi

resolved="$(readlink -f "$LINK")"
[[ "$resolved" == "$CANONICAL" ]] || die "Repair failed: $LINK resolves to $resolved"

log "Resolved path: $resolved"
log "Git top via link:      $(git -C "$LINK" rev-parse --show-toplevel)"
log "Git top via canonical: $(git -C "$CANONICAL" rev-parse --show-toplevel)"
log "Done. Hermes can use $LINK, and Claude/Codex can use C:\\Users\\dguyr\\ROS."
