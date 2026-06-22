# ROS Decision Log

**Owner:** CoS conductor · **Cadence:** every open decision gets an owner + a deadline; cleared in the weekly review.
**Rule (CoS/CLAUDE.md):** no decision sits unowned. Closed decisions move to `archive.md`.

Path of record for `CoS/CLAUDE.md` File-locations → Decision log. One row per decision.

| ID | Decision | Domain | Options | Owner | Due | Status |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| D-2026-06-21-1 | Arbor cloud deployment decision (prod hosting / spend posture) | PAI | as surfaced in cockpit + arbor-payment-model | Guy | 2026-06-30 | Open |
| D-2026-06-21-2 | Bookmark / article revival pack — adopt or drop | KK/MKT | revive vs archive | Guy | 2026-06-30 | Open |
| D-2026-06-22-1 | **Promote REL-ARBOR-001 canary → prod 100%** (the ONE go/no-go; the 6 green council items ride this train, none deployed by hand) | PAI/CoS Delivery | go (after green-gate + canary smoke) / no-go | Guy | on green-gate pass | Open — gated, awaiting train to reach stage-8 |
| D-2026-06-22-2 | **OPS-C1 WIF/IAM** — kill the long-lived SA key, move to Workload Identity Federation (GCP IAM, Level 3) | PAI/CoS Delivery | do now / defer (train runs on existing key meanwhile) | Guy | with REL-ARBOR-001 | Open |
| D-2026-06-22-3 | **Any claim flip** for a council item carrying a developmental/medical/effect-size claim (ships dark; flipped only after Clinical Board + arbor-safety) | PAI/Clinical | flip per-claim / hold dark | Guy + Clinical Board | per claim | Open — none pending until train identifies claim-bearers |

> Seeded 2026-06-21 by ros-evaluator (ROS-CIL editor pass) from the cockpit `nextDecision` fields. Both lacked owner+due; assigned here.
