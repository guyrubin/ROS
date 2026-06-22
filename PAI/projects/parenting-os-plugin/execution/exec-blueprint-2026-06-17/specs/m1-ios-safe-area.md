## m1-ios-safe-area — iOS-grade safe-area + native polish
**Aspects:** UI/UX · **Surfaces/platforms:** app:shell, ios, android · **Priority:** Phase1

### Problem / why
Arbor's web shell is bundled into native iOS/Android via Capacitor (`MOBILE.md`), but the chrome is not native-grade. Three concrete defects, all verified in code:

1. **No safe-area insets anywhere.** `app/index.html:5` already ships `viewport-fit=cover`, yet a repo-wide grep for `env(safe-area-inset-*)` returns **zero** matches in `src/`. On notched iPhones and Android gesture-nav devices this means:
   - The fixed bottom tab bar `MobileNav.tsx` (`fixed bottom-0 inset-x-0`, `app/src/components/layout/MobileNav.tsx:14`) sits **under** the iOS home indicator / Android gesture pill — bottom row of tap targets is partially occluded.
   - The mobile brand header + top accessory row in `Shell.tsx` (`app/src/components/layout/Shell.tsx:135-202`) starts flush under the status bar / notch (status bar is `overlaysWebView: false` today, but switching to a true edge-to-edge feel and any future overlay needs the inset).
   - `<main>` bottom padding is a hardcoded `pb-24` (`Shell.tsx:135`) that does not account for the tab bar **plus** the home indicator, so the last content row can hide behind the nav.
2. **Platform classes are set but never consumed.** `native.ts:10-11` writes `data-platform` + `is-native`/`is-ios`/`is-android` to `<html>`, and `MOBILE.md:71-72` documents them as the hook "for any platform-specific CSS" — but **nothing in `index.css` or any component reads them.** Dead affordance.
3. **Status-bar style contradiction.** `capacitor.config.ts:39` declares `style: "DARK"` (dark icons, correct for the light "Soft Daylight" canvas), but the runtime override `native.ts:16` calls `StatusBar.setStyle({ style: Style.Light })`. In Capacitor, `Style.Light` renders **light** icons (meant for dark backgrounds); runtime wins over config, so on a near-white canvas the status-bar icons are near-invisible. This is the single most visible "not iOS-grade" defect on first launch.
4. **No haptics, no swipe-back.** `@capacitor/haptics` is **not installed** (absent from `package.json`); `@capacitor/app` **is** installed (`package.json:19`) but **no listener is registered anywhere** — Android hardware back does nothing and there is no iOS interactive edge-swipe-back affordance. Tab taps give no tactile feedback.

This is item M1 on the UI/UX map, the highest-priority iOS-level gap.

### Scope across platform domains
- **Web** — Safe-area `env()` values resolve to `0px` on desktop browsers, so additions are **no-ops on web** (byte-identical layout). The only web-visible change is a small CSS-var indirection (`--safe-*`) and the haptics/back-button calls are gated behind `isNativePlatform` (no-op via dynamic import, matching the existing `native.ts` pattern). Verify web is unchanged.
- **iOS (Capacitor)** — Real fix target. Bottom nav and top row clear the notch / home indicator; status-bar icons become dark; iOS edge-swipe-back is enabled (native gesture, ensured by not blocking it — see below); selection haptic on tab change.
- **Android (Capacitor)** — Bottom nav clears the gesture pill; status-bar style reconciled; **hardware/gesture back button** wired via `@capacitor/app` `backButton` listener (navigate to previous section, else minimize); selection haptic on tab change.
- **Landing EN / Landing HE** — Out of scope (separate marketing surface; they already carry `viewport-fit=cover` independently).

### IA / UX / Copy / Marketing detail (UI/UX)

This is a chrome/system mission — no IA, copy, or marketing surface changes. All work is UI/UX + native runtime.

**A. Safe-area token layer (in `index.css`, base `:root`).** Add four resolved CSS vars so components reference one place (DRY), with a fallback for older webviews:
```css
:root {
  --safe-top:    env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left:   env(safe-area-inset-left, 0px);
  --safe-right:  env(safe-area-inset-right, 0px);
}
```
Place these in the existing `:root` block (after the `--ring` line, `index.css:61`) so they merge cleanly with m2/m4 token work. Do **not** touch the override layer.

**B. Bottom nav (`MobileNav.tsx`).** Apply bottom + horizontal insets to the fixed bar so it floats above the home indicator and the tap row stays fully inside the safe area:
- Change the inline `style` to add `paddingBottom: "var(--safe-bottom)"`, `paddingLeft: "var(--safe-left)"`, `paddingRight: "var(--safe-right)"` (keep existing `borderTop`/`boxShadow`).
- The per-tab `<button>` keeps `py-2.5`; with the inset padding the **effective** touch target row clears the indicator. Touch targets: each button is full-flex-width × (text + icon + py-2.5) ≈ 52px tall — **above the 44px AA / iOS HIG minimum**. Do not shrink.
- RTL: `inset-x-0` + flex auto-mirror already handle this; `--safe-left/right` are physical, which is correct for a full-width bar (symmetric in practice on phones).

