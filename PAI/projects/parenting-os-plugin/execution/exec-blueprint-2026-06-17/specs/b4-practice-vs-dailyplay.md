## b4-practice-vs-dailyplay — Practice Studio vs Daily Play line
**Aspects:** IA, Copy · **Surfaces/platforms:** web:Grow · **Priority:** Phase2

> Skill discipline applied: `rubin-os:copywriter` + `design:ux-copy` (microcopy + IA labelling), with `impeccable` for the cross-link interaction. Grounded in the live React app at `PPPPtherapy-/PPPPtherapy-/app/src`, not the html prototypes.

---

### Problem / why

The **Grow** pillar (`SECTIONS[3]` in `navigation.ts:60-70`) has three leaves: `daily-play`, `practice`, `plans`. Two of them — **Daily Play** and **Practice** — are confusable and currently undifferentiated in language, which violates redesign rule B4: *Practice = deliberate drills; Daily Play = the one pushed activity on Home; cross-link, never duplicate.* Concrete failures grounded in the files:

1. **No verbal contract between the two leaves.** Both use the same green register and the `Sprout`/"play" vocabulary. `DailyPlayTab.tsx:91-98` opens with the eyebrow `play.libEyebrow` = "Daily Play" and `PracticeHubTab.tsx:6-8` has only a *code comment* explaining the split ("Practice now holds exactly the deliberate skill drills") — that distinction never reaches the user. A parent landing on either tab cannot tell why both exist.
2. **`PracticeHubTab` has no header at all.** It renders straight into `HubTabs` (`PracticeHubTab.tsx:17-26`) — no title, no one-line "what this is for." The four drill panels (Adventures, Feelings, Speech, Mimic) appear with zero framing. There is nothing that says "deliberate practice" vs "today's idea."
3. **Risk of duplication, not cross-link.** `DailyPlayTab` already surfaces 4 picks + courses + readiness tracks (`DailyPlayTab.tsx:145-156`). With no guardrail, future missions (e.g. `c2-daily-play`) could pull drill-style content into Daily Play or push activity-library content into Practice, collapsing the line. There is currently **no cross-link in either direction** — a parent who wants to *drill* a skill from a Daily Play idea has no path to Practice, and vice-versa.
4. **The "one pushed activity" promise is only half-kept.** The single hero pick correctly appears on Today (`OverviewTab.tsx:320-328`, `dailyPlay` slot) — that part is right. But Daily Play's own header copy (`play.libSubtitle`) doesn't acknowledge that Today already shows "today's one," so the relationship between Home and the library is invisible.

**Goal:** Make the IA line legible *in language and structure*, not just in code comments. Give Practice a proper header that names it as deliberate drills. Re-voice Daily Play so it reads as the everyday-ideas library whose single best pick is pushed to Today. Add a **single reciprocal cross-link** between the two (Daily Play → "Want to drill a skill? Practice"; Practice → "Looking for a quick idea? Daily Play") so they reference each other and never duplicate. Calm/premium parent register, no dark patterns.

---

### Scope across platform domains

- **Web · `web:Grow`** (only surface in scope): Edit `PracticeHubTab.tsx` (add header + cross-link), `DailyPlayTab.tsx` (re-voice subtitle + add reciprocal cross-link), and append i18n keys in `i18n.ts` (EN + HE). Optionally tighten the one-line `select.ts` selector doc-comment so the contract is documented at the data layer too (no logic change).
- **iOS (Capacitor) / Android (Capacitor):** Same React surface, no separate code. Both new cross-link rows must meet ≥44×44px touch targets and respect existing safe-area handling from the Shell (no `Shell.tsx`/`index.css` edits here).
- **Landing EN / Landing HE (RTL):** Out of scope. No `html/` edits. (RTL still matters in-app — see RTL note below.)

---

### IA / Copy detail (build-level)

#### A. Practice — give it a header that names "deliberate drills" (IA + Copy)

`PracticeHubTab.tsx` currently renders `<HubTabs>` directly with no framing. Add a `<header>` above the hub, mirroring the `DailyPlayTab` header pattern (`DailyPlayTab.tsx:89-99`) for visual consistency but with the **Target** icon (already the Practice nav icon, `navigation.ts:67`) and the deliberate-practice voice.

