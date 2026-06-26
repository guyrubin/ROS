# Arbor Design-Enhancement Backlog

**Source:** Multi-agent design audit (8 specialist lenses, 77 findings), 2026-06-26.
**Bar:** exceed the "Arbor Web App" prototype (claude.ai/design `6ddac523`) — use it as reference only; take every surface to the next level. PARENT keeps the **Clalit/Maccabi clinical-trust** register (calm, trusted, green/sapphire, medical authority) and is *enhanced*, never toyish. KID stays playful/avatar-led/viral. IA top-level + viral; flows delightful; imagery shareable; everything functions.
**Audit lenses:** IA/flow · parent-visual · kid-visual · capability-depth · brand/clinical-trust · imagery-virality · functionality · HE/RTL.

> Companion to [[PRODUCT-BACKLOG]] (canonical). P3 new-dev items are tagged to feed PRODUCT-BACKLOG as feature requests.

## Verdict

Phase 1 (Today + sidebar) shipped the *worst* surface, but the audit shows the **"messy" you still see is one root cause on the PARENT surface**: design tokens are not enforced. The parent app paints in ~12 un-tokensed hex literals, has no real type scale (13 arbitrary px sizes), flat elevation everywhere (all `shadow-sm`), and a **split-brand palette** — the active nav is green while the rest of the brand is sapphire, and the chrome runs a different palette than the content. That incoherence *is* the mess. The single biggest lever: **establish one Clalit/Maccabi clinical-trust token system (sapphire + Clalit/Maccabi green, navy ink, WCAG-AA contrast, type scale, elevation scale) and sweep the parent surface onto it.** The KID surface's gap is different and bigger: the **viral share loop is stubbed** — the shareable moment never leaves the app, which is the brand's stated growth engine.

## 🆕 Session 2026-06-26 — waves 5–8 shipped to prod

Incremental prod delivery behind the canary pipeline (each wave: lint + build + eval:safety + test green, then merge→main→promote→hosting, ~6 min). All four confirmed LIVE on `arborparentingapp.com`.

- **Wave-5 `03d13d9`** — closed the parent-surface hardcoded-English gap: `BehaviorsTab` export + `ChildProfile` + `PlansTab` + `SpeechCoachTab` (119 i18n keys en+he). *(Localization ✅)*
- **Wave-6 `837afc5`** — SchoolBrief per-section parent edit: editable overview + add/remove per list section, every edit resets per-export approval, export built from the edited draft so the clinical-term scan covers edits. Safety-cleared (arbor-safety, 9 constraints, eval:safety green, +8 tests → 1136). *(P2 SchoolBrief ✅)*
- **Wave-7 `fdc743a`** — Masterclasses UI-chrome i18n sweep (9 keys) — finishes the parent-surface localization wave-5 started. *(Localization ✅)*
- **Wave-8 `d71cda7`** — Masterclasses capability-depth: private reflection card (client-only localStorage, privacy-hinted) + catalog progress bar + brand-colored completion confetti (reduced-motion-respecting). *(P2 Masterclasses 🟡 partial — reflection→coach feed deferred, claims-sensitive)*

---

## ✅ Phase 1 — SHIPPED to prod (main `e5f4d81`, PR #34, 2026-06-26)
- Today screen reconciled to the prototype's 4-card calm layout (14 sections → guidance hero + dev-ring / kid-activity + coach / JITAI / folded daily-tools). Dev-ring made honest (real %, focus-domain, reached-of-total). [OverviewTab.tsx]
- Sidebar folded 6 → 5 destinations (Ask Arbor → top-bar action). [navigation.ts, navigation.test.ts]
- Firebase CI deploy fix **CONFIRMED** (ADC, no `--token`) — first clean main→prod auto-deploy since runs #94/#95.

---

## 🔵 Phase 2 (P1) — Quick wins, deployable now (Tier A/B, no new dev)
*Root-cause + register fixes. Each independently shippable behind the canary pipeline.*

