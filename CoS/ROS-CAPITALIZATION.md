# ROS — Capitalization & Autonomy Plan

**Version:** 1.0
**Created:** 2026-06-21
**Reviewed:** 2026-06-21
**Owner:** ROS CoS · **Steers:** the [PRD](ROS-PRD.md) + [Backlog](ROS-BACKLOG.md)

How ROS becomes a **best-in-class, fully-tooled, autonomous small business** for Guy + Joseph — rolled out **gradually** (Guy: "do it gradually well"), capitalizing every subscription, on a **dedicated always-on machine**. Build-on-not-clutter: every line extends an existing asset.

Domain north-stars (Guy, 2026-06-21): **KK = the ultimate personal assistant / second brain · HV = the ultimate AI real-estate development in the EU · PAI = a product-AI company (Arbor + ventures).**

---

## 1. Tool capitalization map — LEAN: the right *cheap* tool per job (revised 2026-06-22)

Live now (MCP, free): Gmail ×3 · Calendar · Notion · Drive · Web/Research · **Slack ✅**. **Stance (sourced cost/fit research — see [`connectors.md`](../00_System/connectors.md) → Tool capitalization):** run the **free tier** that does the job now; buy the paid upgrade only when a named **trigger** fires (a Level-4 cost decision, surfaced in the cockpit). The all-incumbent stack (~**$625–775/mo**) would eat ~18% of the €10k budget on tooling not yet needed; the lean stack is ~**€0/mo** (first justified spend ≈ €36/mo: Canva Pro + HeyGen Creator). The speculative OAuths (Ahrefs ⏳ / Amplitude ⚠️ / Linear ⚠️) are **dropped** — wire each only on its trigger.

| Team | North-star | Lean stack (pick-now free · upgrade trigger) |
| :-- | :-- | :-- |
| **KK** (PA / second brain) | Run Guy's day + recall | Gmail+Calendar+Notion+Drive (live) · **Slack** · `research-agent`. PM backend = **Notion + markdown backlog** (no Linear). |
| **HV** (EU RE dev) | Source→underwrite→permit→execute | Funda/Pararius/Kadaster · `research-agent` + DD-brief · **Notion/markdown** deal tracking · Gmail (hollandvest) |
| **PAI/Arbor** (product AI) | Ship + self-improve Arbor | **PostHog EU** (free analytics → CIL feedback critic) · **free SEO stack** (GSC/Trends/AWT + research-agent) · Canva/HeyGen free · the CIL. *Defer: Ahrefs, Amplitude.* |
| **MKT** | Growth on data, not vibes | **Free SEO stack + research-agent** · Canva (free→Pro $15) · **Brevo+Resend** (free lifecycle, parent-consent gated) · content skills. *Defer: Ahrefs/Similarweb/HubSpot/Klaviyo.* |
| **EA** | Client-grade architecture | Per-client tools (client-side) · Drive · Gmail. **Confidential — per engagement, not global.** |
| **FIN** | Nothing slips | Gmail+Notion (live) · accounting/banking later (gated) |
| **CoS** | One operating picture | the cockpit · **Slack** · rollups from every domain memory |

> **Principle:** capitalize, don't accumulate — *and don't over-buy*. Run the cheapest tool that does the job, name the upgrade trigger, gate the spend (L4). Two child-data escalations: analytics = **PostHog EU** (Frankfurt, IP-off — never the US Amplitude instance); lifecycle email goes only to the **parent** with logged consent (the gate lives in the Arbor app, not the ESP).

## 2. Autonomy rollout — gradual, in waves

Builds on the [agent framework](../00_System/agent-framework/FRAMEWORK.md), the [Arbor CIL](../PAI/projects/arbor/mesh/improvement/CIL.md) pattern, and [SCHEDULED-LOOPS](../00_System/agent-framework/SCHEDULED-LOOPS.md). **External actions (send/spend/deploy) stay human-gated at every phase.**

| Phase | What goes live | Gate |
| :-- | :-- | :-- |
| **0 — Done** | Framework · meshes · Arbor CIL · live dashboard · runtime-agnostic + multi-principal · HV/KK sharpened | shipped (`53b609a`, `1a2fcf5`) |
| **1 — Now (no-gate build)** | Tool capitalization (this doc + connectors map) · HV EU-pluggable · always-on dashboard refresh · write-back rule enforced | I build; you click the OAuth links |
| **2 — Per-domain loops (gradual: 1–2 at a time)** | KK morning brief → HV deal radar → FIN deadline watch → CoS weekly-review prep → MKT cadence. Each = read + **write-back** to shared state. | you flip each one live |
| **3 — Self-improvement** | **ROS-CIL** — a weekly company-wide loop (the Arbor CIL applied to ROS): audit every domain, score, propose fixes on a branch. Per-domain CILs follow. | you approve ships |
| **4 — Full always-on** | Persistent local orchestrator + watchers (inbox→triage, memory-change→dashboard refresh) on the dedicated machine | you confirm always-on |

> "Do gradual" = we turn loops on **one at a time**, confirm value, then expand — not flip everything to daily at once.

## 3. Always-on architecture (dedicated machine)

The box is dedicated to ROS, so capitalize it:
- **Dashboard server** — `command-center` on :4500, always up (the cockpit).
- **Scheduled loops** — Hermes crons (the autonomous engine); each writes back to shared state (`SCHEDULED-LOOPS` Rule 1).
- **Watchers (Phase 4)** — a memory-change → `build-state.mjs` refresh; an inbox → KK triage hand-off. Spec'd before any go-live.
- **Runtimes** — Claude Code (interactive), Hermes (scheduled), Codex (bulk), Gemini (gen/multimodal) — agnostic, filesystem-shared (`/AGENTS.md`).

## 4. HV — EU-pluggable (NL-first)

`market` becomes a parameter, not a hard-code: NL is live and deep; DE/BE/etc. are config, not a rewrite. Each market = `{sourcing portals, regulation model, comps source, permit regime}`. See [`HV/mesh/MESH.md`](../HV/mesh/MESH.md) Markets.

## 5. Success (the inverse of today's pain)
All paid tools capitalized by a team that uses them · loops run + write back (no Hermes↔Claude disconnect) · the company advances between check-ins · Joseph served as a principal · one honest cockpit · gradual, confirmed, no clutter.
