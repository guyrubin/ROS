# Arbor Academy + Playbank — Peterson-Inspired Backlog

**Created:** 2026-06-19
**Owner:** PAI (Arbor)
**Scope:** The Academy (Story Journeys, Hero Comics, Parent Masterclasses, Family Formation) and the Playbank (Hero Arcade practice hub), for both the **child** and the **parent**.
**North star:** *"Help a parent become the calm, competent adult their child needs"* — and let the child **enact** virtue inside an archetypal hero's journey, rather than be lectured.
**Source review:** the full-resolution Peterson-lens audit (this session). Defect IDs (`D1`–`D14`) below refer to that review's defect list.

---

## How to read this backlog

```
EPIC        → a large, outcome-shaped theme (one Peterson principle)
  FEATURE   → a shippable slice of the epic
    TASK    → a concrete, codeable unit with acceptance criteria
```

**Legend**
- **Priority:** `P0` corrects something the product currently teaches *backwards* or an unbuilt thesis · `P1` high value · `P2` valuable · `P3` later
- **Size:** `S` <½ day · `M` ~1 day · `L` 2–3 days · `XL` needs further breakdown
- **Type:** `fix` · `content` · `capability` · `enhancement`
- Tasks are checkboxes so this doubles as a tracker.

**Cross-cutting Definition of Done (every task):** `tsc` clean · tests pass · green-gated · **bilingual EN+HE (RTL-safe)** · AA contrast · reduced-motion safe · child copy stays warm/wholesome, parent copy stays calm/anti-grandiose.

---

## Peterson principles → where they live

| Principle (from `arbor/CLAUDE.md:41-67`) | Epic |
|---|---|
| Truth before avoidance ("tell the truth") | **A**, **B** |
| Responsibility before comfort; meaning over distraction | **A**, **E**, **F** |
| Order before chaos; voluntary confrontation with the dragon | **A**, **C** |
| The great archetypal stories (Maps of Meaning) | **C** |
| Help the parent become the calm competent adult; the Six Frames | **D** |
| Family as the first institution; the family's story | **E** |
| Aim at the highest good (telos) | **F** |
| Competence before dependence; stand up straight (hierarchy of competence) | **G** |

---

# EPIC A — Truthful Story Engine: stop rewarding avoidance
**Peterson:** *Truth before avoidance; responsibility = meaning; every choice has a cost.*
**Problem:** the choice scoring currently awards virtue points to the avoidant option (D1), and the generation contract removes all stakes ("always resolves kindly / no choice harshly punished", D6), so the monomyth teaches that courage is free and that retreat is "wisdom."
**Outcome:** choices carry real, non-punitive consequences; virtue is earned, not handed out for backing away.
**Files:** `app/src/lib/heroJourneys.ts`, `app/src/routes/api.ts`, `app/src/components/tabs/HeroJourneyTab.tsx`, `heroJourneys.test.ts`

### Feature A1 — Re-map choice scoring so avoidance ≠ virtue · `P0` · `fix`
- [ ] **A1.1** Audit all 10 stories' `decision` choices and re-grade `metricDeltas` so the avoidant `a` choice awards **0 virtue points** (or only a small, honestly-named delta when the retreat is genuinely framed as honest self-knowledge). `S` — `heroJourneys.ts`
- [ ] **A1.2** Fix the two inverted specifics: Solomon `a` "Decide fast" (`courage:1` → remove) and any "walk away / stay quiet / give up" → `wisdom:1` (remove). `S`
- [ ] **A1.3** Introduce a small **"self-honesty"** delta concept (optional) for choices where the character honestly names their limit, so the cautious path can still model *truth* without modeling *abdication*. `S`
- [ ] **A1.4** Update `applyChoice` tests to assert avoidance earns no primary-virtue points. `S` — `heroJourneys.test.ts`
- **Acceptance:** no decision option labeled retreat/avoidance/impulsivity awards `courage`/`wisdom`/`responsibility`; tests lock it.

