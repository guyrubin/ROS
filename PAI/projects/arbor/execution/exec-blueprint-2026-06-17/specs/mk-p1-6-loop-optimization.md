## mk-p1-6-loop-optimization — Daily loop optimization (K + activation report)
**Aspects:** Marketing · **Surfaces/platforms:** app:shell · **Priority:** P1

### Problem / why
The growth loop is only useful if it is *measured and tuned*. By the time this item runs, the loop is wired: `mk-p0-4-analytics-wiring` froze the canonical event contract (`install`, `app_open`, `profile_created`, `first_plan`, `share_initiated`, `share_completed`, `invite_sent`, `invite_activated`, `trial_start`, `paid` — `src/lib/loopEvents.ts:12-23`), `mk-p0-2-referral-loop` emits `invite_sent`/`invite_activated` server-side with real Plus-month grants, and `mk-p0-3-share-export` emits `share_initiated`/`share_completed` for the four artifacts. `mk-p0-5-attribution-utm` already shipped one read surface: `AttributionTab.tsx`, a per-operator **funnel-by-channel** table (install → first_plan → paid sliced by `source`/`market`).

What is still missing — and what the GTM plan explicitly gates P2 paid spend on:

1. **K-factor is not computed anywhere.** The GTM doc (`marketing/arbor-viral-gtm-2026-H2.md:54`) defines the loop math we manage: **K = (invites sent per active user) × (conversion per invite)**, early target **K ≥ 0.4**, optimize toward **~1.0** (`:125`). `AttributionTab` shows funnel *counts by channel* but never derives K, never relates `invite_sent` → `invite_activated`, and cannot answer "is the loop self-sustaining yet."
2. **The kill/double rule has no instrument.** GTM `:130` says retention gates spend (H1: <20% of families at 3 missions/wk by day 30 → kill the habit mechanic) and channels under floor for 30 days get cut. There is no daily view of activation rate, time-to-activation, or share/invite rates to drive that decision.
3. **There is no exportable "activation report"** to hand to Guy/marketing as the **go/no-go artifact for turning on the €3,000 paid amplification** (GTM `:96`). The proof that the loop works must leave the app as a shareable summary, not live only in a dev console.

**Architectural crux (the load-bearing decision):** `lib/analytics.ts:37` writes every event to the **signed-in user's own** `users/{uid}/events` collection — first-party, no cross-user collection. A *single operator's* event stream (what `AttributionTab` reads) **cannot compute base-wide K**: invites are sent by user A and activations happen in user B's stream. True K requires aggregation across all users. This spec resolves that with a **server-side daily rollup** (`server/loopMetrics.ts`) that reads the referral grant ledger (`referralGrants`/`referralCodes` from mk-p0-2, which *are* cross-user, server-owned collections) plus an opt-in aggregate event counter, and exposes a read-only `/api/loop/metrics` endpoint that the new dashboard renders. This is the honest way to get K without building a cross-user analytics warehouse.

### Scope across platform domains
- **Web app (app:shell) — primary and only surface.** A new internal/admin-gated **Loop tab** (`LoopMetricsTab.tsx`) sitting beside the existing `AttributionTab` (built by mk-p0-5), plus a server-side daily-rollup module + endpoint that computes K, activation rate, time-to-activation, and the share/invite funnel. A one-tap **"Export activation report"** action produces a self-contained Markdown/HTML snapshot (the go/no-go artifact).
- **iOS (Capacitor) / Android (Capacitor):** inherit the same JS bundle with **no native-specific work** — the tab renders inside the existing shell. Native is out of scope beyond "renders correctly in the Capacitor webview" (it does; it is the same shell as `AttributionTab`). The report export uses `navigator.share`/download with the existing capability checks (no `@capacitor/share` dependency needed for a text/markdown blob).
- **Landing EN / Landing HE (RTL):** out of scope. This is an internal operator dashboard, never parent-facing, never localized for parents (operator UI is EN-only, consistent with `AttributionTab`).

### IA / UX / Copy / Marketing detail (Marketing — instrumentation + read surface)

#### A. K-factor and the metrics computed (the marketing instrument)
The rollup computes, over a configurable window (default last 7 / 30 days, plus all-time), sliceable by `market` and `utm_campaign`:

