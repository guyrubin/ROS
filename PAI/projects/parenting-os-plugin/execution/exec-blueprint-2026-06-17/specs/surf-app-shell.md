## surf-app-shell — Surface audit — app shell (nav + global chrome)
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** app:shell · **Priority:** Phase1

> RUN AS THE FINAL CHROME-COHERENCE PASS. This item is the *consumer* of the settled IA + native polish: it lands **after** `m1-ios-safe-area`, `m5-touch-error-states`, and `b5-naming-moat-exposure` (and after the navigation.ts pillar triad b1/b2/b3 + ia-b1/ia-b6 that b5 closes). It owns no feature logic — it owns the global chrome reading correctly once everyone else has touched it: `Sidebar` / `MobileNav` / `AiRail` / `SearchModal` + the section sub-nav strip, the tab cross-fade, the sandbox banner, and the top accessory row.

---

### Problem / why

The app shell is six files (`Shell.tsx`, `Sidebar.tsx`, `MobileNav.tsx`, `AiRail.tsx`, `SearchModal.tsx`, `navigation.ts`) that **no single feature mission owns end-to-end**, yet every mission edits a slice of them. After m1 (safe-area), m5 (touch/error) and the IA triad land, the chrome has accumulated concrete cross-aspect defects, all verified in code today:

1. **SearchModal `EXTRA_COMMANDS` will go stale against the IA renames.** `SearchModal.tsx:11-15` hardcodes three "consolidated" deep-link commands — `weekly`, `handoff`, `scholar`. The first two stay live deep-links per b5 (`b5-naming-moat-exposure.md` §A2), but `scholar` is folded into Ask Arbor as a lens by `ia-b6-ask-from-ask`. After ia-b6 lands, a top-level `scholar` command in the palette routes to a view that no longer has an independent home — the palette and the IA disagree. The palette also **omits `comics`** (Hero Comics), which b5 makes a valid Academy deep-link reachable from Adventures but which has **no discoverable entry** in search. The command palette is the IA's safety net ("nothing becomes undiscoverable" — `SearchModal.tsx:8-9`); it must be reconciled to the post-IA registry.

2. **The AiRail "See what Arbor remembers" button hard-codes `setActiveTab("memory")`** (`AiRail.tsx:56`). `memory` is a `TAB_SECTION_FALLBACK` leaf under `child` (`navigation.ts:117`); after b2/b5 settle the My Child spine this still resolves, but the button bypasses `navigation.ts` and will silently break if the leaf is ever renamed. Same hard-coded literal pattern in the CTA (`AiRail.tsx:62`, `setActiveTab("coach")`). These are the last two un-audited literal nav jumps in the chrome.

3. **The section sub-nav strip and the sidebar duplicate the active-section logic but diverge on a11y.** `Shell.tsx:205-224` renders a proper `role="tablist"` / `role="tab"` / `aria-selected` strip for multi-leaf sections — good. But the sidebar (`Sidebar.tsx:43-63`) and MobileNav (`MobileNav.tsx:21-30`) primary buttons carry **no `aria-current` on MobileNav** (sidebar has it at `:46`, MobileNav does not) and the MobileNav bottom bar has **no landmark label** and **no active-state contrast beyond color** (color-only state, fails WCAG 1.4.1 *Use of Color* — the only difference between active/inactive tabs is `--arbor-green-ink` vs `--arbor-muted`). On a phone this is the primary nav and it is the least accessible part of the shell.

4. **The tab cross-fade ignores `prefers-reduced-motion`.** `Shell.tsx:246-257` animates every tab change (`opacity`/`y` via `motion/react`) with **no reduced-motion guard** — flagged but explicitly deferred by both m1 (`m1-ios-safe-area.md` §motion) and m5. It is no one's job but the shell's. Vestibular-sensitive users get an unrequested 160ms translate on every navigation.