### Feature A2 — Real, age-safe stakes in Fear → Decision → Consequence · `P1` · `enhancement`
- [ ] **A2.1** Revise the generation contract so conflict is *felt* before it resolves: keep "resolves kindly" but drop "always" framing; the **Fear** beat must let the dragon be genuinely big. `S` — `api.ts` (`/generate-hero-journey` prompt ~`:1270`)
- [ ] **A2.2** Make the avoidant **Consequence** land honestly (it already does in narration — "the cub stays cold"; ensure all 10 do). `S` — `heroJourneys.ts`
- [ ] **A2.3** Add a "cost of the brave choice" line to the `c`/`b` consequences so the sacrifice is visible (Peterson: the gold costs something). `M`
- **Acceptance:** a parent reading any story sees the stakes were real and the brave choice cost something; nothing becomes frightening or punitive for the child.

### Feature A3 — Restore the descent & the cost of transformation · `P2` · `content`
- [ ] **A3.1** Jonah: re-frame the fish as the **belly of the beast / the depths** (age-safe), not "calm gentle fish," so the descent-and-return reads. `S`
- [ ] **A3.2** Jacob: restore the **mark of the struggle** (the limp / "you don't come through unchanged") + the **new name** meaning. `S`
- [ ] **A3.3** Add an explicit death→rebirth note to the **Growth** beat spine where archetypally true. `S`
- **Acceptance:** the transformation is *earned through cost*, not asserted.

### Feature A4 — Break the rigid a/b/c formula into genuine dilemmas · `P2` · `enhancement`
- [ ] **A4.1** Identify 3 stories where "ask for help" (b) or the patient path is genuinely the wisest, and re-weight so `c` isn't always the "right" answer. `M`
- [ ] **A4.2** Add a per-story `dilemmaType` tag (`courage` | `prudence` | `repair` | `patience`) so the catalog can teach that the hero move differs by situation. `S` — `types.ts`, `heroJourneys.ts`
- **Acceptance:** a child can't win by always picking the bravest-sounding option.

---

# EPIC B — The Truth Virtue & a coherent virtue system
**Peterson:** *"Tell the truth, or at least don't lie"* is the central rule — and it's currently absent (D2).
**Problem:** metrics are `courage/responsibility/resilience/empathy/wisdom`; Truth is missing while empathy is elevated (D3); the `growth` pack maps to a non-existent metric (D4); Wisdom has only 1 story (D5).
**Outcome:** Truth is a first-class virtue with stories; the pack/metric taxonomy is coherent and balanced.
**Files:** `app/src/lib/heroJourneys.ts`, `app/src/types.ts`, `app/src/components/tabs/HeroJourneyTab.tsx`, `i18n.ts`

### Feature B1 — Add **Truth/Honesty** as a first-class virtue · `P0` · `capability`
- [ ] **B1.1** Add `truth` to `DevelopmentMetricId` + `METRIC_IDS` + `METRIC_LABELS` + `METRIC_COLORS` + `METRIC_EMOJI`. `S` — `types.ts`, `heroJourneys.ts`, `HeroJourneyTab.tsx`
- [ ] **B1.2** Add a **Truth pack** (`PACKS`) with EN/HE labels ("Truth" / "אמת"). `S`
- [ ] **B1.3** Wire Truth into `emptyMetrics`, the hero-banner power chips, and the dev-metrics rollup. `S`
- **Acceptance:** Truth appears as a metric + pack everywhere the other five do.

### Feature B2 — New Truth stories · `P1` · `content`
- [ ] **B2.1** Original story **"The Stone That Told the Truth"** (or similar): owning a mistake vs hiding it; truth restores order. `M`
- [ ] **B2.2** Biblical **Jacob & Esau / the stolen blessing → reconciliation** OR **Joseph reveals himself** angle reframed on the truth axis. `M`
- [ ] **B2.3** Each Truth story: 8-beat spine, 3 choices (with A1 scoring), `parentReflection`, EN+HE titles. `M`
- **Acceptance:** ≥2 stories where the central dilemma is *tell the truth vs avoid/lie*.

