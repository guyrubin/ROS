---
type: memory
title: PAI Memory
description: Active facts and state for the Product & AI Ventures domain.
---

# PAI Memory
Last updated: 2026-06-27

## ⭐ CURRENT STATE [2026-06-27] — Arbor is LIVE in production (supersedes all "unmerged branch / AI disabled / local-only" notes below)

The 2026-06-03 "Active ventures" block and earlier still describe Arbor as a local unmerged v2 branch with AI disabled. **That is historical — superseded.** Ground truth today:

- **Live in prod** on **arborparentingapp.com** (GoDaddy-API domain + Firebase custom-domain; login-fix = add domain to Firebase Auth authorized domains). Prod is current + functional.
- **Deploy pipeline:** `arbor-deploy.yml` is a canary (candidate → smoke → promote → hosting); the long-stale-prod root cause (a `--to-latest=100` promote-step bug) is **fixed**. Client deploys only from `main` — never hand-deploy hosting; merge-to-main through the pipeline IS the prod-promote.
- **Mobile:** iOS + Android native builds **green in CI**; only Apple/Google account-gated steps remain (active goal: publish both stores).
- **Billing:** Free / Plus / Family; web Stripe + native iOS/Play; **RevenueCat** as unified entitlement brain (needs one end-to-end test purchase).
- **Avatar + AI image-gen:** BUILT / DEPLOYED / VERIFIED in prod; remaining = 2 Guy-gated calls (child-ASR vendor, Firebase Storage).
- **Design system:** LIVE on claude.ai/design ("Arbor Design System", sapphire "2035"); remote supersedes the local build — leave as-is.
- **Child-data GDPR:** export/erase allow-list (`CHILD_SUBCOLLECTIONS` in `childData.ts`) fixed + guard test enforces every sink is registered. Don't remove the guard.
- **Design-goal state:** canonical strategy = `PRODUCT-REDESIGN-STRATEGY.md`; wave-1 RTL+a11y + wave-3 clinical-firewall shipped (`cda94e1`); next = layout/IA redesign (UC-1); sapphire-flip + future prod-promote = Guy-gated.
- **Folder:** renamed `parenting-os-plugin` → `PAI/projects/arbor` (2026-06-24); the live app still physically nests in the `PPPPtherapy-` repo (move deferred until the 17 worktrees close). Boundary doc: `00_System/repo-boundaries.md`.
- **Autonomy:** PAI now runs the three-engine self-running loop — spec in `PAI/AUTONOMY.md`; PAI/CLAUDE.md rebuilt v0.1-stub → v1.0 domain OS (2026-06-27).

## Updates [2026-06-17] - Arbor marketing + SEO/AEO foundation live

- **Marketing surface shipped:** Arbor now has Hebrew and English marketing
  landing pages, guide hubs, SEO intent pages, Markdown summaries for LLM
  retrieval, `robots.txt`, `sitemap.xml` with 19 URLs, and `llms.txt` deployed
  on Firebase Hosting at `https://arborprd-westeu.web.app/marketing/`.
- **Design/copy direction:** The marketing site moved toward a clean, premium,
  health-system-inspired Hebrew-first brand direction. Core message: Arbor is a
  child-development operating system for parents, combining living child
  context, expert guidance, daily play, personalized stories, growth plans, and
  professional handoff.
- **SEO/AEO implementation:** The Arbor app repo now includes
  `app/scripts/enrich-marketing-seo.mjs`, which enriches all marketing HTML
  pages with JSON-LD graphs, social metadata,
  WebPage/CollectionPage/Article/Breadcrumb schema, and AI-crawler-friendly
  robots rules. Live checks returned `200` and parseable JSON-LD.
- **Domain decision:** Use a local Israeli domain for public launch:
  `arbor.co.il` if available, then `getarbor.co.il` or `hellarbor.co.il`. Keep
  `web.app` as the technical origin until the domain is purchased, verified in
  Firebase Hosting, and serving HTTPS; only then switch canonical/sitemap/LLM
  URLs.
- **Procurement direction:** Recommended lean SEO stack: Screaming Frog SEO
  Spider first, then Semrush One Starter or SE Ranking Core + AI Search add-on
  after the custom domain and Search Console are live. Do not overbuy
  enterprise AEO tools yet.

## Updates [2026-06-14] — Competitor wedge shipped: 3 features + IA redesign, live on `main`

