# CoS Memory
Last updated: 2026-06-22
Reviewed: 2026-06-22

> **Release Engineering built (2026-06-22).** CoS now owns a third engine alongside strategy (`ros-conductor`) and improvement (`ros-evaluator`): **Delivery** (`CoS/delivery/MESH.md`, lead `ros-release-lead`, standard `/00_System/release-engineering/`, run via `/ros-release`). Incremental promotion (branch→full green-gate→canary→**Guy-gated promote**→rollback), feature/claim-level gating (flags + claim register), per-product regression suites, and the merge-lane lock that ends the "main moves under concurrent sessions" race. Backlogs collapsed to **3 canonical queues** (Arbor-Product/Arbor-Mktg/ROS) with feeders. First train `REL-ARBOR-001` seeded in the [release ledger](../00_System/release-engineering/RELEASE-LEDGER.md). CoS holds the Level-3 prod-promotion sign-off. Closes ROS-BACKLOG Theme O.

---

## Email account

bguy.rubin@gmail.com

## Current OKRs

### Q2 2026 (Apr – Jun) — NOT SET (no baseline; do not score)
Q2 was never stood up; ends 2026-06-30. Per ROS-CIL editor pass: skip Q2 scoring, stand up Q3 cleanly.
**Q3-2026 OKRs:** to be drafted in `CoS/OKRs/Q3-2026.md` from ROS-STRATEGY.md Theme M + each domain `MEMORY.md` Next: — **gated on Guy** (objectives are a priority call).

## Active projects

- [ ] Coca-Cola employment contract — Domain: EA/KK — Stage: Final contract — Owner: Guy — Next milestone: Receive/review contract — Due: ASAP — Status: 🟡
- [ ] ABN freelance onboarding — Domain: EA/KK — Stage: Onboarding — Owner: Guy — Next milestone: Complete onboarding steps/access/admin — Due: ASAP — Status: 🟢
- [ ] Notion Second Brain for ROS — Domain: CoS/KK — Stage: Notion integration connected and Command Center API access verified — Owner: Guy + Hermes — Next milestone: deploy/confirm databases and dashboards under verified parent — Due: ASAP — Status: 🟢
- [ ] [[projects/WALLS_Roadmap_Dashboard|WALLS Roadmap / Notion project-running dashboard]] — Domain: CoS/MKT/KK/PAI — Stage: Notion integration connected and parent page API access verified — Owner: Guy + Hermes — Next milestone: create/confirm target database/dashboard — Due: ASAP — Status: 🟢

## Open decisions

Tracked in `/13_Decision_Log/` (created 2026-06-21). Currently open:
- [ ] Arbor cloud deployment decision — Domain: PAI — Owner: Guy — Due: 2026-06-30 — Status: 🟡
- [ ] Bookmark/article revival pack (adopt or drop) — Domain: KK/MKT — Owner: Guy — Due: 2026-06-30 — Status: 🟡
- [ ] **REL-ARBOR-001 canary→prod 100% promote** (D-2026-06-22-1, the one go/no-go) — Domain: PAI/CoS Delivery — Owner: Guy — Due: on green-gate pass — Status: 🟡
- [ ] OPS-C1 WIF/IAM (D-2026-06-22-2) — Domain: PAI/CoS Delivery — Owner: Guy — Due: with REL-ARBOR-001 — Status: 🟡

## Key stakeholders

<!-- [Name] — Role — Domain — Relationship — Last contact: -->

## Weekly review cadence

Last cross-domain review: NEVER (only a PRD review exists, 2026-05-12) — flagged by ROS-CIL 2026-06-21 as a 40-day gap.
Next: run `weekly-review` → `CoS/reviews/Review_2026-06-21.md` (top safe item this cycle). Target cadence: Friday.

## Learned patterns

<!-- CoS-level patterns, recurring blockers, cross-domain dependencies -->

- User's handwritten software setup notes should be converted into actionable ROS/Notion project dashboards with task rows, owner agents, dependencies, blockers, and import-ready files when Notion API access is unavailable.
- Notion execution has a valid `NOTION_API_KEY` for integration `ROS KK Con` in Guy Rubin's workspace, with verified API access to Rubin OS Command Center and HollandVest Command Center as of 2026-05-19.


- [ROS-CIL 2026-06-21] Deep editor pass over 15 findings. Headline: the management heartbeat is dead — weekly review never run (40d gap), Q2 OKRs never set, decision log dir missing, CoS memory 37d stale, only 2 of N specced crons live. Freshness git-derived works but unfed (5/7 stale, 0 heartbeats). Safe fixes applied: CoS memory refreshed, /13_Decision_Log/ created, MKT header de-gamed, dead-cron docs confirmed. Gated for Guy: run+cron weekly review, draft Q3 OKRs, register loops, add My Tasks DB to Notion registry, revive HV/Tsagareli crons. Full log in CoS/ROS-BACKLOG.md State-of-the-Company.

- [GitHub] Local ROS initialized as git repo and first commit pushed to `https://github.com/guyrubin/ROS` main. Commit `b3ce2b9` verified by fresh clone with 85 files, including Arbor HTML prototypes and PAI working files. | Date: 2026-05-15

- [CoS portfolio call 2026-06-22] Arbor shipping + release capability. **Decision: AMBER → ship the 6 green council items, but ONLY through REL-ARBOR-001, never by hand.** Sequencing: (1) Theme O release train is the dependency that unblocks ALL optimization loops (CIL/Clinical/Marketing) — it is the prerequisite, not a competing priority; rank it at the TOP of the autonomous-build queue but it costs ~zero Guy-time (loops build to green; Guy only signs the promote). (2) The 6 green items (CI-13/06/12/07/08/05 on `claude/council-wave-1`, built off a now-stale main) rebase onto `rel/arbor/001` and ride the canary as the train's LAST bundle — they do not ship ahead of the OPS net. (3) The rest of the 26 gated council candidates stay queued behind the train proving itself once. **The ONE Guy decision = D-2026-06-22-1: canary→prod 100% promote** (after green-gate + smoke). Two dependent gated calls: OPS-C1 WIF/IAM (D-2026-06-22-2) and any claim-flip (D-2026-06-22-3). **Autonomous loops may: build to green on a branch, run the full gate, deploy a no-traffic canary, smoke it — then STOP.** They may NOT: promote canary→100%, flip a claim, touch billing/store/child-data, merge to main outside the lock. **Cross-domain conflict flagged: Guy's prod-promote sign-off is the single human bottleneck for every loop's output — batch promotes (one weekly Arbor train) so it stays one decision, not many.** vs HV/EA/Career: those are revenue/relocation-critical and time-boxed (Coca-Cola contract, BE appeal 24-Jul); the release train is build-time-cheap and parallel, so it does not compete for Guy's attention beyond the single weekly promote. | Owner: Guy (promote) + ros-release-lead (train)
