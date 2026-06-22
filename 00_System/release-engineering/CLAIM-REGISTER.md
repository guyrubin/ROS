# CLAIM-REGISTER — feature flags + claim-level gating

**Owner:** `ros-release-lead` + Clinical Board + `arbor-safety` · **Version:** 1.0 · **Created:** 2026-06-22

The mechanism that lets a **single feature or claim be gated independently** of the release that carries it. Before this, the only way to gate a clinical claim was to hold the *whole* change. Now: the code ships dark behind a flag; the claim is flipped ON only when its register row is green. The Arbor branding firewall (CHARTER §3 p10–11) becomes an enforced switch, not a prose hope.

## Two primitives

### 1. Feature flags (decouple ship from expose)
A flag is a named boolean resolved at runtime from config (env var or a flags table; default **OFF**). A feature behind a flag can merge, canary, and promote to 100% prod while staying invisible to users. Design (the code is `REL-ARBOR-001`):

- `app/src/lib/flags.ts` — `isEnabled(flag, ctx)`; reads `FLAGS` env (comma list) + optional per-user/cohort override; **fails closed**.
- Flag naming: `feat.<area>.<name>` (e.g. `feat.growth.physical-tracking`), `claim.<id>` for a flag that exists *only* to gate a claim string.
- A flag flip is **not a deploy** — it is a config change (env update / table write), itself Level-3 when it exposes a claim or child-data surface.

### 2. The claim register (this file's table)
Every developmental / medical / effect-size / clinician-identity claim that appears on any user-facing surface MUST have a row here before that surface can ship the claim. The [firewall lint](GREEN-GATE.md#the-firewall-lint-claim-safety-in-the-gate) fails the gate on any unregistered claim string.

**States:** `drafted` → `clinical-review` → `safety-review` → `signed` (both green) → `live` (flag ON). A row reverts to `held` on any objection.

## The register

| Claim ID | Surface / where | Claim string (verbatim) | Flag | riskClass | Clinical | Safety | State |
| :-- | :-- | :-- | :-- | :-- | :-: | :-: | :-- |
| CLM-001 | (template) milestone copy | "developmentally informed, grounded in CDC/AAP/ASHA guidance" | `claim.dev-informed` | gated-claim | ✅ board-approved framing | ✅ | **signed** (the approved firewall string) |
| CLM-FORBIDDEN | any | "clinically validated / reviewed / approved", "doctor-approved", any named clinician/Peterson identity | — | — | ❌ never | ❌ never | **forbidden** (gate fails) |
| CLM-002 | Development tab | physical-growth percentile readout (CLI-07 / DEM-003) | `feat.growth.physical-tracking` + `claim.growth-percentile` | gated-claim | pending | pending | **drafted** — ships dark in `REL-ARBOR-001`, flag OFF |
| CLM-003 | coach replies | "cited expert content" attributions (DEM-004) | `feat.coach.citations` | gated-claim | cleared-framing | pending | **clinical-review** |
| CLM-004 | i18n `honesty.grounded` (all dev surfaces) — CI-08 | "Developmentally informed — grounded in CDC, AAP & ASHA guidance." (EN); HE draft | `claim.dev-informed` (shares CLM-001) | gated-claim | **pending sign-off** — wording is *tighter* than CLM-001 verbatim ("…drawing on guidance from the CDC, AAP, and ASHA — not a screening or diagnostic tool"); board must approve this exact string + the HE draft | pending | **drafted** — shipped in `review/rel-arbor-001-council`, behind the claim-gate. HE flagged for native clinical review. |
| CLM-005 | `safety/escalation.ts` crisis copy — CI-05 | helpline literals 988 / 113 / 1813 / 112 / 101 / 911 / findahelpline.com + the fail-loud currency hook | (gated by category — crisis copy, not a flag) | gated-claim (crisis) | every number verified against a live national registry each pass | **arbor-safety + clinical-lead sign off every literal before its surface goes live** | **clinical-review** — currency *mechanism* substantiated 2026-06-21; numbers re-verify per pass |

> Seeded from the real Arbor gate artifacts: `mesh/CHARTER.md` §3 p10–11, `mesh/improvement/CLINICAL-SIGNOFF-2026-06-21.md`, and the Product Council `riskClass` field. The `CLINICAL-SIGNOFF-*.md` files are the **evidence** behind a row; this register is the **switchboard**.

## How it works in a train

1. A Council item carrying a claim enters a train with `riskClass: gated-claim` and a flag (default OFF).
2. It builds, gates, canaries, and **promotes to 100% dark** with the rest of the safe wave — the wave is never blocked by the claim.
3. In parallel, the claim's row runs `clinical-review → safety-review`. When both sign (the `CLINICAL-SIGNOFF` packet records the evidence), `ros-release-lead` (or the claim owner) flips the flag ON — a Level-3 config change, logged in the ledger.
4. If the claim never clears, the feature simply stays dark indefinitely. No re-deploy, no held wave.

## Rules

- **Default OFF, fail closed.** An unknown or unresolved flag resolves to OFF.
- **No claim without a row.** The gate's firewall lint enforces it.
- **A flag flip that exposes a claim or child-data surface is Level 3** — surfaced to Guy via the ledger, signed by Clinical + Safety.
- **Forbidden strings never get a flag.** CLM-FORBIDDEN is a hard fail, not a gateable item.
- **One claim, one row.** If the same claim appears on two surfaces, list both surfaces in one row — never two competing rows.
