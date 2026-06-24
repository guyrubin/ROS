# Voice of Parent — Research Function

**Owner:** `arbor-ux` (UX Research + Product Designer)
**Reports to:** Head of Product (`arbor-product`)
**Created:** 2026-06-22
**Status:** Standing function, bootstrapping. First signals not yet collected.

---

## 1. Honest signal inventory (as of 2026-06-22)

There is no real parent signal in the system today. This is the documented finding from the CoS Reality Check (2026-06-22) and confirmed by a full scan of the repo.

**What exists:**

| Source | Status | What it actually is |
| :-- | :-- | :-- |
| App Store reviews | None — app not yet published on App Store | Zero |
| Google Play reviews | None — app not yet published on Play | Zero |
| In-app feedback capture | No mechanism wired in the product | Zero |
| Support / inbox threads | No support channel connected; no inbox thread found | Zero |
| Parent interviews or usability sessions | No notes, transcripts, or recordings found anywhere in the repo | Zero |
| NPS or survey data | No NPS instrument; no survey file found | Zero |
| Analytics events (Amplitude / Pendo / Mixpanel) | Not integrated; `arbor-sre` notes zero usage telemetry in the WAF assessment | Zero |
| Product analytics (session / funnel data) | No Amplitude/Pendo MCP connection; no funnel data file found | Zero |

**What the CIL produces instead:**

The Continuous Improvement Loop generates findings grounded in code inspection, heuristic analysis (Nielsen, the critic rubrics), and competitor benchmarking against Kinedu / Lovevery / Huckleberry / Good Inside / Khan Kids. Every scored finding in `IMPROVEMENT-BACKLOG.md` is backed by file-and-line evidence or a cited competitor source — not by what any parent has said or done. The `arbor-critic-feedback` lens spec acknowledges this explicitly: "When there is little/no real feedback yet, say so honestly."

**The implication for the roadmap:**

Every backlog priority today reflects agent judgment on technical and competitive grounds. That is better than random, but it is not validated. We do not know whether parents find onboarding confusing, which tab they actually open first, why they stop using the app after day 3, or whether the framing "developmental operating system" lands or alienates. Until we do, the roadmap is self-referential.

---

## 2. The intake mechanism — sources to wire, ordered by time-to-first-signal

### 2a. In-app feedback prompt (fastest: 1–2 weeks, requires a small code change)

A single-question floating prompt shown to parents after 3 completed sessions. One question, open text, zero friction. The trigger condition and copy:

- **Trigger:** 3rd session completed AND the user has not been asked in the last 30 days.
- **Question (EN):** "What would make Arbor most useful for you right now?"
- **Question (HE):** "מה יהפוך את Arbor לכי השימושי ביותר עבורך כרגע?"
- **Response store:** Firestore collection `parentFeedback/{uid}/{timestamp}` — text + child age band + session count. Parent-only (no child-identifying detail in the payload).
- **Display:** calm modal, parent register. Dismiss = "Maybe later." No repeat for 30 days.
- **Clinical / copy gate:** the question wording above is non-clinical and non-leading; no `arbor-clinical-lead` review required for this specific text. Any follow-up question that touches development, behavior, or speech must route to clinical.
- **Owner pod:** `arbor-api` (Firestore write) + `arbor-design` (the modal component). Ticket to `arbor-pm` as `AP-` item, riskClass: safe.

### 2b. App Store and Google Play reviews (medium: 4–8 weeks post-publish)

Once the iOS and Android apps are published (currently blocked on store-account gated steps), reviews will be the highest-volume passive signal. Wire `arbor-critic-feedback` to poll these on each CIL cycle:

- **iOS:** Apple App Store Connect RSS / App Store Connect API (review feed per territory — IL + NL first).
- **Android:** Google Play Developer API (reviews endpoint, paginated, filtered by territory).
- **What to extract per review:** star rating, date, locale, the verbatim text. No paraphrasing. The CIL evaluator synthesizes themes; the raw quote is the evidence.
- **Frequency:** pull on every weekly CIL build cycle; the nightly eval uses the cached set.
- **Prerequisite:** store accounts active + apps published. This is a Guy-gated Level 3 step (store submission).

