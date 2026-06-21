# FIN Admin Mesh

**Version:** 0.1
**Created:** 2026-06-21
**Owner:** FIN (Finance & Admin) · reports to ros-conductor (CoS)
**Loop type:** both (on-demand admin tasks + proposed scheduled deadline-watch)
**Runs:** `/AGENTS.md` boot → reads `/FIN/MEMORY.md` → [ROS Agent Framework](../../00_System/agent-framework/FRAMEWORK.md)

## Mission
Keep Guy's financial admin clean and nothing-slips: log invoices, track due-dates/renewals/tax deadlines, review contracts and insurance, and organize personal-finance admin — always with amounts stated and never executing a payment autonomously.

## Roster

| ID | Role | Owns (scope/paths/topics) | Escalates to |
| :-- | :-- | :-- | :-- |
| `fin-admin` | Lead | Frames the admin task, runs the loop, holds the gate, retains the document, tracks the deadline, reports up | ros-conductor |

> Single serial lead — admin work is sequential, so no parallel pods. Add one only if a future slice genuinely fans out.

## Gate (Definition-of-Done)
The FIN DoD from [UNIVERSAL-LOOP.md](../../00_System/agent-framework/UNIVERSAL-LOOP.md):
- **Amounts stated explicitly** — no figure left implicit.
- **Level-4 confirm before any payment/commit** (Level-5 explicit warning before anything irreversible: transfer, legal signature).
- **Document retained to the right path** (FIN tracker / `/FIN/` / Notion).
- **Deadline / renewal tracked** — written to `/FIN/MEMORY.md` so it can't slip.
- Plus the universal checks: safety level respected · correct account · no confidential leakage.

## Skills this mesh loads
| Task | Skill |
| :-- | :-- |
| Invoice / contract / renewal correspondence | `email-composer` (Gmail `bguy`, draft-first) |
| Background on a provider, policy, deadline rule | `research` |
| Log to the financial tracker / docs registry | `notion-sync` |

## Loops it owns

| Loop | Type | Cadence | Posture | Registry |
| :-- | :-- | :-- | :-- | :-- |
| On-demand admin | on-demand | — | acts in-workspace (Level 4+ confirm) | — |
| FIN Deadline watch | scheduled (proposed) | Weekly | read-only | [SCHEDULED-LOOPS.md](../../00_System/agent-framework/SCHEDULED-LOOPS.md) |

## How to invoke
- An admin task: dispatch `fin-admin`.
- Command: `/fin.log-invoice`, `/fin.check-insurance`, `/fin.draft-contract`.

## Boundaries
- Real-estate deal economics (mortgages, lender terms, BRRRR) → **HV**.
- Venture financial modeling → **support PAI, but PAI owns the model**.
- EA contract scope/deliverables → **EA**.
- **Never execute a payment, trade, or transfer autonomously** — always confirm and state amounts; irreversible actions require an explicit Level-5 warning.
