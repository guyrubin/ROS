## mk-p2-2-nl-communities — NL communities + micro-creators
**Aspects:** Marketing · **Surfaces/platforms:** landing:en · **Priority:** P2

### Problem / why
The GTM plan makes the Netherlands the **anchor-2 market** after Israel proves the loop (`arbor-viral-gtm-2026-H2.md:5–6`, `:79–82`, phasing `:140`). NL is explicitly **consumer-led** there ("institutional path stays warm but consumer-led here", `:81`), and the named acquisition engine is **parenting communities + Dutch micro-creators + a consultatiebureau-adjacent angle** (`:81`). Backlog item P2-2 (`arbor-marketing-backlog.md:47`) tasks exactly this: *"NL communities + micro-creators (Ouders.nl, FB ouder-groups) + consultatiebureau-adjacent angle"* — effort M, content + spend, depends on the NL localization landing first.

Today there is **no NL community/creator operating asset**. We have: an IL creator tracker (`arbor-il-creator-tracker.md`) and an IL WhatsApp/FB group playbook (`mk-p1-3-whatsapp-fb-playbook` → `arbor-whatsapp-fb-group-playbook.md`) as proven format templates, the referral primitive (`mk-p0-2-referral-loop`), the UTM/attribution contract (`mk-p0-5-attribution-utm`), and the loop-optimization read (`mk-p1-6-loop-optimization`). What is missing is the Dutch-market equivalent: who to seed, where the Dutch parent packs actually live, the consultatiebureau-adjacent positioning, the exact NL community-entry doctrine (Dutch parents are notably allergic to overt self-promo — the "never get banned" doctrine matters even more than in IL), and the attributable link contract pointing at the **NL landing** so NL traffic is isolated in the funnel.

This is a **mission (content/ops asset), NOT an app-code build.** No files under `PPPPtherapy-/PPPPtherapy-/app/src` are edited. The only product-surface touch is one minimal language-switcher link on the **EN marketing landing** (the declared surface) so the EN page exposes the new `/nl` route created by the dependency `mk-p2-1-localize-nl`.

### Scope across platform domains
- **Web app:** Out of scope. The in-app invite affordance + referral grant are owned by `mk-p0-2-referral-loop`; this item consumes the link those produce. No app edits.
- **iOS / Android (Capacitor):** Out of scope. NL community members open the referral/UTM link in a mobile browser → resolves to the NL landing → deep-links into the app/stores (link plumbing owned by `mk-p0-1-domain` + `mk-p2-1-localize-nl`).
- **Landing EN (`arbor-marketing-landing-page-en.html`) — the only product-surface touch:** add a Dutch (`Nederlands`) language-switcher link to the new `/nl` landing that `mk-p2-1-localize-nl` creates, mirroring the existing `עברית` switcher (nav line 145, footer CTA line 286). This is a **single-link append**, no layout/copy/structure change. If `mk-p2-1-localize-nl` has not yet landed the `/nl` route, do **not** add a dangling link — record the switcher as a follow-up in the playbook and make **zero** HTML edits.
- **Landing HE (RTL):** Out of scope.
- **Landing NL:** the destination this campaign drives to, but its creation/localization is owned by the dependency `mk-p2-1-localize-nl`. This item does not build or restyle the NL landing — it specifies the link/UTM contract the NL landing must honor and verifies attribution end-to-end.

### IA / UX / Copy / Marketing detail (concrete, build-level)

The primary deliverable is one markdown ops asset: `PAI/projects/arbor/marketing/arbor-nl-community-creator-playbook.md`. Disciplines applied: `marketing:campaign-plan` for channel sequencing + `rubin-os:copywriter` for the NL/EN outreach scripts. It MUST contain the following sections, fully written (no placeholders, no "[TBD]").

#### 1. NL channel map & "never get banned" doctrine (Dutch-specific)
- **Communities:** (a) **Ouders.nl** forum + community (the named anchor) → value-contribution + signature/profile presence, never thread-spam; (b) **Facebook ouder-groepen** — regional/city groups ("Moeders van [stad]", "Ouders van [jaar] kinderen", peuter/kleuter groups) → admin partnership or organic value, never cold link-drop; (c) **Consultatiebureau-adjacent** parent networks (mother-and-baby groups, JGZ/GGD-adjacent online communities) → the warm institutional-adjacent angle; (d) optional: Viva Mama / Babyboom-style forums.
- **The 3 hard rules (bright lines, same doctrine as the IL playbook §1):** (1) never post a bare app link cold; (2) never DM members unsolicited; (3) never post in admin-gated groups without the admin's explicit yes. Add the **NL nuance:** Dutch communities punish overt commercialism harder than IL — lead with directness and usefulness, *bespreekbaarheid* over hype, never fear-sell. Disclose plainly that you're behind Arbor.
- **Value-first ratio:** ≥5 genuinely useful, non-promotional contributions before any single Arbor mention. Earn the right to share.