**C. Top row + main padding (`Shell.tsx`).**
- The scrollable `<main>` (`Shell.tsx:135`) is the scroll container, so the status-bar inset belongs on its **top padding** on mobile only. Add `paddingTop: "var(--safe-top)"` via inline style (Tailwind has no arbitrary `env()` utility cleanly) **scoped to mobile** — simplest: wrap the existing mobile brand header (`Shell.tsx:137`) with `style={{ paddingTop: "var(--safe-top)" }}` so desktop (where the header is `hidden md:`) is unaffected and web insets are 0.
- Replace the hardcoded `pb-24` on `<main>` with safe-area-aware bottom space: `style={{ paddingBottom: "calc(6rem + var(--safe-bottom))" }}` for the mobile range, preserving the existing `md:pb-10`. Keep using the Tailwind `md:pb-10` for ≥md (where the bottom nav is hidden). Net: mobile content never hides behind nav + indicator; desktop unchanged.
- Horizontal insets for landscape notch: add `paddingLeft/Right: "var(--safe-left/right)"` to the same `<main>` inline style so content does not slip under the notch in landscape. These are 0 on web/portrait.

**D. `is-ios` / `data-platform` consumption.** Add at least one real consumer so the documented hook is live and testable:
- In `index.css`, add a native-only momentum-scroll + overscroll polish block:
```css
html.is-native .arbor-app { overscroll-behavior-y: none; }   /* kill rubber-band bounce on the app frame */
html.is-ios main { -webkit-overflow-scrolling: touch; }       /* momentum scroll in the scroll container */
```
This both proves the class is wired and removes a non-iOS-grade bounce. Keep it tiny — this file is the #1 merge magnet.

**E. Status-bar fix (`native.ts` + `capacitor.config.ts`).** Reconcile to **dark icons on the light canvas**:
- `native.ts:16` → `await StatusBar.setStyle({ style: Style.Dark });` (Capacitor `Style.Dark` = dark content, correct for light bg).
- `capacitor.config.ts:39` already says `style: "DARK"` — keep it; they now agree. Add a one-line comment at both sites: `// Style.Dark = dark icons (light "Soft Daylight" canvas). Must match capacitor.config.ts StatusBar.style.`
- Leave `overlaysWebView: false` as-is for this mission (true edge-to-edge overlay is a follow-up; safe-area work above makes it safe later).

**F. Haptics on tab change.** Install `@capacitor/haptics` (v8, match the other plugins). Add a tiny gated helper in `native.ts`:
```ts
export async function selectionHaptic(): Promise<void> {
  if (!isNativePlatform) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch { /* haptics unavailable — non-fatal */ }
}
```
Call `void selectionHaptic()` in `MobileNav.tsx`'s `onClick` (before/after `setActiveTab`) and in the `Shell.tsx` sub-nav `<button>` `onClick` (`Shell.tsx:215`). No-op on web. `prefers-reduced-motion` does **not** gate haptics (haptics ≠ motion), but respect a future user toggle if one exists — none today, so ship as-is.

**G. Android back button + iOS swipe-back.** In `native.ts` `initNativeShell()`, register an `@capacitor/app` `backButton` listener:
```ts
try {
  const { App } = await import("@capacitor/app");
  App.addListener("backButton", ({ canGoBack }) => {
    if (window.history.length > 1 && canGoBack) window.history.back();
    else App.exitApp();
  });
} catch { /* app plugin unavailable — non-fatal */ }
```
The app uses hash routing in `ArborContext` (tab → URL hash), so `history.back()` returns to the previous tab — correct UX. iOS interactive edge-swipe-back is the system default for the webview; this mission must **not** add any `touch-action`/swipe handlers on the left edge that would block it (none exist today — verify no left-edge gesture is introduced).

**States / motion / a11y / RTL summary:**
- **Default / loading / empty / error:** chrome-only; no new content states. The existing `TabSkeleton` Suspense fallback and `ErrorBoundary` (`Shell.tsx:245-256`) are untouched.
- **Motion:** no new animation. Existing tab-change `motion.div` (`Shell.tsx:247-253`) stays; it already respects nothing for reduced-motion — out of scope (owned by m5/p3). Haptics added are not motion.
- **Touch targets:** bottom-nav buttons remain ≥44px after inset padding; sub-nav pills `py-2` (`Shell.tsx:216`) are ≈36px — flag as a **known existing gap owned by m5-touch-error-states**, do not fix here to avoid scope creep, but note it.
- **a11y (AA / keyboard / reduced-motion):** no contrast change (status-bar fix actually *improves* icon legibility). Keyboard: unaffected (native chrome). prefers-reduced-motion: no new motion introduced.
- **RTL:** verified — `inset-x-0`, flex, and physical `--safe-left/right` are symmetric on phones; Hebrew RTL (`html[dir="rtl"]`, `index.css:89`) layout is unaffected by inset padding.

