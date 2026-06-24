# Arbor Execution Blueprint — 2026-06-17

**Owner:** Guy · **Build target:** `PPPPtherapy-/PPPPtherapy-/app` (React + Vite + Capacitor) · **Prod:** https://arborprd-westeu.web.app
**Source specs:** `PAI/projects/arbor/execution/exec-blueprint-2026-06-17/specs/` (58 verified, file-grounded)
**Companion:** `CONFLICT-MAP.md` (shared-file → item matrix + per-file build order)

> This is an execution document. Build items in the wave order below. Within a wave, the listed items are parallel-safe. The **Shared-file lock map** (§3) is binding: where it says "edit serially in this order," do not let two items touch that file at once.

---

## 1. Executive summary

**What was specced.** 58 build-level specs covering the full Arbor platform: the 6-pillar IA redesign (Today/Ask/My Child/Grow/Care/Academy), the cross-cutting Hero/Avatar identity, child-facing PlayKit, the app shell + iOS/Android Capacitor surfaces, the marketing landing pages (EN + HE/RTL), and the closed-loop viral growth instrumentation. Items fall into five tracks:

- **M-track (foundation, 8):** design-system / CSS / token / safe-area / error-state / playkit plumbing — the shared-file substrate everything else edits.
- **Surf-track (Phase-1 surface polish, 5):** iOS, Android, app-shell, Ask, Academy surface conformance.
- **P-track (product features, ~15):** comic reader, hero-everywhere, JITAI, milestone rebase, kid-ASR, phonics, red-flag monitoring, COPPA consent, dev-score, etc.
- **B/C/IA-track (IA redesign, ~11):** Daily Home, My-Child story spine, Care/Consult, Rhythm, Daily Play, Ask-from-Ask, fold-missions, naming/moat exposure.
- **MK-track (marketing/growth, ~21):** landing rebuild, domain, referral loop, share-export, analytics wiring, attribution, creator/template/copy assets, then P1/P2 campaigns.

**Verdict tally** (from verification; marketing content-only items grounded against shipped primitives and treated build-ready unless gated):

| Verdict | Count | Notes |
| :-- | :-: | :-- |
| **Build-ready** | ~32 | Most M/surf items, IA-redesign items with `dependsOn: []`, and content-only MK assets grounded in shipped loop primitives. |
| **Needs-revision** | ~22 | Includes all the verified P-track items (p1, p2-hero, p3, p4, p2-5, p2-6, p2-9) — fix the high-severity issues in §7 before/while building. |
| **Blocked** | ~4 | `p2-8-red-flag-monitoring`, `p2-10-kid-asr` (vendor + consent gate), `mk-p0-1-domain` (Guy spend), plus consent-dependent slices. See §5. |

**The critical path** (longest dependency chain that gates the most downstream value):

```
m4-retire-override-layer ─► m2-token-extraction ─► m1-ios-safe-area ─► m5/m7 ─► p3-ios-grade-audit   (CSS/UI substrate)
mk-p0-4-analytics-wiring ─► mk-p0-2 / mk-p0-3 ─► mk-p1-6-loop-optimization ─► (paid spend gate) ─► mk-p2-*  (growth loop)
p4-operational-hardening ─► p1-comic-reader / p2-hero-everywhere                                   (generative substrate)
p2-9-coppa-consent ─► p2-10-kid-asr / p2-11-mimic / avatar-photo / p2-8 export gate                (privacy gate)
b1-daily-home ─► c1 / c2 / ia-b1-fold-missions ─► b5-naming-moat ─► surf-app-shell                 (Today IA spine)
```

**Single most important sequencing constraint:** `index.css` is the #1 merge-conflict magnet. **`m4` (delete dead override layer) → `m2` (token extraction) → `m1` (safe-area) → `m5` (touch/error) / `m7` (playkit) → `p3` (polish, append-only, last)** must be strictly serial. No two CSS/token/shell items may run concurrently. This single ordering protects every UI item downstream.

---

## 2. Sequenced waves

Wave boundaries are drawn so that (a) within a wave no two items clash on a shared file, and (b) waves run in dependency + leverage order: **foundation substrate and loop instrumentation first → IA spine → features → surface polish → growth campaigns.**

### Wave 0 — Foundation substrate & unblockers (serial-heavy; start immediately)
*These are the first writers on the hottest shared files. They have `dependsOn: []` and unblock nearly everything. Run the CSS chain serially; the three non-CSS items parallelize alongside it.*

| id | title | priority | surfaces | verdict | effort |
| :-- | :-- | :-- | :-- | :-- | :-- |
| m4-retire-override-layer | Retire dead dark-theme override layer | Phase2 | app:shell | build-ready | S |
| m2-token-extraction | Design-token extraction to typed TS | Phase2 | app:shell, Today, Grow, PlayKit | build-ready | M |
| mk-p0-4-analytics-wiring | Analytics events wired (kill dead exports) | P0 | app:shell | build-ready | S |
| p4-operational-hardening | Operational hardening (generative guardrails) | Phase1 | all app | needs-revision | L |
| p2-9-coppa-consent | COPPA-2026 consent granularity | Phase2 | hero, MyChild, Care | needs-revision | M |
| mk-landing-parity-rebuild | Unify EN+HE landing on one design system | P0 | landing:en/he | build-ready | M |

