# Arbor Redesign — Complete Prototype Feature Catalogue

Source: Claude Design `.dc.html` handoff at
`PAI/PRDs/arbor-redesign-handoff/arbor-parenting-app-redesign/project/`

Files catalogued:
- **WEB** = `Arbor Web App.dc.html` (desktop web shell) — already-analyzed; summarized here.
- **MOBILE** = `Arbor Prototype.dc.html` (274 KB mobile app prototype; the richest file — full data model in its `<script type="text/x-dc">` block, lines 1293–2227).
- **BLUEPRINT** = `Arbor Capability Blueprint.dc.html` (strategic capability map).
- `Arbor Capability Blueprint-print-28ypj8.dc.html` = print variant; **content-identical** to BLUEPRINT (verified by string diff — zero net-new strings). Not catalogued separately.

Asset coverage (listed, not opened):
- `./screenshots/` (37 PNGs): per-surface QA/audit captures — `01/02/03-*` iteration series for `academy, milestones, ia, dbg, mascot, proto-parent, qa-ms, qa-today, upgraded, weekly`; plus `care, more-hub, playbank-rec, hero-cover(2), comic-real, kid-font, logo, audit-today(2), qa-today`.
- `./assets/`: `arbor-logo.png`, `arbor-mark.png`, `preschool.txt`, `abas.txt` (instrument-derived text), `_test.png`, and `./assets/viz/` (14 PNGs): `academy-bg`, `comic-avatar`, `hero-avatar`, `hero-comic`, 6 `game-*` (beat/feelings/memory/mimic/pattern/reading), 4 `story-*` (david-and-goliath/noahs-ark/dragon-of-responsibility/lion-who-was-afraid).
- `./uploads/`: `ABAS Parent 0-5.pdf` (7.5 MB — Adaptive Behavior Assessment), `SRS-2 School-age.pdf` (Social Responsiveness Scale), `preschool_he.docx` / `שאלון הורים גן.docx` (Hebrew parent preschool questionnaire), 5 `draw-*.png` sketches, `arbor logo.png`. These are the clinical-instrument source material behind the milestone framing.
- `./app/public/visuals/cards/packs/classic-comic/game-pose.png` — comic card pack stub.

---

## 1. Per-surface feature inventory

### 1A. Onboarding (MOBILE only — 5-step flow)
From MOBILE `state.obStep` 0–4:
1. **Welcome** — "Welcome to Arbor / The smart guide to your child's development — science-based, fully private, built around your family."
2. **Child setup** — child name input + age picker (ages **3,4,5,6,7**).
3. **Focus selection** — pick any of **7 focus domains** (Communication, Social & Play, Social Understanding, Self-Regulation, Self-Care, Motor, Thinking) → highlighted on the Development Map.
4. **Avatar / hero creation** — "stylized, private avatar — never a raw photo. Stars in stories, comics and the Hero Card." Privacy line: "Stays on your device · GDPR / COPPA."
5. **Ready** — builds a "7-domain clinical framework, tuned to age + focus." Summary chips: Age, Focus count, Domains=7. CTA "Enter Arbor."
- Progress dots, Back/Continue/Skip controls. Re-launchable via an "Onboarding" demo button.

### 1B. Parent app — 5-tab bottom nav (MOBILE) / 6-view sidebar (WEB)
MOBILE nav (5 category tabs): **Today, Growth, Academy, Ask Arbor, Profile** (plus a hidden "More" route for the feature catalogue). WEB nav (6 views): Today, Growth, Academy, Care Network, Profile, Ask Arbor.

**Today / Guidance** (both)
- Greeting ("Good morning, Noa"), child chip ("Mia, 6").
- "Today's Guidance" single focused action card ("Help Mia name her big feelings · 3 min · one small action").
- **Log a Moment** sheet — modes **Voice / Photo / Text**; "no forms, Arbor extracts the insight"; auto-tags (Emotion/Social/At home/Preschool); "Arbor tags the domain, updates the map & suggests a step." (both)
- Live strip from kid app ("Mia checked in happy · finished Brave Bear · 1h ago") — cross-app sync surfaced on Today.
- Feature-shortcut tiles (Milestones, Activities, Academy, Coach).

**Growth → Milestones (Development Map)** (both; MOBILE is the canonical data source)
- **7 clinical domains** (see §6), each with a % roll-up, a tag (On track ≥70 / Developing ≥50 / Keep an eye <50), and a skills count.
- Domain detail = **skill tracker**: each skill marked **Not yet / Emerging / Mastered** (weights 0 / 0.5 / 1) → domain % and overall % ("Development Map") recompute live. Typical-age range per skill shown.
- **Growth focus** = auto-list of every `notyet` skill (flagged items).
- "Ways to grow this area" — per-domain triad: an Activity→quest, an Academy course, and a Playbank game (deep-links into the other surfaces).
- Note: skill data "feeds the Weekly Report and the Care Network summary."