### Feature B3 — Reconcile pack ↔ metric taxonomy · `P2` · `fix`
- [ ] **B3.1** Rename the `growth` pack → `resilience` (or add a derived pack→metric map) so packs and metrics align. `S` — `heroJourneys.ts`, `HeroJourneyTab.tsx`, `HeroComicsTab.tsx`, `i18n.ts`
- [ ] **B3.2** Update any pack-color / pack-label maps that assume the old id. `S`
- **Acceptance:** no pack references a non-existent metric; UI unaffected.

### Feature B4 — Rebalance the canon · `P2` · `content`
- [ ] **B4.1** Add ≥2 Wisdom stories so every pack has ≥3 (D5). `M`
- [ ] **B4.2** Re-tag stories so each of the 6 virtues has dedicated coverage. `S`
- **Acceptance:** balanced pack distribution; every virtue has ≥2 stories.

---

# EPIC C — Expand the archetypal canon (Peterson's core stories)
**Peterson:** *Maps of Meaning* — the great stories encode the deepest psychological truths.
**Problem:** his most-cited stories are missing.
**Outcome:** the canon includes the foundational archetypes, age-translated.
**Files:** `app/src/lib/heroJourneys.ts`, `STORY_ART`/`STORY_COMIC` maps in the two tabs

### Feature C1 — Cain & Abel → "The Two Gifts" · `P1` · `content`
- [ ] **C1.1** Age-safe original-framed story on **sacrifice & resentment**: when your gift isn't accepted, you can resent or you can offer better. (No violence; the "monster at the door is resentment.") `L`
- [ ] **C1.2** Map to **Truth + Responsibility** virtues; decision = nurse the grudge vs take responsibility for your own offering. `S`
- **Acceptance:** the story teaches "responsibility for your own bitterness," Peterson's #1 psychological lesson, without graphic content.

### Feature C2 — Abraham's Call → "Leave the Tent" · `P1` · `content`
- [ ] **C2.1** The archetypal **voluntary departure into the unknown** (the purest Call to Adventure). Map to Courage + Faith/Aim. `L`
- **Acceptance:** a story whose whole engine is *choosing* to step from safety into chaos toward a promise.

### Feature C3 — Conscience / the Fall → "The Fruit and the First 'Sorry'" · `P3` · `content`
- [ ] **C3.1** Very age-careful story on **conscience, shame, and repair** (knowing right from wrong, hiding vs owning). Gate to ages 6–8; route through arbor-safety. `XL` — needs design + safety review first.
- **Acceptance:** approved by safety; never shaming; lands on repair, not guilt.

### Feature C4 — Original archetype set · `P3` · `content`
- [ ] **C4.1** "The Tyrant and the Town" (confronting illegitimate power — the tyrannical-father archetype, distinct from Moses). `M`
- [ ] **C4.2** "The Friendly Monster" (integrate the shadow: strength under control, "a harmless hero is not a good hero"). `M`
- **Acceptance:** shadow + tyrant archetypes represented.

---

# EPIC D — The Parent Formation Engine (the thesis)
**Peterson:** *be the calm, competent adult; the Six Frames (Aim, Two Axes, Story, Shadow, Marriage, Shepherd).*
**Problem:** Masterclasses are 0% built (8 "coming soon" shells), the Six Frames appear nowhere in the Academy (D8, D9), and the reflection is generic + frame-less + English-only (D10). This is the stated product thesis sitting unbuilt.
**Outcome:** a real engine that builds *parent* competence, routed through the Six Frames, personalized by the family's values and the child's data.
**Files:** `app/src/components/sections/Masterclasses.tsx`, `app/src/components/tabs/HeroJourneyTab.tsx`, `app/src/contracts/coach.ts`, new content files, `i18n.ts`

