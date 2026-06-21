# Arbor Improvement Backlog (CIL-maintained)

**Auto-maintained by the [Continuous Improvement Loop](CIL.md).** The critic panel writes verified, scored findings here each cycle; the `arbor-orchestrator` burns down the top `safe` items in the weekly build wave (alongside the human-authored [EXECUTION-BACKLOG.md](../../EXECUTION-BACKLOG.md)). Do not hand-edit scores — re-run the loop. Humans may re-prioritize by adding a `pin` note or moving an item to EXECUTION-BACKLOG.

**Format:** newest cycle on top. Each finding: `score · id · lens · title · ownerPod · effort · riskClass · status`. Status = `open → building → shipped → confirmed` (or `dropped`, with reason).

Scoring: `(severity × userImpact × confidence) ÷ effort × 4` — see [CRITICS.md](CRITICS.md) §2.

---

## Open — top of queue
_(empty — first loop run will populate this)_

| Score | ID | Lens | Title | Owner | Effort | Risk | Status |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- | :-- |
| — | — | — | _(awaiting first eval cycle)_ | — | — | — | — |

## Gated — needs Guy (not auto-built)
_(safety / consent / billing / cost / child-data findings land here)_

## Shipped & confirmed
_(items the loop built to green, Guy approved, and a critic re-confirmed)_

## Dropped (verify rejected)
_(findings the adversarial verify could not substantiate — kept for audit)_

---

### Cycle log
| Date | Mode | Found | Verified | Built | Confirmed | Shipped |
| :-- | :-- | :-: | :-: | :-: | :-: | :-: |
| _(none yet)_ | | | | | | |
