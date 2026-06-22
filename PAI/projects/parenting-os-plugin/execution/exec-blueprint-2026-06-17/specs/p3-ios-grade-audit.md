## p3-ios-grade-audit — Whole-app iOS-grade audit & polish
**Aspects:** UI/UX, Copy · **Surfaces/platforms:** web:Today, web:Ask, web:MyChild, web:Grow, web:Care, web:Academy, child:PlayKit, app:shell, ios, android, landing:en, landing:he · **Priority:** Phase1

> **Kind:** umbrella mission. This is a *continuous, per-surface impeccable pass*, not a single PR. It defines the **standing rubric + checklist** every surface must clear ("Arbor at iOS level"), the **process** for running it as each surface lands, and the **shared-primitive fixes** that benefit every surface at once. The discrete per-surface audit deliverables (`surf-*`) and the design-system migration missions (`m1`–`m7`) execute against this rubric; this item owns the rubric and the cross-cutting primitive fixes, and runs the final whole-app sweep.

---

### Problem / why
Arbor is a 34-tab React app (`tabRegistry`, `Shell.tsx:61-97`) assembled in waves: older views authored in dark-Tailwind classes remapped by a ~360-line override layer in `src/index.css`, newer views authored with inline token styles, and a child-facing `.arbor-play` register. The craft is uneven across these layers:

- **Touch targets below the iOS 44px floor.** The Shell workspace-accessory buttons (search, "How Arbor helps", sign-out) use `min-h-[38px]` (`Shell.tsx:167,175,195`); the UI-language toggle pills are `px-2 py-1 text-[11px]` (`Shell.tsx:156`) — well under 44px. The mobile bottom nav items are `py-2.5` with `text-[9.5px]` icons at `w-[18px]` (`MobileNav.tsx:24-28`). PlayKit primitives are correctly sized (`PlayButton min-h-[54px]/[46px]`, `ChoiceTile min-h-[112px]`, `playkit.tsx:141,188`), so the gap is concentrated in parent chrome + older tabs.
- **Inconsistent state coverage.** A shared `EmptyState`, `Skeleton`/`TabSkeleton`, `Spinner`, and `ErrorBoundary` exist (`src/components/ui/`), but they are not applied uniformly — many leaf tabs render content with no empty/loading/error branch, so a parent with no data, a slow model call, or a failed fetch sees a blank or a flash.
- **Motion not fully reduced-motion-safe.** The global guard exists (`index.css:401-407`) and `celebrateBurst` honors `prefers-reduced-motion` (`playkit.tsx:21`), but per-component `motion/react` transitions (e.g. `Shell.tsx:247-253`) and the `arbor-fade-up` stagger (`index.css:347-352`) should be verified to actually collapse, and any JS-driven animation audited.
- **AA contrast + focus not guaranteed.** Token comments claim AA (`--arbor-muted #5f6b75`, `--arbor-faint #6b747b`) and a focus ring exists (`index.css:391-400`), but small text on pastel-soft chips (`Chip` 11px on `*-soft`, `kit.tsx:22`) and status tints are unverified against actual rendered pairs.
- **RTL is shell-deep only.** `index.css:80-93` handles font swap + a couple of aside border flips, but per-surface RTL correctness (icon mirroring, number/progress direction, the `no-scrollbar` sub-nav scroll direction at `Shell.tsx:206`) is unverified per surface.
- **Landing pages diverge.** EN landing is 340 lines vs HE's 1822 (`html/arbor-marketing-landing-page-{en,he}.html`) — they are not at parity, and viewport-fit/safe-area + tap-target audits are unrun.

Without a single enforced rubric, each new surface re-introduces the same defects. This item makes "iOS-grade" testable and repeatable.

---