**Boundary rationale:** `m4` MUST be the first `index.css` writer (it deletes ~40% of the file). `m2` re-exports tokens that `kit.tsx`/`playkit.tsx` consumers depend on — land before any hex/playkit work. `mk-p0-4` is the first writer on `loopEvents.ts`/`analytics.ts` and freezes the event-name contract every other MK item imports. `p4` owns the `api.ts` request hardening + error-as-content removal that `p1`/`p2-hero` depend on. `p2-9` is the umbrella privacy gate for `p2-10`/`p2-11`/avatar-photo/`p2-8`. `mk-landing-parity-rebuild` rewrites the EN/HE landing wholesale and must precede every landing patch. m4→m2 are serial on `index.css`; the rest are disjoint and parallel.

### Wave 1 — UI substrate + IA spine roots + loop UI
*Depends on Wave 0. The CSS chain continues serially (m1 → m5/m7); IA roots and loop UI run in parallel on disjoint files.*

| id | title | priority | surfaces | verdict | effort |
| :-- | :-- | :-- | :-- | :-- | :-- |
| m1-ios-safe-area | iOS-grade safe-area + native polish | Phase1 | app:shell, ios, android | build-ready | M |
| m5-touch-error-states | Touch-target fix + ErrorState primitive | Phase2 | shell, Today, MyChild, Care | build-ready | S |
| m7-playkit-completeness | PlayKit completeness audit | Phase2 | PlayKit, Grow | build-ready | M |
| m3-hex-sweep | Hardcoded-hex sweep (→ near-zero in views) | Phase2 | Ask, Academy, MyChild, PlayKit, shell | build-ready | M |
| b1-daily-home | Daily Home (living, time-aware Today) | Phase2 | Today, ios, android | build-ready | L |
| b2-mychild-story-spine | My Child story spine | Phase2 | MyChild | build-ready | M |
| mk-p0-2-referral-loop | Referral loop (invite + grant) | P0 | app:shell | build-ready | M |
| mk-p0-3-share-export | Branded share/export renderer | P0 | hero, Today, Ask, shell | build-ready | M |
| mk-p0-5-attribution-utm | Attribution + UTM funnel dashboard | P0 | landing, app:shell | build-ready | S |

**Boundary rationale:** `m1` must land after `m2` (consumes tokens) but before `m5`/`m7`/`m3` (they need the `--safe-bottom` var and final token values). `b1` rebuilds Today and defines the `DailyPlayCard`/`MissionsPanel` tenant slots that `c1`/`c2`/`ia-b1` plug into next wave — it must precede them. `b2` owns the My-Child IA reorg that `p2-8`/`c4` depend on. `mk-p0-2/3/5` are the loop UI built on the Wave-0 frozen event contract. Note `p2-hero` and `c3` are deliberately held to Wave 2 because both edit `reportExport.ts` and depend on `p4`/`c3` ordering.

### Wave 2 — Feature builds on the spine
*Depends on Wave 1. Today tenants, hero everywhere, consult, dev-score, milestone rebase.*

| id | title | priority | surfaces | verdict | effort |
| :-- | :-- | :-- | :-- | :-- | :-- |
| c1-rhythm | Rhythm — predictive daily timeline | Phase2 | Today, ios, android | build-ready | M |
| c2-daily-play | Daily Play — behavior-aware engine | Phase2 | Today, Grow, ios, android | build-ready | M |
| ia-b1-fold-missions | Fold Missions into Today (kill orphan) | Phase2 | Today, Grow | build-ready | S |
| c3-ask-specialist | Ask-a-Specialist — warm human handoff | Phase2 | Care, Ask | build-ready | M |
| b3-care-consult | Care / Consult reorg | Phase2 | Care | build-ready | M |
| c4-dev-score | Longitudinal Development Score | Phase2 | MyChild, Today | build-ready | M |
| p2-5-milestone-rebase | Milestone re-base (CDC/AAP/ASHA) | Phase2 | MyChild, Grow | needs-revision | M |
| p2-hero-everywhere | Hero everywhere (cross-domain avatar) | Phase1 | cross-domain | needs-revision | L |
| p1-comic-reader | Comic-book story reader | Phase1 | Academy, Grow, PlayKit, ios, android | needs-revision | L |
| ia-b6-ask-from-ask | Ask-from-Ask IA | Phase2 | Ask | build-ready | S |
| surf-ask | Ask surface conformance | Phase1 | Ask | build-ready | S |

**Boundary rationale:** `c1`/`c2`/`ia-b1` all edit `OverviewTab.tsx` and depend on `b1` owning the Today shell — they land after `b1` (Wave 1) but must be **serialized among themselves** on `OverviewTab.tsx` (see §3). `c3` + `b3` both reshape Care/Consult and share `reportExport.ts`/`Reports.tsx`; land `b3` then `c3`. `c4` depends on `p2-5` (consumes `ageMonths`); both append to `types.ts`. `p2-hero` depends on `p4` + `c3` (shares `reportExport.ts` — land after c3). `p1` depends on `p4` and coordinates with `p2-hero` on `HeroComicsTab.tsx` (p1 owns the rewrite, p2 places the avatar — land p1 first).

### Wave 3 — Surface polish + remaining features + child-register
*Depends on Wave 2. Surface conformance sweeps and the kid-ASR / phonics / mimic / monitoring cluster (gated items split out to §5).*