#### 2. Consultatiebureau-adjacent angle (the NL differentiator)
- Position Arbor as the calm at-home companion **between** consultatiebureau visits — "what the consultatiebureau can't watch day-to-day." Explicitly **consumer-led, not an institutional sell** (per `arbor-viral-gtm-2026-H2.md:81`): no claim of CB endorsement, no medical/diagnostic claim, non-diagnostic and AVG/GDPR-first stated plainly.
- One ready NL positioning paragraph + 2 community-safe framings parents recognize ("is dit normaal voor zijn leeftijd?" / "wat doe ik vanavond?").

#### 3. NL creator sourcing method + target profile
- **Profile:** Dutch parenting/mom-dad micro-creators (5k–80k), high comment-to-like ratio; adjacent NL professionals punching above follower count — logopedist (SLP), kraamverzorgende, pedagoog, kinderpsycholoog, slaapcoach, opvoedcoach; large ouder-group admins (partnership play, not a post).
- **Sourcing method (mirror `arbor-il-creator-tracker.md:18–23`):** IG/TikTok hashtag mining (`#opvoeden` `#mamablog` `#papablog` `#peuter` `#kleuter` `#ouderschap` `#logopedie` `#kinderontwikkeling` `#zwanger`); following-graph of 2–3 known NL parenting accounts; FB ouder-groep expert contributors; Google/YouTube NL parenting + professional channels; directories (Modash NL/family, infludata NL). Score on **engagement rate** + audience fit + brand-safety, not raw reach.
- **Honesty rule (carry over from the IL tracker `:6`):** do NOT fabricate handles/follower counts. Provide the sourcing method + an empty vetted tracker; flag that a live web/IG research pass populates real candidates before any outreach.

#### 4. NL outreach scripts (Dutch primary + EN reference) — `rubin-os:copywriter`
Ready-to-send copy, calm/direct/humane, matching the launch copy-pack voice (no fear-sell, no preach). Dutch first because NL is the target.
- **Admin DM (NL, final, not a sketch):**
  > Hoi [naam] 🙂 Ik ben [naam], ouder van [leeftijd] en sta achter Arbor — een rustige app die ouders helpt begrijpen wat er met hun kind speelt en wat je vanavond concreet kunt doen, zonder drama en zonder diagnoses. Ik kom hier niet adverteren — ik draag graag iets bij aan de groep: "is dit normaal?"-vragen beantwoorden zonder tegenprestatie, en als je wilt, gratis toegang voor jullie leden. Zullen we het doen op een manier die binnen jouw regels past?
- **Creator DM (NL, final):**
  > Hoi [naam], ik volg je content over [niche] en denk dat Arbor echt bij je publiek past — een rustige, niet-diagnostische app die ouders helpt te begrijpen wat er met hun kind speelt en wat ze vanavond kunnen doen. Ik geef je graag gratis toegang én een Arbor-avatar van je eigen kind, zonder verplichtingen. Als het klikt, praten we over een kleine samenwerking + een eigen code. Interesse?
- **EN reference versions** of both, verbatim, in the asset.
- All must: lead with parent/peer identity, name the no-promo intent, offer real value (free Q&A / free access / kid avatar), and hand control to the admin/creator.

