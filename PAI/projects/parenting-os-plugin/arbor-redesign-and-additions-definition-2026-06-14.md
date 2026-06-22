# Arbor — Redesign & Additions Definition (grilled)

**Date:** 2026-06-14
**Method:** Evaluated with the *grill-me* interview lens (mattpocock/skills) — every decision below was interrogated to a resolved conclusion, not a polite list. Where a real fork exists, the **recommended resolution** is stated so you can override it.
**Decision locked in the grill:** Pursue **all three** capabilities (Rhythm, Daily Play, Ask-a-Specialist) — they are one moat (longitudinal child memory) wearing three faces. Not dropped; **sequenced by build-readiness**, all hanging off the memory spine.
**Anchored to the live IA:** `app/src/lib/navigation.ts` — 7 sidebar sections, post-Wave-1 (22→17 surfaced leaves).

---

## Part A — The grilled evaluation (Arbor vs the field)

The honest answers to the questions that matter.

**Q: What does each competitor actually win on, in one sentence?**
- **Huckleberry** — opens to a *predictive daily view* (SweetSpot nap timing). The app tells you something about *today* before you ask. That's the stickiness.
- **Kinedu / Lovevery** — answer "what do I do with my kid today" with a stage-matched activity; Lovevery kills friction with *household-item* DIYs and challenge-targeted *Course Packs*.
- **Cleo / Cooper / Maven** — put a *real named human expert* behind the app; that relationship is the trust and the retention.

**Q: Where does Arbor actually stand against them — not the pitch, the product?**
- Arbor's **Home is a static card screen**, not a living daily surface. It does not tell the parent anything about *today*. On the single axis that drives daily return (Huckleberry's), Arbor currently loses.
- Arbor has **drills (Practice Studio), not an everyday-play engine**. On Kinedu/Lovevery's axis, Arbor has depth in a narrow lane (speech/articulation) but no broad low-friction "today's play" loop.
- Arbor's **expert layer (Care Network: find-pro, care-team, reports, handoff) is half-real** — partly rebuilt, partly mockup, non-transactional. On Cleo/Cooper's axis, Arbor has the *architecture* (Child Memory + Trusted Sharing) but no live human on the other end.

**Q: So what does Arbor have that none of them have — and is it exposed?**
- The **longitudinal child-memory record** (`/api/memory`) + **server-enforced Trusted Sharing** + an **expert-reviewed knowledge base**. This is the genuine moat. **It is buried** — Child Memory and Trusted Sharing are leaf tabs inside an 8-item "My Child" section and a 6-item "Care Network." The thing that makes Arbor uncopyable is hidden three clicks deep.
- **Verdict:** Arbor doesn't have a capability problem. It has a **center-of-gravity problem**. The moat is real but dormant; the daily surface is missing; the competitors' three hooks are each *latent* in Arbor's data but not *expressed*. The redesign's job is to **move memory to the center and make today the home screen**. The additions' job is to **turn the dormant data into the three hooks**.

**Q: The trap to avoid?**
Adding three features on top of today's 22-view, static-Home structure reproduces the current disease (scattered surfaces, dormant moat). **Redesign must precede or accompany additions, not follow them.**

---

## Part B — What needs to be REDESIGNED (to enhance current capability)

Five redesigns, ordered by leverage. Each: *problem → change → detail → acceptance.*

### B1. Home: from static cards → the living **Daily Home** (highest leverage)
- **Problem:** `overview` is a decision-hero + status cards. It's a *snapshot*, not a *reason to open the app daily*. This is the root cause of the unproven retention metric (H1).
- **Change:** Rebuild Home as a **time-aware daily surface** that answers "what about my child, today?" the moment it opens. It becomes the host for the three additions.
- **Detail (the new Home, top to bottom):**
  1. **Today's Rhythm strip** (Addition 1) — the predicted day: wind-down window, friction band, calm/focus band, drawn on a horizontal day-bar using the semantic ramp.
  2. **One thing to do today** — a single Daily Play card (Addition 2) or, if a friction window is imminent, the relevant Plan script surfaced *at the right time*.
  3. **One thing worth noticing** — a memory-derived nudge ("3rd late bedtime this week" / "turn-taking has come up twice") that links into the timeline. This is the moat made visible on Home.
  4. **Quick capture** — one-tap "Log a moment" (already exists) kept prominent; capture feeds Rhythm + memory.
- **Acceptance:** opening Home with ≥14 days of logs shows a personalized prediction + one action + one memory insight, all above the fold, no scrolling, AA contrast, `prefers-reduced-motion` honored. Sparse-data state is honest, not empty.

### B2. "My Child" (8 leaves): collapse the four "Development *" views into one spine
- **Problem:** `intelligence` surfaces **Development Dashboard, Development Profile, Development Milestones, Development Check** — four views with the same prefix the parent cannot tell apart, plus Story, Moments, Language, Child Memory. This is archive sprawl; the IA's own comment admits Wave-1 only partially tamed it.
- **Change:** Make **Story (the timeline) the spine** of My Child; demote the rest to *facets of the timeline*, not equal-weight tabs.
  - **Development Dashboard + Profile + Milestones** → one **"Development"** view with internal tabs (Now / Milestones / Profile), since all three read the same underlying band/skill data.
  - **Development Check (screening)** → an *action surfaced from the timeline* ("worth a quick check?") rather than a standing tab.
  - **Child Memory** → **stop being a leaf**; it becomes the connective layer rendered *inside* Story and surfaced on Home (B1.3). It's the moat — it should be everywhere, not a tab.