### Feature D1 — Build real Masterclasses · `P0` · `capability` + `content`
- [ ] **D1.1** Define a `Masterclass` content model (`id`, `title`, `frame` (one of the Six Frames), `durationMin`, `sections[]`, `parentScript`, `tryTonight`), EN+HE. `M` — new `lib/masterclasses.ts`
- [ ] **D1.2** Author the first 4 masterclasses as real lessons (text-first, audio later): "Holding the Line Without Anger" (Two Axes), "Building Responsibility by Age" (Aim/competence), "How to Repair After Conflict" (Shepherd/Marriage), "Raising Courage Without Harshness" (Story). `L`
- [ ] **D1.3** Replace the static "coming soon" grid with a real reader: open → read sections → "Try tonight" action → mark complete. `M` — `Masterclasses.tsx`
- [ ] **D1.4** Persist completion per parent; show progress. `S`
- **Acceptance:** ≥4 masterclasses are readable, frame-tagged, completable, bilingual; no "coming soon" on shipped ones.

### Feature D2 — Reflection 2.0 (archetypal reading + Six Frames) · `P1` · `capability` + `content`
- [ ] **D2.1** Add a per-story `parentInsight` (the Peterson reading: *why this story, what it forms*) to each story spec, EN+HE. `L` — `heroJourneys.ts`, `types.ts`
- [ ] **D2.2** Render a parent-only "Why this story" panel on the reflection beat, routed through the relevant frame(s) (Aim / Shadow / Shepherd). `M` — `HeroJourneyTab.tsx`
- [ ] **D2.3** Localize the reflection chrome ("Today we practiced", "Talk about it together", "Finish & save") to Hebrew (D10). `S` — `i18n.ts`, `HeroJourneyTab.tsx`
- **Acceptance:** after a story, the parent learns the archetypal meaning + one frame-based action; fully bilingual.

### Feature D3 — Personalization: Charter + child data drive the parent layer · `P2` · `capability`
- [ ] **D3.1** Surface the masterclass/reflection most relevant to (a) the Family Charter values and (b) the child's lowest-signal domain / recent behavior logs. `L`
- [ ] **D3.2** "Recommended for your family" rail on the Academy home. `M`
- **Acceptance:** what the parent is offered changes with their values + their child's real data (the moat), not a static list.

### Feature D4 — Parent competence loop (not dependence) · `P3` · `capability`
- [ ] **D4.1** Track the parent's *own* growth (frames practiced, scripts used, conflicts repaired) and reflect it back ("you've been holding the line warmly for 2 weeks"). `M`
- **Acceptance:** the loop moves responsibility toward the parent's competence (the jbp test), never toward app dependence.

---

# EPIC E — Family Formation rituals
**Peterson:** *family as the first institution; "the stories your family tells about who you are."*
**Problem:** the Family Charter works, but all 6–7 rituals are shells (D9) — including **Truth Practice** and **Family Story Canon**, which are the most on-doctrine.
**Outcome:** the family runs real, repeatable formation rituals tied to their Charter.
**Files:** `app/src/components/sections/FamilyFormation.tsx`, new content, `i18n.ts`

### Feature E1 — Truth Practice ritual · `P1` · `capability` + `content`
- [ ] **E1.1** A weekly family habit that makes honesty + repair safe and normal (a script + a tiny tracker: "this week we told a hard truth / we repaired"). EN+HE. `M`
- **Acceptance:** the missing central virtue gets a concrete family practice.

### Feature E2 — Responsibility Ladder · `P1` · `capability` + `content`
- [ ] **E2.1** Age-banded chore/competence ladder ("order before chaos; competence before dependence"), pulled from the child's age, with check-off. `M`
- **Acceptance:** parents get an age-appropriate, escalating responsibility map per child.