| id | title | priority | surfaces | verdict | effort |
| :-- | :-- | :-- | :-- | :-- | :-- |
| surf-ios | iOS surface conformance | Phase1 | ios | build-ready | S |
| surf-android | Android surface conformance | Phase1 | android | build-ready | S |
| surf-app-shell | App-shell conformance | Phase1 | app:shell | build-ready | M |
| surf-academy | Academy surface conformance | Phase1 | Academy | build-ready | M |
| b4-practice-vs-dailyplay | Practice vs Daily Play distinction | Phase2 | Grow | build-ready | S |
| b5-naming-moat-exposure | Naming & moat exposure + dead-leaf audit | Phase2 | Today, MyChild, Care, shell, landing | build-ready | M |
| p2-6-jitai | JITAI nudge engine | Phase2 | Today, Grow, ios, android | needs-revision | M |
| p2-10-kid-asr | Real kid phoneme ASR | Phase2 | Grow, ios, android | blocked | M |
| p2-7-phonics-tracing | Phonics/early-reading + tracing | Phase2 | Grow, PlayKit, ios, android | needs-revision (rescope) | M |
| p2-11-mimic-mediapipe | Mimic + MediaPipe | Phase2 | Grow, ios, android | needs-revision | M |
| p2-8-red-flag-monitoring | Red-flag monitoring + provider PDF | Phase2 | MyChild, Care | blocked (rescope) | M |
| p3-ios-grade-audit | Whole-app iOS-grade audit & polish | Phase1 | all surfaces + landing | needs-revision | L |

**Boundary rationale:** `surf-*` items polish surfaces after their structural edits settle (e.g. `surf-academy` stages **p1 → m3(hex) → surf-academy** on `HeroJourneyTab.tsx`). `surf-app-shell` consumes `b5`'s `moat.ts` — land `b5` first. `p2-6` depends on `p4` + `p2-5` + `c4`. `p2-7` depends on `p2-10` (and must be **rescoped** — see §7, the feature already exists). `p3` is the **absolute-last** UI item: it appends to `index.css` end-of-file and re-reads the landing files after the MK patches, polishing everything that has settled. `p2-10`/`p2-8` are blocked (vendor/consent) — see §5.

### Wave 4 — Growth campaigns (marketing content/assets)
*Mostly content-only (`✍`), grounded against the now-shipped loop primitives. The P0 asset set lands first, then P1 (Israel ignition), then P2 (NL + EN/App-Store + paid). Paid spend is gated on the loop-health verdict.*

| id | title | priority | surfaces | verdict | effort |
| :-- | :-- | :-- | :-- | :-- | :-- |
| mk-delete-stale-landing | Delete stale HE landing | P0 | landing:he | build-ready | XS |
| mk-p0-1-domain | Custom domain + HTTPS | P0 | landing | blocked (Guy spend) | S |
| mk-p0-6-creator-list | Creator roster (≥15 vetted) | P0 | landing:he | build-ready | S |
| mk-p0-7-template-kit | Creator template kit | P0 | landing:he | build-ready | S |
| mk-p0-8-copy-pack | HE copy pack + i18n keys | P0 | landing, app:shell | build-ready | S |
| mk-p1-6-loop-optimization | Loop-optimization decision instrument | P1 | app:shell | build-ready | M |
| mk-p1-1-avatar-challenge | Avatar-challenge campaign | P1 | landing:he, hero | build-ready | S |
| mk-p1-2-creator-seeding | Creator seeding | P1 | landing:he | build-ready | S |
| mk-p1-3-whatsapp-fb-playbook | WhatsApp/FB group playbook | P1 | landing:he | build-ready | S |
| mk-p1-4-aeo-seo-he | AEO/SEO (HE) | P1 | landing:he | build-ready | S |
| mk-p1-5-owned-social-he | Owned social cadence (HE) | P1 | landing:he | build-ready | S |
| mk-p1-7-youtube-shorts-he | YouTube Shorts (HE) | P1 | landing:he | build-ready | S |
| mk-p2-1-localize-nl | NL localization | P2 | app:shell, landing:en | build-ready | M |
| mk-p2-2-nl-communities | NL communities + micro-creators | P2 | landing:en | build-ready | S |
| mk-p2-3-paid-amplifier | Paid amplifier | P2 | landing:en | build-ready | S |
| mk-p2-4-en-launch-appstore | EN launch + App Store | P2 | landing:en, ios, android | build-ready | M |
| mk-p2-5-pr-push | PR push | P2 | landing | build-ready | S |
| mk-p2-6-growth-card | Growth-card share artifact | P2 | app:shell, hero | build-ready | S |
| mk-p2-7-paywall-experiments | Paywall A/B experiments | P2 | app:shell | build-ready | M |
| mk-p2-8-youtube-evergreen | YouTube evergreen long-form | P2 | landing | build-ready | S |