### Files to create / edit (exact repo-relative paths)
Edit:
- `PPPPtherapy-/PPPPtherapy-/app/src/index.css` — add `--safe-*` tokens to `:root`; add `html.is-native` / `html.is-ios` consumer block. (~8 lines, additive.)
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/MobileNav.tsx` — bottom/left/right safe-area padding on the bar; `selectionHaptic()` on tab tap.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/Shell.tsx` — top safe-area on mobile header; safe-area-aware `<main>` bottom + horizontal padding; `selectionHaptic()` on sub-nav tap.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/native.ts` — `Style.Dark` fix; `selectionHaptic()` export; `@capacitor/app` `backButton` listener.
- `PPPPtherapy-/PPPPtherapy-/app/capacitor.config.ts` — confirm/comment `StatusBar.style: "DARK"` matches runtime (no value change; add reconciliation comment).
- `PPPPtherapy-/PPPPtherapy-/app/package.json` — add `@capacitor/haptics: ^8.x` dependency (then `npm install` + `npx cap sync`).
- `PPPPtherapy-/PPPPtherapy-/app/MOBILE.md` — one-line note that `--safe-*` tokens + haptics + back-button are the native-polish layer.

Create: none.

### Shared-file conflict notes
This mission touches five files on the hotspot list — coordinate strictly:
- **`index.css`** (hotspot: order `m4` delete override → `m2` token extraction → **`m1` safe-area additions** → `p3` polish; *never parallelize*). m1 must land its `--safe-*` block **after** m4/m2 reshape the file. Keep m1's footprint to the additive `:root` lines + the tiny `html.is-native` block; do not reorder or restyle existing rules.
- **`Shell.tsx`** (hotspot: `m1` safe-area + `m5` touch/error **before** `surf-app-shell`; tabRegistry edits b5/ia-b1 serialized with navigation.ts triad; p3 last). m1 edits ONLY the mobile header wrapper, `<main>` padding, and the sub-nav button `onClick` — it must **not** touch `tabRegistry` (b5/ia-b1 territory) or the chrome structure surf-app-shell will consume. Land m1 + m5 together as the "shell padding/touch" pass before surf-app-shell.
- **`MobileNav.tsx`** (touchedBy `m1`, `surf-app-shell`). m1 owns the safe-area padding + haptic; surf-app-shell consumes the settled bar. Land m1 first.
- **`native.ts`** (touchedBy `m1`, `surf-ios`, `surf-android`). m1 establishes the status-bar fix, haptic helper, and back-button listener; surf-ios/surf-android extend the same file afterward (append listeners, don't rewrite). Land m1 first so they build on a corrected `Style.Dark`.
- **`capacitor.config.ts`** (touchedBy `m1`, `surf-ios`, `surf-android`). m1 makes a comment-only/no-value reconciliation; surf-ios/android may add platform keys later — append, don't rewrite the `plugins.StatusBar` block.

### Dependencies (other item ids that must land first)
- **`m4-retire-override-layer`** then **`m2-token-extraction`** should land in `index.css` before m1's token additions (per the index.css hotspot ordering). If m1 must proceed first for schedule reasons, place `--safe-*` at the very end of `:root` to minimize merge surface and flag for m2 to fold in.
- No functional dependency on navigation/IA missions. m1 is otherwise standalone (`dependsOn: []`).

### Acceptance criteria (testable, including "verified live on dev server")
1. `grep -r "env(safe-area-inset" app/src` returns ≥1 match (tokens) and the bottom nav + main consume `var(--safe-bottom)`.
2. **Web unchanged:** on `npm run dev` (desktop Chrome), the shell layout, bottom-nav position, and `<main>` padding are pixel-identical to pre-change (insets resolve to 0). **Verified live on dev server** via DevTools device toolbar with a notched profile (iPhone 14 Pro) showing the bottom nav lifted above the home-indicator zone and the top header below the notch.
3. **iOS simulator/device:** status-bar icons are **dark** and legible on the light canvas; bottom tab row fully tappable above the home indicator; left edge-swipe navigates back; tapping a tab fires a light haptic.
4. **Android device/emulator:** bottom nav clears the gesture pill; hardware/gesture back navigates to the previous tab and exits at the root; tab tap fires a haptic; status bar shows dark icons on `#eef2ef`.
5. `is-ios` / `is-native` classes have ≥1 live CSS consumer (`grep "is-native\|is-ios" app/src/index.css` non-empty).
6. `npm run build` and `npx cap sync` succeed; `@capacitor/haptics` resolves; TypeScript passes (`tsc`), existing test suite stays green.
7. No regression to RTL: with `uiLang="he"` the shell mirrors correctly and insets do not break the flipped border (`index.css:89`).

### Operating-rule checks
- **No dark patterns:** purely ergonomic/system polish; nothing manipulative. Back-button "exit at root" is standard platform behavior, not a trap.
- **Privacy / COPPA-2026:** no data read/written, no new permissions, no telemetry. Haptics + status bar are device-local. Compliant.
- **Moat read/write:** N/A — chrome-only mission, touches no longitudinal memory store. (Acceptable: this is foundational system polish, not a feature surface.)
- **Ships-visible:** yes — first-launch status-bar legibility, a tab bar that no longer hides under the home indicator, and tactile tab feedback are immediately perceptible on device. Web users see no change (by design).