### P1.0 — Design-token foundation + sweep  ← **the root-cause fix for "messy"**
> **🟢 Status 2026-06-26 (verified post-wave-8):** the **token layer + the hex-literal sweep are substantially SHIPPED.** `tokens.ts` carries a full typed `CSS_VARS` mirror of `index.css :root`/`.arbor-parent` (incl. documented prior "m3-hex-sweep" + "AP-043 design-token sweep" passes, `--arbor-on-accent`, `--arbor-paper-tinted`, etc.). A directory-wide hex scan of the parent `sections/` found literals in only **legitimate literal-only contexts** (recharts SVG series fills in `PhysicalGrowthCard`, `#fff`-on-accent button text) + one stray tint (`#eef6f1` in `Strengths` → `--arbor-paper-tinted`). The "messy" literals this section originally cited (`#14225a`/`#7c8983`/`#8a958e`/`#eef3fb`/`#fbfdfc`) appear in **no** sections file — the sweep landed. **NOTE — the [4|S] "unify primary to sapphire" item is ON HOLD:** it conflicts with Guy's standing directive to **keep the Clalit/Maccabi green** clinical-trust register; flipping the primary hue is a user-gated brand decision, not an autonomous one.
- **[5|M]** Consolidate ~12 un-tokensed hex literals (esp. OverviewTab `#14225a`/`#7c8983`/`#8a958e`/`#eef3fb`/`#fbfdfc`, sidebar, section cards) into the `.arbor-parent` token layer. The muddy palette is the root cause of "messy."
- **[4|M]** Establish a real **type scale** (replace the 13 arbitrary px sizes 9.5–26px on Today with a 6-step token scale: caption/sm/body/md/lg/display).
- **[4|S]** Establish an **elevation scale** — every card is `shadow-sm`; give the primary hero `shadow-md`/`shadow-lg` so hierarchy reads. [OverviewTab.tsx:236/314/342/401]
- **[4|S]** **Unify primary color to sapphire** — active nav is green while the brand is sapphire (primary-color schizophrenia). Make nav-active sapphire. [Sidebar.tsx, MobileNav.tsx, Shell.tsx sub-nav]
- **[3|S]** Fix **WCAG-AA contrast** — muted grey `#8a958e` fails AA for body/captions across parent surfaces; darken to a token that passes.
- **[3|S]** Lift **clinical-navy ink** (`#14225a`) out of `.arbor-parent` lock to a global heading token so headings aren't near-black outside the scope.
- **[3|M]** Replace the **AI-generic hero gradient** (blue→lilac) with a Clalit/Maccabi medical-trust gradient (sapphire + a calm clinical green) on the Today hero band.
- **[5|M]** **Unify chrome palette with content** — chrome runs a less-clinical palette than the content pane (split-brand trust). One palette, top to bottom.

### P1.1 — IA / flow quick wins
- **[5|M] ✅ ADDRESSED THIS PASS** **Arbor AI was taking over the entire Overview** — the AI focus text rendered in THREE places on Today (the hero focus well, the coach-card body, AND the daily-play empty state), so the AI voice dominated the whole home screen. Rebalanced: the AI focus now lives in ONE bounded place (the hero well, `line-clamp-3` + read-more); the coach card shows a static invite (`coach.ready`) and the daily-play empty state shows a play placeholder instead of re-echoing the focus. AI is one voice on Today, not three — the human data (streak, dev-ring, kid-activity, rhythm) reclaims the screen. [OverviewTab.tsx:376,413]
- **[4|M]** **Bedtime Stories orphan**: fully-built (backend endpoint + 470-line tab) with **zero nav entry**. Wire it into nav (Academy, or a Today JITAI entry). [BedtimeStoriesTab.tsx]
- **[4|M]** **Mobile can't launch Kid Mode** — entry is desktop-only (`Topbar` hidden `md:flex`). Add a mobile Kid Mode entry. [Topbar.tsx, MobileNav.tsx]
- **[3|S] ✅ FIXED 2026-06-26** **Ask Arbor has no persistent entry** — was reachable only from in-context CTAs inside other tabs, despite navigation.ts asserting a "top-bar action." Added shared `<AskArborButton>` (mirrors KidModeButton): solid-sapphire primary pill in the desktop Topbar + compact icon in the mobile accessories row. The nav contract is now TRUE on both surfaces. [AskArborButton.tsx, Topbar.tsx, Shell.tsx]
- **[3|M]** **Mobile Today buries the dashboard** (check-in/goals/reminders/trends) behind one collapsed toggle. Surface at least the check-in on mobile.
- **[2|S] ✅ FIXED 2026-06-26** **Topbar duplicates the sidebar brand** (logo + "Arbor" wordmark) — wasted prime real estate. Topbar left zone now shows the mark + the ACTIVE SECTION label ("Today" / "My Child" / …) = orientation, not a duplicate wordmark. (The [2|S] sub-nav breadcrumb is largely covered by this — the Topbar now carries the section context.)
- **[2|S]** ~~Sub-nav has no back-to-section-home / breadcrumb~~ — largely addressed by the Topbar section label above; full sub-nav breadcrumb deferred as low-value.