**Boundary rationale:** P0 assets gate P1 campaigns (creators/templates/copy must exist to post). `mk-p1-6` is the loop instrument whose verdict line is the **paid-spend gate** — no P2 paid euro (`mk-p2-3`, `mk-p2-4` EN spend) until it reads GREEN (K ≥ 0.4, activation ≥ floor). `mk-p1-*` (Israel) precede `mk-p2-*` (NL/EN) per the GTM phasing. `mk-p2-1` (NL i18n) gates `mk-p2-2`. Content items can begin authoring in parallel with Wave 3 since they touch the marketing folder, not app code — but their final link strings wait on `mk-p0-1` (domain) + `mk-p0-2/3` (loop live).

---

## 3. Shared-file lock map (binding)

For each hotspot file: the **order** items may edit it. "Serial" = one PR at a time, in this order. "Parallel-safe (disjoint regions)" = simultaneous edits OK because regions don't overlap.

| File | Order (serial unless noted) | Rule |
| :-- | :-- | :-- |
| `app/src/index.css` | **m4 → m2 → m1 → m5 → m7 → p3** | SERIAL. m4 deletes the override layer; m2 adds tokens; m1 adds safe-area; m5/m7 touch play/state blocks; p3 appends at EOF only (below line 489). Never two at once. |
| `app/src/components/layout/Shell.tsx` | **m1 → m5 → surf-app-shell → p4 (sr-only live region) → p3** | SERIAL. m1 owns safe-area insets; m5 owns header tap-targets; surf-app-shell owns chrome/moat segment; p4 adds ONE sr-only div at a stable anchor; p3 polishes last. b1/c1 do NOT edit Shell (consume `--safe-bottom`). |
| `app/src/App.tsx` | **m4 → mk-p0-4 (billing-return effect) → mk-p0-2 (referral capture)** | SERIAL. m4 migrates auth/config-error screens; mk-p0-4 adds billing-return + entitlement-transition watcher; mk-p0-2 adds referral-capture-on-boot. Append distinct effects. |
| `app/src/index.css` `:root` tokens | **m2 only** | m2 is the sole token author. m3 consumes the new `var(--arbor-*)`; never re-declare. |
| `app/src/components/ui/kit.tsx` | **m2 → m3 → p3** | SERIAL. m2 re-exports tokens; m3 swaps hex; p3 adjusts Chip/TrustSafetyBar contrast AFTER values settle. |
| `app/src/components/ui/playkit.tsx` | **m2 → m7 → p1 (append ComicPage) → p2-7 (append TraceCanvas) → p3** | SERIAL APPEND-ONLY. m2/m7 settle the primitive API; p1/p2-7 append NEW exports only (no refactor of TONE maps or existing signatures); p3 polish-only. |
| `app/src/lib/api.ts` | **p4 → p1 (additive generateComic) → c3 → p2-10 (scoreUtterance return)** | SERIAL on the shared `post`/`get`/`request` helpers (p4 owns hardening, lands first). p1/c3/p2-10 are additive type-only edits in DISJOINT regions — safe to parallelize once p4 lands. |
| `app/src/context/ArborContext.tsx` | **p4 (error-state removal + entitlement) → p2-5 (milestone block) → ia-b1 (VALID_TABS) → b5 (moat) → mk-p0-4** | SERIAL. #1 god-context hotspot. p4 lands first; do NOT touch ActiveTab/VALID_TABS except ia-b1 (which owns the missions removal). Each edit a self-contained block, no value-object reorder. |
| `app/src/types.ts` | **p2-5 (ageMonths first) → c4 (DevScoreSnapshot) → p2-10 (SpeechAttempt fields) → p2-9 (consent)** | PARALLEL-SAFE (disjoint append-only). All append distinct interface fields; no member reorder. Land p2-5's `ageMonths` first (c4 consumes it). |
| `app/src/lib/loopEvents.ts` | **mk-p0-4 (wire dead exports, FREEZE names) → mk-p0-2 (add trackInviteActivated) → consumers (p1, mk-p0-3, mk-p2-6) CALL only** | SERIAL for additions; mk-p0-4 is the sole name-freezer. Everyone else imports stable names; never rename/reorder. |
| `app/src/lib/analytics.ts` | **mk-p0-4 only (confirm track sink)** | No rename, no reorder. New gen_* events live in `genEvents.ts` (p4), not here. |
| `app/src/lib/i18n.ts` | **mk-p0-8 (referral/share keys) → p2-5 (ms.*) → p2-6 (ov.jitai.*) → p2-9 (consent.*) → mk-p2-1 (nl dict) → mk-p2-7 (paywall.*)** | PARALLEL-SAFE (append-only to distinct namespaces). Append to BOTH en+he maps; never reorder. mk-p0-8 lands first so mk-p2-1 localizes a stable key set. **NOTE:** several specs wrongly name `LanguageContext.tsx` — the real key store is `lib/i18n.ts`. |
| `app/src/lib/navigation.ts` | **b1 → b2 → b3 (pillar reorgs) → ia-b1 → ia-b6 → b5 (final fallback cleanup)** | SERIAL. Pillar owners reorg first; ia-* remove orphan fallbacks; b5 does the final dead-leaf audit. Only remove the lines your item owns; do not reorder SECTIONS. |
| `app/src/components/practice/SpeechCoachTab.tsx` | **p2-10 (scoring path) → p2-7 (phonics, reuse path) → m7 (primitive adoption)** | SERIAL. p2-10 stabilizes startRecording/scoreUtterance; p2-7 reuses with level:'sound'; m7 adopts ChoiceTile. Insert whole SectionCard blocks to avoid line-overlap. |
| `app/src/lib/reportExport.ts` | **b3 → c3 (buildReport) → p2-8 (screening case) → p2-hero (optional heroImageUrl) → mk-p0-3 / mk-p2-6 (branded renderer beside buildReport)** | SERIAL. One clinical exporter shared by all. Add optional fields/cases only; p2-hero adds the brand-lockup img after c3's restructure settles. |
| `app/src/components/sections/Reports.tsx` | **b3 → c3 → p2-8 (screening read) → p2-hero (heroImageUrl arg)** | SERIAL append-only. b3 owns Consult/Handoff reorg; later items add useChildCollection reads + export args. |
| `app/src/components/profile/AvatarCreator.tsx` | **p2-9 (photo-mode gate + child prop) → p4 (useGenerative migration) → mk-p0-3 (share renderer)** | SERIAL. p2-9's prop/signature change lands first; p4 migrates the generate() path; mk-p0-3 builds share downstream of `result`. |
| `app/src/server/childAsr.ts` | **p2-9 (comment-only gate note) → p2-10 (actual hasConsent wiring + vendor schema)** | SERIAL but disjoint regions: p2-9 edits header comment only; p2-10 wires the call-site. |
| `app/src/practice/signals.ts` | **p2-6 (append practiceGapDomains) → p2-10 (append phonemeAccuracy) → p2-7 (eventAccuracy kind-lists)** | PARALLEL-SAFE (append at end, no reorder). |
| `app/src/components/layout/MobileNav.tsx` | **m1 → p3** | SERIAL. m1 safe-area; p3 tap-target polish. |
| `app/src/lib/native.ts` | **m1 → p2-6 (notification channel) → surf-ios / surf-android** | SERIAL. Append new try/catch blocks inside initNativeShell; never reorder status-bar/keyboard/splash blocks. surf-android reconciles StatusBar.setBackgroundColor under edge-to-edge. |
| `app/src/components/tabs/OverviewTab.tsx` (Today) | **b1 → ia-b1 (mission block) → c1 (rhythm) → c2 (daily-play handler) → c4 (dev-score strip) → p2-6 (jitai section) → m5 (error triad) → b5 (moat copy)** | SERIAL. b1 defines the spine + tenant slots; each later item edits its own scoped `<section>` only. High contention — do not parallelize. |
| `app/src/components/tabs/DevelopmentTab.tsx` (Grow) | **p2-5 → c4 → p2-6 (new element above DevScoreCard) → b2** | SERIAL. Keep edits to distinct render regions; do not touch HubTabs panel list (b2 owns IA). |
| `app/src/components/sections/DevScoreCard.tsx` | **c4 (labels/persistence) → p2-5 (header row) → p2-hero (avatar header)** | SERIAL. One header-row insertion each; leave score logic untouched. |
| `landing EN (arbor-marketing-landing-page-en.html)` | **mk-landing-parity-rebuild (REWRITE) → mk-p0-1 → mk-p0-5 → mk-p2-1 → p3 (polish, re-read first)** | SERIAL. Parity rebuild is wholesale; patches follow; p3 polishes LAST and must re-read the file immediately before editing. |
| `landing HE (arbor-marketing-landing-page-he.html)` | **mk-delete-stale-landing → mk-landing-parity-rebuild → mk-p0-5 → mk-p1-* entry points → p3** | SERIAL. Delete stale first, then rebuild, then patch, then polish. |
| `app/src/context/ProfileContext.tsx` | **mk-p0-4 → p2-9 (only if updateChild must re-throw — coordinate)** | SERIAL. updateChild currently swallows errors; p2-9's revert-on-failure needs coordination (see §7). |

