# Rubin OS (ROS) — Prioritized Build Backlog

> ## State of the Company — 2026-06-21 (ros-evaluator — ROS-CIL deep editor pass)
> **The management heartbeat is dead, and that is the headline.** The conductor's COO cadence has never actually run: **zero cross-domain weekly reviews exist** (newest is a PRD review, 2026-05-12 → a 40-day gap), **Q2 OKRs were never set** (Q2 ends in 9 days with placeholders to score nothing against), the **decision log directory didn't exist**, and **CoS's own memory was 37 days stale** with blank OKRs/decisions/stakeholders/cadence. Only **2 crons actually run** (KK triage `333eaf638d76`, Career sourcing `4fc75fbfad30`); every other specced loop — daily refresh, weekly-review prep, ROS-CIL — is on paper. **Freshness is honest but unfed:** git-derived freshness works, but **5/7 domains read git-stale** (only PAI fresh, carrying the whole company's commit pulse) and **no domain has ever written a `Reviewed:` heartbeat**, so quiet-but-true domains read false-red. **Doc-vs-reality drift** persists in dead/phantom crons (Tsagareli `c20375b10b15`, hygiene `bc55de81f9f1`, HV Smart-Living radar — all documented live, none in `jobs.json`) and an unmapped **My Tasks DB** the KK/CoS meshes treat as canonical but the Notion registry never recorded. The structure is sound; it just isn't being *run*. This pass fixed the safe substrate (CoS memory, decision log, dead-cron docs); the management cadence itself needs Guy to greenlight loops + OKRs.

> ### Audit findings — 2026-06-21 (full set, scored `sev×imp×conf÷eff`)
> | ID | Finding | Score | Owner | Gated |
> | :-- | :-- | :-: | :-- | :-: |
> | CIL-CoS-004 | CoS's own memory 37d stale — OKRs/decisions/stakeholders/cadence all blank | **11.4** | CoS | No (FIXED) |
> | CIL-CoS-001 | Cross-domain weekly review has NEVER run — 40-day gap | **9.7** | CoS | No |
> | F-DRIFT-1 | Tsagareli cron `c20375b10b15` documented LIVE; absent from jobs.json | **9.0** | kk-ops | FIXED docs; revive=gated |
> | CIL-CoS-003 | Decision log dir missing; decisions unowned/unaged | **5.8** | CoS | No (FIXED) |
> | F-FRESH-2 | Zero `Reviewed:` heartbeats — freshness escape hatch unused | **5.4** | conductor | No |
> | CIL-CoS-002 | Q2 OKRs never set; Q2 ends in 9 days | **5.1** | CoS | Gated |
> | CIL-CoS-005 | Daily/weekly COO cadence specced but not cron'd; only 2 live crons | **5.0** | CoS | Gated |
> | F-FRESH-1 | 5/7 domain MEMORYs git-stale >14d; only PAI fresh | **4.3** | conductor | No |
> | CIL-CoS-007 | 4/6 domains stale in cockpit — no monthly freshness sweep ran | **4.2** | CoS | No |
> | F-DRIFT-3 | "My Tasks DB" (KK/CoS canonical) absent from notion registry | **4.05** | kk-ops | Gated (Notion) |
> | F-DRIFT-2 | MKT/MEMORY header `2026-06-21` lies vs git `2026-05-15` | **4.0** | mkt-lead | No (FIXED) |
> | F-DRIFT-5 | Root MEMORY claimed 4 live crons + hygiene `bc55de81f9f1` not in jobs.json | **4.0** | conductor | No (FIXED) |
> | CIL-CoS-008 | Cockpit lags uncommitted MEMORY edits (heartbeat not committed) | **3.5** | CoS | No |
> | CIL-CoS-006 | Per-principal (Guy/Joseph) management lanes not operational | **2.7** | CoS | No |
> | F-DRIFT-4 | HV Smart-Living radar stalled ~2026-06-05, never a cron | **2.7** | hv-orchestrator | Gated (cron) |

