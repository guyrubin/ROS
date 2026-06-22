## surf-android — Surface audit — Android (Capacitor)
**Aspects:** UI/UX · **Surfaces/platforms:** android · **Priority:** Phase1

### Problem / why
Arbor ships to Google Play as a Capacitor wrapper around the React/Vite web app (`MOBILE.md:1-8`); the `android/` Gradle project is generated and committed (`android/build.gradle`, `android/app/src/main/AndroidManifest.xml`, `android/app/src/main/res/values/styles.xml` all present). `m1-ios-safe-area` lands the cross-platform safe-area token layer, status-bar reconciliation, Android hardware-back listener, and selection haptics. This mission is the **Android-only** delta that m1 deliberately scopes out — the platform-specific shell finishing that makes Arbor feel like a native Android app, not a notch-fix shared with iOS. Concrete defects, all verified in code:

1. **No edge-to-edge / display-cutout config in the Android theme.** `styles.xml:14-17` (`AppTheme.NoActionBar`) sets no `android:windowLayoutInDisplayCutoutMode`, no transparent system bars, no `android:navigationBarColor`/`enforceNavigationBarContrast`. On Android 15+ (API 35) apps are **forced edge-to-edge** by the OS, and on 10–14 gesture-nav devices the bottom gesture pill overlays the webview. Without `viewport-fit=cover`'s insets being honored by a matching window config, the bottom tab bar in `MobileNav.tsx:13-16` (`fixed bottom-0`, no padding) sits under the gesture pill. m1 adds `paddingBottom: var(--safe-bottom)` to that bar — but `env(safe-area-inset-bottom)` only resolves to a non-zero value on Android **if the window is edge-to-edge and cutout mode allows it**. The native theme must be set so m1's CSS insets actually receive a value.
2. **Status-bar background is hardcoded to one canvas color, no nav-bar treatment.** `native.ts:18` calls `StatusBar.setBackgroundColor({ color: "#eef2ef" })` (Android only) — correct for the light canvas, but there is **no navigation-bar color/style** set, so the gesture-pill area renders with the OS default (often a grey scrim) that clashes with Arbor's `#eef2ef` "Soft Daylight" canvas. The seam between app and system nav bar is the most visible "not native" Android tell.
3. **`data-platform="android"` / `html.is-android` styling hooks are written but unconsumed.** `native.ts:10-11` sets `data-platform` + `is-android` on `<html>`; m1 adds an `html.is-native`/`html.is-ios` consumer block to `index.css` but adds **no `is-android` rule**. Android-specific affordances (Material-style focus ripples off, scrollbar overlay, the nav-bar seam fill) have no home. Dead hook on Android specifically.
4. **Placeholder bundle id, un-redeployed CORS.** `capacitor.config.ts:18` is the placeholder-grade `app.arbor.family`; `AndroidManifest.xml:25` derives the FileProvider authority from `${applicationId}`. `MOBILE.md:23-30` documents that the prod backend (`arbor-api` on Cloud Run) must be **redeployed** for `capacitor://localhost`/`https://localhost` CORS to take effect — Android's webview origin is `https://localhost`, so **API calls fail on a real Android build until that redeploy ships**. This is the gate between "compiles" and "works".

This is the `surf-android` item on the UI/UX surface-audit map: the distinct Android platform pass, parallel to `surf-ios`.

### Scope across platform domains
- **Web** — No web-visible change. Every edit is gated to Android: native `styles.xml`/manifest (not loaded on web), `html.is-android` CSS (web `<html>` never carries the class), and `nativePlatform === "android"` runtime branches. Verify web is byte-identical.
- **iOS (Capacitor)** — Out of scope; owned by `surf-ios`. This mission must not touch the `ios/` project or any `nativePlatform === "ios"` branch.
- **Android (Capacitor)** — The whole mission: edge-to-edge window theme, nav-bar color + cutout mode, `is-android` CSS consumer, navigation-bar style via `@capacitor/status-bar` / native theme, bundle-id decision, CORS-redeploy runbook step.
- **Landing EN / Landing HE (RTL)** — Out of scope (separate marketing surface).

