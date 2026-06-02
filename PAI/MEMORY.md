# PAI Memory
Last updated: 2026-05-30

Active facts only. Completed execution history → [[PAI/archive|PAI Archive]].

---

## Active ventures

### Arbor — AI parenting / child-development platform
- Status: **Active | Private Beta Build — v2 architecture on a local unmerged branch, runs locally**
- Positioning: Developmental operating system for modern families (birth–age 12)
- **Published `main` (last verified):** `guyrubin/PPPPtherapy-` `main` @ `04cc2c7` (10 scholar-grounded routine plans). No newer main commit verified.
- **Local working clone:** `C:\Users\dguyr\ROS\PPPPtherapy-\PPPPtherapy-` is currently on branch **`codex/arbor-v2-architecture-foundation` @ `42997e3`** — 6 commits ahead of `origin/main`, with uncommitted changes AND untracked files. v2 architecture is on this branch, **not yet merged to `main`**.
- ⚠️ Untracked/uncommitted in the working tree: Firebase auth (`src/AuthContext.tsx`, `src/LoginPage.tsx`, `src/firebase.ts`), `terraform/`, `scripts/`, `app/.dockerignore`; modified `src/main.tsx`, `src/routes/api.ts`, `src/config/env.ts`, `cloudbuild.yaml`. **Action: commit + open PR / merge so this work isn't lost.**
- **Stack:** React 19 + Vite + Express + Gemini/Vertex + Firebase. Source in `app/src/`.
- **Run from `app/`:** dev `npm run dev` (tsx `server.ts`), prod `npm run start` → `http://localhost:3000`. ROS `.claude/launch.json` exposes `arbor-dev` / `arbor-prod` (they run this working tree → the v2 branch).
- **AI status:** Disabled — placeholder `GEMINI_API_KEY` in `app/.env.local`; add real key to enable the coach.
- **Capabilities on the v2 branch (uncommitted/unmerged):** Firebase auth, Firestore + local memory adapters (`src/memory/`), Claude-primary model router (`src/ai/modelRouter`), knowledge wiki retrieval (`src/knowledge/`), Zod coach contract (`src/contracts/coach`), safety escalation screening (`src/safety/`), Cloud Run/terraform scaffold. The 10 routine plans are on `main` (`04cc2c7`).
- **PRD:** `PPPPtherapy-/docs/arbor-prd.md` (canonical); mirror at `PAI/projects/parenting-os-plugin/prd-v1.md`.
- **Surfaces:** the React app at `PPPPtherapy-/PPPPtherapy-/app/` is the canonical product. The HTML files in `PAI/projects/parenting-os-plugin/html/` (incl. `arbor-app.html`, `arbor-concierge-mvp-prototype.html`) are **legacy Phase 0 / standalone prototypes**, not the shipping app.
- Next: add real `GEMINI_API_KEY`; decide cloud deployment target (Cloud Run scaffold present); GCP deploy still blocked by missing local `gcloud` (`firebase-tools` works via `npx`).

## Updates [2026-06-02] — Sprint 1 executed (study-group QA)

- **Branch:** `feat/sprint1-bugs-legibility` off `feat/capability-backlog` (local clone `PPPPtherapy-/PPPPtherapy-/app`). Not pushed.
- **Key discovery:** `feat/capability-backlog` already shipped **Waves 1–6** of the capability/advisory backlog — multi-child + onboarding (A-01/A-02), de-grandified voice (A-04), warm-paper re-skin off the dark cockpit (D-01), panic mode (E-01), voice (E-02), lens legibility (H-09=G-05), follow-up loop, source grounding, patterns (K-09). So most of the master plan was **already done**; the study-group doc reviewed an **older build**.
- **Real bug found + fixed (G-01):** `onClick={handleGenerateActionPlan}` passed the click event as `topicOverride` → `(event ?? planChallengeTopic).trim()` threw `TypeError`, so "Generate plan" silently did nothing = the study group's "Blueprint produced nothing." Fixed + added the `apiError` banner (state was set but **never rendered**). Verified in-browser: banner now shows "GEMINI_API_KEY is not configured…".
- **Shipped:** G-01 (bug+banner), G-04 (killed "Total Mastery"/"Active Domain Score Archive"/"Vygotskian Scaffolding Analyzer" jargon; genericized ~12 hard-coded "Dylan" demo strings to `childProfile.name`; replaced a fabricated clinical "delay checklist" warning with honest non-alarmist copy), G-10 (child photo on onboarding + switcher avatar, data-URL, local-only).
- **Moot in current build (resolved by redesign):** G-02 (no story overlap), G-06 (no "New" button), G-07 (no reminders UI), G-08 (edit modal has no opaque risk-level question), G-09 (cards align).
- **Outstanding follow-up:** formal WCAG 2.1 AA audit (G-03 beyond the re-skin). AI still disabled locally (placeholder `GEMINI_API_KEY`).
- Commits: `b1c1c4f` (photo + config, auto-committed by an env watcher) + `4511838` (G-01 onClick fix). tsc + prod build green.

## Sprint goal [set 2026-06-02]