---

## 4. Parallelization guide

**Can run concurrently (different surfaces / disjoint files):**

- **Batch A (Wave 0):** `mk-p0-4` ‖ `p4` ‖ `p2-9` ‖ `mk-landing-parity-rebuild` — different files entirely. (`m4`→`m2` run serially alongside as the CSS chain.)
- **Batch B (Wave 1):** `m3-hex-sweep` ‖ `b2-mychild-story-spine` ‖ `mk-p0-2` ‖ `mk-p0-3` ‖ `mk-p0-5` — disjoint files. (`m1`→`m5`→`m7` and `b1` run as their own serial threads.)
- **Batch C (Wave 2):** `b3` ‖ `p2-5` ‖ `ia-b6` ‖ `surf-ask` can run together; but `c1`/`c2`/`ia-b1`/`c4`/`p2-6` are **serial on `OverviewTab.tsx`** and `c3`/`p2-hero` are **serial on `reportExport.ts`**.
- **Batch D (Wave 3):** `surf-ios` ‖ `surf-android` ‖ `surf-academy` ‖ `b4` are disjoint and parallel; `p2-10`→`p2-7` serial on SpeechCoachTab; `p3` strictly last.
- **Batch E (Wave 4):** all content-only `mk-*` assets parallelize (marketing folder, no app code), except the i18n-touching ones (`mk-p0-8`, `mk-p2-1`, `mk-p2-7`) which append-only-coordinate, and the landing-file patches which serialize per §3.

**Must be serial (same hot file, real clash):**

