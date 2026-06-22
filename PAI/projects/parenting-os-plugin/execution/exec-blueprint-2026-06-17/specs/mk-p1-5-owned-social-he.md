## mk-p1-5-owned-social-he — Owned IG/TikTok (HE), 3-4 posts/wk
**Aspects:** Marketing · **Surfaces/platforms:** landing:he · **Priority:** P1

### Problem / why
The €10k/6-month GTM (`marketing/arbor-viral-gtm-2026-H2.md`) is organic-led: ~€278/country/month is not a paid-acquisition budget, so the loop must self-feed (§1). Creator seeding (P0-6/P1-2) and the avatar challenge (P1-1) ignite reach, but rented audiences stop the day the fee stops. **The owned IG + TikTok accounts (HE) are the only distribution surface Arbor keeps** — the home base that repurposes creator UGC, sustains the "2am parenting" presence between paid pushes, and gives every Reel a stable destination (bio link + pinned first-comment) that feeds the instrumented funnel.

The launch-week schedule already exists (`marketing/arbor-heygen-script-and-schedule.md` §D) but it is a **one-shot 7-day calendar**, not a steady-state operating cadence. The EXECUTION-TRACKER (Milestone D) confirms the gap: "Create IG/TikTok/YouTube (Arvo pic + bios)" is 🔒 blocked-on-Guy and "Connect Metricool + load launch schedule" is 🔒 — there is **no repeatable weekly content engine** documented for weeks 3-8 (IL ignition). P1-7 (`arbor-youtube-strategy.md`) covers YouTube Shorts as a cross-post mirror; this item owns the **IG/TikTok HE primary** and the recurring 3-4 posts/wk rhythm.

This is a **content/ops (✍) item** — no app code. It defines: the owned-account operating system (bios, link convention, posting cadence, UGC repurposing pipeline, a 6-week rolling content calendar), all sourced from the existing template kit (P0-7), copy pack, and brand. The single shared file it edits is the marketing backlog row.

### Scope across platform domains
- **Landing HE (RTL)** — *reference + destination, not edited by this item.* The HE landing (`html/arbor-marketing-landing-page-he.html`) is (a) the **brand-token source** every owned post inherits via the P0-7 template kit (pine-green `#2f5d47` / `oklch(0.68 0.14 178)`, Assistant/Heebo Hebrew stack, line 168), and (b) the **link destination** every bio/first-comment link resolves to via the `mk-p0-5` `data-cta="app"` handoff. The work-item surface is tagged `landing:he` for exactly these two reasons. This item ships **no landing edit**; `mk-p0-5` owns the landing CTA/handoff and `mk-landing-parity-rebuild` owns the markup.
- **Web / iOS / Android** — not touched. Owned posts drive installs to the live app via the tagged link; no native or web-app code changes. The avatar/answer-card/growth-card content shown in posts is the *output* of the in-app share export (P0-3) and the template kit (P0-7), repurposed — this item produces zero app code.
- **Landing EN** — out of scope; this is the HE owned channel. EN owned-channel rollout rides the P2 EN launch (P2-4) with winners only.

### IA / UX / Copy / Marketing detail (Marketing)

**Discipline applied:** `marketing:campaign-plan` (the recurring content calendar + cadence + KPIs) + `rubin-os:copywriter` method (the bio + caption slot conventions). The deliverable is an **operating system for the owned accounts**, not loose posts — a non-designer (Me/MKT) must be able to fill a week without re-deciding brand or strategy.

#### A. Account setup convention (records, does not create — creation is 🔒 Guy)
The accounts themselves are created by Guy (EXECUTION-TRACKER Milestone D, blocked). This spec records the canonical setup so they ship on-brand and loop-wired:
- **Handles:** `@arbor.family` (or the secured variant matching the bought domain from `mk-p0-1`) on IG + TikTok, HE-first. Record the exact secured handle once known — do not bake a guess.
- **Profile picture:** Arvo 1080×1080 (`marketing/assets/arvo-avatar-1080.png`), per HeyGen §A/§E.
- **Bio (HE), reuse verbatim from HeyGen §E** (do not re-author — DRY): `"חוות דעת רגועה לכל רגע הורי. קריאה, תוכנית להערב, ותיק התפתחות שגדל עם הילד/ה. לא אבחון. 🌳"`
- **Bio link:** the tagged app-handoff link (§B below), NOT a bare `web.app` URL (GTM §4 forbids it).