New markup at the top of `PracticeHubTab` return (wrap existing `HubTabs` in a `<div className="space-y-5 max-w-[1080px]">`):

```tsx
<header>
  <span className="inline-flex items-center gap-1.5 text-[13px] font-bold" style={{ color: "var(--arbor-green-ink)" }}>
    <Target className="w-3.5 h-3.5" /> {t("practice.eyebrow")}
  </span>
  <h1 className="text-[1.6rem] font-extrabold leading-tight mt-0.5" style={{ fontFamily: "var(--font-display)", color: "var(--arbor-ink)" }}>
    {t("practice.title", { name: firstName })}
  </h1>
  <p className="text-sm mt-1.5" style={{ color: "var(--arbor-muted)" }}>
    {t("practice.subtitle")}
  </p>
</header>
```

Requires importing `Target` from `lucide-react` and `useArbor` (for `childProfile.name` → `firstName`) into `PracticeHubTab.tsx`.

Copy (the contract-defining strings — Practice = deliberate, targeted, repeatable):
- `practice.eyebrow` (EN): `"Practice"`
- `practice.title` (EN): `"Targeted practice for {name}"`
- `practice.subtitle` (EN): `"Focused, repeatable drills for one skill at a time — speech sounds, feelings, mimicking, adventures. Pick a drill and stay with it."`

#### B. Daily Play — re-voice so it reads as the everyday-ideas library (Copy)

Daily Play's subtitle should explicitly position it against Practice and acknowledge Today. Replace the value of `play.libSubtitle` so it names the relationship without renaming the tab (keep `play.libEyebrow`/`play.libTitle` unchanged — they are correct):

- `play.libSubtitle` (EN, revised): `"Easy, everyday ideas matched to {name}'s stage and what's come up lately — each uses things you already have at home. Today's top pick is on your Today screen."`

This keeps Daily Play = *broad, low-effort, one-a-day, surfaced on Today*; Practice = *narrow, deliberate, repeated*.

#### C. The reciprocal cross-link (the "cross-link, never duplicate" rule) — IA + Copy + UX

Add **one** cross-link row at the bottom of each tab. Each is a single tappable row that deep-links to the sibling leaf via `setActiveTab`. This is the structural enforcement of B4: the two surfaces *point at* each other instead of copying each other's content.

Shared row pattern (calm, secondary — not a primary CTA, so it never competes with the in-tab green actions):

```tsx
<button
  onClick={() => setActiveTab("<sibling>")}
  className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-[13.5px] font-bold transition active:scale-[0.99] min-h-[44px]"
  style={{ background: "var(--arbor-paper-elevated)", color: "var(--arbor-green-ink)", border: "1px solid var(--arbor-rule)" }}
>
  <Icon className="w-4 h-4" /> {t("<key>")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
</button>
```

- **In `DailyPlayTab.tsx`** (append after the picks grid, `DailyPlayTab.tsx:156`): icon `Target`, `onClick={() => setActiveTab("practice")}`.
  - `play.toPractice` (EN): `"Want to drill one skill? Open Practice →"`
- **In `PracticeHubTab.tsx`** (append after `HubTabs`): icon `Sprout`, `onClick={() => setActiveTab("daily-play")}`.
  - `practice.toDailyPlay` (EN): `"Just want a quick idea for today? Open Daily Play →"`

`PracticeHubTab` must pull `setActiveTab` from `useArbor()` (already the pattern used in `DailyPlayTab.tsx:18`). The `ArrowRight` import is already available in the lucide set used app-wide; import where missing.

#### D. States / motion / a11y / RTL

