# Arbor — Information Architecture Redesign

**Date:** 2026-06-14
**Method:** Applied the information-architecture discipline (mcpmarket IA skill): **content inventory → card sort by parent mental models → structure & hierarchy → labeling → tree testing → faceted navigation.** Grounded in the live IA (`app/src/lib/navigation.ts`).
**Goal carried from the grilled definition:** move the **memory moat to the center**, make **Today** the home, kill duplicate/overlapping surfaces, host the three additions (Rhythm, Daily Play, Ask-a-Specialist).

---

## Step 1 — Content inventory (every current surface)

From `navigation.ts` (7 sections, post-Wave-1) plus deep-link-only tabs and the three planned additions.

| Current section | Leaves (incl. deep-link-only*) |
|---|---|
| Home | Home/Overview |
| Ask Arbor | Ask Arbor (Coach) · *scholar lens |
| My Child (intelligence) | Story (timeline) · Development Dashboard (copilot) · Development Profile · Development Milestones · Development Check (screening) · Moments (behaviors) · Language & Communication · Child Memory · *strengths · *weekly |
| Practice Studio | Daily Missions · Development Journey · Speech Coach · Mimic Studio · Feelings Lab · Adventures |
| Growth Plans | Active Growth Plans |
| Care Network | My Care Team · Find a Professional · Reports & Handoffs · Trusted Sharing · Appointments · Safety & Escalation · *handoff |
| Arbor Academy | Story Journeys · Parent Masterclasses · Family Formation |
| **Additions (to place)** | Rhythm · Daily Play (+ Courses) · Ask-a-Specialist / Consult |

**Inventory count:** ~24 discrete surfaces. **IA red flags found:** (a) 4 leaves share the "Development *" prefix and overlap; (b) Reports/Handoff/Find-a-Pro are 3 doors to one intent; (c) Daily Missions overlaps Daily Play and "today"; (d) Development Journey is a progress view duplicating Development data; (e) the moat (Child Memory) is a buried equal-weight leaf.

---

## Step 2 — Card sort (group by the parent's mental model, not Arbor's data model)

The cards re-cluster into **six jobs a parent actually has**:

1. **"What about my child *right now / today*?"** → Overview, Rhythm, Daily Play, Daily Missions, quick capture.
2. **"I have a *question*."** → Coach, scholar lens, escalate-to-human.
3. **"Tell me *who my child is* / track them over time."** → Story, Child Memory, Development (Dashboard+Profile+Milestones), Development Check, Moments, Language. *(the moat)*
4. **"What do I *do* to help them develop?"** → Daily Play library/Courses, Practice drills (Speech/Mimic/Feelings/Adventures), Growth Plans, Development Journey.
5. **"I need *people* — professionals, my care team, sharing."** → Consult (was Reports/Handoff/Find-a-Pro), Care Team, Trusted Sharing, Appointments, Safety.
6. **"Help *me* become a better parent."** → Masterclasses, Story Journeys, Family Formation.

---

## Step 3 — New structure & hierarchy (the redesigned sitemap)

Six task-based pillars (down from 7 scattered sections), ~15 deduplicated leaves (down from ~24), depth ≤ 2. The moat appears **twice on purpose**: as the *Today* nudge and as the *My Child* spine.

```
Arbor
├─ Today                         ← NEW center (was static "Home")
│   ├─ Rhythm (predicted day)        [ADD C1] — friction / calm / wind-down bands
│   ├─ Daily Play (today's 1 card)   [ADD C2] — household-item activity, behavior-aware
│   ├─ Worth noticing (memory nudge) — moat made visible on Home
│   └─ Quick capture ("Log a moment")
│
├─ Ask                           ← the coach
│   ├─ Ask Arbor (chat)
│   ├─ Lens (scholar picker — faceted, not a tab)
│   └─ Ask a Specialist (human escalation entry) [ADD C3 entry]
│
├─ My Child                      ← the longitudinal record (Story = spine)
│   ├─ Story (timeline)              — spine; Child Memory rendered INLINE here
│   ├─ Development                   — MERGED: Now / Milestones / Profile (internal tabs)
│   ├─ Moments                       — behavior log
│   └─ Language & Communication
│        └─ (Development Check = action surfaced from Story, not a standing leaf)
│
├─ Grow                          ← everything you DO to build development
│   ├─ Daily Play (library + Courses) [ADD C2 / Phase-2 Courses]
│   ├─ Practice  ▸ Speech Coach · Mimic Studio · Feelings Lab · Adventures
│   └─ Growth Plans                  — multi-week structured interventions
│        └─ (Daily Missions → folded into Today; Development Journey → My Child ▸ Development)
│
├─ Care                          ← people & professionals (transactional)
│   ├─ Consult                       — MERGED: build packet → export to my pro / send to expert
│   │     (absorbs Reports & Handoffs + Find a Professional)
│   ├─ My Care Team
│   ├─ Trusted Sharing
│   ├─ Appointments
│   └─ Safety & Escalation
│
└─ Academy                       ← parent's own learning
    ├─ Parent Masterclasses
    ├─ Story Journeys
    └─ Family Formation
```