### 2c. Support / inbox thread themes (medium: ongoing once a support channel exists)

There is currently no support channel. The fastest option is a single email address or a Typeform-backed contact link in the app footer. Once any support volume exists:

- Route support email to a `KK/research/` raw-ingest folder.
- `arbor-critic-feedback` reads threads each CIL cycle and extracts recurring complaint patterns as scored findings.
- Do not publish a phone number or promise human response SLAs the team cannot meet.

### 2d. Parent interviews — 5-parent script (the only source of qualitative "why")

Structured but lightweight. 30-minute moderated session over video call. Five parents, recruited from Guy's personal network or WhatsApp parent groups (IL-first given the marketing posture).

**Recruit profile (target mix for the first 5):**

| Slot | Profile |
| :-- | :-- |
| 1 | Parent of a 0–2yo in Israel, first child |
| 2 | Parent of a 3–5yo in Israel, concern about speech or language |
| 3 | Parent of a 3–5yo in Israel, no specific concern — typical development |
| 4 | Parent of a 6–10yo in Israel or Netherlands |
| 5 | Parent already using the app (if any exist at time of recruit) |

**Recruit channel:** Guy's WhatsApp contacts / the IL parent Facebook mega-group (`arbor-distribution` can seed a "looking for 5 parents for a 30-min paid session" post — but outbound to the group is a gated action requiring Guy approval).

**Incentive:** ₪100–150 Amazon/Gett credit per session. Budget: ~₪750 total. This is a Level 4 financial action; Guy must approve.

**The 5-question script (open-ended, non-leading):**

1. "Walk me through the last time you felt genuinely worried or confused about your child's development. What happened?"
2. "What do you do today when you notice something feels off with your child — where do you go, what do you look for?"
3. "I'd like to show you something for a few minutes. [Share screen: Arbor onboarding → Home tab → one AI coach response.] Tell me what you're thinking as you go through it."
4. "What would have to be true about this app for you to open it every day?"
5. "What would make you stop using it, or never start?"

**Note on clinical framing in the script:** questions 1 and 2 invite parents to describe real concern moments. This is standard qualitative research, not a clinical screen. No follow-up questions should ask the parent to assess or label their child's development. If a parent discloses a serious concern during the session, direct them to their pediatrician. Route any script changes that touch development, behavior, or speech to `arbor-clinical-lead` before use.

**Raw notes:** land in `PAI/projects/parenting-os-plugin/research/interviews/YYYY-MM-DD_{slug}.md` (create the folder on first use). Never publish verbatim quotes under a parent's name externally; internal use only.

### 2e. Analytics events that already exist per the CIL (leverage first)

The CIL notes that Arbor has no live analytics integration, but the app does have internal state that can serve as a proxy for engagement until a proper tool is wired:

- **Firestore session timestamps** — when parents open the app and for how long (derivable from auth + Firestore read timestamps if logged).
- **JITAI nudge delivery vs tap-through** — `jitai.ts` computes nudges; tap-through is not currently tracked but is a one-line addition.
- **AI coach query count per user** — loggable from the existing `arbor-ai` route.
- **Milestone log entries per session** — the append-only record already writes; count per parent per week is a retention proxy.

None of these replace real analytics. The minimum viable analytics instrumentation is one event per core action (app open, coach query sent, activity completed, milestone logged). `arbor-sre` owns wiring this; ticket as a separate `AP-` item.

---

## 3. The first sprint — first 5 real parent signals in 2 weeks

**Goal:** 5 signals in hand, each turned into a finding for `arbor-pm` to score against the backlog.