### Scope across platform domains
- **Web (all 6 pillars + child PlayKit + app shell):** the primary target. Fix the shared chrome (Shell header, MobileNav) once; define and enforce the per-surface checklist for each pillar's leaves.
- **iOS (Capacitor):** verify the rubric holds inside the webview — `contentInset: "always"` (`capacitor.config.ts:23`), status-bar style (`native.ts:18`), and that the safe-area work (dependency `m1-ios-safe-area`) leaves chrome ≥44px after inset. No native-Swift changes here; this is webview-layer polish only.
- **Android (Capacitor):** same webview rubric; confirm status-bar color `#eef2ef` matches canvas (`native.ts:21`) and back-gesture / bottom-nav coexistence.
- **Landing EN / Landing HE (RTL):** apply the same tap-target (≥44px), contrast-AA, reduced-motion, and `viewport-fit=cover` + safe-area-inset checklist to both files. **Do not rewrite** — `mk-landing-parity-rebuild` owns the EN-onto-HE rebuild; p3 only patches polish *after* that lands (see conflict notes).

---

### IA / UX / Copy detail — concrete, build-level

This item ships in **two concrete workstreams** plus the standing rubric.

#### A) Shared-primitive fixes (one PR, benefits every surface)
These are the cross-cutting fixes p3 owns directly (not delegated to `surf-*`):

