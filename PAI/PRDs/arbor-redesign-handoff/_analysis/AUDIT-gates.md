# AUDIT — Redesign Gate Correctness (arbor-safety)

**Auditor:** arbor-safety (veto holder) · **Date:** 2026-06-23
**Scope:** AP-043..AP-054 (PRODUCT-BACKLOG Redesign Reconciliation), NO-REGRESSION-GATE floors F1–F11, AM-R1..AM-R13 (MARKETING-BACKLOG §11 Redesign Marketing Harvest).
**Test applied:** any item touching child-data, a clinical/developmental/effect-size claim, money, store, DNS, or anything irreversible MUST be flagged GATED; anything gated-but-labeled-safe is a MISLABEL and a hard stop.

---

## 1. Product tickets AP-043..AP-054 — gate verdicts

| AP- | What it touches | Labeled | Correct? | Verdict |
|-----|-----------------|---------|----------|---------|
| AP-043 | Design tokens — pure CSS, no data/claim | safe | yes | CORRECT |
| AP-044 | Desktop sidebar/topbar shell — pure FE chrome | safe | yes | CORRECT |
| AP-045 | Global search — read-only index over existing content | safe | yes | CORRECT (see Risk-1: confirm read-only, no child-record fields indexed) |
| AP-046 | Notification bell — displays existing JITAI/monitoring signals | safe | yes | CORRECT — but see Risk-2: monitoring signals carry developmental framing |
| AP-047 | Multi-kid topbar chip — new entry to existing switcher | safe | yes | CORRECT (no new child-data write path) |
| AP-048 | Kid Mode overlay — FE wrapper over existing child surfaces | safe | yes | CORRECT — but see Risk-3: child-facing exit gesture is a safety control |
| AP-049 | 5-step onboarding — Step 3 focus-domain copy + Step 4 avatar (child-data, COPPA/GDPR) | **gated** | yes | CORRECT — clinical-psych copy + arbor-safety consent review; safe-slice split (steps 1/2/5) is acceptable |
| AP-050 | Hero Avatar fan-out — shared canvas, no new child-data, C2PA at export | safe | yes | CORRECT (C2PA/SynthID provenance must be enforced at export, not optional) |
| AP-051 | Day Windows — predictive developmental signal from child behavior log | **gated** | yes | CORRECT — clinical-psych non-predictive-framing pass; child-data read |
| AP-052 | Accent theme switch — pure token preference | safe | yes | CORRECT (WCAG AA is a QA gate, not a safety gate) |
| AP-053 | Dev Copilot + Learning Map — joins existing copilot + course data | safe | partial | SEE MISLABEL CANDIDATE M-1 below |
| AP-054 | Language Lab — bilingual vocab counts from child language record | **gated** | yes | CORRECT — clinical-slp non-screen framing pass; child-data read |

**Gated set is correct and complete for the three obvious cases (AP-049, AP-051, AP-054).** No item that is plainly child-data/claim-bearing is sitting as Tier-A buildable. But two safe-labeled items need a second look:

### MISLABEL CANDIDATE M-1 — AP-053 (Dev Copilot + Learning Map) labeled `safe`
- AP-053 surfaces a copilot recommendation: *"Arbor suggests focusing on Self-Regulation — here's why."* That is a **developmental recommendation surfaced to the parent, tied to the child's Development Map.** The same class of "surface a developmental read to the parent" is exactly what holds AP-051 (Day Windows) and DEM-002 ("Arbor Noticed") as GATED.
- The ticket assumes the copilot output is pre-cleared because it "already exists." But a NEW display surface that newly foregrounds a lowest-scoring-domain verdict ("here's why") can re-frame an already-sound signal into an implied deficit read. The note "no new AI call" addresses cost, not framing.
- **Verdict: SHOULD BE GATED (light) — arbor-clinical-psych copy pass on the "here's why" / lowest-domain recommendation framing before build-ready.** Not a full hold; a copy-framing pass identical to AP-051's. Currently UNDER-GATED. **arbor-safety flag — route to orchestrator.**

### MISLABEL CANDIDATE M-2 — AP-046 (Notification bell) labeled `safe` — CONDITIONAL, holds as safe
- The bell aggregates `monitoring.ts` surveillance signals into a standalone, persistent, badge-counted center. Monitoring signals are developmental ("worth discussing") and the entire DEM-002 / PHI-02 / PHI-10 council line holds that *pushing a monitoring signal at a parent* (vs parent-opened) inverts the parent-mediated model and pathologizes-by-recurrence.
- The ticket correctly scopes OUT FCM/push (stays AP-038, gated) and keeps it in-app/parent-opened. As written (in-app, parent-pulls, no new push consent, carries source copy verbatim) it stays **safe** — BUT with a binding condition: the bell must render the monitoring note's existing non-diagnostic copy verbatim and must NOT compress/re-headline it (e.g. a badge count that reads as "3 problems"). **Verdict: SAFE is acceptable ONLY with the verbatim-copy + no-re-headline condition written into acceptance criteria.** Currently that condition is NOT in AP-046's acceptance criteria. **arbor-safety flag — add the condition; otherwise it drifts gated.**

