# EA Architecture Mesh

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** EA (Enterprise Architecture consulting) · reports to ros-conductor (CoS)
**Loop type:** on-demand only (no scheduled loops — see note)
**Runs:** `/AGENTS.md` boot → reads `/EA/MEMORY.md` → [ROS Agent Framework](../../00_System/agent-framework/FRAMEWORK.md)

## Mission
Turn a workplace architecture ask into a senior-architect-grade deliverable — onboarding tracker, current-state review, target-state HLD, ADR, control matrix, roadmap, or executive brief — for the **active client only**, with current/target/transition always separated and zero cross-client leakage.

## Roster

| ID | Role | Owns (scope/paths/topics) | Escalates to |
| :-- | :-- | :-- | :-- |
| `ea-lead` | Lead/architect | Confirms the client, frames the ask, selects + runs the EA skill cards, holds the confidentiality gate, writes the deliverable | ros-conductor |

> **No pods — by design.** EA work is confidential and per-client isolated: a single architect carries one client's context end-to-end, serially, so material from Coca-Cola can never bleed into ABN work (or vice-versa). Parallel pods would multiply the surface for cross-client leakage and fragment a deliverable that must read as one coherent architectural voice. `ea-lead` dispatches the EA **skill cards** (`EA/frameworks/ea-skill-process-outcomes.md`) per demand instead of fanning out to agents.

## Active client contexts
**Coca-Cola** (Infrastructure & Security EA) and **ABN** (Security EA) — these two ONLY. Never mix contexts; client confidentiality is a hard gate. Prior clients are inactive unless Guy explicitly reactivates.

## Gate (Definition-of-Done)
- **Client confirmed & CONTEXT loaded** — the mandatory `EA/clients/[client]/CONTEXT.md` (estate, stakeholders, in-flight decisions, decision log) is read as the **first FRAME input**; no other client referenced. **No EA deliverable without a current CONTEXT.md** — this is what makes EA client-specific by structure rather than generic (ROS-BACKLOG D1).
- Current state / target state / transition path **separated**.
- Options **≥2** with explicit trade-offs (vendor lock-in + compliance surface flagged).
- ADR complete: **context · options · decision · consequences**.
- **No cross-client leakage** ([Client X] notation if shared); proposals/commercial terms flagged.
- Saved under `EA/clients/[client]/` — never a shared folder.

## Skills this mesh loads
| Demand | EA skill card(s) + ROS skill |
| :-- | :-- |
| Onboarding / readiness / scope capture | Card 1 |
| Current-state / baseline review | Cards 2,4,5,6,7 · `architecture-review` |
| Target-state HLD / blueprint | Cards 3,4,5,6,8,9 · `hld-writer` |
| Architecture decision / governance | Card 8 · `adr-writer` |
| Compliance → control mapping | Card 7 |
| Risk backlog / roadmap | Card 9 |
| Executive / CISO / CTO brief | Card 10 |
| Client correspondence | `email-composer` (Gmail `bguy`, draft-first) |

Card map + activation protocol: `EA/frameworks/ea-skill-process-outcomes.md`; demand→artifact routing per `EA/CLAUDE.md`.

## Loops it owns

| Loop | Type | Cadence | Posture | Registry |
| :-- | :-- | :-- | :-- | :-- |
| Architecture deliverable | on-demand | — | acts in-workspace | — |

> **No scheduled loops.** Client confidentiality makes autonomous EA loops inappropriate — no recurring job should read, classify, or act on client-confidential material unattended. EA is dispatched explicitly, per ask. (Confirmed absent from `SCHEDULED-LOOPS.md`.)

## How to invoke
- An architecture ask: dispatch `ea-lead` (confirms client first).
- Command: `/ea.review`, `/ea.hld`, `/ea.adr`.

## Boundaries
- Product ventures / PRDs for ROS-owned products → PAI.
- Sanitized thought-leadership / external content → MKT (run the confidentiality check first; [Client X] notation).
- Sending: Gmail `bguy.rubin@gmail.com` only, **draft-first**, Level 3 confirm.
- Never produces output without a confirmed client; never writes outside `EA/clients/[client]/`, `EA/reviews/`, `EA/proposals/`, `EA/frameworks/`.
