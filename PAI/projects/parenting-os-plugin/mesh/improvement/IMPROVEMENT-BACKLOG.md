# Arbor Improvement Backlog (CIL-maintained)

**Auto-maintained by the [Continuous Improvement Loop](CIL.md).** The critic panel writes verified, scored findings here each cycle; the `arbor-orchestrator` burns down the top `safe` items in the weekly build wave (alongside the human-authored [EXECUTION-BACKLOG.md](../../EXECUTION-BACKLOG.md)). Do not hand-edit scores — re-run the loop. Humans may re-prioritize by adding a `pin` note or moving an item to EXECUTION-BACKLOG.

**Format:** newest cycle on top. Each finding: `score · id · lens · title · ownerPod · effort · riskClass · status`. Status = `open → building → shipped → confirmed` (or `dropped`, with reason).

Scoring: `(severity × userImpact × confidence) ÷ effort × 4` — see [CRITICS.md](CRITICS.md) §2.

> **Feeder role (release-engineering, 2026-06-22):** this backlog is a **feeder**, not a shippable queue. A finding is a *candidate*; it ships only after being **promoted into a canonical backlog** — Product (`AP-` in [mesh/PRODUCT-BACKLOG.md](../PRODUCT-BACKLOG.md)) or Marketing (`AM-` in [marketing/MARKETING-BACKLOG.md](../marketing/MARKETING-BACKLOG.md)) — where it takes a stable id that **back-references** its `CIL-…` origin. Mark a promoted finding `promoted → AP-xxx` here; never track the same item live in two places. Model: [BACKLOG-MODEL.md](../../../../00_System/release-engineering/BACKLOG-MODEL.md).

---

## CLINICAL REQUIREMENTS — Baby & toddler 0–24m track (2026-06-22) → for the Product Council

> **Clinical Board originated the gated baby items (B2 / B3 / B4 + surveillance refinement) as cited clinical requirements** → [`BABY-CLINICAL-REQUIREMENTS-2026-06-22.md`](BABY-CLINICAL-REQUIREMENTS-2026-06-22.md). B0/B1 already shipped + **ratified sound** (CDC-2022 2–24m + ASHA + AAP preterm correction). **Substantiated → ships in user copy (mechanism-cited):** B2 longitudinal trend + "for your pediatrician" framing, B3 neutral parent logging + own-pattern reflection, B4 normal-variability reassurance, surveillance-refinement Act-Early referral prompts + ASHA communication/hearing cues. **Gated → HELD (EU-MDR read / consent):** B2 percentile-as-result + any growth verdict (underweight/failure-to-thrive/faltering) + centile-crossing alarm; B3 norm-comparison / sleep-training / feeding-or-sleep-disorder inference; B4 any Wonder-Weeks-branded leap calendar or week-N prediction. **Two recommend-VETO triggers standing:** (1) B4 fixed leap-calendar / "Wonder Weeks" branding; (2) whole-band parent-mediated guardrail — pathologizing normal infant variation, parent-blame attachment narrative, "your baby should…" prescription, or kid-companion drift. **Two carry-forward gifts:** add **regression detection** to `monitoring.ts` (CDC "loss of skills = act early", `safe`); B2 needs a **separate preterm growth-correction param** (≠ the 24-month milestone ceiling). **Council action:** promote the substantiated set to `AP-` build-ready; surface gated/HELD as Guy/EU-MDR/consent decisions. No clinical veto outstanding.

---

## CLINICAL REQUIREMENTS — School-age 7–10 track (2026-06-22) → for the Product Council

> **Clinical Board originated SA1–SA6 (the missing 7–10 band) as cited clinical requirements** → [`SCHOOLAGE-CLINICAL-REQUIREMENTS-2026-06-22.md`](SCHOOLAGE-CLINICAL-REQUIREMENTS-2026-06-22.md). Surveillance-not-diagnosis; CDC stops at 5 so sourced from **AAP Bright Futures / ASHA / Diamond 2013 / Hasbrouck & Tindal ORF / Erikson-Selman-Bowlby**. **Substantiated → ships in user copy (mechanism-cited):** SA1 six-domain surveillance, SA2 reading-behavior signals, SA4 numeracy sequence, SA5 Diamond-cited EF/homework scaffolding, SA6 SR1/SR2/SR4 developmental frames. **Gated → HELD (EU-MDR read + lead string sign-off):** SA2 WCPM-percentile-as-score, any dyslexia/math-delay/ADHD label, any EF/math "improves" efficacy claim, the whole SA6 SR5–SR7 anxiety/withdrawal/mood cluster. **Recommend-VETO trigger standing:** any SA6 design that infers the child's internal state, is kid-direct, or is parent-blame. **Council action:** promote the substantiated set to `AP-` build-ready; surface the gated/HELD surfaces as Guy/EU-MDR decisions. No clinical veto outstanding.

---

## CYCLE 2026-06-22b — FUNCTIONAL / PROD-HEALTH (live app + green-gate)

**Context:** runtime defect pass on the LIVE prod app (both origins) + the `main` green-gate, post domain-migration + billing-enablement. **`main`'s green-gate is currently RED** (8 tsc errors + 6 test failures) — several reference code that lives on un-merged branches (mig/waf), i.e. multi-session entanglement; the **deployed Cloud Run revision matches `main`** so these gaps are in prod. Verified with curl against prod + source on main. Feeder candidates → Product Council; **the SEV-5 below is a live revenue-blocker — surfaced to Guy for an immediate call.**