1. **Touch targets in app chrome → ≥44px.**
   - `Shell.tsx:167,175,195` — change `min-h-[38px]` → `min-h-[44px]` and bump `py-2`→`py-2.5` on the search / how-helps / sign-out buttons. Keep `text-[11px]` label but ensure the *hit box* is 44px (pad, don't grow text).
   - `Shell.tsx:152-160` — the EN/עב language pills: wrap each in a `min-w-[44px] min-h-[44px]` flex-center hit area (visual pill can stay small inside).
   - `MobileNav.tsx:21-30` — raise each tab button to `min-h-[52px]` (`py-2.5`→`py-3`), keep `text-[9.5px]` label but enlarge icon hit area; the whole `<button>` already spans `flex-1` width so only height needs the floor.
   - Settings/sign-out mobile icon buttons are already `w-10 h-10` (40px) — bump to `w-11 h-11` (44px) at `Shell.tsx:185,195`.
2. **State-coverage helpers wired into the Suspense/Error path.** The Shell already wraps tabs in `<Suspense fallback={<TabSkeleton/>}>` + `<ErrorBoundary>` (`Shell.tsx:245-258`) — confirm `ErrorBoundary` renders a recoverable error UI (headline + "Try again" + "Tell us"), not a dev stack. Standardize the empty-state contract: every leaf that can render zero items MUST use `<EmptyState>` (`ui/EmptyState.tsx`) with a real headline+body+CTA (no bare "No data").
3. **Reduced-motion audit of JS motion.** Verify `Shell.tsx:247-253` `motion.div` transition and any `motion/react` usage collapses under `prefers-reduced-motion`. The CSS guard (`index.css:401-407`) only kills CSS animations/transitions — `motion/react` springs/tweens are JS and bypass it. Add a `useReducedMotion()` (from `motion/react`) gate on the Shell tab-transition and any other JS-driven entrance so reduced-motion users get an instant cut, not a tween.
4. **Focus-visible coverage.** Confirm the global ring (`index.css:391-400`) reaches custom `role="tab"` buttons (`Shell.tsx:211-220`) and the MobileNav buttons; they are real `<button>`s so they inherit it — verify visually and that `aria-selected` is announced.

#### B) The standing per-surface rubric (the "checklist" the umbrella enforces)
Every surface audit (the `surf-*` items + landing) must produce a pass against ALL of:

| Dimension | Pass criteria |
| :--- | :--- |
| **Touch targets** | Every interactive element ≥44×44px hit area (iOS HIG). 8px min gap between adjacent targets. |
| **States** | default / loading (Skeleton or Spinner) / empty (`EmptyState`) / error (recoverable, with retry) all designed and reachable. No blank flashes; no infinite spinners without a timeout/error path. |
| **Motion** | Entrances ≤300ms, `cubic-bezier(0.22,1,0.36,1)`; all motion (CSS *and* `motion/react`) collapses under `prefers-reduced-motion`; no autoplay loops on parent surfaces (loops allowed only in `.arbor-play`). |
| **Type** | Uses the token scale (`--t-*`, `index.css:49-50`) or display utilities; min body 13px (`--t-sm`), no sub-11px interactive labels except non-interactive captions. Display = Fraunces, body = Nunito (Heebo/Frank Ruhl Libre under `lang=he`). |
| **A11y AA** | Text contrast ≥4.5:1 (≥3:1 for ≥18px/bold); every control keyboard-reachable + visible focus; icons-only buttons have `aria-label`; `role`/`aria-selected` correct on tabs (`Shell.tsx:206-222` pattern is the reference). |
| **RTL** | Under `lang=he`/`dir=rtl`: layout mirrors, directional icons flip, progress/number direction correct, horizontal scroll regions (`no-scrollbar`) scroll RTL, no clipped/overlapping chrome. |
| **Register fidelity** | Parent surfaces calm/premium (token styles, `kit.tsx`); child surfaces vivid/playful (`.arbor-play`, `playkit.tsx`). No cross-bleed (no confetti/bounce on parent tabs; no flat parent cards on play tabs). |

#### C) Copy pass (microcopy correctness)
- **Empty states:** every `EmptyState` headline is a warm, specific sentence tied to the moat ("Arbor hasn't met {childName} yet — add a first moment to start the timeline"), never "No data". Body explains the *next action*; CTA verb-first.
- **Errors:** human, non-blaming, recoverable. e.g. "We couldn't reach Arbor's AI just now. Your notes are saved — try again in a moment." Never expose error codes/stack to parents.
- **Loading:** where a Spinner shows >1s, pair with a calm line ("Reading {childName}'s story…") — never a bare spinner on a primary action.
- **Sandbox banner** (`Shell.tsx:227-242`): keep, but verify the "Learn how" copy is accurate to the current `.env` flow.
- All new strings route through `t(...)` / `LanguageContext` so HE is covered — **do not hardcode** English in audited components (append keys only; see conflict notes on `LanguageContext.tsx`).

---

### Files to create / edit (exact repo-relative paths)
**Edit (shared-primitive fixes, workstream A):**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/Shell.tsx` — tap-target floors (lines ~152-160, 167, 175, 185, 195), reduced-motion gate on tab transition (~247-253).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/MobileNav.tsx` — bottom-tab min-height ≥52px (~21-30).
- `PPPPtherapy-/PPPPtherapy-/app/src/index.css` — only if a polish token/util is missing (e.g. a `.tap-44` helper); **append below the play layer**, do not touch the override layer (that's `m4`'s territory).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/kit.tsx` — only if a state/contrast fix is needed in `Chip`/`TrustSafetyBar` (verify 11px pastel-ink contrast; bump `Chip` to 12px if it fails AA).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/playkit.tsx` — polish-only (verify ProgressPips RTL, ChoiceTile focus ring); **no API changes** (those belong to `m2`/`m7`).

**Edit (landing polish, workstream B — only AFTER `mk-landing-parity-rebuild`):**
- `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-en.html`
- `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-he.html`

**Create (the rubric artifact, so `surf-*` items can cite it):**
- `PAI/projects/parenting-os-plugin/execution/exec-blueprint-2026-06-17/ios-grade-rubric.md` — the §B table + per-surface pass/fail log template (one row per surface, checked off as each lands). This is the umbrella's tracking deliverable.

---

### Shared-file conflict notes
This item touches four declared hotspots. Per the conflict map, **p3 polish runs LAST / continuous** on every shared file — never in the same window as a structural mission.

- **`index.css`** (`p3, m1, m2, m4`): order is **m4 (delete ~200-line override layer) → m2 (token extraction) → m1 (safe-area additions) → p3 polish**. p3 appends only (below the `.arbor-play` block at `index.css:489`); never edits the override layer or `:root` tokens. If p3 needs a token, it requests it via m2, not by adding one.
- **`Shell.tsx`** (`p3, b5, ia-b1, m1, m5, surf-app-shell`): structural edits (tabRegistry: `b5`/`ia-b1`; safe-area: `m1`; touch/error: `m5`) land first. p3's tap-target + reduced-motion polish is the last pass. **Coordinate the 44px work with `m1`** — m1 adds safe-area padding; p3 ensures the *resulting* hit boxes are still ≥44px. If m5 already raises the chrome buttons, p3 only verifies.
- **`kit.tsx`** (`p3, m2, m3`): `m2` (token extraction) + `m3` (hex sweep) settle values first; p3 only adjusts state/contrast after. No hardcoded hex introduced by p3.
- **`playkit.tsx`** (`p1, p3, p2-7, p2-11, m2, m7`): `m2`+`m7` settle the primitive API; feature missions consume; **p3 is polish-only and additive** — no prop/signature changes.
- **Landing EN/HE** (`p3, mk-landing-parity-rebuild, mk-p0-1, mk-p0-5, mk-p2-1, mk-p1-4`): `mk-landing-parity-rebuild` REWRITES EN wholesale → then mk-p0-1/p0-5/p2-1 patch it → **p3 polish runs last**. p3 must re-read both files immediately before editing (they will have changed) and append only.
- **`LanguageContext.tsx`** (not in p3's declared sharedFiles but touched if p3 adds copy keys): append keys only, reconcile collisions in `b5`'s final pass. Prefer reusing existing `t(...)` keys over adding.

---

### Dependencies (other item ids that must land first)
- **`m4-retire-override-layer`, `m2-token-extraction`, `m1-ios-safe-area`** — must land before p3 touches `index.css` / re-checks chrome targets (safe-area changes hit-box math).
- **`m5-touch-error-states`** — if it lands first, p3's chrome tap-target work narrows to verification.
- **`mk-landing-parity-rebuild`** (+ `mk-p0-1`, `mk-p0-5`) — must land before p3 polishes the landing HTML.
- **Each `surf-*` surface audit** is *driven by* this umbrella's rubric; p3's final whole-app sweep runs **after** all `surf-*` + the `m*` design-system missions land.
- The standing rubric artifact (workstream C create) has **no** dependencies and should be written first so `surf-*` items can cite it.

---

### Acceptance criteria (testable)
1. **Rubric artifact exists** at `.../ios-grade-rubric.md` with the §B table and a per-surface pass/fail log, and every `surf-*` spec references it.
2. **No interactive element in app chrome is below 44×44px.** Verified live on dev server (`npm run dev` in `PPPPtherapy-/PPPPtherapy-/app`) at 375px (iPhone SE) and 768px widths: Shell header buttons, language pills, MobileNav tabs, mobile settings/sign-out all measure ≥44px hit box (DevTools inspector / Lighthouse "Tap targets" audit passes).
3. **Reduced-motion verified:** with OS/`prefers-reduced-motion: reduce` on, the Shell tab transition and `arbor-fade-up` stagger produce an **instant cut** (no tween), confetti does not fire — verified live on dev server.
4. **State coverage:** every audited leaf renders a designed empty (`EmptyState` with real copy), loading (`Skeleton`/`Spinner`), and error (recoverable, no stack) — spot-checked live by forcing zero-data, throttled-network, and a forced fetch failure on at least Today, Ask, My Child, and Consult.
5. **AA contrast:** axe-core / Lighthouse a11y run on each pillar reports **0 contrast violations**; `Chip` 11px pastel pairs pass ≥4.5:1 or are bumped.
6. **RTL:** with UI language = עברית (`Shell.tsx:152-160` toggle), every audited surface mirrors correctly, the sub-nav scroll region scrolls RTL, and no chrome is clipped — verified live on dev server.
7. **Landing parity polish:** both landing files pass the same tap-target + AA + reduced-motion + `viewport-fit=cover`/safe-area checks (manual + Lighthouse) after the parity rebuild.
8. **No regressions:** `npm run build` + `tsc` clean; existing test suite green; no new hardcoded hex in p3's diffs (verified by diff review against `m3` hex-sweep rules).

---

### Operating-rule checks
- **No dark patterns:** polish only clarifies and enlarges targets; no confirm-shaming, forced continuity, or disguised CTAs introduced. Empty-state CTAs are honest next-actions.
- **Privacy / COPPA-2026:** no new data capture, no telemetry added by this item (analytics belongs to `mk-p0-4`); child-facing PlayKit polish keeps the kid register and adds no input collection.
- **Moat read/write:** empty/loading copy is written to *reference the longitudinal memory* ("Arbor hasn't met {childName} yet", "Reading {childName}'s story…"), reinforcing the moat narrative without changing reads/writes; this is a polish pass, so it neither breaks nor adds moat I/O.
- **Ships-visible:** every change is user-visible craft (bigger taps, real empty/error states, correct RTL, calmer reduced-motion) and is verified running on the dev server, not just in code — that is the whole point of this item.