### Feature E3 — Family Story Canon · `P2` · `capability` + `content`
- [ ] **E3.1** A place to capture **the stories the family tells about who they are** (origin story, "the time we…", the family motto), linked to the Charter values. `M`
- **Acceptance:** the family's narrative identity is captured and reusable (and can later seed personalized hero stories — feeds EPIC F).

### Feature E4 — Weekly Reflection + Hard-Conversation scripts · `P2` · `content`
- [ ] **E4.1** A short weekly rhythm (notice growth, reset) + scaffolded scripts for the hard talks. EN+HE. `M`
- **Acceptance:** parents have a repeatable weekly ritual + ready scripts.

### Feature E5 — Co-parent Alignment (the Marriage frame) · `P3` · `capability`
- [ ] **E5.1** Lightweight tool for two parents to align on values/rules/responses (the Six Frames "Marriage"). `L` — depends on sharing/consent infra.
- **Acceptance:** co-parents can align without a fight; respects existing sharing/consent.

---

# EPIC F — The Aim & the Unified Hero Ascent
**Peterson:** *aim at the highest good — no positive emotion without a telos; one path.*
**Problem:** there is no aim/telos anywhere (D11), and the story-character metrics and Playbank competence are two disconnected scoreboards (D12) despite the "child IS the hero" thesis.
**Outcome:** one child, one hero, one ascent, oriented toward a named aim that the family sets.
**Files:** `app/src/lib/navigation.ts`, `HeroArcade.tsx`, `HeroJourneyTab.tsx`, `FamilyFormation.tsx`, `practice/signals.ts`, new `lib/becoming.ts`

### Feature F1 — The Aim mechanic ("who is your child becoming?") · `P1` · `capability`
- [ ] **F1.1** From the Family Charter values, derive a child-facing **aim** ("becoming brave and honest") and a parent-facing telos statement. `M` — `lib/becoming.ts`
- [ ] **F1.2** Surface the aim on the hero banner (child) and the Academy home (parent). `S`
- **Acceptance:** the child sees who they're becoming; the parent sees the aim they set.

### Feature F2 — Connect Charter → story selection → hero identity · `P2` · `capability`
- [ ] **F2.1** Prioritize stories whose virtues match the Charter values; tag the hero with the aimed virtues. `M`
- **Acceptance:** a family that aims at Courage + Truth sees those journeys first; the hero embodies them.

### Feature F3 — Unify character + competence into one ascent · `P2` · `capability`
- [ ] **F3.1** Define a single "Becoming" score/level that blends Playbank competence (practice) + story-character growth (virtue choices). `L` — `lib/becoming.ts`, `signals.ts`
- [ ] **F3.2** One hero level/power bar that both systems feed (replace the two parallel scoreboards). `M` — `HeroArcade.tsx`, `HeroJourneyTab.tsx`
- **Acceptance:** practice and stories both visibly move the *same* hero up the *same* path.

### Feature F4 — The "Becoming" map · `P3` · `enhancement`
- [ ] **F4.1** A single visual the parent + child can look at: where the hero started, where they are, where they're aimed. `L`
- **Acceptance:** one screen tells the whole formation story.

---

# EPIC G — Playbank as a true competence hierarchy
**Peterson:** *Rule 1 — stand up straight; the hierarchy of competence; compare yourself to who you were yesterday.*
**Problem:** the Playbank is the most Peterson-faithful surface but the competence floor is so soft the hierarchy stops meaning anything (Hero Pose always 3/3, D13), and it's narratively orphaned from character (feeds F3).
**Outcome:** an honest, encouraging gradient of mastery, with the embodiment made explicit.
**Files:** `app/src/components/practice/*`, `practice/cosmetics.ts`, `practice/signals.ts`

### Feature G1 — Honest mastery gradient · `P2` · `enhancement`
- [ ] **G1.1** Extend the Memory-Match adaptive-difficulty pattern so stars reflect real performance across worlds (keep "trying is a win" floor, but let mastery show). `M`
- **Acceptance:** a child who's mastered a world looks different from one who just started — without any "failure" state.

