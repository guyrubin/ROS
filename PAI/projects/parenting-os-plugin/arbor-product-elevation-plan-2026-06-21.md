# Arbor — Product Elevation Plan: more value, higher standard, every age

**Owner:** Head of Product · **Date:** 2026-06-21 · **Status:** CANONICAL product+UX plan — supersedes `arbor-two-languages-plan-2026-06-21.md`
**Source tree:** `C:\Users\dguyr\ROS\.arbor-build\app` · **Prod:** https://arborprd-westeu.web.app
**Method:** multi-agent (capability-recovery · parent/kid experience · baby-0-2 · school-age-7-10 → synthesis → adversarial verify), all code-grounded.

---

## 0. The bet

Arbor doesn't have a design problem — it has a **thinness** problem. The current look is right and should be **enhanced, not transformed**; what makes it read as a free version is that it's missing capabilities, depth, and a sophisticated interface that gets each user what they actually need. So the work is **value, capability, and experience — for the parent and for the kid — across more of childhood than we cover today.** Three moves: (1) **recover the value we already built but never surfaced** (the proactive insight, the visible trust, the narrated story); (2) **cover the ages we're missing** — babies 0–2, where developmental tracking is the whole point and our moat is strongest, and school-age 7–10, where the value shifts to education and the engagement has to grow up; (3) **raise the existing design to a consistent, premium standard** — fix the inconsistency and thin skeleton that read "free," same language, much higher bar. No rebrand. The differentiator throughout is the one asset no competitor owns: a parent-owned, append-only longitudinal record that makes every capability personal to *this* child.

---

## 1. Operating principles (binding)

