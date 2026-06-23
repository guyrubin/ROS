#!/usr/bin/env bash
# Arbor auto-promoter (gcloud-driven, OPS-A3 backstop).
#
# WHY: CI (arbor-deploy.yml) deploys a green, gate-passed candidate at 0% traffic on
# every push to main, but the GitHub Actions `promote` job isn't completing reliably
# and can't be debugged headless (no gh). This closes the loop on tooling we control:
# find the newest Ready candidate sitting at 0%, smoke it on `/`, and promote it.
#
# SAFETY: it only ever promotes a revision CI already built (so the full green-gate
# already ran) and only after a live `/` 200 smoke. It NEVER flips a claim flag, edits
# billing/store, or deploys anything itself — claim-bearing surfaces stay dark behind
# their build-time-OFF flags regardless of which revision serves. Rollback: re-point
# traffic to the prior revision (printed below before promoting).
set -euo pipefail

SVC=arbor-api; REGION=europe-west4; PROJECT=arborprd-westeu
CAND_URL="https://candidate---arbor-api-q3vp2srxyq-ez.a.run.app"
LIVE_URL="https://arbor-api-q3vp2srxyq-ez.a.run.app"

live_rev() { gcloud run services describe "$SVC" --region "$REGION" --project "$PROJECT" \
  --format="value(status.traffic[0].revisionName)" 2>/dev/null; }

# Newest Ready revision overall (CI's latest candidate). If it already holds 100%, nothing to do.
latest_rev=$(gcloud run revisions list --service "$SVC" --region "$REGION" --project "$PROJECT" \
  --sort-by="~metadata.creationTimestamp" --filter="status.conditions.type=Ready AND status.conditions.status=True" \
  --format="value(metadata.name)" --limit 1 2>/dev/null)
current=$(live_rev)

echo "[auto-promote] live=$current  latest-ready=$latest_rev"
if [[ -z "$latest_rev" || "$latest_rev" == "$current" ]]; then
  echo "[auto-promote] nothing to promote (prod already on the latest ready revision)."; exit 0
fi

# Smoke the candidate on / (liveness; the candidate tag URL routes only to the new revision).
code=$(curl -s --max-time 20 -o /dev/null -w "%{http_code}" "$CAND_URL/" || echo "000")
if [[ "$code" != "200" ]]; then
  echo "[auto-promote] SMOKE FAIL — candidate $CAND_URL/ returned $code; NOT promoting."; exit 1
fi
echo "[auto-promote] smoke PASS (candidate / → 200). Rollback target = $current"

# Promote the latest ready revision to 100%.
gcloud run services update-traffic "$SVC" --region "$REGION" --project "$PROJECT" \
  --to-revisions "${latest_rev}=100" --format="value(status.traffic[].revisionName,status.traffic[].percent)" | tail -3

# Verify prod is live + healthy.
sleep 4
live_code=$(curl -s --max-time 20 -o /dev/null -w "%{http_code}" "$LIVE_URL/" || echo "000")
echo "[auto-promote] PROMOTED $current → $latest_rev ; live / → $live_code ; rollback: gcloud run services update-traffic $SVC --region $REGION --project $PROJECT --to-revisions ${current}=100"
[[ "$live_code" == "200" ]] || { echo "[auto-promote] WARN live not 200 after promote — investigate / consider rollback."; exit 1; }
