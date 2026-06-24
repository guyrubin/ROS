# Arbor Capability × Competitor Map

**The artifact marketing was missing.** Every Arbor surface, the category leader it beats, where it wins (always on the record-moat), and where it's behind (→ a scored feature-request to product). Owner: `arbor-insights` (refresh each cycle). Feeds: the brand spine ([BRAND-STRATEGY.md](BRAND-STRATEGY.md) §3/§5), the viral content engine ([VIRAL-ENGINE.md](VIRAL-ENGINE.md)), and the feature-request handoff ([MARKETING-BACKLOG.md](MARKETING-BACKLOG.md) §9).

> **The strategic call (locked 2026-06-22):** **one product, six surfaces — NOT six sub-brands.** "Arbor Care / Grow / Academy" are navigation labels, never marketed as separable products — the moment a parent thinks "I only need the Care part," the one-record value story collapses. In marketing, **lead with the organism, not the organ.** The wedge (the 2am record) still leads; breadth is *proof the record is an OS*, not a feature list.
>
> **Why this replaces "four products in one":** the old frame omitted three whole pillars — **Grow/Practice Studio, Care, and Academy.** The honest frame is **one child OS, six surfaces, each beating a named leader, all on one parent-owned record.**

## Methodology
- Competitor facts from official pricing/feature pages, verified against a second source where load-bearing (confidence inline). Re-confirm at execution — pricing/features shift.
- **Thinness flags** are honest product-state reads (codebase/backlog/PRDs), not copy. They are *deployment gates*: the positioning is honest, but a specific claim can't ship until the product state supports it.
- Clinical/child-data/billing items = `gated` (G2 + `arbor-safety`/clinical veto). No outcome/effect-size language (G2).

---

## Pillar 1 — TODAY (Rhythm · Daily Play · "Worth noticing" · Quick capture)
| Capability | Arbor ships | Category leader | Arbor wins (the moat) | Behind → FR |
| :-- | :-- | :-- | :-- | :-- |
| **Rhythm** (predicted day-bands) | friction/calm/wind-down bands from the child's own behavior+mood+sleep log | **Huckleberry** Plus $11.99 / Premium $14.99 — SweetSpot + NextNap, **sleep-only** | reads the *whole day*, not just naps; Huckleberry never collected a multi-domain log | in-app only; no push/widget at the predicted window → **FR-1** |
| **Daily Play** (behavior-aware) | today's household activity by age **+ this week's logged behavior** | **Kinedu** 3,000+ vids (age/stage); **BabySparks** 1,000+ (0–3) | personalizes by *this child's last two weeks*, not birthdate | library depth unverified vs 3,000+ → **FR-2** |
| **"Worth noticing"** nudge | proactive pattern from the parent's log | no consumer equivalent (Huckleberry Insights = generic age tips) | moat made visible | unreliable trigger; no push delivery → FR-1 |
| **Quick capture** | tap-to-log across behavior/mood/language | Huckleberry voice/text/photo logging (sleep/feed only) | multi-domain, not just sleep | tap-count vs voice-log unbenchmarked → **FR-3** |

**Thinness:** Rhythm is genuinely moat-native, but the whole pillar dies if capture <3–4 events/wk. No ambient capture (widget/voice) today — the pillar's biggest fragility.

## Pillar 2 — ASK (Coach · Lens · Specialist)
| Capability | Arbor ships | Category leader | Arbor wins | Behind → FR |
| :-- | :-- | :-- | :-- | :-- |
| **Ask Arbor coach** | cited answers (CDC/AAP/named) grounded in *this* child's record | **Good Inside/Gigi** $23–28 (Dr. Becky's voice, no child context); **BabySparks Ava** (generic) | answers know the logged child; citation layer enables the non-diagnostic stance | no named human authority / community vs Good Inside → **FR-4** |
| **Lens** (framework picker) | choose the developmental lens the coach answers from | none | unique; passes the clinician test | thin if <4–5 lenses or answers don't visibly differ |
| **Ask a Specialist** | human opens with a parent-approved context packet | **Cleo** (employer-only); **Maven** $18–120/visit; **Cooper** $49 — all open cold | the only warm-start expert in the category | ⚠️ **booking/payment/video NOT built** — packet only → **FR-5** |

**Thinness (critical):** coach is differentiated; Specialist is the highest-value surface but only the consult *request* exists — **do not claim "speak to a specialist" until booking ships.**

