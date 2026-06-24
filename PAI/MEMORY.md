# PAI Memory
Last updated: 2026-06-24

## Update [2026-06-22] — Marketing program: execute+verify goal set; deploy path mapped (NOT shipped)

- **Master goal doc:** `mesh/marketing/GOAL-marketing-program-2026-06-22.md` — tracks all 7 session objectives with verification verdicts. A 5-agent execute+verify workflow ran: **audit verdict = STRONG PASS on all 7** (real, coherent, honest; deployment-gates held, no over-claims).
- **Executed this pass:** (1) NL/DE/FR flagship copy transcreated (AM-L4) → `marketing/assets/arbor-nl-de-fr-transcreation-2026-06-22.md` (drafts, awaiting native review per market); (2) fixed stale "four-products-on-one-record" strings that survived in the **live loop workflow** (lines 89/105) + `arbor-brand.md` — they were re-injecting the killed frame into the loop's prompts; (3) locale matrix NL/DE/FR → "draft done, awaiting native review."
- **DEPLOY path mapped (Path A — key correction):** the Arbor app is a **NESTED separate git repo** (`PPPPtherapy-/PPPPtherapy-/`) — that's why the ROS-root view showed "gitignored/not-on-main." Inside it the landing pages ARE committed source-of-truth at `app/public/marketing/arbor-marketing-landing-page-{en,he,nl,de,fr}.html` (hand-maintained; `.md` + `enrich-marketing-seo.mjs` are NOT the source/build). Deploy = edit served HTML → push to the **app repo's main** → `.github/workflows/arbor-deploy.yml` (lint+test only, **no canary** = the blind-100%-to-main path) → `firebase deploy` (project `arborprd-westeu`; arborparentingapp.com wired). **⚠️ canonical/OG still point at arborprd-westeu.web.app (brand-domain switch behind main) — align before shipping.**
- **NOT deployed (by design):** AM-NEW-0 (six-surface landing) isn't built into the SERVED files yet (the earlier EN one-liner edit was the ROS prototype, not the app file); native-human sign-off pending. Safe go-live = build into served files → PR on the app repo → **Guy merges = prod-promote** (never hand-push main).

## Update [2026-06-22] — Localization fixed: transcreation pod + native-voice gate (Hebrew was bad)

- **Guy's defect:** `arbor-content`'s Hebrew read **translated/literal, not native** — below the bar — and we still need 5 more languages. Two root fixes:
  - **`arbor-content` sharpened → message-first** (best marketing craft, concept-led; owns the master message in EN + native HE; **never literal-translates**; hands non-source markets off with a transcreation brief).
  - **New pod `arbor-localization`** (Transcreation & Localization lead) + standard **`mesh/marketing/LOCALIZATION.md`**: TRANSCREATES (re-writes the idea natively per market, never translates), owns the **native-voice gate** (8 tests incl. no-calque + native-human sign-off for publish), the **locale matrix**, and RTL/i18n. Wired into the mesh DoD + OPERATING-MODEL VERIFY step 6 — **translated-feeling copy does not ship.**
- **Locale matrix:** he-IL (LIVE, needs native re-do) · en (source) · nl-NL (anchor) · **+3 TBD** — Guy must confirm the **5 rollout markets/languages** (AM-L2, gated). Candidates: German, French (BE), Arabic (IL)/Spanish.
- **Honest reality:** the agent transcreates to the bar + self-checks, but **a native-human reviewer per market is the final publish gate** — best-in-class native copy in 6 languages is not a pure-AI guarantee.
- **Backlog (marketing-owned, MARKETING-BACKLOG §10):** AM-L1 re-transcreate HE to native (P0) · AM-L2 lock matrix (Guy) · AM-L3 native-voice gate standing (done in docs) · AM-L4 transcreate flagship assets per locale. Files: `.claude/agents/arbor/arbor-localization.md` + sharpened `arbor-content.md`; `mesh/marketing/LOCALIZATION.md`; MESH/OPERATING-MODEL/PAI CLAUDE updated.