- **Arbor Sprint 1:** ship Tier 0 bugs → Tier 1 legibility ("tell the truth / calm the room" P0 work). Fold G-10 (child photo) + G-11 (manual challenge→plan) into A-01/A-02 profile work — same code path.
- **Master sequencing source of truth:** `PAI/projects/parenting-os-plugin/execution/arbor-master-sprint-plan-2026-06-02.md` (merges the A/K/D, H/E, and G backlogs; dedup map inside).
- **Parallel safety gate (does not wait for a sprint slot):** K-03 real crisis resources, K-01 semantic safety, K-02 review queue — beta with real families is blocked until these land.
- **Open decisions blocking work:** (1) voice — marketing headlines vs de-grandify; (2) beta paid? (gates Account Settings G-16); (3) aesthetic D-01 — warm paper vs dark cockpit.

## Active decisions

- [Decision] Arbor is a parent question → child memory → safety triage → action plan → professional handoff workflow, not a generic chatbot or expert marketplace. | 2026-05-15 | Rationale: trust + longitudinal developmental intelligence is the moat.
- [Decision] Treat the repo as private-beta, non-diagnostic parent-support only; production hardening (child-data privacy, safety escalation, expert governance) before any public launch. | 2026-05-22

## Open questions

- [Question] First parent-test wedge: behavior/routines, speech/language, emotional regulation, school readiness, or autism/ADHD concerns? | Blocking: scenario prioritization
- [Question] Beta market: Netherlands-first, Israel-first, or dual-track (Israel content/expert engine + Netherlands institutional pilot)? | Blocking: GTM sequencing

## Updates [2026-05-30]

- Corrected stale/wrong memory: the local clone is **not** on a clean `main`. It is on branch `codex/arbor-v2-architecture-foundation` @ `42997e3`, 6 commits ahead of `origin/main`, dirty. The v2 architecture + Firebase auth + terraform/Cloud Run scaffold are here but **untracked/uncommitted and unmerged** — at risk of loss until committed. (Matches the 2026-05-28 handover note about switching to this branch.)
- `main` last verified canonical is still `04cc2c7` (10 routine plans). Earlier this session I wrote `05c2156`/"PR #7 merged" — that was unverified and wrong; removed.
- Verified the running app (`arbor-dev`, port 3000) is the React source under `app/src/`; the root-level `App.tsx`/`components/` paths assumed earlier do not exist — real source is `app/src/` (App.tsx, AuthContext.tsx, LoginPage.tsx, ai/, memory/, safety/, knowledge/, contracts/, server/, routes/).
- Built a standalone single-file demo `PAI/projects/parenting-os-plugin/html/arbor-app.html` (auth, multi-child profiles, conservative triage engine, guidance, timeline, 7-day tracking, dark mode, export) — a design/UX reference artifact, **not** the shipping app. Flagged Arbor surface sprawl (multiple HTML prototypes + the React app).
- Efficiency: moved the 2026-05-15→05-28 execution log to `PAI/archive.md` to keep this file in the hot path.

## Updates [2026-05-30] — filesystem reorg (partial)

Goal: consolidate the 3 local Arbor clones into one at `PAI/arbor/`, rename GitHub repo to `Arbor`, clean ROS cruft. Status: **safety + ROS-side hygiene done; folder consolidation BLOCKED by live sessions.**

- **All WIP preserved to remote** (nothing lost) — pushed three branches to `guyrubin/PPPPtherapy-`:
  - `codex/arbor-v2-architecture-foundation` `8a50d86` — committed the Firebase auth (AuthContext/LoginPage/firebase.ts) + terraform + scripts/setup-gcp.sh + GCP/cloudbuild work that was uncommitted.
  - `feat/six-frames` `a6d642f` — preserved local PRD edits (branch was local-only; now on remote).
  - `feat/arbor-next` `72c7b94` — snapshotted auth WIP (branch was local-only; now on remote).
- **Discovered 3 concurrent claude-code sessions.** Two are attached to Arbor clones: PID with `--add-dir …\PPPPtherapy-\PPPPtherapy-` (holds the inner clone), and one working in `.workspace/PPPPtherapy-` on `feat/arbor-next` actively building profile/auth UI (recharts, dnd-kit, confetti). **The inner clone is NOT static** → moving it to `PAI/arbor/` is blocked (Windows lock on its `.claude`). Folder move deferred until those sessions close.
- **ROS hygiene done:** removed inert cruft `ros-sync-setup/` (contract-superseded) and `ROS_BACKUP_OLD_20260519_231042/`; extended root `.gitignore` to cover `.workspace/`, `.claude/settings.local.json`, and the nested `/PPPPtherapy-/` clone.
- **Still pending:** (1) move inner clone → `PAI/arbor/` + delete duplicate outer `PPPPtherapy-/` (after sessions close); (2) GitHub rename `PPPPtherapy-` → `Arbor` (`gh` not installed — do via GitHub web UI, then `git remote set-url`); (3) update `.claude/launch.json` prefix to `PAI/arbor/app`; (4) Arbor rebrand sweep + wire `brand/arbor-logo.png`.