## Pillar 3 — MY CHILD (the moat — Story · Memory · Development · Moments · Language · Screening)
| Capability | Arbor ships | Category leader | Arbor wins | Behind → FR |
| :-- | :-- | :-- | :-- | :-- |
| **Child Memory** (append-only, parent-owned) | one timestamped, parent-controlled record every surface reads/writes | **no consumer product owns this**; **Nanit** ($50M, 2025) building a longitudinal layer — **hardware-gated**; Kinedu's record is platform-owned | only parent-owned, append-only, *hardware-independent* record | no export/portability UI vs Nanit's coming moat → **FR-6** |
| **Development** (Now/Milestones/Profile, CDC/AAP) | milestone tracking tied to the behavioral log + coach | **Kinedu** Skills assessment (Harvard-cited); **BabySparks** | a milestone gap immediately becomes coach context | ⚠️ **infant age stored in YEARS → 0–24mo cohort broken** → **FR-7 (P0 correctness)** |
| **Story/Timeline** | visual narrative of logged moments | photo apps (Tinybeans) capture media, not dev context | first narrative longitudinal view; Growth Card = shareable proof | thin without capture volume → FR-3 |
| **Language & Communication** | language milestones in the unified record | **Speech Blubs** $14.49 (standalone, 1,500+ SLP exercises) | a speech flag feeds coach + Specialist packet | not prominently surfaced in My Child → **FR-8** |
| **Development Check** (screening) | in-app screening inside a referral loop | CDC Milestone Tracker (free, standalone) | flags route into the record + handoff packet | ⚠️ acute clinical-claim risk — "observation prompts" only; clinical-lead review before marketing |

**Thinness:** the record is genuinely unique. Infant-months bug is a P0 correctness failure for the highest-growth cohort. Dev-Check = acute clinical risk. No data-portability UI yet (matters as Nanit builds).

## Pillar 4 — GROW (Daily Play library/Courses · Practice Studio · Growth Plans)
| Capability | Arbor ships | Category leader | Arbor wins | Behind → FR |
| :-- | :-- | :-- | :-- | :-- |
| **Courses / library** | activities + parent courses, child-record-personalized | **Lovevery** ($12/mo app; credentialed-expert Course Packs) | suggestions reflect *this* child's logged concerns | course breadth + video production vs Lovevery → **FR-9** |
| **Practice Studio** (Speech Coach/Mimic/Feelings/Adventures, MediaPipe) | child-facing speech/language/SEL games | **Speech Blubs** $14.49; **Lingokids** $15.99; **Khan Academy Kids FREE** | practice writes back to the record + coach — closed competitors don't | ⚠️ feedback loop must work end-to-end; no session limits/parent dashboard vs Lingokids → **FR-10** |
| **Growth Plans** | multi-week interventions from the record | Brightline/Bend (clinical $199–549) | consumer-priced, record-structured | no completion/streak mechanic → **FR-11** |

**Thinness (critical):** Practice Studio competes head-on with *free* Khan Kids. The only winning frame is the feedback loop (practice→record→coach) — it must be demonstrably live, or Practice looks like an inferior standalone game suite.

## Pillar 5 — CARE (Consult · Care Team · Trusted Sharing · Appointments · Safety)
| Capability | Arbor ships | Category leader | Arbor wins | Behind → FR |
| :-- | :-- | :-- | :-- | :-- |
| **Consult packet** | parent builds a context packet → exports to their pro / sends to expert | **Cleo** (employer-only); **Maven** $18–120 — both cold-start | only product that warm-starts the expert; kills the cold-start villain | ⚠️ **booking/video/payment gated; care network not described live** → FR-5 |
| **Trusted Sharing / Care Team** | share the record with the parent's *own* pediatrician | none (Cleo/Maven *are* the pro; don't help you brief yours) | first "bring your own professional" model | needs web/PDF export the pro can open without the app → **FR-12** |
| **Safety & Escalation** | escalation triggers in the coach flow | Brightline/Bend (US-only, insurance-gated) | embedded at consumer price, references the child's history | every red-flag trigger needs clinical-lead veto (highest clinical risk) |

**Thinness:** the **thinnest-built pillar today.** Position as a "warm-handoff layer" (consult packet + trusted sharing); **do not imply a live specialist marketplace** until booking ships.

## Pillar 6 — ACADEMY (TWO-SIDED: the child's hero learning world + the parent's own learning)
> **Correction (2026-06-22):** Academy is **for both the child and the parent** (per the Peterson/Playbank backlog) — and the **kids' side is a designed VIRAL engine, not a depth layer.** This map earlier wrongly framed Academy as parent-only. The kid-hero learning world is one of Arbor's two viral languages (kid-hero + proud-parent).

