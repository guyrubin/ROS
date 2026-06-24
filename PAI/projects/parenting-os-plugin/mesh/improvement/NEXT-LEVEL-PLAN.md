# Arbor Next-Level Plan — Capability + Design, Zero Regression

**Owner:** CoS conductor · **Date:** 2026-06-23 · **Status:** Decision-ready
**Repo:** `github.com/guyrubin/PPPPtherapy-` · `origin/main = 70a9b17` (all 4 redesign waves absorbed)

---

## 1. North star

Make Arbor the clinically-soundest child-development OS by turning its longitudinal-memory ledger into the spine every surface feeds and reads from — richer in capability, sharper in design, zero regression on the 14 worlds / 10 journeys / 250+ activities / 133 milestones / Family-tier / safety floors already live.

---

## 2. Prioritized next-level backlog (verified moves only)

Streams: **A** = build session (CI code) · **B** = Claude Design (design system) · **C** = this pipeline (integration/green-gate/PR).

### Capability

| Move | Stream | Impact | Effort | Gate |
|---|---|---|---|---|
| **Wire 14 practice worlds into the memory ledger** — appendMemoryProposals today fires only from the 2 coach endpoints; all practice signals go to `data.events` and never reach the ledger. Wire the existing append path (status:`pending`, parent-approved) to practice signals. This is the moat move: the ledger stops being blind to skill data. | **C** | High | M | **safe** — 2 arbor-safety conditions: auto-gen fact/source strings stay descriptive-behavioral (no diagnosis/percentile/screener); proposals land `pending`, never auto-approved. |
| **Numeracy track ages 3-7** (CI-20, score 9.6) — `PracticeEventKind` has 13 kinds, zero numeracy; append one `numeracy` literal, reuse Wave-D deterministic playkit primitives. No ASR (parent-mediated oral confirm). | **A** | High | M | **safe** — do NOT add a normed "where your 4-yo should be" score (tips into vetoed 0-4 score). |
| **Weekly digest delivered out-of-app** — `digest.ts` emits an email/push-ready payload but zero delivery infra exists. | **C** | High | L | **gated** — BLOCKING: needs a new server-enforced consent purpose (none of the 3 existing cover child-named comms egress), Guy-gated email/push vendor + signed DPA, a scheduler runtime, unsubscribe/erasure/redaction. Route through arbor-safety before any ship. |

### Design

| Move | Stream | Impact | Effort | Gate |
|---|---|---|---|---|
| **"Why this" affordance — locked typographic pattern** — define the chip pattern (specific-signal + rationale register) once; apply to the one live surface (Ask Arbor coach rationale) and register as the binding spec CI-27/CI-30 inherit. Per-domain counts already computed in `select.ts` then discarded — surface them. | **B** defines, **C** integrates | High | S | **safe** — LLM-substituted chip text must pass screenModelOutput; neutral observed-count framing only, never a conclusion. |
| **7 domain-glyph SVG set** for CI-27 Capability Graph — no domain-glyph system exists today; net-new vector vocabulary (24×24, 2px clay stroke, RTL-mirror, mono fallback). | **B** | High | M | **safe** — glyphs stay abstract: cognition/EF must NOT read as brain/neuro; sensory/motor must NOT echo a sensory-profile graphic. |
| **Longitudinal depth-cue** — accent timeline/memory cards whose source observation is >30 days old via existing `clay-dim` token + real `createdAt`/`at` timestamps. Ship the verifiable slice only. | **A** | High | M | **safe** — depth stays decorative, never implies clinical weighting. **Drop** the fabricated "graph-node graduation" and the invented "Sharpens as you log" copy until a real surface + approved copy exist. |
| **Growth Card as designed artifact** — record-driven shareable card (domain glyphs + digest narrative) on the proven canvas PNG path. | **B** spec, **A/C** integrate | High | M | **gated** — copy draws ONLY from activity-count core, never digest trend/milestone fields (reads as screening on a public surface); embed real C2PA/SynthID or soften the heroCard.ts provenance claim (CLAIM-REGISTER). |

### Clinical