- **States:** Both edits are static label/link additions — no loading/empty/error branches introduced. The Practice header renders unconditionally; the cross-link rows render unconditionally. No new async.
- **Motion:** Reuse the existing `active:scale-[0.99]` press feedback. No new entrance animation needed (the parent `motion.div` in `DailyPlayTab.tsx:85-88` already fades the page in; `PracticeHubTab` may keep its current non-animated mount). Respect `prefers-reduced-motion` — the only motion is the CSS `active:scale` press, which is already reduced-motion-safe (transform on press, not autoplay).
- **Touch targets:** Cross-link rows are `min-h-[44px]` + `py-3` → ≥44px (AA / iOS HIG). Practice header has no interactive elements.
- **Keyboard:** Both cross-links are real `<button>`s — focusable, Enter/Space activate, visible focus ring from the app default. The Practice header `<h1>` is a proper heading so the tab now has a labelled landmark for screen readers (currently it has none).
- **A11y (AA):** All text uses `--arbor-ink` / `--arbor-green-ink` / `--arbor-muted` on `--arbor-paper-elevated` — the same token pairings already shipped in `DailyPlayCard.tsx`, which meet AA. The cross-link arrow is decorative; the link text alone is descriptive, so no `aria-label` needed.
- **RTL (Hebrew):** Add the HE strings (below). The trailing `ArrowRight` must flip in RTL — use `rtl:rotate-180` (Tailwind) on the arrow icon so "→" points logically toward the destination in HE. The leading-icon + text + arrow row uses flex, which mirrors automatically under `dir="rtl"`.

#### E. i18n keys to append (EN block ~line 87-101, HE block ~line 583-597 in `i18n.ts`)

EN:
```ts
"play.libSubtitle": "Easy, everyday ideas matched to {name}'s stage and what's come up lately — each uses things you already have at home. Today's top pick is on your Today screen.",
"play.toPractice": "Want to drill one skill? Open Practice →",
"practice.eyebrow": "Practice",
"practice.title": "Targeted practice for {name}",
"practice.subtitle": "Focused, repeatable drills for one skill at a time — speech sounds, feelings, mimicking, adventures. Pick a drill and stay with it.",
"practice.toDailyPlay": "Just want a quick idea for today? Open Daily Play →",
```
(`play.libSubtitle` already exists at `i18n.ts:99` — overwrite its value, do not add a duplicate key.)

HE (RTL):
```ts
"play.libSubtitle": "רעיונות פשוטים ליום-יום, מותאמים לשלב של {name} ולמה שעלה לאחרונה — כל פעילות משתמשת בדברים שכבר יש בבית. הבחירה המובילה של היום נמצאת במסך 'היום' שלך.",
"play.toPractice": "רוצים לתרגל מיומנות אחת? לפתיחת תרגול ←",
"practice.eyebrow": "תרגול",
"practice.title": "תרגול ממוקד עבור {name}",
"practice.subtitle": "תרגולים ממוקדים וחוזרים, מיומנות אחת בכל פעם — צלילי דיבור, רגשות, חיקוי, הרפתקאות. בחרו תרגול והישארו איתו.",
"practice.toDailyPlay": "רק רוצים רעיון מהיר להיום? לפתיחת משחק יומי ←",
```
(`play.libSubtitle` already exists at `i18n.ts:595` — overwrite its value.)

#### F. Optional doc-layer reinforcement (no logic change)

Tighten the `select.ts` header comment (`playbank/select.ts:1-8`) to add one line: `// Scope: Daily Play = the everyday activity library (one pick pushed to Today). It is NOT the deliberate-drill engine — that is Practice (components/practice/*).` This keeps the IA contract documented where the data is selected, deterring future drift.

---

### Files to create / edit (exact repo-relative paths)

