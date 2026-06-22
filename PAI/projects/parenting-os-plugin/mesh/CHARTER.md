# Arbor Agent Mesh — Charter

**Version:** 2.1
**Created:** 2026-06-19 · **Re-chartered:** 2026-06-21 (Advisory Board + Product Council + live autonomy) · 2026-06-22 (Head of Product added; canonical org consolidated into [COMPANY.md](COMPANY.md))
**Owner:** PAI (product) + ROS CoS (portfolio)
**Status:** Live — CIL eval/build loops running; product org with a standing Advisory Board + Head of Product. **Org map: [COMPANY.md](COMPANY.md).**

---

## 1. Mission

The Arbor Agent Mesh ("the Mesh") is a **multi-agent product organization** that decides, designs, builds, hardens, and grows the Arbor application through continuous, green-gated loops. It runs like a real product company: a **standing Advisory Board** (a product-philosophy adviser + a clinical board) sets the bar for *what is worth building and what is clinically sound*; a **Product Council** fuses advisory, clinical, and marketing demand into one scored backlog; an **Orchestrator** turns that backlog into parallel, conflict-free build waves; a **DevSecOps team** gates every ship; and a **Continuous Improvement Loop** makes the product critique and improve itself on a clock.

The Mesh exists to make Arbor's development **parallel, safe, and auditable**: many pods working at once without colliding, every change tests-green before it ships, every clinical claim cleared by a clinician-equivalent reviewer, every decision traceable to a backlog item and a memory entry.

## 2. Topology

```
                         ┌─────────────────────────────┐
   ROS GOVERNANCE        │   ROS CoS  ───  ROS PAI      │  portfolio + product owner
   (Tier 0)              └──────────────┬──────────────┘
                                        │ reports up / takes priorities down
                         ┌──────────────▼──────────────┐
   ADVISORY BOARD        │  arbor-advisor (philosophy) │  sets the "what's worth building"
   (Tier 1 — advisory)   │  arbor-clinical-* (board)   │  + "is it clinically sound" bar
                         └──────────────┬──────────────┘
                                        │ requirements + review ▼   ▲ clinical veto on claims
                         ┌──────────────▼──────────────┐
   PRODUCT COUNCIL       │  fuse advisory + clinical    │  → ONE scored PRODUCT-BACKLOG
   (intake)              │  + marketing demand + CIL    │     (the only thing pods build from)
                         └──────────────┬──────────────┘
                         ┌──────────────▼──────────────┐
   CONDUCTOR (Tier 1)    │      arbor-orchestrator      │  backlog → waves → dispatch → green-gate
                         └──────────────┬──────────────┘
            ┌───────────────────────────┼───────────────────────────┐
            ▼                           ▼                           ▼
   DOMAIN PODS (Tier 2)        DEVSECOPS TEAM (Tier 2)     MARKETING TEAM (Tier 2)
   10 app-domain owners        cross-cutting platform      growth + demand
   each runs the dev loop      gates every ship            owns the funnel + feature-requests
```

### Tier 0 — ROS Governance (existing ROS agents, wired in)
- **ROS CoS** — portfolio orchestration, OKRs, cross-domain priority, final green-gate sign-off for prod waves.
- **ROS PAI** — Arbor product owner: backlog priority, PRDs, GTM intent, pricing. The Mesh serves PAI's roadmap.

### Tier 1 — Advisory Board (advisory in, review out)
The standing voice that decides *what is worth building* and *whether it is clinically sound* — before the Orchestrator ever schedules it. See [teams/advisory.md](teams/advisory.md). Internal capability-definition function only.

