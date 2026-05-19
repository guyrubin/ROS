# Notion Command Center Update — 2026-05-15

Status: **Ready for live Notion update**. Integration token is valid and API access is verified for the Rubin OS and HollandVest Command Center pages.

Integration detected: `ROS KK Con` in `Guy Rubin's Woekspace`.

## Anti-junk policy

This pack contains only high-signal, active items from ROS memory and the confirmed apartment-viewing email. It excludes newsletters, generic job alerts, old inactive EA clients, and unconfirmed/low-value inbox noise.

## Clean payload

- `clean_command_center_payload.json` — canonical payload
- `projects.csv` — manual Notion import if needed
- `tasks.csv` — manual Notion import if needed
- `upsert_command_center.py` — additive API updater once the target page is shared

## Verified Notion parents

- Rubin OS Command Center: `2b4f37e231fe801c8495dea36d0efd4d`
- HollandVest Command Center: `20401545ece243e397e18534e701d207`

The updater should create/update only the exact databases `ROS Command Center — Projects` and `ROS Command Center — Tasks`, and upsert by exact `Name` to avoid duplicates.
