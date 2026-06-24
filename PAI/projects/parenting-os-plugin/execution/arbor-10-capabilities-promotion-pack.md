# Arbor 10-Capability Build — PROD-PROMOTION DECISION PACK

**Owner:** `ros-release-lead` (CoS Delivery) · **For:** Guy / CoS sign-off · **Date:** 2026-06-23
**Status:** PLANNING DOC — nothing pushed, merged, deployed, or flagged. This pack tells Guy/CoS **if and how** the 10 capabilities reach prod. No action taken.
**Branch under build:** `claude/arbor-10-capabilities` (workflow `wf_23661c90-2f8`, app repo `PPPPtherapy-/`, **actively editing — not touched by this pack**).

> **One-line verdict:** This whole wave is **CEO-LOCKED behind store launch** (CEO Decision #1, 2026-06-23). Nothing here promotes until the app is live in the stores (AP-061..AP-064). Once that gate lifts, the **safe architecture spine (CI-31 → CI-27 → CI-28/29 → CI-30/31)** can ride the pipeline to prod **dark**, while the **clinically-gated developmental tracks (CI-24/25/32/33/34)** wait on the Clinical Board on the strings — they ship dark or not at all until each gate clears. Promote (canary→100%) is always Guy's Level-3 call; green-gate and canary-green are necessary, not sufficient.

---

## 0. Scope — what "the 10 capabilities" are

The build in flight is the **Developmental Framework v2 + Architecture-Spine intake** (PRODUCT-BACKLOG.md §Council intakes, 2026-06-23). The 10 capabilities, with reserved promotion IDs:

| CI | Reserved AP | Title | riskClass | Score |
|----|----|----|----|----|
| **CI-25** | AP-070 | Neurodiversity-Aware Observation Lens (NOT a risk map) | gated (highest clinical sensitivity) | 5.6 |
| **CI-26** | — (umbrella) | Full 0–12 Age-Architecture continuation | gated (per-band peds sign-off) | 4.8 |
| **CI-27** | AP-071 | Developmental Capability Graph + Admin/Seed Tool (architecture spine) | gated (clearable; screenModelOutput condition) | 9.8 |
| **CI-28** | AP-072 | Goal Builder + Parent-Concern→Goal Spine | gated (ChildProfile schema; child-data) | 8.8 |
| **CI-29** | AP-073 | Activity Personalization / Interest Theme-Substitution | gated (LLM cost + child-data) | 7.6 |
| **CI-30** | AP-074 | Daily Plan Generator ("best 15-min activity today") | gated (composes 27+28+29) | 7.2 |
| **CI-31** | AP-075 | Duration / Energy-Level Variants (sessionLength param) | **safe** | 7.0 |
| **CI-32** | AP-076 | Daily Living Routines Domain (Domain F) | gated (swallow-safety HARD condition; new child-data) | 6.1 |
| **CI-33** | AP-077 | Motor & Sensory Domain (Domain E) | gated (sensory label-leak) | 5.4 |
| **CI-34** | AP-078 | Social Play & Imagination Domain (Domain B, safe-10 subset) | gated (sensitive-3 exclusion) | 4.6 |

> **`LANG-15`** (named in the tasking) **does not exist as a backlog ID** in PRODUCT-BACKLOG.md or the mesh. Treated as a **placeholder** for a localization-clinical pass (native HE/RTL review of any clinically-gated string — the `arbor-localization` native-voice gate stacked on the Clinical Board gate). It is listed below in the matrix as a cross-cutting gate, not a capability. **Confirm with Council before relying on it.**
>
> **Build-state placeholder:** the branch `claude/arbor-10-capabilities` is **mid-edit** and not readable from this pack's git context (nested app repo, working tree held by the live workflow). Every "what actually landed on the branch" cell below is marked **[PLACEHOLDER — confirm against the branch once `wf_23661c90-2f8` reports done]**. This pack defines the *gates each capability must clear*; the branch must then *prove* it cleared them via the green-gate.

---

## 1. Promotion ladder — green branch → prod (with the human STOP points)

Mapped to `00_System/release-engineering/RELEASE-PIPELINE.md` stages 0–9. The **store-launch gate** is a doctrine pre-stage that sits *before* stage 1 for this wave.

```
[ STORE-LAUNCH GATE ]  ← CEO Decision #1. No CI-27+ build PROMOTES until app is live in stores (AP-061..AP-064).
        │                 STOP #0 (Guy/CoS): confirm store launch shipped → lifts the gate for the SAFE spine only.
        ▼
0 READY      each capability scored, owned, riskClass-tagged; any claim it carries has a CLAIM-REGISTER row.
        │     Gated items are NOT ready until their Clinical/COPPA gate clears on the real strings.
        ▼
1 TRAIN      ros-release-lead bundles READY items into REL-ARBOR-<n>; claims the merge-lane lock in RELEASE-LEDGER.
        │     (Lane is currently FREE; queue holds REL-ARBOR-003 mobile-store FIRST, then 004/005/006 redesign.)
        ▼
2 BRANCH     cut rel/arbor/<n> off CURRENT origin/main; rebase claude/arbor-10-capabilities onto it. Build wide, parallel.
        ▼
3 GREEN-GATE FULL gate in CI on the branch: tsc · vitest · check:framework · eval:safety · build · regress:arbor · coverage
        │     + the FIREWALL LINT (fails on any unregistered/forbidden claim string).
        ▼
4 MERGE      Branch-current check: branch must be 0 behind origin/main → else rebase + re-gate. Only the lock-holder merges.
        │     Re-gate green on main.
        ▼
5 CANARY     Cloud Run revision deployed `--no-traffic --tag candidate`. 0% live traffic. Hosting to a preview channel.
        ▼
6 SMOKE      post-deploy-smoke against the candidate tag: `/` liveness (healthz 404-in-prod still open — see ledger),
        │     1.5 MB payload ≠ 413, one authed render > 0. Non-zero ⇒ STOP → auto-rollback.
        ▼
7 PROMOTE    ★ STOP #1 — CoS PROD-PROMOTION SIGN-OFF (Level 3, Guy). canary→100% on approval; auto-rollback on withhold.
        │     Everything ships DARK here (all 10 behind build-OFF flags). Promote = code in prod, invisible to users.
        ▼
8 FLAGS/CLAIMS ★ STOP #2 — per-flag flip. A safe flag (CI-31) flips on Guy's promote authority. A claim/child-data flag
        │     (CI-24/25/32/33/34) flips ONLY when its CLAIM-REGISTER row is signed by Clinical + Safety — itself Level 3.
        ▼
9 CLOSE      ledger → shipped + REL- id; backlog item `shipped`; product MEMORY.md write-back; lane released.
```

**The three human STOP points:**
- **STOP #0 — Store launch lifts the gate** (Guy/CoS). The whole wave is held behind it. Lifting it for the *safe spine* does not lift it for the *gated tracks*.
- **STOP #1 — Prod-promote sign-off** (Guy, Level 3). Green-gate + canary-green are the precondition, not the decision.
- **STOP #2 — Flag flip** per capability (Guy + Clinical + Safety for gated; Guy for safe). A flip that exposes a claim or child-data surface is its own Level-3 event.

> Iron rule (inherited): the only path to prod is branch → CI gate → merge → CI deploy → canary → smoke → gated promote. **No hand-run `gcloud run deploy` / `firebase deploy`.** No blind 100% cutover.

---

## 2. Per-capability gate matrix

`Must clear` = the binding gate *before this capability can SHIP (dark)* and, separately, *before its flag can FLIP (live)*. Flag names are suggestions to register; each ships **dark, default OFF, fail-closed**.

| Capability | riskClass | Must clear before MERGE/dark-ship | Must clear before FLAG-FLIP (live) | Suggested flag |
|---|---|---|---|---|
| **CI-27** Capability Graph + Seed Tool | gated→**spine** | green-gate; `screenModelOutput` bound on every AI-authored node string + passing `outputScreen.test.ts`; arbor-safety reviews the screen-wiring; arbor-clinical-lead confirms schema carries no implicit diagnostic framing; `prohibitedDiagnosticClaims[]` non-empty on every gen-eligible node | n/a — **infra, no user-facing claim** (graph data + selector resolution). No flag flip needed; ships behind `feat.graph.capability-graph` for blast-radius control | `feat.graph.capability-graph` |
| **CI-28** Goal Builder + Concern→Goal | gated (child-data) | green-gate; **arbor-safety COPPA review on `ChildProfile.activeGoals` write path**; arbor-clinical-lead copy pass on the curated goal-label list (no condition-name anchors) | clinical-lead signs the goal-label strings; COPPA cleared on the write path | `feat.goals.builder` |
| **CI-29** Interest Personalization | gated (child-data + LLM cost) | green-gate; arbor-safety COPPA on `interests[]` write path; **arbor-ai cost estimate** on the substitution path (CIL §2 cost gate) | COPPA + cost-cap cleared; no new claim string | `feat.activity.interest-personalization` |
| **CI-30** Daily Plan Generator | gated (composes 27+28+29) | green-gate; **blocked until CI-27+CI-28+CI-29 are merged + gate-cleared**; no separate clinical gate provided it stays inside CI-27's output-floor | inherits CI-27/28/29 flips; generator flag flips only after its three inputs are live | `feat.dailyplan.generator` |
| **CI-31** Duration / Energy Variants | **safe** | green-gate only (additive selector param, no new child-data, no clinical framing) | **none** — safe; flips on Guy's promote authority | `feat.activity.duration-variants` |
| **CI-24** FeelingsLab personalized layer | gated (child mental-health-adjacent data) | green-gate; **generic-6-emotion UI only, NO Zones, NO child-facing intensity**; anxiety surface fully dropped; fire-once escalation copy verbatim + ≥90d cool-down + guard test; `screenModelOutput` covers `anxiety/depression` label-leaks + test; **arbor-clinical-psych + arbor-safety co-sign**; COPPA on the emotion check-in write path | psych + safety sign the exact strings + escalation copy; CLAIM-REGISTER row signed | `feat.feelingslab.personalized` + `claim.coreg-mechanism` |
| **CI-25** Neurodiversity Observation Lens | gated (**highest clinical sensitivity**) | green-gate; **arbor-clinical-lead full veto-lift on EVERY prompt / cluster label / routing string**; zero condition naming/rank/probability; arbor-safety COPPA on observation-log write path; **prerequisite: CLI-03 + CLI-07 live first** | clinical-lead signs every indicator + routing string; COPPA cleared; CLAIM-REGISTER row signed | `feat.neurodiversity.observation-lens` + `claim.provider-routing` |
| **CI-32** Daily Living Routines (Domain F) | gated (new child-data) | green-gate; **HARD CONDITION: swallow-safety interrupt above the feeding-exposure ladder implemented + green-tested** (board recommend-veto without it); #67 under-1 safe-sleep guard; arbor-clinical-lead + peds + slp full copy pass; COPPA on sleep/feeding/toilet logs | clinical tri-lens signs feeding/sleep/toilet copy; swallow-safety test green; COPPA cleared | `feat.domain.daily-living` |
| **CI-33** Motor & Sensory (Domain E) | gated (label-leak) | green-gate; **no "sensory profile"/"sensory seeker" (SPD-screen line)**; arbor-clinical-lead + slp copy pass on sensory-log + motor `observableSignals`; COPPA on sensory-preference write path | clinical-lead + slp sign the sensory/motor strings; COPPA cleared | `feat.domain.motor-sensory` |
| **CI-34** Social Play (Domain B, safe-10) | gated (sensitive-3 boundary) | green-gate; **lint asserts the sensitive-3 (joint attention / imitation / perspective-taking) are ABSENT**; CI-25 routing boundary finalized; arbor-clinical-psych copy pass on all 10 node strings | clinical-psych signs the 10 node strings; CI-25 boundary live | `feat.domain.social-play` |
| **CI-26** 0–12 Architecture umbrella | gated (per-band) | green-gate; **per-band arbor-clinical-peds threshold sign-off on each net-new age band**; references AP-031/033/034/CLI-07 — only genuinely net-new bands added | each band individually gated; no scored output ever | `feat.architecture.age-bands` (per-band sub-flags) |
| **`LANG-15`** *(placeholder)* | cross-cutting gate | n/a — not a capability | `arbor-localization` native HE/RTL review stacked on the Clinical Board sign-off for any gated string shipping in Hebrew | — |

**Cross-cutting (applies to every gated row):** the GREEN-GATE **firewall lint** fails the merge on any forbidden string (`clinically validated/reviewed/approved`, `doctor-approved`, any branded program — Triple P / Incredible Years / PCIT / Hanen / ESDM / DIR / Zones / Orton-Gillingham — any condition name, any effect-size verb on a child capacity). Forbidden strings **never get a flag** (CLM-FORBIDDEN is a hard fail, not a gateable item). See CLINICAL-GUARDRAILS-CI-22-23-24.md §2 build-pod checklist.

---

## 3. The ordering — what promotes first

Two tracks, one constraint: **everything is behind store launch.**

### Track A — the SAFE / ARCHITECTURE SPINE (promotes first, once store launch lifts the gate)
Ships **dark**, no Clinical Board dependency on user-facing claim strings (CI-27 is infra; CI-31 is a selector param):

```
1. CI-31  Duration Variants        ← safe, standalone, no dependency. The cheapest first promote.
2. CI-27  Capability Graph + Seed  ← architecture moat. Gate = screenModelOutput wiring + test (engineering, not Board copy).
                                      CI-20/CI-21 content seeds the first ~15 nodes.
3. CI-28  Goal Builder             ← HoP's first vertical slice. Gate = COPPA on activeGoals + goal-label copy pass (fast, front-loaded).
   CI-29  Interest Personalization ← parallel with CI-28. Gate = COPPA on interests[] + arbor-ai cost cap.
4. CI-30  Daily Plan Generator     ← LAST of the spine. Blocked until 27+28+29 are merged + gate-cleared.
```
**Why first:** these unblock the whole roadmap (CI-27 is the spine for CI-30/32/33/34), carry **no user-facing developmental claim** (or only a fast clinician copy pass for CI-28's labels), and ride the pipeline to prod dark with low blast radius. CI-27 + CI-28 are the highest-leverage single slices in the set (9.8 / 8.8).

### Track B — the CLINICALLY-GATED DEVELOPMENTAL TRACKS (wait on the Clinical Board, on the strings)
Each holds at READY (stage 0) until its Board/COPPA gate clears on the **actual strings that exist on the branch** — per CLINICAL-GUARDRAILS, "nothing is cleared until the actual copy exists and passes a final board review":

```
CI-24  FeelingsLab        ← psych + safety co-sign (most safety-sensitive: child inputs emotion data).
CI-32  Daily Living       ← swallow-safety interrupt is a HARD build-condition (board recommend-veto without it).
CI-33  Motor/Sensory      ← sensory label-leak gate (slp + clinical-lead).
CI-34  Social Play        ← sensitive-3 exclusion lint + CI-25 routing boundary.
CI-25  Neurodiversity Lens← HIGHEST gate: full clinical-lead veto-lift on every string; needs CLI-03 + CLI-07 live first.
CI-26  Age-architecture   ← per-band peds sign-off, band by band.
(+ LANG-15 placeholder: native HE/RTL review stacked on each of the above when shipped in Hebrew.)
```
**Why they wait:** each carries a developmental framing, a child-data write path, or both. They can **merge + canary + promote DARK with the safe spine** (the wave is never held hostage to a claim — RELEASE doctrine §decoupling), but the **flag stays OFF** until Clinical + Safety sign the exact strings. If a gate never clears, the feature stays dark indefinitely — no re-deploy, no held wave.

---

## 4. Claim / feature-flag register additions

Add these rows to `00_System/release-engineering/CLAIM-REGISTER.md` **before** the carrying surface can ship the claim (the firewall lint enforces "no claim without a row"). All start `drafted`, default flag OFF, fail-closed.

| Proposed Claim ID | Surface | Claim string (verbatim, to be authored on the branch) | Flag | riskClass | State |
|---|---|---|---|---|---|
| **CLM-006** | CI-25 Observation Lens — provider-routing brief | "worth raising with your pediatrician or an SLP" (CDC surveillance voice; **zero condition naming/rank/probability**) | `claim.provider-routing` | gated-claim | **drafted** — clinical-lead full veto-lift required on every routing string |
| **CLM-007** | CI-24 FeelingsLab — escalation + strategy cards | the fire-once escalation copy (verbatim, CLINICAL-GUARDRAILS CI-24 §3) + "emotion-coaching grounded in co-regulation research" (mechanism, no effect size) | `claim.coreg-mechanism` | gated-claim (crisis-adjacent) | **drafted** — psych + safety co-sign every string |
| **CLM-008** | CI-23/CI-32 coaching-track provenance *(if CI-23 strings appear in this wave)* | "a structured practice approach grounded in cited CDC/AAP/ASHA/WHO guidance" (provenance, **no branded name, no effect claim**) | `claim.track-provenance` | gated-claim | **drafted** — clinical-lead reviews scripts **and citation list**; UNSUBSTANTIATED if any branded/efficacy string appears |
| **CLM-009** | CI-32 Daily Living / CI-33 Motor / CI-34 Social — domain copy | "parent-observed [domain] skills, grounded in AAP and developmental research" (mechanism; **never** "CDC milestones" on 6–10 surfaces — no CDC anchor exists past age 5) | shares `claim.dev-informed` (CLM-001) | gated-claim | **drafted** — per-domain clinical copy pass |
| **CLM-010** *(placeholder)* | Any of CLM-006..009 in Hebrew | native HE transcreation of the above (**LANG-15**) | per parent claim | gated-claim | **drafted** — `arbor-localization` native review **on top of** Board sign-off |

**No new forbidden strings introduced** — CLM-FORBIDDEN already covers `clinically validated/reviewed/approved`, branded programs, condition names, effect-size verbs. The firewall lint will fail the gate if any appear on the branch. **CI-27/28/29/30/31 carry no claim row** (infra + selector params + curated non-clinical labels) — they ship dark behind `feat.*` flags for blast-radius only, not behind a claim gate.

---

## 5. The CEO decisions this pack surfaces (Guy, Level 3+)

1. **Confirm store launch has shipped — lift the gate for the SAFE SPINE only.** CEO Decision #1 (2026-06-23) holds the entire wave behind AP-061..AP-064. *Decision:* is the app live in the stores? If yes → authorize Track A (CI-31, CI-27, CI-28, CI-29, CI-30) to enter a release train **dark**. Track B stays held on its clinical gates regardless.
2. **Approve the clinical copy passes to START now (parallel, non-engineering).** Per CEO Decision #4, front-load the Board work so Track B doesn't queue. *Decision:* authorize arbor-clinical-lead/-psych/-peds/-slp + arbor-safety to begin the gated-string reviews (CI-24/25/32/33/34, CI-28 goal labels) **against the actual strings on `claude/arbor-10-capabilities`** once the workflow reports done — so the gates are ready when the spine lands.
3. **Parent–Teacher / Provider Shared-View privacy architecture (CI-25 + CI-21 export).** CI-25's provider-routing brief and CI-21's kindergarten-briefing export both create a **share/export surface for child-associated developmental data** to a third party (teacher / clinician). *Decision:* approve the privacy-architecture stance — parent-owned, parent-initiated export only (the consult-packet / AP-036 pattern), no auto-share, no Arbor-held clinician account — **before** CI-25 strings clear. This is `gated-data`: backup before any rules/schema deploy, never past canary without OPS-D review.
4. **The 12-month clinician-export decision these capabilities re-touch.** CI-25's provider-routing brief is explicitly the **demand probe** for the Held "Full Clinician Portal / Therapist Copilot" (#97, Held — CEO-gated). Shipping CI-25 starts collecting the export-to-specialist signal. *Decision:* confirm CI-25 ships as a **demand probe only** (not a B2B clinical channel commitment); the channel decision stays a separate Level-3 call at 12 months of data.
5. **Swallow-safety as a hard ship-condition for CI-32 (acknowledge the recommend-veto).** *Decision:* ratify that CI-32 (Daily Living / feeding) **cannot promote its flag** without the swallow-safety interrupt implemented + green-tested — the Clinical Board issues a recommend-veto otherwise. This is a standing condition, surfaced so it is not silently dropped under build pressure.

> Plus, per item, when its gate clears: a **claim-flip sign-off** (CLM-006..010) — each is its own Level-3 event, signed by Clinical + Safety, logged in the ledger.

---

## 6. Rollback & canary criteria

### Healthy canary (must ALL hold on the no-traffic tagged revision before promote is even offered)
- Candidate Cloud Run revision is **Ready=True**, reachable by its tag URL at **0% live traffic**.
- **Smoke green:** `/` liveness 200 (note: the `/healthz` 404-in-prod ingress bug is still open — RELEASE-LEDGER REL-ARBOR-002 note — so smoke keys on `/` until fixed; re-instate `/healthz` + version==SHA pin once resolved); a **1.5 MB payload ≠ 413**; **one authed render path returns > 0**.
- **regress:arbor green:** safety-eval corpus · entitlement gates · image-gen quota/cost cap · `/vision` consent gate · payload-size · authed render · **Firestore rules emulator test** (load-bearing here — CI-28/29/32/33/34 all add child-data write paths; rules must pass before any data-touching canary).
- **Firewall lint clean:** zero unregistered/forbidden claim strings on any shippable surface.
- **All 10 flags resolve OFF** (build-time default; fail-closed) — confirm no capability is live-by-accident on the candidate.
- **0× 5xx** on the candidate over the smoke window.

### Auto-rollback triggers (RELEASE-PIPELINE stage 7; OPS-A4 `rollback.sh`)
- Smoke non-zero → **stop, do not promote, re-point traffic to last-good revision**, `git revert` the merge if needed.
- Prod-promote sign-off **withheld** by Guy → candidate stays at 0%, rolled back / left dark.
- Post-promote: 5xx spike, latency/cost-budget breach (arbor-sre veto), or any safety-eval regression → re-point to last-good revision; client `firebase hosting:rollback` if a hosting change shipped.
- **gated-data guard (CI-28/29/32/33/34):** Firestore rules/schema changes require a **backup before deploy** and **never pass canary without OPS-D review** — a rules regression on a child-data path is an auto-rollback + halt, not a warning.

### Kill-switch
**2 consecutive auto-rollbacks on Arbor ⇒ halt the Arbor train + page Guy** (SLO kill-switch, OPS-D5). The lane stays locked until Guy clears it.

---

## Appendix — sources read (all absolute paths)
- `C:/Users/dguyr/ROS/00_System/release-engineering/README.md`
- `C:/Users/dguyr/ROS/00_System/release-engineering/RELEASE-PIPELINE.md`
- `C:/Users/dguyr/ROS/00_System/release-engineering/GREEN-GATE.md`
- `C:/Users/dguyr/ROS/00_System/release-engineering/CLAIM-REGISTER.md`
- `C:/Users/dguyr/ROS/00_System/release-engineering/RELEASE-LEDGER.md`
- `C:/Users/dguyr/ROS/00_System/release-engineering/BACKLOG-MODEL.md`
- `C:/Users/dguyr/ROS/PAI/projects/parenting-os-plugin/mesh/PRODUCT-BACKLOG.md` (CI-20..CI-34, CEO Decisions Locked, Held/Not-Built, Gated-Decision lists)
- `C:/Users/dguyr/ROS/PAI/projects/parenting-os-plugin/mesh/improvement/CLINICAL-GUARDRAILS-CI-22-23-24.md`

**Open confirmations before this pack drives a train:** (1) read `claude/arbor-10-capabilities` once `wf_23661c90-2f8` reports done and replace every [PLACEHOLDER] with the strings/files that actually landed; (2) confirm whether `LANG-15` is a real Council ID or (as assumed) a localization-gate placeholder; (3) confirm store launch status to lift STOP #0.
