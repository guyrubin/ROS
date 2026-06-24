## p2-8-red-flag-monitoring — Red-flag monitoring layer + provider PDF
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** web:MyChild, web:Care · **Priority:** Phase2

### Problem / why
Arbor already ships a non-diagnostic, age-banded **Development Check** (`lib/screening.ts` + `components/sections/Screening.tsx`). It works as a *one-shot quiz*: the parent answers the band's items, gets an "on track / worth a conversation" read per domain, and the result is saved to the child's `screenings` collection (`Screening.tsx:28,44`). But it is **not a monitoring layer** and it does **not produce a provider artifact**:

1. **No surveillance over time.** Each check is an island. There is no trend ("language has been on the watch list for 3 checks running"), no re-check cadence (the "Remind me" button only fires a toast — `Screening.tsx:178`), and no surfacing of a persistent flag in My Child. ASQ-3-style developmental *surveillance* is exactly repeated, time-spaced screening with a rising signal when a domain stays flagged — that signal is what makes the difference between "a quiz" and a safety net.
2. **No provider PDF.** When a domain is flagged, the only "next step" is a toast that bounces the parent to the generic Reports grid (`Screening.tsx:170`, `setActiveTab("reports")`) — which has eight report types but **none built from screening data**. The clinical exporter (`lib/reportExport.ts`) has no `"screening"` `ReportType`, so the most clinically relevant moment (a flagged domain) produces no take-to-your-doctor document. The consult packet (`consult/packet.ts`) likewise has no screening section.

This item adds (a) a **monitoring layer** — persistent per-domain watch state with trend across checks, a re-check cadence, and an at-a-glance flag in My Child; and (b) a **provider PDF** — a screening-grounded clinical report that reuses the single clinical exporter so c3-ask-specialist, b3-care-consult, and this item all emit one coherent artifact. It is a **legal gate**: the output must never become diagnostic, must be consent-gated (p2-9), and must read/write the longitudinal moat.

### Scope across platform domains
- **Web (React app)** — the entire build. Two surfaces:
  - **web:MyChild** — `Screening.tsx` gains the monitoring layer (trend, cadence, persistent flag) and `screening.ts` gains the pure trend/cadence helpers + types. A compact "monitoring status" strip surfaces the current watch state and next-recheck date.
  - **web:Care** — the provider PDF: a new `"screening"` `ReportType` in `reportExport.ts` (shared clinical exporter), a screening section appended to `consult/packet.ts`, and a screening card added to the Reports grid (`sections/Reports.tsx`).
- **iOS (Capacitor) / Android (Capacitor)** — no native code. The same React views render in the WebView. One caveat: `openPrintableReport` uses `window.open(...).document.write` (`reportExport.ts:114-157`); inside a Capacitor WKWebView a blank `window.open` may not present a print dialog. Do **not** re-architect here — note in acceptance that the screening PDF path must be verified to either open the system share/print sheet or fall back to the existing markdown download (already mobile-safe via Blob in `AskSpecialist.tsx:53-61`). Mobile parity is owned by m1/m5; this item only must not regress it.
- **Landing EN / Landing HE (RTL)** — out of scope. Do not touch landing HTML.

### IA / UX / Copy detail (build-level)

#### A. Monitoring layer — data model (IA, in `lib/screening.ts`)
The `screenings` collection already stores `ScreeningResult & { id }` per check (`Screening.tsx:11,44`). Build the monitoring layer as **pure functions over that history** — no new persistence, no new Firestore wiring (the collection already persists/exports/erases via `useChildCollection`).

Add to `screening.ts` (append-only — pure, deterministic, unit-testable):

```ts
export type WatchTrend = "new" | "persisting" | "worsening" | "improving" | "resolved";

export interface DomainWatch {
  domain: ScreenDomainId;
  label: string;
  status: "on_track" | "watch";   // latest check
  trend: WatchTrend;              // vs prior checks
  checksOnWatch: number;          // consecutive recent checks this domain was "watch"
}

export interface MonitoringState {
  lastCheckedAt: string | null;
  nextRecheckDue: string | null;  // lastCheckedAt + recommendedIntervalDays
  recommendedIntervalDays: number; // 14 if any watch, else 90
  overdue: boolean;                // now > nextRecheckDue
  watches: DomainWatch[];          // every domain, with trend
  activeWatchCount: number;        // domains currently "watch"
  /** True when any domain has been on watch for >= 2 consecutive checks. */
  escalate: boolean;
}

/** Build monitoring state from the full (unordered) screening history. */
export function buildMonitoringState(history: ScreeningResult[], nowMs: number): MonitoringState;
```