Edit:
- `PPPPtherapy-/PPPPtherapy-/app/src/components/practice/PracticeHubTab.tsx` — add header (Target eyebrow/title/subtitle) + `useArbor`/`Target`/`Sprout`/`ArrowRight` imports + Daily Play cross-link row; wrap in `space-y-5 max-w-[1080px]` container.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/DailyPlayTab.tsx` — add Practice cross-link row after the picks grid (`Target`/`ArrowRight` imports). (`setActiveTab` already destructured at line 18.)
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append the new keys in both EN and HE blocks; overwrite the two existing `play.libSubtitle` values.
- `PPPPtherapy-/PPPPtherapy-/app/src/playbank/select.ts` — (optional) one-line scope comment in the file header only; no code change.

Create: none.

---

### Shared-file conflict notes

Per the conflict map, this mission shares two files with `c2-daily-play` (and `c2` is a hard dependency — see below):

- **`DailyPlayTab.tsx`** — `touchedBy: [b4-practice-vs-dailyplay, c2-daily-play]`. **`c2` lands first** (it builds the Daily Play behavior/internals). b4 only *appends* a header-subtitle re-voice and a cross-link row at the very end of the JSX. To avoid clobber: do **not** touch the picks grid, course cards, or selector wiring (lines ~28-156) — append the cross-link *after* line 156's closing grid `</div>` and only edit the `play.libSubtitle` string. Land b4 strictly after c2 merges.
- **`playbank/select.ts`** — `touchedBy: [b4-practice-vs-dailyplay, c2-daily-play]`. c2 owns all ranking/logic changes here. b4's only edit is a **comment-only** doc line in the file header. If c2 has already rewritten the header comment, b4 appends its single scope line and makes **no logic change** — zero merge surface on executable code.
- **`i18n.ts`** — heavy multi-mission append magnet (`mk-p0-8-copy-pack`, `mk-p2-1-localize-nl`, `mk-p2-7-paywall-experiments`, etc.). Per the LanguageContext/i18n hotspot rule: **append only, never reorder**, and place the new `practice.*` and `play.*` keys adjacent to the existing `play.*` block (EN ~87-101, HE ~583-597). Overwriting the two existing `play.libSubtitle` *values* (not keys) is safe and conflict-free.
- `PracticeHubTab.tsx` is **not** in the shared-file map — b4 owns it outright. No conflict.

---

### Dependencies (other item ids that must land first)

- **`c2-daily-play`** (hard — declared `dependsOn`). c2 builds the Daily Play surface/internals and shares `DailyPlayTab.tsx` + `select.ts`; b4 re-voices and cross-links on top of the settled result. Do not start b4's `DailyPlayTab` edits until c2 is merged.
- Soft-adjacent: `b1-daily-home` defines the Today host that shows the single pushed pick (`OverviewTab.tsx:320-328`). b4's copy ("Today's top pick is on your Today screen") asserts that surface exists — already true in the live file, so not a hard blocker, but if b1 renames/relocates the Today play slot, reconcile the subtitle wording.

---

### Acceptance criteria (testable, including verified live on dev server)

1. **Practice has a header.** Opening Grow › Practice renders a `Target` eyebrow ("Practice"), an `<h1>` "Targeted practice for {name}", and the deliberate-drills subtitle — above the four drill panels. Verified live on the dev server.
2. **Daily Play subtitle is re-voiced** and references Today: the rendered subtitle contains "Today's top pick is on your Today screen." (EN) / the HE equivalent under `dir="rtl"`. Verified live.
3. **Reciprocal cross-link works both ways.** From Daily Play, tapping "Open Practice →" switches `activeTab` to `practice`; from Practice, tapping "Open Daily Play →" switches to `daily-play`. No content is duplicated between the two tabs (Practice shows only drills; Daily Play shows only the activity library/courses). Verified live by clicking both.
4. **No duplication.** Practice contains zero `DailyPlayCard`/activity-library content; Daily Play contains zero drill panels. (Static check + visual.)
5. **HE/RTL correct.** With language set to Hebrew, both headers and both cross-links render in Hebrew, the cross-link arrow points logically toward the destination (`rtl:rotate-180` applied), and layout mirrors correctly. Verified live in HE.
6. **A11y.** Both cross-links are keyboard-focusable `<button>`s, ≥44×44px; the Practice `<h1>` is announced as a heading. `npx tsc --noEmit` passes; existing test suite stays green.
7. **No console errors** on either tab in the dev server.

---

### Operating-rule checks

- **No dark patterns.** Both cross-links are honest, secondary (non-green, bordered) rows that *help* the parent find the right surface; neither manufactures urgency, hides an exit, or pushes a purchase. The Daily Play re-voice is descriptive, not manipulative.
- **Privacy / COPPA-2026.** Pure IA/copy change — no new data collection, no child PII, no network calls. `firstName` is already in-context (`childProfile.name`), nothing new is stored or transmitted.
- **Moat read/write.** Read-only on the moat: Daily Play already selects picks from the child's logged concern domains (`select.ts` + `concernDomainsFromLogs`); b4 doesn't change that read and writes nothing new. The copy "matched to what's come up lately" honestly surfaces the longitudinal-memory advantage.
- **Ships-visible.** The header, the re-voiced subtitle, and the two cross-links are all immediately visible to any parent on web/iOS/Android the moment the tabs load — no flag, no hidden state.
