# Decision — Guy approves ALL gated Council rows

**ID:** D-2026-06-22-2 · **Date:** 2026-06-22 · **Owner:** Guy (CEO) · **Status:** APPROVED (human gate cleared)

## The decision
Guy approved **all gated rows** in the Arbor Product Council backlog — the human sign-off the firewall requires. This clears the *gate*; it authorizes the items to be built and shipped.

## What approval does and does NOT do (so this isn't misread)
Approval clears the **human Level-3 gate**. It does **not** waive correctness — the firewall's substance still binds:
- **Clinical-claim items** ship only with their **board-substantiated** wording (evidence on file in `mesh/improvement/CLINICAL-SIGNOFF-2026-06-21.md`). An unsubstantiated claim stays reworded or held — approval can't make a false claim true.
- **Child-data items** ship only with **COPPA/GDPR-compliant** handling + consent.
- **Crisis copy** ships only with **live-verified** helpline numbers (per-pass re-verification).
- **Billing items** still need the **specific value** (a price), which approval does not supply — see "Needs a value" below.

## Reality correction (code-verified 2026-06-22)
The CLAIM-REGISTER described a flag system (`app/src/lib/flags.ts`, `isEnabled`, a `FLAGS` env) and several items "shipped dark behind a flag." **That flag system does not exist in `main`**, and CI-08's honesty strings (`honesty.signal`/`honesty.grounded`, `i18n.ts:30-31/975-976`) are **unused keys wired to nothing**. So the gated items are **not flippable switches** — they are genuinely **unbuilt product work**. Approval makes them *build-ready*; it doesn't make them *done*.

## Execution path (how the 23 actually reach prod, correctly)
1. All gated items are now **build-ready** (Guy-approved). They enter the canonical backlog's ready lane.
2. The **CIL build loop** (`arbor-cil-build`, Mon/Thu — runs on the `scheduled-tasks` runtime that *can* build) and the **Orchestrator** build them to green, with the substantiated copy / compliant handling per each item's `required_fixes`.
3. The **autonomous deploy pipeline** (CI green-gate → candidate → `arbor-auto-promote` hourly) ships each to prod as it goes green.
4. The **flag system (`lib/flags.ts`) itself is a prerequisite build** for any claim that should ship dark-then-flip — queue it first (REL gap).

## Still needs a VALUE from Guy (approval ≠ value)
- **AP-004** paywall price — needs the actual price points (e.g. Free / ₪49 Plus / ₪75 Family) confirmed before billing can charge. Approval authorizes; the number is still required.
- **AP-003 / child-data sharing** — approve the specific data surface + retention; "all" approval is taken as "build it to the compliant spec," not "skip consent design."

## Net
Human gate: **OPEN**. The safe + now-approved queue executes through the build loops + the autonomous pipeline I built today — it drains to prod on cadence, correctly, without bypassing substantiation or compliance. Billing waits only on a price.
