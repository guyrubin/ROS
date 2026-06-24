## surf-ios — Surface audit — iOS (Capacitor)
**Aspects:** UI/UX · **Surfaces/platforms:** ios · **Priority:** Phase1

### Problem / why
Arbor ships to the App Store as a Capacitor wrapper around the React/Vite web app (`MOBILE.md:1-8`). `m1-ios-safe-area` fixes the system-chrome layer (safe-area insets, the `Style.Light`→`Style.Dark` status-bar contradiction, haptics, the Android/iOS back affordance). This whole-surface pass closes the **remaining iOS-specific gaps that m1 explicitly defers**, all verified in code:

1. **Placeholder bundle id = App Store submission blocker.** `capacitor.config.ts:18` ships `appId: "app.arbor.family"`, and `MOBILE.md:13-16,24-26` flags it as a placeholder that "cannot be changed after a store listing exists." It must be locked to the real registered reverse-DNS id before first submission, and the iOS project (`ios/App`) re-synced.
2. **`theme-color` contradicts the light canvas.** `index.html:7` sets `<meta name="theme-color" content="#0c0e14">` (near-black) while the entire native shell — `capacitor.config.ts:21,24,33,40` and the runtime status-bar (`native.ts`, now `Style.Dark` after m1) — targets the light "Soft Daylight" canvas `#eef2ef`. On iOS PWA/standalone and any WKWebView surface that reads `theme-color`, this paints a dark chrome edge under a light app. Inconsistent with config and with m1's dark-icons-on-light decision.
3. **Input auto-zoom on focus.** The global form-control rules (`index.css:303-322`) set background/border/radius but **no `font-size`**. iOS WKWebView auto-zooms the viewport whenever a focused `<input>/<textarea>/<select>` computes to `< 16px` — a classic non-iOS-grade jolt on every text field (Ask box, profile fields, search). Repo-wide there is no `font-size: 16px` floor on inputs.
4. **iOS webview default chrome left on.** No `-webkit-tap-highlight-color` reset (grey flash box on every tap), no `-webkit-text-size-adjust` lock (iOS reflows text on rotation), and no `-webkit-touch-callout`/long-press-callout policy for the child PlayKit register. The `is-ios` / `data-platform="ios"` hook (`native.ts:10-11`) is documented as the platform-CSS seam (`MOBILE.md:71-72`) but, after m1's one momentum-scroll consumer, still has no iOS-tuning block.
5. **`contentInset: "always"` interaction unverified.** `capacitor.config.ts:23` forces `contentInset: "always"`; combined with m1's `--safe-top` padding on the mobile header this can **double-count** the status-bar inset on notched devices. Must be reconciled (pick one inset owner) and verified live.
6. **iOS build needs a Mac (operational).** `MOBILE.md:46-50` — iOS archiving requires macOS + Xcode (Team/signing → Product → Archive). The `ios/` project is committed and builds as-is; this surface pass documents the exact submission gate so it is not a surprise at launch.

This is the iOS slice of the per-surface rubric defined in `p3-ios-grade-audit` (§B); surf-ios produces a pass against it for the webview layer.

### Scope across platform domains
- **iOS (Capacitor)** — the only target. Bundle id locked; `theme-color` reconciled to the light canvas; 16px input floor stops auto-zoom; an `html.is-ios` CSS block resets tap-highlight, locks text-size-adjust, and sets the callout policy; `contentInset` vs `--safe-top` reconciled; Info.plist display name + status-bar appearance verified; submission gate documented.
- **Web** — All CSS additions are either iOS-class-scoped (`html.is-ios …`, zero effect on web where the class is absent) or no-ops on desktop (a 16px input floor is invisible — desktop never auto-zooms; `theme-color` change only affects mobile chrome). `appId`/Info.plist/build changes are native-only. **Verify web layout is byte-identical.**
- **Android (Capacitor)** — Out of scope here (owned by `surf-android`), but the `theme-color` fix and the 16px input floor benefit Android too; coordinate so surf-android does not re-edit the same `index.html`/`index.css` lines (see conflict notes). The iOS-class-scoped block does not touch Android.
- **Landing EN / Landing HE (RTL)** — Out of scope (separate marketing surface).