### Residual risk notes on correctly-labeled-safe items (not mislabels — conditions to enforce)
- **Risk-1 / AP-045 search:** must not index raw child-record fields (behavior log entries, memory ledger content, journal text). Indexing activity/milestone/journey NAMES is safe; indexing the child's logged data would be a child-data egress surface. Acceptance criteria say "existing content" — pin it to content catalogs, not child records.
- **Risk-3 / AP-048 Kid Mode exit:** the parent-gesture-to-exit (PIN/password) IS a child-safety control. If it can be trivially bypassed by a child, Kid Mode is not a real boundary. QA must verify, but it is not a clinical/claim gate — stays safe.

---

## 2. Marketing harvest AM-R1..AM-R13 — gate verdicts

| AM-R | What it touches | Labeled | Correct? | Verdict |
|------|-----------------|---------|----------|---------|
| AM-R1 | Pricing page — ₪/€ price anchors (money) | **GATED** (ILS Guy-confirm) | yes | CORRECT — ₪ anchors need Guy confirm; draft safe |
| AM-R2 | Trial CTA copy — no price numbers in CTA | safe (publish L3) | yes | CORRECT |
| AM-R3 | "The Science" page — evidence/effect-size claim surface | **GATED** (safety + clinical-lead) | yes | CORRECT — strongest claim surface in the set |
| AM-R4 | Social-proof strip — "133 milestones · CDC-grounded", mechanism-only | safe (ECD; publish L3) | **NO** | SEE MISLABEL M-3 |
| AM-R5 | AEO "Is Arbor evidence-based?" answer card | **GATED** (safety + clinical-lead) | yes | CORRECT |
| AM-R6 | "Your child is the hero" series — stylized avatar, never real face | safe (+ safety gate; share gated on AP-044) | yes | CORRECT — avatar/child-context routes through safety |
| AM-R7 | Hero Story landing section — live counts, kid-hero hook | safe (ECD; publish L3) | yes | CORRECT |
| AM-R8 | Marketing token sweep — pure styling | safe (blocked on AP-043) | yes | CORRECT |
| AM-R9 | Accent theme social assets — pure design variants | safe | yes | CORRECT |
| AM-R10 | Competitor-kill copy refresh — positioning, no claim | safe (ECD; publish L3) | yes | CORRECT |
| AM-R11 | "Five value loops" social post — positioning | safe (ECD + safety) | yes | CORRECT |
| AM-R12 | Onboarding pre-framing — clinical-framework + avatar-privacy + focus-domain copy | **GATED** (safety + clinical-psych) | yes | CORRECT |
| AM-R13 | Onboarding share card — child first-name PII in share payload | **GATED** (safety on child-identifier) | yes | CORRECT |

### MISLABEL M-3 — AM-R4 ("The Science" social-proof strip) labeled `safe`
- AM-R4 lifts *"133 milestones · 7 domains · 40+ sources · CDC-grounded"* onto the landing hero. **"CDC-grounded" is a provenance/clinical-grounding claim** that the council line (PHI-01, DEM-004, the firewall §0/§3 p11) treats as gated: the exact wording "grounded in CDC/AAP/ASHA" vs an implied "CDC-recommended/validated" is a board-cleared distinction, and surfacing source counts as a trust badge is precisely the PHI-01 "evidence grade" failure mode (a credibility badge with no per-claim clearance).
- AM-R3 and AM-R5 — the SAME claim content on the same "Science" theme — are correctly GATED (safety + clinical-lead). AM-R4 carries the identical "CDC-grounded" string onto the highest-traffic surface (the hero) and is labeled merely `safe — ECD gate`. **Inconsistent with R3/R5.**
- **Verdict: SHOULD BE GATED — `arbor-safety` (+ `arbor-clinical-lead`) clearance on the "CDC-grounded" string and the source-count framing before publish.** "Mechanism-only" is asserted but not cleared. Currently UNDER-GATED. **arbor-safety flag — route to orchestrator.**

### Note (not a mislabel) — AM-R1 / AM-R12 / AM-R13 firewall reminder
AM-R12's *"7-domain clinical framework, tuned to age + focus"* and AM-R3's clinical-board note must carry the firewall: internal reviewers, **never** "licensed clinicians" / "clinically validated." The gates are correctly set; the binding constraint is that clearance must check the exact strings, not just the presence of a gate. Flagged so the reviewer does not rubber-stamp.