> ### ROS-CIL cycle log — 2026-06-21 (editor pass over 15 findings)
> **Themes:** (1) *Management heartbeat dead* — CIL-CoS-001/002/003/004/005, root cause = COO cadence never run. (2) *Freshness honest-but-unfed* — F-FRESH-1/2, CIL-CoS-007/008, F-DRIFT-2. (3) *Doc-vs-reality drift (dead/phantom loops)* — F-DRIFT-1/4/5. (4) *Unmapped infra* — F-DRIFT-3, CIL-CoS-006.
>
> **Safe fixes applied this pass (branch `ros-cil/2026-06-21-editor-pass`, re-confirmed):**
> - CIL-CoS-004: refreshed `CoS/MEMORY.md` — `Reviewed: 2026-06-21`, OKR block honest (Q2 not-set/no-score, Q3 pointer), open decisions filled, weekly-review cadence line set, `Last updated` bumped. ✓
> - CIL-CoS-003: created `/13_Decision_Log/` + `README.md`, migrated the 2 cockpit decisions with owner (Guy) + due (2026-06-30); doc-vs-reality path now resolves. ✓
> - F-FRESH-2: first `Reviewed:` heartbeat written (CoS); rule documented in MKT memory. ✓
> - F-DRIFT-2: reset MKT `Last updated:` to true git date 2026-05-15 + anti-gaming note. ✓
> - F-DRIFT-1 / F-DRIFT-5: already corrected in prior same-day pass (kk-ops.md, KK/mesh/MESH.md, root MEMORY.md); confirmed against jobs.json (2 enabled crons). ✓
> - Cockpit refreshed via `build-state.mjs` (git-derived freshness confirmed: 5/7 STALE, PAI fresh). ✓
>
> **Gated — await Guy (Level 3+):**
> - CIL-CoS-001: run the weekly review now → `CoS/reviews/Review_2026-06-21.md` is safe to author, but standing up the Friday weekly-review-prep cron is gated (live cron).
> - CIL-CoS-002: draft `CoS/OKRs/Q3-2026.md` — gated (setting objectives is Guy's priority call; skip Q2 scoring, no baseline).
> - CIL-CoS-005: register CC-refresh + weekly-review-prep + ROS-CIL-light crons — gated (Level-3 automation).
> - F-DRIFT-3: resolve My Tasks DB Notion ID + Data Source ID → add to `notion_database_registry.md` — gated (Notion write).
> - F-DRIFT-4 / F-DRIFT-1 revive: re-create HV Deal Radar + (optionally) Tsagareli forecast as real Hermes crons — gated (live cron).
>
> **Dropped (adversarial verify):** none — all 15 findings substantiated against file/state (CoS/reviews/ listing, CoS/OKRs/ listing, missing 13_Decision_Log/, git dates, jobs.json, build-state.mjs output, empty CoS/MEMORY placeholders). CIL-CoS-002/005 partially overlap CIL-CoS-001 (one root cadence) but kept distinct as they need separate Guy decisions (OKRs vs crons).

> ## Group Autonomy — connector-independent, CEO-runnable (2026-06-22)
> **State of the Group.** Governance is strong and structure is filesystem-native — every entity has a clear lead, roster, and a real Definition-of-Done gate on disk; that layer reads with zero connectors and is the autonomy backbone. The gap is uniform and structural: **companies cannot run hands-off on the filesystem alone because their SENSE half and their P&L lane live entirely in connectors.** Two findings repeat across all nine entities. (1) **The P&L interface is vapor** — the group operating model promises every company a revenue/cost lane, but not one P&L file exists anywhere in ROS (verified: glob for `*PNL*`/`*capital-ledger*` returns nothing), so a hands-off CEO has zero portfolio money view, online or off. (2) **Connectors are treated as load-bearing with no filesystem fallback** — FIN/EA/Research/HV degrade to "manual review" or a silent no-op when Gmail/Notion/web drop, instead of operating from a captured on-disk ledger. Below that: only **Arbor** has the four interfaces wired and its loops verifiably live on the clock; **HV/EA/FIN/MKT/Research** own no backlog with stable IDs and no clocked loop, so they only move when a human dispatches them; and **CoS's own COO heartbeat is paper** (every CoS-owned loop sits "Proposed", the only two live crons are KK/Career and connector-bound). The fix pattern is the same everywhere and is overwhelmingly safe + connector-independent: give each entity an on-disk ledger of record (backlog · health · decisions · P&L stub), make the connector the refresher of that file rather than the source of truth, and define an explicit degraded mode so an offline run still produces a durable artifact. Arbor is the template; the rest should copy it.
>
> ### Findings — deduped to themes (scored `sev×imp×conf÷eff`)
> | ID | Theme / item | Owner | Sev | Safe/Gated | Connector-indep |
> | :-- | :-- | :-- | :-: | :-- | :-: |
> | GA-1 | **No filesystem P&L lane anywhere** — the 4th group interface is vapor across ALL entities; add a hand-maintainable per-company P&L stub the cockpit can parse | CoS/FIN | high | safe (stub) / gated (connector refresh) | yes |
> | GA-2 | **Connectors load-bearing with no FS fallback** — FIN/EA/Research/HV degrade to "manual review" or silent no-op offline; redefine fallback as "operate from the on-disk ledger, flag stale, queue refresh" | CoS | high | safe | yes |
> | GA-3 | **Companies own no backlog with stable IDs** — HV/EA/FIN/MKT/Research have no ranked on-disk queue; nothing for a loop to enumerate or CoS to read | per-mesh | high | safe | yes |
> | GA-4 | **No ledger of record on disk** — FIN/MEMORY empty template, EA dossiers stale+hollow, HV no decision/pipeline file, MKT no release ledger; SENSE has nothing durable to stand on offline | per-mesh | high | safe | yes |
> | GA-5 | **CoS COO heartbeat is paper** — every CoS-owned loop "Proposed"; only KK/Career crons live (both connector-bound); register FS-only ROS-CIL-light + CC-refresh | CoS | high | gated (cron) | yes |
> | GA-6 | **Loops claimed-live but unregistered** — MKT/FIN/Delivery/HV-radar cadences specced, never on a runtime; reconcile SCHEDULED-LOOPS against the live registry | CoS | med | gated (cron) | yes |
> | GA-7 | **Connector status over-stated vs real wiring** — EA marks Gmail/Notion "verified" but Notion is Enterprise-gated, HV/Joseph mail is Hermes-only not MCP; correct status columns + name per-connector fallback | CoS | med | safe | yes |
> | GA-8 | **Only Arbor has COMPANY.md + 4 interfaces** — HV/EA/MKT can't be board-reviewed; add minimal HEALTH + BACKLOG stubs (no premature promotion) | CoS | med | safe | yes |
> | GA-9 | **Arbor CIL eval bound to a live preview** — the twice-daily backlog engine starves offline; default to static source-grounded critique, live-render as optional enrichment | PAI | high | safe | partial |
> | GA-10 | **HV digest writes nothing durable on disk** — only loop emits to Drive+Gmail; write `HV-DIGEST-<date>.md` BEFORE the connector publish | hv-orchestrator | high | safe | yes |
> | GA-11 | **App-repo git-isolation breaks the build-loop DoD** — subagents denied git in the gitignored app repo; route all builds through REL-ARBOR-001 or grant scoped git | PAI/CoS | med | gated | yes |
> | GA-12 | **Delivery pipeline 0-of-8 stages survive offline** — only paperwork runs; document degraded mode + a Green/Amber/Red health emitter (RED today: cannot ship) | CoS Delivery | med | safe (doc) | partial |
> | GA-13 | **Doctrine points source-of-truth at Notion** — CoS MESH names Notion "the single management surface"; invert: filesystem cockpit canonical, Notion the mirror | CoS | med | safe | yes |
> | GA-14 | **Governance layer is genuinely FS-complete** — leads/rosters/DoD gates read on disk for every entity; keep as the autonomy backbone (no fix) | all | low | safe (keep) | yes |
> | GA-15 | **Hard safety gates are FS-enforced** — clinical/claim firewall, L3-5 gating, draft-first all in markdown+code; offline companies still cannot self-ship a claim or move money (no fix) | all | low | gated (keep) | yes |
>
> ### Safe fixes applied this pass (branch `ros-cil/2026-06-21-editor-pass`)
> - **GA-1/GA-8:** created `CoS/PNL/PORTFOLIO-PNL.md` — a hand-maintainable per-company P&L stub (MRR/cost/runway lines, last-verified dates) so the 4th group interface exists on disk before any connector is wired. (see below; appended, not yet wired into gen-state)
> - Backlog/ledger/health stubs (GA-3/GA-4) and the fallback-doctrine edits (GA-2/GA-7/GA-13) are queued as the safe wave — each names a distinct target file in the safeFixes list returned to Guy.
>
> ### Gated — await Guy (Level 3+)
> - GA-5/GA-6: register FS-only ROS-CIL-light + CC-refresh + the MKT/FIN/Delivery cadence loops on the scheduled-tasks runtime (live cron = L3).
> - GA-1 refresh: wiring connectors (RevenueCat/Stripe) to auto-update the P&L stub.
> - GA-11: grant scoped git in the app repo OR ratify "all builds ride REL-ARBOR-001."
> - The connector capitalization gaps (Amplitude/Ahrefs/Linear OAuth) that starve the CIL/marketing/release loops.
>
> ### Dropped (adversarial verify)
> - None dropped on substance — every theme traces to a concrete file/absence (no `*PNL*` file exists; FIN/MEMORY is an HTML-comment template; SCHEDULED-LOOPS Proposed table; the group-operating-model 4-interface promise). The per-entity "no fix needed" findings (governance, safety gates) are retained as **keep** items, not dropped, because they are load-bearing strengths to protect.

**Version:** 1.0
**Created:** 2026-06-21
**Owner:** ROS CoS (delivery lead)
**Source:** Synthesized from the 6 ROS assessments (Org, Runtime, Autonomy, Memory, Observability, Multi-principal) + [`CoS/ROS-PRD.md`](ROS-PRD.md)
**Status:** Active delivery queue

> **Scoring:** `score = round(impact × 4 / effort)` using each assessment's impact/effort. Higher = do first.
> **Rule:** every item names the existing asset it `buildsOn` (or is flagged **NEW** + justified), an `owner`, and whether it is `humanGated`.
> Items are deduped across all 6 assessments; overlapping recommendations are merged into one (sources noted).

---

## 🎯 Top 10 — do first

| # | Item | Score | Owner | BuildsOn | Gated |
| :-: | :-- | :-: | :-- | :-- | :-: |
| 1 | **Git-derive freshness in `build-state.mjs`** (kill the header-gameable false-green) | **20** | CoS | `guy-command-center/build-state.mjs` (memoryDate) | No |
| 2 | **Mandatory write-back step on every scheduled loop** (ends the "not connected" disconnect) | **10** | CoS | `SCHEDULED-LOOPS.md` Rules + each `<DOMAIN>/MEMORY.md` | No |
| 3 | **Add a principal layer** (`/00_System/principals.md` + boot declares active principal) | **10** | CoS | root `MEMORY.md` People table + `identity-policy.md` + `AGENTS.md` boot | No |
| 4 | **Promote Stage-6 LEARN into the domain Definition-of-Done gate** (stop inter-session rot) | **10** | CoS | `agent-framework/UNIVERSAL-LOOP.md` DoD table | No |
| 5 | **Make EA client-specific by structure** (mandatory per-client `CONTEXT.md` as FRAME input + gate) | **8** | EA | `EA/mesh/MESH.md` + `EA/clients/{ABN,Coca-Cola}/` + `identity-policy.md` | No |
| 6 | **Promote `identity-policy.md` into the principal + confidentiality policy** (Guy↔Joseph boundary) | **8** | CoS | `00_System/identity-policy.md` (extend) | Yes |
| 7 | **Activate the 3 compounding read/write loops** (CC morning refresh, Weekly-Review prep, FIN deadline watch) | **10** | CoS | `SCHEDULED-LOOPS.md` proposed rows + `build-state.mjs` + `ros-conductor`/`fin-admin` | Yes |
| 8 | **Add `Reviewed:` heartbeat field** (distinguish "rotting" from "stable & confirmed") | **8** | CoS | `memory-archive-policy.md` + `build-state.mjs` | No |
| 9 | **Loops & Agents panel + `loops[]` in `state.json`** (answer "are my agents running?") | **7** | CoS | `index.html` drawDomains pattern + `state.json` + `SCHEDULED-LOOPS.md` | No |
| 10 | **Resolve the phantom `sync/` layer** (mark retired, strip dangling refs — anti-clutter) | **6** | CoS | `00_System/sync/` (keep `current-path-contract.md`) + `AGENTS.md` | Yes |

---

## Execution status — 2026-06-21

**Applied this session (no-gate foundation):** **#1 A1** git-derived freshness ✅ (verified — MKT correctly flips to STALE where the gamed header read fresh) · **#2 B1** loop write-back rule ✅ · **#3 C1** principal layer (`/00_System/principals.md` + AGENTS boot step) ✅ · **#4 A2** LEARN→DoD gate ✅ · **#5 D1** EA CONTEXT gate ✅ (per-client `CONTEXT.md` already existed; mesh now mandates them) · **#8 A3** `Reviewed:` heartbeat ✅.
**Applied this session (domain sharpening):** **D1** EA CONTEXT gate ✅ · **D2** HV deal-grade DD research lane ✅ (`HV/mesh/DD-brief-template.md` + `research-agent`) · **D3** HV `hv-execution` PM pod ✅ (Renovate/Rent/Refinance; `project-tracker`) · **KK runtime-aware** ✅ (MCP in Cowork, Hermes for crons) + tighter **top-3** triage.
**Gated — await Guy:** **#6** confidentiality-policy promotion · **#7** loop go-live · **#10** retire `sync/` · **C4** Joseph's send rail (credential).

**Update — 2026-06-22 (catch-up reconciliation, ros-evaluator):** Items verifiably shipped since the 2026-06-21 pass (evidence in-line):
- **Theme O (release engineering)** — PARTIAL. The *standard + docs + owner* are built (RELEASE-PIPELINE/CLAIM-REGISTER/GREEN-GATE, CoS Delivery mesh). **But the Arbor deploy was never wired onto them:** `cloudbuild.prod.yaml` still runs `gcloud run deploy` **without `--no-traffic`** → every push to `main` routes 100% traffic immediately. So O1 (kill blind-100%-to-`main`) is **NOT done in the deploy**, and the `arbor-auto-promote` "candidate promoter" was a **no-op** (no 0%-traffic candidate ever existed) — retired 2026-06-23. Corrected from the overclaim below. See Theme O block. ⚠️
- **Multi-company group OS** — built: `/00_System/companies.md` (9-entity register, Arbor = company #1, rules + promotion path) + `group-operating-model.md` + Arbor `COMPANY.md`. ✅
- **Daily epic-approval mechanism** — live: `/00_System/daily-execution-mechanism.md` (3 tiers A/B/C) + **`ros-daily-plan`** loop registered on `scheduled-tasks` MCP (`0 7 * * 1-5`, verified in SCHEDULED-LOOPS) writing `CoS/daily/PLAN-<date>.md` (PLAN-2026-06-22.md present). ✅
- **Backlogs de-duplicated** — `/00_System/release-engineering/BACKLOG-MODEL.md` collapsed 5 overlapping backlogs → 3 canonical queues (`AP-`/`AM-`/`ROS-`) + feeders with one-id-per-item lineage. ✅
- **Several scheduled loops now live** (corrects "only 2 live crons", below): `ros-daily-plan` (CoS), `arbor-cil-eval`, `arbor-cil-build`, `arbor-clinical-loop`, `arbor-product-council`, `arbor-marketing-loop`, `hv-weekly-digest`, `ros-cil-weekly` — all on the `scheduled-tasks` MCP (run while the workstation/app is up). (`arbor-auto-promote` was here too but is **retired 2026-06-23** — it was a no-op; see Theme O.) The two **Hermes** crons (`333eaf638d76` KK triage, `4fc75fbfad30` Career sourcing) remain the only Hermes-runtime jobs. **The ROS-CIL light/deep crons (N2) are still Proposed — Guy-gated.**

## Theme H — Agnostic / multi-runtime (NEW — Guy, 2026-06-21)

| Item | Score | Owner | BuildsOn | Gated |
| :-- | :-: | :-- | :-- | :-: |
| **H1. Codify agnostic principle + Gemini runtime** — done: `AGENTS.md` design principle + runtime registry (Gemini row), `connectors.md`, `principals.md`. | ✅ | CoS | `AGENTS.md` + `connectors.md` + `principals.md` | No |
| **H2. Agnostic tool-routing guidance** — a one-screen "which runtime/model for which job" rule (Claude=interactive/MCP · Codex=bulk edits · Gemini=gen/multimodal/large-context · Hermes=scheduled) so any session picks the best tool. | 8 | CoS | `AGENTS.md` runtime registry | No |
| **H3. Leverage Joseph's Gemini** — route Joseph-context generation/multimodal to his Gemini subscription. | 6 | EA | `principals.md` + `connectors.md` | Yes |
| **H4. Get-the-most audit** — per connected subscription (Claude/Codex/Gemini/Hermes/MCP), confirm it's used where it's strongest; close gaps. | 5 | CoS | `connectors.md` | No |

---

## Theme O — Release engineering (DevOps under CoS) (NEW — Guy, 2026-06-22)

**Why now (concrete trigger).** A 2026-06-22 session built 6 green Arbor items and tried to ship them, exposing that ROS has **no real release cycle**: Arbor auto-deploys *blind 100% to prod on push to `main`* (`arbor-deploy.yml`), `main` *moves under you* (concurrent agents push mid-deploy → rebase races), there is **no incremental promotion** (backlog → staging → canary → prod), **no feature/claim-level gating** (a clinical claim can only be gated by holding the whole change, not by flagging the one feature), and the regression bar is ad-hoc per session. Manual in-session deploys are the wrong tool — this capability must be **built**, owned by **DevSecOps under CoS**, so any mesh (Arbor first, then HV/EA tooling) can promote code safely and incrementally.

| Item | Score | Owner | BuildsOn | Gated |
| :-- | :-: | :-- | :-- | :-: |
| **O1. Incremental promotion pipeline** — backlog item → branch → **staging** → smoke/canary → prod, with healthz + rollback. Kill the blind-100%-to-`main` path. Generalizes the Arbor `PRODUCT-BACKLOG §2` OPS-net (healthz/smoke/canary/rollback/real-gate) into a reusable release flow. | 9 | DevSecOps (Arbor) → CoS | Arbor `PRODUCT-BACKLOG §2` OPS-A/B/D; `arbor-deploy.yml` | Yes (prod creds) |
| **O2. Feature- & claim-level release gating** — feature flags + a **claim register** so a single feature carrying a developmental/medical/effect-size claim is gated *independently* (ships dark, flipped only after Clinical Board + `arbor-safety` sign-off) without holding the rest of the wave. Directly serves the Arbor branding firewall (CHARTER §3 p10–11). | 9 | DevSecOps + Clinical Board | Arbor CHARTER firewall; Product Council `riskClass` | Yes |
| **O3. Regression-gated release cycle** — the green-gate (tsc · tests · framework · safety) as a *release gate* on every promotion, plus a per-release regression suite + a named cadence (not ad-hoc per session). Branch-must-be-current-with-`main` check to end rebase races. | 8 | DevSecOps | Arbor green-gate; CI workflows | No |
| **O4. Release ownership + cadence under CoS** — DevSecOps owns the release train; CoS holds the prod-promotion sign-off (Level 3) and tracks releases like any project (Green/Amber/Red). One release runbook, one dashboard row. | 6 | CoS | CoS portfolio oversight; `arbor-devsecops-lead` | No |

> **⚠️ STANDARD BUILT — DEPLOY NOT YET WIRED ONTO IT (corrected 2026-06-23).** The release *standard, docs, and owning mesh* exist (below), and REL-ARBOR-001 merged. **But the live Arbor deploy still bypasses the pipeline:** `cloudbuild.prod.yaml` runs `gcloud run deploy arbor-api` with **no `--no-traffic` and no candidate tag**, so every push to `main` goes **100% to prod immediately** — the blind-100%-to-`main` path is **NOT killed**. The `arbor-auto-promote` task that supposedly "promoted CI-green candidates" was a **no-op** (it looked for a 0%-traffic candidate that never exists) — retired. **O1 is the open work:** change the deploy to `gcloud run deploy --no-traffic --tag candidate` → smoke the candidate tag URL → gated promote → rollback. That makes the canary real; only then does an auto-promoter have a job. O2/O3/O4 (claim register, green-gate-as-release-gate, CoS ownership) stand as documented. Guy-gated (prod creds + deploy change). See [RELEASE-LEDGER.md](../00_System/release-engineering/RELEASE-LEDGER.md).
> - **The standard** (`/00_System/release-engineering/`): `RELEASE-PIPELINE.md` (O1 — incremental promotion: branch→full green-gate→canary-on-prod→smoke→gated promote→rollback; build-wide/merge-narrow concurrency lock kills the rebase race), `CLAIM-REGISTER.md` (O2 — feature flags + claim register; claim-bearing features ship dark, flipped per-claim after Clinical+Safety), `GREEN-GATE.md` (O3 — full gate as a release gate on every promotion + named per-product regression suites + cadence + firewall lint), and `BACKLOG-MODEL.md` (collapses the 5 overlapping backlogs → 3 canonical queues + feeders).
> - **The owner** (O4): the **CoS Delivery sub-mesh** (`CoS/delivery/MESH.md`) led by **`ros-release-lead`** (`.claude/agents/ros/ros-release-lead.md`), which *conducts* the product DevSecOps teams (it does not duplicate them); CoS holds the prod-promote sign-off (Level 3). Run a train: **`/ros-release`** (`.claude/workflows/ros-release.workflow.js`). Cadence loop = SCHEDULED-LOOPS *Release-train cadence* (proposed, Guy-gated).
> - **The code is queued, not hand-applied:** O1–O3 are *defined*; their Arbor implementation = Arbor `PRODUCT-BACKLOG §2` OPS-A/B/C/D + a `flags.ts` module, queued as **`REL-ARBOR-001`** in the [release ledger](../00_System/release-engineering/RELEASE-LEDGER.md) to ship *through* the new pipeline. The 6 green items (CI-13/06/12/07/08/05) on `claude/council-wave-1` (built off a stale `main`) rebase onto `rel/arbor/001` and ride the canary as the train's last bundle.
> - **Remaining (Guy-gated):** OPS-C1 WIF/IAM · prod-promotion sign-off · any claim flip. All surfaced in the ledger pre-flight.

---

---

# Next-Level Backlog (from [ROS-STRATEGY.md](ROS-STRATEGY.md)) — make it run like a 50-employee company

> Sequencing (gradual): **manage what exists (M)** → **the Standard (K)** → **Google-as-filesystem (J)** → **skills + tooling loops (I, L)**. Score = `round(impact×4/effort)`.

## Theme M — The management layer (CoS = COO)  *(do first)*
| Item | Score | I/E | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **M1. Wire the management cadence** — daily (cockpit + morning brief), weekly (cross-domain review, per-principal lanes), quarterly (OKRs). Make the conductor actually run it. | **10** | 5/2 | CoS | `ros-conductor` + `weekly-review`/`okr-tracker` skills + `SCHEDULED-LOOPS` | No |
| **M2. Cockpit = the management surface** — finish the Notion Command Center per-domain dashboards + a decisions-needed queue, per-principal (Guy/Joseph) lanes, and a loops/agents status panel. ONE cockpit (retire the local HTML or make it a mirror). | **8** | 4/2 | CoS | Notion Second Brain (`notion-second-brain/`) + `notion_database_registry.md` | Yes |
| **M3. OKRs per department** — quarterly objectives for each mesh; the conductor tracks Green/Amber/Red. | 6 | 3/2 | CoS | `okr-tracker` + `CoS/OKRs/` | No |
| **M4. "Nothing drops"** — every project has an owner + next action; loop write-back enforced (= B1). | 8 | 4/2 | CoS | `UNIVERSAL-LOOP` LEARN gate + Notion Projects DB | No |

## Theme K — The ROS Standard (tool-agnostic excellence + aesthetic)
| Item | Score | I/E | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **K1. Write the ROS Standard** — one doc: substance (correct/sourced/decision-ending) + house voice (executive/direct) + **aesthetic** spec (docs/decks/email/cockpit/Arbor UI). | **8** | 4/2 | CoS | `markdown-instruction-principles.md` + `impeccable`/`design` skills | No |
| **K2. Make the Standard a universal gate** — add "passes the ROS Standard" to every domain DoD; a self-review step before DELIVER. | **8** | 4/2 | CoS | `UNIVERSAL-LOOP` DoD | No |
| **K3. Aesthetic system** — reusable templates + tokens for the human-facing surfaces (Notion dashboards, exported docs, emails, the cockpit, Arbor). | 5 | 4/3 | CoS/MKT | `impeccable` + `theme-factory` + Arbor design system | No |

## Theme J — Google Workspace as the filesystem
| Item | Score | I/E | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **J1. Codify the 3-layer model** — Markdown=brain · Notion=cockpit · **Google Drive=files/deliverables** · Docs/Sheets=artifacts · Gmail/Calendar=comms/time. Into AGENTS.md + the filesystem contract. | **8** | 4/2 | CoS | `AGENTS.md` write-model + `agent-filesystem-contract.md` | No |
| **J2. Per-domain Drive structure** — canonical Drive folders per mesh (HV deals, EA clients, PAI, FIN docs); the file home for deliverables. | 6 | 4/3 | CoS | Drive MCP + Hermes Google OAuth | Yes |
| **J3. Deliverables as Google Docs/Sheets** — HV IC memos, EA HLDs, FIN models produced into Drive (premium-formatted), indexed in ROS + status in Notion. | 6 | 3/2 | each mesh | Drive/Docs MCP + the ROS Standard | Yes |
| **J4. Wire Drive MCP into the meshes** — KK/HV/EA/FIN/PAI read/write their Drive folders (not just local). | 6 | 3/2 | CoS | `connectors.md` Drive (live MCP) | No |

## Theme I — Skill capitalization (most-relevant, not all)
| Item | Score | I/E | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **I1. Per-mesh skill registry** — the few best skills/tools per agent (Claude skills + Hermes skill catalog + MCP), in each `MESH.md`. Select, don't accumulate. | **8** | 4/2 | CoS | each `MESH.md` "Skills" table + Hermes skills catalog | No |
| **I2. Map the Hermes skill catalog → meshes** — research/workspace-agents/workspace-dispatch/note-taking/social-media/etc. to the right domain. | 5 | 3/2 | CoS | `/home/guyru/.hermes/skills` + `connectors.md` | No |

## Theme L — Tooling & Skills continuous-evaluation loop
| Item | Score | I/E | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **L1. Tooling-eval loop** — scheduled read+report: what's used / underused / missing / new in the ecosystem; proposes adopt/drop. (CIL pattern for capability.) | 6 | 4/3 | CoS | the CIL pattern + `SCHEDULED-LOOPS` + `research-agent` | Yes |
| **L2. Acquisition + new-input ingestion** — discover→evaluate→adopt the right tools/skills; `research-agent` feeds new relevant market/tool inputs. OAuth/skill-install stays human-gated. | 5 | 3/2 | CoS | `research-agent` + `connectors.md` | Yes |

## Theme N — Self-improvement engine (ROS-CIL) ✅ built
| Item | Score | Owner | BuildsOn | Gated |
| :-- | :-: | :-- | :-- | :-: |
| **N1. ROS-CIL built** — company-wide self-improving loop: `/00_System/agent-framework/ROS-CIL.md` + lead `ros-evaluator` + workflow `/ros-improve` (light/deep). Audits freshness/management/reality/domains/standard/tooling → scores+verifies → ROS-BACKLOG + State of the Company → safe fixes; human ships gated. | ✅ | CoS | the Arbor CIL pattern + the agent framework | No |
| **N2. Turn the ROS-CIL crons live** — weekly-light + monthly-deep on Hermes. | 8 | CoS | `SCHEDULED-LOOPS.md` | Yes |
| **N3. First deep run** — produce the first real "State of the Company" + fix wave. | ✅ | CoS | `/ros-improve mode:"deep"` | No |

---

## Theme A — Stop the memory rot

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **A1. Git-derive freshness in `build-state.mjs`** — replace header read with `git log -1 --format=%cs`; header stays a human label. ~15 lines. *(Top 10 #1)* | **20** | 5/1 | CoS | `build-state.mjs` (memoryDate, ~L42-46) | No |
| **A2. Promote Stage-6 LEARN into the DoD gate** — add "memory write/heartbeat recorded" as a mandatory line in every domain DoD; a lead can't report a frame done without it. *(Top 10 #4)* | **10** | 5/2 | CoS | `UNIVERSAL-LOOP.md` DoD-by-domain table | No |
| **A3. Add a `Reviewed: YYYY-MM-DD` heartbeat** — `staleDays = today − max(last-commit, Reviewed)`; quiet FIN reads green after review, HV with uncommitted work reads red. *(Top 10 #8)* | **8** | 4/2 | CoS | `memory-archive-policy.md` (Append format) + `build-state.mjs` | No |
| **A4. Turn the Monday hygiene cron into a remediation loop** — run `build-state.mjs`, then dispatch each git-stale domain's lead to a SENSE→LEARN refresh and open a **draft commit**. Workspace-write only. | **7** | 5/3 | CoS | live cron `bc55de81f9f1` + `build-state.mjs` + `/.claude/agents/ros/` leads | Yes |
| **A5. Wire `session-audit` to fire automatically** — Stop-hook in `settings.json` after meaningful ROS file changes, so learnings get written before context is lost. | **5** | 4/3 | CoS | `session-audit.md` + `.claude/settings.json` hooks | Yes |

---

## Theme B — Unify the two runtimes

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **B1. Mandatory write-back on every scheduled loop** — each loop appends a dated one-liner to its owning `MEMORY.md` (+ `state.json` findings). Level-2 workspace-write, no new grant. The single fix that ends the disconnect. *(Top 10 #2)* | **10** | 5/2 | CoS | `SCHEDULED-LOOPS.md` Rules + each `<DOMAIN>/MEMORY.md` + `build-state.mjs` precedent | No |
| **B2. Define runtime division-of-labor as a one-screen table in `AGENTS.md`** — Hermes = scheduled write-back loops + Telegram; Claude = interactive + MCP + meshes; Codex = bulk edits; filesystem is the only handoff. | **8** | 4/1 | CoS | `AGENTS.md` runtime registry + `connectors.md` "Runtime reality" | No |
| **B3. One verifiable schedule registry + loop run-ledger** — reconcile `list_scheduled_tasks` (Claude) + Hermes `crontab -l` into `SCHEDULED-LOOPS.md` with last-verified date; append-only ledger (last-run/next-run/found/shipped) so the kill-switch rule is enforceable. *(merges Runtime + Autonomy recs)* | **6** | 4/2+3/2 | CoS | `SCHEDULED-LOOPS.md` + `scheduled-tasks` MCP + Hermes cron + `state.json` | No |
| **B4. Resolve the phantom `sync/` layer** — mark `MERGE-...PUSH.md` plan retired, strip dangling refs; keep `current-path-contract.md` as the core. Do NOT rebuild the plugin. *(Top 10 #10)* | **6** | 3/2 | CoS | `00_System/sync/` + `AGENTS.md` write-model | Yes |
| **B5. Descope the AGENT-SYNC actionQueue drainer** — mark voice/queue parts explicitly future-scope (nothing fills the queue). Anti-over-promise; revisit only when a real voice input exists. | **3** | 2/3 | CoS | `AGENT-SYNC.md` actionQueue + verb registry | Yes |

---

## Theme C — Serve Joseph (multi-principal)

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **C1. Add a principal registry + active-principal boot** — `/00_System/principals.md` (accounts, default domains, privacy class, ownership) + one line in `AGENTS.md` boot to declare/confirm active principal. Keystone for everything else. *(merges Org + Multi-principal recs; Top 10 #3)* | **10** | 5/2 | CoS | root `MEMORY.md` People table + `identity-policy.md` + `AGENTS.md` boot | No |
| **C2. Promote `identity-policy.md` into principal + confidentiality policy** — which domains are Guy-private / Joseph-private / shared; non-negotiable "never surface one principal's private domain in the other's session." Extends EA client-vs-client gate to the principal axis. *(Top 10 #6)* | **8** | 5/2 | CoS | `identity-policy.md` (extend) | Yes |
| **C3. Tag every domain mesh + routing entry with an owner-principal** — add owner/shared attribute to `routing.md` matrix + each `MESH.md` header so routing picks default identity and a mesh refuses wrong-principal exposure. | **8** | 4/2 | CoS | `routing.md` matrix + each `<DOMAIN>/mesh/MESH.md` Owner header | No |
| **C4. Unblock Joseph's outbound identity + reconcile the status contradiction** — populate Himalaya app password for `josephdoronrubin`, confirm MCP Gmail, set one source-of-truth status (resolves `identity-policy.md` "blocked" vs `connectors.md` "Active"). | **8** | 4/2 | FIN | `connectors.md` + `identity-policy.md` Gmail registry | Yes |
| **C5. Give Joseph an entry surface in EA + FIN meshes** — add a short "Principals" note to each (requesting principal, default sending account, pointer to confidentiality policy) so a Joseph-led session behaves correctly without a new mesh. | **6** | 3/2 | EA | `EA/mesh/MESH.md` + `EA/CLAUDE.md` + `FIN/mesh/MESH.md` + `FIN/CLAUDE.md` | No |
| **C6. Multi-principal loops** — parallel read-only morning brief over `josephdoronrubin@gmail.com` (EA) + his FIN slice; reuses existing triage machinery, second delivery target. | **6** | 3/2 | EA | live loop `333eaf638d76` + `identity-policy.md` + FIN deadline-watch loop | No |

---

## Theme D — Sharpen weak teams: EA / HV / KK

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **D1. Make EA client-specific by structure** — mandatory per-client `EA/clients/[client]/CONTEXT.md` (estate, stakeholders, in-flight decisions, decision log) as FRAME-step input + the gate's first check. Agent becomes client-specific by context, not a new agent. *(Top 10 #5)* | **8** | 4/2 | EA | `EA/mesh/MESH.md` + `EA/clients/{ABN,Coca-Cola}/` + `EA/MEMORY.md` | No |
| **D2. Give HV a deal-grade DD research lane** — HV dispatches shared `research-agent` with an HV DD-brief template (comps, area trajectory, vendor vetting, WWS/regulation) and owns synthesis into the IC memo. Muscle becomes HV's, research stays KK-owned. | **6** | 3/2 | HV | `HV/mesh/MESH.md` + `KK/research/MESH.md` (research-agent) + **NEW** DD-brief template | No |
| **D3. Add an HV deal-execution (PM) pod `hv-execution`** — owns Renovate/Rent/Refinance: renovation milestones, vendor follow-through, permit status, refinance coordination; writes to orphaned `HV/06_Renovation`, `07_Financing`, `08_Vendors`; uses `project-tracker` skill as engine. | **5** | 4/3 | HV | `HV/mesh/MESH.md` (add pod) + `project-tracker` skill + `HV/06,07,08` | No |
| **D4. Upgrade 08:30 morning routing into a synthesized daily operating brief** — widen the inbox-only triage to also read calendar + Notion tasks + per-domain `MEMORY.md` "Next:" lines (same sources `build-state.mjs` parses). Read-only, no grant. | **4** | 4/2 | KK | live loop `333eaf638d76` + `build-state.mjs` parsers + Calendar/Notion MCP | No |
| **D5. Allow within-client EA fan-out** — permit `ea-lead` to fan out same-client sub-tasks (parallel current-state review per practice area, control-matrix population, evidence gathering), modeled on `hv-sourcing` batch pattern; cross-client leakage still forbidden. | **4** | 3/3 | EA | `EA/mesh/MESH.md` (roster guidance) + `arbor-mesh` fan-out pattern | No |
| **D6. Reconcile HV folder schema** — collapse competing numbering (`02_Areas`/`02_Sourcing`, `03_Analysis`/`03_Deals`/`deals/`) to the `HV/CLAUDE.md` file map. Foundation housekeeping. | **4** | 2/2 | HV | `HV/CLAUDE.md` file map + `HV/` tree | No |

---

## Theme E — Autonomy loops

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **E1. Activate the 3 compounding read/write loops** — CC morning refresh (`node build-state.mjs`), Weekly-Review prep (Fri), FIN deadline watch. Refresh gets Level-2 workspace-write; review/watch stay read-and-report. Kills "dashboard wasn't fed." *(merges Autonomy + Memory + Observability recs; Top 10 #7)* | **10** | 5/2 | CoS | `SCHEDULED-LOOPS.md` proposed rows + `build-state.mjs` + `ros-conductor`/`fin-admin` | Yes |
| **E2. Confirm Arbor CIL nightly-eval + weekly-build crons** — activate the sanctioned autonomous mode (critic→score→verify→build-to-green→human ships); never auto-merges, never auto-builds gated classes. | **8** | 4/2 | PAI | `CIL.md` cadence + `arbor-improve.workflow.js` + `SCHEDULED-LOOPS.md` Arbor rows | Yes |
| **E3. Activate HV Deal Radar loop** — feed the pipeline (read-and-report; pairs with B1 write-back). | **8** | 4/2 | HV | `SCHEDULED-LOOPS.md` HV Deal Radar (proposed) + `build-state.mjs` | Yes |
| **E4. Build the ROS-wide self-improvement loop ("ROS-CIL")** — generalize the Arbor CIL over the OS: critic→backlog→fix on stale memory, broken routing, doc drift, dead skills. Reuse `arbor-improve.workflow.js` shape; re-scope `bc55de81f9f1` as the eval stage, add the build half (fixes on a branch). Nightly eval + weekly build, same gates. The biggest structural move. | **5** | 5/4 | CoS | `CIL.md` + `arbor-improve.workflow.js` + cron `bc55de81f9f1` + `ros-hygiene-runbook.md` | Yes |

---

## Theme F — Cockpit (observability)

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **F1. Loops & Agents panel + `loops[]` in `state.json`** — id/owner/cadence/lastRun/nextRun/status/lastResult rendered green/amber/red, seeded from `SCHEDULED-LOOPS.md`. Direct cure for "are my agents running?" *(Top 10 #9)* | **7** | 5/3 | CoS | `index.html` drawDomains pattern + `state.json` + `SCHEDULED-LOOPS.md` | No |
| **F2. Decisions-Needed queue** — scrape "Needs Guy / BLOCKER / blocked-on / gated" from domain + mesh memory into `decisions[]` (text, domain, **owner: guy/joseph/shared**, age, safety level); render as top card. What a CEO cockpit must show. | **7** | 5/3 | CoS | `state.json` actionQueue concept + `build-state.mjs` (rootNextFor) + CoS "Decisions needed" mandate | No |
| **F3. Extend `build-state.mjs` to stamp loop run/status + render orphaned `arborPulse`** — populate `loops[].lastRun/status`; draw `arborPulse` on the PAI card (currently written, never rendered). | **8** | 4/2 | CoS | `build-state.mjs` (writes arborPulse + freshness) + `index.html` | No |
| **F4. Make the cockpit multi-principal** — principal field on domains/clients/tasks/decisions/loops + Guy/Joseph/All topbar toggle; re-title to **"Rubin OS Command Center."** One dashboard, filtered — never fork. | **5** | 4/3 | CoS | `index.html` + `state.json` clients[].owner + `identity-policy.md` | No |
| **F5. Make CC morning refresh live** — schedule `build-state.mjs` weekday mornings (read+workspace-write). *(Implemented by E1; tracked here for the cockpit-freshness outcome.)* | **6** | 3/2 | CoS | `SCHEDULED-LOOPS.md` CC morning refresh + `build-state.mjs` | Yes |
| **F6. Runtime heartbeat strip** — track `meta.updatedBy` (claude/hermes/dashboard) as last-seen per writer: "Hermes ✓ 2h ago · Claude ✓ now." Makes the dual-runtime architecture observable. | **6** | 3/2 | CoS | `AGENT-SYNC.md` write protocol + `state.json` meta + `index.html` drawSync | No |

---

## Theme G — Prove the org

| Item | Score | Impact/Effort | Owner | BuildsOn | Gated |
| :-- | :-: | :-: | :-- | :-- | :-: |
| **G1. Activate one domain loop per mesh + freshen memory** — turn on lowest-risk read-only loops (HV Deal Radar, FIN deadline watch, CC refresh), each ending by writing its `MEMORY.md` (Principle 7). Converts paper meshes into a running org. *(overlaps E1/E3 + B1; sequence behind principal + EA/HV fixes)* | **8** | 4/2 | CoS | `SCHEDULED-LOOPS.md` proposed loops + `build-state.mjs` | Yes |
| **G2. Add Conductor Guy-lane / Joseph-lane** — `ros-conductor` reports priority per principal in the weekly review, not just "Guy's goals / Guy's time." *(depends on C1)* | **6** | 3/2 | CoS | `CoS/mesh/MESH.md` + `principals.md` | No |

---

## Prune / consolidate (remove clutter)

| Clutter | Action | Why |
| :-- | :-- | :-- |
| **Phantom `sync/` implementation** (`MERGE-CLAUDE-WORK-INTO-HERMES-PUSH.md` advertises HLD/ADRs/scripts/hermes-plugin that don't exist on disk) | Mark plan **SUPERSEDED/retired**, strip dangling references; keep only `current-path-contract.md`. *(B4)* | Map doesn't match territory — itself a source of the "mess" feeling. Do NOT resurrect the plugin (constitution forbids parallel systems). |
| **AGENT-SYNC voice→actionQueue drainer** | Explicitly mark **future-scope**; do not instrument. *(B5)* | Nothing fills the queue; instrumenting a drainer for an empty queue is over-promise clutter. |
| **Header-derived freshness** (`Last updated:` line) | Demote to a human label; git becomes the source of truth. *(A1)* | Gameable false-green (MKT shows 0d while only committed memory is the initial import). |
| **Empty/duplicate HV folders** (`02_Sourcing`, `03_Analysis`, bare `deals/`, `04_Assets` empty; competing numbering) | Reconcile to `HV/CLAUDE.md` map; delete dead empties. *(D6)* | Filesystem contradicts the team's own filesystem contract. |
| **Second dashboard / second scheduler / rebuilt sync framework** | **Never build.** Extend the one cockpit (filtered), one schedule registry, git + connectors for coordination. | Explicit PRD non-goal; the anti-clutter constraint. |

---

## Sequencing (per PRD §closing)

1. **Foundations (no-gate, highest score):** A1 → A2 → A3 (honest freshness + gate) ‖ C1 → C2 → C3 (principal layer) ‖ D1 (EA fix)
2. **Connect the runtimes:** B1 (write-back) → B2 → B3 → B4/B5 (prune)
3. **Activate loops:** E1/E3 + G1 (read/write loops feed the now-correct structure) → E2 (Arbor CIL) → D4
4. **Cockpit company-layer:** F1 → F2 → F3 → F6 → F4 (multi-principal) → A4 (remediation loop) → A5
5. **The big move:** E4 (ROS-CIL) last — it improves a structure that the earlier steps made correct.

*Built entirely on existing ROS assets. No item invents a parallel system; the only NEW files are `/00_System/principals.md` (C1) and an HV DD-brief template (D2), both justified above.*