---

## Step 4 — Labeling (clear, mutually exclusive, parent-language)

| Old label | New label | Why |
|---|---|---|
| Home | **Today** | A task ("what's today"), not a location. Sets the daily-return expectation. |
| Development Dashboard / Profile / Milestones | **Development** (one view, tabs: Now / Milestones / Profile) | Kills the 4× "Development *" confusion; one place for "how is my child developing." |
| Development Check | *(action: "Worth a quick check?")* | A prompt, not a destination. |
| Child Memory | *(inline in Story)* | The moat is connective tissue, not a tab to hunt for. |
| Behaviors | **Moments** (kept) | Already good, warm, parent-language. |
| Daily Missions | *(folded into Today)* | Overlapped "today" + Daily Play. |
| Development Journey | *(into My Child ▸ Development)* | A progress view of dev data — belongs with the data. |
| Practice Studio | **Practice** (under *Grow*) | "Studio" is brand-speak; "Practice" is the job. |
| Growth Plans | **Growth Plans** (under *Grow*) | Kept; distinct multi-week job. |
| Reports & Handoffs / Find a Professional | **Consult** | One verb for one intent: get expert input. |
| Arbor Academy | **Academy** | Fine; drop the redundant brand prefix. |

**Pillar labels chosen for findability:** Today · Ask · My Child · Grow · Care · Academy — each is a verb-or-noun a parent would say out loud.

---

## Step 5 — Tree test (validate findability against real parent tasks)

Walk top tasks through the new tree; a pass = ≤2 clicks, unambiguous path.

| Parent task | Path | Pass? |
|---|---|---|
| "He melts down around 5pm — what do I do?" | **Today** → Rhythm shows 5pm friction + script | ✅ (also Ask) |
| "Is my 3-yo's talking normal?" | **My Child** → Development (Milestones) / or "Worth a quick check?" | ✅ |
| "Give me something to do with her right now." | **Today** → Daily Play card | ✅ |
| "I need a plan for potty training." | **Grow** → Growth Plans | ✅ (label "Grow ▸ Plans" guards ambiguity) |
| "Share his history with our speech therapist." | **Care** → Consult → export/send | ✅ |
| "Track his tantrums over weeks." | **My Child** → Moments | ✅ |
| "Practice the R sound." | **Grow** → Practice → Speech Coach | ✅ |
| "Learn how to handle sibling rivalry." | **Academy** → Masterclasses | ✅ |
| "What has Arbor noticed about my child?" | **Today** → Worth noticing / **My Child** → Story (memory inline) | ✅ (moat surfaced) |

**Tree-test flags & mitigations:** (1) "Plans" under *Grow* — a minority may expect it top-level; mitigate with a visible "Plans" sub-label and a Today shortcut when a plan is active. (2) Daily Play appears in both *Today* (the one card) and *Grow* (the library) — intentional faceted access (task shortcut vs. browse), standard IA, not duplication.

---

## Step 6 — Faceted navigation (cross-cutting access without new tabs)

Two facets cut across the tree so parents reach things by *context*, not only by section:
- **Child switcher** (global) — every pillar is scoped to the active child; the record (My Child), Today, and Grow all re-key on switch.
- **Skill/domain tag** (e.g. *regulation, language, motor*) — a Moment, a Daily Play activity, a Milestone, and a Plan that share a skill tag link to each other. This is what makes the memory loop legible: log a regulation Moment → Today suggests a regulation Daily Play → it ties to the regulation Milestone. No new navigation; the tags are the cross-links.

---

## Migration map (old tab → new home) — for implementation

