## m5-touch-error-states — Touch-target fix + shared ErrorState primitive
**Aspects:** UI/UX, Copy · **Surfaces/platforms:** app:shell, web:Today, web:MyChild, web:Care · **Priority:** Phase2

### Problem / why
Two adjacent UI/UX-map gaps (M5), both quality-of-craft regressions that fail "Arbor at iOS level":

1. **Sub-spec touch targets.** Three header accessory buttons in the app shell render at `min-h-[38px]` — below the WCAG 2.1 AA / iOS-HIG floor of **44×44 CSS px**. On Capacitor iOS/Android these are real finger targets; 38px reads as cramped and mis-taps. Confirmed at `Shell.tsx:167` (Search), `Shell.tsx:175` (How Arbor helps), `Shell.tsx:195` (Sign out). The mobile-only Settings/Sign-out icon button at `Shell.tsx:185` is already `w-10 h-10` (40px) and is also a near-miss.
2. **No shared error/retry primitive.** The UI kit has `EmptyState` (`components/ui/EmptyState.tsx`) and `Skeleton`/`TabSkeleton` (`components/ui/Skeleton.tsx`) but **no `ErrorState`**. Data tabs that fetch async either swallow failures silently or never surface a retry:
   - `CareTeam.tsx:30-44` — `load()` wraps each call in `.catch(() => ({ shares: [] }))`, so a network failure renders as the *empty* state ("No one on the team yet"). A parent with a real care team sees "nobody here" on a transient error and cannot retry.
   - `BehaviorsTab.tsx:457-463` — shows Skeleton while `!logsLoaded`, then jumps straight to the "no match" empty row; a load failure that never flips `logsLoaded` shows skeletons forever.
   - `OverviewTab.tsx` Today-focus well (`:208-220`) renders loading → focus → empty, but has **no error branch** if `useTodaysFocus` fails.

The fix is small and high-leverage: bump the three targets to ≥44px, build one `ErrorState` primitive that sits beside `EmptyState`/`Skeleton`, and adopt the canonical loading→empty→**error** triad across the three named data surfaces.

### Scope across platform domains
- **Web app:** Primary surface. Shell header buttons resized; `ErrorState` primitive created; adopted in OverviewTab (Today), BehaviorsTab (My Child), CareTeam (Care).
- **iOS (Capacitor):** No native code change. Benefits directly — the same React shell is the iOS WebView. The 44px bump is most load-bearing here (HIG minimum). Verify in iOS-sized viewport.
- **Android (Capacitor):** Same as iOS; Material spec floor is 48dp ≈ 44–48 CSS px, so 44px clears AA and is acceptable; bump to `min-h-[44px]` satisfies both.
- **Landing EN / Landing HE:** Out of scope (separate `html/` files, not the live app).

### IA / UX / Copy detail (build-level)

#### A. Touch-target fix (UI/UX — `Shell.tsx`)
Replace `min-h-[38px]` with `min-h-[44px]` on all three header buttons and add `min-w` parity so icon-only collapses (the Search button hides its label below `sm`, the "How helps" button is `hidden xl:flex`) still meet 44×44:

- `Shell.tsx:167` (Search): `... px-3 py-2 min-h-[38px] ...` → `... px-3 py-2 min-h-[44px] min-w-[44px] justify-center ...`
- `Shell.tsx:175` ("How Arbor helps", xl-only): `min-h-[38px]` → `min-h-[44px]`
- `Shell.tsx:195` (Sign out, mobile-only): `min-h-[38px]` → `min-h-[44px]`
- `Shell.tsx:185` (Settings, mobile): already `w-10 h-10` (40px) → bump to `w-11 h-11` (44px) for full compliance while here.
- The EN/HE language toggle pills (`Shell.tsx:152-161`) are `px-2 py-1` (~26px) — **leave as-is for this mission** (they are a segmented control, not a standalone target, and resizing them is an `m1`/`surf-app-shell` chrome decision). Note in PR description; do not touch to avoid clobbering those missions.

No layout reflow expected: the header row is `flex items-center` and buttons already carry `py-2`; the 6px height increase is absorbed by `items-center`. Verify the row does not wrap at 360px width.

