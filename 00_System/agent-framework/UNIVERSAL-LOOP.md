# ROS Universal Loop

**Version:** 1.0
The single loop every ROS agent runs on every assignment. It generalizes the [Arbor Dev-Loop](../../PAI/projects/arbor/mesh/DEV-LOOP.md): Arbor's `BUILD/VERIFY/SHIP` is the **software** specialization; this is the **knowledge-work** form. Same seven stages; the gate differs by domain.

```
  SENSE → FRAME → DESIGN → PRODUCE → VERIFY → DELIVER → LEARN
    ▲                                                      │
    └─────────────  loop again on next frame  ────────────┘
```

The loop is the contract between the lead and a pod: the lead hands a **frame** (scope + acceptance + constraints); the pod returns a **delivered, gate-passed, memory-logged artifact** — or an **escalation**.

## Stage 0 — SENSE
Gather signal before proposing anything. Sources: the ask, domain `MEMORY.md`, Notion tasks, inbox (read-only), prior artifacts, web research (dispatch `research-agent` if external facts are needed). **Output:** a 2–4 line signal summary — what's being asked, what's known, what's missing.

## Stage 1 — FRAME
Convert signal into one bounded change with **testable acceptance criteria**. Name the files/notes it will touch and any cross-domain or confidentiality surface. **Gate:** if it crosses another mesh's boundary, touches client-confidential material out of context, or is Level 3+, escalate to the lead/Conductor instead of proceeding.

## Stage 2 — DESIGN
Decide the shape before producing. Pick the right ROS skill (see the domain MESH). State the one trade-off you're accepting. Reuse existing templates and match house style. For risky calls, a 1-paragraph rationale (ADR-style).

## Stage 3 — PRODUCE
Create the smallest useful artifact (memo, HLD, post, plan, model, CV, brief). Markdown-first, source-grounded, atomic. Save to the correct ROS path. Write artifacts that read like the surrounding ones.

## Stage 4 — VERIFY (the gate)
Never claim done without checking against the **domain Definition-of-Done** below. Report honestly; a failed bar = back to PRODUCE or escalate.

### Definition-of-Done by domain (the "green gate" for knowledge work)

| Domain | DoD bar (all must pass) |
| :-- | :-- |
| **HV** | Facts / labeled assumptions / risks / financial impact separated · yields & LTV & ARV computed in `<thinking>` · explicit verdict (Proceed / Proceed-if / Hold / Do-not) · sources grounded · next actions |
| **EA** | Client confirmed & context isolated · current / target / transition separated · options ≥2 with trade-offs · ADR complete (context/options/decision/consequences) · confidentiality preserved (no cross-client leakage) · saved under `EA/clients/[client]/` |
| **KK** | Actionable & prioritized (top 1–5) · correctly routed · draft-first for anything outbound · respects the morning-routing scope/noise filters |
| **MKT** | On-brand voice · channel-fit format · claims substantiated · clear CTA · EA-confidentiality checked before any client-derived content |
| **FIN** | Amounts stated explicitly · Level-4 confirm before any payment/commit · document retained to the right path · deadline/renewal tracked |
| **Career** | Fit-scored against the role · CV/letter tailored from the **verified** fact source (Drive folder, post-2026-06-03) · permit/eligibility checked · draft-first, never auto-submit |
| **Research** | Every material claim cited · key claims adversarially verified · uncertainty flagged · synthesized, not dumped |
| **PAI/Arbor** | Arbor software gate: `lint` + `test` + `check:framework` + `eval:safety` green (see Arbor Dev-Loop) |

Add the universal checks for any domain: **safety level respected · identity/account correct · no confidential leakage · memory written-back (Stage-6 LEARN: the domain `MEMORY.md` records what changed + a `Reviewed:` date).** The memory write-back is a **gate, not a nicety** — a frame is not "done" until LEARN is recorded (ROS-BACKLOG A2; this is what stops inter-session rot).

## Stage 5 — DELIVER (gated)
Save / send / push, **gated by safety level**: Level 0–2 auto; Level 3+ requires Guy's confirmation (draft-first always). Route to the right surface (ROS path, Notion, the correct Gmail account). Scheduled loops deliver read-only reports unless granted otherwise.

## Stage 6 — LEARN
A frame isn't done until: the domain `MEMORY.md` records what shipped + what was learned; any decision is logged to the domain decision log; and out-of-scope discoveries are written back to the backlog/Notion (never silently actioned).

## Escalation triggers (any stage → lead → Conductor)
Cross-boundary change · confidentiality risk · Level 3–5 action · a gate the pod can't clear · missing/ambiguous acceptance criteria.

## Artifacts per loop
Signal summary → frame → design note → artifact → gate result → deliver record → memory entry.