#### B. The owned-channel link convention (loop wiring — the real build value)
Every owned post drives to one tagged link so installs attribute to the owned channel and are sliceable in the `mk-p0-5` dashboard. Lock the convention here as source of truth; it must use ONLY canonical `mk-p0-5` values (lowercase snake_case):
- **Bio / link-in-bio (evergreen):**
  `https://arborprd-westeu.web.app/?utm_source=instagram&utm_medium=organic&utm_campaign=launch_il&utm_content=bio_link`
  (TikTok variant: `utm_source=tiktok`.)
- **Per-post first-comment / story link (the conversion link):** same base, but `utm_content` = a per-post slug so individual posts are sliceable for the cut/double decision (GTM §8, P1-6). Slug format: `owned_<yyyymmdd>_<format>` (e.g. `owned_20260706_2am_reel`, `owned_20260709_answercard`). `utm_medium=organic`, `utm_campaign=launch_il` (or `avatar_challenge` for challenge-tied posts).
- **Important — owned posts use `utm_medium=organic`, NOT `influencer`.** `influencer` is reserved for creator links (`mk-p0-6` §B); owned content is first-party organic. Mixing them breaks the dashboard's owned-vs-creator attribution split.
- **Domain dependency:** if `mk-p0-1` ships a custom domain, the `APP_URL` in the bio + every post link must be regenerated to match — record a "regenerate links if domain changes" note (same discipline as `mk-p0-6`).

#### C. Posting cadence — 3-4 posts/wk, the steady-state rhythm (weeks 3-8)
A repeatable weekly template (vs the one-shot launch week in HeyGen §D). Times = **Israel time 20:30-21:30** (the wind-down scroll, per HeyGen §D). Each slot maps to a P0-7 template family and a copy-pack source:

| Slot | Day/time (IST) | Format (P0-7 family) | Source | `utm_content` format |
| :-- | :-- | :-- | :-- | :-- |
| 1 | Mon 21:00 | **2am-Reel** (hook) | copy-pack §6 HE hooks (lines 85-88) | `owned_<date>_2am_reel` |
| 2 | Wed 21:00 | **Answer-card** ("זה נורמלי?" reveal) | template `answer-card.html` + copy-pack §6 #2 | `owned_<date>_answercard` |
| 3 | Fri 20:30 | **UGC reshare** (creator/parent avatar) | repurposed from wave-1 creators (P1-2) | `owned_<date>_ugc` |
| 4 (optional) | Sat 11:00 | **#ArborAvatar** prompt / growth-card | `avatar-challenge.html` / `growth-card.html` | `owned_<date>_avatar` |

- **Floor = 3/wk** (slots 1-3); slot 4 is the stretch when UGC supply allows. Never drop below 3 — cadence consistency is the algorithmic signal.
- **UGC-first economics:** slots 3-4 are *repurposed* creator/challenge content (backlog P1-5 note: "Repurpose creator UGC"), keeping net-new production near €0 (GTM §6 content bucket is €1.5k total, mostly editing).
- Cross-post every vertical asset to YouTube Shorts (P1-7) — same file, new surface; that mirroring is owned by P1-7, this item just flags the handoff.

#### D. Caption + first-comment convention (per post)
Reuse copy-pack strings; do NOT author new long-form copy here (DRY). Per-post structure:
- **Caption (HE):** 1 hook line from copy-pack §6 (lines 85-88) + 1 calm CTA line. Bio link reference: `(קישור בביו)` per copy-pack §2 line 33.
- **First comment:** the per-post tagged link (§B) + `"חינם להתחלה"` (HeyGen §D first-comment pattern). Link in first comment, not caption, preserves Reel reach on IG.
- **Hashtags (HE), reuse HeyGen §D set:** `#הורות #אמהות #ArborAvatar` (+ `#2amtest` on 2am-Reel slots, `#גננת`/`#קלינאיתתקשורת` on professional-angle posts).
- **Voice guardrail (copy-pack line 4 / GTM §2):** calm, direct, humane, high-agency. Never fear-sell, never preach. Risk framing caps at calm "is this normal?" — never alarmist.
- **⚠ HE native-review gate:** all HE captions are launch-draft (copy-pack line 5, HeyGen line 4). The calendar must flag that captions pass Guy's native HE review before scheduling (EXECUTION-TRACKER "Landing copy → native HE review" is ⏳ on Guy — same gate applies to owned captions).

