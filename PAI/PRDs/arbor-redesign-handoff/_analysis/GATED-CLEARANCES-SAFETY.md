# GATED-CLEARANCES — Child-Data / COPPA / GDPR / Consent

**Reviewer:** arbor-safety (veto holder) · **Date:** 2026-06-23 · **Mode:** review/advisory only — no code, no build.
**Scope:** the child-data gate ONLY on AP-049, AP-056, AP-057, AP-058, AP-060. Clinical-framing gates (clinical-psych / -slp / -lead copy passes) are co-held by the Clinical Board and are NOT cleared here — they remain open in parallel.

**Live consent model this review enforces (verified in code, branch `claude/redesign-wave1`):**
- `requireConsent` middleware — server-enforced, fails **CLOSED** with **HTTP 451** unless an active in-scope grant exists. Wired today on `/generate-avatar` + `/vision` (`face_processing`, gated only when `photo`/`image` present) and `/score-utterance` (`voice_processing`). `src/server/requireConsent.ts`, `src/routes/api.ts`.
- `ConsentPurpose = face_processing | voice_processing | ai_training`; processing consents time-boxed 365d + re-prompt; `ai_training` default-OFF, opt-in, no expiry. `src/sharing/consent.ts`.
- Redaction: `createRedaction(childName)` scrubs child name + email + phone at the model-call seam on **every** AI prompt (incl. `/generate-handoff`, `/generate-story`) and restores on output. `src/server/redaction.ts`.
- GDPR: `/privacy/export/:childId` (export) and `/privacy/erase` (erases memory events + shares + consents), both `requireOwnership`. `src/routes/api.ts`.
- Handoff path already screens: `screenForImmediateEscalation` → HTTP 409 + non-diagnostic contract before generation. `src/routes/api.ts`.

---

## Verdict table

| AP- | Item | Child-data verdict | Consent purpose | New consent surface? | Needs Guy (Tier-C)? |
|-----|------|--------------------|-----------------|----------------------|---------------------|
| **AP-049** | Onboarding Step 4 — avatar from child photo | **CLEARED-WITH-CONDITIONS** | `face_processing` | No — reuses `/generate-avatar` 451 gate | **YES** — child-photo capture path; Guy sign-off until F-NEW behavioral test lands |
| **AP-056** | School Handoff Brief — child data → teacher | **CLEARED-WITH-CONDITIONS** | none new (export, not processing) | No new *consent* purpose; new *egress* surface | **YES** — new child-data egress to a third party |
| **AP-057** | Bedtime Stories — built from child-day data + avatar | **CLEARED-WITH-CONDITIONS** | `face_processing` (avatar reuse) + `ai_training` **only if** used to improve models | No (in-app, parent-pulled) | **YES** — child-day memory record → generative prompt at scale |
| **AP-058** | Smart Reminders settings dashboard | **CLEARED** (no child-data gate) | none | No | No (from safety; clinical-psych framing pass still open) |
| **AP-060** | "The Science" trust page | **CLEARED** (no child-data gate) | none | No | No (from safety; clinical-lead firewall pass still open) |

**From the child-data/consent/privacy lens: zero HARD-BLOCKs.** Every item routes through the existing consent/redaction/export/erase path — no item requires a brand-new consent *purpose* or a new consent *primitive*. Three items (AP-049, AP-056, AP-057) still require Guy's individual Tier-C sign-off because each is a child-data capture or egress event, and AP-049 additionally needs the F-NEW capture-gate test (below) before its hard manual gate lifts.

---

## Per-item conditions