| Move | Stream | Impact | Effort | Gate |
|---|---|---|---|---|
| **Citation-traceable developmental signal** — `cdc()` builder never populates `Milestone.references`; types + render path already exist, corrected-age already computed before band select. Populate per-node references, reuse the shipped chip. | **C** | High | M | **safe** — citation matches displayed band verbatim; ASHA shown as typical-acquisition RANGE not cutoff; only free public bodies (CDC/AAP/ASHA/WHO). |
| **Corrected-age fix in monitoring.ts** — `deriveMonitoring` renders parent-facing escalation copy off CHRONOLOGICAL age with a flat 2-month grace and ZERO corrected-age handling; a preterm child gets a false "behind/escalate" today. Thread `gestationalWeeks`, centralize one screened "discuss with your own provider" decision-aid component. | **A** | High | M | **gated** — HARD conditions: peds/SLP/psych verbatim copy pass + new eval:safety case (preterm-no-false-flag, no-diagnosis-leak). Any "may indicate [condition]" = veto. Drop the "we originate this" framing. |
| **Retire the live numeric DevScore → observed-skill counts** — `DevScoreCard.tsx` ships a 0-100 ProgressRing + per-domain 0-100 today; this is a regression-REMOVAL of a live scored child-data surface, not a greenfield add. Rework to dated emergence + competence ladder; add a real no-number render-layer lint + wire screenModelOutput enforcement (`outputScreen.test.ts`). | **C** | High | M→L (understated as M) | **gated** — must precede CI-27/AP-051 build-ready; the no-number lint FAILS on current code. Route through arbor-safety + Clinical Board. eval:safety green proves nothing here (it never scans devScore.ts) — enforcement must be real. |

### Market

No standalone market move is build-ready. The numeracy track (above) is the market wedge — highest-search child-skill vertical currently ceded to free rivals. Treat its GTM as a marketing-mesh follow-on after the world ships, not a parallel build.

---

## 3. Stream coordination — the no-collision contract (load-bearing)

**The rule: only the merge-lane lock-holder merges to main. All merges to main are serialized. Acquire the lock at integration, release after promote.**

### Branch / worktree ownership (do not cross these lines)

| Stream | Owns | Branch / worktree | Must NOT touch |
|---|---|---|---|
| **A** build session | CI game code, new worlds, schema extensions | `claude/arbor-10-capabilities` + `claude/hero-arcade` worktrees (105 behind main — reconcile/rebase, not clean merge) | mobile-store files; this-pipeline's editor-pass branch |
| **B** Claude Design | design system: tokens, glyph set, locked patterns, Growth Card layout spec — ships as `claude/arbor-design-sync` (1 ahead, upload-pending) | app `src` integration; never merges code to main directly |
| **C** this pipeline | integration PRs, green-gate, ledger/citation/no-score wiring | mobile-store lane files (`firebase.json`, android/ios workflows, native config); must branch off **fresh `origin/main 70a9b17`**, NOT off `arbor-10-capabilities` even though the editor-pass worktree currently sits on it |

**Critical:** the editor-pass session's 17 uncommitted files live in the `arbor-10-capabilities` worktree (Stream A's branch). They must be moved onto a fresh branch off `70a9b17` before any commit, or two sessions clobber one branch.

### Merge-lane order (serialized to main)

1. **REL-ARBOR-003 `claude/mobile-store-safe-fixes` FIRST.** It rewrites `firebase.json` rewrites + hosting deploy; any other hosting promote first clobbers its `/privacy`,`/terms`,`/support` rewrites. Rebase onto `70a9b17` (25 behind) before merge. Verified disjoint from `arbor-10-capabilities` (zero shared files) — no conflict with Stream A.
2. **Redesign waves** — already 0-ahead in main. Nothing to merge; build ON them, not on any `redesign-waveN` branch (all stale-relative-to-merged).
3. **CI capability slices (Streams A + C)** — each as its own small PR off current main, in the ship sequence below. Stream A's `arbor-10-capabilities` is 105 behind and overlaps the merged redesign `app/src` surface — treat as reconcile/rebase, coordinate with the build session, never merge under it.
4. **`claude/council-wave-1`** remaining 6 commits (CI-05/06/07/08/12/13) — re-gate each; some superseded on main per ledger. Verify novelty before re-applying.
5. **design-sync** (1 ahead, low risk) — land after a rebase, anytime.

### Integration points (where streams hand off)
- **B → C:** the "why this" chip pattern + 7 domain glyphs are design-system assets B publishes; C integrates them into live surfaces and registers the binding spec. C does not invent the pattern; B does not touch `app/src` integration.
- **A → C:** numeracy world + depth-cue land as A's code on small branches; C green-gates and shepherds the PR.
- **Growth Card** is the one move spanning all three: B owns the locked layout spec, A/C execute integration behind the gated safety conditions. Do not start until the Growth Card gate clears (§6 ask).

---

## 4. Ship sequence — vertical slices, each green-gated, each a human-merged PR