| Score | ID | Lens | Title | Owner | Effort | Risk | Status |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- | :-- |
| **98** | CIL-bugs-entitlement-write-undefined-500 | bugs | **🔴 REAL revenue-blocker (verified from prod Cloud Run logs, NOT the routing — RevenueCat IS hitting the Cloud Run URL directly and auth passes):** `entitlements.ts:176` `tx.set(ref, {...record})` writes `lastEventTs: undefined` (set in `billing.ts:108` when an RC event lacks `event_timestamp_ms`) → **Firestore rejects undefined → 500 "Cannot use undefined as a Firestore value (field lastEventTs)" → the paid upgrade is NEVER written → customer pays, stays Free.** A real event already 500'd in prod (2026-06-21T16:09:07). **Fix (1-2 lines, robust): strip undefined keys before the `tx.set` in `setEntitlement` — `const clean = Object.fromEntries(Object.entries({...record, updatedAt:new Date().toISOString()}).filter(([,v])=>v!==undefined)); tx.set(ref, clean, {merge:true});`** (or default `lastEventTs` in billing.ts, or `ignoreUndefinedProperties:true` on Firestore settings). Needs a **backend redeploy** to take effect. SECONDARY (robustness, not blocking since RC hits Cloud Run direct): add a `/webhooks/**`→Cloud Run rewrite to firebase.json so the hosting URL also works. | arbor-billing | 1 | **gated (billing)** | **✅ SHIPPED TO PROD 2026-06-22** — fix `9afe5e6` clean-FF'd onto `main` (47760e3→9afe5e6, +1 commit only, no trampling) + backend deployed (Cloud Run rev **`arbor-api-00113-diw`**, image `9afe5e6`; rollback anchor `00110-sul`). Safe because prod==main==47760e3, so this added ONLY the verified one-line fix to already-live code. 22 billing tests green. Paid upgrades now write reliably. Full Firestore-undefined regression test still pending the emulator ([[CIL-bugs-firestore-rules-skip]]). **firebase.json robustness tail → promoted AP-022** |
| 47 | CIL-bugs-tsc-appcheckconfig | bugs | `appCheckMiddleware.ts:46` reads `config.requireAppCheck` but it's absent from `ArborConfig` (env.ts) → tsc TS2339 + App Check never enforces regardless of env. Fix: add `requireAppCheck:boolean` to ArborConfig, wire from `REQUIRE_APP_CHECK`. | arbor-api | 1 | safe | **promoted → AP-024** |
| 46 | CIL-bugs-csp-img-src-storage | bugs | **CSP `img-src` omits `firebasestorage.googleapis.com`** → every uploaded child photo / behavior-log attachment renders BROKEN after a successful upload (getDownloadURL returns that host). Verified prod CSP via curl. Fix: add the host to `imgSrc` in `createApp.ts cspDirectives()`. | arbor-api | 1 | safe | **promoted → AP-023** |
| 40 | CIL-bugs-tsc-aiquota-globalceiling | bugs | `createAiQuota` has no `globalHourlyLimit` arg (test calls 2-arg form) → 4 tsc errors + 3 test fails; the global AI cost ceiling is unimplemented on main. Fix per the test contract. | arbor-api | 2 | gated (cost) | **promoted → AP-025** |
| 36 | CIL-bugs-xss-markdownblock | bugs | `MarkdownBlock.parseInline()` strips no HTML → 3 SEC-1 tests fail (defense-in-depth angle-bracket stripping absent; React escapes so no live XSS, but the gate is red). Fix: `text.replace(/<[^>]*>/g,'')` before bold-split. | arbor-ai | 1 | safe | **promoted → AP-026** |
| 27 | CIL-bugs-csp-appcheck-blocked | bugs | CSP `connect-src`/`frame-src` omit App Check + reCAPTCHA domains → App Check token fetch blocked in prod (gstatic/firebaseappcheck/recaptcha). Fix: add the hosts. | arbor-api | 1 | safe | **promoted → AP-027** |
| 22 | CIL-bugs-firestore-rules-skip | bugs | `firestore.rules.test.ts:7` is `describe.skip` unless `FIRESTORE_EMULATOR_HOST` is set (never in CI) → the cross-family child-data access boundary is NEVER auto-tested; a rules regression passes the gate. Fix: emulator globalSetup or `test:rules` script in the gate. | arbor-api | 2 | safe | **promoted → AP-029** |
| 23 | CIL-bugs-vision-consent-missing | bugs | `/api/vision` + ArborVision.tsx upload child photos with no consent gate (dup of the consent wave's intent; re-confirm whether the shipped A2 gate covers this path on main). | arbor-safety | 2 | gated | **promoted → AP-028** |
| 7 | CIL-bugs-healthz-404 | bugs | `/healthz` 404 (CDN-intercepted, no `/webhooks`-style rewrite) + `/api/readyz` 401 (health router not mounted on main) → liveness probe dead via hosting. Fix: mount health router before auth + route. | arbor-api | 2 | safe | **promoted → AP-030** |

> **Clean in prod (verified):** both origins serve the real app (not a placeholder); all marketing routes 200; assets/SW/manifest load on both origins; CORS preflight 204 with correct Allow-Origin for the brand domain; eval:safety + check:framework pass; no mixed-content. The above are the real gaps. **#1 (webhook routing) is the only thing actively blocking revenue and has a zero-deploy workaround — do that first.**

---

## CYCLE 2026-06-22 — CONVERSION / RETENTION / TRUST (live monetizing app)

**Context:** first eval cycle since Arbor went LIVE in prod on the brand domain `arborparentingapp.com` with RevenueCat billing + entitlement enforcement ON. Lens weighting shifted from cosmetic polish → **does it move activation → conversion → retention → trust for a paid children's product.** 5 findings, adversarially verified against source on `main` (2 false candidates dropped at verify: "Settings cadence toggle dead" and "402 paths don't route to paywall" — both confirmed working). All `safe` (copy/display/i18n/additive UI; none touch billing logic, consent enforcement, or child-data policy). **Feeder candidates → promote at the Sun Product Council to `AP-` and ship via the release train; do NOT hand-build.**

| Score | ID | Lens | Title | Owner | Effort | Risk | Status |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- | :-- |
| 38 | CIL-conv-paywall-no-price | conversion | **PaywallModal shows a monthly/annual toggle but NO price + no annual-savings anchor** — `billing/PaywallModal.tsx:45-52`; `pw.*Price` keys absent in `i18n.ts`. The conversion moment has no offer; annual (higher LTV) has zero pull. Fix: add `pw.plusPrice/familyPrice` per cadence (Plus €12.99/mo·€119/yr, Family €19.99/mo·€189/yr, ~21-24% annual saving) + render active-cadence price by each button (EN+HE). | arbor-billing + arbor-content | 2 | safe | **promoted → AP-004** (prior PM block) |
| 23 | CIL-lang-jitai-nudge-en-regression | language | **JITAI Home nudge is hardcoded English** — `lib/jitai.ts:52-96` returns raw EN headline/body/cta; `OverviewTab.tsx:274-278` renders them with no `t()`; `nextNudge()` gets no `language` (OverviewTab:154). Hebrew-leak REGRESSION on the #1 retention surface (same class the 2nd cycle fixed elsewhere). Fix: move 4 strings to i18n EN+HE, thread `language` through `nextNudge`, resolve via `t()`. | arbor-growth (+ critic-language) | 2 | safe | **promoted → AP-005** (prior PM block) |
| 22 | CIL-conv-no-post-checkout-activation | conversion | **No post-checkout activation** — `useCheckout.ts:21` redirects to hosted checkout; nothing reads a `?checkout=success` return (grep: no `searchParams`/`URLSearchParams`). A parent who just paid lands in a cold app — no "Welcome to Plus", no unlocked-feature handoff. Fix: detect `?checkout=success` on mount → force entitlement refresh → one-time success sheet → strip param. | arbor-billing | 2 | safe | **dropped: verified-false** — `App.tsx` already handles `?billing=success`; confirmed by reality-check adversarial verify (2026-06-22). AP-006 retracted from the canonical queue. |
| 22 | CIL-trust-posture-invisible-onboarding | trust | **Trust posture invisible at the hand-over moment** — the strong privacy line lives only on `AvatarCreator.tsx:194`; OnboardingFlow footer (`ob.footer`) is generic with no privacy/safety link at the screen where a parent first gives child name/age/concern. Fix: one-line trust chip ("Private by default · parent-approved memory · never used to train AI") linking the existing safety view; mirror near first capture. | arbor-content + arbor-design | 1 | safe | **promoted → AP-007** (prior PM block) |
| 18 | CIL-onboard-age-years-not-months | activation | **Onboarding age slider stores raw years 0–18** — `OnboardingFlow.tsx:102` (`min0 max18`) → `addChild({age})`:52; for 0–2 the milestone/corrected-age engine needs months+gestation (the `ms.gestationHint`/preterm path exists) → infants mis-bucketed from screen one (moat's first payoff is wrong). Fix: reveal a months sub-input + gestation hint when age 0–2. | arbor-growth | 2-3 | safe* | **promoted → AP-008** (prior PM block; gated: arbor-clinical-peds soundness check before build) |

> *#4 is `safe` on the code/policy axis (additive onboarding field, no child-data-policy change) but its developmental bucketing must pass the **arbor-clinical-peds** lens before it's build-ready — route via the Clinical Board, per CHARTER. Recommended Council promotion order: paywall-price (revenue) → jitai-i18n (regression) → post-checkout + trust-chip → onboarding-age (after clinical). Source: PPPPtherapy-/PPPPtherapy-/app/src on main; full evidence in this cycle's eval.

---

## Capability Backlog vs Competitors (cycle 2026-06-21c)

**Thesis.** Arbor already *wins* on depth: it is the only parent-mediated, longitudinal child-memory record in the field — a moat Huckleberry (sleep-only), Kinedu/BabySparks/Lingokids/Duolingo ABC (generic age-band content), Khan Kids (curriculum), Good Inside (coached method + community), and Nanit (crib-sensor data Nanit owns, not the parent) each capture only one slice of. Where Arbor *loses* is **delivery and reach**: rivals ship the channel that gets the insight to the parent. The 2-3 capabilities that would make Arbor best-in-market are (1) **background push** so the JITAI nudge fires at the predicted moment, (2) **proactive "Arbor Noticed" alerts** that surface the child's own monitoring signal without waiting for a tab visit, and (3) **expert-cited activity content** to match every rival's credentialed trust hook. The one **moat-native bet to lead with**: the proactive alert grounded in the child's append-only record — "your child showed regulation difficulty this week; here's an activity backed by Siegel & Bryson" — a personalized, longitudinal nudge that no single-vertical or hardware competitor can generate. Everything child-data/billing-adjacent is `gated` (Guy roll-up); the cited-content bet is the lone `safe` capability item.

| Score | Capability bet | Competitor(s) who have it | What Arbor lacks today | The SMART bet on the moat | Owner | Effort | Risk |
| :-: | :-- | :-- | :-- | :-- | :-- | :-: | :-- |
| 20 | Background push for predictive nudges | Huckleberry (SweetSpot nap push 15-30 min pre-window), Kinedu (live-class push) | No `firebase-messaging-sw.js`, no FCM `getToken`; `jitai.ts nextNudge()` fires only in a render-time `useMemo` (`RemindersCard.tsx:26` says so verbatim) | FCM push that fires the JITAI nudge at the predicted hour; metric = D30 retention lift +8% (push-grant vs control). No child data in payload, but consent flow + server-side rhythm read are gated. | arbor-growth | 3 | gated |
| 18 | Proactive AI-surfaced developmental alerts | Good Inside (Gigi cross-session predictive support), Huckleberry (proactive data-driven tips) | `monitoring.ts` computes domain `WatchLevel` signals but they surface only on `Screening.tsx` nav — no proactive channel, no scheduled job | Weekly "Arbor Noticed" card grounded in the child's own longitudinal record, preserving the non-diagnostic framing via the output-screen check; metric = clicks → consult-packet export (action taken). **Lead moat bet.** | arbor-growth | 3 | gated |
| 17 | Physical growth tracking (height/weight/percentile) | BabySparks + baby-tracker category (growth charts) | No height/weight/percentile fields in `ChildProfile`; no WHO/CDC growth-chart component | Optional parent-logged measurements as timestamped entries in the append-only record → true longitudinal trajectory, not a single reading; metric = 60% of profiles with ≥1 growth entry in 30 days | arbor-growth | 2 | gated |
| 16 | Expert-cited / research-backed activity content | Kinedu (named Harvard partnership), Lovevery (expert videos), BabySparks (PhD-designed videos), Khan Kids | `PlayActivity` (`content.ts`) has no expertName/citationUrl/videoUrl; `DailyPlayCard` shows only title + desc | Add citation fields; populate top-30 activities with CDC/AAP/named-researcher sources connected to the child's specific concern domain — a personalized citation a generic app can't generate. **Only `safe` capability bet.** | arbor-practice | 2 | safe |
| 11 | Live / on-demand expert session BOOKING + video + payment | Kinedu (live expert classes), BabySparks (live + on-demand + private coaching), Good Inside (expert-AI membership) | Consult-REQUEST ships (MON-3); BOOKING/calendar/video/in-app payment do not (`Appointments.tsx` = `<ComingSoon>`) | Booking pre-loads the professional with the child's full Arbor memory packet (scoped share) → sessions richer than a cold telehealth call; metric = packet-share AND book = 15% of exports | arbor-growth | 4 | gated |
| 10 | Differentiated literacy proposition (3-8 cohort) | Duolingo ABC (free, 700+ phonics lessons), Khan Academy Kids (Stanford-built, free), Lingokids | `EarlyReadingTrack`/`literacy.ts` exist in-product but are invisible on the marketing surface and unpositioned vs free rivals | SEO/AEO page: "Arbor doesn't just drill phonics — it tracks whether Maya is *ready* and adapts to how she responded last week" (memory Duolingo ABC can't match) | arbor-marketing-lead | 3 | gated |
| 10 | Family-level multi-child dashboard | Lingokids (≤4 profiles w/ progress reports), Khan Kids (per-child mastery) | Profiles stored but UI renders only `activeChild`; `ProfileSwitcher` is a name+age dropdown — no cross-child DevScore/milestone/signal glance | Cross-child glance powered by each child's longitudinal DevScore (a signal no competitor can generate); 2+ child households are high-retention; metric = multi-child D30 retention | arbor-growth | 2 | gated |

> Moat-native framing for the build pods: every gated bet above is defensible *because* it is grounded in Arbor's append-only longitudinal record. Do not build a generic version (age-band push, sensor data, cold booking) — the differentiation is the child's own history. The **lead bet is the proactive "Arbor Noticed" alert (score 18)**: highest moat-leverage, must preserve the non-diagnostic guarantee, surface to Guy.

---

## CYCLE 2026-06-21c — capability + market panel (deep lenses: capability × market, cited-competitor)

### State of the app (capability + market lens)
The product is feature-rich and its moat is real, but two things are leaking value at the edges. First, the **moat is built but undelivered**: Arbor computes the best predictive nudges (`jitai.ts`), domain watch-signals (`monitoring.ts`), and longitudinal DevScores in the category — yet they only fire when the parent is already in the app. There is no background push, no proactive "Arbor Noticed" alert, no family-level glance, while Huckleberry/Good Inside/Nanit ship exactly this *delivery* layer. Second, the **go-to-market surface is wired wrong**: the final landing CTA is a dead JS no-op (`onclick=return false`) on all 5 languages, the Hebrew page serves English social previews into Israel's primary viral channel, the canonical URL is an un-shareable `web.app` subdomain, there is zero social proof, and the referral loop grants nothing — so even perfect demand converts at near-zero. Net: Arbor already *wins* on depth (parent-mediated longitudinal memory vs every rival's single-vertical or hardware-bound data) but *loses* on reach (delivery + funnel). This cycle's verified findings are mostly `gated` (child-data/billing/consent), but the market-funnel bugs (dead CTA, HE OG, hreflang, schema) are `safe` and immediately buildable.

### Themes (capability + market)

| # | Theme | Root cause | Rolls up | Owner |
| :-: | :-- | :-- | :-- | :-- |
| T5 | **The moat is computed but not delivered** | Every proactive signal (JITAI nudge, monitoring WatchLevel, DevScore) is consumed only in a render-time `useMemo` on a tab the parent must navigate to. No background push / scheduled job / proactive surface exists (no `firebase-messaging-sw.js`, no Cloud Scheduler). | CIL-capability-push-notifications, -proactive-memory-alerts, -multi-child-family-dashboard | arbor-growth |
| T6 | **The acquisition funnel is structurally broken before product even loads** | Marketing pages were hand-authored without a wired conversion path: dead final CTA (JS no-op, 5 langs), no email capture, English OG on the HE page, `web.app` canonical, PreOrder schema on a live app, missing hreflang on 6/7 HE guides, zero social proof. | CIL-market-dead-hero-cta, -no-activation-email-capture, -og-title-he-english, -no-brand-domain, -schema-preorder-vs-live, -sitemap-missing-guide-hreflang, -no-social-proof, -og-image-logo, -viral-loop-unwired | arbor-marketing-lead / arbor-seo |
| T7 | **Positioning under-sells the one defensible moat** | The longitudinal-memory differentiator is buried in section 4 / never framed against hardware-AI (Nanit) or coherent-system (Good Inside) rivals; literacy capability exists in-product but is invisible on the marketing surface. | CIL-market-no-ai-longitudinal-differentiator-on-page, -nanit-biosignal-moat-threat, -no-duolingo-abc-phonics-angle | arbor-marketing-lead |

### Feature thesis (capability × market × feedback)
**FT-2 — Ship the "delivery layer" that turns Arbor's computed moat into reach.** Arbor already generates the best predictive signals in the category (JITAI nudges, monitoring WatchLevels, longitudinal DevScores) but they reach nobody unless the parent happens to be in the app at the right moment. *SMART:* build (1) FCM background push for the JITAI nudge, (2) an "Arbor Noticed" weekly proactive card grounded in the child's own monitoring signal (preserving the non-diagnostic framing), and (3) a family-level cross-child glance — all powered by the append-only record no competitor can replicate. Each is **gated** (child-data/consent), so this is a Guy roll-up, not an auto-build; but it is the highest-leverage retention bet on the board. Owner: arbor-growth. Pair with the **moat-native counter-position** (FT-3 below) on the marketing side.

### Open — market funnel (safe, auto-buildable)
| Score | ID | Lens | Title | Owner | Effort | Risk | Status |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- | :-- |
| 100 | CIL-market-dead-hero-cta | market/bugs | Final landing CTA is a dead JS no-op (`onclick=return false`) on all 5 langs — zero conversion | arbor-marketing-lead | 1 | safe | open |
| 64 | CIL-market-og-title-he-english | market | HE landing og:title/og:description served in English → wrong-language WhatsApp/FB previews in Israel | arbor-marketing-lead | 1 | safe | open |
| 34 | CIL-market-sitemap-missing-guide-hreflang | market/seo | 6/7 HE guide pages lack hreflang alternates → broken EN-HE signal for Google/AEO | arbor-seo | 1 | safe | open |
| 24 | CIL-market-no-ai-longitudinal-differentiator-on-page | market | Moat (longitudinal memory) buried in section 4; hero is generic positioning | arbor-marketing-lead | 2 | safe | open |
| 23 | CIL-market-schema-preorder-vs-live | market/seo | SoftwareApplication schema says `PreOrder` but app is live → blocks Google "Try free" rich result | arbor-seo | 1 | safe | open |
| 16 | CIL-market-og-image-logo | market | All 22 og:image pages use 520×525 square logo, not a 1200×630 OG card → near-invisible social previews | arbor-marketing-lead | 2 | safe | open |
| 14 | CIL-market-nanit-biosignal-moat-threat | market | No "no-hardware / parent-owned record" counter-position vs Nanit's $50M sensor-AI moat | arbor-marketing-lead | 2 | safe | open |

> Provenance corrections applied at verify (do NOT re-litigate at build):
> - **dead-hero-cta** / **og-title-he**: lens mislabeled "market" — these are bug/localization defects; competitor framing stripped (self-evident in Arbor source). Fix dead-CTA in same PR as the brand-domain switch.
> - **og-image-logo**: re-cite to Good Inside (1200×627) + Kinedu (1200×630); drop the false Lovevery "lifestyle image" claim; title is "22 og:image pages (8 marketing + 14 deep)"; OG card MUST use a synthetic placeholder name, never real child data. Confidence trimmed to 0.90.
> - **no-ai-longitudinal** & **nanit-moat**: confidence lowered to 0.75 (dead PR Newswire citations); re-source Nanit $50M/PIS specifics before any copy ships.
> - **sitemap-hreflang**: gap is broader than claimed (6/7 HE + 6/7 EN unlinked); Kinedu competitor claim discounted (non-load-bearing).
> - **schema-preorder**: `OnlineOnly` or `InStock` both valid; Kinedu App Store claim dropped (unconfirmable).

### Gated — capability & market (needs Guy, not auto-built)
_Child-data / consent / billing / cost. Filed, surfaced to Guy, never auto-queued._

| Score | ID | Lens | Title | Owner | Effort | Why gated | Status |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- | :-- |
| 40 | CIL-market-no-brand-domain | market | Canonical is `arborprd-westeu.web.app` — unshareable/untrustworthy; gates the whole GTM loop | arbor-marketing-lead | 2 | financial (domain buy, L4) + DNS/hosting (L3) | open |
| 23 | CIL-market-no-activation-email-capture | market | No email/waitlist capture on either landing page → interested-but-not-ready visitors lost | arbor-marketing-lead | 2 | PII capture + consent on EU child product (stubbed privacy links) | open |
| 21 | CIL-market-viral-loop-unwired | market | `/join?ref=` resolver, reward grant, deep-linked share export all unbuilt (dup of CIL-bugs-referral-join-route-missing) | arbor-acquisition | 3 | grant writes entitlements (billing) + child-activation | open |
| 20 | CIL-capability-push-notifications | capability | JITAI nudge engine fires only in-app — no FCM background push (Huckleberry/Kinedu ship it) | arbor-growth | 3 | push opt-in consent + server reads child-rhythm state | open |
| 18 | CIL-capability-proactive-memory-alerts | capability | `monitoring.ts` watch-signals never proactively surfaced — only on Screening nav (NOT SafetyTab) | arbor-growth | 3 | child-data + non-diagnostic-framing guarantee | open |
| 17 | CIL-capability-physical-growth-tracking | capability | No height/weight/percentile in ChildProfile — table-stakes pediatric data missing | arbor-growth | 2 | child health data (COPPA/GDPR) + implied medical interp | open |
| 13 | CIL-market-nanit-… (see safe table) | — | _(positioning copy — kept in safe table)_ | — | — | — | — |
| 11 | CIL-capability-live-expert-sessions | capability | No live/on-demand session BOOKING + video + payment (consult-REQUEST already shipped via MON-3) | arbor-growth | 4 | billing (Stripe) + child-memory-packet share | open |
| 10 | CIL-capability-multi-child-family-dashboard | capability | No family-level cross-sibling developmental glance (profiles siloed to activeChild) | arbor-growth | 2 | aggregated child-data surface + multi-child is a Plus (billing) feature | open |
| 10 | CIL-market-no-duolingo-abc-phonics-angle | market | No differentiated literacy proposition vs free Duolingo ABC / Khan Kids in 3-8 cohort | arbor-marketing-lead | 3 | thesis links reading practice to child profile (child-data) | open |
| 10 | CIL-market-image-gen-billing-risk-on-landing | market/cost | Landing markets avatar/story gen as live but `/generate-avatar\|scene\|comic` are uncapped (= COST-IMG / T1) | arbor-api / arbor-billing | 3 | cost/billing + child-photos | open |
| 5 | CIL-market-no-community-layer | market | No in-product community/peer layer (Good Inside/Cooper make coached community the retention engine) | arbor-marketing-lead | 4 | child-data + consent + content-moderation infra absent | open |

> Provenance corrections (capability/market gated):
> - **proactive-memory-alerts**: SURFACE CORRECTION — the consuming view is `src/components/sections/Screening.tsx`, NOT `SafetyTab.tsx` (which has no monitoring code). Nanit downgraded to directional (rolling-out-2026, not shipping).
> - **live-expert-sessions**: RE-SCOPE — consult-REQUEST already ships (MON-3 v1: live `POST /api/consult-requests`, durable Firestore `ConsultRequest`). Only live/on-demand BOOKING + calendar + video + in-app payment are missing. Cite `Appointments.tsx` `<ComingSoon>` labels, not the packet flow. Do NOT rebuild MON-3.
> - **physical-growth-tracking**: narrow competitor framing to BabySparks + the baby-tracker category (Huckleberry/Kinedu/Nanit claims overstated or different category). Self-classed "safe" → forced gated (child health data).
> - **multi-child-dashboard**: BabySparks leg unsubstantiated; stands on Lingokids (≤4 profiles) + Khan (per-child progress). "up to 10" Khan figure unconfirmed.
> - **image-gen-billing-risk**: this is the SAME defect as T1 / COST-IMG / CIL-bugs-imagegen-quota-missing — ownerPod corrected from `arbor-seo` to arbor-api/arbor-billing. Do not double-build.
> - **viral-loop-unwired** ≡ **CIL-bugs-referral-join-route-missing** (FT-1). Kinedu referral citation dropped (dead URLs).
> - **no-community-layer**: $276/yr + 50k-member figures unconfirmed (paywalled); stands on Cooper + Good Inside live "Private Community" feature pages. Near-term safe step = the existing second-guardian "share with partner" digest button (not this thesis).

### Cited-expert content (safe, owner arbor-practice)
| Score | ID | Lens | Title | Owner | Effort | Risk | Status |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- | :-- |
| 16 | CIL-capability-cited-expert-content | capability | PlayActivity has no expert attribution / research citation / video — competitors lead with credentials | arbor-practice | 2 | safe (editorial; citations need human accuracy review) | building → shipped (branch claude/cil-week, 2026-06-21) |

> **cited-expert-content** provenance: the only `safe`-classed capability finding. CORRECTION — Kinedu's current site touts a **Harvard** research partnership (not Stanford; Stanford traced to a stale 2019 MIT Solve page). Caveat for build: citing named researchers/AAP/CDC is health-adjacent claim-making → populated citations require human editorial review before shipping (accuracy risk, not a gate).
> **Build note (2026-06-21):** `ActivitySource` type + optional `source?` field added to `PlayActivity` (non-breaking). 11 activities cited across 3 verified anchors (Harvard CDev serve-and-return, CDC Act Early, Siegel & Bryson Whole-Brain Child). 35 activities deliberately left uncited (URL not reliably known or mechanism match ambiguous). CI gate green (lint + 475 tests + safety eval). Human editorial URL spot-check required before prod deploy per the safety note above.

---

## CYCLE 2026-06-21 — full panel (bugs · language · feedback · safety · consent · cost)

### State of the app
Arbor is a substantively complete, integrated product — not a prototype. The substrate (i18n system, consent store, redaction, output-safety screen, entitlements seam, image-gen, growth loops) all exists and is wired into real request paths. The defects are gaps in the *guardrails around* that substrate, not missing features. Two patterns dominate: (1) **the cost/safety floor has holes** — image-gen and two story routes bypass the per-user AI quota, /voice streams to TTS with no output-safety screen, and the safety regression gate is a copy-grep that can't catch a behavioural regression; (2) **the consent/compliance layer is drafted but not enforced at the seams** — onboarding collects child data with no GDPR consent capture, /vision processes child photos ungated, and the GDPR export omits the consent ledger that erase deletes. On the polish front, Hebrew (a primary locale) leaks English: three tabs render hard-coded EN strings and the marketing page ships English OG tags. The growth loop is half-wired (a shared /join?ref= link that grants nothing). Everything material here is **gated** — almost every finding touches child-data, consent, cost, or billing — so this cycle produces a roll-up for Guy, not an auto-build wave.

### Themes (root causes, not nits)

| # | Theme | Root cause | Rolls up | Owner |
| :-: | :-- | :-- | :-- | :-- |
| T1 | **AI/image cost floor has holes** | The per-user `createAiQuota` allow-list in `createApp.ts:124-127` was never extended as new generative routes shipped. 5 image routes + 2 story routes call paid models with only a 30/min IP backstop. | CIL-bugs-imagegen-quota-missing (=COST-IMG), CIL-bugs-generate-adventure-no-quota | arbor-api / arbor-billing |
| T2 | **Consent/compliance is drafted, not enforced at the seams** | A full consent store + `requireConsent` middleware exist, but the *entry points* (onboarding capture, /vision route, GDPR export payload) were never wired to it. DPIA flags these as Planned, not Done. | CIL-feedback-no-explicit-consent-onboarding, CIL-bugs-vision-no-consent-gate, CMP-E1-gdpr-export-omits-consent-ledger | arbor-safety |
| T3 | **Safety floor is bypassable + its gate is blind** | The output-safety screen only runs on the buffered JSON path (/chat, /council), so the streaming /voice path skips it; and `eval:safety` is a static copy-grep that can't detect any behavioural regression. | SAFE-V1-voice-output-screen-bypass, SAFE-V2-eval-safety-is-static-grep-only | arbor-safety |
| T4 (Hebrew-leak nit-roll) | **Primary locale (Hebrew) leaks English** | i18n Phase 1 scoped only shell+Overview; later tabs were built with hard-coded EN strings + the HE marketing page kept EN OG tags + register/bidi inconsistencies. | CIL-language-lang-lab, -weekly-tab, -behaviors-tab, -he-og-tags, -monitor-latin-brand, -teyoudateTone | arbor-content |

### Feature thesis (capability × market × feedback)
**FT-1 — Wire the half-built referral loop into a real second-guardian acquisition channel.** The growth substrate exists (loopEvents, attribution `?ref=` capture, heroCard share export, entitlements seam) and the market thesis (MEMORY: "retention is the constraint, second-guardian loop = V0 winner") says viral acquisition is the north star — but `buildJoinUrl()` ships a `/join?ref=` link that resolves to nothing (no route, no grant). *SMART:* ship the /join resolver + cookie capture (safe) AND the activation-triggered free-Plus-month entitlement grant for both parties (gated — billing) so that >0% of shared hero cards convert to a tracked, rewarded signup, measurable via the existing loopEvents sink. Owner: arbor-growth + arbor-billing (gated half).

### Open — top of queue (safe, auto-buildable)
| Score | ID | Lens | Title | Owner | Effort | Risk | Status |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- | :-- |
| 36 | CIL-language-he-og-tags-english | language | HE marketing page has English-only OG title/description | arbor-content | 1 | safe | open |
| 24 | CIL-language-behaviors-tab-hardcoded-en | language | BehaviorsTab `<option>` labels + toast hard-coded EN (i18n keys already exist) | arbor-content | 2 | safe | open |
| 21 | CIL-language-lang-lab-hardcoded-en | language | LanguageLabTab fully hard-coded EN, zero i18n (core multilingual surface) | arbor-content | 3 | safe | open |
| 19 | CIL-language-en-coach-subtitle-ai-stilted | language | Coach subtitle is a hedge-stuffed run-on; reads AI-generated | arbor-content | 1 | safe | open |
| 18 | CIL-language-weekly-tab-hardcoded-en | language | WeeklyTab hard-coded EN (whole tab un-i18n'd; effort up-revised to 3) | arbor-content | 3 | safe | open |
| 16 | CIL-language-he-dict-teyoudateTone | language | HE dict mixes singular/plural register (תיעדת outlier) | arbor-content | 2 | safe | open |
| 12 | CIL-language-en-consult-subtitle-clinical-tone | language | Consult subtitle over-explains / clinically distancing | arbor-content | 1 | safe | open |
| 20 | CIL-language-monitor-latin-brand-mid-rtl | language | "Arbor" Latin script mid-Hebrew-RTL bidi glitch (monitor.* keys) | arbor-content | 1 | **gated** | open |

> Note: CIL-language-monitor-latin-brand sits in the Open table for visibility but is **gated** (Screening/monitor is the child-data/safety-adjacent screening surface) — do not auto-queue; it ships only with arbor-safety sign-off.

### Gated — needs Guy (not auto-built)
_Safety / consent / billing / cost / child-data. Filed, surfaced to Guy, never auto-queued._

| Score | ID | Lens | Title | Owner | Effort | Why gated | Status |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- | :-- |
| 47 | CIL-bugs-vision-no-consent-gate | bugs | /api/vision processes child photos with NO `requireConsent` (COPPA gap) | arbor-safety | 1-2 | child-data + consent | open |
| 45 | CIL-feedback-no-explicit-consent-onboarding | feedback | Onboarding/login collect child data with no GDPR consent capture | arbor-safety | 2 | consent + child-data | open |
| 31 | CIL-bugs-imagegen-quota-missing (= COST-IMG) | bugs/cost | 5 image-gen routes absent from `aiQuota` → unbounded paid-image spend | arbor-api / arbor-billing | 1-2 | cost/billing + child-data | open |
| 20 | SAFE-V1-voice-output-screen-bypass | safety | /voice streams to TTS with NO output-safety screen (can speak a diagnosis/dose aloud) | arbor-safety | 3 | safety + child-data | open |
| 18 | SAFE-V2-eval-safety-is-static-grep-only | safety | `eval:safety` gate is a copy-grep; can't detect a safety-behaviour regression | arbor-safety | 3 | safety regression gate | open |
| 14 | CMP-E1-gdpr-export-omits-consent-ledger | consent | GDPR export omits the consent ledger that erase deletes (Art.15/20 asymmetry) | arbor-safety | 1 | consent + child-data | open |
| 11 | CIL-bugs-firestore-rules-tests-always-skipped | bugs | Firestore security-rules tests permanently `describe.skip` (no emulator in CI) | arbor-api | 2 | untested boundary over child-data/billing/cost | open |
| 13 | CIL-bugs-referral-join-route-missing | bugs | /join?ref= deep-link is shared but has no resolver/grant (also FT-1) | arbor-growth | 2 | grant writes entitlements (billing) + child-data | open |
| 9 | CIL-bugs-generate-adventure-no-quota | bugs | /generate-adventure + /generate-hero-journey miss `aiQuota` (cost) | arbor-api | 1 | cost | open |

> **Escalation flag for Guy:** the top three gated items (vision consent gap 47, onboarding consent 45, image-gen cost leak 31) are high-score *and* compliance/cost-critical. These need Guy's call before any build pod touches them. The vision-consent fix has a coordinated client+server caveat (must also send `childId` or `requireConsent` fails-closed 451 on every call — see verdict).

### Shipped & confirmed
_(none this cycle)_

### Dropped (verify rejected)
_(none — all 18 candidate findings substantiated under adversarial verify)_

---

### Cycle log
| Date | Mode | Found | Verified | Built | Confirmed | Shipped |
| :-- | :-- | :-: | :-: | :-: | :-: | :-: |
| 2026-06-21 | build (full panel) | 18 | 18 | 0 (16/18 gated) | 0 | 0 |
| 2026-06-21c | build (capability × market deep) | 21 | 21 | 0 (14/21 gated) | 0 | 0 |
| 2026-06-21d | **SAFE BUILD WAVES (6) → green branch `claude/cil-week`, pushed** | — | — | **6 waves** | tsc+478 tests+build+safety per wave | 0 (awaiting Guy merge) |

### Shipped to green (branch `claude/cil-week`, pushed to origin — awaiting Guy's merge+deploy)
The autonomous loop built every verified **safe** finding to green this session. Commits:
1. `3c5075e` — i18n Hebrew-leak closure (LanguageLab/Weekly/Behaviors tabs + HE OG + copy).
2. `b8dfc76` — broken funnel: **dead landing CTA (score 100, zero-conversion) fixed** + HE OG + hreflang + schema PreOrder→live + moat-in-hero + no-hardware counter-position.
3. `8ea1ab9` — visual craft: 7-step type scale tokens + 44px touch-target floor (Shell/kit/HubTabs/ProfileSwitcher/AiRail/DailyPlayCard).
4. `15a0f7c` — **expert-cited content (capability C5)**: 15 daily-play activities cited to Harvard CDC/Siegel-Bryson (URLs verified live), citation-integrity test.
5. `9895a3d` — **i18n en/he parity test** — locks the Hebrew-leak class in CI permanently.
6. `28c5ae2` — VIS-2 finish: Sidebar sign-out/settings touch targets → 44px.

**Safe backlog is now EXHAUSTED.** Referral-loop safe half (capture+consume) was already shipped; its grant is gated. Everything else open is `gated` (A1–A5 compliance/cost, B1–B3 growth, C1–C4 capability bets) → see [GATED-DECISIONS-2026-06-21.md](GATED-DECISIONS-2026-06-21.md). Loop continues autonomously 2×/day eval + Mon/Thu build.
