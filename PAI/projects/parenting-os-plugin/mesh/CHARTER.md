# Arbor Agent Mesh — Charter

**Version:** 1.0
**Created:** 2026-06-19
**Owner:** PAI (product) + ROS CoS (portfolio)
**Status:** Scaffolded — awaiting first live run

---

## 1. Mission

The Arbor Agent Mesh ("the Mesh") is a multi-agent system that designs, builds, hardens, and grows the Arbor application through continuous, green-gated improvement loops. It divides Arbor into **owned domains**, runs a uniform **design→build→verify→ship→learn loop** in each, and coordinates everything under a single **Orchestrator** that reports up to ROS CoS and ROS PAI.

The Mesh exists to make Arbor's development **parallel, safe, and auditable**: many pods working at once without colliding, every change tests-green before it ships, every decision traceable to a backlog item and a memory entry.

## 2. Topology

```
                         ┌─────────────────────────────┐
   ROS GOVERNANCE        │   ROS CoS  ───  ROS PAI      │  portfolio + product owner
   (Tier 0)              └──────────────┬──────────────┘
                                        │ reports up / takes priorities down
                         ┌──────────────▼──────────────┐
   CONDUCTOR (Tier 1)    │      arbor-orchestrator      │  backlog → waves → dispatch → green-gate
                         └──────────────┬──────────────┘
            ┌───────────────────────────┼───────────────────────────┐
            ▼                           ▼                           ▼
   DOMAIN PODS (Tier 2)        DEVSECOPS TEAM (Tier 2)     MARKETING TEAM (Tier 2)
   10 app-domain owners        cross-cutting platform      growth + demand
   each runs the dev loop      gates every ship            owns the funnel
```

### Tier 0 — ROS Governance (existing ROS agents, wired in)
- **ROS CoS** — portfolio orchestration, OKRs, cross-domain priority, final green-gate sign-off for prod waves.
- **ROS PAI** — Arbor product owner: backlog priority, PRDs, GTM intent, pricing. The Mesh serves PAI's roadmap.

### Tier 1 — Conductor
- **arbor-orchestrator** — owns the backlog→wave mapping, reads the CONFLICT-MAP, dispatches work to pods/teams, enforces green-gating, aggregates results, and reports up. The only agent allowed to declare a wave "shipped."

### Tier 2 — Domain Pods (10)
Each owns a slice of the app and runs the full dev loop within its boundary. See [ROSTER.md](ROSTER.md).

| Pod | Owns |
| :-- | :-- |
| `arbor-ai` | Conversational/LLM layer: model routing, prompts, quota, retries |
| `arbor-avatar` | Avatar & image generation, hero cards, comic panels |
| `arbor-practice` | Practice Studio: speech-language games, signals, MediaPipe |
| `arbor-growth` | Development score, milestones, JITAI nudges, monitoring |
| `arbor-memory` | Child memory & observation log (Firestore append-only) |
| `arbor-billing` | Stripe, entitlements, paywall, quota gates |
| `arbor-safety` | Escalation, consent/COPPA, redaction, GDPR, output screening |
| `arbor-native` | Capacitor iOS/Android shells, store readiness |
| `arbor-api` | Express/Firebase backend spine, routes, middleware |
| `arbor-design` | Design system, tokens, PlayKit, styling, a11y |

### Tier 2 — DevSecOps Team (cross-cutting)
Gates every ship; does not own product domains but holds veto on quality/security/release. See [teams/devsecops.md](teams/devsecops.md).
- `arbor-devsecops-lead`, `arbor-sec`, `arbor-release`, `arbor-sre`, `arbor-qa`

### Tier 2 — Marketing Team (demand + growth)
Owns the funnel and growth loops; reports to PAI + ROS MKT. See [teams/marketing.md](teams/marketing.md).
- `arbor-marketing-lead`, `arbor-content`, `arbor-seo`, `arbor-acquisition`

## 3. Operating principles

