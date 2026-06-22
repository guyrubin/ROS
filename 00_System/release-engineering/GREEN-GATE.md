# GREEN-GATE — the regression gate, as a release gate

**Owner:** `ros-release-lead` · **Version:** 1.0 · **Created:** 2026-06-22

The gate was real but only half-wired: Arbor's **CI** ran the full check, but the **deploy path skipped it** (lint+test only — OPS-B3), and the regression bar was set ad-hoc per session. This makes the gate a **release gate**: the same checks run on *every promotion*, the deploy cannot bypass them, and each product carries a named regression suite.

## The gate (must pass before stage 4 MERGE and re-pass on `main`)

| Check | Arbor command | Blocks on |
| :-- | :-- | :-- |
| **Types** | `npm run lint` (`tsc --noEmit`) | any type error |
| **Unit/integration tests** | `npm test` (`vitest run`) | any red test |
| **Framework integrity** | `npm run check:framework` | structural drift |
| **Safety eval** | `npm run eval:safety` | safety regression |
| **Build** | `npm run build` | broken build |
| **Regression suite** | the per-product suite below | any regression |
| **Coverage** | `npm run test:coverage` ≥ baseline | coverage drop |

> **Non-negotiable:** the deploy workflow runs the **same** list. No "deploy gates on lint+test only." Until the deploy path runs the full gate, every "green-gate every change" claim is false (this is OPS-B3, the first item of `REL-ARBOR-001`).

## Per-product regression suite (named, not ad-hoc)

A regression suite is a *named, versioned_ set of tests + checks that must stay green release-over-release. It grows by one rule: **every confirmed bug/incident adds a test before its fix ships.**

| Product | Suite | Lives in | Seed contents |
| :-- | :-- | :-- | :-- |
| **Arbor Product** | `regress:arbor` | `app/scripts/` + `vitest` tags | safety-eval corpus · entitlement gates · image-gen quota/cost cap · /vision consent gate · payload-size (1.5 MB ≠ 413) · authed render path · Firestore rules emulator test |
| **Arbor Marketing** | `regress:mktg` | landing build + link/i18n checks | EN+HE/RTL render · hreflang/canonical · no broken CTA · share-card OG tags · no clinical-claim string leak (firewall lint) |
| **ROS (OS)** | `regress:ros` | `CoS/projects/.../build-state.mjs` + doc-lint | `build-state.mjs` runs clean · no broken `[[links]]`/paths · routing keywords resolve · freshness derives from git · no dual-canonical-filename collision |

## The cadence (a release cycle, not "whenever")

| Train | Default cadence | Trigger |
| :-- | :-- | :-- |
| **Arbor Product** | weekly (the CIL build wave + Council-ready items) | Mon, or on a P0 fix |
| **Arbor Marketing** | 2×/wk (Tue+Fri, the marketing loop's safe materials) | the marketing loop |
| **ROS (OS)** | on-demand + after each ROS-CIL fix wave | ros-improve safe fixes |
| **Hotfix** | any time | a Sev-1: skips bundling, single item, full gate still runs |

> A train is a *bundle on a cadence*, not a per-item deploy. Bundling is what makes promotion a single reviewed event instead of 30 blind pushes.

## The firewall lint (claim safety in the gate)

A cheap static check in the gate (and in `regress:mktg`) that **fails** if any shippable surface contains a forbidden claim string — "clinically validated / clinically reviewed / clinically approved / doctor-approved", or any branded clinician/Peterson identity — unless that exact string is registered and signed off in the [claim register](CLAIM-REGISTER.md). This turns the firewall (CHARTER §3 p10–11) from a prose rule into a test that blocks a merge.

## What "green" buys you

The gate is the precondition for *every* stage 4→5 transition. Passing it means: types sound, tests + regression green, safety eval clean, build works, no unregistered claim string, branch current with `main`. Only then does the item earn a canary. The promote to 100% is still a **separate human gate** (CoS, Level 3) — green is necessary, not sufficient.