- **Detail:** target My Child = **Story (spine) · Development (Now/Milestones/Profile) · Moments · Language & Communication**. Memory and Screening become behaviors of the spine, not tabs. Net: 8 leaves → 4 + 2 inline.
- **Acceptance:** a parent can state, unprompted, what each remaining item is for; no two items overlap in purpose.

### B3. Care Network (6 leaves): from mockup shelf → one **transactional** handoff flow
- **Problem:** `care` has care-team, find-pro, **Reports & Handoffs**, Trusted Sharing, appointments, **Safety & Escalation** — overlapping and largely non-transactional. Reports vs Handoff vs Find-a-Pro are three doors to the same intent.
- **Change:** Reorganize around **one verb — "get expert input"** — which is exactly where Addition 3 (Ask-a-Specialist) lands. Collapse Reports/Handoff/Find-a-Pro into a single **Consult** flow (build the packet → choose: export to my own pro *or* send to an Arbor expert). Keep **Trusted Sharing**, **Appointments**, **Safety** as distinct (different jobs).
- **Detail:** Care Network = **Consult (handoff packet → export/send) · My Care Team · Trusted Sharing · Appointments · Safety**. Find-a-Pro becomes step 2 of Consult, not a standing tab.
- **Acceptance:** every Care item performs a real action (no dead CTAs); the handoff packet is generated from real `/api/memory` data, parent-redacted before any external step.

### B4. Practice Studio vs Daily Play: draw the line before adding
- **Problem:** Adding Daily Play (Addition 2) next to Practice Studio's 6 drill views risks a fourth "things to do" surface and parent confusion.
- **Change / rule (resolved):** **Practice Studio = targeted drills the parent chooses to open** (speech, mimic, feelings, adventures). **Daily Play = the one everyday developmental activity Arbor pushes to Home.** Daily Play lives on Home; Practice Studio stays the destination for deliberate practice. Cross-link, never duplicate.
- **Acceptance:** Daily Play never shows a drill that's better served inside Practice Studio; Practice Studio never claims to be "today's activity."

### B5. Naming & moat exposure (cheap, do alongside everything)
- Kill the repeated "Development" prefix (B2). Rename so each label is a distinct job.
- **Surface the moat in language:** Home's memory nudge, Story's memory layer, and the Consult packet should all visibly say *"because Arbor has been tracking [child] since [date]…"* — make the longitudinal advantage legible, since it's the one thing competitors can't claim.

---

## Part C — What needs to be ADDED (very detailed)

Three additions, each a face of the memory moat. Build-level detail.

### C1. Rhythm — predictive daily timeline *(build first)*
- **Job:** anticipate today's friction/calm/wind-down windows from the family's own logs; host on the new Daily Home.
- **Data in:** existing event logs — sleep/nap, `behaviors`/Moments (timestamp + mood tag), Language/practice sessions, meals if logged. Age-band priors for cold-start.
- **Engine** — new pure module `app/src/rhythm/predict.ts` (mirror `practice/signals.ts` discipline: pure, deterministic, unit-tested ≥15 cases):
  - Build a per-child **rolling event-by-time-of-day histogram** over a trailing 14–28-day window.
  - Emit: `{ windDownWindow, frictionBands[], calmFocusBand, confidence }`. `confidence` = f(data density); below a threshold return a `needsMoreData` state with how many days remain.
  - **No ML in v1.** Rules + simple stats. Ranges/bands, never exact minutes (toddler signal is noisy — over-precision destroys trust).
- **UX** — `RhythmStrip.tsx` on Home: horizontal day-bar, friction=amber, calm=green, focus=blue (semantic ramp). Tap a window → contextual action (wind-down → relevant Plan script; friction → "have your script ready"). `prefers-reduced-motion` gates any animation; bar is keyboard-operable, AA contrast.
- **Memory loop:** write prediction + actual outcome back so accuracy is shown ("right 6 of last 7 days") and the histogram self-corrects.
- **Guardrails:** non-clinical framing ("based on your logs," never "your child should"); degrade gracefully on sparse data.
- **First proof metric:** % of returning users who open Home and the Rhythm strip is correct (self-reported thumbs or outcome-match) — this is the retention bet.