- **Enhance, don't transform.** Keep the current design language (sage-paper + emerald-clay, Fraunces/Nunito/Heebo, the pack colors, the `.arbor-play` kid layer). Every story below works *within* it. No new visual identity, no new names.
- **Lead with value, not plumbing.** Each story is the user value first; the engineering is a terse `enabler:` clause.
- **Two audiences, each gets what they need.** Parent value (what's happening with my child, is it normal, what do I do today, when to involve a professional, am I doing well) and kid value (engagement that is genuinely developmental) are designed distinctly — within one enhanced system.
- **Gates.** Surveillance-not-diagnosis on all tracking; **G2** = cite the mechanism, never a clinical effect-size or "proven/validated" in user copy; child-health/biometric data and billing are **gated** (consent/COPPA-2026/GDPR, parent = named data controller); anything clinician-facing or percentile-like needs an **EU-MDR read** before ship.

---

## 2. Recover the value we already built

The #1 source of "free-feeling" thinness: Arbor computes more than it shows. Every row is **compute that already exists** — the work is delivery. *(Three rows were corrected against code at verify in the prior cycle; reflected here.)*

| ID | Capability | Why it's not delivering | Value when surfaced | Effort | Risk |
|---|---|---|---|---|---|
| R1 | **Coach citations** (`sourceCardsUsed` returned by server) | `CoachAnswerCards` never renders them | Every answer visibly grounded ("Based on: Siegel & Bryson") — trust is the GTM wedge | S | safe |
| R2 | **"Arbor Noticed"** proactive signal (`watch.ts` `watchSignals()`) | Only shows on the Screening nav; no proactive surface | A calm card that tells a parent something true about their child before they asked — the moat moment | S–M | safe |
| R3 | **Milestone / DevScore moments** (`growth/devScore.ts`, snapshots) | No threshold event, no shareable moment | "Maya crossed 80% in social" as a pride artifact (no face/surname) | S | safe |
| R4 | **"The Story of [Child]"** (`composeChildStory()`) | Buried in a sub-tab; exports plain `.txt` | The headline parent artifact — a narrated developmental biography, surfaced and shareable | M | safe |
| R5 | **Cited Daily Play** (`ActivitySource`, branch `claude/cil-week`) | Branch unmerged; no attribution shown | Each activity carries a personalized cited reason | S | safe (editorial review) |
| R6 | **JITAI nudge** (`jitai.ts` + FCM helper `server/pushTokens.ts`) | Fires only in a render-time `useMemo`; no scheduler/token-reg | The just-in-time nudge that anticipates the hardest hour | M | gated (push) |
| R7 | **Multi-child glance** (`FamilyGlanceCard`/`useFamilyGlance`, wired into `ProfileSwitcher`) | Surface exists but not promoted; add-child needs entitlement | The highest-retention cohort sees both kids at a glance | M | gated (billing) |
| R8 | **Weekly digest** (`server/digest.ts`, full payload) | No scheduler, no email/push channel | Sunday "[Child]'s Week" keeps Arbor present the 6 days the app is closed | M | gated (delivery) |

**Lead cluster (safe, do first): R1 + R2 + R3 + R4** — together they turn the dashboard from "a panel you check" into "a product that reaches out with things worth keeping."

---

## 3. Cover the ages we're missing

Arbor is built for ~3–6 (live screens are age 5). Two high-value cohorts are uncovered.

### 3A. Baby & toddler (0–24 months) — *tracking is the value; the engine is mostly already here*

This cohort is **parent-facing** (the baby can't use an app), so developmental **tracking + reassurance** is the hero — exactly where Arbor's moat is strongest. The CDC-2022 milestone library already spans **2–24 months**, **preterm correction is implemented and AAP-correct**, and the watch/DevScore engines are months-precise and age-agnostic. The blocker is a **keystone bug**, not missing intelligence.

| ID | Capability | Value | Note | Effort | Risk |
|---|---|---|---|---|---|
| **B0** | **Age in months / birthdate** *(keystone — do first)* | "Arbor knows my baby is 9 months, not '0', so everything it says is right" | `ChildProfile.age` is whole years; onboarding slider is year-steps → a 9-mo stored as 0 months. The entire 0–2 chain (milestones, corrected age, watch, DevScore) is months-ready and **fed the wrong age**. Capture-only fix. | S | safe |
| **B1** | **"Is my baby on track?"** born-corrected milestone view | Motor/language/social/thinking vs corrected age, with the everyday "looks like" picture | ~90% built (`milestoneData.ts` + `correctedAge()` + preterm banner). Pure presentation: open on the *current band*, domain-grouped, reassurance-first | S–M | safe |
| **B3** | **Daily rhythm log** (feeds / sleep / diapers) | "I log like every baby app — but here it becomes my child's permanent story and feeds the same reassurance" | Net-new collections on the proven append-only pattern (`GrowthEntry`/`PlayLog`); the daily hook for the months with no kid-facing play | M | gated (child-data) |
| **B2** | **Growth percentiles** (weight/length/head-circ) | "~40th percentile and tracking her own curve — here's the line for the pediatrician" | Growth capture exists; needs the WHO 0–24m reference + **bands not numbers**. Closest to a clinical output | M | **gated — EU-MDR read required** |

*(Later: B4 — Wonder-Weeks-style "a leap is coming" reassurance, computed from birthdate but grounded in CDC surveillance — cheap, high emotional payoff.)*
**Why it's a moat, not a baby app:** a parent who starts at 6 weeks has, by age 5, a four-year unbroken record. Competitors (Huckleberry/Kinedu/BabySparks) treat 0–2 as a disposable phase; Arbor makes it **chapter one of one record that never resets.** **Sequence:** B0 → B1 → B3 → B2 (gated).

### 3B. School-age (7–10 years) — *education + a register that grows up*

Arbor hard-stops at the "6 years +" band across milestones, reading (decoding only), hero journeys (`ageRange [4,8]`), and adventures (`[4,7]`). Two shifts at this age: value moves to **education / early-school skills**, and the cartoon-superhero register **will not attract a 9-year-old**. DevScore is age-open — it extends the instant the milestone set does.

| ID | Capability | Value | Note | Effort | Risk |
|---|---|---|---|---|---|
| **SA1** | **Extend milestone/DevScore to 7–10** *(cheapest, do first)* | A 9-year-old's parent gets a real "on track" read | Unlocks DevScore for the whole band with data, not code | S | safe |
| **SA2** | **Reading fluency + comprehension** (beyond phonics) | "Can my child *understand* what they read, and keep pace?" — the learn-to-read → read-to-learn shift | Extends the existing literacy ladder; leveled passages + inference, framed as a challenge not a quiz | M | safe |
| **SA3** | **Mature engagement register** *(gates adoption of the whole band)* | A 9-year-old won't open an app built for their little sibling | **Enhance, don't rebrand:** real progression/mastery/quests-that-can-be-failed over hero-poses; "Challenge/Mastery/Mission" copy; more child autonomy. Same components/tokens | M | safe |
| **SA4** | **Numeracy / early math** *(flagship net-new)* | Every rival leads with math; Arbor has **none** — where "is my child keeping up?" is sharpest | Number sense → fluency → word-problems-as-quests tied to the story; parent-mediated "do one at dinner" | L | safe (content lift) |
| **SA5** | **Homework & executive function** | "Can we get homework done without a meltdown?" — pure parent-mediated territory no ed app owns | Extends Arbor's strongest muscle (parent coaching + the `cognition_executive_function` domain already exists) | M | safe |
| **SA6** | **School social-emotional** (friendship, anxiety, resilience) | At school the hard moments move from tantrums to exclusion/fairness — and the parent isn't in the room | Reuses the hero-metric + dilemma spine at a school register | M | gated (clinical-lead review) |

**The wedge vs Khan/IXL/Prodigy:** they adapt to the *answer the child just gave*; Arbor adapts to *how this child has developed across weeks*, across reading+math+EF+social in one record. **Be honest:** we can't out-content IXL/Prodigy on depth — position as **the coach and the record (thin-but-connected, parent-mediated breadth)**, and point to deep drill where it's genuinely needed. Note Khan Kids, Duolingo ABC, and Lingokids all **age out at ~8** — 7–10 is an open seam. **Sequence:** SA1 → SA2 + SA3 (together) → SA4 → SA5/SA6.

---

## 4. Sharpen the two experiences + raise the design standard

### 4A. What each user needs (experience)
- **Parent experience:** answer the five questions a parent actually has — *what's happening · is it normal · what do I do today · what do I track · when do I involve a professional* — with the recovered capabilities (§2) surfaced where they're needed (the proactive card on Today, citations in the coach, the story surfaced, the milestone moment). Sophistication = fewer dead panels, more answers.
- **Kid experience (drives practice):** the engagement *is* the developmental rep. For 3–6, wake the existing hero/play world so the child shows up (K-track below); for 7–10, mature the register (SA3). Every mechanic earns its keep clinically (speech / emotion / comprehension / numeracy).

| ID | Kid-experience story (3–6) | Enabler | Effort |
|---|---|---|---|
| K1 | **The kid world wakes up** — story beats render as cinematic hero panels, not emoji | **Unlock = avatar first-run adoption (D3) + a branded fallback (D6)** so a child with or without an avatar sees a rich world; verify the journey returns `imagePrompt`. *(Not "author prompts" — corrected at verify.)* | M |
| K2 | **Voice Unlocks** — the gate opens only on the produced sound | Map phoneme targets to scene gates | M |
| K3 | **Earned-moment celebration** — a badge visibly joins the hero; parent gets a pride chip | Achievement event over `cosmetics.ts`/`achievements.ts` | S–M |
| K4 | **Show-a-friend artifact** — a short comic of the session, real answers as bubbles, no real face | Compose over existing `/generate-comic` + cache | M |

### 4B. Design enhancement — make it look paid (not a rebrand)
The "free version" feel is **inconsistency + thin skeleton**, fixable within the current language. This track operationalizes the CIL's existing Q-items into a "premium standard" sweep:

- **Consistency sweep** — one consistent application of the existing tokens (kill the ~31 inlined CTA gradients + ~101 raw hex literals; Q1). One spacing/elevation/radius scale used everywhere.
- **Kill the skeleton** — every tab gets real **empty / loading / error** states (5 tabs render bare today; PC10), proper density, and depth (layered shadow, not flat) so screens feel finished, not wireframe.
- **Craft pass** — motion + reduced-motion consistency (Q3), focus-visible + AA contrast + 44px targets (Q4), full Hebrew/RTL parity (Q5).
- **Enforce it** — a CI guard so surfaces can't regress to bare emoji/skeleton; an art-direction critic in the weekly CIL that scores "does this read as paid."

---

## 5. Ranking & sequencing

Priority favors **cheap recoveries + correctness keystones** that lift perceived value fastest, then the age expansions and depth.

**First to build (safe, highest leverage):**
1. **B0** — age in months. One small fix makes Arbor *correct for babies* and unlocks the whole 0–2 track. Keystone.
2. **R1 + R2** — coach citations + "Arbor Noticed". The trust wedge and the moat moment, compute already done.
3. **SA1** — extend milestones to 7–10; DevScore lights up for the older band.
4. **R3 + R4** — milestone pride moment + the surfaced Story of [Child].
5. **K1** — wake the 3–6 kid world (avatar adoption + branded fallback).
6. **4B consistency + skeleton sweep** — the "looks paid" pass (Q1 + empty/loading/error states).
7. **B1** — born-corrected baby milestone view.
8. **SA2 + SA3** — reading comprehension + the mature register (ship together).

**30 / 60 / 90:**
- **30 — correctness + visible value:** B0, R1, R2, SA1, the consistency/skeleton sweep starts. *Outcome:* the app is correct for babies, surfaces trust + a proactive insight, and stops looking wireframe.
- **60 — the artifacts + the kid world:** R3, R4, K1, B1, K3/K4. *Outcome:* parents get a thing worth keeping; the 3–6 kid world is cinematic, not emoji.
- **90 — depth + the older band:** SA2, SA3, SA5, B3; SA4 (math) scoped/started. **Gated, queued for Guy:** B2 (EU-MDR), R6 push, R7 multi-child, R8 digest, SA6 school-SEL.

---

## 6. Decisions for Guy

1. **Age-band priority.** Both are high-value; **B0 (baby keystone) is nearly free and I'd do it first regardless.** Beyond that — lead with the **baby track** (tracking, our strongest moat, mostly already built) or the **school-age track** (bigger market pull, bigger build)? My rec: baby first (cheap, differentiated), school-age reading+register second, math as the funded flagship.
2. **Math scope (SA4).** Build numeracy in-house (L, the flagship), or position Arbor as the coach/record and **point to** Khan/IXL for deep drill? This is a build-vs-partner call.
3. **B2 percentiles** need an **EU-MDR / surveillance-vs-measurement read** before ship — approve starting that regulatory review?
4. **Gated rollout posture.** Keep push (R6), multi-child (R7), digest (R8), rhythm-log (B3), percentiles (B2) **drafted-first / built-green-on-a-branch / shipped only on your go**, while the safe in-app recoveries ship autonomously?
5. **G2 + face-safety + surveillance-not-diagnosis** as standing gates on every story above — confirm.

---

## 7. What's net-new vs prior backlogs

Recoveries map to existing IDs (PC7 citations, T4 story, V1 milestone card, CR-* CIL items, D3/D6 for K1). **Net-new in this plan:** the **baby 0–2 track** (B0–B4) and the **school-age 7–10 track** (SA1–SA6) — two age bands Arbor has never covered — plus the **"make it look paid" design-enhancement sweep** framed as a premium-standard track rather than a rebrand. The persistent correction worth keeping visible: the kid-world unlock is **avatar adoption + fallback**, not prompt authoring (verified against `HeroScenePlayer.tsx:67` + the AI-generated `imagePrompt` path).