#### E. The deliverable artifact — a 6-week rolling calendar + playbook
A Markdown doc `marketing/arbor-owned-social-playbook.md` containing:
1. **Account setup block** (§A) — handles, Arvo pic, bios, bio-link convention.
2. **Link convention** (§B) — owned-channel UTM scheme + per-post slug rule + domain-regenerate note.
3. **Weekly cadence template** (§C table) — the repeatable 3-4 slot rhythm.
4. **A concrete 6-week rolling calendar** (weeks 3-8 of GTM) — each row = date, slot, format, the specific copy-pack hook/string to use, the template-kit file to fill, the per-post `utm_content` slug, and a Status column (`drafted → HE-reviewed → scheduled → posted → repurposed`). Pre-fill the first 2 weeks with exact copy-pack hooks; weeks 3-6 are slotted formats to fill from incoming UGC.
5. **UGC repurposing pipeline** — how a creator post (P1-2) becomes an owned reshare: save → re-cut in the 2am-Reel/avatar template → re-caption (with creator credit/permission) → schedule slot 3/4. Permission rule: only reshare with creator consent (no scraping).
6. **Scheduler note** — load into Metricool/Buffer (EXECUTION-TRACKER Milestone D), connect IG+TikTok, schedule the week ahead. Metricool connection is 🔒 Guy; the playbook is the paste-ready source.
7. **Weekly review hook** — points to P1-6 (`mk-p1-6-loop-optimization`): every Monday read per-post installs from the `mk-p0-5` dashboard (sliced by the owned `utm_content` slugs), cut losers, double winners, log winning creatives.

### Files to create / edit (exact repo-relative paths)
**Create:**
- `PAI/projects/parenting-os-plugin/marketing/arbor-owned-social-playbook.md` — the whole deliverable (§A-E above): account setup convention, owned-channel link/UTM convention, weekly 3-4 slot cadence template, a 6-week rolling content calendar (weeks 3-8) with per-post copy-pack hook + template-kit file + `utm_content` slug + status, the UGC repurposing pipeline, scheduler + weekly-review hooks.

**Edit (shared file — see conflict notes):**
- `PAI/projects/parenting-os-plugin/marketing/arbor-marketing-backlog.md` — update only the **P1-5 row** (line 34): link the playbook, mark the owned-channel cadence defined. Append-only on the notes cell.

**Reference only (do NOT edit):**
- `PAI/projects/parenting-os-plugin/marketing/arbor-launch-copy-pack.md` (all caption/hook/bio strings — §2, §6 lines 85-88).
- `PAI/projects/parenting-os-plugin/marketing/arbor-heygen-script-and-schedule.md` (§D launch-week pattern, §E bio — the steady-state cadence extends this, does not duplicate it).
- `PAI/projects/parenting-os-plugin/marketing/template-kit/` (P0-7 — the templates each slot fills; **hard dependency**).
- `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-he.html` (brand-token + link-destination source).
- `PAI/projects/parenting-os-plugin/marketing/arbor-il-creator-tracker.md` (P0-6 — the wave-1 creators whose UGC feeds slots 3-4).

### Shared-file conflict notes
- **`arbor-marketing-backlog.md`** is this item's only declared `sharedFiles` entry. It is **not** in the high-traffic `conflictHotspots` set (those are app-code files — `loopEvents.ts`, `navigation.ts`, `index.css`, the landing HTMLs). Many marketing items edit the backlog per-row. **Avoid clobber by editing only the single P1-5 table row (line 34)** — do not reflow the table, renumber rows, or touch other cells. Append-only discipline on the status/notes cell (same rule `mk-p0-7` and `mk-p0-6` follow).
- This item touches **zero app-code hotspots** — by design it is a content/ops playbook, so it runs fully parallel to every engineering mission with no serialization needed.
- It **reads from but does not edit** `arbor-marketing-landing-page-he.html` (a `mk-landing-parity-rebuild`/`mk-p0-1`/`mk-p0-5` hotspot) and `arbor-launch-copy-pack.md` (a `mk-p0-8`/`mk-p1-1`/`mk-p2-4`/`mk-p2-5` hotspot). No write conflict.
- The owned-channel UTM convention (§B) must stay consistent with the `mk-p0-5` canonical scheme and the `mk-p0-6` creator-link convention — treat both as **upstream contracts**. Owned uses `utm_medium=organic`; creators use `utm_medium=influencer`. Do not introduce a competing scheme or reuse the `il-<handle-slug>` creator `ref` namespace for owned posts.