### IA / UX / Copy / Marketing detail (UI/UX)

Chrome/system mission — no IA, copy, or marketing-loop changes. All work is UI/UX + native config. m1 must land first; surf-ios **appends** to the files m1 establishes, never rewrites them.

**A. Lock the bundle id (`capacitor.config.ts:18`).** Replace the placeholder `app.arbor.family` with the real registered App Store Connect id once confirmed by Guy (decision gate — this is a Safety-4-adjacent irreversible store action; do not invent an id). Until confirmed, leave the placeholder but add an inline `// TODO(store): confirm registered App Store Connect bundle id before first submission — irreversible once a listing exists` so the blocker is unmissable. After the id is set: `npx cap sync ios` to propagate into `ios/App` (`MOBILE.md:34-42`).

**B. Reconcile `theme-color` (`index.html:7`).** Change `content="#0c0e14"` → `content="#eef2ef"` to match `capacitor.config.ts` backgroundColor / StatusBar color and m1's dark-icons-on-light decision. (Optionally add a `media="(prefers-color-scheme: dark)"` companion `theme-color` of `#141d18` matching the dark splash in `MOBILE.md:60-61` — only if a dark theme exists; today the app is light-only, so ship the single light value.)

**C. 16px input floor — stop iOS auto-zoom (`index.css`).** In the iOS-scoped block (D), add:
```css
html.is-ios .arbor-app input,
html.is-ios .arbor-app textarea,
html.is-ios .arbor-app select {
  font-size: 16px; /* iOS WKWebView auto-zooms focused fields < 16px; this pins it */
}
```
Scope to `is-ios` so web/desktop typography is untouched. (If a field's visual design truly needs < 16px text, the alternative is a per-field transform, but the global iOS floor is the safe, standard fix.)

**D. iOS webview-tuning block (`index.css`) — make `is-ios` a live, tested hook.** Append one small `html.is-ios` block (after m1's `html.is-native`/`html.is-ios` lines so it merges cleanly; keep footprint minimal — this file is the #1 merge magnet):
```css
html.is-ios { -webkit-text-size-adjust: 100%; } /* no reflow-on-rotate */
html.is-ios .arbor-app { -webkit-tap-highlight-color: transparent; } /* kill grey tap flash; we own :active states */
html.is-ios .arbor-play, html.is-ios .arbor-play * { -webkit-touch-callout: none; -webkit-user-select: none; } /* child register: no long-press callout/selection */
```
Note: the parent app must KEEP text selectable (`Shell.tsx:124` deliberately removed `select-none` so parents can copy scripts) — so the callout/user-select suppression is scoped to `.arbor-play` (the child PlayKit register) only, never the parent surfaces.

**E. Reconcile `contentInset` vs `--safe-top` (`capacitor.config.ts:23` + verify against m1).** Pick a single inset owner to avoid double status-bar padding on notched iPhones:
- Recommended: keep `contentInset: "always"` (iOS auto-insets the webview content below the status bar) **and** confirm m1's `--safe-top` on the mobile header resolves to `0px` in this configuration (because `overlaysWebView:false` + `contentInset:always` means the webview already starts below the bar, so `env(safe-area-inset-top)` is 0). If live testing shows a doubled gap, set `contentInset: "never"` and let m1's `--safe-top` own the inset. Document the chosen owner in a `capacitor.config.ts` comment. Decide by observation on the simulator, not by guessing.

**F. Info.plist verification (`ios/App/App/Info.plist`).** Confirm (do not blindly rewrite — Capacitor generated it):
- `CFBundleDisplayName` (`Info.plist:9`) = "Arbor" (home-screen label).
- `UIViewControllerBasedStatusBarAppearance` (`Info.plist:48`) — leave as Capacitor's default (the `@capacitor/status-bar` plugin drives appearance at runtime via m1's `Style.Dark`); only flip if live status-bar style is wrong after m1.
- No privacy-usage strings are present, which is correct **only while the app has no native mic/camera/photo access**. The Speech/Mimic features run in the webview (`getUserMedia`), which on iOS WKWebView requires `NSMicrophoneUsageDescription` / `NSCameraUsageDescription` — flag this as a **pre-submission dependency** for whichever item ships native A/V (p2-10-kid-asr / p2-11-mimic-mediapipe); add a one-line note, do not add the keys speculatively here.

**G. Operational submission gate (`MOBILE.md`).** Add a short "iOS submission checklist" subsection: (1) confirm bundle id (A), (2) `npx cap sync ios` on a Mac, (3) set Team/signing in Xcode, (4) Archive → Distribute → App Store Connect, (5) ensure CORS redeploy done (`MOBILE.md:27-30`), (6) privacy strings present IF native A/V shipped. This is documentation only — the actual archive must run on macOS (no Mac in this environment; CI/Guy executes).

**States / motion / a11y / RTL summary:**
- **Default/loading/empty/error:** chrome/config only — no new content states. Existing `TabSkeleton` + `ErrorBoundary` (`Shell.tsx:245-256`) untouched.
- **Motion:** none added. No animation in scope.
- **Touch targets:** unchanged by this item; the ≥44px chrome floors are owned by `p3-ios-grade-audit` §A and `m5-touch-error-states` — do not duplicate. The 16px input floor improves usability without changing hit-area.
- **a11y (AA / keyboard / reduced-motion):** `theme-color` and tap-highlight changes do not affect contrast of content; removing the grey tap-flash means our own `:active`/`focus-visible` states (global ring `index.css:391-400`) become the sole affordance — verify they reach MobileNav + sub-nav buttons on device. No keyboard or reduced-motion change.
- **RTL:** no layout change; all additions are physical-property resets or font-size, symmetric under `html[dir="rtl"]` (`index.css:80-93`). Verify Hebrew on iOS shows dark status-bar icons and no input zoom.

### Files to create / edit (exact repo-relative paths)
Edit:
- `PPPPtherapy-/PPPPtherapy-/app/capacitor.config.ts` — bundle-id TODO/lock (A); `contentInset` reconciliation comment (E). Append-only to the existing object; do NOT rewrite the `plugins.StatusBar` block (m1 owns it).
- `PPPPtherapy-/PPPPtherapy-/app/index.html` — `theme-color` `#0c0e14`→`#eef2ef` (B).
- `PPPPtherapy-/PPPPtherapy-/app/src/index.css` — `html.is-ios` input 16px floor (C) + webview-tuning block (D), appended after m1's `html.is-native`/`html.is-ios` lines.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/native.ts` — no behavior change expected; if E requires it, append only (m1 owns the status-bar/haptic/back-button code — do not edit those lines).
- `PPPPtherapy-/PPPPtherapy-/app/ios/App/App/Info.plist` — verify-only (F); edit only if live status-bar/display-name is wrong. Likely no change.
- `PPPPtherapy-/PPPPtherapy-/app/MOBILE.md` — iOS submission checklist subsection (G).

Create: none.

### Shared-file conflict notes
This item touches three files on the hotspot list — coordinate strictly:
- **`capacitor.config.ts`** (touchedBy `m1`, `surf-ios`, `surf-android`). m1 lands first (status-bar `style:"DARK"` reconciliation comment, no value change). surf-ios then appends the bundle-id TODO and `contentInset` comment. surf-android appends its own platform keys afterward. **Append to the config object; never rewrite the `plugins.StatusBar` block.** Serialize: m1 → surf-ios → surf-android.
- **`src/lib/native.ts`** (touchedBy `m1`, `surf-ios`, `surf-android`). m1 establishes `Style.Dark`, `selectionHaptic()`, and the `@capacitor/app` backButton listener. surf-ios expects **no edit** here (E should be solvable in config); if unavoidable, append a new gated helper and call it from `initNativeShell()` after m1's listeners — do not touch m1's lines. Serialize after m1.
- **`index.css`** (hotspot order: `m4` delete override → `m2` token extraction → `m1` safe-area → `p3` polish; *never parallelize*). surf-ios inserts its `html.is-ios` block **after** m1's `html.is-native`/`html.is-ios` consumer lines and **before/independent of** p3 polish; keep it to the ~5 additive lines specified. Coordinate with `surf-android`: it adds an `html.is-android` block — non-overlapping selectors, but both append near m1's native block, so land surf-ios then surf-android to avoid a merge collision in the same region.
- **`index.html`** — not on the shared-file map, but `surf-android` benefits from the same `theme-color` fix; surf-ios owns the single edit (light-only value) and surf-android consumes it (no re-edit).

### Dependencies (other item ids that must land first)
- **`m1-ios-safe-area`** — MUST land first. It corrects the status-bar style, establishes the `html.is-native`/`html.is-ios` CSS seam this item extends, and owns safe-area/`--safe-top` which §E reconciles against `contentInset`. Building surf-ios before m1 would fork `native.ts`/`capacitor.config.ts`/`index.css`.
- Soft ordering: `m4-retire-override-layer` → `m2-token-extraction` should land before the `index.css` additions (per the hotspot order) so surf-ios appends onto the settled file.

### Acceptance criteria (testable, including "verified live on dev server")
1. `index.html` `theme-color` is `#eef2ef`; no `#0c0e14` remains.
2. `html.is-ios` input/textarea/select compute to `font-size: 16px`; focusing the Ask input or search field in the iOS simulator triggers **no viewport zoom** (verified on iOS Simulator / device).
3. `html.is-ios` block sets `-webkit-text-size-adjust:100%` and `-webkit-tap-highlight-color:transparent`; tapping a MobileNav tab shows **no grey flash box**, only our `:active`/focus styles.
4. Long-press inside the child `.arbor-play` register shows **no iOS text-selection callout**; long-press / selection on parent surfaces (e.g. an Ask answer) **still works** (parent copy preserved per `Shell.tsx:124`).
5. `capacitor.config.ts` `appId` either equals the confirmed registered id OR carries the explicit pre-submission TODO; `npx cap sync ios` runs clean.
6. On a notched iPhone simulator, the mobile header clears the status bar with **no doubled gap** (contentInset vs `--safe-top` reconciled); chosen inset owner is documented in a config comment.
7. `MOBILE.md` contains the iOS submission checklist including the native A/V privacy-string note.
8. **Web regression:** `npm run dev` web build is byte-identical in layout — no input zoom change visible on desktop, `theme-color` change has no desktop layout effect, `is-ios` selectors are inert on web (class absent). Verified live on the dev server.
9. TypeScript + existing test suite green (`npm run build` / vitest); no new console errors in the iOS webview.

### Operating-rule checks
- **No dark patterns:** purely corrective/system polish (legible chrome, no zoom jolt); nothing manipulative. The child-register callout suppression prevents accidental selection during play, not engagement coercion.
- **Privacy / COPPA-2026:** no new data collection. Flags (does not add) the native mic/camera privacy strings as a gate for the A/V items — surfacing a consent/transparency requirement, never bypassing it. Child-register `user-select:none` is UX hygiene, not tracking.
- **Moat read/write:** N/A — chrome/config layer touches no longitudinal data; it must not break the existing reads/writes (verify Ask/profile flows still persist after the input-zoom and webview changes).
- **Ships-visible:** every change is observable on first iOS launch — correct status-bar/theme edge color, no field zoom, no tap flash, a polished native feel — exactly the "Arbor at iOS level" north star.