**Academy** (both)
- Continue card ("Understanding Big Feelings · Lesson 3 of 7 · Resume").
- **Development Copilot** — "Based on the Development Map, Arbor suggests focusing on [lowest domain]"; objectives list with done/undone state.
- **Learning Map** — course progress rolled up by the **same 7 domains** as the Development Map; overall %, per-domain %, courses-completed count.
- Full course catalogue (6 courses — see §6), each tagged to a domain, with start/in-progress/done states. Academy stats: "12 courses · 60+ lessons." Lessons list within a course (e.g. 4 lessons with done/active flags).

**Activities (Plan)** (MOBILE; WEB has Daily Routines as catalogue page)
- Tabs Suggested / Planned·2; filters (All/Emotional/Social/Language/Motor).
- 3 activity cards (Home calm corner, Gratitude jar, Turn-taking game) — each with domain tag, duration, materials, and **"Add to Mia's day"** (assign → becomes the kid's quest).

**Ask Arbor (Coach)** (both)
- AI + human coach chat ("Dr. Levi · Online · development coach"), threaded with an attached activity card ("Calm goodbye ritual · Added to Mia's day").
- Quick replies (Give me an example / What if it doesn't work? / **Book a video call**).
- Footer: "Powered by Arbor's AI coach + human experts."

**Care Network** (both)
- **Consult packet builder** — 4 sections (Profile, Flagged milestones [pulled live from the Development Map], Mood patterns (14 days), Active action plans); each line **parent-redactable** (toggle include/exclude), with a selected-items count.
- Export actions: Copy / Download / **Export PDF** / Send to a pro.
- **Verified professional directory** — 3 pros (see §6 for types), filters (Verified by Arbor / Online / Hebrew / Ages 3–6), per-pro: languages, mode (online/in-person), specialties, rating, "Request consult."
- "Curated, not a marketplace"; "Nothing leaves your device until you choose to export. GDPR/COPPA." Consult-sent confirmation state.

**Profile** (both)
- Child header + **Switch child** (multi-kid).
- **Mia's activity (Live)** — mirrors kid app: stars, done-today, day-streak, and a list of today's kid actions (quest / feeling check-in / hero comic / playbank) with status. Note: "Everything Mia does feeds the Development Map and Weekly Report automatically."
- **Mia's hero** avatar card ("The avatar in every story").
- Settings: **Language row (EN ⇄ עברית, full RTL)**, Notifications & reminders, Family & caregivers, Privacy & data, Help & support. Privacy note: on-device + encrypted, GDPR/COPPA.

### 1C. Parent feature-catalogue pages (the "Everything here" detail views)
MOBILE organizes ~18 features under **3 category landings** (each landing has its own dashboard "hero"):
- **UNDERSTAND ("Mia's growth")**: Development, Milestones, Day Windows, Behavior Logs, Weekly Report, Language Lab, Daily Routines.
- **ACADEMY ("Learn & play")**: Academy, Activities, Scholar Hub, Bedtime Stories.
- **ASK ARBOR ("Your guidance")**: AI Coach, Care Network, Family Circle, Smart Reminders, Safety, School Handoff.

Each detail page is a real mini-dashboard (hero / stats / trend bars / progress / chips / rows / note). Notable content:
- **Day Windows** — age-based calm/hard-time prediction by hour; pattern detection ("mornings before preschool hard 5/7 days"); sharpens as you log.
- **Behavior Logs** — events with context/intensity/resolution, intensity trend (−34% over 4 wks), filters, **co-regulation script attached to each event**.
- **Weekly Report** — auto-generated every Sunday: Dev-Map movement, per-domain movement, behaviour events by day, wins, new words learned, one AI insight.
- **The Science** — "133 milestones · 7 domains · 40+ sources"; frameworks cited: **CDC "Learn the Signs", ASQ-3, Co-regulation (Siegel & Bryson)**; clinical board (child psych · speech · developmental pediatrics); disclaimer "Arbor isn't a diagnostic tool."
- **Language Lab** (MOBILE-richer) — bilingual He/En vocabulary tracking (~620 He / ~410 En words, 62% balance), vocab-over-time trend, suggested balanced activities.
- **Safety** — risk level, signs-to-watch, emergency contacts, crisis script.
- **School Handoff** — 1-page respectful brief for preschool staff (what calms her / words that help / bilingual context), private until approved, export PDF.
- **Scholar Hub** — one developmental concept/week auto-matched to the child (e.g. "window of tolerance — Dr. Dan Siegel").
- **Bedtime Stories** — personalized library starring the child's hero; read-aloud in chosen voice, He or En.
- **Family Circle** — invite co-parent/grandparent/nanny; **role-based access** (Parent=all, Grandparent=milestones, Carer=routines/daily-tasks); revocable.
- **Daily Routines** — morning/evening/transition routines with step progress; completing a routine feeds Self-Regulation on the Map.
- **Smart Reminders** — ≤2 nudges/day, one in the child's calm window; auto quiet-hours.

### 1D. Kid app (MOBILE; WEB has it as a "Kid Mode" overlay)
Kid bottom nav: **Home, Play, Studio, Feelings** (+ Treasure, Academy rooms).
- **My World / Quest (Home)** — Arbor mascot greeting; **Today's Quest** ("Build a calm corner · win 5 stars"); star count; daily-goal ring (3 goals: Quest/Feeling/Practice); "Continue where you left off" rail; "My rooms" hub (Playbank, Academy, Studio, Feelings, Treasure).
- **Playbank** — featured game + "Picked for Mia" (games recommended from the child's low domains) + all games; category chips (All/Emotions/Thinking/Calm). **6 playable games** (see §6), each fully implemented in-prototype:
  - *Memory Match* (emoji deck, moves/found, +3 stars), *Pattern Power* (Simon-style sequence, rounds, +1/round), *Feelings Match / Counting Quest / Sound Hunt* (3 quiz engines with shuffled options, 5 rounds each, +3 stars), *Hero Breathing* (in/hold/out × 3 breaths, +2 stars). The child's **hero avatar is the protagonist** in games.
- **Studio / Learning Studio** — 4 modules: **Hero Comics** (star in an adventure), **Reading journey** (phonics → sight words → reading; flip-card practice with 3 stages), **Feelings Lab** (identify emotion in a scenario, 5 scenarios, "no wrong feeling" framing), **Mimic Studio** (copy facial expressions in a mirror, 5 faces). Plus weekly missions calendar, **effort badges** (earned/soon), "My art."
- **Hero Comics (Academy room)** — canvas-rendered comic cover starring the avatar; 4 hero **stories** (see §6); "PAGE 1/6", upload-photo-into-comic, Next-story; bilingual title/line/SFX.
- **Feelings** — mood check-in (Great/Good/Meh/Sad faces), "what made it that way?" cause picker (Play/Family/Pets/Snack), empathetic AI reaction per mood, **3-breath calming**, "your week" strip. Mood **flows up** to the parent Today feed + emotional milestone.
- **Treasure** — stars unlock **4 rewards** (Hero hat unlocked; Rainbow sticker ★8; Space scene ★20; Pet friend ★30) → habit loop.

### 1E. Cross-cutting (both apps)
- **Bilingual EN ⇄ HE with full RTL** (every string has `he`/`en`; `dirAttr` flips).
- **Accent theming** — Green / Teal / Blue (prototype prop).
- **Pricing / Paywall** — Arbor Plus sheet (see §6).
- **Real-time parent↔kid sync** on one shared child profile.

---

## 2. MOBILE-ONLY (in `Arbor Prototype.dc.html`, not in the Web App shell)
Net of the already-analyzed web summary, the mobile prototype adds:
- **5-step onboarding flow** (welcome → child setup → focus pick → avatar creation → ready) — the web shell has no onboarding.
- **Avatar / Hero creation as an onboarding step** with on-device privacy framing + photo-upload-into-comic.
- **Development Copilot** (Academy) and a **Learning Map** that rolls course progress up by the same 7 domains.
- **Language Lab** with bilingual vocabulary counts and balance tracking (web summary lists "The Science" but not a vocabulary tracker).
- **Day Windows** as a full hour-by-hour predictive dashboard with detected patterns.
- **Smart Reminders**, **Daily Routines**, **Scholar Hub**, **Safety net** (crisis script + emergency contacts), **School Handoff brief** as dedicated detail dashboards.
- **3 fully-playable quiz engines** (Counting Quest, Sound Hunt in addition to Feelings Match) + **Pattern Power** + **Hero Breathing** + **Memory Match** — coded with real game state, scoring and star rewards (web summary names "6 games" but mobile carries the working logic + 2 extra game types: Counting Quest, Sound Hunt vs the web list).
- **Reading journey** (phonics→sight→reading flip-cards) and **Mimic Studio** (expression copying) as distinct Studio modules.
- **Parent "Mia's activity (Live)"** panel on Profile that mirrors the kid app in real time.
- **Category-landing dashboards** (each of the 3 parent categories opens as a data dashboard, not a menu).
- **Consult-packet redaction** with per-line include/exclude + live selected-count, plus Copy/Download/PDF/Send.
- **Behavior Logs intensity trend + attached co-regulation script per event** as a built dashboard.
- Accent-theme switch (Green/Teal/Blue) prop.

## 3. WEB-ONLY (in the already-analyzed Web App shell, not surfaced in mobile)
- **Topbar global search + notifications** (mobile has no global search/notification bar).
- **Multi-kid switcher + add-child in the topbar** (mobile has a "Switch" on Profile but no add-child affordance in the prototype data model).
- **Sidebar IA** as the primary navigation paradigm (desktop information architecture) vs mobile's bottom-tab + category-landing model.
- **Kid Mode as an explicit overlay** on the desktop shell (on mobile, Parent/Kid is a top-level world switch, not an overlay).
- A flat **9-page feature catalogue** presented as discrete pages (mobile reorganizes these same features under 3 category landings — IA differs).
> Note: the Care Network, 7-domain Growth map, Academy, Pricing, Hero Stories and Log-a-Moment all appear in BOTH; the difference is IA/chrome, not capability.

## 4. CAPABILITY BLUEPRINT — strategic capabilities & claims asserted
(`Arbor Capability Blueprint.dc.html`; print variant identical)

Thesis: **"One connected system — every feature feeds the next, and the value compounds. Two worlds, one shared brain."**

- **§1 The connected system** — a single **Child Profile = single source of truth** + an on-device **Hero Avatar Engine**; the parent app and kid app are "two faces of one brain" with **realtime sync**. Parent surfaces named: Today/Guidance, Milestones, Activities, Academy, Journal, Coach. Kid surfaces named: My World/Quest, Feelings, Playbank, Academy/Hero Comics, Studio, Treasure.
- **§2 The five value loops** (the logic to build):
  1. **Emotional insight** — Kid mood check-in → Parent Today feed → Emotional milestone → Coach context.
  2. **Guided action** — Milestone flags a gap → Coach/AI recommends → Parent assigns activity → becomes kid's quest.
  3. **Motivation & habit** — Complete quest/comic → earn stars + streak → Treasure unlocks → returns tomorrow.
  4. **Hero avatar everywhere** — one saved avatar → Hero Card, comic covers, 6 comic panels, Academy hero, Studio stamp, reward art. ("The signature — no competitor has it.")
  5. **The growth story** — quests+comics+moods+activities → milestones move → Journal auto-logs → shareable Hero Card.
- **§3 Avatar fan-out / build rule** — repo already composites on-device (StoryIllustration backdrop + HeroAvatar on top); extend to every surface (Hero Card, comic cover+panels, reward/badge art, Studio stamp, breathing-guide buddy, milestone celebration). **Build rule: one shared canvas module — add a surface by passing a new template, never re-implement compositing.**
- **§4 Why best-in-market** — competitor parity-plus claim: **Kinedu** (milestone tracking), **Lovevery** (stage-based activities), **Khan Kids** (character-led learning), **Duolingo** (streaks & reward loops) → **"Arbor = all four + the hero-avatar engine none of them have, in two synced worlds, bilingual He/En."**
- Closing: defines the build contract for Claude Code — one child profile (data model), cross-app sync, the 5 value loops, the shared avatar render module.
> Scope caveat: the Blueprint says **"4 dev domains"** for Milestones, whereas MOBILE/WEB ship a **7-domain** framework — the Blueprint is the older/simpler strategic sketch; the prototypes are ahead of it.

## 5. NEW vs the already-analyzed web summary
Concepts the web summary did NOT mention but that exist in MOBILE/BLUEPRINT:
- **Onboarding flow** (5 steps) and **avatar creation as onboarding**.
- **Development Copilot** + **Learning Map** (course progress rolled up by the 7 domains).
- **Language Lab** bilingual vocabulary tracker (word counts + balance).
- **Day Windows**, **Smart Reminders**, **Daily Routines**, **Scholar Hub**, **Safety net (crisis script + emergency contacts)**, **School Handoff brief** as built dashboards.
- **Journal** as a named surface (auto-logs moments + manual notes) — Blueprint §1.
- **The 5 value loops** as the explicit product logic (Blueprint) — the "why each feature feeds the next."
- **Hero Avatar Engine** as a named, on-device, one-shared-canvas-module capability fanned out to ~8 surfaces.
- **Explicit competitor positioning** (Kinedu/Lovevery/Khan Kids/Duolingo parity-plus).
- Two extra working kid games (**Counting Quest, Sound Hunt**) + **Mimic Studio** + **Reading journey** stages; games seeded by the child's weakest domains ("Picked for Mia").
- **Effort badges** + **daily-goal ring** + **streak** mechanics; **Treasure** unlock thresholds (★8/20/30).
- **Parent "Live" mirror** of kid activity on Profile.
- **Consult-packet redaction** (per-line include/exclude) — finer than the web summary's "build verified packet."
- **133 milestones / 40+ sources** stated explicitly (web summary said "133 milestones" but not the 40+ sources / clinical-board framing).
- Clinical-instrument provenance in `./uploads/` (**ABAS, SRS-2**, Hebrew preschool questionnaire) — the source material the "adaptive-behaviour & social-communication framework" wording is built on (note: code comments stress skill wording is **Arbor's own, not copied from any proprietary instrument**).

## 6. Data model notes (exact values as found in MOBILE `renderVals`)

**7 development domains** (`MSF`), each 5 skills (35 skills shown in-prototype; "133 milestones" is the asserted full framework):
1. Communication & Language (תקשורת ושפה) — icon chat
2. Social & Play (חברתי ומשחק) — groups
3. Social Understanding (הבנה חברתית) — psychology
4. Self-Care & Daily Living (עצמאות יומיומית) — soap
5. Motor (מוטוריקה) — directions_run
6. Self-Direction & Regulation (ויסות עצמי) — self_improvement
7. Thinking & Pre-Academics (חשיבה ומוכנות) — lightbulb
- Skill states: **Not yet (0) / Emerging (0.5) / Mastered (1)** → % roll-up. Tags: On track ≥70, Developing ≥50, Keep an eye <50.
- The Science page asserts: **133 milestones · 7 domains · 40+ sources**; frameworks: **CDC "Learn the Signs", ASQ-3, Co-regulation (Siegel & Bryson)**.

**Pricing tiers** (`payTiers`) — 14-day trial, cancel anytime:
- **Free** — ₪0 / $0 forever: Development Map + milestones, Log moments, AI coach 3 questions/mo. (Care Network & full Academy/comics OFF.)
- **Plus** — **₪39 / $12 per month**: everything in Free + unlimited AI coach + verified expert consults + full Academy + Hero Comics + reports & school handoff.
- Trust line: "Families in 40+ countries · clinician-reviewed · GDPR/COPPA."
> (The web summary's "Family" tier is not present in the mobile data model — mobile shows only Free + Plus.)

**Course list** (6, each domain-tagged):
1. Tantrums, calmly (regulation, 5 lessons·28 min)
2. Screen-time without fights (selfcare, 4·22)
3. Building independence (selfcare, 6·35)
4. Turn-taking & play talk (social, 5·26)
5. Understanding Big Feelings (understanding, 7·40)
6. Calm sleep, night after night (regulation, 5·30)
- Catalogue claims "12 courses · 60+ lessons" overall.

**Games list** (6 playable):
Memory (memory), Pattern Power (pattern), Feelings Match (feelings), Hero Breathing (breathing), Counting Quest (counting), Sound Hunt (sound). Recommendation engine surfaces up to 4 keyed to the child's <70% domains.

**Hero stories** (4, bilingual, with avatar compositing):
David & Goliath, Noah's Ark, The Lion Who Was Afraid, The Dragon of Responsibility. Comic = "PAGE 1/6".

**Professional types** (Care Network directory, 3):
- Child Psychologist (transition anxiety, regulation)
- Speech Therapist (bilingual transition, language)
- Developmental Pediatrician (screening, sleep, milestones)
All "Verified by Arbor" (curated, not a marketplace).

**Family roles** (Family Circle, role-based access; 5 seats):
- Owner / Parent — full access
- Co-parent (Dad) — full access
- Grandparent — view-only, milestones, no sensitive data
- Carer / Nanny — daily tasks / routines only
Access is per-person, revocable anytime.

**Kid economy:** stars (start 12); rewards unlock at ★8 / ★20 / ★30 (Rainbow sticker / Space scene / Pet friend; Hero hat pre-unlocked). Daily goal = 3 (Quest + Feeling + Practice); day-streak + effort badges.

**Onboarding ages:** 3, 4, 5, 6, 7. **Accent themes:** Green / Teal / Blue.

**Avatar surfaces** (Hero Avatar Engine fan-out): Hero Card, comic cover + 6 panels, Academy hero, Studio stamp, reward/badge art, breathing-guide buddy, milestone celebration — one shared on-device canvas module.