Rules (encode in `buildMonitoringState`):
- Sort history by `answeredAt` ascending; take the latest as "current."
- `trend` per domain: `new` (first watch), `persisting` (watch in current + previous), `worsening` (concern weight rose vs previous), `improving` (concern fell but still watch), `resolved` (was watch, now on_track).
- `checksOnWatch` = count of trailing consecutive checks where that domain was `watch`.
- `recommendedIntervalDays` = `14` if `activeWatchCount > 0`, else `90` (surveillance cadence: flagged → re-check sooner).
- `escalate` = any domain with `checksOnWatch >= 2` OR `trend === "worsening"`. This drives stronger (but still non-diagnostic) copy and a "go now, don't wait for a re-check" nudge.
- **Never** emit a score, probability, percentile, or condition name anywhere in this state. `escalate` is a *cadence/urgency* signal, not a severity score.

#### B. Monitoring layer — UI (UI/UX, in `Screening.tsx`, web:MyChild)
The current `intro` phase already shows a single "Last checked" line (`Screening.tsx:69-77`). Replace it with a **Monitoring strip** (new local sub-component `MonitoringStrip` in the same file, or extract to `components/sections/screening/MonitoringStrip.tsx` if it grows past ~60 lines):

- **Default (has history, no active watch):** mint tone. "All areas on track as of {date}. Next gentle re-check around {nextRecheckDue}." One ghost button "Re-check now."
- **Default (active watch):** yellow tone. Lists each watched domain as a `Chip tone="yellow"` with a trend micro-label ("Language · 2nd check" / "Sleep · new"). Primary button "Prepare a provider summary" (→ section D), secondary "Re-check now."
- **Escalate state (`escalate === true`):** keep yellow (never red — no alarm/dark-pattern fear-mongering), but the headline copy shifts (see copy below) and the provider-summary button becomes primary + the "find a professional" door (`setActiveTab("find-pro")`) is shown inline rather than only post-result.
- **Overdue state (`overdue === true`):** add a quiet "It's been a while — a quick re-check keeps the picture current" line above the strip. No nagging, no badge spam.
- **Empty (no history):** keep the existing intro card; the strip does not render.
- **Loading:** `col.loaded === false` → render a skeleton strip (one rounded `bg: var(--arbor-paper-deep)` bar, `aria-busy="true"`), do not flash the empty state.
- **Error:** the collection hook has no error channel; if `col.items` is empty after `loaded`, treat as empty (no error UI needed).

A11y / motion (AA): the strip is a `<section aria-label="Development monitoring">`; trend chips are not interactive (plain text, not buttons); the two action buttons are real `<button>`s with focus-visible rings (reuse kit focus styles). Touch targets ≥ 44×44 (the existing result buttons use `px-5 py-3` — match). All Framer `motion` entrances must respect `prefers-reduced-motion`: gate the `initial/animate` y-offset behind a `useReducedMotion()` check (the file already imports from `motion/react` — add `useReducedMotion`). The strip itself must render correctly with motion disabled (no opacity-0 stuck state). RTL: this surface is EN-primary today; ensure no hard-coded `left/right` — use logical `flex` + `gap` (the existing code already does).

The re-check cadence also feeds the existing "Remind me to re-check" button (`Screening.tsx:178`), which currently only toasts. Upgrade its copy to state the concrete date from `nextRecheckDue` ("We'll nudge you around {date}"). Wiring an actual scheduled reminder is **out of scope** (no scheduler exists in-app); keep it honest — the toast states the cadence, it does not promise a push it can't send. (No dark pattern: do not imply a notification will fire if none will.)

#### C. Persistent flag in My Child (IA, web:MyChild)
So a flagged domain is not buried inside the screener, surface a single, quiet signal at the My Child hub level. **Do not add a nav leaf** (IA stays lean per the redesign — `screening` is already a `child` fallback leaf, `navigation.ts:110`). Instead, expose `buildMonitoringState(...).activeWatchCount` via context for the hub card to read. Minimal approach: the Screening view writes the latest `MonitoringState.activeWatchCount` is derivable on demand from the `screenings` collection the hub can already query through `useChildCollection(childId, "screenings")`. Add a small read-only `MonitoringBadge` (reused component) the My Child Development hub can drop in: "{n} area(s) being watched" linking to `screening`. Keep it to one line; no count if zero.