- **Trigger:** market research on Arbor's competitors (Kinedu, Lovevery, Huckleberry, Cleo, Cooper, Maven) → defined 3 features to beat them, each built on the longitudinal-memory moat. Strategy stress-tested (grill-me) and IA redesigned (card-sort/tree-test). Docs: `PAI/projects/parenting-os-plugin/arbor-competitive-analysis-and-feature-defs-2026-06-14.md`, `…/arbor-redesign-and-additions-definition-2026-06-14.md`, `…/arbor-ia-redesign-2026-06-14.md`; build plan `PPPPtherapy-/PPPPtherapy-/app/.design/arbor-ia/TASKS.md`.
- **Built + shipped to production** (3 commits, merged to `main` @ `f019b86`, pushed; live **https://arborprd-westeu.web.app**, verified home 200 / api 401 / fresh asset):
  - **Rhythm** — `app/src/rhythm/predict.ts` (pure, 8 tests): predicts today's friction/calm/wind-down windows from the family's own log; honest sparse-data state. On the new **Today** home.
  - **Daily Play** — `app/src/playbank/` (12 household-item activities + concern-aware selector, 9 tests): picks by band **+ recently-logged behavior**; card on Today + library under Grow.
  - **Ask-a-Specialist** — `app/src/consult/packet.ts` (pure, 8 tests) + `AskSpecialist.tsx`: warm handoff packet from the child's record, line-level redaction (Safety L3), Copy/Download export; send-to-expert stubbed Phase 2.
  - **IA redesign** — 7 sections → 6 task pillars (Today/Ask/My Child/Grow/Care/Academy) via reusable `HubTabs` (Development/Practice/Consult merges); `TAB_SECTION_FALLBACK` re-homes every demoted leaf — nothing deleted.
  - **a11y + Hebrew/RTL:** global `:focus-visible` covers keyboard; all new UI chrome wired through i18n en+he (verified live dir=rtl). Activity/packet *content* stays English (native review pending).
- **Quality:** tsc clean, 162 tests pass (25 new), verified live across all pillars EN+HE.
- **Open:** native Hebrew review of Daily Play content; Phase-2 backlog (Daily Play Courses, AI-generated activities, send-to-expert marketplace).

## Updates [2026-06-12] — Practice Studio shipped (Fall release, 10 features)

- **PRD:** `PAI/projects/parenting-os-plugin/PRDs/PRD_2026-06-12_speech-language-fall-release.md` — 10 features ported from Articulation Station / Speech Blubs / Otsimo / MITA, organized as 4 modules + the Development Copilot killer feature (connect-the-category, prescribe→signal wedge).
- **Built same day on `main` @ `8072745`, pushed + deployed to production** (arborprd-westeu.web.app verified: new bundle + all 5 chunks live, API 401 gate + rate limit up; CSP concern moot — helmet CSP is API-only, Hosting serves the SPA without CSP): new `app/src/practice/` engine (content banks + pure scoring `signals.ts`, 15 unit tests) + 5 views in `app/src/components/practice/` (SpeechCoach, MimicStudio, Missions, Adventures, DevelopmentCopilot). New 7th nav section "Practice Studio"; Development Dashboard under My Child. All sandbox-safe; audio/camera strictly on-device. tsc + 122 tests + prod build green; flows verified live in browser.
- **Key design decisions:** bands not "developmental age" numbers (clinical defensibility / EU-MDR); parent scoring is the universal floor (Web Speech API best-effort only); Development Score = practice *consistency*, never child ability; adventures record first-try answers only.
- **Open (PRD hypotheses):** H1 daily-habit retention gate (<20% families @3 missions/wk by day 30 = kill), H2 SLP interviews on the practice report, H3 recommendation-followed rate. Hebrew sound set + AI-generated adventures = fast follow.

Active facts only. Completed execution history → [[PAI/archive|PAI Archive]].

---

## ⭐ Canonical Arbor branch [decided 2026-06-03]

- **`main` (`guyrubin/PPPPtherapy-`) is now the v2 component architecture** — adopted from `feat/arbor-next` via a replace-tree merge (`75b7a48`; parents = old main `cb7c0fa` + arbor-next `a2cca04`). Verified: tsc clean, 25 tests pass, prod build OK, **live AI returns real plans** (HTTP 200, key in `.env.local`, `gemini-2.5-flash`).
- **Architecture:** `app/src/App.tsx` is now **62 lines** + a real component system (`components/tabs/*`, `components/ui/*` design system, `ErrorBoundary`, auth flow, `layout/Shell|Sidebar|MobileNav`, profile drawer, global search, goals, check-ins, Firebase Storage photo uploads, cost guardrails, type safety, FE tests). This **supersedes the 3019-line monolith**.
- **Superseded branches (kept on remote, not deleted):** `feat/sprint1-bugs-legibility` + `feat/capability-backlog` = the OLD monolith line (my Sprint-1 QA fixes were applied there). `feat/six-frames` = stale PRD edits. Don't build on these.
- **Backup of old main:** branch `backup/main-pre-arbor-next-20260603` + tag `main-pre-arbor-next` (both pushed) = PRD v1.1 monolith, fully recoverable.
- **Ported [2026-06-03]:** **Language Lab** is back in v2 as `components/tabs/LanguageLabTab.tsx` — now **data-driven off `childProfile.languages`** (no hard-coded Hebrew/English/Dylan), with Vygotsky-ZPD daily routines that template to the child + second language and "Coach me" buttons into the Parent Coach. Wired into `ActiveTab`/Shell/Sidebar/MobileNav. (`main` @ `4a2125c`.) Old main's other PRD content (scholars, Six Frames, Friction, routines) already existed in v2.
- **Fixed [2026-06-03]:** `generate-plan`/`analyze-behavior` returned **empty `phases`/`scripts`** — not a model limit; the response schema declared array items as `Type.OBJECT` with empty `properties: {}`. Defined the real nested fields in `routes/api.ts` to match the `ActionPlan`/`BehaviorAnalysis` types. Verified live: plans now return 3 populated phases (with steps) + 3 scripts. (`main` @ `9a45d5f`.)
- The earlier [2026-06-02] "Waves 1-6 / sprint1 is the deliverable" notes below are **superseded** by this decision — sprint1 was the monolith line, not the chosen architecture.

---

## Active ventures

### Arbor — AI parenting / child-development platform
- Status: **Active | Private Beta Build — v2 architecture on a local unmerged branch, runs locally**
- Positioning: Developmental operating system for modern families (birth–age 12)
- **Published `main` (CURRENT, verified 2026-06-14):** `guyrubin/PPPPtherapy-` `main` @ `f019b86` — deployed live at https://arborprd-westeu.web.app. See the 2026-06-14 update at the top. (The 04cc2c7 / "v2 on an unmerged branch" / "AI disabled" / "gcloud missing" notes in the rest of THIS 2026-06-03 block are historical and superseded — v2 is long since on main, prod is live, gcloud+firebase are authed via ADC.)
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