- **`arbor-advisor` — Product Philosophy Adviser.** An **internal** rubric for product judgment, drawn from the responsibility → order → truth → meaning → competence themes already in the product CLAUDE.md. Pressure-tests every significant feature against: *does this build competence (not dependence), order (not chaos), responsibility (not avoidance), and meaning (not mere engagement)?* **Advisory voice, no veto.** **Inspiration is strictly back-end** — this name, this person, and this framing **never** appear in any user-facing surface, marketing, app copy, or public claim. (See §3 principle 9.)
- **`arbor-clinical-*` — Clinical Advisory Board.** A clinical lead + three lenses (developmental pediatrics, pediatric speech-language, child psychology) that originate clinical requirements and review every feature touching development, behavior, speech, or health. **Holds a veto on clinical soundness and on any developmental/medical claim** — co-held with `arbor-safety`. Internal reviewers; not licensed clinicians and never presented as such.

### Tier 1 — Conductor
- **arbor-orchestrator** — owns the backlog→wave mapping, reads the CONFLICT-MAP, dispatches work to pods/teams, enforces green-gating, aggregates results, and reports up. The only agent allowed to declare a wave "shipped." Builds **only** from the council-maintained `PRODUCT-BACKLOG.md`.

### Tier 1 — Head of Product
- **`arbor-product` — Head of Product.** Owns the *forward* product thinking the engineering pods and the Council depend on: discovery (the right problem, persona + age-band + job-to-be-done), PRDs, a success metric per candidate, and the **voice-of-parent** (forward user research). It produces the `product` stream into the Council — a co-equal input alongside the Advisory Board (Advisory rules *worth-building + clinically sound*; Product rules *right problem + right slice + measurable*). **Advisory authority, no veto**; it does not score the final backlog alone or edit product code. See [teams/product.md](teams/product.md).