### P1.2 — Functionality quick wins
- **[3|S] ✅ FIXED 2026-06-26** **Masterclasses "Open Masterclasses" CTA was a dead button** — `AcademyForYou` is only ever rendered ON the Masterclasses page, so the "Open Masterclasses" CTA pointed at the page you were already on (no-op handler). Removed the vestigial `onNavigateToMasterclasses` prop; the CTA no longer renders. The course catalog + Scholar Hub + For-You recommendations all remain. [Masterclasses.tsx]
- **[2|S] ✅ INVESTIGATED — WORKING (downgraded to polish)** Coach "Teacher note" handoff: the note **IS** copied — `CoachAnswerCards` calls its own `copy(note, "handoff")` (real clipboard write) before `onAddToHandoff(note)`, so the toast ("Teacher note copied — paste it into your Consult summary") is accurate, not a lie. The only nit is a minor message dedupe (the in-card "Copied note" label is invisible post-navigation, so the toast carries the feedback). Not a dead button; not blocking. [CoachTab.tsx:490, CoachAnswerCards.tsx:299]

---

## 🟡 Phase 3 (P2) — Capability design-depth lifts (medium effort, some new dev)
*Take each capability from "shallow/placeholder" to deepest level.*

- **[3|M] ✅ SHIPPED 2026-06-26 (main `cf11930`)** **Development Map = a number list** → built the prototype's signature **dev-radar ring** (`DevRadarRing.tsx`: radial polar domain map; sapphire polygon fills to milestones-reached per spoke, green success-accent on strong domains; parent clinical-trust register, `role=img`+aria, one-shot motion gated by reduced-motion, RTL-safe SVG coords). DevScoreCard swaps the flat bars for the ring; headline score + clinical copy preserved. Built via **arbor-design agent**.
- **[3|L]** Dev ring + growth charts are **flat conic bars** → real data viz (the Grow/My Child centerpieces). [DevScoreStrip, TrendsChart]
- **[4|M]** **Today lost the live kid-activity sync card** — the prototype's one differentiator vs. a static dashboard. Restore a live "what your child did" sync surface. [OverviewTab.tsx]
- **[3|M]** **Coach is reactive only** → proactive "Arbor noticed…" surfacing into the conversation (from logged patterns).
- **[3|M]** **Behaviors pattern analysis is a dead-end report** → it should generate a plan or coach action, not just display.
- **[2|M] ✅ SHIPPED 2026-06-26 (wave-6, main `837afc5`)** **SchoolBrief** per-section parent edit — editable overview (textarea) + add/remove on each list section (keyStrengths, classroomChallenges, languageSupportPlan, suggestedTeacherStrategies); every edit resets the per-export approval; the export is built from the *edited* draft so the clinical-term fail-closed scan still covers parent edits. Safety-cleared (9 constraints, eval:safety green, +8 tests → 1136 total).
- **[2|M] 🟡 PARTIAL 2026-06-26 (wave-8, main `d71cda7`)** **Masterclasses** were read-only articles → **private reflection + completion celebration NOW LIVE**: an optional "moment to reflect" card (client-only localStorage, privacy-hinted — never sent or stored server-side), a catalog progress bar, and a brand-colored completion burst (reduced-motion-respecting). **Still open:** the reflection→coach feed (the "feeds coaching" half) is proactive-coach-adjacent and claims-sensitive → deferred to the safety/clinical gate, not built autonomously.
- **[3|M]** **Celebrations are generic** (same confetti every win) + **[3|S] no haptics** anywhere in kid surface + Daily Play completion writes to the moat but doesn't visibly celebrate/advance the hero.
- **[3|M]** **World-scene art generated once + static** → no parallax/motion/scene life. [kid surfaces]
- **[4|M]** **Share card is a flat green wash** with a plain "Made with Arbor" wordmark → a premium, covetable brand frame.
- **[4|M]** **imagePrompts are thin one-liners** → scenes read as generic backdrops; compose richer hero moments.
- **[3|S]** No **character/scene style lock** across surfaces (comic-hero avatar can pair with watercolor story scene). Lock one style.
- **[3|S]** **ProvenanceBadge** reads as a *warning* ("AI-made") not a quality+trust badge → reframe as a trust mark.
- **[2|M]** Avatar descriptor = 4 free-text fields → low craft, inconsistent results; raise input craft, use the "personality/vibe" field.
- **[3|M]** **Kid Mode topbar is clinical, not comic** → breaks the kid register. [Topbar in kid mode]

---

## 🔴 Phase 4 (P3) — NEW-DEV feature requests → feed [[PRODUCT-BACKLOG]]
*Needs real development. These are the "put in the backlog if new dev is needed" items.*

### The viral engine (highest strategic leverage — the brand's stated growth loop)
- **[5|L] Viral comic share loop is STUBBED** — the shareable moment never leaves the app. Build the end-to-end share-to-WhatsApp/IG/sheet pipeline. *(cross-cuts everything below)*
- **[5|L] Share output is a single static PNG** → animated/video share card (the highest-leverage viral format is missing).
- **[5|L] Character consistency is single-shot** → no validation/regeneration loop, so the hero's face **drifts beat-to-beat**. Add a consistency lock/regen loop.
- **[4|L] No multi-panel shareable comic strip** — the single most shareable artifact (3–4 panel mini-story) cannot be produced.
- **[3|L] Kid surface lacks a one-tap "share the hero" viral exit** on completed scenes.
- **[3|M] Avatar creator never shows the hero IN a scene during creation** — the "see your hero in action" moment that drives completion is post-hoc.