#### D. Provider PDF — reuse the ONE clinical exporter (UI/UX + IA, web:Care)
This is the shared-file-sensitive part. **Do not fork the exporter.** Extend the single clinical path:

1. **`lib/reportExport.ts`** — add `"screening"` to the `ReportType` union (line 21-23). Extend `ReportContext` with an optional `screening?: ScreeningResult` and `monitoring?: MonitoringState` (import the types from `screening.ts`). Add a `case "screening":` to `buildReport` that emits sections:
   - "Why this summary" — fixed non-diagnostic preamble.
   - "Areas being watched" — the watched domains + trend + `checksOnWatch` ("Language — flagged on the last 2 checks").
   - "Areas on track" — the on_track domains.
   - "When this was checked" — `bandLabel`, `answeredAt`, recheck cadence.
   - "What the parent is asking" — fixed prompt to the professional ("We'd value your view on whether further assessment is worthwhile.").
   - "Non-diagnostic note" — reuse the exact framing already in the file (`reportExport.ts:74,82`).
   The existing `openPrintableReport` renders it unchanged — no new renderer. This keeps c3/b3/p2-8 on **one** exporter (per the `reportExport.ts` hotspot: clinical PDF stays single; the mk-p0-3 branded-image renderer is built *beside* `buildReport`, never inside it — this item must not touch the image path).

2. **`consult/packet.ts`** — add an optional screening source so the Ask-a-Specialist warm handoff also carries the monitoring read. Extend `BuildPacketInput` with `screening?: { watchAreas: { label: string; checksOnWatch: number; trend: string }[]; lastCheckedLabel: string }` (a *projected* shape, not the raw type — keep packet.ts dependency-free of screening.ts to avoid a circular import; the caller projects it). In `buildConsultPacket`, after the development snapshot section (line 107), push a `screening` section when present: title "Development check", note "Non-diagnostic parent-awareness check.", items = each watch area as a `PacketItem`. Empty source → no section (matches existing convention, line 73/94/110). This is **append-only** — do not reorder existing sections (b5 appends moat copy last; b3+c3 land the consult flow first — see deps).

3. **`sections/Reports.tsx`** — add a ninth entry to the `REPORTS` array (line 9-18): `{ title: "Development Check Summary", desc: "Watched areas and trend — non-diagnostic, for a professional.", tone: "yellow", type: "screening" }`. The `exportReport` wiring (line 25-35) must pass the latest screening + monitoring state into `buildReport`'s context. Source them from the `screenings` collection (read via `useChildCollection(childProfile.id, "screenings")` in Reports, or lift the latest screening into `ArborContext` if cleaner — prefer the local hook read to keep ArborContext untouched, since that file is a serialized hotspot owned by other missions). If there is no screening history, disable the card with helper text "Run a Development Check first" (deep-link button to `setActiveTab("screening")`) — empty state, not a broken export.

4. **Direct route from the screener.** In `Screening.tsx`, change the flagged-result primary action (line 170) from the generic `setActiveTab("reports")` toast to: build the screening PDF directly (call `buildReport("screening", ...)` + `openPrintableReport`) so the parent gets the provider doc in one tap from the moment of concern — no scavenger hunt. Keep "Find a professional" (`find-pro`) as the secondary door.