#### B. Shared `ErrorState` primitive (UI/UX + Copy — new file)
Create `components/ui/ErrorState.tsx`, API mirroring `EmptyState` so it reads as a sibling:

```tsx
import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/** Inline error + retry. Sibling of EmptyState/Skeleton. Use whenever an async
 *  read fails so the surface never silently degrades to an empty state. */
export function ErrorState({
  headline,
  body,
  onRetry,
  retryLabel = "Try again",
  retrying = false,
  className = "",
}: {
  headline?: string;
  body?: string;
  onRetry?: () => void;
  retryLabel?: string;
  retrying?: boolean;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center text-center gap-3 py-10 px-6 ${className}`}
    >
      <span
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: "var(--arbor-peach-soft)", color: "var(--arbor-peach-ink)" }}
      >
        <AlertTriangle className="w-6 h-6" />
      </span>
      <h3 className="text-base font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--arbor-ink)" }}>
        {headline ?? "We couldn't load this"}
      </h3>
      <p className="text-xs max-w-sm leading-relaxed" style={{ color: "var(--arbor-muted)" }}>
        {body ?? "Something interrupted the connection. Your data is safe — give it another try."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="inline-flex items-center justify-center gap-2 font-bold text-sm rounded-2xl px-5 min-h-[44px] mt-1 transition disabled:opacity-60"
          style={{ background: "var(--arbor-green-soft)", color: "var(--arbor-green-ink)" }}
        >
          <RefreshCw className={`w-4 h-4 ${retrying ? "animate-spin" : ""}`} /> {retryLabel}
        </button>
      )}
    </div>
  );
}

export default ErrorState;
```

Design notes:
- **Tokens only** — peach-soft/peach-ink for the warning glyph, green-soft/green-ink for the recovery action (matches kit.tsx convention: green = recovery/trust, peach = attention). No hardcoded hex (respects the m2/m3 token discipline; do not introduce literals).
- **Touch target** — retry button is `min-h-[44px]` from birth, so it is compliant on mobile.
- **a11y** — `role="alert"` announces the failure to screen readers on mount; retry is a real `<button type="button">` so it is keyboard-focusable and picked up by the existing global `:focus-visible` ring (`index.css:391-400`). The spinner uses `animate-spin`, already neutralised by the global `prefers-reduced-motion` block (`index.css:401-407`) — **no extra motion guard needed**.
- **RTL** — purely centered flex column with no directional margins/icons-with-direction, so it mirrors correctly under the Hebrew `dir="rtl"` app flip with zero extra work.
- **Copy** — defaults are reassuring and non-blaming ("Your data is safe"), no error codes, no dark patterns. Per-surface overrides below. Strings localised via i18n keys.

#### C. Adoption across the three data surfaces (UI/UX + Copy)

**1. CareTeam.tsx (Care)** — split the silent failure into a real error state.
- Add `const [error, setError] = useState(false);`
- In `load()` (`:30-44`): wrap the `Promise.all` so a *both-failed* outcome sets `error`. Keep the per-call `.catch` for partial resilience, but detect total failure: set `setError(false)` at start; in a top-level `try/catch` around the awaited calls, `setError(true)` on throw; reset on success.
- Render order becomes: `loading` (keep existing spinner card) → `error` → empty → content. Insert before the empty branch (`:68`):
  ```tsx
  ) : error ? (
    <ErrorState
      headline={t("err.careTeam.title")}
      body={t("err.careTeam.body", { name: first })}
      onRetry={() => void load()}
      retryLabel={t("err.retry")}
      retrying={loading}
    />
  ) : ...
  ```

**2. BehaviorsTab.tsx (My Child)** — surface a load failure instead of infinite skeleton.
- The store flag is `logsLoaded` (from `useArbor`). Add a sibling `logsError` read from context **only if it already exists**; if `ArborContext` does not expose a logs-error flag, do **not** add one in this mission (that mutates the god-context — out of scope, see conflict notes). Instead, gate purely on existing state: if `logsLoaded` is true and the logs array is the known-failed sentinel, show ErrorState. Since no such sentinel exists today, the **minimum safe change** here is: keep the Skeleton/empty logic, and add ErrorState only to the surfaces where a local error flag already exists (Overview, Care). For Behaviors, scope this mission to **adopting ErrorState behind the existing `logsLoaded` gate is deferred to p4-operational-hardening** (which owns ArborContext error wiring). Document this explicitly; ship the touch-target + primitive + Overview/Care adoption now.

**3. OverviewTab.tsx (Today)** — add an error branch to the Today-focus well.
- `useTodaysFocus` returns `{ focus, loading, regenerate }` (`:127`). Confirm whether it also returns an `error`. If it does, add an error branch in the focus well (`:208-220`) between loading and empty:
  ```tsx
  ) : focusError ? (
    <ErrorState
      headline={t("err.focus.title")}
      body={t("err.focus.body")}
      onRetry={() => void regenerate()}
      retryLabel={t("err.retry")}
      className="py-6"
    />
  ) : ...
  ```
- If `useTodaysFocus` does **not** expose an error today, do not modify the hook in this mission (it is not in scope/sharedFiles). Limit Overview to: confirm the Skeleton import path is unchanged, and leave a `// TODO(m5): wire ErrorState once useTodaysFocus surfaces error` marker. Primary adoption target for this mission is **CareTeam** (has a clean local error opportunity); Overview is best-effort.