## Update [2026-06-22] — Positioning fix: "four products in one" → honest six-surface child OS

- **Guy's critique:** marketing undersold Arbor as "four products in one" (seen on the landing page) — omitting three whole pillars. Arbor's REAL IA is **six surfaces on one parent-owned record**: Today (Rhythm+Daily Play) · Ask (Coach+Specialist) · My Child (the record+Development) · **Grow** (Practice Studio + Growth Plans) · **Care** (Consult/Care Team/Trusted Sharing — "Arbor Care") · **Academy** (Masterclasses/Story Journeys/Family Formation).
- **3-agent workflow (insights → brand → lead) →** new living **`mesh/marketing/CAPABILITY-MAP.md`** (arbor-insights-owned): per-surface competitor benchmark + 12 scored feature-requests + honest **deployment gates**.
- **Strategic call (locked):** ONE product, SIX surfaces — **not** sub-brands (would collapse the one-record value). Wedge still leads ("Arbor actually knows my kid"); breadth proves the moat. Don't become a generic "everything app."
- **Deployment gates (bind what ships):** Arbor Care = warm-handoff, NOT a live marketplace (booking gated, FR-5); Practice "writes to the record" hook gates on the feedback loop verified live (FR-10); no baby-0–2 marketing until the infant-age-in-YEARS bug fixed (FR-7, P0); ambient capture ≤3 taps (FR-3, P0); no "screens for" without clinical sign-off.
- **Applied:** BRAND-STRATEGY §3/§5/§10 rewritten; the DRY "four category leaders" string killed across MESH/BACKLOG/GOAL/PAI CLAUDE×2; landing EN one-liner corrected. MARKETING-BACKLOG §9 = FR handoff to product + six-pillar viral content engine (AM-NEW-0..9); convergence carousel (AM-NEW-1) = highest-leverage move; full landing rebuild + HE parity = AM-NEW-0 (P0, L3).
- **[2026-06-22] Academy two-sided correction (Guy):** Academy is **child AND parent** (Peterson/Playbank backlog), and the **KIDS' Academy is the designed VIRAL engine** — I'd wrongly flattened it to parent-learning. Kids Academy = **Story Journeys** (child becomes the HERO of virtue stories; earned virtues write to the record) → **Hero Comic share** (the kid-hero viral payload; child = acquisition angle, parent shares; stylized avatar never a real face), vs Khan Kids/Duolingo ABC. This = one of Arbor's **two viral languages** (kid-hero=acquisition/Hero-Comic · proud-parent=retention/Growth-Card). Fixed in CAPABILITY-MAP Pillar 6 (6a/6b), BRAND-STRATEGY §3+§5, VIRAL-ENGINE; +FR-13 (story depth/virtue-fix) +**FR-14 Hero-Comic share loop = P0 viral**, +AM-NEW-9 kid-hero pillar. Honest gate: Parent Masterclasses mostly ComingSoon; Hero Comic share loop unbuilt.
- **[2026-06-22] Handed to PRODUCT for execution (clear instructions):** all 14 FRs written into `mesh/PRODUCT-BACKLOG.md` as **"Council Intake — 2026-06-22 (Marketing Capability-Map → Product, FR-1…FR-14)"** with what-to-build · acceptance · owner pod · gate, prioritised. **P0s:** FR-7 infant-months (arbor-growth+memory, gated), FR-3 ambient capture (arbor-native, safe), FR-14 Hero-Comic share loop (arbor-avatar+api, gated). Awaiting Council/PM `AP-` promotion. Marketing execution plan with clear ordered instructions = MARKETING-BACKLOG §9c (AM-NEW-1 carousel first → kid-hero → landing rebuild).

## PRD [2026-06-22] — AP-007 Trust chip at onboarding hand-over (Wave PM-01)

**What we decided to build:** A single-line trust chip component in OnboardingFlow at the first child-data capture step (name/age/concern), rendering three specific trust facts about Arbor's data model: "Private by default · parent-approved memory · never used to train AI." Links to the existing privacy/safety view. Mirrors in the child profile first-capture field. EN + HE/RTL.