### AP-049 — Onboarding Step 4 (avatar from child photo) — CLEARED-WITH-CONDITIONS
- **Consent gate placement:** the parent MUST record an active `face_processing` grant (POST `/api/consent`, `requireOwnership`) **before** any photo leaves the device to `/generate-avatar`. The server already fails closed (451) — but the onboarding UI must not let Step 4 fire the capture/upload before the consent is recorded.
- **Hard condition — F-NEW (the single highest child-data risk in the redesign, and it is NOT machine-checked):** `requireConsent` no-ops for the `local-sandbox` uid and gates only `appliesWhen(photo present)`. A green build + a present `ConsentPurpose` enum can still ship an onboarding where the consent screen is skippable and a child photo is captured first. **Required before the manual gate lifts:** a behavioral test asserting the avatar/face capture path records a `face_processing` grant for the matching `childId` BEFORE capture/upload fires. **Until that test exists, AP-049 Step 4 is an arbor-safety manual HARD-GATE, not optional.** A safe slice of Steps 1/2/5 (no child-data) may ship first.
- **Retention/redaction:** avatar generated and stored **local-only** (per ticket + AP-050 note "zero new child-data capture"). The reference photo must NOT be persisted server-side beyond the generation call; only the stylized avatar is retained. Confirm no raw-photo write to Firestore/Storage in the Step-4 path.
- **GDPR:** `face_processing` grant is already swept by `consentStore.eraseByChild` on `/privacy/erase` and listed in `/privacy/export`. No new export/erase wiring needed — **confirm** the locally-stored avatar is also cleared by the client erase path (server erase does not reach local storage).
- **Provenance:** C2PA/SynthID at export is an AP-050 condition, not optional (see AUDIT Risk).

### AP-056 — School Handoff Brief (child data → teacher) — CLEARED-WITH-CONDITIONS
This is the **child-data egress** item. No new consent *purpose*, but a new *export surface*, so the gates are explicit and binding:
- **Parent-approval gate (hard):** "Nothing is shared until the parent explicitly approves export" (AC-3) is a **binding safety control**, not UX nicety. The export action MUST present the exact rendered brief to the parent and require an explicit per-export approval. No auto-send, no background export, no "share by default."
- **Redaction gate before egress:** the brief is generated via `/generate-handoff`, which already redacts child name/email/phone at the model seam AND screens for escalation (409) before generation — both inherited and sufficient at the *generation* seam. **But egress redaction is a separate question:** the brief is *restored* (real child name present) before it reaches the parent/PDF, because a teacher needs the child's name. Therefore the gate is **parent-approval of the restored content**, not name-redaction. Condition: the brief MUST contain **zero clinical-diagnosis language** (AC + clinical-psych framing pass) and **zero raw memory-ledger / behavior-log dumps** — only the curated fields (calm strategies, transition phrases, bilingual framing). Pin the export to the curated field set; never serialize the child's raw record into the export.
- **Scope ceiling:** ≤1 page, no clinical data (AC). The export must not become a backdoor for the full memory record.
- **GDPR:** an exported PDF/brief leaves Arbor's trust boundary and is **outside** `/privacy/erase` reach (we cannot un-send a teacher's copy). The parent-approval screen MUST state this plainly ("once shared, this copy is the teacher's"). Server-side, the *generated* brief should not be persisted as a new child-data record outside the existing export/erase sweep; if it is cached, it must be erasable by `childId`.
- **Tier-C:** new child-data egress to a third party → Guy confirms before build-ready.