### Dependencies (other item ids that must land first)
- **`mk-p0-7-template-kit`** (HARD — declared `dependsOn`). Every posting slot fills a P0-7 template (2am-Reel, answer-card, avatar-challenge, growth-card). Without the kit there is nothing to post on-brand. The playbook's calendar references the kit files by name; it cannot be executed until the kit ships.
- **`mk-p0-5-attribution-utm`** (soft, scheme contract) — supplies the canonical UTM vocabulary and the landing→app `data-cta="app"` handoff every owned link resolves to. Link values are final only once the scheme is locked. The playbook can be drafted in parallel.
- **`mk-p0-1-domain`** (soft) — if a custom domain ships, the bio + per-post `APP_URL` regenerate to match. Record the "regenerate if domain changes" note.
- **`mk-p0-3-share-export`** (soft input) — the in-app share export produces the avatar/answer/growth artifacts shown in posts; owned content mirrors its watermark/aspect (which P0-7 already locks). Not blocking the playbook authoring.
- **`mk-p0-8-copy-pack`** (✅ done) — supplies every caption/hook/bio string.
- **`mk-p0-6-creator-list` / `mk-p1-2`** (soft, content supply) — wave-1 creator UGC feeds the repurposing slots (3-4). The owned engine starts on template-kit content even before UGC exists.
- Not blocked by any app-build IA train (no `navigation.ts`/`Shell.tsx`/context touch). The account creation + Metricool connection are 🔒-on-Guy operational blockers (EXECUTION-TRACKER Milestone D), not authoring blockers — the playbook ships paste-ready regardless.

### Acceptance criteria (testable, including "verified live on dev server")
1. `marketing/arbor-owned-social-playbook.md` exists and contains all six §E sections: account setup, link convention, weekly cadence template, the 6-week rolling calendar, UGC repurposing pipeline, scheduler + weekly-review hooks.
2. **Cadence floor:** the weekly template defines **≥3 posts/wk** (target 3-4) mapped to specific P0-7 template families and copy-pack sources — countable in the §C table.
3. **Link convention valid:** the bio link and per-post link templates use ONLY canonical `mk-p0-5` values (`utm_source∈{instagram,tiktok,youtube}`, `utm_medium=organic`, `utm_campaign∈{launch_il,avatar_challenge}`, `utm_content` snake_case slug) — and explicitly use `organic` (not `influencer`, which is reserved for creators).
4. **Attribution round-trip (verified live on dev server):** loading the dev app (`npm run dev` in `PPPPtherapy-/PPPPtherapy-/app`) with one owned per-post link's query string (e.g. `?utm_source=instagram&utm_medium=organic&utm_campaign=launch_il&utm_content=owned_20260706_2am_reel`) results in `localStorage["arbor.attribution"]` showing `source:"instagram"`, `utmContent:"owned_20260706_2am_reel"`, `market:"il"` — proving owned posts attribute through the already-built `attribution.ts` and stay distinct from creator (`influencer`) traffic in the dashboard. (No code change; this validates the link format the playbook produces.)
5. **DRY:** captions, hooks, and bio are *referenced* (pointers to copy-pack §2/§6 and HeyGen §E), not duplicated into the playbook; the calendar cites which copy-pack line each slot uses.
6. **HE-review gate present:** the calendar's Status lifecycle includes an `HE-reviewed` step before `scheduled`, flagging that draft HE captions pass Guy's native review (matching the copy-pack line 5 / EXECUTION-TRACKER gate).
7. **Backlog P1-5 row updated:** playbook linked, owned-channel cadence marked defined — single-row, append-only edit (no table reflow).
8. **Template dependency explicit:** the playbook states it is unexecutable until `mk-p0-7-template-kit` ships, and references each kit file by name per slot.

### Operating-rule checks
- **No dark patterns:** owned content uses honest calm hooks (copy-pack §6) — no fake urgency, no manufactured scarcity, no fear-sell (2am framing stays calm "is this normal?", never alarmist, per GTM §2 brand tension). UGC reshares require **creator consent** (permission rule in §E5) — no scraping, no astroturfing. The bio link is the same honest app handoff parents see everywhere.
- **Privacy / COPPA-2026:** owned posts use the **privacy-safe stylized Arvo character** (not photo-real), per GTM risk mitigation (§10). Answer-card and growth-card posts use placeholder/redacted names (matching P0-3's default-redact and P0-7's privacy rule) — never a child's real PII or face. UTM/slugs are campaign metadata, never personal identifiers; attribution is first-party only (`attribution.ts`/`analytics.ts` stance — no third-party scripts).
- **Moat read/write:** owned posts **write** first-touch channel (`source:"instagram"/"tiktok"`, owned slug) into the per-family attribution record every future event inherits — seeding the moat with where each family came from; the weekly-review hook (§E7) **reads** the `mk-p0-5` longitudinal event stream (per-slug installs) to make owned-channel yield legible for the P1-6 cut/double decision. The growth-card slot makes the memory moat itself visible in shareable form.
- **Ships-visible:** the visible win is a paste-ready owned-channel operating system — a non-designer can open the playbook, fill a week from the template kit + copy pack, and schedule 3-4 on-brand HE posts the same day; the attribution round-trip (AC #4) is demonstrable on the dev server, proving owned links actually attribute distinctly from creator traffic.