| Old `ActiveTab` | New location |
|---|---|
| `overview` | **Today** (rebuilt as Daily Home host) |
| `coach` (+ `scholar`) | **Ask** (scholar = lens facet) |
| `timeline` | **My Child ▸ Story** (spine; `memory` rendered inline) |
| `copilot` + `profile` + `milestones` + `strengths` | **My Child ▸ Development** (Now / Milestones / Profile tabs) |
| `screening` | surfaced action from Story ("Worth a quick check?") |
| `behaviors` | **My Child ▸ Moments** |
| `language` | **My Child ▸ Language & Communication** |
| `memory` | inline layer in Story + Today nudge (no standing leaf) |
| `missions` | folded into **Today** daily loop |
| `journey` | **My Child ▸ Development** |
| `speech` `mimic` `feelings` `adventures` | **Grow ▸ Practice** |
| `plans` | **Grow ▸ Growth Plans** |
| `reports` + `find-pro` + `handoff` | **Care ▸ Consult** |
| `care-team` `sharing` `appointments` | **Care** (kept) |
| `safety` | **Care ▸ Safety & Escalation** |
| `stories` `masterclasses` `family` | **Academy** |
| *(new)* | **Today ▸ Rhythm**, **Today/Grow ▸ Daily Play**, **Ask/Care ▸ Ask-a-Specialist/Consult** |

---

## Proposed `navigation.ts` SECTIONS (implementable redesign)

```ts
export const SECTIONS: NavSection[] = [
  { id: "today",  label: "Today",    icon: Home,
    items: [{ tab: "overview", label: "Today", icon: LayoutDashboard }] },

  { id: "ask",    label: "Ask",      icon: Sparkles,
    items: [{ tab: "coach", label: "Ask Arbor", icon: Sparkles }] },

  { id: "child",  label: "My Child", icon: Brain, badge: "milestone",
    items: [
      { tab: "timeline",   label: "Story",                   icon: Waypoints },   // memory inline
      { tab: "development", label: "Development",            icon: Gauge },        // Now/Milestones/Profile
      { tab: "behaviors",  label: "Moments",                 icon: Activity },
      { tab: "language",   label: "Language & Communication", icon: Languages },
    ] },

  { id: "grow",   label: "Grow",     icon: Sprout, badge: "plans",
    items: [
      { tab: "daily-play", label: "Daily Play",       icon: Map },     // library + Courses
      { tab: "practice",   label: "Practice",         icon: Target },  // speech/mimic/feelings/adventures
      { tab: "plans",      label: "Growth Plans",     icon: Sliders },
    ] },

  { id: "care",   label: "Care",     icon: HeartHandshake,
    items: [
      { tab: "consult",      label: "Consult",         icon: FileBarChart }, // reports+handoff+find-pro
      { tab: "care-team",    label: "My Care Team",    icon: Users },
      { tab: "sharing",      label: "Trusted Sharing", icon: Share2 },
      { tab: "appointments", label: "Appointments",    icon: Calendar },
      { tab: "safety",       label: "Safety & Escalation", icon: ShieldAlert },
    ] },

  { id: "academy", label: "Academy", icon: GraduationCap,
    items: [
      { tab: "masterclasses", label: "Parent Masterclasses", icon: GraduationCap },
      { tab: "stories",       label: "Story Journeys",       icon: BookOpen },
      { tab: "family",        label: "Family Formation",     icon: Heart },
    ] },
];
```
Plus a `TAB_SECTION_FALLBACK` for retired leaves (`copilot|profile|milestones|strengths|journey → child`; `screening → child`; `memory → child`; `missions → today`; `reports|handoff|find-pro → care`; `speech|mimic|feelings|adventures → grow`; `scholar → ask`) so deep links keep resolving and **no capability is deleted** — only re-homed.

---

## Net effect
- **7 sections → 6 task-based pillars**; **~24 surfaces → ~15 leaves** (the rest become tabs/inline/actions — none deleted).
- The **moat is centered**: Child Memory moves from buried leaf to the Story spine + the Today nudge.
- **Today** becomes a reason to open the app daily (hosts Rhythm + Daily Play).
- Care becomes **transactional** (one Consult verb) instead of three mockup doors.
- Labels are parent-language and mutually exclusive; tree-test passes ≤2 clicks on the top 9 tasks.

**Next:** apply the `SECTIONS` rewrite + the merge work (Development view, Consult flow, Today host) in `app/src` — say the word and I'll implement it incrementally with the dev server verifying each step.