#### E. Copy (actual strings — EN; HE deferred to mk localization)
This surface is EN-only today (no `t()` keys for screening result copy — strings are inline). Keep new strings inline to match, but write them at clinical-grade calm. Exact strings:
- Monitoring strip, on-track: **"All areas on track as of {date}."** / sub: **"Next gentle re-check around {nextDate}. Development changes fast — a fresh look keeps the picture current."**
- Monitoring strip, watching: **"{n} area being watched"** / **"{n} areas being watched"** (pluralize). Sub: **"This isn't a diagnosis — it's a reminder to keep an eye on these and check in with a professional if you'd like."**
- Trend micro-labels: **"new"**, **"on the last {k} checks"**, **"improving"**, **"now on track"**. Never "worsening" to the parent in those words — for the worsening case use **"worth a closer look"** (calm, non-clinical).
- Escalate headline: **"A few areas have stayed on the watch list"** / sub: **"That's a good reason to bring this to a professional — you don't need to wait for the next re-check."** (Urgency without alarm. No red, no fear language, no countdown.)
- Provider PDF preamble ("Why this summary"): **"A parent prepared this from Arbor's non-diagnostic development check to support a conversation with you. It reflects everyday observations over time, not an assessment."**
- Provider PDF ask: **"We'd value your view on whether further assessment would be worthwhile."**
- Reports card: title **"Development Check Summary"**, desc **"Watched areas and trend over time — non-diagnostic, for a professional."**
- Re-check reminder toast (upgrade): **"We'll show a re-check nudge around {date}."** (Honest: it's an in-app nudge, not a push.)

Voice rules (design:ux-copy): second person, present tense, no jargon, no "should," no implied severity, every concern paired with agency ("if you'd like," "you decide"). Apply `text-wrap: balance` to headlines (the codebase already does, `AskSpecialist.tsx:72`).

### Files to create / edit (exact repo-relative paths)
Edit:
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/screening.ts` — add `WatchTrend`, `DomainWatch`, `MonitoringState`, `buildMonitoringState(history, nowMs)`. Append-only; pure.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/Screening.tsx` — Monitoring strip (states above), reduced-motion guard, direct provider-PDF action, cadence-aware reminder copy.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/reportExport.ts` — add `"screening"` ReportType + `case`; extend `ReportContext` with optional `screening`/`monitoring`. No new renderer; reuse `openPrintableReport`.
- `PPPPtherapy-/PPPPtherapy-/app/src/consult/packet.ts` — optional projected `screening` input + append a `screening` section in `buildConsultPacket`. Append-only; no reorder; no import of `screening.ts`.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/Reports.tsx` — ninth REPORTS entry; pass latest screening+monitoring into `buildReport`; empty-state if no history.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/AskSpecialist.tsx` — project latest screening watch areas into `buildConsultPacket` input (consumes the new optional field; safe no-op when absent).

Create:
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/screening.test.ts` — unit tests for `buildMonitoringState` (new/persisting/worsening/improving/resolved, cadence 14 vs 90, escalate threshold, empty history).
- (optional, only if `MonitoringStrip` exceeds ~60 lines) `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/screening/MonitoringStrip.tsx`.

Extend existing test:
- `PPPPtherapy-/PPPPtherapy-/app/src/consult/packet.test.ts` — assert the screening section appears when input present and is omitted when absent.

### Shared-file conflict notes
- **`lib/reportExport.ts`** (hotspot: p2-hero-everywhere, c3-ask-specialist, p2-8, mk-p0-3-share-export, mk-p2-6-growth-card). Per the hotspot rule "clinical PDF (c3/b3/p2-8 share ONE exporter)": add ONLY the `"screening"` case and the optional context fields. Do **not** touch `openPrintableReport`'s HTML/CSS (p2-hero may add a hero header there) and do **not** add the branded-image renderer (mk-p0-3 builds that beside `buildReport`). Append the `"screening"` literal to the union without reordering existing types.
- **`consult/packet.ts`** (hotspot: b3-care-consult, b5-naming-moat-exposure, c3-ask-specialist, p2-8). Sequence per rule: b3+c3 land the consult flow first, then p2-8 extends the same packet, then b5 adds moat "tracking since" copy last. This item must **append** the screening section after the development snapshot and must not reorder sections or rename existing `PacketSection.id`s. Keep packet.ts free of a `screening.ts` import (project the shape at the call site) to avoid a circular dependency and to keep the b5 moat pass clean.
- **`components/sections/Screening.tsx`** (touched by b2-mychild-story-spine + p2-8). b2 owns the My Child story-spine reorg / how Screening is reached; p2-8 owns the internal monitoring + PDF logic. Coordinate: land b2's nav/spine placement first; p2-8 edits are confined to the component body (intro strip + result actions) and must not change the export default or the route name `screening`. If b2 has already moved the entry point, keep the `setActiveTab("screening")`/`find-pro`/`reports` route ids intact.
- **`lib/screening.ts`** — only p2-8 touches this; append-only is safe.
- **Avoid `context/ArborContext.tsx`** entirely (serialized hotspot owned by b5/ia-b1/mk-p0-4/p4). Read screening history via the existing `useChildCollection` hook in the consuming components instead of adding context fields.
- **`lib/navigation.ts`** — do **not** edit. `screening` already maps to `child` (line 110) and `reports`/`find-pro` to `care` (line 122-124). Reuse the existing route ids only.

### Dependencies (other item ids that must land first)
- **p2-9-coppa-consent** — legal gate. The provider PDF and consult-packet screening section share *child observations*; sharing/export must check `hasConsent(child, "share_trusted")` before the PDF/packet can be exported. Consume `hasConsent` from p2-9's `lib/consent.ts`; if not granted, the export buttons show a lock + deep-link to the Consent Center (do not silently block). p2-9 builds the gate; p2-8 reads it.
- **c3-ask-specialist** — establishes the warm-handoff consult flow and is the co-consumer of the single clinical exporter. Land c3 (and b3-care-consult, same flow) before extending `packet.ts`/`reportExport.ts` so this item appends to a settled shape rather than racing it.
- Soft: **b2-mychild-story-spine** — owns where Screening sits in My Child IA; coordinate entry point (not a hard blocker for the internal logic).

### Acceptance criteria (testable, including "verified live on dev server")
1. `buildMonitoringState` unit tests pass (`vitest`) covering: empty history → all-null state; single check → trends `new`/none, cadence 90 when on-track / 14 when any watch; two checks same domain watched → `persisting`, `checksOnWatch=2`, `escalate=true`; concern up between checks → `worsening`; concern down but still watch → `improving`; watch→on_track → `resolved`, count decremented.
2. `tsc --noEmit` clean and the existing test suite (241+ tests) stays green; `packet.test.ts` gains passing assertions for the screening section present/absent.
3. **Verified live on dev server** (`npm run dev` in `PPPPtherapy-/PPPPtherapy-/app`): run a Development Check with ≥1 "not yet" → result shows flagged domain; re-run a second time still flagged → Screening intro now shows a Monitoring strip reading "1 area being watched · on the last 2 checks" and an escalate headline; "Next gentle re-check" date is `lastChecked + 14 days`.
4. **Provider PDF verified live**: from a flagged result, the primary action opens the printable screening report in a new tab; the document contains "Areas being watched" with the trend line, the non-diagnostic preamble + footer, the band label and check date, and **no score, percentile, probability, or condition name** anywhere.
5. The Reports grid shows the "Development Check Summary" card; with no screening history it is disabled with "Run a Development Check first" deep-linking to the screener; with history it exports the same screening PDF.
6. Ask-a-Specialist packet, when screening history exists, includes a "Development check" section with the watch areas; with no history the section is absent (no empty section).
7. Export buttons (PDF + packet) are gated on `hasConsent(child, "share_trusted")`: without consent they show a lock + Consent Center deep-link; with consent they export. (Depends on p2-9.)
8. `prefers-reduced-motion: reduce` → no entrance translate/opacity animation on the Monitoring strip; content is fully visible. Keyboard: every action button is tab-reachable with a visible focus ring; trend chips are not in the tab order. Touch targets ≥ 44px.
9. Mobile (Capacitor) smoke: the screening PDF action does not silently fail in the WebView — it either presents print/share or the markdown download succeeds. No regression to existing report exports.

### Operating-rule checks
- **No dark patterns.** Escalate state uses calm yellow, never red/alarm; no countdowns, no fear copy, no fake-urgency badges. The re-check reminder copy promises only the in-app nudge it can actually deliver. Every concern is paired with parent agency ("if you'd like," "you decide what to share").
- **Privacy / COPPA (2026).** No new persistence beyond the already-exportable/erasable `screenings` collection. Export of child observations is hard-gated on `hasConsent(child, "share_trusted")` (p2-9). Nothing leaves the device until the parent explicitly exports (matches `AskSpecialist` Safety-L3 model). Output is **non-diagnostic by construction** — no score, label, probability, or condition name ever rendered or exported; this is the legal gate.
- **Moat read/write.** Writes: each check already persists to the longitudinal `screenings` record; the monitoring layer turns that history into trend (a moat-native capability competitors can't replay from a cold start). Reads: the provider PDF and consult packet pull from the same longitudinal record, and the packet's screening section sits alongside the "Context worth knowing" moat memory (`packet.ts:118-128`), reinforcing "Arbor has been tracking this over time."
- **Ships-visible.** The parent sees a new Monitoring strip in My Child, a one-tap provider PDF from a flagged result, and a new Reports card — all reachable through existing nav with no dead ends.