---

## 3. NO-REGRESSION-GATE floors — which CANNOT be automated

The gate spec already self-declares 5 semantically-unautomatable floors. I confirm those and add one the spec under-states. A floor is "not automatable" when CI can prove PRESENCE but a human must judge SEMANTICS — and silently treating a presence-pass as a full pass is the trap.

| Floor | Automatable part (CI) | The part a SCRIPT CANNOT judge → needs a named human | Reviewer |
|-------|------------------------|------------------------------------------------------|----------|
| **F8** memory ledger append-only | static "only `appendEvent` path; delete = tombstone" + behavioral test | A NEW UI path (or sync job) that hard-deletes a ledger event in place. GDPR erase MUST be tombstone + retention job, not in-place wipe. A grep can't see a new erase route added by a future PR. **Irreversible child-data op.** | arbor-sec |
| **F9** consent purposes present | all 3 literals (`face_processing`/`voice_processing`/`ai_training`) in the enum | Whether AP-049 onboarding actually REQUESTS the right purpose BEFORE face/voice/training capture, and the copy is COPPA/GDPR-valid. **Enum presence ≠ correct consent UX.** This is the core arbor-safety veto surface. | arbor-sec + **arbor-safety** |
| **F10** RTL/HE | `dir=rtl` for `he` + route smoke | Visual RTL correctness on the NEW shell (mirrored sidebar/topbar, no clipped Hebrew). A script cannot see a broken mirror. | arbor-qa (HE reviewer) |
| **F4 / F5** clinical framing | counts (domains=7, milestones≥133) | Non-pathologizing / non-diagnostic FRAMING of AP-049 focus copy, AP-051 Day Windows, AP-054 Language Lab. Count green ≠ framing safe. **Human veto.** | arbor-clinical-psych / -slp |
| **Visual-parity** (AP-043 token migration) | screenshot diff flags pixel deltas | Whether a flagged diff is an intended token change or a regression. Tool flags; human decides. | arbor-design |

### Floor gaps the spec UNDER-states (arbor-safety additions)

- **F-NEW (consent-on-capture, not just consent-enum) — NOT a floor today, must be one.** F9 asserts the enum exists. There is **no floor asserting that the redesigned onboarding/consent surface actually GATES capture on consent** — i.e. that avatar creation (AP-049 Step 4) cannot fire `AvatarCreator` before the COPPA/GDPR consent is recorded. A passing F9 enum check + a green build could ship an onboarding that captures a child photo with the consent screen skippable. **This is the single highest child-data risk in the redesign and it is not machine-checked.** Required: a behavioral test "avatar/face/voice capture path asserts a recorded consent for the matching `ConsentPurpose` before capture" — and until that test exists, **arbor-safety manual sign-off on AP-049 Step 4 is a hard gate, not optional.**
- **F8 erase is genuinely un-automatable for NEW paths.** The static check guards the CURRENT code; it cannot prevent a future PR from adding an in-place delete. The arbor-sec sign-off on F8 must be **per-PR on any wave touching the ledger or a sync/erase path**, not a one-time clearance.
- **C2PA/SynthID at avatar export (AP-050)** has a presence dimension (signature applied) that CI can check, but **whether the signature survives every one of the new fan-out surfaces** (8 surfaces) is a per-surface manual confirm — arbor-sec. Not currently listed as a floor.

---

## 4. Hard-stop summary (route to arbor-orchestrator)

**Under-gated (mislabeled should-be-gated) — 2 hard, 1 conditional:**
1. **M-1 / AP-053** Dev Copilot "here's why" lowest-domain recommendation → add arbor-clinical-psych copy-framing gate. (product)
2. **M-3 / AM-R4** "CDC-grounded" social-proof strip → add arbor-safety + arbor-clinical-lead clearance (parity with R3/R5). (marketing)
3. **M-2 / AP-046** Notification bell → stays safe ONLY if the verbatim-monitoring-copy + no-re-headline condition is added to acceptance criteria; otherwise it drifts gated.

**Correctly gated (no change):** AP-049, AP-051, AP-054; AM-R1, AM-R3, AM-R5, AM-R6, AM-R12, AM-R13.

**Floors needing a human (cannot be fully automated):** F8 (sec, per-PR), F9 (sec + safety — consent UX), F10 (qa HE), F4/F5 framing (clinical-psych/-slp), AP-043 visual-parity (design). **Plus the missing F-NEW: no floor asserts capture is gated on recorded consent — until a behavioral test exists, AP-049 Step-4 avatar/face/voice capture requires arbor-safety manual hard-gate.**

**No `eval:safety` regression introduced by any item reviewed** — but every gated marketing/clinical-copy item must re-run `eval:safety` green before publish, and AP-049/051/054/053 copy must pass it pre-ship.
