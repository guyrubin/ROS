# Arbor Dev Loop — The Universal Pod Loop

**Version:** 1.0
Every domain pod runs this exact loop on every assignment. The loop is the contract between the Orchestrator and a pod: the Orchestrator hands a pod a **frame** (scope + acceptance + constraints); the pod returns a **shipped, verified, memory-logged delta** or an **escalation**.

```
  SENSE  →  FRAME  →  DESIGN  →  BUILD  →  VERIFY  →  SHIP  →  LEARN
    ▲                                                            │
    └──────────────────  loop again on next frame  ─────────────┘
```

## Stage 0 — SENSE (input)
Gather signal for the domain before proposing change. Sources:
- Backlog items + specs assigned by the Orchestrator
- Telemetry / `arbor-sre` observability (errors, latency, cost, usage)
- Open issues, failing tests, safety-eval flags
- PAI roadmap intent + marketing funnel data (for growth-adjacent domains)

**Output:** a short signal summary — what's broken, slow, missing, or asked-for in this domain.

## Stage 1 — FRAME (scope)
Convert signal into a single, bounded change with explicit acceptance criteria.
- One problem statement.
- Acceptance criteria (testable).
- Files this will touch + any hotspot files (cross-check [CONFLICT-MAP.md](../execution/exec-blueprint-2026-06-17/CONFLICT-MAP.md)).
- Safety/consent surface? → flag `arbor-safety` early.

**Gate:** if the frame touches a locked hotspot file out of order, or spans another pod's boundary, **escalate to the Orchestrator** instead of proceeding.

## Stage 2 — DESIGN (proposal)
Design before code. For UI: use the `impeccable` / `design` skills and the design system tokens. For backend/AI: sketch the interface, data shape, and failure modes. For risky changes: a 1-paragraph ADR-style rationale.
- Reuse existing patterns; match surrounding code.
- Name the trade-off you're accepting.

**Gate (design review):** UI changes get a design-critique pass; architecture changes get an `arbor-api`/`arbor-sec` sanity check when they cross boundaries.

## Stage 3 — BUILD (implement)
Implement in an **isolated worktree** when running concurrently with other pods (branch `claude/exec-build`, worktree `.arbor-build`). Solo/serial work may use the main tree.
- Edit only files inside the pod's boundary (or coordinated hotspot regions in order).
- Keep diffs reviewable; write code that reads like the surrounding code.
- Add/extend tests alongside the change.

## Stage 4 — VERIFY (prove it)
Never claim done without proof. Run the full local gate from `app/`:
```bash
npm run lint            # tsc --noEmit
npm test                # vitest run
npm run check:framework # framework.json schema (if touched)
npm run eval:safety     # safety regression + architecture gates
```
- UI changes: verify in preview (preview_* tools) and capture a screenshot.
- API/AI changes: exercise the endpoint / model path and show output.
- Report failures honestly with the actual output. A red gate = back to BUILD or escalate.

## Stage 5 — SHIP (green-gated)
- Hand the verified delta to the Orchestrator with the gate results attached.
- **DevSecOps gate:** `arbor-qa` (tests/coverage), `arbor-sec` (security/secrets/deps), `arbor-release` (build/deploy). Any veto stops the ship.
- Merge to `main` only through the Orchestrator. Deploy-to-prod is **Level 3** — requires confirmation.
- Commit identity prefix: `[claude]` (or the running agent's identity).

## Stage 6 — LEARN (close the loop)
A frame is not done until:
- The Mesh [MEMORY.md](MEMORY.md) records: item, what shipped, gate result, deploy state.
- The pod's domain memory records any new fact/decision/pattern.
- Any discovered-but-out-of-scope work is logged back to the backlog (not silently fixed).

## Escalation triggers (any stage → Orchestrator)
- Cross-boundary change (touches another pod's files)
- Hotspot file lock conflict
- Safety/consent/financial/irreversible action (Level 3–5)
- Red gate that the pod can't resolve within its boundary
- Ambiguous or missing acceptance criteria

## Artifacts a pod produces per loop
1. Signal summary (SENSE)
2. Frame with acceptance criteria (FRAME)
3. Design note / ADR snippet (DESIGN)
4. Diff (BUILD)
5. Gate output (VERIFY)
6. Ship record + commit (SHIP)
7. Memory entry (LEARN)
