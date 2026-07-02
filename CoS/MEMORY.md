---
type: memory
title: CoS Memory
description: Active facts and state for the Chief of Staff domain.
---

# CoS Memory
Last updated: 2026-06-29

---

## Email account

bguy.rubin@gmail.com

## Current OKRs

### Q2 2026 (Apr – Jun)
<!-- Populate after running /okr-tracker -->
- HV: [objective] — [key results]
- EA: [objective] — [key results]
- Ventures: [objective] — [key results]
- Marketing: [objective] — [key results]
- PA: [objective] — [key results]

## Active projects

- [ ] Coca-Cola employment contract — Domain: EA/KK — Stage: Final contract — Owner: Guy — Next milestone: Receive/review contract — Due: ASAP — Status: 🟡
- [ ] ABN freelance onboarding — Domain: EA/KK — Stage: Onboarding — Owner: Guy — Next milestone: Complete onboarding steps/access/admin — Due: ASAP — Status: 🟢
- [ ] Notion Second Brain for ROS — Domain: CoS/KK — Stage: Notion integration connected and Command Center API access verified — Owner: Guy + Hermes — Next milestone: deploy/confirm databases and dashboards under verified parent — Due: ASAP — Status: 🟢
- [ ] [[projects/WALLS_Roadmap_Dashboard|WALLS Roadmap / Notion project-running dashboard]] — Domain: CoS/MKT/KK/PAI — Stage: Notion integration connected and parent page API access verified — Owner: Guy + Hermes — Next milestone: create/confirm target database/dashboard — Due: ASAP — Status: 🟢

## Open decisions

<!-- - [ ] [decision] — Domain: — Options: — Owner: — Due: — Status: -->

## Key stakeholders

<!-- [Name] — Role — Domain — Relationship — Last contact: -->

## Weekly review cadence

<!-- Last review: [date] — Next: [date] -->

## Learned patterns

<!-- CoS-level patterns, recurring blockers, cross-domain dependencies -->

- ROS company-level operating-system backlog is centralized in `CoS/ROS-BACKLOG.md`; the 2026-06-28 Central Backlog + Night Knowledge Management epic captures night memory write-back, Claude/Hermes sync preflight, backlog triage, and night-op audit trail as one stream.
- ROS code optimization backlog lives at `CoS/backlogs/ros-code-optimization-backlog.md` (linked detail for ROS-BACKLOG RCO3); it centralizes repo-wide code-efficiency work across Arbor, ROS interface, generated artifacts, scripts, secrets hygiene, and agent worktree cleanup with ponytail constraints.
- ROS repo hygiene production tooling lives at `00_System/scripts/ros_repo_hygiene.py` with tests in `00_System/scripts/test_ros_repo_hygiene.py`; it classifies local junk/secrets, excludes active Arbor work, and auto-cleans only allowlisted generated outputs such as untracked `graphify-out/`.
- Hermes runtime items folded into `CoS/ROS-BACKLOG.md` (HR-1..4: context-compression reliability, gateway/cron health, cron-ownership registry, Hermes boot+preflight discipline) — the standalone hermes-ros-optimization-backlog file was retired to keep one ledger.
- **Canonical CEO surface = `ros-interface-v4`** (React/Vite/TS, :4600) — DECIDED 2026-06-30; rivals RETIRED. `CoS/projects/` now = `_retired/` (archived: gcc `index.html`, `ros-multi-agent-map.html`, `notion-command-center-update`, `notion-second-brain`, `notion_import`, WALLS) + `guy-command-center` (kept as **data layer** — `state.json` + `gen-state.mjs` feed v4) + `ros-interface-v4`. Dropped the `:4500` launch entry. Plan/backlog: `CoS/projects/ros-interface-v4/CONSOLIDATION-PLAN.md` + `ENHANCEMENT-BACKLOG.md`. Shipped views: `/map` = dual-mode interactive **Graphify** graph (curated agents+skills · live graphify extraction of `00_System`+`.claude`, 12 communities); `/backlog` = **Backlog Hub** centralizing every scattered domain backlog (CoS·EA·PAI, 9 files / 203 items) via `guy-command-center/gen-backlogs.mjs` (auto-discovers `*backlog*.md`, parses tables/checkboxes/ID-headings/bold-bullets → `state.backlogs[]`; skips stale worktrees + dated `execution/` archives) → `BacklogHub.tsx`. **Store gotcha:** `store.ts applyV3Defaults` whitelists state keys — any NEW `state.json` field must be added there or it's silently dropped. **Deploy paths:** (A) **Cowork artifact SHIPPED** — `npm run build:artifact` → `dist-artifact/ros-cockpit.html`, one self-contained 524KB file (vite-plugin-singlefile + state inlined on `window.__ROS_STATE__`; `useStateSync` prefers it, falls back to `/state.json` in dev); private to the session, gitignored. (B) **Firebase login-gated = SCAFFOLDED + Tier-C-pending** (`DEPLOY.md`, `firebase.json`); shell build green (no data in `dist/`). 🔒 **LOAD-BEARING RULE: never deploy a build containing `state.json` to public hosting — it has NDA/client/financial data; prod must serve data via an auth-gated path (Firestore-rule / Cloud Function), not a static file.**
- User's handwritten software setup notes should be converted into actionable ROS/Notion project dashboards with task rows, owner agents, dependencies, blockers, and import-ready files when Notion API access is unavailable.
- Notion execution has a valid `NOTION_API_KEY` for integration `ROS KK Con` in Guy Rubin's workspace, with verified API access to Rubin OS Command Center and HollandVest Command Center as of 2026-05-19.


- [GitHub] Local ROS initialized as git repo and first commit pushed to `https://github.com/guyrubin/ROS` main. Commit `b3ce2b9` verified by fresh clone with 85 files, including Arbor HTML prototypes and PAI working files. | Date: 2026-05-15