**Why:** The strong privacy statement lives only on AvatarCreator.tsx (behind a paywall feature a new parent never reaches). The first child-data hand-over screen carries zero trust signal. CIL trust-lens score 22 (cycle 2026-06-22). Structurally, the parent who abandons at this step never reaches the paywall (AP-004) or the post-checkout activation sheet (AP-006) — this is the gate the rest of Wave PM-01 depends on.

**Why AP-007 over AP-004 for this PRD:** AP-004 is a confirmed revenue bug with a Level 3 price-confirmation gate pending Guy — its code change is trivial and its constraint is a founder decision, not a product-design problem. AP-007 is a trust-architecture problem at the activation moment, with richer discovery and UX design work that justifies a full PRD.

**Metric:** Onboarding step-completion rate at the child-data capture step — stable or improved at 14-day read. Instrumentation: step_viewed / step_completed / trust_chip_link_tapped events, locale split.

**Gate conditions:** arbor-safety confirms "never used to train AI" is technically accurate; arbor-brand confirms copy passes the Arbor Bar; arbor-content completes native Hebrew review; linked privacy/safety view confirmed at a stable route.

**PRD location:** `PAI/projects/arbor/mesh/prds/PRD_2026-06-22_AP-007.md`

---

## [2026-06-22] Voice-of-parent function stood up — zero real signals confirmed

**Finding:** Full repo scan confirms Arbor has zero real parent signals in the system. No App Store or Play reviews (apps not yet published), no in-app feedback capture, no support threads, no interview notes, no NPS, no analytics integration. Every backlog priority is grounded in code inspection, heuristics, and competitor benchmarking — not validated by a real parent.

**Action taken:** `arbor-ux` created the standing voice-of-parent function at `mesh/teams/voice-of-parent.md`. Pointer added to `mesh/teams/product.md`.

**What the doc specifies:** (1) honest signal inventory — zero across every source; (2) four intake mechanisms ranked by time-to-first-signal (in-app prompt fastest, then store reviews post-publish, then support inbox, then interviews); (3) a 5-parent first-sprint in 2 weeks (interview script included, 5-slot recruit profile, riskClass: safe for the prompt, Level 4 gate on interview budget); (4) a weekly VoP Pulse format that feeds the Product Council before each session.

**Gated actions required from Guy:** (a) approve ~₪750 interview budget (Level 4 financial), (b) approve any outbound WhatsApp/Facebook group recruit message before it sends (outbound to people = gated). The in-app feedback prompt needs no Guy approval — it is riskClass: safe and goes via the normal `AP-` ticket route.

## Update [2026-06-22] — Arbor Marketing upgraded to a full VIRAL GROWTH ORG (+3 pods, loop rewired)

