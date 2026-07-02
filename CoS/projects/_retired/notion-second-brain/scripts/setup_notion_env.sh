#!/usr/bin/env bash
set -euo pipefail
ENV_FILE="/home/guyru/.hermes/.env"
mkdir -p "$(dirname "$ENV_FILE")"
printf 'Paste NOTION_API_KEY, then press Enter: '
IFS= read -r TOKEN
if [[ -z "$TOKEN" ]]; then
  echo 'No token entered; aborting.' >&2
  exit 1
fi
if grep -q '^NOTION_API_KEY=' "$ENV_FILE" 2>/dev/null; then
  python3 - "$ENV_FILE" "$TOKEN" <<'PY'
from pathlib import Path
import sys
path = Path(sys.argv[1])
token = sys.argv[2]
lines = path.read_text().splitlines() if path.exists() else []
out = []
replaced = False
for line in lines:
    if line.startswith('NOTION_API_KEY='):
        out.append('NOTION_API_KEY=' + token)
        replaced = True
    else:
        out.append(line)
if not replaced:
    out.append('NOTION_API_KEY=' + token)
path.write_text('\n'.join(out) + '\n')
PY
else
  printf '\nNOTION_API_KEY=%s\n' "$TOKEN" >> "$ENV_FILE"
fi
chmod 600 "$ENV_FILE"
echo "Saved NOTION_API_KEY to $ENV_FILE"