#### 5. Value-post templates (the 5:1 "earn it" content, NL)
3–4 ready Dutch posts that contribute without selling — a "is dit normaal?" reassurance, a one-line developmental note, an answer-card-style reply. Each ends with a soft, opt-in mention only when contextually invited ("ik heb hier een gratis bron voor als het relevant is — laat maar weten"). Port the proven hook structure from `arbor-launch-copy-pack.md` (hooks #1/#2/#4/#8), translated/transcreated to NL — not literal IL copy.

#### 6. Referral-spread mechanic + link/UTM contract (the verifiable artifact)
- A seeded NL parent/creator activates in-app, gets their **stable referral link** from the invite affordance built by `mk-p0-2-referral-loop` (`ARBOR-XXXX`, `https://<canonical>/nl/?ref=ARBOR-XXXX`). They share *their own* link as a member ("dit hielp mij echt met [kind] — eerste maand is van mij"), symmetric free-Plus-month payoff on the invitee's first plan.
- **Exact, copy-pasteable link contract** (mirrors `mk-p1-3` §5, but NL-routed and NL-tagged):
  ```
  https://<canonical-nl>/?ref=ARBOR-XXXX&utm_source=ouders&utm_medium=forum&utm_campaign=nl_communities
  https://<canonical-nl>/?ref=ARBOR-XXXX&utm_source=facebook&utm_medium=group&utm_campaign=nl_communities
  https://<canonical-nl>/?ref=ARBOR-XXXX&utm_source=instagram&utm_medium=creator&utm_campaign=nl_creators
  https://<canonical-nl>/?ref=ARBOR-XXXX&utm_source=tiktok&utm_medium=creator&utm_campaign=nl_creators
  ```
  - `<canonical-nl>` is the `/nl` route created by `mk-p2-1-localize-nl`, on the canonical domain from `mk-p0-1-domain`. Until both land, use the `web.app` origin's NL path with a swap note.
  - `ref` is the operator's/creator's own code from `mk-p0-2`. `utm_*` lower-case, fixed vocabulary above. `utm_campaign` = `nl_communities` (groups/forums) vs `nl_creators` (seeded creators) so `mk-p1-6-loop-optimization` can isolate NL-community K vs NL-creator K, and NL vs IL.
  - The NL landing must preserve both `ref` and `utm_*` through to install (verified, not assumed) — this is owned by `mk-p0-5-attribution-utm` + `mk-p2-1-localize-nl`; this item asserts the contract and verifies it.

#### 7. Operating cadence, guardrails, tracker stub
- Weekly: 2–3 new community/admin relationships + 2–3 creator conversations, not blasts. Hard-stop conditions (when to back off a community entirely). Hand NL install/K numbers to `mk-p1-6-loop-optimization` weekly; cut/double per the GTM kill rule (`arbor-viral-gtm-2026-H2.md:130`).
- **Tracker stub** — markdown table operators fill in, mirroring `arbor-il-creator-tracker.md:59` format so trackers are consistent:
  `Handle/Group | Platform/Type | Reach | Eng. rate | Niche | Admin/contact | Brand-safe? | Status (cold→contacted→in talks→approved/confirmed→active→declined) | Referral/affiliate code | UTM source | Installs (UTM) | Notes`
- **Winners-only discipline:** localize/seed only the **top-5 winning IL assets** ported by `mk-p2-1-localize-nl` (`arbor-marketing-backlog.md:46`, `arbor-viral-gtm-2026-H2.md:80`) — do not produce bespoke NL content; repurpose proven creative.

### Files to create / edit (exact repo-relative paths)
**Create:**
- `PAI/projects/arbor/marketing/arbor-nl-community-creator-playbook.md` — the full playbook (sections 1–7 above), NL-primary scripts with EN reference + NL creator tracker stub.

**Edit:**
- `PAI/projects/arbor/marketing/arbor-marketing-backlog.md` — mark the P2-2 row status (in-progress/done) and link the new playbook in the P2-2 Notes cell (line 47, currently empty). **Append-only, row-local** edit to that one cell; do not reflow the table or renumber rows.
- `PAI/projects/arbor/html/arbor-marketing-landing-page-en.html` — **only if `mk-p2-1-localize-nl` has landed the `/nl` route.** Add one `Nederlands` language-switcher anchor next to the existing `עברית` link in the nav (after line 145) and optionally the footer CTA actions (line 286), pointing at the NL landing path. No layout/copy/structural change — a single anchor matching the existing `.nav-links` / `.btn-ghost` pattern. If `/nl` does not yet exist, make **zero** edits here and note the switcher as a follow-up in the playbook.

### Shared-file conflict notes
- **`PAI/projects/arbor/marketing/arbor-marketing-backlog.md`** — this item's declared `sharedFiles` entry; the marketing index many MK missions touch (status cells). **Avoid clobber:** edit only the single P2-2 row's Notes/status cell; do not reflow the table or renumber rows. Other MK items edit their own rows — keep edits strictly row-local and append-only.
- **`PAI/projects/arbor/html/arbor-marketing-landing-page-en.html`** — per the conflict hotspot list this file is touched by `mk-landing-parity-rebuild`, `mk-p0-1-domain`, `mk-p0-5-attribution-utm`, `mk-p2-1-localize-nl`, `p3-ios-grade-audit`. The hotspot note is explicit: **`mk-landing-parity-rebuild` REWRITES this file wholesale — run it FIRST**, then `mk-p0-1` (canonical URL) + `mk-p0-5` (UTM/CTA wiring) + `mk-p2-1` (`/nl`) patch the rebuilt file. **This item defers to all of them:** it makes at most a single language-switcher anchor append, and only *after* `mk-p2-1-localize-nl` has created the `/nl` route on the rebuilt page. Keep the edit to one added anchor on existing nav/footer structure so it cannot collide with the parity rewrite or the UTM/CTA wiring. Ideally this item makes **zero** HTML edits and `mk-p2-1-localize-nl` adds the EN→NL switcher itself as part of shipping `/nl`; in that case this item only verifies the switcher exists.

### Dependencies (other item ids that must land first)
- **`mk-p2-1-localize-nl`** (declared `dependsOn`, hard) — creates the `/nl` landing variant + NL answer/content native review + ports the top-5 winners to NL. This campaign drives traffic to that landing and seeds those exact winners; without it there is no NL destination and no NL creative.
- **`mk-p0-2-referral-loop`** (hard, transitive via IL) — the per-user stable referral link + symmetric free-month grant that the community/creator spread rides. Without it the spread has no product loop.
- **`mk-p0-1-domain`** (soft) — the canonical domain the `/nl` link points to. Until it lands, use the `web.app` origin with a swap note.
- **`mk-p0-5-attribution-utm`** (soft, recommended-before) — owns `?ref=`/`utm_*` pass-through on the landings. This item specifies the NL `utm_*` vocabulary for it to honor and verifies it.
- **`mk-p1-6-loop-optimization`** (soft, downstream consumer) — reads the NL-tagged funnel this item produces.
- **Proof gate (process, not a spec id):** per `arbor-viral-gtm-2026-H2.md:58`/`:141`, NL spend (the `💳` in P2-2) should not start until IL proves K ≥ 0.4 / activation ≥ 35%. The playbook can be authored and communities warmed in parallel; **no paid euro until the IL loop clears its bar.**

### Acceptance criteria (testable, including "verified live on dev server")
1. `arbor-nl-community-creator-playbook.md` exists at the path above and contains all 7 sections fully written, with NL-primary admin + creator DMs and NL value-post templates (no placeholders, no "[TBD]"), plus a populated-format NL creator/community tracker stub.
2. The playbook's link/UTM contract (section 6) is exact and copy-pasteable for all four NL channels, NL-routed (`/nl`) and NL-tagged (`utm_campaign=nl_communities` vs `nl_creators`).
3. **Verified live on dev server:** open the NL landing via a constructed link `…/nl/?ref=ARBOR-TEST&utm_source=ouders&utm_medium=forum&utm_campaign=nl_communities`, complete the install/profile path, and confirm in the analytics dev console (per `mk-p0-4-analytics-wiring`) that the resulting events carry `referral_code=ARBOR-TEST`, `utm_source=ouders`, `utm_medium=forum`, `utm_campaign=nl_communities`. (This proves the NL channel is attributable end-to-end and isolable from IL.)
4. If the EN→NL switcher was added: the EN landing renders identically before/after except the one added `Nederlands` anchor, which navigates to the live `/nl` route (no 404); diff shows at most one added anchor on existing structure. If `/nl` not yet live: zero HTML edits and the switcher is logged as a follow-up.
5. `arbor-marketing-backlog.md` P2-2 row links the new playbook and the rest of the table is byte-identical outside that one row.
6. The NL outreach + value-post copy carries a Dutch native-review flag (matching the copy-pack `⚠ launch-draft` convention) — Dutch marked needs-native-review before live use, consistent with the dependency's "HE/EN answer content native review" requirement (`arbor-marketing-backlog.md:46`).

### Operating-rule checks
- **No dark patterns:** central doctrine is value-first, admin-consented, no cold link-drops, no unsolicited DMs (§1). The referral offer is symmetric and honestly stated ("both get a free month," auto-lapses to Free — inherited from `mk-p0-2`). No fake scarcity, no astroturfing: operators/creators share as genuine members/voices, disclosing they're behind Arbor in the scripts. NL nuance explicitly warns against the commercialism Dutch communities reject.
- **Privacy / COPPA-2026 / AVG-GDPR:** the referral link is an HMAC-derived parent-account code (per `mk-p0-2`) — **no child data, name, or photo** in any link, post, or script. Value-post templates speak in general developmental terms, never about a specific named child. UTM params are channel metadata only, no PII. The consultatiebureau-adjacent angle (§2) is explicitly non-diagnostic, claims no institutional endorsement, and leads with the AVG/GDPR parent-owned-data posture (per `arbor-viral-gtm-2026-H2.md:150`).
- **Moat read/write:** the loop's payoff is earned by genuine product activation (the invitee's *first generated plan* = first write into the longitudinal memory moat, per `mk-p0-2`), so NL community/creator spread converts into real moat-building families, not hollow signups. The playbook itself writes no child/product data — it is an ops asset; the only writes are account-level entitlement grants handled by the dependency.
- **Ships-visible:** the deliverable is a real, reusable markdown asset linked from the marketing backlog; the NL channel is operational and measurable end-to-end via the live `/nl` `?ref=`+UTM contract verified on the dev server — an executable playbook a human can run, not a deck. The optional EN→NL switcher is a visible, navigable affordance on the live EN landing.
