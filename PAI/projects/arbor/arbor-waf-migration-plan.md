# Arbor — Well-Architected Migration Plan & Status

**Date:** 2026-06-17 · **Owner:** PAI / Arbor · **Type:** Engineering hardening (orthogonal to the product/feature backlog)
**Goal:** Take Arbor from Well-Architected maturity **2.8/5 → top-tier**, *gradually*, *cost-efficiently*, *without clobbering shared files*, ready to sell into **Netherlands + Israel** (the two launch markets) for a child-facing developmental AI product.

## Source artifacts (in the Arbor repo)
`PPPPtherapy-/PPPPtherapy-/docs/architecture/`
- `well-architected-assessment-2026-06-04.md` — scored assessment (overall 2.8/5).
- `enhancement-backlog-waf-2026-06-04.md` — 44 missions (OPS/SEC/REL/PERF/COST/AI/CMP).
- `migration-2026-06-17/00-execution-blueprint.md` — the master 5-wave plan + shared-file ownership table + critical path.
- `migration-2026-06-17/spec-A..G-*.md` — build-ready spec per WAF domain.
- `migration-2026-06-17/standards-two-market-NL-IL.md` — GDPR/AVG vs IL PPL Amendment-13 matrix.
- `migration-2026-06-17/shared-file-conflict-map.md` — shared-file → mission edit order.
- `migration-2026-06-17/wave-0/` — **Wave 0 executed** (artifacts + `WAVE-0-APPLY.md`).

## How it was produced
Two autonomous multi-agent workflows: (1) 17-agent — build-ready specs for all 44 missions, adversarially verified, synthesized into the conflict-aware blueprint; (2) 13-agent — executed Wave 0 (collision-free governance/runbook/IaC/observability artifacts).

## The structural constraint (why "gradual / no clobber" matters)
The whole migration serializes on **`app/src/routes/api.ts` (14 missions) + `createApp.ts` (12)** — the "API spine," the critical path. Everything else parallelizes in 5 disjoint-file tracks (T1 spine, T2 reliability-internals, T3 cost, T4 security-edge, T5 infra/docs) + 2 append-only batch owners (`env.ts`, deploy-args). **Concurrent sessions (codex/claude) also edit this tree** → migration code work must run on an isolated clean baseline.

## Wave plan
| Wave | Theme | Market gate | Status |
|---|---|---|---|
| **W0** | Paper & Infra (docs/DPIA/WIF/indexes/observability) — no app-code risk | B2G paper bar | ✅ **Executed** 2026-06-17 (apply gates pending) |
| **W1** | See & Cap (telemetry + cost ceilings + CSP + App Check + API-spine start) | App Check + audit foundation | ⏳ Blocked on clean baseline |
| **W2** | Harden (consent + rights + Hebrew/RTL safety classifier + stage-gated deploy) | 🚀 **Consumer launch (NL+IL)** | Pending |
| **W3** | Operate (enforce flips, retention TTL, AI eval gate) | Retention + AI-risk docs | Pending |
| **W4** | B2G Unlock (DPIA sign-off, CMEK-if-contract, Dutch UI, JGZ/Tipat-Chalav clinical) | 🏛️ **B2G launch** | Pending |

## Locked lean-cost defaults
No Redis (Firestore counters), no Sentry (GCP log metrics), CMEK deferred until a B2G contract pays for it; `min-instances=1` is the only deliberate recurring spend (lean alt = Cloud Scheduler warmup).

## Wave 0 — done (13 missions, drop-in, zero tracked files touched)
DPIA, RoPA/DPA, incident+breach runbook (GDPR-72h/AP + IL-PPA + Hebrew), OPS-6 change-gate, backup/DR, SLO/SLI, CMEK eval (=defer), WIF runbook+script, budget script, k6 load-test, model-fitness ADR, OPS-1 observability modules (`app/src/lib/observability/*`, 26/26 tests green, **not yet wired**). Master gate list: `wave-0/WAVE-0-APPLY.md`.

## Blocked on Guy (the irreducible human gates)
WIF provisioning · stage-project decision · min-instances spend · classifier sampling rate · CMEK (only if contract) · DPO threshold + DPIA sign-off · reCAPTCHA Enterprise key · deploy SA `roles/logging.logWriter` · Dutch UI + per-market clinical review · GitHub branch-protection + Code-security settings.

## Open decision (2026-06-17)
**Dedicated isolated Arbor repo for migration execution** — to run the W1+ code waves without colliding with the live session's dirty `feat/arbor-billing-mon2` tree. Aligns with the long-standing (2026-05-30) intent to consolidate Arbor into one clean repo (`PPPPtherapy-`→`Arbor`). Mechanism pending Guy's choice (fresh clone off `main` vs worktree vs full repo rename).