Gate harness appended to existing green-gate (tsc/test/check:framework/eval:safety): **`check:floors`** (F1-F18) + **`smoke:routes`**. F2 needs the WORLDS export. Any PR regressing F12/F13/F14 (safety/consent/sharing) auto-blocks. Human-named reviewers gate F4/F5 (clinical framing), F8/F9 (sec), F10 (RTL), AP-043 token parity. **Guy holds the deploy gate — no slice auto-merges.**

**Slice 1 (safe, highest leverage): Practice→Ledger wiring + Citation chips.** Both safe, both this-pipeline, both wire existing producers to existing consumers. Lands the moat (ledger sees skill data) + the clinical credibility surface (per-node CDC/AAP/ASHA provenance). → green-gate → PR → Guy merges.

**Slice 2 (safe, market wedge): Numeracy track ages 3-7** (Stream A). New world on proven primitives. + **"Why this" chip pattern** applied to the live coach surface (B defines, C integrates). → green-gate → PR.

**Slice 3 (safe, design depth): Domain-glyph set + Longitudinal depth-cue** (B + A). Visual vocabulary + aged-record texture, both decorative-safe. → green-gate → PR.

**Slice 4 (gated, sequential): Corrected-age fix in monitoring.ts.** Behind peds/SLP/psych verbatim pass + new preterm eval:safety case. Real defect fix. → gate clears → green-gate → PR.

**Slice 5 (gated, structural): Retire numeric DevScore → observed-skill counts + no-number lint.** Prerequisite for CI-27/AP-051. The lint must pass on reworked code before any Capability Graph build is "ready." → Clinical Board + arbor-safety → PR.

**Deferred (gated, infra-heavy): Weekly digest delivery + Growth Card** — both need Guy decisions (§6) before they enter the sequence.

---

## 5. Parked list — every stream avoids these (no design, no build, no schedule)

| Held item | Why |
|---|---|
| Any in-app screener/instrument (M-CHAT, ABAS/Vineland/SRS/Sensory Profile construct-map, WHO-ICF map) | EU MDR Rule 11 device-adjacency + validity-theft. Permanent. |
| Scored index / 0-4 or 0-100 developmental score / Adult Mediation Index (%) | App-asserted deficit metric + false precision. The live DevScore is being RETIRED, not extended (Slice 5). |
| "Clinically validated / clinician-reviewed / expert-reviewed by our board" language | Only licensed clinicians can claim board review (AP-060 firewall, CLAIM-REGISTER). |
| Attention → "difficulty" framing | ADHD-adjacent. Permanent. |
| Sensory/Emotion Map as scored or visual-zone system | Log is safe; any map/score/zone render is not. |
| CI-25 Neurodiversity Observation Lens | Bucket 3 — permanently held from design even though backlog entry is a gated candidate (needed only to define the CI-34 routing boundary). |
| Branded-program clones (Triple P / Incredible Years / PCIT / Zones), any "based-on"/effect-size claim | Arbor-native content only. |
| Any "what to feed" recommendation | Choking risk; feeding only as a parent-logged entry behind the swallow-safety interrupt. |
| Risk Map · AI Clinical Summary · "ready/not-ready" verdict (CI-21) · Clinician Portal | Vetoed / CEO-gated 12-month data decision. |

---

## 6. The ask — decisions to unblock the highest-leverage work now

1. **Approve Slice 1 (Practice→Ledger + Citation chips) to build immediately.** Both safe, both this-pipeline, no new gate. This is the single highest-leverage move — it makes the longitudinal-memory moat actually ingest the 14 worlds' signal. **Recommend: yes, today.** (Tier-A under your daily epic-approval — no individual sign-off needed; flagging because it writes to the consent-gated ledger path.)

2. **Confirm the merge-lane order: mobile-store (REL-ARBOR-003) merges to main first, before any CI slice.** Protects the hosting rewrites. **Recommend: yes** — it is the designated next-to-merge train and is disjoint from the capability work.

3. **Two gated decisions to greenlight the deferred high-value moves (each is a Tier-C call you own):**
   - **Weekly digest delivery** needs a Guy-gated email/push vendor + signed GDPR DPA + a new consent purpose. Approve the vendor path and Arbor can build child-named out-of-app delivery; decline and it stays in-app only.
   - **Retire the live numeric DevScore** (Slice 5) — this removes a scored child-data surface currently in prod and is the prerequisite for the CI-27 Capability Graph. Approve the rework + Clinical Board copy pass to unblock the entire CI-27 line.

**Decision requested:** Greenlight Slice 1 now and confirm the mobile-store-first merge order. The two gated items (digest vendor, DevScore retirement) can be decided this week without blocking Slices 1-3.