**6a — Kids Academy (the viral engine):**
| Capability | Arbor ships | Category leader | Arbor wins | Behind → FR |
| :-- | :-- | :-- | :-- | :-- |
| **Story Journeys** | the child becomes the **hero** of archetypal virtue stories (courage/responsibility/resilience/empathy/wisdom) via a Fear→Decision→Consequence→Reflection loop; **earned virtues write to the child's development record**; rendered with the child's stylized hero avatar (never a real face) | **Khan Academy Kids** (FREE); **Duolingo ABC** (free); **Lingokids** $15.99; **ABCmouse** — generic edutainment, no child-record link, no shareable hero artifact | the child is the hero of stories tied to *their own* record + virtues — character/SEL learning that compounds on the moat; edutainment teaches generic content and forgets the child | ~10 stories; virtue scoring was inverted (rewarded avoidance — Peterson backlog Epic A, fixing) → **FR-13** |
| **Hero Comic / share** (Hero Arcade · Playbank tie-in) | a completed Story Journey renders a **shareable Hero Comic** — the child-as-hero artifact | **none** — no kids-learning app turns the child into a shareable hero comic | **THE kid-hero viral payload**: the child is the *acquisition* angle, the parent *shares* it (parent-mediated; stylized avatar, never a real face) | share/export loop unbuilt (mk-p0-3); depends on the avatar pipeline → **FR-14** |

**6b — Parent Academy:**
| Capability | Arbor ships | Category leader | Arbor wins | Behind → FR |
| :-- | :-- | :-- | :-- | :-- |
| **Parent Masterclasses** | parent learning surfaced by the child's record ("Maya's logs show 5pm friction → this class on transitions") | **Good Inside** $23–28 (Dr. Becky, 2M+); **Big Little Feelings** $123; **Tinyhood** $12.95 | a class surfaces because the *child's record* calls for it, not because the parent browsed | ⚠️ **largely "Coming soon"** — catalog mostly unbuilt; market "in production," never a fake catalog → FR-9 |
| **Family Formation** | the parent's own growth (Family Charter is real + persisted; rest coming) | nobody owns the parent's own development as a tracked arc | uncontested | thinnest — introduce as "coming" |

**Thinness / honesty:** the **Kids Academy (Story Journeys + Hero Comic) is REAL, writes to the record, and is the viral engine** — lead the kid-hero viral language here (the child-as-acquisition-angle the whole GTM is built on). **Parent Masterclasses is mostly ComingSoon** — never present a populated catalog; market "in production." The hero is always the generated stylized avatar, never a real child's face (enforced in `HeroJourneyTab`).

---

## Deployment gates (the positioning is honest; these bind what ships TODAY)
1. **Arbor Care** — market the consult packet + "warm-start your professional." **No live-marketplace implication** until booking/video/payment ships (FR-5).
2. **Practice Studio** — the "practice writes to the record" hook is only deployable once the feedback loop is verified end-to-end in build (FR-10).
3. **Development Check / screening** — any "screens for / detects / identifies" phrasing → `arbor-safety` + clinical-lead veto before any asset ships.
4. **Baby 0–2 track** — no baby-coverage marketing until the infant-months bug (FR-7) is fixed.

## Feature-requests handed to PRODUCT (scored; full handoff in [MARKETING-BACKLOG.md](MARKETING-BACKLOG.md) §9)
| FR | Pillar | Title | Competitor | Risk | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| **FR-7** | My Child | Infant age-in-months (integer-years bug breaks 0–24mo) | Kinedu/BabySparks | gated | **P0** |
| **FR-3** | Today | Ambient capture (voice/widget, ≤3 taps) | Huckleberry | safe | **P0** |
| **FR-14** | Academy (kids) | **Hero Comic share/export loop — the kid-hero viral payload** | none (unique) | gated | **P0 (viral)** |
| **FR-5** | Ask/Care | Specialist booking + payment + video | Maven | gated | P1 |
| **FR-13** | Academy (kids) | Story-Journey library depth + virtue-scoring fix (avoidance≠virtue) | Khan Kids/Duolingo ABC | safe | P1 |
| **FR-10** | Grow | Practice Studio feedback loop verify + parent dashboard | Lingokids/Khan | safe | P1 |
| **FR-1** | Today | Push/widget at predicted Rhythm window | Huckleberry | gated | P1 |
| **FR-12** | Care | Web/PDF export the parent's own pro can read | Maven | safe | P1 |
| **FR-6** | My Child | Data portability (export + GDPR erasure UI) | Nanit | gated | P1 |
| **FR-2** | Today | Daily Play library to 500+ w/ expert attribution | Kinedu | safe | P2 |
| **FR-8** | My Child | Surface Language tracking + SLP content | Speech Blubs | safe | P2 |
| **FR-9** | Grow/Academy | 20+ named-expert Masterclasses, record-indexed | Tinyhood | safe | P2 |
| **FR-4** | Ask | Community layer (second-guardian digest → cohort) | Good Inside | gated | P2 |
| **FR-11** | Grow | Growth Plans completion mechanics | Brightline | safe | P2 |
