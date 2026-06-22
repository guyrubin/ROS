## p4-operational-hardening — Operational hardening (generative guardrails)
**Aspects:** UI/UX, Copy · **Surfaces/platforms:** web:Today, web:Ask, web:MyChild, web:Grow, web:Care, web:Academy, app:shell, ios, android · **Priority:** Phase1

> Foundational gate (EB Phase-1 #4). This item makes EVERY generative feature operationally honest: real loading, graceful fallback, cost/quota guard, and analytics on every call — plus deep-linkable routes. It gates `p1-comic-reader`, `p2-hero-everywhere`, `p2-6-jitai`, and `mk-p2-6-growth-card`, which all assume these primitives exist. It ships the *plumbing + standard UI states*, not new features.

---

### Problem / why

Generative features today each invent their own state handling, and most do it badly. Grounded findings:

- **Error-as-content anti-pattern.** `ArborContext.tsx` pours server failures into the *content slot* as a Markdown blob via `renderApiConnectionError()` (`ArborContext.tsx:43-51`, used at `:287`, `:326`, `:612`). The user sees "### Connection Error" rendered as if it were a coach answer. No retry affordance, no toast, no distinction between "offline", "quota hit", and "model blocked".
- **Inconsistent loading.** Primitives exist (`ui/Spinner.tsx`, `ui/Skeleton.tsx` + `TabSkeleton`, `ui/EmptyState.tsx`, `ToastContext`) but consumption is ad-hoc: `AvatarCreator.tsx` uses local `generating`/`error` state with bespoke strings (`:44`, `:63-71`); inline scripts use `isGeneratingInlineScript` maps; some flows show nothing. There is no single contract a feature opts into.
- **No quota-aware UX.** The client already knows the plan + meter — `api.entitlement()` returns `limits.coachMessagesPerDay` and `usage.coachMessagesToday` (`lib/api.ts:184-195`) — but nothing reads it *before* a generative call to warn-near-limit or to show a calm cap state instead of a raw 429. The dev image key has `quota=0`, so avatar/comic/scene calls fail with an opaque error today.
- **No per-call analytics.** Server-side token telemetry exists (`ai/usage.ts` emits `ai.usage`), but there is **zero client-side instrumentation of generative outcomes**. `loopEvents.ts` covers the growth funnel, not "feature X was requested / succeeded / fell back / was blocked / hit quota / latency". We are blind to which generative surfaces work in the wild.
- **Deep-linking is partial.** Hash routing exists (`ArborContext.tsx:94-115`, `VALID_TABS`, `tabFromHash`, hashchange listener at `:406-414`) and every leaf in the `ActiveTab` union already maps to `#/<tab>`. But the **6-pillar IA hubs** (`development`, `practice`, `consult`, `daily-play`) are in the union without guaranteed deep-link parity for native, and there is no documented contract that every route is addressable. This item closes that gap and certifies it.

Net: before any of the gated features build on top, we need one shared way to *load, fail-soft, cap, and measure* a generative call, and a certified deep-link map.

---

### Scope across platform domains

- **Web (Today / Ask / My Child / Grow / Care / Academy):** primary. Introduce a `useGenerative()` hook + `GenerativeState` UI components and migrate the existing generative call sites to them. Wire quota-aware pre-checks and per-call analytics. Refactor `ArborContext` error-as-content blobs to real error state.
- **app:shell:** the deep-link certification + `aria-live` announcement region live in the shell so every pillar inherits them. No new chrome — only a single visually-hidden live region and a route-exists guard.
- **iOS (Capacitor) / Android (Capacitor):** deep links must resolve through the same hash router inside the WebView; offline/error copy must read correctly with no browser chrome. The cost/quota guard and fallback states are identical (shared web bundle). Verify the `aria-live` region is announced by VoiceOver/TalkBack. No native plugin code required.
- **Landing EN / Landing HE:** out of scope (no generative calls on marketing pages).

---

### IA / UX / Copy detail (build-level)

#### 1. New shared hook — `useGenerative<T>()`
Create `src/hooks/useGenerative.ts`. One opt-in contract every generative call site uses. It standardizes the **default → loading → empty → error/blocked/quota → success** lifecycle, retry with the existing `withModelRetry` semantics mirrored client-side (single user-initiated retry, not auto), and analytics.

Shape:
```ts
type GenStatus = "idle" | "loading" | "success" | "error" | "blocked" | "quota";
type UseGenerative<T, A extends any[]> = {
  status: GenStatus;
  data: T | null;
  error: string | null;       // human copy, already localized
  run: (...args: A) => Promise<T | null>;
  reset: () => void;
};
useGenerative<T, A>(feature: GenFeature, fn: (...a: A) => Promise<T>, opts?: {
  meter?: "coach" | "image" | null;   // which entitlement meter to pre-check
  onSuccess?: (d: T) => void;
}): UseGenerative<T, A>;
```
Behavior:
- On `run()`: read entitlement (cached, see #3). If `meter` is set and `usage >= limit` (and `enforced`), short-circuit to `status:"quota"` *without* a network call, emit `gen_quota_blocked`, return null.
- Emit `gen_requested` on start; on resolve emit `gen_succeeded` with `latency_ms`; on reject classify the error (see #4) into `error|blocked|quota` and emit `gen_failed` / `gen_blocked` / `gen_quota_blocked` with `reason`.
- Map raw error strings to localized human copy via i18n keys (see Copy). Never surface a stack/`requires an index` blob to the user — log technical detail to `console.debug` in DEV only.
- `reset()` returns to idle and clears data/error (for "try again" and for tab-switch teardown).

`GenFeature` is a string-union enum so analytics is sliceable per surface, e.g. `"coach.answer" | "behavior.analysis" | "milestone.scaffold" | "plan.generate" | "story.generate" | "hero.journey" | "hero.comic" | "avatar.create" | "scene.generate" | "adventure.generate" | "vision.observe" | "digest.weekly" | "handoff.brief" | "utterance.score"`.

#### 2. Standard UI state components — `src/components/ui/GenerativeState.tsx`
Three small presentational components consumed by `useGenerative` callers. Built on existing primitives — do **not** reinvent.

- **`<GenerativeLoading variant="inline" | "card" | "block" />`** — wraps `Spinner` (inline) or `Skeleton`/`TabSkeleton` (card/block). Inline variant shows a `Spinner className="w-4 h-4"` + calm progress label. Has `role="status" aria-live="polite"` and a visually-hidden text node so screen readers announce the wait.
- **`<GenerativeError reason status onRetry />`** — calm card (NOT a red error dump). Uses `EmptyState` layout with an `AlertTriangle` icon (`lucide-react`, already a dep). Renders the localized message and, when retryable (`status==="error"`), a single "Try again" button calling `onRetry`. When `status==="quota"` it renders an upgrade-aware variant (headline + neutral "You've used today's free {feature}" + a "See plans" link to the existing entitlement/billing flow — do not auto-open checkout).
- **`<GenerativeEmpty headline body action />`** — thin pass-through to `EmptyState` so a feature with no generated output yet renders a consistent invitation rather than a blank panel.

Visual/interaction spec:
- Loading: pulse uses the existing `.arbor-skeleton` (`index.css:384-388`); inline spinner uses `animate-spin`. Both already neutralized under `@media (prefers-reduced-motion: reduce)` (`index.css:401-407`) — verify, add nothing new.
- Touch targets: retry / "See plans" buttons min 44×44 px (use `min-h-[44px] px-4`).
- Color: use design tokens only — `var(--arbor-ink)`, `var(--arbor-muted)`, `var(--arbor-clay)` (focus ring), `var(--arbor-green-ink)` (icon). The error icon may reuse the toast clay `#e2562d` token already used in `ToastContext.tsx:16` — but prefer a CSS var; flag if a new `--arbor-warn` token is needed (coordinate with token-extraction missions, do not hardcode a new hex).
- a11y (AA): error card has `role="alert"`; loading has `role="status"`; retry button has a clear accessible name ("Try generating {feature} again"); keyboard reachable; focus ring inherited from `index.css:391-400`.
- RTL: components are flex/`gap` based, no left/right margins; verify with `dir="rgl"`-equivalent via `LanguageContext` he mode — icon + text order must mirror. All copy comes from i18n so HE strings flow automatically.

#### 3. Cost / quota guard — `src/hooks/useEntitlementGuard.ts` (+ context cache)
- Add a lightweight entitlement cache. Fetch `api.entitlement()` once per session (or reuse if `ProfileContext`/`ArborContext` already holds it — check before adding; if not present, add a memoized provider value, **append-only** to `ArborContext`). Expose `{ plan, limits, usage, enforced, nearLimit(meter), atLimit(meter) }`.
- `useGenerative` consumes this for the `meter` pre-check (#1). Image-meter features (`avatar.create`, `scene.generate`, `hero.comic`) check an `image` meter; since the dev key quota=0, these will correctly resolve to the calm `quota`/`blocked` state instead of an opaque failure.
- **No dark patterns:** the near-limit nudge is informational ("2 free answers left today"), shown inline and dismissible-by-ignoring; it never blocks input pre-emptively, never fakes urgency.

#### 4. Error classification — `src/lib/genErrors.ts`
Pure function `classifyGenError(err): { status: "error"|"blocked"|"quota"; key: string }`:
- `429` / `RESOURCE_EXHAUSTED` / `coachMessagesPerDay` exceeded → `quota`.
- finishReason / "blocked" / "safety" / "no image content" (`modelRouter.ts:46-51`, `:70-89`) → `blocked` (model declined / safety) with reassuring copy.
- `failed_precondition` / `requires an index` / index-building (`ArborContext.tsx:45`) → `error` but with the existing "database index still building, try again shortly" hint, surfaced as calm copy not a markdown blob.
- network / 5xx / timeout → `error` (retryable).
Reuse the regex intelligence already in `renderApiConnectionError` and `isTransientModelError` (`modelRetry.ts:1-7`) — lift, don't duplicate; then **delete** the markdown-blob path.

#### 5. Refactor existing error-as-content call sites
In `ArborContext.tsx`, replace the three `renderApiConnectionError(...)` content writes (`:287`, `:326`, `:612`) so failures set a real error state surfaced by `<GenerativeError>` at the consuming component, and fire a toast (`useToast`) for transient cases. Keep the function only as the classifier's copy source, or remove if fully superseded. This is the highest-risk edit — see conflict notes.

#### 6. Deep-link certification — `app:shell`
- Add a single visually-hidden live region in `Shell.tsx` (`<div className="sr-only" role="status" aria-live="polite" id="arbor-route-status" />`) that announces the active pillar/leaf on route change, for screen-reader users on tab change (web + iOS VoiceOver + Android TalkBack).
- Certify that **every** `ActiveTab` value (`ArborContext.tsx:53-91`) is in `VALID_TABS` (`:96-101`) and round-trips through `tabFromHash`. Add a test (extend `navigation.test.ts`) asserting `ActiveTab` union === `VALID_TABS` set (no drift). This is the contract the gated features rely on (`p1-comic-reader` deep-links `#/comics`, `p2-hero-everywhere` links to hero surfaces).
- No new routes are added here; this item only guarantees the existing map is complete + addressable inside the Capacitor WebView (hash routing works offline; no server rewrite needed).

#### Copy (actual strings — add to i18n; EN + HE)
Add keys under a `gen.*` namespace in `src/lib/i18n.ts` (append-only). EN strings:
- `gen.loading.default` = "Thinking…"
- `gen.loading.coach` = "Reading {name}'s context…"
- `gen.loading.image` = "Drawing this…"
- `gen.error.network` = "Couldn't reach Arbor just now. Check your connection and try again."
- `gen.error.indexBuilding` = "Arbor is still warming up your child's memory. Give it a moment, then try again."
- `gen.error.generic` = "Something went sideways generating this. Try again?"
- `gen.error.retry` = "Try again"
- `gen.blocked.title` = "Let's rephrase that"
- `gen.blocked.body` = "Arbor held back on this one. Try wording it differently."
- `gen.quota.title` = "That's today's free {feature}"
- `gen.quota.body` = "Your free plan refreshes tomorrow. Plus removes the daily cap."
- `gen.quota.cta` = "See plans"
- `gen.nearLimit` = "{n} free {feature} left today"
HE: provide warm natural Hebrew equivalents (RTL); reuse `aiLanguageInstruction()` voice register. Do not machine-translate placeholders — write parent-facing HE.

---

### Files to create / edit (exact repo-relative paths)

**Create:**
- `PPPPtherapy-/PPPPtherapy-/app/src/hooks/useGenerative.ts`
- `PPPPtherapy-/PPPPtherapy-/app/src/hooks/useEntitlementGuard.ts`
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/genErrors.ts`
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/genEvents.ts` (the `gen_*` analytics helpers, sibling to `loopEvents.ts` — separate file to avoid the loopEvents conflict magnet)
- `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/GenerativeState.tsx`
- `PPPPtherapy-/PPPPtherapy-/app/src/hooks/useGenerative.test.ts`
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/genErrors.test.ts`

**Edit:**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/analytics.ts` — no rename; only confirm `track()` accepts the new event names (it already takes arbitrary strings; likely a no-op, but listed because it's the underlying sink).
- `PPPPtherapy-/PPPPtherapy-/app/src/context/ArborContext.tsx` — remove error-as-content writes (`:287/:326/:612`); append entitlement cache to context value (only if not already present).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/api.ts` — no signature changes; (optionally) add a typed `image` meter field to `EntitlementInfo` ONLY if the server already returns it — verify first; otherwise leave untouched.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/Shell.tsx` — add the visually-hidden route-status live region.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append `gen.*` keys (EN + HE).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.test.ts` — add ActiveTab↔VALID_TABS parity test.
- Migrate **2 reference call sites** to prove the contract (not all, to bound blast radius): `src/components/profile/AvatarCreator.tsx` (image/quota path) and `src/components/coach/ArborVision.tsx` (text path). Remaining call sites migrate opportunistically inside their own missions.

**Explicitly NOT edited by this item** (server already done): `src/ai/usage.ts`, `src/ai/modelRetry.ts`, `src/routes/api.ts`. The work-item's `sharedFiles` lists `usage.ts`/`modelRetry.ts`/`modelRouter.ts` as *read references* — this client-side hardening mirrors their semantics; it does not modify the server telemetry. `loopEvents.ts` is read-only here (the new events live in `genEvents.ts`).

---

### Shared-file conflict notes

Cite the hotspot list:

- **`src/context/ArborContext.tsx`** (hotspot — touched by `b5`, `ia-b1-fold-missions`, `mk-p0-4-analytics-wiring`, `p4`). Per the hotspot note: *"do p4 + mk-p0-4 (handler/event wiring) BEFORE the IA edits."* So p4 lands first/early. Make only **append-only** additions (entitlement cache value, error-state removal); do **not** touch the `ActiveTab` union, `VALID_TABS`, or hash routing logic — those belong to the IA missions. Coordinate with `mk-p0-4` so we don't both edit the same handler block; p4 owns *error/quota state*, mk-p0-4 owns *loop event wiring*.
- **`src/lib/analytics.ts`** (hotspot — `p4`, `mk-p0-4`, `mk-p1-6`). Append-only / no-op. Do not rename `track`, do not reorder. New event names live in `genEvents.ts`, not here, to avoid the loopEvents naming-contract conflict.
- **`src/lib/loopEvents.ts`** (hotspot — note: *"mk-p0-4 wires the dead exports FIRST; all others import stable names after. Do not rename events once wired."*). p4 does **not** edit loopEvents at all — `gen_*` events are a separate namespace in a separate file. This removes p4 from the loopEvents merge contention entirely.
- **`src/lib/api.ts`** (hotspot — `p1-comic-reader`, `p4`, `c3-ask-specialist`). p4 makes at most a typed-field addition to `EntitlementInfo` and adds no new endpoints; `p1`/`c3` add new `api.*` methods. Edits are in different regions (type block vs `api` object) — append-only, low collision. Land p4's tiny type touch first if it happens at all.
- **`src/components/ui/playkit.tsx` / `kit.tsx`**: NOT touched. `GenerativeState.tsx` is a new file in `ui/` and composes existing `Spinner`/`Skeleton`/`EmptyState` — it does not modify the primitive libraries that `m2`/`m7`/`p1` contend over.
- **`src/components/layout/Shell.tsx`** (hotspot — `m1`, `m5`, `surf-app-shell`, etc.). p4 adds ONLY a single `sr-only` live-region div near the root return; no chrome/layout change. Land after `m1`(safe-area)/`m5`(touch/error) if they're in flight, or coordinate a one-line insertion that won't collide with their structural edits. Insert at a stable anchor (top of the shell content wrapper) and keep it self-contained.
- **`src/lib/i18n.ts`** (hotspot — `mk-p0-8`, `mk-p2-1`, `mk-p2-7`): append `gen.*` keys only; never reorder existing keys; reconcile collisions in favor of existing keys.

---

### Dependencies (other item ids that must land first)

None hard. p4 is a foundational gate and should land **before** its dependents (`p1-comic-reader`, `p2-hero-everywhere`, `p2-6-jitai`, `mk-p2-6-growth-card`). Soft sequencing: coordinate the `ArborContext.tsx` edit window with `mk-p0-4-analytics-wiring` (both pre-IA, per hotspot rule) — land p4's error/quota changes and mk-p0-4's loop wiring as two non-overlapping passes before any IA mission opens the file.

---

### Acceptance criteria (testable, including "verified live on dev server")

1. `useGenerative` exists, unit-tested: idle→loading→success path; idle→quota (no network call) when `atLimit`; error→retry resets to loading; blocked classification surfaces blocked copy. `useGenerative.test.ts` + `genErrors.test.ts` green.
2. No generative failure renders raw error markdown into a content slot. Grep proves the three `renderApiConnectionError` content writes (`:287/:326/:612`) are gone or rerouted to `<GenerativeError>`.
3. `AvatarCreator` and `ArborVision` are migrated and show: real loading (spinner/skeleton), calm error card with a working "Try again", and — with the dev image key (quota=0) — the calm `quota` state (NOT an opaque failure) for avatar generation.
4. Every generative call emits `gen_requested` and exactly one terminal event (`gen_succeeded` with `latency_ms` / `gen_failed` / `gen_blocked` / `gen_quota_blocked` with `reason` + `feature`). Verified in DEV via `[track]` console output (`analytics.ts:41-44`).
5. Deep-link parity test in `navigation.test.ts` passes: `ActiveTab` union === `VALID_TABS`. Manually loading `#/development`, `#/practice`, `#/consult`, `#/comics` directly resolves to the right view; browser back/forward works.
6. a11y: loading announces via `role="status"`; error via `role="alert"`; route changes announced via the shell live region. Retry and "See plans" are ≥44px, keyboard-operable, with visible focus ring. Verified with keyboard-only pass + axe (no new AA violations).
7. RTL: in HE mode the loading/error/quota cards mirror correctly and use HE i18n strings.
8. `prefers-reduced-motion: reduce` neutralizes spinner/skeleton motion (inherited from `index.css:401`) — verified with the OS setting on.
9. **Verified live on dev server:** `npm run dev` (or the project run skill), trigger a generative feature offline (DevTools offline) → calm network error with retry; restore → retry succeeds; exhaust/simulate quota → calm cap state. Confirmed inside the Capacitor iOS and Android WebView that deep links resolve and live-region announces (or documented as deferred-to-device-build if no Mac, per MOBILE.md).
10. `tsc` clean and existing test suite (241+ tests) still green.

---

### Operating-rule checks

- **No dark patterns:** quota/near-limit messaging is informational and honest ("2 free answers left today" / "refreshes tomorrow"); "See plans" links to the existing entitlement flow but never auto-opens checkout or fabricates urgency. Errors are calm, not guilt-inducing.
- **Privacy / COPPA-2026:** no new data collection. `gen_*` events carry only `feature`, `status`, `reason`, `latency_ms` — never prompt content, never child PII — and ride the same first-party `track()` sink (`analytics.ts`, own-collection, no third-party scripts). Image reference photos remain never-stored (unchanged from `api.generateAvatar` contract, `api.ts:126-129`).
- **Moat read/write:** this item is infrastructure; it does not itself write longitudinal memory, but it *protects* every feature that does by ensuring failed/blocked generations fail soft instead of corrupting the timeline, and it makes generative reliability measurable so the moat-writing features (coach, vision, digest) are observably healthy.
- **Ships-visible:** users see consistent calm loading, honest error/retry, and graceful caps across all six pillars on web + iOS + Android — a tangible craft upgrade, not invisible plumbing.