| Metric | Definition (from the frozen event/grant data) | GTM target |
| :-- | :-- | :-- |
| **K-factor** | `invites_per_active_user × conversion_per_invite`, where `invites_per_active_user = invite_sent / activated_users` and `conversion_per_invite = invite_activated / invite_sent`. Simplifies to **`invite_activated / activated_users`** — the cleanest base-wide K, computed entirely from the server-owned referral ledger. | ≥0.4 → ~1.0 |
| **Activation rate** | `first_plan / profile_created` (the family reached its first generated plan = first write into the moat). | hypothesis-gated |
| **Time-to-activation** | median ms/hours between `profile_created` and `first_plan` (from `first_plan.latency_ms` where present, else timestamp delta). | lower is better |
| **Share rate** | `share_completed / activated_users`, broken out by `artifact` (avatar/story/answer_card/growth_card). | identifies the best viral asset |
| **Invite→activation conversion** | `invite_activated / invite_sent`. | the loop's efficiency |
| **Paid conversion** | `paid / activated_users` (beta/comp excluded per mk-p0-4's guard). | LTV input |

**Data sources (no cross-user analytics warehouse):**
- **K, invites, invite-activations:** read from mk-p0-2's **server-owned** `referralGrants` collection (`{uid, count, activatedBy[]}`) and `referralCodes` — these are inherently cross-user and server-trusted. `invite_activated` count = sum of `activatedBy[]` lengths; `invite_sent` count = a server-incremented counter written when `trackInviteSent` fires (add a fire-and-forget `POST /api/loop/invite-sent` beacon from the existing `InviteCard` action — **append-only, does not rename or move the existing `trackInviteSent` client event**).
- **Activation rate, time-to-activation, share rate, paid conversion:** these need base-wide event counts. Add a **server-side aggregate counter** `loopCounters` (a single doc per `{market, day, event}` incremented via `FieldValue.increment(1)` from a thin `POST /api/loop/beacon { event, market }` that the client calls *in parallel with* the existing `track()` for the six loop-funnel events only). This is a **counter, not PII** — it stores `{ market, day, event, count }`, never a uid, never child data. The per-user `users/{uid}/events` stream (privacy-first) stays the source of truth for the operator's own debugging; the counters are the only thing that can be safely aggregated base-wide.

> Design note: we deliberately do **not** read other users' `users/{uid}/events` (forbidden by the privacy model + Firestore rules). The counter doc is the minimal aggregate footprint that makes K computable. If `loopCounters` is unavailable (local/sandbox), the tab falls back to the operator's own event stream and labels the numbers **"local sample (not base-wide)"** so no one mistakes a dev number for real K.

#### B. UI — `LoopMetricsTab.tsx` (internal, gated, parent-register calm)
Reuse `components/ui/kit.tsx` primitives (Card, table styles) exactly as `AttributionTab` does — same visual register, same admin gate, same tab neighborhood.

- **Layout:** a top **KPI strip** (4 stat cards: K-factor, Activation rate, Median time-to-activation, Paid conversion), each showing the value, the GTM target, and a status pill (green ≥ target / amber within 25% / red below). Below: a **window/market/campaign filter row** (`<select>`s reusing the AttributionTab filter pattern). Below that: the **loop funnel table** (`install → profile_created → first_plan → share_completed → invite_sent → invite_activated → paid`) with counts + step conversion %. A final **"By artifact"** mini-table for share rate per artifact.
- **States:**
  - **default:** KPI strip + tables populated from `/api/loop/metrics`.
  - **loading:** skeleton stat cards + skeleton table rows (reuse AttributionTab skeleton); `aria-busy="true"`.
  - **empty:** no qualifying events in window → "No loop activity in this window yet. Share a tagged link or send an invite to start measuring." + the canonical UTM example string from mk-p0-5. K shows "—" not "0.0" (avoid implying a measured zero).
  - **error:** `/api/loop/metrics` fails → "Couldn't load loop metrics" + retry button; never blanks the shell.
  - **local-sample:** when computed from the operator's own stream (no `loopCounters`), a persistent amber banner "Local sample — not base-wide K" so a dev number is never mistaken for the go/no-go figure.
- **K-factor gauge motion:** the K stat card may animate a count-up / gauge fill on load. **Gate the entire animation behind `prefers-reduced-motion`** (no count-up, render final value) reusing the existing index.css reduced-motion guard. No looping/pulsing animation.
- **Touch targets:** all filter `<select>`s and the Export button ≥44×44px (match `AttributionTab` controls and Apple HIG).
- **a11y (AA):** the funnel is a real `<table>` with `<th scope="col">`/`<th scope="row">`; KPI status pills carry text (not color-only) so red/amber/green is not the sole signal (WCAG 1.4.1); contrast via existing `kit.tsx` tokens (≥4.5:1); filters keyboard-navigable; the Export result announced via `aria-live="polite"`. Full keyboard path: Tab through filters → Tab to Export → Enter.
- **RTL:** operator UI is EN-only (same as AttributionTab) so RTL is N/A for layout; numbers render LTR. (No HE strings added — consistent with the internal-dashboard decision.)
- **Gating:** render only for the allowlisted operator uid — **reuse the exact admin/allowlist check `AttributionTab` already uses** (mk-p0-5). Do **not** invent a new auth path and do **not** add it to the parent-facing nav.

#### C. Copy (operator-facing English only — these are admin labels, not parent UX copy)
KPI cards: `"K-factor"`, `"Activation rate"`, `"Time to first plan"`, `"Paid conversion"`. Targets shown inline: `"target ≥ 0.4 (→ 1.0)"`, etc. Status pills: `"On track"` / `"Watch"` / `"Below floor"`. Empty: `"No loop activity in this window yet. Share a tagged link or send an invite to start measuring."` Export button: `"Export activation report"`. Local-sample banner: `"Local sample — not base-wide K."` (No i18n keys — operator UI is not localized; do not touch `i18n.ts`.)

#### D. The activation report (the go/no-go artifact that gates P2 paid spend)
`"Export activation report"` builds a **self-contained Markdown** (and a print-friendly HTML view) snapshot for the selected window:
- Header: window, market filter, generated-at, app version.
- The KPI strip values vs GTM targets with the go/no-go verdict line: **`PAID SPEND: GREEN — K ≥ 0.4 and activation ≥ floor`** / `AMBER` / `RED — do not amplify (leaky funnel)` — directly encoding GTM `:130`'s kill/double rule.
- The full funnel table + by-artifact share table as Markdown tables.
- A one-paragraph plain-English read ("K is 0.31 — below the 0.4 floor; invite→activation conversion is the bottleneck at 12%. Do not turn on paid until invite payoff or share rate improves.").
Export uses `navigator.share({ text })` when available (mobile/native), else triggers a `.md` download (Blob + `<a download>`), mirroring the share-or-download fallback pattern established in `lib/share.ts` (mk-p0-3). This is the artifact Guy reads to flip the paid switch.

#### E. Optimization, not just measurement (the "optimization" in the title)
This tab is the daily instrument that drives the loop tuning loop. It surfaces the **bottleneck call-out** automatically: the step with the lowest conversion is highlighted and named in the report's plain-English read, so the daily action ("fix invite payoff" vs "fix share asset" vs "fix activation") is explicit. No A/B framework is built here (paywall A/B is `mk-p2-7`); this item delivers the *decision instrument*, and the report's verdict line is the contract the rest of P2 keys off.

### Files to create / edit (exact repo-relative paths)
**Create:**
- `PPPPtherapy-/PPPPtherapy-/app/src/server/loopMetrics.ts` — `LoopMetricsStore` interface + `LocalLoopMetricsStore` / `FirestoreLoopMetricsStore`. Reads `referralGrants`/`referralCodes` (mk-p0-2, injected — do not re-declare those collections) + the new `loopCounters` aggregate doc; exposes `computeMetrics({ window, market?, campaign? }): LoopMetrics` (pure K/rate math) and `incrementCounter({ event, market })`. Keep the K/rate arithmetic in a **pure exported function** `deriveLoopMetrics(counts, grants)` so it is unit-testable without Firestore.
- `PPPPtherapy-/PPPPtherapy-/app/src/server/loopMetrics.test.ts` — unit tests for `deriveLoopMetrics`: K = invite_activated/activated_users; activation rate; time-to-activation median; verdict thresholds (green/amber/red) at boundary values; division-by-zero → "—" not 0; beta/comp excluded from `paid` (consistent with mk-p0-4).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/LoopMetricsTab.tsx` — the dashboard view (KPI strip + filters + funnel table + by-artifact table + Export), states above, gated by the existing admin check.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/activationReport.ts` — pure builders `buildActivationReportMarkdown(metrics): string` + `buildVerdict(metrics): "green"|"amber"|"red"` (testable without DOM); the tab calls these then shares/downloads.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/activationReport.test.ts` — verdict thresholds + markdown table shape.

**Edit:**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/loopEvents.ts` — **append-only**: add a thin `loopBeacon(event, market)` fire-and-forget helper (or fold into each existing tracker as a second, optional call) that POSTs to `/api/loop/beacon` *in addition to* the existing `track()` — do **not** rename, reorder, or change any `LoopEvent` value or existing tracker signature. Add a one-line comment marking this as the aggregate-counter sibling of `track()`. (If the conflict plan prefers zero edits here, the beacon can live entirely in a new `lib/loopBeacon.ts` and be called from the same call-sites mk-p0-2/mk-p0-3 already touch — prefer the new-file route to keep `loopEvents.ts` untouched; see conflict notes.)
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/analytics.ts` — **no edit expected.** The beacon is a separate, additive path; do not change `track()`. (Listed in sharedFiles only because the metrics layer sits on top of it.)
- `PPPPtherapy-/PPPPtherapy-/app/src/routes/api.ts` — append (near the existing `/api/referral/*` and `/billing/*` blocks) three routes: `GET /api/loop/metrics` (authed + admin-gated → `LoopMetrics`), `POST /api/loop/beacon { event, market }` (authed, fire-and-forget increment), `POST /api/loop/invite-sent` (authed, increments the invite counter). Inject `loopMetricsStore` via `ApiDeps` adjacent to `referralStore`.
- `PPPPtherapy-/PPPPtherapy-/app/src/server/createApp.ts` — construct `loopMetricsStore` (local vs firestore by `config.memoryAdapter`, mirroring `entitlementStore`/`referralStore`), pass the `referralStore` into it so it can read the grant ledger, and pass it into `createApiRouter`.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/api.ts` — add client helpers `loopMetrics(params) => get(...)`, `loopBeacon(event, market) => post(...)` (fire-and-forget, swallow errors), and their result types.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.ts` — register the Loop tab leaf **adjacent to where mk-p0-5 registered the Attribution tab** (same internal/settings-adjacent section); append only, no reorder.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/Shell.tsx` — register the tab in `tabRegistry` (append only, beside the Attribution tab entry).

### Shared-file conflict notes
- **`src/lib/loopEvents.ts`** (hotspot: p4, mk-p0-2, mk-p0-3, mk-p0-4, **mk-p1-6**, mk-p2-6 — *"mk-p0-4 wires the dead exports FIRST; all others import the stable names after. Do not rename events once wired."*): mk-p1-6 is a **late writer**. It must **import the already-frozen names and never rename/reorder them**. The aggregate beacon is **additive**; strongly prefer putting it in a **new `lib/loopBeacon.ts`** so `loopEvents.ts` is not edited at all, eliminating the conflict. If it must touch `loopEvents.ts`, append a single helper at the bottom only.
- **`src/lib/analytics.ts`** (hotspot: p4, mk-p0-4, mk-p1-6): **do not edit** `track()`. p4 owns retry/telemetry here; mk-p0-4 owns the wiring. The beacon path is separate and additive — keep this file untouched to avoid colliding with p4's operational-hardening changes.
- **`src/routes/api.ts`** (touched by p1-comic-reader, p4, c3, mk-p0-2): append the three `/api/loop/*` routes at the **end** of the router (immediately after mk-p0-2's `/api/referral/*` block) and add the `loopMetricsStore` field to `ApiDeps` adjacent to mk-p0-2's `referralStore` — coordinate ordering so mk-p0-2 lands first (it owns the referral collections this reads).
- **`src/server/createApp.ts`** (touched by mk-p0-2): construct `loopMetricsStore` directly after `referralStore` in the same DI block; pass `referralStore` in. Land after mk-p0-2 so the grant ledger exists.
- **`src/lib/navigation.ts`** + **`src/components/layout/Shell.tsx`** (top IA hotspots — *"Serialize all IA edits … surf-app-shell consumes the settled result"*): this item only **appends one internal leaf + one tabRegistry entry**, mirroring mk-p0-5's append. Land **after** the IA reorg triad (b1/b2/b3 → ia-b1/ia-b6 → b5) and after mk-p0-5, then append beside its Attribution tab — never reorder existing entries. Smallest possible diff.
- **`src/lib/api.ts`** (touched by p1-comic-reader, p4, c3): append the loop client helpers at the end alongside mk-p0-2's `referralCode`/`referralActivate`; no edits to existing helpers.

### Dependencies (other item ids that must land first)
- **`mk-p0-4-analytics-wiring`** (hard) — freezes the event-name contract and wires share/pay events; without it there are no `share_*`/`paid` events to roll up.
- **`mk-p0-2-referral-loop`** (hard) — owns the server-side `referralGrants`/`referralCodes` ledger this reads for K, the `invite_activated` emitter, and the `InviteCard` action where the invite-sent beacon attaches.
- **`mk-p0-3-share-export`** (hard) — emits `share_initiated`/`share_completed` for the four artifacts; without it the share-rate row and best-artifact call-out are empty.
- **Soft / coordinate-with:** `mk-p0-5-attribution-utm` (recommended-before) — established the admin gate, the dashboard tab pattern, and `AttributionTab.tsx`; mk-p1-6's Loop tab sits beside it and reuses that gate. If mk-p0-5 slips, mk-p1-6 must self-supply the admin-gate check (do not invent a new auth path — copy the entitlement/allowlist pattern).

### Acceptance criteria (testable, including "verified live on dev server")
1. `npx tsc --noEmit` passes; existing suite (241+ tests) stays green; new `loopMetrics.test.ts` + `activationReport.test.ts` pass. `deriveLoopMetrics` returns K = `invite_activated/activated_users`, "—" (not 0) on zero denominators, and the correct green/amber/red verdict at boundary inputs (K=0.40 → green, 0.39 → amber/red per thresholds).
2. `GET /api/loop/metrics` (authed + admin) returns K-factor, activation rate, median time-to-activation, paid conversion, the full loop funnel counts, and per-artifact share counts, filterable by window/market/campaign. A non-admin uid gets 403/empty (gate enforced, same as `AttributionTab`).
3. K is computed from the **server-owned referral ledger + aggregate counters**, not from another user's `users/{uid}/events` — verified by a test that seeds `referralGrants` for users A/B and asserts base-wide K, and by confirming no route reads a *different* uid's events collection.
4. The aggregate beacon writes only `{ market, day, event, count }` to `loopCounters` — **no uid, no child data** — verified by inspecting the written doc shape in a unit/integration test.
5. **Verified live on dev server** (`npm run dev`, web, signed in as the allowlisted operator): the Loop tab renders the KPI strip with values + targets + status pills, the funnel table, and the by-artifact table; loading shows skeletons; with no qualifying events the empty state shows and K renders "—"; filters re-query and update the numbers.
6. **Export activation report** produces a Markdown snapshot containing the KPI values vs targets, the funnel + by-artifact tables, the bottleneck call-out, and a single explicit verdict line (`PAID SPEND: GREEN/AMBER/RED`); on a desktop browser it downloads a `.md`, where `navigator.share` exists it opens the share sheet.
7. In local/sandbox (no `loopCounters`), the tab falls back to the operator's own stream and shows the persistent **"Local sample — not base-wide K"** banner.
8. a11y: funnel is a real `<table>` with scoped headers; status pills convey state via text (not color alone); all controls keyboard-reachable; under `prefers-reduced-motion` the K gauge renders its final value with no count-up.

### Operating-rule checks
- **No dark patterns:** this is an internal operator instrument — no parent-facing UI, no nags, no growth prompts added. It exists to enforce an honest spend gate (do not pour paid into a leaky funnel), the opposite of a manipulative pattern. The go/no-go verdict is stated plainly.
- **Privacy / COPPA-2026:** the aggregate `loopCounters` doc stores **only** `{ market, day, event, count }` — never a uid, never a name, never child content. K is derived from the **parent-account** referral ledger (account-level, no child data). The tab never reads another user's `users/{uid}/events` (forbidden by the privacy model); the per-user stream stays first-party. The exported report contains aggregate counts only — no PII can leak into it (assert in the report builder test).
- **Moat read/write:** the loop metrics are the *measurement layer over* the moat — `first_plan` (the family's first write into longitudinal memory) is the activation signal, and the dashboard makes activation/retention attributable so the closed-loop growth the moat depends on is steerable. The beacon writes only aggregate counters; no moat data is duplicated or exposed.
- **Ships-visible:** the Loop tab is a real, reachable surface in the app shell (beside the Attribution tab), the `/api/loop/metrics` endpoint is live, and the activation report is an actual file that leaves the app — operational end-to-end, integrated into the existing admin shell, not bolted-on. It is the artifact that flips the P2 paid switch.