| Day | Action | Owner | Gate |
| :-- | :-- | :-- | :-- |
| Day 1–2 | Ship the in-app feedback prompt (AP- ticket via `arbor-pm` → `arbor-api` + `arbor-design`). This is the only path to passive signal while the store apps are not published. | `arbor-ux` writes the spec; `arbor-pm` triages; `arbor-api` + `arbor-design` build | riskClass: safe — no clinical gate required |
| Day 1–3 | Draft the WhatsApp recruit message and send to Guy for approval before any outreach. Budget ask: ₪750 for 5 sessions. | `arbor-ux` drafts; Guy approves (Level 4 — financial + outbound to people) | Level 4 gate |
| Day 3–7 | Run 5 interviews (video call, 30 min each, using the script above). Record with consent. | `arbor-ux` (or Guy if he prefers to be the interviewer given relationship with early network contacts) | Consent required per GDPR; verbal OK + a one-line email confirmation is sufficient at this scale |
| Day 7–10 | Transcribe and synthesize each session into one finding card per interview: what the parent did, what confused them, what they wanted. No paraphrasing into assumptions. Verbatim evidence. | `arbor-ux` | None |
| Day 10–14 | Hand 5 finding cards to `arbor-pm` formatted as candidate `AP-` tickets with the source marked "parent interview, [date]." `arbor-pm` scores and de-dupes against the existing backlog. Anything that contradicts a high-priority backlog item escalates to the Head of Product + `arbor-orchestrator`. | `arbor-pm` | None |

**What counts as a signal:** a parent's verbatim description of a real action or reaction. "She clicked the wrong tab three times before finding what she wanted" is a signal. "Parents probably want X" is not.

---

## 4. Standing cadence — voice-of-parent feeds the Product Council weekly

The Product Council runs weekly. Voice-of-parent must arrive as a structured input, not a verbal summary.

**The weekly input format (one short doc, filed before each Council):**

```
## VoP Pulse — week of [date]
**New signals this week:** [n]
**Source breakdown:** [in-app feedback n | interviews n | store reviews n | support n]
**Top finding (verbatim evidence):** [quote or behavioral observation + source]
**Contradicts backlog item:** [AP-xxx] or none
**Confirms backlog item:** [AP-xxx] or none
**Unaddressed theme (not yet in backlog):** [one sentence or none]
**Recommended Council action:** [promote to AP- | escalate to HoP | no action]
```

File location: `PAI/projects/parenting-os-plugin/research/vop-pulse/YYYY-WW.md`

**When there is no new signal this week:** file the doc anyway. Write "No new signals this week. Signal base remains thin." The Council needs to see the gap explicitly, not have it silently omitted.

**The Council's obligation on receipt:** if the VoP Pulse contradicts a top-5 backlog item, the Council does not ship that item until the contradiction is resolved or the evidence is weighed and a conscious decision is made to proceed anyway. This is the mechanism that stops the roadmap being self-referential.

**Escalation path:** if a parent interview or support thread surfaces something that contradicts the PRD for a feature already in a build wave, `arbor-ux` escalates to `arbor-orchestrator` immediately (do not wait for the Council). The wave pauses on that item.

---

## Self-evaluation

The three commitments this doc makes and whether they hold:

1. **No fabricated parent data.** Confirmed. No parent quotes, NPS scores, retention numbers, or usage statistics appear anywhere in this document. The signal inventory names every source as zero. The interview script is a prospective instrument, not a record of sessions that have occurred.

2. **Every recommendation is actionable this week.** Confirmed with one caveat. The in-app feedback prompt is actionable immediately (code + ticket). The interview recruit and budget require Guy's approval (Level 4), which is a gate, not a blocker — the recruit message can be drafted today. The App Store and Play review feeds require the store apps to be published first (a separate gated action already on the backlog). Analytics instrumentation is a separate `AP-` ticket to `arbor-sre`.

3. **Nothing invented about what parents want.** Confirmed. All characterizations of parent need in this document derive from the product's stated North Star and the existing clinical requirements — not from assumed user research. The backlog remains agent-graded until the interviews run.

**Honest read on signal thinness:** the signal base is as thin as it gets. Arbor is a live monetizing product with a brand domain, RevenueCat billing active, and a CIL running nightly — and there is not one data point from a real parent in the system. The in-app feedback prompt and the 5 interviews are the minimum to change that. Until they run, every priority decision carries unknown risk that a parent-informed pass would immediately reduce.