> Net: the *guaranteed* deliverables are (A) the three touch-target bumps, (B) the `ErrorState` primitive, and (C) CareTeam adoption. Overview/Behaviors adoption is conditional on existing error state and otherwise deferred to `p4-operational-hardening` to avoid touching `ArborContext.tsx`.

#### D. Copy strings (i18n — `lib/i18n.ts`)
Append to **both** the EN block (after `:136`-area top.* group, anywhere in the EN map) and the HE block (mirror, RTL-safe). Append only — do not reorder existing keys (see conflict note on i18n).

EN:
```
"err.retry": "Try again",
"err.careTeam.title": "We couldn't load your care team",
"err.careTeam.body": "Something interrupted the connection. {name}'s data is safe — give it another try.",
"err.focus.title": "Today's focus didn't load",
"err.focus.body": "That was a connection hiccup, not your data. Try again in a moment.",
```
HE:
```
"err.retry": "נסו שוב",
"err.careTeam.title": "לא הצלחנו לטעון את צוות הטיפול",
"err.careTeam.body": "משהו הפריע לחיבור. הנתונים של {name} בטוחים — נסו שוב.",
"err.focus.title": "המיקוד של היום לא נטען",
"err.focus.body": "זו הייתה תקלת חיבור, לא הנתונים שלכם. נסו שוב עוד רגע.",
```

### Files to create / edit (exact repo-relative paths)
- **Create:** `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/ErrorState.tsx`
- **Edit:** `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/Shell.tsx` (3× `min-h-[38px]`→`min-h-[44px]` at :167,:175,:195; Settings button :185 `w-10 h-10`→`w-11 h-11`)
- **Edit:** `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/CareTeam.tsx` (add `error` state + ErrorState branch; import ErrorState)
- **Edit:** `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` (append 5 EN + 5 HE keys)
- **Conditional edit:** `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/OverviewTab.tsx` (ErrorState branch *only if* `useTodaysFocus` already exposes an error field; else TODO marker)
- **Out of scope this mission (deferred):** `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/BehaviorsTab.tsx` error adoption — leave to `p4-operational-hardening` which owns the context error flag.