5. **The sandbox banner is hard-coded English and not localized.** `Shell.tsx:227-242` renders `"Sandbox mode: live AI is off…"` and `"Learn how"` as raw English string literals — the only un-i18n'd visible copy in the shell. In Hebrew (RTL) the banner stays LTR English, breaking the localized experience the rest of the shell delivers. It also mentions a developer concept (`.env.local`, `GEMINI_API_KEY`) to *parents*, which is the wrong audience for a shipped build.

6. **The top "caring for" status line truncation + focus chip is fragile.** `Shell.tsx:144-148` shows `Caring for {name} · Age {age} · Focus: {focusLabel}`; `focusLabel` is derived inline (`Shell.tsx:106-108`) from `childProfile.challenges?.[0]`. This is fine, but the chrome should expose the moat "tracking since" signal b5 computes — the top row is the most-seen surface in the app and currently says nothing about the longitudinal record. (Lightweight reuse of b5's `computeMoatStat`, optional.)

This is item **surf-app-shell** on the surface-audit map: the coherence pass that makes the global chrome read as one deliberate system after the feature missions have each touched a corner of it.

### Scope across platform domains

- **Web app:** Primary surface. All edits land here (the live React shell). SearchModal reconciliation, AiRail nav-via-`navigation.ts`, MobileNav a11y + non-color active state, reduced-motion guard on the tab cross-fade, localized sandbox banner, top-row moat line.
- **iOS (Capacitor):** No native code. Rides the same web bundle. The MobileNav a11y/active-state fix and reduced-motion guard are most load-bearing here (bottom bar is *the* nav). **Must not** re-touch the safe-area padding m1 owns on MobileNav/`<main>` — verify it is still present after this pass. Smoke in iOS-sized viewport.
- **Android (Capacitor):** Same as iOS; verify MobileNav active contrast and the back-button (m1) still navigates correctly across the reconciled SearchModal jumps.
- **Landing EN / Landing HE:** Out of scope (separate `html/` marketing files; owned by the `mk-*` missions).

### IA / UX / Copy detail (build-level)

#### A. SearchModal — reconcile the command palette to the post-IA registry (IA + Copy)

`SearchModal.tsx` builds primary commands from `SECTIONS` automatically (`:27-42`) — that part self-heals as the IA settles, **no change needed there**. The fix is the hand-maintained `EXTRA_COMMANDS` list (`:11-15`):

1. **Drop `scholar`** from `EXTRA_COMMANDS` once `ia-b6-ask-from-ask` has folded the Scholar lens into Ask Arbor. After ia-b6, searching "scholar"/"lens" should surface **Ask Arbor** (the primary `coach` command already covers it). Remove the `{ tab: "scholar", … }` entry and its `sm.extra.scholar*` reliance. (If ia-b6 has *not* landed at merge time, leave `scholar` and flag — see deps.)
2. **Add `comics`** as a discoverable deep-link (it is otherwise reachable only from inside Adventures, per b5):
   ```tsx
   { tab: "comics", key: "comics", icon: <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--arbor-green-ink)" }} /> },
   ```
   (import `BookOpen` from `lucide-react` — same icon Academy uses for Story Journeys in `navigation.ts:90`.)
3. **Keep `weekly` and `handoff`** — b5 confirms they remain live deep-links.
4. **Add a structural guard** so the palette never silently drifts from the registry again: a new unit test `SearchModal` companion (or extend `navigation.test.ts`) asserting every `EXTRA_COMMANDS[].tab` is a member of `VALID_TABS` AND is **not** already a surfaced `SECTIONS[].items[].tab` (i.e. extras are genuinely "consolidated", not duplicates of primaries). This catches a future rename.
5. **i18n:** add `sm.extra.comics` / `sm.extra.comicsSub` (EN + HE), and remove `sm.extra.scholar*` only if ia-b6 landed. EN:
   - `"sm.extra.comics": "Hero Comics"`
   - `"sm.extra.comicsSub": "Personalized comics starring your child"`
   - HE: `"sm.extra.comics": "קומיקס גיבור"`, `"sm.extra.comicsSub": "קומיקס מותאם שבו ילדכם הוא הגיבור"`

#### B. AiRail — route every jump through the registry, not literals (IA + UI/UX)

- `AiRail.tsx:56` (`setActiveTab("memory")`) and `:62` (`setActiveTab("coach")`) stay as literals **but** add a one-line comment tying each to its `navigation.ts` home so a future rename audit catches them, e.g. `// → child › memory (TAB_SECTION_FALLBACK)`. These two tabs are stable post-b5; do not over-engineer. The real fix is the guard in §A4 + ensuring no *new* literals are introduced.
- **a11y on the AiRail toggle:** the collapse chevron (`AiRail.tsx:29`) and the Shell "How Arbor helps" re-open button (`Shell.tsx:172-180`) are a show/hide pair with no `aria-expanded` / `aria-controls` linkage. Add `id="ai-rail"` to the `<aside>`, `aria-controls="ai-rail"` + `aria-expanded={showAiRail}` to **both** the collapse chevron and the Shell re-open button, so SR users understand the relationship. The re-open button is `hidden xl:flex` (only shown when the rail is hidden on ≥xl), so its `aria-expanded` is always `false` when visible — still correct.

#### C. MobileNav — landmark, `aria-current`, and non-color active state (UI/UX + a11y)

`MobileNav.tsx` is the phone primary nav and the weakest-a11y chrome. Fixes (additive, no layout reflow):

- **Landmark label:** add `aria-label={t("nav.primary")}` to the `<nav>` (`:13`). New key `"nav.primary": "Primary"` / HE `"ראשי"`.
- **`aria-current`:** add `aria-current={on ? "page" : undefined}` to each tab `<button>` (`:21`) — parity with the sidebar (`Sidebar.tsx:46`).
- **Non-color active state (WCAG 1.4.1):** today active vs inactive differs only by text color (`:25`). Add a second, non-color cue: a 2px top indicator bar on the active tab. Inside the button, render `{on && <span aria-hidden className="absolute top-0 inset-x-3 h-0.5 rounded-full" style={{ background: "var(--arbor-green-ink)" }} />}` and make the button `relative`. This gives a shape/position cue independent of hue, and reads as a deliberate "selected tab" affordance. (Bottom-bar safe-area padding from m1 stays on the `<nav>` style object — **append only, do not replace it**.)
- **Touch targets:** each tab is full-flex-width × (`py-2.5` + icon + 9.5px label) ≈ 50px — already ≥44px AA. No change. Do **not** shrink the label.

#### D. Section sub-nav strip — keep as the reference a11y pattern (UI/UX)

`Shell.tsx:205-224` is already correct (`role="tablist"`, `role="tab"`, `aria-selected`, keyboard-focusable buttons, `no-scrollbar` overflow). **Two small hardenings:**
- Add `tabIndex` roving is **out of scope** (the buttons are individually focusable, which is acceptable; full roving-tabindex is a larger refactor — note as a known gap, do not build).
- The active pill uses `--arbor-green-soft`/`--arbor-green-ink` + an inset ring (`:217`) — that is a non-color (ring) cue already, good. Leave as-is. m5 owns the 36px pill touch-target near-miss (`m5` §C/`m1` §states note); **do not re-bump here** to avoid clobbering m5. If m5 bumped the pill to `py-2.5`, verify the strip still doesn't wrap at 360px.

#### E. Tab cross-fade — reduced-motion guard (UI/UX, owned here)

`Shell.tsx:246-257` `motion.div` animates `opacity` + `y:10→0` on every `key={activeTab}` change. Gate it with `motion/react`'s `useReducedMotion`:
```tsx
const reduceMotion = useReducedMotion();
// …
<motion.div
  key={activeTab}
  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
  exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
  transition={{ duration: reduceMotion ? 0 : 0.16 }}
>
```
With reduced motion the view swaps with no translate and effectively no fade (0ms) — instant, no vestibular trigger. `useReducedMotion` reads the OS setting and the existing global CSS `prefers-reduced-motion` block stays as the belt-and-braces layer. Import `useReducedMotion` from `motion/react` (already the import source at `Shell.tsx:2`).

#### F. Sandbox banner — localize + reframe for parents (Copy)

`Shell.tsx:227-242`. Replace the hard-coded English with i18n keys and parent-appropriate copy (no `.env.local`/API-key jargon in shipped UI; keep the developer hint in the toast only, which is fine for the local dev case):
- Title/body → `t("shell.sandbox.title")` / `t("shell.sandbox.body")`; CTA → `t("shell.sandbox.cta")`.
- EN: `"shell.sandbox.title": "Sample mode"`, `"shell.sandbox.body": "You're exploring Arbor with example data. Answers aren't personalized yet."`, `"shell.sandbox.cta": "Learn more"`.
- HE: `"shell.sandbox.title": "מצב הדגמה"`, `"shell.sandbox.body": "אתם חוקרים את Arbor עם נתוני דוגמה. התשובות עדיין לא מותאמות אישית."`, `"shell.sandbox.cta": "מידע נוסף"`.
- The `toast(...)` developer string (`Shell.tsx:236`) **stays English/technical** — it's the local-dev affordance; acceptable. RTL: banner is `flex items-center justify-between` — verify it mirrors (icon trails correctly) under `dir="rtl"`.

#### G. Top accessory row — surface the moat (Copy, optional/light)

Reuse b5's `computeMoatStat` (already imported into `OverviewTab`): pass nothing new through context — instead, in `Shell.tsx` read the same logs/milestones the context already exposes and, when `since` exists, append a muted ` · ${t("top.trackingSince", {date})}` segment after the focus chip (`Shell.tsx:147`), `hidden md:inline` so it never crowds mobile. New key `"top.trackingSince": "tracking since {date}"` / HE `"עוקבים מאז {date}"`. **If b5 has not landed**, skip this sub-item entirely (it depends on `moat.ts`); it is the lowest-priority part of this spec.

#### States / motion / a11y / RTL summary
- **Default:** all chrome renders as today, with the fixes above.
- **Loading:** unchanged — `TabSkeleton` Suspense fallback (`Shell.tsx:245`) and `ErrorBoundary` (`:254`) are untouched.
- **Empty:** SearchModal "No matches" (`SearchModal.tsx:99`) unchanged; sandbox banner only renders when `showSandboxBanner` (no API key).
- **Error:** chrome-level errors are the existing `ErrorBoundary`; no new error UI (m5 owns content-level ErrorState).
- **Motion:** the tab cross-fade now respects `prefers-reduced-motion` (§E). No other new motion. MobileNav active indicator is static (no animation).
- **Touch targets:** MobileNav tabs ≥50px (unchanged); m5 owns the header-button 44px bumps and the sub-nav pill — do not duplicate.
- **a11y (AA / keyboard / reduced-motion):** MobileNav gains landmark + `aria-current` + non-color state; AiRail gains `aria-expanded`/`aria-controls`; tab cross-fade reduced-motion-safe; sandbox banner localized so SR reads the user's language. Contrast: all states use existing AA-passing tokens.
- **RTL:** sandbox banner, MobileNav indicator (`inset-x-3` is symmetric), and the top moat segment all verified under `dir="rtl"`; dates are `toLocaleDateString`-formatted (locale-aware).

### Files to create / edit (exact repo-relative paths)

Edit:
- `PPPPtherapy-/PPPPtherapy-/app/src/components/search/SearchModal.tsx` — `EXTRA_COMMANDS`: drop `scholar` (post-ia-b6), add `comics`; import `BookOpen`.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/MobileNav.tsx` — `aria-label` landmark, `aria-current`, non-color active indicator (`relative` + top bar).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/AiRail.tsx` — `id="ai-rail"`, `aria-expanded`/`aria-controls` on collapse chevron; comments on the two literal `setActiveTab` jumps.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/Shell.tsx` — `useReducedMotion` guard on tab cross-fade; `aria-expanded`/`aria-controls` on the "How Arbor helps" re-open button; localize sandbox banner; optional top-row moat segment.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append EN+HE keys: `sm.extra.comics(+Sub)`, `nav.primary`, `shell.sandbox.title/body/cta`, `top.trackingSince`; remove `sm.extra.scholar*` only if ia-b6 landed.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.test.ts` — extend with the EXTRA_COMMANDS↔VALID_TABS / not-a-primary guard (§A4).

Create: none (greenfield avoided to minimize merge surface; the guard test extends the existing `navigation.test.ts`).

> `navigation.ts` itself is **not edited** by this item — the IA is settled by b1/b2/b3/ia-b1/ia-b6/b5 before this pass. surf-app-shell only *consumes* it. (Listed in `sharedFiles` for read-coordination, not write.)

### Shared-file conflict notes

Per the conflict hotspot list:
- **`Shell.tsx`** (hotspot: p3, b5, ia-b1, m1, m5, surf-app-shell): hotspot order is **m1 (safe-area) + m5 (touch/error) before surf-app-shell; tabRegistry edits b5/ia-b1 serialized with the navigation.ts triad; p3 polish last.** This item lands **after m1 and m5**. It must **not** touch `tabRegistry` (`:61-97`, b5/ia-b1 territory), the safe-area `<main>` padding / mobile-header wrapper (m1 owns `:125-145`), or the header accessory button classes (m5 owns `:167-195`). Its edits are confined to: the `motion.div` block (`:246-257`), the sandbox banner block (`:227-242`), the re-open button's aria attrs (`:172-180`), and (optional) the top status line (`:144-148`). All non-overlapping with m1/m5. Coordinate to run p3 polish after.
- **`navigation.ts`** (hotspot: b1/b2/b3/b5/ia-b1/ia-b6/surf-app-shell): "**surf-app-shell consumes the settled result.**" Read-only here — no write. Re-run after b5's final cleanup.
- **`MobileNav.tsx`** (touchedBy m1, surf-app-shell): m1 owns the safe-area padding on the `<nav>` style object; this item **appends** `aria-label` + per-button `aria-current`/indicator and adds `relative` to the button — it must **preserve** m1's `paddingBottom/Left/Right: var(--safe-*)`. Land after m1; merge by keeping both edits to the same style object.
- **`Sidebar.tsx`** (touchedBy p2-hero-everywhere, surf-app-shell): p2-hero-everywhere may swap the `ProfileSwitcher`/Avatar block for a HeroAvatar; this item does **not** edit Sidebar in the core scope (sidebar already has `aria-current`). If a sidebar a11y touch is needed, confine to attributes on the nav buttons (`:43-63`) and serialize after p2-hero-everywhere's avatar edit. **Default: no Sidebar.tsx write.**
- **`SearchModal.tsx`** (touchedBy surf-app-shell only): no cross-mission conflict. Safe.
- **`AiRail.tsx`** (touchedBy surf-app-shell only): no cross-mission conflict. Safe.
- **`i18n.ts`** (hotspot via LanguageContext family: mk-p0-8-copy-pack, mk-p2-1, mk-p2-7, + b5/m5 append `rhythm.*`/`err.*`): **append-only**, new namespaces (`shell.sandbox.*`, `nav.primary`, `top.trackingSince`, `sm.extra.comics*`). No collision with existing keys (verified: `shell.sandbox.*`, `nav.primary`, `top.trackingSince` unused today). Merge by appending; never reorder. Coordinate the `sm.extra.scholar*` *removal* with ia-b6 (only remove if ia-b6 dropped the scholar route).

### Dependencies (other item ids that must land first)

- **`m1-ios-safe-area`** — owns the MobileNav safe-area padding + `<main>` insets this item must preserve, and the reduced-motion deferral note that hands the tab cross-fade to this item.
- **`m5-touch-error-states`** — owns the header 44px touch bumps + sub-nav pill; this item must not duplicate, and lands after.
- **`b5-naming-moat-exposure`** — final navigation.ts/registry cleanup (`comics→academy` fallback, doc-comments, `moat.ts`). SearchModal's `comics` deep-link and the optional top-row moat line both depend on b5's settled registry + `computeMoatStat`.
- **Soft (registry must be settled before the palette is reconciled):** `ia-b6-ask-from-ask` (scholar→Ask fold; gates the `scholar` removal in §A1) and the pillar triad `b1`/`b2`/`b3` + `ia-b1` that b5 closes. If ia-b6 has not landed, keep `scholar` in `EXTRA_COMMANDS` and re-do §A1 when it lands.

### Acceptance criteria (testable, including "verified live on dev server")

1. `npm run test` passes, including the new `navigation.test.ts` guard: every `EXTRA_COMMANDS[].tab` ∈ `VALID_TABS` and ∉ any `SECTIONS[].items[].tab`. (Requires exporting `EXTRA_COMMANDS` from `SearchModal.tsx` or asserting via a small shared constant — prefer exporting the const.)
2. **Verified live on dev server (`npm run dev`):** opening the command palette (Ctrl/Cmd+K) and typing "comic" surfaces a **Hero Comics** result that routes to the comic reader; typing "scholar" surfaces **Ask Arbor** (no orphan scholar command) once ia-b6 has landed.
3. **Verified live:** the mobile bottom nav (≤md viewport) announces a "Primary" landmark, sets `aria-current="page"` on the active tab (DevTools accessibility tree), and the active tab shows the green top-indicator bar — active state is distinguishable with color simulated off (grayscale).
4. **Verified live:** with `prefers-reduced-motion: reduce` set in DevTools, switching tabs produces **no translate and no fade** (instant swap); with motion on, the existing 160ms fade-up remains.
5. **Verified live in HE (RTL):** the sandbox banner renders in Hebrew, mirrors correctly (icon + CTA on the correct side), and shows no raw `shell.sandbox.*` key strings; the MobileNav indicator and labels mirror.
6. **Verified live:** the AiRail collapse chevron and the Shell "How Arbor helps" button expose `aria-expanded` reflecting rail visibility and `aria-controls="ai-rail"` (DevTools a11y tree); toggling updates the value.
7. `grep -n '"Sandbox mode' app/src/components/layout/Shell.tsx` returns **zero** matches (banner fully localized).
8. m1/m5 outputs preserved: `grep -n "safe-bottom" app/src/components/layout/MobileNav.tsx` still matches (safe-area padding intact); `grep -rn "min-h-\[38px\]" app/src/components/layout/Shell.tsx` returns zero (m5 bumps intact).
9. `npx tsc --noEmit` clean; existing suite green; no new ESLint errors.
10. Capacitor smoke (or documented deferred if no Mac): iOS/Android webview shows the localized banner, the MobileNav indicator + landmark, and reduced-motion-safe transitions; back-button (m1) still navigates across reconciled palette jumps.

### Operating-rule checks
- **No dark patterns:** the sandbox-banner reframe is *more* honest to parents ("example data, not personalized yet") and removes developer jargon; no manipulation. The palette change only makes existing capabilities *more* discoverable. Non-color active state is an accessibility gain, not a nudge.
- **Privacy / COPPA-2026:** no new data collected, logged, or transmitted. The optional top-row moat segment reads only already-stored signals via b5's pure `computeMoatStat` (no fabricated dates, suppressed when no history). No telemetry added (analytics is mk-p0-4's job; `setActiveTab` already fires `view_tab` in context, unchanged).
- **Moat read/write:** *reads* the longitudinal record to surface "tracking since" in the most-seen chrome (top row) — reinforces the memory-moat north star; writes nothing.
- **Ships-visible:** yes — a discoverable Hero Comics in search, a localized parent-facing sample banner, an accessible mobile nav with a visible selected-tab indicator, motion that respects the OS setting, and (optionally) the longitudinal proof on every screen's header. All immediately perceptible; nothing is a silent refactor.
