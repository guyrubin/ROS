# Scheduled Loop: Arbor Marketing loop

- **Owner mesh:** Arbor Marketing ([MESH.md](MESH.md))
- **Runtime:** `scheduled-tasks` MCP (runs while the workstation/app is up; cloud-always-on is the future upgrade — see SCHEDULED-LOOPS.md)
- **Cadence:** Tue + Fri 05:00 Europe/Amsterdam (`0 5 * * 2,5`)
- **Posture:** **Acts** — autonomous up to T2 (publish to owned organic surfaces). T3 (money/claims/child-data/irreversible) stops for confirmation. See [OPERATING-MODEL.md](OPERATING-MODEL.md) autonomy tiers.
- **Trigger ID:** _filled once created_
- **Delivery:** backlog write + `/PAI/MEMORY.md` cycle entry + an approve-to-ship roll-up for any T3 items (to Guy)

## What it does (each fire)
1. **SENSE:** `arbor-critic-market` (live funnel: landing/SEO/OG/positioning EN+HE) + `arbor-critic-capability` (competitor benchmark via web). Pull prod funnel/attribution signal where available.
2. **FRAME:** `arbor-marketing-lead` dedupes + scores into [MARKETING-BACKLOG.md](MARKETING-BACKLOG.md); hands competitor feature-requests to the product backlog.
3. **BUILD:** pods produce the top `safe` materials (copy/SEO/assets), each green + previewable.
4. **VERIFY:** brand-review + `arbor-safety` + EN/HE preview + links/attribution (the DoD gate).
5. **SHIP:** T2 items publish to owned organic surfaces; T3 items surface as a drafted approve-to-ship list.
6. **LEARN:** save the backlog; append a dated cycle entry to `/PAI/MEMORY.md`.

## Scope & noise filters
- Include: Arbor's owned marketing surface (landing/SEO/blog/AEO), organic social, asset production, funnel findings, competitor scans.
- Suppress: items already shipped, duplicates of open backlog items, any gap not grounded in a current competitor source.

## Guardrails
- **Auto-publishes only to owned organic surfaces**, and only after each item passes brand-review + `arbor-safety` + preview.
- **Never** spends money, transfers a clinical/effect-size claim, uses real child face/voice/data, buys a domain/DNS, submits a store listing, emails acquired user lists, or edits product code without confirmation.
- `arbor-safety` veto is absolute. Respects identity-policy (`bguy.rubin@gmail.com`).
- Writes back to shared state every run (backlog + `/PAI/MEMORY.md`) — non-negotiable.

## Go-live checklist
- [x] Specced here + row added to [SCHEDULED-LOOPS.md](../../../../00_System/agent-framework/SCHEDULED-LOOPS.md)
- [ ] Guy confirmed full-autonomy-with-publish posture for the live runtime
- [ ] Created on `scheduled-tasks` MCP; Trigger ID recorded