### Shared-file conflict notes
- **`Shell.tsx`** (hotspot: p3-ios-grade-audit, b5, ia-b1, m1-ios-safe-area, m5, surf-app-shell). Per the hotspot ordering, **m1 (safe-area) + m5 (touch/error) land before surf-app-shell**; tabRegistry edits (b5, ia-b1) are serialized with the navigation.ts triad. My change is **confined to the header accessory row className strings (:167–:195)** — it touches neither `tabRegistry` (:61-97) nor the safe-area/chrome wrappers m1 owns (:125-135). To avoid clobbering m1: coordinate so m1 lands its `pb`/`env(safe-area)` edits on `<main>` first, then m5 patches the button classes — they edit non-overlapping lines. Do **not** reorder imports or the tabRegistry.
- **`OverviewTab.tsx`** (hotspot: b1-daily-home, c1-rhythm, ia-b1, m5). b1 builds the Today shell, c1 wires RhythmStrip. m5 only adds an error branch inside the existing focus well (:208-220) and imports `ErrorState` — append the import, do not touch RhythmStrip/DailyPlayCard sections. Land **after** b1's Today reorg so the focus well markup is stable; if b1 hasn't landed, defer the Overview branch (it's conditional anyway).
- **`i18n.ts`** (hotspot via LanguageContext family: mk-p0-8-copy-pack, mk-p2-1, mk-p2-7). **Append-only**, new `err.*` namespace — no collision with existing keys (`err.*` is unused; verified no `err.` prefix in the map). Merge by appending; never reorder.
- **`CareTeam.tsx`** — only m5 and b3-care-consult touch the Care area, but b3 targets `ConsultTab`/`HandoffTab`/`packet.ts`, not `CareTeam.tsx`. Low collision risk; still, land after b3 if b3 reorders the Care pillar.
- **No conflict** on the new `ErrorState.tsx` (greenfield file). `kit.tsx` is a hotspot (m2/m3/p3) but this mission does **not** edit kit.tsx — ErrorState is its own file to avoid the kit merge magnet.

### Dependencies (other item ids that must land first)
- **None hard-required.** The guaranteed deliverables (touch bump + ErrorState primitive + CareTeam adoption + i18n keys) have no upstream dependency.
- **Soft/ordering:** land **after `m1-ios-safe-area`** on Shell.tsx (non-overlapping lines, but sequence avoids a manual merge). The Overview adoption is soft-gated on **`b1-daily-home`** (Today reorg) and on `p4-operational-hardening` exposing context error flags for the Behaviors/Overview hook wiring.

### Acceptance criteria (testable)
1. `grep -rn "min-h-\[38px\]" app/src/components/layout/Shell.tsx` returns **zero** matches; the three buttons are `min-h-[44px]` and the Settings button is `w-11 h-11`.
2. In a 390px-wide (iPhone) viewport on the dev server, the Search button bounding box measures ≥44×44 CSS px (DevTools box model), and the header row does not wrap.
3. `components/ui/ErrorState.tsx` exists, exports `ErrorState` (named + default), uses **only** CSS-variable colors (no hex literals — `grep -n "#" ErrorState.tsx` returns nothing), and the retry control is keyboard-focusable with a visible focus ring.
4. With the network throttled to "Offline" and a forced failure of both `api.listShares` / `api.sharedWithMe`, **CareTeam renders the ErrorState** (headline "We couldn't load your care team", a "Try again" button) — **not** the empty "No one on the team yet" state. Clicking "Try again" re-runs `load()`; with network restored it shows the real team. **Verified live on dev server.**
5. `role="alert"` is present on the ErrorState root and is announced by VoiceOver/NVDA on mount.
6. Hebrew (`uiLang="he"`): ErrorState mirrors correctly under RTL; the 5 HE keys render (no raw `err.*` key strings visible). Verified live.
7. `prefers-reduced-motion: reduce` set in DevTools: the retry spinner does not animate (covered by the global rule). Verified live.
8. `npx tsc --noEmit` passes and the existing test suite stays green.

### Operating-rule checks
- **No dark patterns:** Error copy is honest and non-blaming, offers a real retry, never fakes success or hides a failure behind an empty state (this mission specifically *removes* the silent-empty anti-pattern in CareTeam).
- **Privacy / COPPA-2026:** No new data collected, logged, or transmitted; ErrorState renders no child PII (copy interpolates only the child's first name already on screen). No telemetry added here (analytics is mk-p0-4's job).
- **Moat read/write:** Neutral — this is a chrome/resilience mission. It *protects* the moat indirectly by ensuring a transient read failure on CareTeam no longer masquerades as "no relationships exist," which would otherwise erode trust in the longitudinal record.
- **Ships-visible:** Yes — bigger tappable header controls (felt on every mobile session) and a real, recoverable error surface where there was a silent dead-end.