### IA / UX / Copy / Marketing detail (UI/UX)
Chrome/system mission — no IA, no copy, no marketing surface. All work is UI/UX + Android native config. **Hard dependency on `m1-ios-safe-area` landing first** (it owns the `--safe-*` tokens, the `MobileNav`/`Shell` inset padding, the status-bar `Style.Dark` fix, and the `@capacitor/app` back-button listener). This mission only adds the Android-specific layer on top.

**A. Edge-to-edge window theme (`android/app/src/main/res/values/styles.xml`).** Extend `AppTheme.NoActionBar` so the OS reports real insets to the webview and the system bars are transparent (letting Arbor's canvas show through):
```xml
<style name="AppTheme.NoActionBar" parent="Theme.AppCompat.DayNight.NoActionBar">
    <item name="windowActionBar">false</item>
    <item name="windowNoTitle">true</item>
    <item name="android:background">@null</item>
    <!-- surf-android: edge-to-edge so env(safe-area-inset-*) resolves; bars transparent over the Soft Daylight canvas -->
    <item name="android:statusBarColor">@android:color/transparent</item>
    <item name="android:navigationBarColor">@android:color/transparent</item>
    <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
    <item name="android:enforceNavigationBarContrast">false</item>
    <item name="android:enforceStatusBarContrast">false</item>
    <item name="android:windowLightStatusBar">true</item>
    <item name="android:windowLightNavigationBar">true</item>
</style>
```
- `enforceNavigationBarContrast=false` removes the grey scrim Android draws over a transparent nav bar (the seam in defect 2). `windowLight*Bar=true` gives **dark icons** on the light canvas, matching the m1 status-bar `Style.Dark` decision (`m1` spec §E). `shortEdges` lets content extend under the cutout in landscape; m1's `--safe-left/right` on `<main>` already protects content.
- `enforceNavigationBarContrast` / `enforceStatusBarContrast` are API 29+; `windowLightNavigationBar` is API 27+. Wrap nothing — these attributes are ignored on older APIs (safe), and Arbor's `variables.gradle` minSdk should be confirmed ≥23 (Capacitor 6 default minSdk is 23; verify).

**B. Native nav/status seam fill at runtime (`native.ts`, Android branch).** With transparent system bars, the webview now paints edge-to-edge; m1's `--safe-bottom` inset on `MobileNav` keeps tap targets above the pill, and the bar's own `bg-white` fills the area behind the gesture pill. Confirm the existing `StatusBar.setBackgroundColor` call (`native.ts:18`) is **removed or set to transparent** under edge-to-edge — a solid status-bar color with `overlaysWebView:false` conflicts with the transparent-bar theme. Reconcile to:
```ts
if (nativePlatform === "android") {
  // Edge-to-edge: bars are transparent in the theme; let the canvas show through.
  try {
    const { StatusBar } = await import("@capacitor/status-bar");
    await StatusBar.setOverlaysWebView({ overlay: true });
  } catch { /* non-fatal */ }
}
```
- This flips Android to true overlay (m1 intentionally left `overlaysWebView:false` as an iOS-safe default and flagged edge-to-edge as a follow-up — this is that follow-up, Android-only). With overlay on, `env(safe-area-inset-top)` becomes non-zero and m1's mobile-header `paddingTop: var(--safe-top)` (`Shell.tsx` per m1 §C) lifts the brand header below the status bar. **Append** this branch; do not rewrite m1's status-bar `Style.Dark` block.
- Update `capacitor.config.ts` `plugins.StatusBar.overlaysWebView` reasoning with a one-line comment that Android overrides to overlay at runtime (leave the static value for iOS).

**C. `is-android` CSS consumer (`index.css`).** Add the documented-but-dead Android hook as a real consumer, appended **after** m1's `html.is-native`/`html.is-ios` block (so the merge is purely additive on the #1 hotspot file):
```css
/* surf-android: Android-specific shell polish (data-platform=android hook) */
html.is-android body { overscroll-behavior-y: none; }              /* no glow/stretch overscroll on the app frame */
html.is-android ::-webkit-scrollbar { width: 0; height: 0; }        /* overlay-style scrollbars, Material-quiet */
html.is-android .md\:hidden.fixed.bottom-0 { padding-bottom: max(var(--safe-bottom), 8px); } /* guarantee min clearance over the gesture pill even when inset reports 0 on 3-button nav */
```
Keep it tiny (≤4 lines). The third rule is the Android-specific safety net: 3-button navigation reports `safe-area-inset-bottom: 0`, so a `max(var(--safe-bottom), 8px)` ensures the bar never sits flush against the 3-button bar edge.

**D. Bundle id decision (`capacitor.config.ts:18` + manifest).** `app.arbor.family` is a real, usable reverse-DNS id and is acceptable as the launch id **if** it is registered in the Play Console before first upload. The spec's recommendation: **keep `app.arbor.family`** (clean, brandable, matches the iOS recommendation in `surf-ios`) and treat it as final — record the decision in `MOBILE.md` so it is not re-litigated, since it is immutable post-listing (`capacitor.config.ts:13-15`). If Guy wants a different id, change `appId` then re-run `npx cap sync` (regenerates the manifest `${applicationId}` derivations). No code edit if keeping the current id; this is a **documented decision**, not a change.

**E. CORS redeploy runbook (operational gate).** Per `MOBILE.md:27-30`, the Android webview origin `https://localhost` is already in `env.ts` CORS allowlist but needs a backend redeploy:
`gcloud builds submit --config cloudbuild.prod.yaml --project arborprd-westeu` (from `PPPPtherapy-/PPPPtherapy-/`). This mission's acceptance includes confirming the redeploy has shipped (or filing it as the one blocking action for Guy), because without it every `/api/*` call from the Android build returns a CORS failure and the app is non-functional despite compiling.

**States / motion / a11y / RTL summary:**
- **Default / loading / empty / error:** chrome-only; no new content states. Existing Suspense/`ErrorBoundary` in `Shell.tsx` untouched.
- **Motion:** no new animation. `prefers-reduced-motion` unaffected (no motion added).
- **Touch targets:** the `max(var(--safe-bottom), 8px)` floor preserves m1's ≥44px bottom-nav buttons clear of the gesture/3-button bar. No target shrinks.
- **a11y (AA / keyboard / reduced-motion):** `windowLightStatusBar`/`windowLightNavigationBar=true` yield dark system icons on `#eef2ef` (contrast improves vs. the default scrim). Keyboard: native chrome, unaffected. Removing `::-webkit-scrollbar` does not affect keyboard scroll or focus order.
- **RTL:** `supportsRtl="true"` already set (`AndroidManifest.xml:8`). Transparent bars + physical `--safe-left/right` (from m1) are symmetric on phones; Hebrew RTL layout unaffected.

### Files to create / edit (exact repo-relative paths)
Edit:
- `PPPPtherapy-/PPPPtherapy-/app/android/app/src/main/res/values/styles.xml` — edge-to-edge window attributes on `AppTheme.NoActionBar` (§A).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/native.ts` — Android `setOverlaysWebView({overlay:true})` branch; remove/transparent the solid status-bar color under edge-to-edge (§B). **Append** to m1's native block.
- `PPPPtherapy-/PPPPtherapy-/app/src/index.css` — `html.is-android` consumer block, appended after m1's native block (§C).
- `PPPPtherapy-/PPPPtherapy-/app/capacitor.config.ts` — comment that Android runtime overrides `overlaysWebView` to true (§B); confirm `appId` decision (§D). Append only inside `plugins.StatusBar` reasoning / `android` block; do not rewrite.
- `PPPPtherapy-/PPPPtherapy-/app/MOBILE.md` — record the final bundle-id decision (§D) and a one-line note that Android is edge-to-edge (status/nav bars transparent, theme attributes in `styles.xml`).

Create: none. (Optionally a colors.xml entry is **not** needed — transparent bars use framework `@android:color/transparent`.)

### Shared-file conflict notes
Touches three hotspot-list files plus two Android-only files (no contention on the Android files):
- **`src/lib/native.ts`** (touchedBy `m1`, `surf-ios`, `surf-android`): m1 establishes the corrected status-bar `Style.Dark`, `selectionHaptic()`, and `@capacitor/app` back-button listener. surf-android **appends** an Android-only `setOverlaysWebView` branch and reconciles the existing Android `setBackgroundColor`. **Land m1 first; surf-ios and surf-android each append a platform-gated branch — never rewrite the file, never touch the other platform's branch.** Coordinate so surf-ios and surf-android land sequentially (both append to `initNativeShell`).
- **`capacitor.config.ts`** (touchedBy `m1`, `surf-ios`, `surf-android`): m1 makes a comment-only `StatusBar.style` reconciliation. surf-android adds an Android-comment / confirms `appId`; surf-ios may add iOS keys. **Append inside the respective `ios`/`android`/`plugins` blocks; do not rewrite `plugins.StatusBar`.** Per the index.css/native ordering, run after m1.
- **`src/index.css`** (hotspot, #1 merge magnet; order: `m4` → `m2` → `m1` → `p3`): surf-android's `html.is-android` block must land **after** m1's `html.is-native`/`html.is-ios` block, appended at the same location (the native-polish section m1 created). Keep to ≤4 additive lines, no reordering of existing rules. Slot surf-android after m1 and before/independent of p3 polish.
- **Android-only files** (`styles.xml`, `AndroidManifest.xml`, `MOBILE.md`): no other mission in the conflict map touches the `android/` native tree, so no contention. `MOBILE.md` is also edited by m1 (one-line native-polish note) — append a distinct line; do not collide with m1's line.

### Dependencies (other item ids that must land first)
- **`m1-ios-safe-area`** — hard dependency (declared in the work item). Provides `--safe-*` tokens, `MobileNav`/`Shell` inset consumption, the `html.is-native`/`is-ios` CSS block this appends to, the status-bar `Style.Dark` fix, and the `@capacitor/app` back-button listener. surf-android's edge-to-edge theme is only meaningful once those insets are consumed.
- Recommended (index.css hygiene, not strictly blocking): `m4-retire-override-layer` and `m2-token-extraction` land in `index.css` before this, per the hotspot ordering. If they slip, append the `is-android` block at the end of m1's native section and flag for m2 to fold.

### Acceptance criteria (testable, including "verified live on dev server")
1. `styles.xml` `AppTheme.NoActionBar` contains `windowLayoutInDisplayCutoutMode`, transparent `statusBarColor`/`navigationBarColor`, `enforceNavigationBarContrast=false`, and `windowLight*Bar=true`.
2. **Web unchanged:** `npm run dev` in desktop Chrome — shell, bottom-nav position, and `<main>` padding are pixel-identical to post-m1 state (no `is-android` class on web `<html>`; verify in DevTools). **Verified live on dev server.**
3. **Android emulator/device (gesture nav, API ≥33):** system status + navigation bars are transparent showing the `#eef2ef` canvas (no grey scrim seam); system bar icons are **dark** and legible; the bottom tab bar floats clear of the gesture pill with full tap targets; the brand header sits below the status bar.
4. **Android 3-button nav device:** bottom tab bar keeps ≥8px clearance from the 3-button bar (the `max(var(--safe-bottom),8px)` floor).
5. `grep "is-android" app/src/index.css` is non-empty (live consumer of the `data-platform` hook).
6. `nativePlatform === "android"` branch in `native.ts` calls `setOverlaysWebView({overlay:true})`; iOS branch untouched.
7. `npm run build` (with `VITE_API_BASE=https://arborprd-westeu.web.app`) + `npx cap sync` succeed; `tsc` passes; existing test suite stays green.
8. **API works on device:** after the CORS redeploy (`cloudbuild.prod.yaml`) is confirmed shipped, an Android build successfully calls `/api/*` (e.g. loads the child profile) with no CORS error in `adb logcat`. If the redeploy has not shipped, this is logged as the single blocking action for Guy in `MOBILE.md`.
9. Bundle-id decision recorded in `MOBILE.md`; `capacitor.config.ts appId` matches it; `npx cap sync` regenerates the manifest `${applicationId}` without error.
10. RTL: with `uiLang="he"` on an Android device the shell mirrors correctly; transparent bars and physical insets do not break the flipped layout.

### Operating-rule checks
- **No dark patterns:** purely ergonomic/system polish (edge-to-edge, bar seam, scrollbars). Nothing manipulative; no forced engagement.
- **Privacy / COPPA-2026:** no data read/written, no new Android permissions (manifest keeps only `INTERNET`), no telemetry. Theme + status-bar are device-local. Compliant.
- **Moat read/write:** N/A — chrome/system mission, touches no longitudinal memory store. Acceptable as foundational platform polish (mirrors m1's stance).
- **Ships-visible:** yes — on an Android device the transparent system bars, eliminated nav-bar seam, dark legible icons, and a tab bar clear of the gesture pill are immediately perceptible. Web users see no change (by design).