### C2. Daily Play — behavior-aware activity engine *(build second; start content now)*
- **Job:** 1–3 stage-appropriate activities for *today*, household-items-first, each tagged to the skill it builds, **selected by band + recently-logged behavior** (the part Kinedu/Lovevery can't do), completion writes back to the timeline.
- **Content bank** — `app/src/playbank/` (mirror `practice/` content-bank pattern). Atomic JSON/MD per activity: `{ id, band, domain, skillTags[], householdItems[], steps[], whatItBuilds, durationMin, source/reviewedBy }`. **Seed 40–60 hand-authored, expert-reviewed** activities across bands × domains (quality over Kinedu's 2,000; expert-reviewed knowledge is the stated moat). AI-generated activities = fast-follow (reuse the AI-adventures path).
- **Selector** — pure, tested: rank = (band match) × (skillTag overlap with recently-logged concern domains, from Moments/Memory) × (novelty / not-recently-done). Falls back to band-only when logs are sparse (no cold-start failure).
- **UX** — `DailyPlayCard.tsx` on Home (B1.2): activity + household items + **"What this builds"** + one-tap **"Did this"** → writes a moment to the timeline; optional photo (reuse existing photo pipeline) as a memory artifact. Cap at 1–3; skipping is guilt-free; **no streaks, no shame** (anti-overwhelm).
- **Phase 2:** **Courses** (Lovevery Course-Pack analog) — sequence activities into a short challenge track ("Building frustration tolerance — 7 days"), targeted by the child's logged concern.
- **Tie-ins:** "Coach me on this" → existing CoachTab; skillTags reconcile with the Development/Milestones view so play nudges milestones.

### C3. Ask-a-Specialist — warm human handoff *(build third; ship Phase 1 early — it's nearly free)*
- **Job:** async consult with a vetted human, **auto-warm-started with a parent-redacted handoff packet** built from longitudinal memory. The differentiator vs Cleo/Cooper (who start cold).
- **Trigger:** coach `high_stakes` route (`ai/modelRouter.ts`) *or* explicit "talk to a real person" tap → "Ask a Specialist" CTA.
- **Handoff packet:** generated from `/api/memory` + existing `lib/` report exporters (don't rebuild). Includes developmental timeline, recent patterns, what's been tried, safety flags. **Parent reviews + redacts before send** (redaction layer already shipped) — **Safety Level 3, explicit confirm; GDPR consent gate** (sensitive child data).
- **Routing — phased (resolved to de-risk the marketplace):**
  - **Phase 1 (ship early, almost free):** "Export packet to my *own* professional" — no supply needed; proves parents want the warm handoff. Plus a single partner SLP/coach (Israel expert engine) for async messages.
  - **Phase 2:** vetted directory (categories mirror Maven: sleep, dev-psych, **speech**, OT), async Q&A, paid consults.
- **Data model:** new `consult` entity `{ childId, packetSnapshot, expert, status, thread }`; sharing scope extends existing server-enforced Trusted Sharing; professional view = read-only child context + reply.
- **Monetization:** per-consult fee or premium-tier inclusion (slots into existing pricing tiers) — this is where willingness-to-pay gets tested, *after* retention (C1) is proven.
- **Guardrails:** non-diagnostic even with a human in loop (experts advise, Arbor doesn't diagnose); credentialing + DPA legal review before Phase 2.

---

## Part D — Sequence & dependency order (all three, nothing dropped)

| # | Work | Type | Why this order | Gating dependency |
|---|---|---|---|---|
| 1 | **B1 Daily Home shell** + **C1 Rhythm** | Redesign + Add | Smallest, reuses logs, hits the retention kill-metric, creates the host surface the other two plug into | None — existing logs |
| 2 | **B2 My Child collapse** + **B5 naming/moat exposure** | Redesign | De-sprawls the archive, surfaces memory; cheap, high-clarity | Can run parallel to 1 |
| 3 | **C2 Daily Play** (engine + 40–60 seed activities) | Add | Biggest retention upside; content authoring starts in parallel with 1 | Content bank + expert review |
| 4 | **B3 Care → Consult** + **C3 Ask-a-Specialist Phase 1** | Redesign + Add | Activates the dormant moat; Phase-1 packet export is nearly free given existing memory + exporters | Redaction (done) + GDPR/legal sign-off |
| 5 | **C2 Courses** + **C3 Phase 2 marketplace** | Add | Monetization layer — only after retention (1,3) + trust (4) are proven | Expert supply + WTP signal |

**The through-line:** every step makes the **longitudinal child-memory moat** more visible and more useful. Redesign moves memory to the center (Home + Story spine); additions turn memory into the three competitor-beating hooks. Nothing competitors do is copied without Arbor's memory making it better.

---

## Open decisions still needing your call (grill residue)
1. **Beachhead concern for Daily Play / Rhythm tuning** — behavior/regulation, sleep, or speech first? (Tunes which logs the engines lean on and which seed activities to author first.) *Recommended: behavior/regulation — it's where Arbor is differentiated and where Moments data is richest.*
2. **Ask-a-Specialist Phase-1 expert** — your own partner SLP/coach, or pure packet-export-to-parent's-pro only? *Recommended: packet-export only for v1, add one partner expert once the export flow shows demand.*
3. **Content authoring capacity** — who expert-reviews the 40–60 Daily Play activities, and by when? *This is the critical-path constraint for step 3.*

---

## Sources
Competitor research carried from [arbor-competitive-analysis-and-feature-defs-2026-06-14.md](./arbor-competitive-analysis-and-feature-defs-2026-06-14.md). Live IA from `app/src/lib/navigation.ts`.