1. **One backlog, one source of truth.** All work traces to an item in `EXECUTION-BACKLOG.md` or the `exec-blueprint-2026-06-17/` specs. The Orchestrator never invents scope; it draws from the backlog and PAI priorities.
2. **Green-gate or no ship.** No change reaches `main` unless `npm run lint`, `npm test`, `npm run check:framework`, and `npm run eval:safety` pass. DevSecOps holds the gate.
3. **Conflict-map is law.** Concurrent edits to hotspot files (esp. `index.css`, `OverviewTab.tsx`, `api.ts`, `navigation.ts`, `reportExport.ts`) follow the binding order in [CONFLICT-MAP.md](../execution/exec-blueprint-2026-06-17/CONFLICT-MAP.md). Pods never edit a locked file out of order.
4. **Worktree isolation for parallel builds.** Concurrent code-writing pods run in isolated git worktrees (pattern: `.arbor-build` / branch `claude/exec-build`) and merge through the Orchestrator, never directly racing the working tree.
5. **Safety is non-negotiable.** `arbor-safety` and `arbor-sec` can veto any change. Child-data, consent, and COPPA/GDPR rules from `safety-policy-v1.md` override velocity.
6. **On-demand by default; the CIL is the sanctioned autonomous opt-in.** The build mesh runs when dispatched. The [Continuous Improvement Loop](improvement/CIL.md) (added 2026-06-21, authorized by Guy) is the approved autonomous mode: a critic panel evaluates + scores + verifies findings into the backlog, and the Orchestrator builds top `safe` items **to green on a branch**, on a schedule (nightly eval / weekly build). **Merge + deploy stay human (Level 3)**, and the safety/consent/billing/cost/child-data change classes never auto-build (filed `gated`). No other self-triggering autonomy is permitted without amending this charter.
7. **Every loop ends in memory.** A pod's loop is not "done" until it writes what changed and what it learned to the Mesh memory and its domain memory.
8. **Report up, decide down.** Pods report to the Orchestrator; the Orchestrator reports to PAI/CoS. Priorities flow down; status flows up.

## 4. Safety levels (inherited from ROS root)

| Level | Action | Gate |
| :-: | :-- | :-- |
| 0–2 | Analyze / draft / write-in-workspace | Auto |
| 3 | External action (deploy, email, post, API) | **Confirm** |
| 4 | Financial (billing config, paid spend) | **Confirm + amounts** |
| 5 | Irreversible (delete, prod data, store submission) | **Confirm + explicit warning** |

Deploy-to-prod, paid marketing spend, App/Play Store submission, and any child-data migration are **Level 3–5** and require explicit human confirmation routed through the Orchestrator → PAI/CoS.

## 5. How to invoke

- **Run a wave / improvement pass:** dispatch `arbor-orchestrator` (subagent) or run the Mesh workflow (`.claude/workflows/arbor-mesh.workflow.js`) with a wave or domain target.
- **Work a single domain:** invoke that pod's subagent directly (e.g. `arbor-design`) for a scoped loop.
- **Governance question / status:** ask ROS CoS or PAI; they read [MEMORY.md](MEMORY.md).

## 6. Related documents

- [improvement/CIL.md](improvement/CIL.md) — the **Continuous Improvement Loop** (autonomous evaluate→score→verify→build-to-green→confirm); [improvement/CRITICS.md](improvement/CRITICS.md) (critic panel + scoring); [improvement/IMPROVEMENT-BACKLOG.md](improvement/IMPROVEMENT-BACKLOG.md) (the scored intake)
- [DEV-LOOP.md](DEV-LOOP.md) — the universal loop every pod runs
- [ORCHESTRATOR.md](ORCHESTRATOR.md) — conductor spec
- [ROSTER.md](ROSTER.md) — full agent registry + owned paths + escalation
- [MEMORY.md](MEMORY.md) — Mesh state
- [teams/devsecops.md](teams/devsecops.md), [teams/marketing.md](teams/marketing.md)
- Runnable subagents: `.claude/agents/arbor/`
- Workflow: `.claude/workflows/arbor-mesh.workflow.js`