### Kid surface depth (engagement)
- **[5|M] Beat Keeper is a silent rhythm game** — no audio at all. Add sound.
- **[4|L] Sprout mascot is a flat static SVG** → a character with personality (motion/voice).
- **[4|L] Arcade worlds are one-screen drills** → levels, maps, world-depth.
- **[3|S] No haptic feedback** in the kid surface.
- **[3|M] No ambient background music / world soundscape.**

### Capability depth (parent)
- **[4|L] Appointments is a free-text notepad** → a real scheduling capability (and **[2|L]** it advertises 5 non-functional stubs — Booking/Payment/Reminders/Video/Insurer — either build or stop advertising).
- **[3|L] FindProfessional consult request is mailto-only** → real booking + status loop.
- **[3|L] Academy lacks a unified learning-progress spine** — Masterclasses, Story Journeys, Hero Comics are 3 disconnected catalogs.
- **[2|L] Family Formation rituals have no completion tracking** — 4 static reference cards.

---

## 🌐 Localization (HE/RTL) — cross-cuts all phases
*Clalit/Maccabi is Israeli — Hebrew must be top-level. P1 quick fixes first, then new-dev.*

- **[4|S] ✅ SHIPPED 2026-06-26 (main `cf11930`)** **Browser-locale detection now live** — `LanguageContext.readLang` honors the browser locale on first visit (he / he-IL / legacy "iw" → Hebrew + RTL; explicit in-app choice always wins, persisted). Implemented directly on main (same outcome as the stranded QA-7 branch). *(P1 quick win)*
- **[4|M] Consent string uses Hebrew slash-form** — gated clinical/consent copy.
- **[3|S] HE marketing landing has no language switcher** — visitors stranded (asymmetric vs EN page). *(P1)*
- **[2|S] ✅ SHIPPED 2026-06-26 (main `cf11930`)** **index.html now sets lang/dir pre-hydration** — inline script (mirrors the detection, stored choice first) sets `<html lang/dir>` before the bundle loads, so Hebrew users see no English/LTR first-paint flash and RTL font stacks apply from first paint. *(P1)*
- **[3|M] ✅ SHIPPED 2026-06-26 (main `03d13d9` + `fdc743a`)** **Hardcoded English on the flagship parent surfaces — fully localized.** Wave-3 (`TrendsChart` all 6 strings + `OverviewTab` 5 strings, 11 keys en+he) → wave-5 closed the four remaining surfaces (`ChildProfile`, `PlansTab`, `SpeechCoachTab`, `BehaviorsTab` export — 119 keys en+he) → wave-7 swept `Masterclasses` UI chrome (9 keys). No more inline `he ? "EN" : "HE"` UI ternaries on the parent surface. (Content bodies that ship bilingual as data fields — e.g. masterclass sections — are unaffected.)
- **[3|M] Accessibility aria-labels are English-only** — HE screen-reader users get English.
- **[3|M] Physical-direction Tailwind classes** (`ml-/mr-/pl-/pr-/border-right/left`) **break RTL in 24+ spots** → convert to logical properties (`ms-/me-/ps-/pe-/border-s/e`).
- **[4|L NEWDEV] Hebrew copy degenerates into אוהב/ת slash-forms** because **child gender is not tracked** → track gender on ChildProfile; gendered HE copy. *(new dev)*
- **[4|L NEWDEV] Kid surfaces bypass the i18n dictionary** — inline `he ? "עב" : "EN"` ternaries with English-only headers → route through i18n.
- **[2|S] Prefix-glued interpolation** `ל{interest}` produces bidi artifacts when the token is an LTR word.

---

## Build order
1. **P1.0 token foundation + sweep** (this turn) — the root-cause fix; unblocks the register coherence everything else depends on.
2. P1.1 + P1.2 IA/functionality quick wins.
3. Localization P1 quick fixes (locale detection, landing switcher, document lang).
4. P2 capability-depth lifts, highest-severity first (dev-radar ring, live kid-activity sync, proactive coach).
5. P3 viral-engine feature requests → feed PRODUCT-BACKLOG for roadmap scoring.

*Every phase ships to prod behind the Arbor canary pipeline (canary → smoke → promote), now that auto-deploy is fixed. Tier-C items (child-data/claims/money/DNS/store/irreversible) get an individual gate, never auto-deploy.*
