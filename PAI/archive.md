# ROS — PAI Archive

Historical context moved out of active memory. Load only when needed.

## 2026

- 2026-05-20 — Archive file created as part of ROS AI operating-system hygiene implementation.

## Arbor — execution log (2026-05-15 → 2026-05-28)

Moved from `PAI/MEMORY.md` on 2026-05-30 to keep the hot path lean. Completed execution records.
Current state: `main` last verified @ `04cc2c7`; v2 architecture lives on the local unmerged branch
`codex/arbor-v2-architecture-foundation` (`42997e3`). See [[PAI/MEMORY|PAI Memory]].

- [Source] Updated PRD PDF found at `CoS/PRD/Claude Cowork Parenting Os Plugin.pdf` and extracted into Claude-workable markdown at `PAI/projects/arbor/source-prds/claude-cowork-parenting-os-plugin.md`. | Date: 2026-05-15
- [Execution] Phase 0 execution started. Created HTML roadmap dashboard plus PRD v1, data model v1, safety policy v1, scenario library v1, Netherlands GTM v1, Phase 0 execution plan, and missing templates/resources under `PAI/projects/arbor/`. | Date: 2026-05-15
- [Execution] Created clickable Arbor Concierge MVP prototype at `PAI/projects/arbor/html/arbor-concierge-mvp-prototype.html`, plus parent tester recruitment message, professional reviewer checklist, and product demo flow under `execution/`. | Date: 2026-05-15
- [Decision] PPPPtherapy/Arbor GitHub repo pre-go-live review concluded the current repo is a concept/prototype, not production-ready; recommended private beta preparation only, with narrowed non-diagnostic parent-support MVP, child-data privacy architecture, safety escalation, expert governance, and production app foundation before public launch. Report: `PAI/projects/arbor/execution/pppptherapy-golive-review-2026-05-22.md`. | Date: 2026-05-22
- [Execution] Enhanced `guyrubin/PPPPtherapy-` for private beta positioning: PR #2 (`codex/private-beta-product-loop`) adds a README, tightens the PRD MVP scope, replaces the static platform mockup with an intake -> safety triage -> parent plan -> approved memory -> follow-up log -> handoff product loop, adds a source-grounded developmental AI operating model for domains, age-band logic, structured AI outputs, memory rules, safety evals, and human-review gates, and now includes an interactive no-build prototype at `prototype/arbor-private-beta-app.html`. | Date: 2026-05-24
- [Execution] Refit PPPPtherapy PR #2 interactive prototype using local design source `C:\Users\dguyr\Downloads\Arbor-standalone.html`: applied Scandinavian x Amsterdam visual system, daily field notebook framing, black editorial mark, clay accent, mono nav sections, synthesis panel, quick ask block, and field-note metrics while preserving Generate Plan, developmental routing, memory, handoff, and eval interactions. | Date: 2026-05-24
- [Coordination] Created and corrected Arbor surface coordination note at `PAI/projects/arbor/execution/arbor-surface-coordination-2026-05-24.md`. Public GitHub API verification shows PR #1, PR #2, and PR #3 are merged into `guyrubin/PPPPtherapy-` main, which now contains README, docs, mockups, and prototype. AI Studio export `C:\Users\dguyr\Downloads\arbor.zip` was inspected and assessed at `PAI/projects/arbor/execution/ai-studio-export-assessment-2026-05-24.md` as a candidate React/Gemini app foundation requiring safety/design hardening before GitHub import. Local FORMATION/pernenting platform path still not found. | Date: 2026-05-24
- [Execution] Opened PPPPtherapy PR #4 (`codex/import-ai-studio-app`) to import the AI Studio React/Vite/Express/Gemini app under `app/` with non-diagnostic developmental AI contract, structured coach output, escalation screening, Arbor field-notebook design tokens, app setup docs, and safety-copy eval. Verified `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run eval:safety`, and local DOM render at `http://localhost:3000`. PR URL: `https://github.com/guyrubin/PPPPtherapy-/pull/4`. | Date: 2026-05-24
- [Execution] Addressed Claude feedback on PPPPtherapy PR #4 before merge: added required Six Frames `frameRouting` to the coach schema/rendering, added append-only local memory review ledger with pending/approved/rejected/deleted states, added `GET /api/memory/:childId` and `PATCH /api/memory/:memoryId`, added parent approval queue UI, extended safety eval structural checks, verified lint/build/eval/diff-check plus memory API transition smoke test, pushed commit `85e214a`, and merged PR #4 into `main` with merge commit `fb1e11e`. | Date: 2026-05-25
- [Execution] Opened PPPPtherapy PR #5 (`codex/arbor-hardening-followups`) for Claude's next escalation: unified Arbor framework taxonomy via `app/src/framework.json`, added category-based Hebrew/caregiver safety screening, switched `/api/chat` to Gemini streaming with SSE + client abort, and added Express hardening (`helmet`, CORS allow-listing, `/api` rate limiting, `PORT`). Verified lint, framework check, safety eval, build, and runtime SSE/CORS smoke test. PR URL: `https://github.com/guyrubin/PPPPtherapy-/pull/5`. | Date: 2026-05-25
- [Execution] Started PPPPtherapy issue #6 Arbor v2 architecture execution on branch `codex/arbor-v2-architecture-foundation`: modularized Express backend, added typed production config, Vertex/Gemini model provider router, Firestore/local memory adapters, Zod coach validation, AI Wiki markdown retrieval with source cards, architecture/compliance docs, Firebase/Cloud Run deployment scaffold, Firestore rules/indexes, CI quality gates, and seed Git-backed knowledge cards. Verified `npm.cmd run lint`, `npm.cmd run check:framework`, `npm.cmd run eval:safety`, `npm.cmd run build`, plus built-server `/api/architecture/status` and urgent safety escalation smoke tests. | Date: 2026-05-26
- [Execution] Added F-07 ADR anchor set to PPPPtherapy branch `codex/arbor-v2-architecture-foundation` under `docs/adr/`: Vertex AI on GCP, Firestore app data, Git-backed AI Wiki, and Claude-primary model routing. | Date: 2026-05-26
- [Execution] Addressed Claude PR-V2 follow-ups on PPPPtherapy branch `codex/arbor-v2-architecture-foundation`: wired Claude-on-Vertex as `/api/chat` route default via `claude-3-5-sonnet@anthropic` shorthand and Anthropic Vertex request shape, kept Gemini Vertex routes for story/analysis/handoff, packaged `knowledge/` into the production image, added knowledge card startup logging and `/api/architecture/knowledge`, added Vitest unit tests for router/memory/Zod/safety/knowledge plus emulator-gated Firestore rules tests, added `npm test` to CI, and added Firestore family/member/child onboarding plus child-existence assertion before memory event writes. Verified lint, test, safety eval, framework check, build, and built-server status/knowledge smoke tests. | Date: 2026-05-26
- [Execution] Built and ran Arbor production app locally for the first time. Pulled `main` (PR #4 merged), ran `npm install`, created `app/.env.local` with placeholder GEMINI key, ran `npm run build` (Vite + esbuild production bundle), ran `npm run start` → `http://localhost:3000` serving HTTP 200 with versioned assets. `.claude/launch.json` configured at ROS root for `arbor-dev` and `arbor-prod`. | Date: 2026-05-28
- [Execution] Added 10 scholar-grounded developmental routine action plans to the production app. Committed as `04cc2c7` on `guyrubin/PPPPtherapy-` main. Plans cover: Preschool Transition (Bowlby·Winnicott), Sleep & Bedtime (Bowlby·Winnicott), Morning Breakfast (Montessori·Piaget), Family Mealtime (Bronfenbrenner·Montessori), Emotional Regulation Toolkit (Bowlby·Vygotsky), Screen Time Limits (Piaget·Winnicott), Daily Reading & Language (Vygotsky·Piaget), Physical Play & Movement (Piaget·Bronfenbrenner), Responsibility & Chores (Montessori·Bronfenbrenner), Evening Wind-Down (Bowlby·Winnicott). PRD updated with Developmental Routine Library spec. Each plan has 3 phases, parent scripts with say/avoid, and success indicators. TypeScript lint clean. Production rebuild confirmed. | Date: 2026-05-28
- [Execution] Handed over GCP deployment task to Claude. Switched to `codex/arbor-v2-architecture-foundation` branch in `C:\Users\dguyr\ROS\PPPPtherapy-\PPPPtherapy-` (where the Cloud Run/Firestore/Firebase scaffold lives). Stashed uncommitted `main` changes to `app/src/App.tsx`. Discovered `gcloud` is not installed locally on Windows or WSL; however, `firebase-tools` is verified and usable via `npx.cmd`. Next: Claude needs to authenticate and deploy to GCP, resolving the missing `gcloud` dependency. | Date: 2026-05-28

---

## Drained from PAI/MEMORY.md (memory-diet 2026-06-24) — historical update logs (<=2026-06-17 + Sprint/2026-05-30)

## Updates [2026-06-17] — Arbor WAF migration: blueprint + Wave 0 executed

- **What:** ran two autonomous multi-agent workflows to harden Arbor to top-tier Well-Architected (maturity 2.8/5 → target) for the **NL + IL** launch markets — gradual, cost-efficient, conflict-aware. Plan doc: `PAI/projects/arbor/arbor-waf-migration-plan.md`. Full artifacts in the Arbor repo `PPPPtherapy-/PPPPtherapy-/docs/architecture/migration-2026-06-17/`.
- **Blueprint (17-agent):** build-ready specs for all **44 missions** (OPS/SEC/REL/PERF/COST/AI/CMP) + adversarial verdicts + shared-file conflict map → **5-wave** plan. Critical path = the "API spine" (`routes/api.ts` + `createApp.ts`); everything else parallelizes in 5 disjoint-file tracks. Consumer launch unlocks end of W2; B2G at W4.
- **Wave 0 EXECUTED (13-agent):** all collision-free missions authored drop-in (DPIA, RoPA/DPA, incident+breach runbook w/ NL-72h + IL-PPA + Hebrew, change-gate, backup/DR, SLO/SLI, CMEK eval=defer, WIF script, budget script, k6 load-test, model-fitness ADR, OPS-1 observability + 5 new modules at `app/src/lib/observability/`, 26/26 tests). **Zero tracked files modified, no git/gcloud/deploy.** Apply gates: `wave-0/WAVE-0-APPLY.md`.
- **Lean-cost stance locked:** no Redis, no Sentry, CMEK deferred to a paying B2G contract; `min-instances=1` is the only deliberate recurring spend.
- **Blocked:** W1+ are code on the API spine → need an **isolated clean baseline** (the live billing session holds a dirty `feat/arbor-billing-mon2` tree). Open decision: stand up a **dedicated isolated Arbor repo** for migration execution (aligns w/ the 2026-05-30 consolidate-to-`Arbor` intent).
- **Concurrency rule still in force:** other sessions edit the Arbor tree — stay in lane, never `git add -A`, fetch + check status first.

## Updates [2026-06-17] — Content system + Development Score + milestone re-base (on main, NOT yet deployed)

- **Context:** acted on the updated PRD (`PRDs/PRD_2026-06-17_avatar-games-growth.md`) + this session's content-gap analysis ("nothing for 1.5/2yo, no get-ready-for-school"). Ran ONE backlog of 6 tasks, all in the **content/growth lane** — deliberately clear of the concurrent **codex avatar/Gemini/payments session** (stayed in `playbank/` + `growth/` + my own components; staged only my files, never `git add -A`).
- **Shipped to `main` (commits `9536982` + `cc4c627`, pushed; tsc clean, 215 tests):**
  1. **Micro-stage taxonomy** (`playbank/stages.ts`, 7 tests) — 12 windows; `ageToStage(1.5)`=18-24m. Optional `stages` field on activities.
  2. **Coverage map** (`playbank/coverage.ts`, 6 tests) — stage×domain grid + gap finder (makes content holes visible).
  3. **+8 activities** for 12-30mo + early infant (20 total), stage-tagged, en+he.
  4. **Readiness tracks** (`playbank/courses.ts`) — goal axis + 3 tracks (Get ready for school / new sibling / calmer bedtimes), chooser in Grow › Daily Play, en+he. Fills the "get-ready-for-school" gap.
  5. **Development Score** (PRD C4, `growth/devScore.ts` pure +8 tests) — per-domain score from milestones reached + weekly-snapshot trend + "nurture next"; `DevScoreCard.tsx` atop My Child › Development, en+he. (Distinct from the practice-consistency score; non-diagnostic.)
  6. **Milestone re-base** (PRD C1, data-only `initialData.ts`) — +36 CDC/AAP-2022 75th-percentile milestones birth-3y incl. CDC-2022 15- & 30-month checkpoints + ASHA, mapped to the six domains (was only 4-6y).
- **NOT deployed:** the working tree holds codex's uncommitted avatar WIP (`types.ts`, `modelRouter`, `ProfileEditDrawer`, `AvatarCreator`, `HeroScenePlayer`…). Deploying from it would ship the half-done avatar or require stashing codex's active work. My content is safe on `main`; **deploy once codex's avatar batch lands too (one clean release)**.
- **Follow-ups:** age-scope DevScore to match the age-filtered Milestones view; potty readiness track (no supporting activities yet); the rest of the PRD growth-loop (JITAI C3, red-flag C5).

## Updates [2026-06-17] — Daily Play Courses + AI token-resilience landed live

- **Concurrent-session reconciliation:** a codex session was actively writing Arbor AI files. Verified I was on the best version (`main`), then committed + shipped codex's work I found uncommitted: `bc2f3aa` (fail-closed prod auth config in `firebase.ts`/`App.tsx` — clear "sign-in not configured" screen instead of the prod "Sandbox Parent" bug; multimodal Gemini routing fix `modelRouter.modelForGeminiRequest`; `build:hosting:prod` env guard) and `a6eb6e2` batch-2 (codex AI token-resilience: `ai/modelRetry.ts`, `claudeVertexProvider.ts`, `memory/memoryService.ts`, env/api). **Lesson: codex sessions run concurrently — always `git fetch` + check `git status` before `git add -A` so you don't sweep WIP into your commit (I amended a commit to credit both honestly).**
- **New feature — Daily Play Courses** (Phase-2, in `a6eb6e2`): `app/src/playbank/courses.ts` (pure, 6 tests) = 4 challenge tracks sequencing existing activities, `recommendCourse(concernDomains)` matched to the child's top logged concern (the moat), `courseProgress`. `CourseCard.tsx` in Grow › Daily Play: progress bar, ordered days, next day expanded with steps, per-activity done toggles persist per child/course. Fully bilingual (en+he, RTL verified). Fixed a nested-`<button>` HTML bug.
- **Live on `main`:** https://arborprd-westeu.web.app (home 200 / api 401, asset index-Dte2Nrqz). tsc clean, **174 tests pass**. Phase-2 remaining: AI-generated activities, send-to-Arbor-expert marketplace.

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
- **Multimodal tasks configured:** Added `options.images` support to Gemini JSON generation/streaming for both `gemini_dev` and `vertex` providers in [modelRouter.ts](file:///c:/Users/dguyr/ROS/PPPPtherapy-/PPPPtherapy-/app/src/ai/modelRouter.ts). Image-bearing requests are forced through Gemini even when the normal route maps to Claude, and `/api/vision` is now covered by the AI quota guardrail. Verified live via [vision-smoke.mts](file:///c:/Users/dguyr/ROS/PPPPtherapy-/PPPPtherapy-/app/scripts/vision-smoke.mts); 2026-06-17 local test/lint/build green after routing hardening.
- **Production auth root cause identified:** The live app showed `Sandbox Parent` and `/api/chat` returned `Missing Authorization bearer token` because Firebase Hosting was built without `VITE_FIREBASE_*` client config while Cloud Run had `REQUIRE_AUTH=true`. Added a hosted-production fail-closed auth config screen, clearer chat auth error copy, and `npm run build:hosting:prod` to block future hosting builds without Firebase client env.
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

- **Trigger:** market research on Arbor's competitors (Kinedu, Lovevery, Huckleberry, Cleo, Cooper, Maven) → defined 3 features to beat them, each built on the longitudinal-memory moat. Strategy stress-tested (grill-me) and IA redesigned (card-sort/tree-test). Docs: `PAI/projects/arbor/arbor-competitive-analysis-and-feature-defs-2026-06-14.md`, `…/arbor-redesign-and-additions-definition-2026-06-14.md`, `…/arbor-ia-redesign-2026-06-14.md`; build plan `PPPPtherapy-/PPPPtherapy-/app/.design/arbor-ia/TASKS.md`.
- **Built + shipped to production** (3 commits, merged to `main` @ `f019b86`, pushed; live **https://arborprd-westeu.web.app**, verified home 200 / api 401 / fresh asset):
  - **Rhythm** — `app/src/rhythm/predict.ts` (pure, 8 tests): predicts today's friction/calm/wind-down windows from the family's own log; honest sparse-data state. On the new **Today** home.
  - **Daily Play** — `app/src/playbank/` (12 household-item activities + concern-aware selector, 9 tests): picks by band **+ recently-logged behavior**; card on Today + library under Grow.
  - **Ask-a-Specialist** — `app/src/consult/packet.ts` (pure, 8 tests) + `AskSpecialist.tsx`: warm handoff packet from the child's record, line-level redaction (Safety L3), Copy/Download export; send-to-expert stubbed Phase 2.
  - **IA redesign** — 7 sections → 6 task pillars (Today/Ask/My Child/Grow/Care/Academy) via reusable `HubTabs` (Development/Practice/Consult merges); `TAB_SECTION_FALLBACK` re-homes every demoted leaf — nothing deleted.
  - **a11y + Hebrew/RTL:** global `:focus-visible` covers keyboard; all new UI chrome wired through i18n en+he (verified live dir=rtl). Activity/packet *content* stays English (native review pending).
- **Quality:** tsc clean, 162 tests pass (25 new), verified live across all pillars EN+HE.
- **Open:** native Hebrew review of Daily Play content; Phase-2 backlog (Daily Play Courses, AI-generated activities, send-to-expert marketplace).

## Updates [2026-06-12] — Practice Studio shipped (Fall release, 10 features)

- **PRD:** `PAI/projects/arbor/PRDs/PRD_2026-06-12_speech-language-fall-release.md` — 10 features ported from Articulation Station / Speech Blubs / Otsimo / MITA, organized as 4 modules + the Development Copilot killer feature (connect-the-category, prescribe→signal wedge).
- **Built same day on `main` @ `8072745`, pushed + deployed to production** (arborprd-westeu.web.app verified: new bundle + all 5 chunks live, API 401 gate + rate limit up; CSP concern moot — helmet CSP is API-only, Hosting serves the SPA without CSP): new `app/src/practice/` engine (content banks + pure scoring `signals.ts`, 15 unit tests) + 5 views in `app/src/components/practice/` (SpeechCoach, MimicStudio, Missions, Adventures, DevelopmentCopilot). New 7th nav section "Practice Studio"; Development Dashboard under My Child. All sandbox-safe; audio/camera strictly on-device. tsc + 122 tests + prod build green; flows verified live in browser.
- **Key design decisions:** bands not "developmental age" numbers (clinical defensibility / EU-MDR); parent scoring is the universal floor (Web Speech API best-effort only); Development Score = practice *consistency*, never child ability; adventures record first-try answers only.
- **Open (PRD hypotheses):** H1 daily-habit retention gate (<20% families @3 missions/wk by day 30 = kill), H2 SLP interviews on the practice report, H3 recommendation-followed rate. Hebrew sound set + AI-generated adventures = fast follow.

Active facts only. Completed execution history → [[PAI/archive|PAI Archive]].

---

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
- **Master sequencing source of truth:** `PAI/projects/arbor/execution/arbor-master-sprint-plan-2026-06-02.md` (merges the A/K/D, H/E, and G backlogs; dedup map inside).
- **Parallel safety gate (does not wait for a sprint slot):** K-03 real crisis resources, K-01 semantic safety, K-02 review queue — beta with real families is blocked until these land.
- **Open decisions blocking work:** (1) voice — marketing headlines vs de-grandify; (2) beta paid? (gates Account Settings G-16); (3) aesthetic D-01 — warm paper vs dark cockpit.

## Updates [2026-05-30]

- Corrected stale/wrong memory: the local clone is **not** on a clean `main`. It is on branch `codex/arbor-v2-architecture-foundation` @ `42997e3`, 6 commits ahead of `origin/main`, dirty. The v2 architecture + Firebase auth + terraform/Cloud Run scaffold are here but **untracked/uncommitted and unmerged** — at risk of loss until committed. (Matches the 2026-05-28 handover note about switching to this branch.)
- `main` last verified canonical is still `04cc2c7` (10 routine plans). Earlier this session I wrote `05c2156`/"PR #7 merged" — that was unverified and wrong; removed.
- Verified the running app (`arbor-dev`, port 3000) is the React source under `app/src/`; the root-level `App.tsx`/`components/` paths assumed earlier do not exist — real source is `app/src/` (App.tsx, AuthContext.tsx, LoginPage.tsx, ai/, memory/, safety/, knowledge/, contracts/, server/, routes/).
- Built a standalone single-file demo `PAI/projects/arbor/html/arbor-app.html` (auth, multi-child profiles, conservative triage engine, guidance, timeline, 7-day tracking, dark mode, export) — a design/UX reference artifact, **not** the shipping app. Flagged Arbor surface sprawl (multiple HTML prototypes + the React app).
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