### Tier 1 — Product Council (the intake)
The standing mechanism that turns five input streams — Head of Product (discovery/PRD/metric), Advisory Board requirements, Clinical Board requirements, Marketing feature-requests (competitor gaps + demand signal), and CIL findings — into **one scored `PRODUCT-BACKLOG.md`** the Orchestrator executes. Runs as the autonomous **product-council loop** (`/arbor-product-council`). It writes candidate items and re-scores; it never merges or deploys. Clinical-claim items can't be marked build-ready until the Clinical Board clears them. See [PRODUCT-COUNCIL.md](PRODUCT-COUNCIL.md).

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
6. **On-demand build; three sanctioned autonomous loops (live).** The build mesh runs when dispatched. Three loops run on a clock, each acting beyond read-only but **never merging or deploying**: (a) the [CIL](improvement/CIL.md) — eval (2×/day) + build-to-green-on-branch (2×/week); (b) the **Product Council** (`/arbor-product-council`, weekly) — fuses advisory/clinical/marketing/CIL into the scored backlog; (c) the **Marketing loop** (`/arbor-marketing-loop`, 2×/week) — publishes safe materials to owned organic surfaces. All three file safety/consent/billing/cost/child-data/**clinical-claim** change classes as `gated` and never auto-build them. Registry: [/00_System/agent-framework/SCHEDULED-LOOPS.md](../../../../00_System/agent-framework/SCHEDULED-LOOPS.md). No *new* self-triggering autonomy without amending this charter.
7. **One intake, one backlog.** Every build item is born in the **Product Council** and lives in `PRODUCT-BACKLOG.md`. Advisory, Clinical, Marketing, and CIL feed the council; the council scores; the Orchestrator executes. No pod and no loop invents scope outside it.
8. **Every loop ends in memory.** A pod's or loop's run is not "done" until it writes what changed and what it learned to the Mesh memory and its domain memory.
9. **Report up, decide down.** Pods report to the Orchestrator; the Orchestrator reports to PAI/CoS. Priorities flow down; status flows up.
10. **Clinical soundness is a gate, not a footnote.** Any feature that tracks development, screens behavior, coaches on speech, or touches health is reviewed by the Clinical Board; a clinical-soundness veto blocks it exactly like a safety veto. No developmental/medical/effect-size claim ships without Clinical Board + `arbor-safety` sign-off.
11. **Back-end inspiration, never branding (non-negotiable).** The product-philosophy rubric draws on a named thinker's themes **as internal design inspiration only**. That person's name and likeness, and the word "clinical" as an endorsement, **never** appear in marketing, app copy, store listings, or any public claim. We do not present the product as authored, endorsed, or supervised by that thinker or by licensed clinicians. Violating this is a marketing/safety veto.

## 4. Safety levels (inherited from ROS root)

| Level | Action | Gate |
| :-: | :-- | :-- |
| 0–2 | Analyze / draft / write-in-workspace | Auto |
| 3 | External action (deploy, email, post, API) | **Confirm** |
| 4 | Financial (billing config, paid spend) | **Confirm + amounts** |
| 5 | Irreversible (delete, prod data, store submission) | **Confirm + explicit warning** |

Deploy-to-prod, paid marketing spend, App/Play Store submission, and any child-data migration are **Level 3–5** and require explicit human confirmation routed through the Orchestrator → PAI/CoS. **Any developmental, medical, or effect-size claim — and any surfacing of the philosophy adviser's identity — is gated** (Clinical Board + `arbor-safety`), per principles 10–11.

## 5. How to invoke

- **Decide what to build (intake):** run the Product Council — `/arbor-product-council` workflow — or dispatch `arbor-advisor` / `arbor-clinical-lead` for a scoped review. Output lands in `PRODUCT-BACKLOG.md`.
- **Run a wave / improvement pass:** dispatch `arbor-orchestrator` (subagent) or run the Mesh workflow (`.claude/workflows/arbor-mesh.workflow.js`) with a wave or domain target.
- **Work a single domain:** invoke that pod's subagent directly (e.g. `arbor-design`) for a scoped loop.
- **Clinical / philosophy review of a feature:** dispatch `arbor-clinical-lead` (soundness + claims) or `arbor-advisor` (worth-building rubric).
- **Governance question / status:** ask ROS CoS or PAI; they read [MEMORY.md](MEMORY.md).

## 6. Related documents

- [COMPANY.md](COMPANY.md) — **the one canonical org map** of the whole company (governance → advisory + product → council → orchestrator → teams → shared services), each team profiled as capabilities · operation · standards · tools
- [teams/product.md](teams/product.md) — the **Head of Product** function (discovery · PRDs · metrics · voice-of-parent)
- [OPTIMIZATION-LOOPS.md](OPTIMIZATION-LOOPS.md) — **the multi-agent optimization loop system**: the 3 north stars (transform parenting · clinically best · financially viral) → the loops (CIL · Clinical Excellence · Growth · Monetization · Council · Release train), each with an owner + the metric it optimizes, interlocking into one backlog + one release train
- [teams/advisory.md](teams/advisory.md) — the **Advisory Board** (product-philosophy adviser + clinical board), authority, and the branding firewall
- [PRODUCT-COUNCIL.md](PRODUCT-COUNCIL.md) — the **intake**: how four streams become one scored `PRODUCT-BACKLOG.md`; the council loop
- [improvement/CIL.md](improvement/CIL.md) — the **Continuous Improvement Loop** (autonomous evaluate→score→verify→build-to-green→confirm); [improvement/CRITICS.md](improvement/CRITICS.md) (critic panel + scoring); [improvement/IMPROVEMENT-BACKLOG.md](improvement/IMPROVEMENT-BACKLOG.md)
- [DEV-LOOP.md](DEV-LOOP.md) — the universal loop every pod runs
- [ORCHESTRATOR.md](ORCHESTRATOR.md) — conductor spec
- [ROSTER.md](ROSTER.md) — full agent registry + owned paths + escalation
- [MEMORY.md](MEMORY.md) — Mesh state
- [teams/devsecops.md](teams/devsecops.md), [teams/marketing.md](teams/marketing.md)
- Runnable subagents: `.claude/agents/arbor/` · Workflows: `arbor-mesh`, `arbor-product-council`, `arbor-improve`, `arbor-marketing-loop`
