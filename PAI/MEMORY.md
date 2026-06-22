# PAI Memory
Last updated: 2026-06-22

## Update [2026-06-22] — Arbor Marketing upgraded to a full VIRAL GROWTH ORG (+3 pods, loop rewired)

- **Not a rebuild — a surgical upgrade.** The marketing mesh was already mature (lead + ECD + content/seo/acquisition + critic-market + brand strategy + 30-day viral goal + autonomous loop). Filled the 3 real gaps that blocked "viral level," grounded in a 6-agent research+draft workflow (Duolingo/Cal AI short-form playbooks; IL/WhatsApp specifics flagged under-sourced):
  - **`arbor-creative`** — Viral Creative Producer: short-form video/motion/design (HeyGen/CapCut/Canva), hook-variant batches, the **generic animated child-as-hero** (never a real child's face — COPPA-safe + brand wedge). Owns *watchability*, not strategy/copy.
  - **`arbor-distribution`** — Distribution & Community: creators + ambassadors + WhatsApp class-group / IL-FB mega-group seeding + UGC challenges + the owned-channel queue. **Drafts all outbound; send to people/external communities = L3-gated**; own-channel queue autonomous.
  - **`arbor-insights`** — Viral & Market Intelligence: outside-in trend radar (growth-stage + rule-of-three, 48h window), micro-creator radar (10–25K), community listening, 5-dimension competitor scan, feature-request sourcing. Orchestrates ROS `research-agent`, borrows `arbor-critic-capability`. Observe-only.
- **Org flow now:** `arbor-insights` → `arbor-brand`+`arbor-content` → `arbor-creative` → `arbor-distribution` → `arbor-acquisition` → `arbor-critic-market` → loop. Method/cadence/thresholds: new **`mesh/marketing/VIRAL-ENGINE.md`**.
- **Loop rewired (same registered cron `0 5 ** 2,5`):** `/arbor-marketing-loop` is now INTEL→SENSE→FRAME→DESIGN→BUILD→VERIFY→**DISTRIBUTE**→LEARN — adds an arbor-insights Intel phase, opens BUILD to arbor-creative, adds a Distribute phase (arbor-distribution drafts owned-queue + gated creator/group seeds). No re-registration needed; edits to the workflow file apply on next fire. `node --check` passes.
- **Working backlog:** `MARKETING-BACKLOG.md §8` — 13 scored, owned AM- items (4 insights / 4 creative / 5 distribution). Drafts + playbooks build autonomously now; gated send/seed waits on the §0a critical-path unlocks (domain live, channels, `/join?ref=`).
- Files: `.claude/agents/arbor/arbor-{creative,distribution,insights}.md`; `mesh/marketing/{MESH,OPERATING-MODEL,VIRAL-ENGINE,MARKETING-BACKLOG}.md`; `/arbor-marketing-loop` workflow; `PAI/CLAUDE.md`.

## PM Grooming [2026-06-22] — first AP- promotion cycle, Wave PM-01-2026-06-22 ready

**arbor-pm ran a full backlog grooming cycle.** Sources: PRODUCT-BACKLOG.md (all Council Intake 2026-06-21 blocks), PRODUCT-COUNCIL.md, IMPROVEMENT-BACKLOG.md (CIL cycles 2026-06-21c + 2026-06-22), MARKETING-BACKLOG.md. Backlog-model and clinical-gate rules applied from BACKLOG-MODEL.md + PRODUCT-COUNCIL.md §4.

**Triaged:** 36 open candidates (CLI-01 through CLI-08, PHI-01 through PHI-10, DEM-001 through DEM-012, CIL-conv/lang/trust/market/capability batches, SA1–SA6 school-age clinical requirements, plus de-dupe of 5 root-cause clusters).

**Promoted to AP- ids (13 items):** AP-001 through AP-013 in the "PM Grooming — 2026-06-22" block appended to PRODUCT-BACKLOG.md. First AP- ids ever assigned to this queue.

**Next wave (safe + build-ready — hand to arbor-orchestrator as Wave PM-01-2026-06-22):** AP-004 (paywall price, score 11.25) → AP-007 (trust chip, 10.2) → AP-005 (JITAI i18n regression, 7.2) → AP-006 (post-checkout activation, 7.2) → AP-009 (citation schema, 7.2) → AP-010 (coach citations surface, 6.4) → AP-001 (label-leak guard, 6.0) → AP-002 (Competence Ladder, 4.0) → AP-013 (school-age track substantiated set, 4.3). **i18n.ts conflict** — AP-004 / AP-005 / AP-007 all write this file; orchestrator must sequence them or merge additions in one pass.

**Gated surfaces for Guy (4 promoted, 7 HELD):** AP-003 (child-data egress), AP-008 (clinical-peds soundness check), AP-011 (escalation copy re-review), AP-012 (honesty surface). HELD: CLI-07, CLI-02, CLI-03, PHI-09, DEM-007, DEM-009, DEM-010. Full gated list + unlock conditions in the grooming block.

**Clinical gate honest tally:** 9 items HELD by the clinical gate (DEM-002/003/009/012, PHI-10, CLI-03/04, DEM-005, PHI-02+07+05 briefing-template cluster). All holds are load-bearing; the gate is working correctly. DEM-003 + DEM-004 marketed to AM- (marketing scope). CLI-01 CLOSED (resolved by B0).

**Key unblocking levers (in priority order):** (1) CLI-07 corrected-age capture + display sign-off (Guy + arbor-safety) — unblocks DEM-002, DEM-003, PHI-10, CLI-02, CLI-03. (2) Brief-template clinical copy sign-off — unblocks PHI-02 + PHI-07 + PHI-05. (3) DEM-009 Rhythm-invitation reframe + first-run copy board pass — unblocks activation sprint. (4) Billing rails end-to-end test confirmed — unblocks DEM-007/008/010.

---

## Update [2026-06-22] — Arbor mesh rebuilt as a PRODUCT ORG + first Council wave (6 green, deploy deferred)

- **Org (CHARTER v2.0 / ROSTER v2.0):** the Arbor mesh is now a full multi-agent **product organization** — a standing **Advisory Board** (`arbor-advisor` product-philosophy = advisory voice, no veto + a **Clinical Board** `arbor-clinical-lead`/`-peds`/`-slp`/`-psych` = **veto on clinical soundness + any developmental/medical/effect-size claim**, co-held w/ `arbor-safety`) → a **Product Council** intake (`/arbor-product-council`) fusing Advisory + Clinical + Marketing feature-requests + CIL → one scored `PRODUCT-BACKLOG.md` → `arbor-orchestrator` → pods + DevSecOps + Marketing. Spec: `mesh/teams/advisory.md`, `mesh/PRODUCT-COUNCIL.md`. 🔒 **Branding firewall (Guy, non-negotiable):** the Peterson influence is **back-end inspiration ONLY** — never branded/user-facing, never a clinician-endorsement claim (CHARTER §3 p11).
- **4 autonomous loops now LIVE** on the `scheduled-tasks` MCP (verified): `arbor-cil-eval` (0 3,15 ***), `arbor-cil-build` (0 4 ** 1,4), `arbor-product-council` (0 6 ** 0 Sun), `arbor-marketing-loop` (0 5 ** 2,5). The marketing loop was doc-claimed-live but had never been registered until now. None merge/deploy.
- **First Council run (real):** 30 candidates → 4 safe + 26 gated; clinical gate bit (caught a corrected-age monitoring bug, retired CDC thresholds, an unsubstantiated "richer than telehealth" claim). Output in `PRODUCT-BACKLOG.md` "Council Intake — 2026-06-21"; clinical substantiation packet `mesh/improvement/CLINICAL-SIGNOFF-2026-06-21.md`.
- **6 items built to GREEN** on worktree branch `claude/council-wave-1` (CI-13/06/12/07/08/05) — full gate green on the REAL `origin/main` (649 tests, 0 fail). **NOT deployed.** Deploy was attempted by hand, hit blind-100%-to-`main` + a moving `main` (concurrent agents) + no feature/claim-level gating → **Guy redirected: build a real release cycle as a capability, don't hand-deploy.** Filed as **CoS ROS-BACKLOG Theme O — Release engineering (DevOps under CoS)**. Ship the 6 items THROUGH that pipeline once it exists.
- Full detail: `mesh/MEMORY.md` entries `[2026-06-21n/o]`.

## Marketing loop cycle [2026-06-21] — close-of-cycle summary

**Sensed (CIL-market findings this cycle):** HE landing heading register broken (Frank Ruhl Libre absent); EN H1 generic (fails Arbor Bar first-line/memory tests); OG image is square logo (WhatsApp near-invisible); llms.txt/sitemap carry wrong Firebase host (AEO blocked until domain live); no social proof above fold; ILS pricing absent on HE landing; activation path to first value unguaranteed (<60s Aha); no Duolingo/Khan literacy counter-narrative on any surface. 7 gated funnel findings remain OPEN (see MARKETING-BACKLOG.md §3 + §6).

**Published to owned organic surfaces (auto-publish, no-confirmation):** CIL-market-he-landing-missing-frank-ruhl-font — Frank Ruhl Libre import + --serif token + h1-h4 weight-700 applied to `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-he.html` (lines 111 / 168-169 / 693-694 / 816-817 / 824). arbor-brand ECD gate PASS (all 8 Arbor Bar tests). arbor-safety gate PASS (typography-only; zero new clinical/effect-size copy; no child data). File is publish-ready. **Firebase prod push HELD — Level 3 deploy gate: Guy or arbor-orchestrator must authorize `firebase deploy` before this reaches arborprd-westeu.web.app. Pre-deploy check: confirm Frank Ruhl Libre renders on HE headings in prod.**

**Feature-requests handed to product:** 10 capability items from CIL competitor scan written to MARKETING-BACKLOG.md §5 and flagged HANDED TO PRODUCT-BACKLOG.md + IMPROVEMENT-BACKLOG.md (2026-06-21): CIL-capability-fcm-background-push · CIL-capability-proactive-monitoring-alerts · CIL-capability-physical-growth-tracking · CIL-capability-live-expert-booking · CIL-capability-multi-child-family-dashboard · CIL-capability-screen-time-controls · CIL-capability-infant-age-months-input (correctness bug, gated schema change) · CIL-capability-parent-coach-community · CIL-capability-ios-android-widgets · CIL-capability-literacy-marketing-positioning. Marketing retains counter-narrative ownership; product pods own the builds.

**Held for Guy (T3/T4/T5 — do not auto-execute):** (1) Firebase prod push of HE font fix — L3 confirm required before deploy. (2) arborparentingapp.com DNS/Firebase wiring — currently resolves to GoDaddy squatter page; L5 brand-risk; no viral asset ships pointing at this domain until confirmed live. (3) ILS price point confirmation (suggested Free / ₪49/mo Plus / ₪75/mo Family, annual ₪449/₪690) — L3 Guy approve before HE pricing copy ships. (4) IL creator wave-1 fees €800-1,500 — L4. (5) Paid amplification €2,200 Meta + €500 TikTok + €300 retargeting — L4, gated on day-7 K ≥ 0.3. (6) Email capture / waitlist — L3; arbor-safety consent-UX review required first.

---

## Updates [2026-06-21] — GOAL set: Arbor viral ignition in 30 days (IL) + the sprint backlog

- **Goal (`mesh/marketing/GOAL-viral-30d.md`):** light a self-feeding viral loop in the Israel beachhead by **2026-07-21**, proven with real numbers. Honest per G1 — *ignition*, not a guaranteed-K≥1-on-a-date claim. Win = G-1 loop live + K on a daily dashboard · G-2 K≥0.5→1.0 · G-3 ~5k IL installs ≥40% activated · G-4 ≥1 breakout >100k views + hero artifact shipped. North star for the marketing mesh + the `/arbor-marketing-loop` until the deadline.
- **Big idea (multi-agent build — ECD + 3 pods):** *"הילד שלך — ביד יציבה / Your Child, Steady"*; breakout film *"שנה שלמה / The Whole Year"* (2am hook → the record talks → Growth Card hero reveal); hero share artifact = the monthly **Growth Card** (HeroAvatar, never a real face). Lane plans in `marketing/assets/arbor-israel-{viral-campaign-brief, growth-engine-30d, viral-content-calendar-30d}.md`; consolidated week-by-week sprint = `MARKETING-BACKLOG.md` §0.
- **K honesty (G1):** K = invite-rate × conversion-per-invite; creator-seeded installs excluded from organic K; no blended-K. Engine = WhatsApp class-groups + FB mega-groups via **ambassador-first seeding** (not link-drops), IG/TikTok HE amplify.
- **🔴 Critical path — Week-0 unlocks:** ✅ **U1 domain `arborparentingapp.com` bought 2026-06-21** (left: Firebase custom-domain wiring + deploy) · ✅ **U4 Instagram @arborchilddevelopment created** (left: TikTok/YT/FB) · 🔴 U2 referral grant + `/join?ref=` (P0-2, L4 — resolves at arborparentingapp.com/join) · U3 share export (P0-3, L4) · U5 Double-Aha onboarding (P0-6, product) · U6 paid spend ~€525 wk1 + ~€2.1k amplification (L4). Identity = `mesh/marketing/CHANNELS.md`. Marketing specs the loop; product pods build the plumbing.

## Updates [2026-06-21] — Arbor Marketing elevated to a billion-dollar-brand operation + the brand spine

- **Why:** marketing output was reading generic — not capturing Arbor's essence (it's *3–4 top products in one*). Fix = a real strategic spine, not more machinery.
- **The spine — `mesh/marketing/BRAND-STRATEGY.md`** (the bible; synthesized from a 3-strategist panel): **essence** = *the steady hand that remembers your child* (Arbor's soul is **being known**); **category** = **Longitudinal Child Intelligence / the developmental OS** (never "a parenting app"); **enemy** = parenting amnesia (2am fear-Google · the five-app graveyard · the cold-start expert · the colonizing companion bot); **convergence** = **four category leaders fused on one parent-owned record** — Daily Play>Lovevery/Kinedu · Rhythm>Huckleberry · Ask-a-Specialist>Cleo/Cooper/Maven · Child Memory (the moat). ~€35–65/mo stack → one €12.99/€19.99 product none of the four can become. One-liner: *"Every parenting app gives you content. Arbor actually knows my kid."* + messaging architecture, proof system (mechanism-cited, show-the-real-product, trust-as-proof), archetype (senior clinician-mentor), verbal identity (owned lexicon + banned-word list, native HE), the manifesto, and **the Arbor Bar** (8 category+craft ship tests).
- **New role — `arbor-brand` (ECD):** brand strategist + creative director; owns the bible, writes flagship craft, **holds the veto on anything generic/off-essence**. Added to the mesh roster + the autonomous loop's VERIFY (ECD gate, then `arbor-safety`).
- **Wired through:** `MESH.md` mission+gate, `OPERATING-MODEL.md`, `MARKETING-BACKLOG.md` header, `/arbor-marketing-loop` workflow (FRAME + BUILD against the spine, ECD gate), `arbor-marketing-lead`, and this file. **Product positioning to use everywhere:** the convergence ("4 products in one, on one record"), best-in-market by beating each incumbent at its own game using the memory they lack.

## Updates [2026-06-21] — Arbor Continuous Improvement Loop (CIL) designed + scaffolded

- Built the **autonomous self-improvement loop** for Arbor (the eval half of the Agent Mesh): a critic panel (IA/UX, language+Hebrew/RTL, bugs, capability-vs-market, marketing, + DevSecOps audit) inspects the live app, `arbor-evaluator` scores + **adversarially verifies** findings into `mesh/improvement/IMPROVEMENT-BACKLOG.md`, then `arbor-orchestrator` builds the top `safe` items **to green on a branch** and the critics **re-confirm** the fix.
- **Autonomy = find + fix-to-green-on-branch; merge+deploy stay human.** Safety/consent/billing/image-gen-cost/child-data = `gated`, never auto-built. Cadence = nightly eval + weekly build. Driver = workflow `/arbor-improve` (`.claude/workflows/arbor-improve.workflow.js`); crons specced (SCHEDULED-LOOPS.md) but **not live until Guy confirms**. Docs: `mesh/improvement/`; CHARTER §3.6 now sanctions it. No live run yet.

## Updates [2026-06-21] - Arbor Academy + Practice visual/game engine live

- **Production shipped:** Firebase Hosting now serves Arbor build `index-C1t1FsRy.js` with service worker stamp `arbor-shell-mqn1e37w-olwyu4`; Cloud Run API revision `arbor-api-00072-bdb` serves the upgraded Academy story prompt. Verified live chunks include `HeroJourneyTab-Dr8UoCjA.js` with the Story Engine and `GameScenePanel-oLJxtILB.js` with the Mission Engine.
- **What changed:** Practice game interiors now get a visible next-gen Mission Engine layer (foundation image + avatar scene, archetype, conflict, action, real-world bridge, viral win loop); hidden/deep-linked Missions also gets the new game-stage treatment. Academy stories now get a Story Engine layer, versioned visual foundations, stronger avatar embedding, and a stricter read-aloud prompt to avoid generic moral summaries.
- **Cache fix:** visual foundations now use a `nextgen-20260621-01` asset version, and the service worker is network-first for `/assets/` and `/visuals/` so production refreshes game/story visuals instead of holding stale foundations.

## Updates [2026-06-17] — Arbor WAF migration: blueprint + Wave 0 executed

- **What:** ran two autonomous multi-agent workflows to harden Arbor to top-tier Well-Architected (maturity 2.8/5 → target) for the **NL + IL** launch markets — gradual, cost-efficient, conflict-aware. Plan doc: `PAI/projects/parenting-os-plugin/arbor-waf-migration-plan.md`. Full artifacts in the Arbor repo `PPPPtherapy-/PPPPtherapy-/docs/architecture/migration-2026-06-17/`.
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
- Status: **Active | Live in production at https://arborprd-westeu.web.app (Firebase Hosting + Cloud Run); private beta. v2 architecture is long since on `main` and deployed — see the dated update log above for current build state. The "local unmerged branch / AI disabled / gcloud missing" notes in the 2026-06-03 and earlier blocks below are historical and superseded.**
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

## Product Council cycle [2026-06-21] — full council intake → PRODUCT-BACKLOG
4 streams fused (philosophy 10 / clinical 8 / demand 12 / cil top findings). Deduped 5 root-cause clusters, scored priority=(reach×impact×confidence×strategic_fit)÷effort (aligned=1.0, tension=0.6), wrote `## Council Intake — 2026-06-21 (full council)` to `PAI/projects/parenting-os-plugin/PRODUCT-BACKLOG.md` (top 12 + parked tail; append-only, canonical body untouched). **Top build-ready SAFE for the orchestrator:** CI-13 (wire screenModelOutput into /analyze-behavior + inline co-reg — verified label-leak hole), CI-06 schema half (PlayActivity citations), CI-12 (cosmetics no-dark-pattern failing test = PHI-04), CI-07 (self-retiring Competence Ladder). **Gated → Guy:** CI-04 red-flag layer (board HELD — fix 16m→18m threshold, build loss-of-skills detector, dep corrected-age), CI-02/03 AAP corrected-age sign-off, CI-01 weekly-brief channel, CI-09 FCM JITAI consent, CI-10/11 referral reward+billing, DEM-005 booking HELD, DEM-010 fake-slot scarcity. Clinical gate binding (CI-03/04/CLI-04 HELD on claims).