### Feature G2 — Make the embodiment explicit · `P3` · `enhancement` + `content`
- [ ] **G2.1** Reframe Hero Pose as literal "stand up straight / strong body, strong hero," and Beat Keeper / Pattern Power as "bringing order out of chaos" in the copy. `S`
- **Acceptance:** the latent Peterson meaning of each world is surfaced in age-appropriate copy.

### Feature G3 — "Compare to who you were yesterday" · `P2` · `enhancement`
- [ ] **G3.1** Personal-best / trend framing in the Hero Arcade + Copilot (never peer comparison). `S`
- **Acceptance:** progress is always self-referential.

### Feature G4 — Feed competence into the hero ascent · `P2` · `capability`
- [ ] **G4.1** Practice events contribute to the unified "Becoming" score (depends F3). `M`
- **Acceptance:** practice visibly grows the hero, not just a separate level.

---

# EPIC H — Localize & harden the formation layer (cross-cutting)
**Why:** the parent-formation layer is English-only while the GTM is Israel-first (D10, D14-adjacent). Treat as the acceptance gate on D/E/F, plus a final audit.
**Files:** `i18n.ts`, all new parent surfaces

### Feature H1 — Hebrew for all parent surfaces · `P1` · `enhancement`
- [ ] **H1.1** Translate reflection chrome, masterclass content, family rituals, the aim statements. `M` (rolls up across D/E/F)
- [ ] **H1.2** RTL audit of every new Academy surface. `S`
- **Acceptance:** the entire parent layer works in Hebrew, RTL-correct.

---

## Suggested roadmap (waves)

| Wave | Theme | Epics/Features | Why first |
|---|---|---|---|
| **1 — Correct the inversion** | Make the product stop teaching the opposite of its philosophy | **A1**, **B1**, **B3** | Small, P0, restores Peterson fidelity at the root |
| **2 — Build the thesis** | The parent becomes the calm competent adult | **D1**, **D2**, **E1**, **E2**, **H1** | The stated product thesis, currently unbuilt |
| **3 — Deepen the stories** | Real stakes + the missing archetypes | **A2**, **A3**, **B2**, **C1**, **C2**, **B4** | Richer formation once the engine is honest |
| **4 — One ascent, one aim** | Unify character + competence toward a telos | **F1**, **F3**, **G1**, **G3**, **D3** | The integrative payoff; needs 1–3 in place |
| **5 — Polish & expand** | Remaining rituals, archetypes, the map | **E3–E5**, **C3–C4**, **F2/F4**, **G2/G4**, **D4** | Long-game depth |

**Highest-ROI single change:** Wave 1 (A1 + B1) — small, and it corrects the one place the product currently rewards avoidance and omits its central virtue.
**Highest-value investment:** Wave 2 — the parent-formation engine is the thesis sitting unbuilt.

---

## Open decisions for Guy (block some items)

1. **Truth vs 5-metric simplicity** — add Truth as a 6th metric/pack (B1), or fold truth into existing virtues? (Recommend: add it — it's the central rule.)
2. **Masterclass medium** — text-first now, audio/video later? (Recommend: text-first to ship the thesis fast.)
3. **Religious framing** — biblical stories are currently "hero" archetypes, not religious instruction. Keep universal-archetype framing, or offer an explicitly faith-framed mode? (Affects C1–C3 copy.)
4. **Age gating for the heavy archetypes** (Cain/Abel, the Fall) — confirm 6–8 gating + arbor-safety review before authoring (C3).
5. **Unified score** — is collapsing the two scoreboards into one "Becoming" level desirable, or keep practice and character visibly separate? (F3.)

---

*This backlog is review-derived and additive; nothing here is built yet. Sequencing assumes the current comic-redesign + Hero-Comics work already in prod (commits `e424353`, `f575081`).*