1. The **`index.css` chain** (m4→m2→m1→m5→m7→p3) — the master constraint.
2. The **`OverviewTab.tsx` Today chain** (b1→ia-b1→c1→c2→c4→p2-6→m5→b5).
3. The **`reportExport.ts`/`Reports.tsx` clinical-export chain** (b3→c3→p2-8→p2-hero→mk-p0-3/mk-p2-6).
4. The **`api.ts` request-helper chain** (p4 first; then additive edits parallelize).
5. The **`navigation.ts` IA chain** (b1/b2/b3→ia-b1/ia-b6→b5).
6. The **landing-file chains** (rebuild→patches→p3) per file.
7. The **SpeechCoachTab chain** (p2-10→p2-7→m7).

---

## 5. Blocked / gated items

| id | Gate type | What unblocks it |
| :-- | :-- | :-- |
| **mk-p0-1-domain** | Guy / spend | Guy buys the domain + adds Firebase custom domain + verifies HTTPS green. Step 4 (canonical switch) blocked until HTTPS confirmed. No viral asset ships pointing at a `web.app` URL, so this gates all P1 link strings. |
| **p2-10-kid-asr** | Vendor + consent | (a) `p2-9-coppa-consent` must land first and export the concrete `hasConsent` fn + consent-settings route the CTA points to; (b) SoapBox vendor license + API docs needed before the real per-phoneme schema/fixture can be written. **Rescope:** ship Whisper-honesty + UI states + on-device-only NOW; defer the phoneme-mapping slice (acceptance #2/#5/#6/#8) until consent + vendor land. |
| **p2-8-red-flag-monitoring** | Consent + reconcile | Depends on `p2-9` (`hasConsent(child,'share_trusted')` gate, currently absent). **Also must be rewritten** to reconcile with the existing `lib/monitoring.ts` (Mission M8) — the spec is unaware a monitoring layer already ships. Do NOT build a parallel monitoring strip. |
| **p2-11-mimic-mediapipe** | Consent | Camera/face path gated on `p2-9` consent scope (`child_face`). Unblocks when p2-9 lands. |
| **avatar photo mode** (in AvatarCreator) | Consent | `p2-9` `photo_avatar` scope gate. |
| **mk-p1-2 / mk-p1-3 / mk-p1-5 / mk-p1-7** | Guy ops | Social accounts (IG/TikTok/YouTube `@arbor.family`) + Metricool connection are Guy-blocked (EXECUTION-TRACKER Milestone D). Playbooks ship paste-ready regardless; execution waits on accounts. |
| **mk-p2-3 / mk-p2-4 (paid spend)** | Loop-health verdict | `mk-p1-6` must read **GREEN** (K ≥ 0.4, activation ≥ floor) per GTM kill/double rule. No paid euro until the loop is instrumented and one artifact has branded share export (`mk-p0-3`). |

**Decisions Guy must make:** (1) domain purchase + DNS; (2) SoapBox kid-ASR vendor license; (3) approve the consent-gate privacy model in `p2-9` (the descriptor-vs-photo question in §7); (4) social account creation; (5) confirm the paid-spend trigger threshold.

---

## 6. Per-item index

| id | title | wave | verdict | depends-on | spec |
| :-- | :-- | :-: | :-- | :-- | :-- |
| m4-retire-override-layer | Retire dead override layer | 0 | build-ready | — | [spec](specs/m4-retire-override-layer.md) |
| m2-token-extraction | Token extraction | 0 | build-ready | m4 (reverse) | [spec](specs/m2-token-extraction.md) |
| mk-p0-4-analytics-wiring | Analytics wiring | 0 | build-ready | — | [spec](specs/mk-p0-4-analytics-wiring.md) |
| p4-operational-hardening | Operational hardening | 0 | needs-revision | — | [spec](specs/p4-operational-hardening.md) |
| p2-9-coppa-consent | COPPA consent | 0 | needs-revision | — | [spec](specs/p2-9-coppa-consent.md) |
| mk-landing-parity-rebuild | Landing parity rebuild | 0 | build-ready | — | [spec](specs/mk-landing-parity-rebuild.md) |
| m1-ios-safe-area | iOS safe-area | 1 | build-ready | m4, m2 | [spec](specs/m1-ios-safe-area.md) |
| m5-touch-error-states | Touch + ErrorState | 1 | build-ready | m1 | [spec](specs/m5-touch-error-states.md) |
| m7-playkit-completeness | PlayKit completeness | 1 | build-ready | m2 | [spec](specs/m7-playkit-completeness.md) |
| m3-hex-sweep | Hex sweep | 1 | build-ready | m2 | [spec](specs/m3-hex-sweep.md) |
| b1-daily-home | Daily Home | 1 | build-ready | — | [spec](specs/b1-daily-home.md) |
| b2-mychild-story-spine | My Child story spine | 1 | build-ready | — | [spec](specs/b2-mychild-story-spine.md) |
| mk-p0-2-referral-loop | Referral loop | 1 | build-ready | mk-p0-4 | [spec](specs/mk-p0-2-referral-loop.md) |
| mk-p0-3-share-export | Share/export | 1 | build-ready | mk-p0-4 | [spec](specs/mk-p0-3-share-export.md) |
| mk-p0-5-attribution-utm | Attribution/UTM | 1 | build-ready | mk-p0-4 | [spec](specs/mk-p0-5-attribution-utm.md) |
| c1-rhythm | Rhythm | 2 | build-ready | b1 | [spec](specs/c1-rhythm.md) |
| c2-daily-play | Daily Play | 2 | build-ready | b1 | [spec](specs/c2-daily-play.md) |
| ia-b1-fold-missions | Fold Missions | 2 | build-ready | b1 | [spec](specs/ia-b1-fold-missions.md) |
| c3-ask-specialist | Ask-a-Specialist | 2 | build-ready | mk-p0-4 | [spec](specs/c3-ask-specialist.md) |
| b3-care-consult | Care/Consult | 2 | build-ready | — | [spec](specs/b3-care-consult.md) |
| c4-dev-score | Development Score | 2 | build-ready | p2-5 | [spec](specs/c4-dev-score.md) |
| p2-5-milestone-rebase | Milestone rebase | 2 | needs-revision | — | [spec](specs/p2-5-milestone-rebase.md) |
| p2-hero-everywhere | Hero everywhere | 2 | needs-revision | p4, c3 | [spec](specs/p2-hero-everywhere.md) |
| p1-comic-reader | Comic reader | 2 | needs-revision | p4 | [spec](specs/p1-comic-reader.md) |
| ia-b6-ask-from-ask | Ask-from-Ask | 2 | build-ready | — | [spec](specs/ia-b6-ask-from-ask.md) |
| surf-ask | Ask conformance | 2 | build-ready | — | [spec](specs/surf-ask.md) |
| surf-ios | iOS conformance | 3 | build-ready | m1 | [spec](specs/surf-ios.md) |
| surf-android | Android conformance | 3 | build-ready | m1 | [spec](specs/surf-android.md) |
| surf-app-shell | App-shell conformance | 3 | build-ready | b5 | [spec](specs/surf-app-shell.md) |
| surf-academy | Academy conformance | 3 | build-ready | p1, m3 | [spec](specs/surf-academy.md) |
| b4-practice-vs-dailyplay | Practice vs Daily Play | 3 | build-ready | c2 | [spec](specs/b4-practice-vs-dailyplay.md) |
| b5-naming-moat-exposure | Naming & moat | 3 | build-ready | — | [spec](specs/b5-naming-moat-exposure.md) |
| p2-6-jitai | JITAI nudge engine | 3 | needs-revision | p4, p2-5 | [spec](specs/p2-6-jitai.md) |
| p2-10-kid-asr | Kid phoneme ASR | 3 | blocked | p2-9 (+vendor) | [spec](specs/p2-10-kid-asr.md) |
| p2-7-phonics-tracing | Phonics/tracing | 3 | needs-revision (rescope) | p2-10 | [spec](specs/p2-7-phonics-tracing.md) |
| p2-11-mimic-mediapipe | Mimic/MediaPipe | 3 | needs-revision | p2-9 | [spec](specs/p2-11-mimic-mediapipe.md) |
| p2-8-red-flag-monitoring | Red-flag monitoring | 3 | blocked (rescope) | p2-9, c3 | [spec](specs/p2-8-red-flag-monitoring.md) |
| p3-ios-grade-audit | iOS-grade audit | 3 | needs-revision | m4,m2,m1,m5,landing | [spec](specs/p3-ios-grade-audit.md) |
| mk-delete-stale-landing | Delete stale landing | 4 | build-ready | — | [spec](specs/mk-delete-stale-landing.md) |
| mk-p0-1-domain | Domain + HTTPS | 4 | blocked (Guy) | — | [spec](specs/mk-p0-1-domain.md) |
| mk-p0-6-creator-list | Creator roster | 4 | build-ready | — | [spec](specs/mk-p0-6-creator-list.md) |
| mk-p0-7-template-kit | Template kit | 4 | build-ready | — | [spec](specs/mk-p0-7-template-kit.md) |
| mk-p0-8-copy-pack | Copy pack + i18n | 4 | build-ready | — | [spec](specs/mk-p0-8-copy-pack.md) |
| mk-p1-6-loop-optimization | Loop optimization | 4 | build-ready | mk-p0-4 | [spec](specs/mk-p1-6-loop-optimization.md) |
| mk-p1-1-avatar-challenge | Avatar challenge | 4 | build-ready | mk-p0-3 | [spec](specs/mk-p1-1-avatar-challenge.md) |
| mk-p1-2-creator-seeding | Creator seeding | 4 | build-ready (Guy ops) | mk-p0-1/2/3 | [spec](specs/mk-p1-2-creator-seeding.md) |
| mk-p1-3-whatsapp-fb-playbook | WhatsApp/FB playbook | 4 | build-ready | mk-p0-2 | [spec](specs/mk-p1-3-whatsapp-fb-playbook.md) |
| mk-p1-4-aeo-seo-he | AEO/SEO HE | 4 | build-ready | — | [spec](specs/mk-p1-4-aeo-seo-he.md) |
| mk-p1-5-owned-social-he | Owned social HE | 4 | build-ready (Guy ops) | mk-p0-7 | [spec](specs/mk-p1-5-owned-social-he.md) |
| mk-p1-7-youtube-shorts-he | YouTube Shorts HE | 4 | build-ready (Guy ops) | mk-p0-7 | [spec](specs/mk-p1-7-youtube-shorts-he.md) |
| mk-p2-1-localize-nl | NL localization | 4 | build-ready | mk-p0-8 | [spec](specs/mk-p2-1-localize-nl.md) |
| mk-p2-2-nl-communities | NL communities | 4 | build-ready | mk-p2-1 | [spec](specs/mk-p2-2-nl-communities.md) |
| mk-p2-3-paid-amplifier | Paid amplifier | 4 | gated (loop GREEN) | mk-p0-4 | [spec](specs/mk-p2-3-paid-amplifier.md) |
| mk-p2-4-en-launch-appstore | EN launch + App Store | 4 | gated (loop GREEN) | mk-p1-6 | [spec](specs/mk-p2-4-en-launch-appstore.md) |
| mk-p2-5-pr-push | PR push | 4 | build-ready | mk-p0-5 | [spec](specs/mk-p2-5-pr-push.md) |
| mk-p2-6-growth-card | Growth card | 4 | build-ready | mk-p0-3, p4 | [spec](specs/mk-p2-6-growth-card.md) |
| mk-p2-7-paywall-experiments | Paywall A/B | 4 | build-ready | — | [spec](specs/mk-p2-7-paywall-experiments.md) |
| mk-p2-8-youtube-evergreen | YouTube evergreen | 4 | build-ready | mk-p1-7 | [spec](specs/mk-p2-8-youtube-evergreen.md) |

---

## 7. Top risks & must-fix issues

**Highest-severity (fix before/while building):**

1. **`p2-7-phonics-tracing` & `p2-8-red-flag-monitoring` propose building features that ALREADY EXIST.** `p2-7` is unaware of `EarlyReadingTrack.tsx` (362 lines, live at SpeechCoachTab:510) + `literacy.ts`, and of the working `LetterTrace` tracer. `p2-8` is unaware of `lib/monitoring.ts` (Mission M8) + the live Screening.tsx monitoring SectionCard. **Both must be rewritten as enhancements, not greenfield builds**, or they will ship duplicate UIs. Mark `feasible:false` until reconciled.

2. **`p2-hero-everywhere` privacy gate is built on a misreading of `types.ts`.** Spec treats `avatar.source==='photo'` as a raw uploaded photo that must never enter a clinical PDF, but the type comment says BOTH `descriptor` and `photo` are stylized AI avatars (raw photo never stored). The descriptor-only gate would silently suppress the hero for the majority of children. **Must:** read `AvatarCreator.tsx` + the generate-avatar payload to confirm what `photoUrl` holds, then re-base the gate on "is this a generated avatar at all" and rewrite acceptance #4. Also disambiguate the `isGenerated` semantic flip (add a separate `isPrivacySafe` boolean).

3. **`p4-operational-hardening` parity test is not implementable as written** (ActiveTab is a TS type, erased at runtime; VALID_TABS not exported). Must export `VALID_TABS`, use a compile-time exhaustiveness check, and put the runtime test in a new `arborRouting.test.ts`. Also: the image-meter quota pre-check has no data source — deliver the avatar quota state via the **error-classification path** (caught 429 → `status:'quota'`), not the pre-check.

4. **`p2-10` & `p2-8` are hard-blocked on `p2-9` which has not landed** — `hasConsent` + `lib/consent.ts` do not exist yet (grep: zero hits). Land `p2-9` first; it must export the concrete consent fn + Consent Center route those specs consume. `p2-10` is additionally blocked on the SoapBox vendor license/docs (fixtures cannot be written honestly without them).

5. **`p2-9` AC #6 (revert-on-save-failure) is dead code** — `ProfileContext.updateChild` swallows errors and never rejects. Either drop the revert clause or coordinate a `ProfileContext.tsx` edit to re-throw (shared file — serialize).

6. **`p1-comic-reader` "4-page book" has no defined beat source** — the real ADVENTURES array has one theme per adventure; the backend renders a single panel. Must specify how N beat prompts are produced (explicit `beats[]` array or a journey-generator call) before building. Also: register a real `@capacitor/app` `backButton` listener (none exists today) and the additive `api.ts` payload fields are functionally dead (server ignores unknown fields).

**Cross-cutting risks:**

- **`index.css` is the #1 conflict magnet** — the m4→m2→m1→m5→m7→p3 serial order is non-negotiable. A single out-of-order PR breaks the design system for every downstream UI item.
- **Multiple specs name the wrong i18n file** (`LanguageContext.tsx` instead of `lib/i18n.ts`). Every copy/i18n edit targets `lib/i18n.ts`; this also pulls `p2-5`/`p2-6`/`p2-9` into conflict with `mk-p0-8`/`mk-p2-1`/`mk-p2-7` (append-only, coordinate with the copy-pack owner mk-p0-8).
- **Line-number drift is pervasive** across P-track specs (Shell.tsx, ArborContext.tsx, Screening.tsx off by 3–50 lines). Builders must anchor to unique code snippets / symbol names, not bare line numbers.
- **Stale test-count baseline** — specs cite "241 tests"; the live suite is ~321. Use `npm test` (vitest, `scripts/vitest.config.mjs`) and `npx tsc --noEmit` (there is no `typecheck` script).
- **Paid-spend leak risk** — do not let any P2 paid campaign start before `mk-p1-6` reads GREEN; the loop must be instrumented (`mk-p0-4`) and one artifact must have branded share export (`mk-p0-3`).