### AP-057 — Bedtime Stories (child-day data + avatar) — CLEARED-WITH-CONDITIONS
- **Consent purposes:** (a) `face_processing` — the story stars the child's avatar; reuses AP-049/AP-050 grant, no new gate. (b) **`ai_training` is required ONLY IF** the child's day data or generated stories are fed back to improve models — and `ai_training` is **default-OFF, opt-in** in the live model. **Condition:** the day-data→story prompt is a *generation* input (allowed under the parent's use of the product); it MUST NOT be repurposed as training data unless an active `ai_training` grant exists. Default path = generate-and-discard, no training retention.
- **Redaction at the generation seam (hard):** the story is generated from the memory record. Child PII MUST pass `createRedaction` before reaching the model (the `/generate-story` path already does `privacy.redact(prompt)` + restore-on-output — confirm the Bedtime-Stories prompt builder uses the same seam; do NOT add a new un-redacted prompt path).
- **Escalation screen (hard):** stories are "rooted in the child's logged day." A logged day can contain a safety event (injury, abuse disclosure, regression). The story-generation path MUST run the same `screenForImmediateEscalation` gate the handoff path uses — a logged escalation event must **never** be turned into a cheerful bedtime narrative. This is a new requirement specific to AP-057. Route to `arbor-safety` outputScreen before any story renders.
- **Non-pathologizing prompt framing:** generated story prompts must not frame the day's events as developmental deficits (AC-6, clinical-psych pass — co-held, still open).
- **Retention/GDPR:** generated stories are child-derived content → they are child-data and MUST be erasable by `childId` via `/privacy/erase` and included in `/privacy/export`. **Condition:** if stories are persisted (a "library"), wire their store into the existing erase/export sweep — do NOT create a child-data store that the GDPR path cannot reach. (Mirrors the F8 append-only / tombstone discipline for the memory ledger.)
- **Tier-C:** child-day memory record → generative prompt, at recurring weekly scale → Guy confirms before build-ready.

### AP-058 — Smart Reminders settings dashboard — CLEARED (no child-data gate)
- **Child-data verdict:** reads/writes the parent's **JITAI nudge settings** (toggles, quiet-hours, ≤2/day ceiling) — these are parent preferences, not child data, and no new capture/egress/processing occurs. **No consent purpose, no redaction, no export/erase implication. Cleared from the safety/consent/privacy lens.**
- **Residual (not a safety hold, flagged for the clinical gate):** the advisory-tension framing — nudge copy must not imply Arbor is *monitoring/surveilling* the child or that more nudges = better development — is the open `arbor-clinical-psych` copy pass (AC-7). That is the Clinical Board's gate, not mine. No Guy sign-off needed on child-data grounds.

### AP-060 — "The Science" trust page — CLEARED (no child-data gate)
- **Child-data verdict:** static editorial/trust content (framework stats, public source links, disclaimer). **No child data is read, captured, processed, or exported. Cleared from the safety/consent/privacy lens.**
- **Residual (not a safety hold, flagged for the clinical gate):** the **CHARTER §3 p11 firewall** is the binding open item — every "clinician-reviewed"/"clinically validated"/"Expert-Reviewed" string MUST be reworded to "developmentally informed, grounded in CDC/AAP/ASHA" and the board note to "internal reviewers, not licensed clinicians" before build-ready. That clearance is `arbor-clinical-lead`'s, on every word. No child-data Guy sign-off needed.

---

## Still needs Guy (Tier-C, individual sign-off — child-data grounds only)

1. **AP-049 Step 4** — child-photo capture. Sign-off + the F-NEW capture-gate behavioral test is a **hard prerequisite**; until the test exists this is an arbor-safety manual hard-gate. (Safe slice Steps 1/2/5 may proceed without it.)
2. **AP-056 School Handoff Brief** — new child-data **egress** to a third party (teacher). Parent-approval + curated-field-only + no-raw-record conditions are binding.
3. **AP-057 Bedtime Stories** — child-day memory record → generative prompt at scale; binding new requirement = the escalation screen on story input + GDPR-reachable story store.

**Covered by the existing consent path (no NEW consent surface required for any of the five):** all three child-data items reuse `face_processing` (451 gate), `ai_training` (opt-in, default-off), redaction-at-seam, and the `/privacy/export` + `/privacy/erase` sweep. No new `ConsentPurpose` and no new consent primitive is needed.

## Decision

**CLEARED (no safety conditions): AP-058, AP-060** — buildable today on child-data/consent/privacy grounds (their open gates are clinical-copy, owned by the Board, not me).
**CLEARED-WITH-CONDITIONS → Guy Tier-C: AP-049, AP-056, AP-057** — build-ready once the per-item conditions above are written into acceptance criteria AND Guy signs each off; AP-049 additionally gated until the F-NEW capture test lands.
**HARD-BLOCK: none.**
**Hard stop reminder:** no item may ship without `eval:safety` green; AP-057's escalation-screen-on-story-input and AP-049's capture-gate test are the two new behavioral assertions I require before sign-off converts to clearance.