- **Not a rebuild — a surgical upgrade.** The marketing mesh was already mature (lead + ECD + content/seo/acquisition + critic-market + brand strategy + 30-day viral goal + autonomous loop). Filled the 3 real gaps that blocked "viral level," grounded in a 6-agent research+draft workflow (Duolingo/Cal AI short-form playbooks; IL/WhatsApp specifics flagged under-sourced):
  - **`arbor-creative`** — Viral Creative Producer: short-form video/motion/design (HeyGen/CapCut/Canva), hook-variant batches, the **generic animated child-as-hero** (never a real child's face — COPPA-safe + brand wedge). Owns *watchability*, not strategy/copy.
  - **`arbor-distribution`** — Distribution & Community: creators + ambassadors + WhatsApp class-group / IL-FB mega-group seeding + UGC challenges + the owned-channel queue. **Drafts all outbound; send to people/external communities = L3-gated**; own-channel queue autonomous.
  - **`arbor-insights`** — Viral & Market Intelligence: outside-in trend radar (growth-stage + rule-of-three, 48h window), micro-creator radar (10–25K), community listening, 5-dimension competitor scan, feature-request sourcing. Orchestrates ROS `research-agent`, borrows `arbor-critic-capability`. Observe-only.
- **Org flow now:** `arbor-insights` → `arbor-brand`+`arbor-content` → `arbor-creative` → `arbor-distribution` → `arbor-acquisition` → `arbor-critic-market` → loop. Method/cadence/thresholds: new **`mesh/marketing/VIRAL-ENGINE.md`**.
- **Loop rewired (same registered cron `0 5 ** 2,5`):** `/arbor-marketing-loop` is now INTEL→SENSE→FRAME→DESIGN→BUILD→VERIFY→**DISTRIBUTE**→LEARN — adds an arbor-insights Intel phase, opens BUILD to arbor-creative, adds a Distribute phase (arbor-distribution drafts owned-queue + gated creator/group seeds). No re-registration needed; edits to the workflow file apply on next fire. `node --check` passes.
- **Working backlog:** `MARKETING-BACKLOG.md §8` — 13 scored, owned AM- items (4 insights / 4 creative / 5 distribution). Drafts + playbooks build autonomously now; gated send/seed waits on the §0a critical-path unlocks (domain live, channels, `/join?ref=`).
- Files: `.claude/agents/arbor/arbor-{creative,distribution,insights}.md`; `mesh/marketing/{MESH,OPERATING-MODEL,VIRAL-ENGINE,MARKETING-BACKLOG}.md`; `/arbor-marketing-loop` workflow; `PAI/CLAUDE.md`.

## PM Grooming [2026-06-22] — reality-check batch promoted (AP-014…AP-021); AP-006 retracted

**arbor-pm ran the reality-check promotion pass** (source: `CoS/reviews/Arbor-Reality-Check_2026-06-22.md`, 4-lens verified findings). 8 new AP- items added; 4 CIL items marked promoted/dropped; 1 false finding confirmed and retracted.

**Already-promoted findings (confirmed, no duplication):** Paywall no price → AP-004. Onboarding age years → AP-008. CIL-lang-jitai-nudge → AP-005. CIL-trust-posture → AP-007.

**Dropped false finding:** `CIL-conv-no-post-checkout-activation` / AP-006 — **retracted** (`App.tsx` already handles `?billing=success`, confirmed by adversarial verify). CIL marked `dropped: verified-false`; AP-006 entry retired in the canonical queue.

**8 new AP- items promoted (AP-014…AP-021):**
- AP-014 (score 9.5) — 3 ComingSoon dead sections removed / Appointments wired (arbor-ux + arbor-design, safe)
- AP-015 (score 3.83) — imagery layer on parent surfaces (arbor-ux + arbor-design, safe)
- AP-016 (score 23.75) — mobile hero overflow clamped / CTAs above fold (arbor-design, safe — **#1 UX fix, 1-rule CSS**)
- AP-017 (score 3.24) — type scale sweep in app interior, residual gap after `3c5075e` partial fix (arbor-design, safe)
- AP-018 (score 2.89) — dark mode token layer + system-preference support (arbor-design, safe; sequence after AP-019)
- AP-019 (score 3.6) — CSS override arch: replace 304 hardcoded hex + !important hack with token layer (arbor-design, safe; prerequisite for AP-017/018/020)
- AP-020 (score 3.06) — palette split alignment: app slate-green ≠ landing navy-teal (arbor-design + arbor-brand, safe; after AP-019)
- AP-021 (score 23.75) — wire /healthz + smoke + canary into deploy gate / OPS-A2/A3/B3 (arbor-release, safe — **tied #1, pipeline integrity**)

**No gated items in this batch.** All 8 are `riskClass: safe`.

**Updated next-wave board:** AP-016 + AP-021 (tied score 23.75) → AP-014 → AP-004 → AP-007 → AP-019 → AP-015. Design items AP-017/018/020 sequenced after AP-019.

**Design sequencing constraint:** AP-019 (hex sweep) must land before AP-017/018/020. AP-021 must be built off `origin/main` (local main is 94 commits behind).

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

**Published to owned organic surfaces (auto-publish, no-confirmation):** CIL-market-he-landing-missing-frank-ruhl-font — Frank Ruhl Libre import + --serif token + h1-h4 weight-700 applied to `PAI/projects/arbor/html/arbor-marketing-landing-page-he.html` (lines 111 / 168-169 / 693-694 / 816-817 / 824). arbor-brand ECD gate PASS (all 8 Arbor Bar tests). arbor-safety gate PASS (typography-only; zero new clinical/effect-size copy; no child data). File is publish-ready. **Firebase prod push HELD — Level 3 deploy gate: Guy or arbor-orchestrator must authorize `firebase deploy` before this reaches arborprd-westeu.web.app. Pre-deploy check: confirm Frank Ruhl Libre renders on HE headings in prod.**

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

### Arbor — AI parenting / child-development platform (product company #1)
- **Status: LIVE in production** — prod on `arborparentingapp.com` (Firebase Hosting custom domain + Cloud Run); private beta. Billing rails (RevenueCat) configured; end-to-end test purchase pending.
- **The live app** = the React app in the **nested Arbor repo** (`PPPPtherapy-/.../app`, v2 component architecture on `main`), **not** the HTML prototypes in `PAI/projects/arbor/html/` (legacy). Repo boundary + the 3 Arbor locations + the reserved `PAI/arbor/` clone home: `/00_System/repo-boundaries.md`.
- **Repo:** `github.com/guyrubin/PPPPtherapy-` (= Arbor). Stack: React 19 + Vite + Express + Gemini/Vertex + Firebase.
- **Active build state** (branches green-but-unpushed, open gates): see `PAI/projects/arbor/mesh/MEMORY.md` → "Current State". **Product org / backlog / PRDs / marketing / funding:** `PAI/projects/arbor/`.
- Positioning (canonical spine): `PAI/projects/arbor/mesh/marketing/BRAND-STRATEGY.md`.

## Active decisions

- [Decision] Arbor is a parent question → child memory → safety triage → action plan → professional handoff workflow, not a generic chatbot or expert marketplace. | 2026-05-15 | Rationale: trust + longitudinal developmental intelligence is the moat.
- [Decision] Treat the repo as private-beta, non-diagnostic parent-support only; production hardening (child-data privacy, safety escalation, expert governance) before any public launch. | 2026-05-22

## Open questions

- [Question] First parent-test wedge: behavior/routines, speech/language, emotional regulation, school readiness, or autism/ADHD concerns? | Blocking: scenario prioritization
- [Question] Beta market: Netherlands-first, Israel-first, or dual-track (Israel content/expert engine + Netherlands institutional pilot)? | Blocking: GTM sequencing

## Product Council cycle [2026-06-21] — full council intake → PRODUCT-BACKLOG
4 streams fused (philosophy 10 / clinical 8 / demand 12 / cil top findings). Deduped 5 root-cause clusters, scored priority=(reach×impact×confidence×strategic_fit)÷effort (aligned=1.0, tension=0.6), wrote `## Council Intake — 2026-06-21 (full council)` to `PAI/projects/arbor/PRODUCT-BACKLOG.md` (top 12 + parked tail; append-only, canonical body untouched). **Top build-ready SAFE for the orchestrator:** CI-13 (wire screenModelOutput into /analyze-behavior + inline co-reg — verified label-leak hole), CI-06 schema half (PlayActivity citations), CI-12 (cosmetics no-dark-pattern failing test = PHI-04), CI-07 (self-retiring Competence Ladder). **Gated → Guy:** CI-04 red-flag layer (board HELD — fix 16m→18m threshold, build loss-of-skills detector, dep corrected-age), CI-02/03 AAP corrected-age sign-off, CI-01 weekly-brief channel, CI-09 FCM JITAI consent, CI-10/11 referral reward+billing, DEM-005 booking HELD, DEM-010 fake-slot scarcity. Clinical gate binding (CI-03/04/CLI-04 HELD on claims).
