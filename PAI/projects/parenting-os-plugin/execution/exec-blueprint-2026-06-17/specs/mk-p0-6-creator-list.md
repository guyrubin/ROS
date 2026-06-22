## mk-p0-6-creator-list — IL creator list (15-25)
**Aspects:** Marketing · **Surfaces/platforms:** landing:he · **Priority:** P0

### Problem / why
P1 IL ignition (avatar challenge + creator seeding wave 1, ~€1.5k of the €3k creator bucket) cannot start without a vetted, contact-ready roster of Hebrew parenting / SLP / kindergarten micro-creators (5k–80k followers, engagement over reach). The GTM plan (`marketing/arbor-viral-gtm-2026-H2.md` §3, §6, budget table line 95) names this list as foundation P0-6: "15–25 IL micro-creators (product + small fees + affiliate code)." The marketing backlog (`marketing/arbor-marketing-backlog.md` P0-6) requires "a sheet with handle, reach, angle, status."

The asset partially exists: `marketing/arbor-il-creator-tracker.md` already holds the sourcing method, the who-we-want profile, a vetted Tier-A / Tier-B starting list (~7 confirmed candidates), the Arabic sub-market note, sourcing directories, and a tracker table skeleton. **The gap is operational completeness, not a blank page:**
1. The roster is **~7 named candidates, not the 15–25 the gate requires** — the directory-mining step (Modash / infludata / StarNgage) has not been executed to fill it out.
2. The tracker has **no affiliate-code column convention that ties a creator to the live loop.** `attribution.ts` parses `?ref=` as `referralCode` and `utm_content` as the creative slug (`attribution.ts:64`, `:75`), so each creator's link must carry a deterministic `ref` code + `utm_content` slug for `mk-p0-4` events and the `mk-p0-5` dashboard to attribute installs per creator. The tracker today says "Affiliate code" but never defines the format.
3. No **per-creator outbound link convention** is recorded, so outreach would produce inconsistent UTM (the exact failure `mk-p0-5` warns about).

This item makes the tracker a build-ready, loop-wired content asset: complete the roster to ≥15 vetted rows, add the affiliate-code + UTM convention column-by-column, and lock the outreach → link → attribution chain so wave 1 (P1-2 / `mk-p1-2`) can run the moment share-export (`mk-p0-3`) and domain (`mk-p0-1`) are live. This is content-only (✍) — **no app code changes.**

### Scope across platform domains
- **Landing HE (RTL)** — the only product surface in scope, and only indirectly: every creator's outbound link resolves to the HE landing / app handoff. This item does **not edit** `html/arbor-marketing-landing-page-he.html`; it **consumes** the landing's `data-cta="app"` handoff defined by `mk-p0-5` and produces the tagged URLs creators post (Instagram bio link, story link). The deliverable records, per creator, the exact HE-market link string they receive.
- **Web / iOS / Android:** out of scope — no native or web-app changes. Affiliate codes are consumed by the already-built `attribution.ts` capture (no code change needed here; the capture is done and unit-tested per `mk-p0-5`).

This is a Markdown content/ops asset under `marketing/`. The only file written is the tracker.

### IA / UX / Copy / Marketing detail (Marketing)

#### A. Roster completeness — fill to ≥15 vetted rows
Execute the documented sourcing method (`arbor-il-creator-tracker.md` lines 18–24) to add **8–18 more candidates** on top of the existing 7, hitting the 15–25 target. Method, in order of yield:
1. **Directory mining (highest yield):** pull family/parenting IL creators in the 5k–80k band from the four directories already listed (Modash `israel/family`, infludata IL family ranking, StarNgage IL moms, Favikon/HypeTrace engagement-rate filter). Filter on engagement rate, not follower count.
2. **Hashtag + following-graph mining:** `#אמהות` `#הורות` `#גננת` `#קלינאיתתקשורת` `#אבאשל` `#ילדים` `#חינוך`; walk the "following" graph of @galtamari1 / @beitna.official for micro-peers.
3. **Professional long tail:** SLPs (קלינאיות תקשורת), kindergarten teachers (גננות), child psychologists, OTs, sleep consultants (יועצות שינה), parent coaches (מאמני הורים) — they punch above follower count on trust and are the perfect "Ask-a-Specialist" story.

> **Verification discipline (carry forward the existing doc's stance):** do NOT fabricate handles or follower counts. Every added row gets a **Confidence** rating (High = count sourced / Med = profile exists, size unconfirmed online / Low = verify before DM) and a **Source** link. Hebrew coverage in US-indexed search is thin — flag any row where reach/engagement could not be confirmed on the actual profile, so outreach verifies before DMing. A vetted starting list beats an invented complete one.

Keep the existing tier structure: **Tier A** parenting coaches / family creators (reach + relatability), **Tier B** professionals (trust, Ask-a-Specialist angle). Recommended wave-1 mix is already stated (3–5 Tier-A + 6–8 Tier-B + directory fill) — preserve it.

#### B. Affiliate-code + UTM convention (the loop wiring — the real build value)
Lock a deterministic per-creator link scheme so installs attribute to the right creator via the already-built `attribution.ts`. Record this convention in the tracker as source of truth, and pre-compute the values per row.

- **Affiliate / referral code (`ref`):** `il-<handle-slug>` — lowercase, ASCII, IL-market prefix, handle without `@`/dots (e.g. `@galtamari1` → `il-galtamari1`; `Noa Barak` → `il-noabarak`). Parsed by `attribution.ts:64` (`p.get("ref")`) → stored as `referralCode`, and `source` resolves to the creator's `utm_source` when present (priority: `utm_source` > referrer host > `ref` → `referral`, per `attribution.ts:67`). The `ref` slug is what disambiguates creators inside the `creator` channel.
- **`utm_content` slug:** the same `il-<handle-slug>` (so the per-creator creative is sliceable in the `mk-p0-5` dashboard even before a paid `ref` redemption). Parsed at `attribution.ts:75`.
- **Channel UTM (must match `mk-p0-5` canonical scheme — lowercase snake_case):**
  - `utm_source=instagram` (or `tiktok`)
  - `utm_medium=influencer`
  - `utm_campaign=avatar_challenge` (or `launch_il` for non-challenge seeding posts)
- **Canonical creator link (IL Instagram bio, avatar challenge), recorded per row:**
  `https://arborprd-westeu.web.app/?utm_source=instagram&utm_medium=influencer&utm_campaign=avatar_challenge&utm_content=il-galtamari1&ref=il-galtamari1`
  (App origin must match `mk-p0-1-domain` if a custom domain is set — note this dependency in the tracker so codes aren't baked stale.)

> Do not invent UTM values outside the `mk-p0-5` canonical set — `utm_medium=influencer`, `utm_source∈{instagram,tiktok,youtube}`, `utm_campaign∈{avatar_challenge,launch_il}`. Inconsistent casing/values break dashboard aggregation (the exact failure `mk-p0-5` §A guards against).

#### C. Tracker table — extend the existing skeleton
Upgrade the live tracker table (`arbor-il-creator-tracker.md` lines 57–63) to the operational columns wave 1 needs, and pre-fill rows from Tier A/B + directory finds:

| Column | Purpose |
| :-- | :-- |
| Handle / name | `@handle` or real name (HE in parens) |
| Platform | instagram / tiktok / youtube / site+group |
| Reach (approx) | follower band; mark `(unconf.)` if not verified |
| Eng. rate | filled at outreach-time from the live profile |
| Tier | A (coach/family) / B (professional) |
| Niche / angle | the real "is this normal at 2am" brief hook for them |
| Confidence | High / Med / Low (verify before DM) |
| Brand-safe? | Y/N/check — no bot-spam comments, parenting niche |
| **Affiliate code (`ref`)** | `il-<handle-slug>` (pre-computed) |
| **Creator link** | full tagged URL (per §B) |
| Status | not contacted → DM sent → in talks → confirmed → posted → renewed/dropped |
| Posted? / Installs | filled post-launch from the `mk-p0-5` dashboard |
| Fee / gift | product-only / gift / small fee (€) — track against the ~€1.5k wave-1 budget |
| Source | provenance link for the candidate |

#### D. Outreach copy reference (no new copy authored)
Reference, do not duplicate: outreach uses the §3 HE creator DM in `marketing/arbor-launch-copy-pack.md` (free access + an avatar of *their* kid, no strings; paid collab if it clicks) and the §2 #ArborAvatar challenge brief. Each tracker row's "Niche / angle" cell records the personalized `[topic]` token the DM expects. Keep the DRY pointer to the copy pack — do not paste DM copy into the tracker.

### Files to create / edit (exact repo-relative paths)
**Edit (single file — this is the whole deliverable):**
- `PAI/projects/parenting-os-plugin/marketing/arbor-il-creator-tracker.md` — (1) add 8–18 vetted rows to Tier A/B + a directory-sourced fill section to reach ≥15 total; (2) add the affiliate-code + UTM convention block (§B) as a documented sub-section; (3) replace the bare tracker table (lines 57–63) with the operational columns in §C and pre-fill `ref` codes + creator links for every named candidate; (4) keep the verification-discipline disclaimer and the Arabic-wave note intact.

**No app code, no landing HTML, no new files.**

### Shared-file conflict notes
- **`marketing/arbor-il-creator-tracker.md`** is this item's **declared `sharedFiles` entry and is touched by no other mission** in the conflict map — it is not in `sharedFileMap` or `conflictHotspots`. No clobber risk; this item owns the file outright.
- **`marketing/arbor-launch-copy-pack.md`** (hotspot: `mk-p0-8-copy-pack`, `mk-p1-1-avatar-challenge`, `mk-p2-4`, `mk-p2-5`) — this item only **reads/links** to §2/§3; it does **not edit** the copy pack. No conflict.
- **`marketing/arbor-marketing-backlog.md`** — optional: flip the P0-6 row note to point at the completed tracker. If edited, append-only (one cell), to avoid colliding with any backlog-maintenance pass.
- **`attribution.ts`** — read-only dependency. This item invents **no** new parsing; it uses the existing `ref` / `utm_content` parsing (`attribution.ts:64`, `:75`). Do not request changes here — that surface is owned by `mk-p0-2` / `mk-p0-5`.
- The affiliate-code format (`il-<handle-slug>`) and channel UTM values must stay consistent with `mk-p0-5`'s canonical scheme and `mk-p0-2`'s `ref` capture — treat both as upstream contracts; do not introduce a competing code format.

### Dependencies (other item ids that must land first)
- **`mk-p0-5-attribution-utm`** (soft, scheme contract) — supplies the canonical UTM vocabulary (`utm_medium=influencer`, campaign names) and the landing→app handoff the creator links resolve to. Codes/links in the tracker must match its scheme. The list can be drafted in parallel, but link values are final only once the scheme is locked.
- **`mk-p0-1-domain`** (soft) — if a custom app domain ships, the `APP_URL` in every creator link must match it. Record this as a "regenerate links if domain changes" note so codes aren't baked stale.
- **`mk-p0-2-referral-loop`** (soft) — owns `ref` capture + per-user code generation; the `il-<handle-slug>` creator codes must not collide with user-generated invite codes (creator codes are namespaced `il-`). 
- Not blocked by any app-build IA train (no `navigation.ts` / `Shell.tsx` / context touch). Can start immediately; only the final link strings wait on the scheme + domain.

### Acceptance criteria (testable, including "verified live on dev server")
1. **Roster size:** `arbor-il-creator-tracker.md` contains **≥15 (target 15–25) distinct candidate rows** across Tier A + Tier B + directory fill — countable in the table(s).
2. **No fabrication:** every row has a **Confidence** rating and a **Source** link; rows whose reach/engagement could not be verified online are explicitly flagged `(unconf.)`. No invented handle ships without a verify flag.
3. **Affiliate-code convention documented + applied:** the `il-<handle-slug>` format is stated once as source of truth, and **every named candidate row has a pre-computed `ref` code and a full tagged creator link**.
4. **UTM validity:** every creator link uses only canonical `mk-p0-5` values (`utm_medium=influencer`; `utm_source∈{instagram,tiktok,youtube}`; `utm_campaign∈{avatar_challenge,launch_il}`); lowercase snake_case; `utm_content` == `ref`.
5. **Attribution round-trip (verified live on dev server):** loading the dev app (`npm run dev` in `PPPPtherapy-/PPPPtherapy-/app`) with one tracker creator link's query string (e.g. `?utm_source=instagram&utm_medium=influencer&utm_campaign=avatar_challenge&utm_content=il-galtamari1&ref=il-galtamari1`) results in `localStorage["arbor.attribution"]` showing `referralCode:"il-galtamari1"`, `source:"instagram"`, `utmContent:"il-galtamari1"`, `market:"il"` — proving the convention attributes to that creator through the already-built `attribution.ts`. (No code change; this validates the link format the tracker produces.)
6. **Operational columns present:** the tracker table has at minimum Handle, Platform, Reach, Tier, Niche/angle, Confidence, Affiliate code, Creator link, Status, Fee/gift — matching §C; status uses the defined lifecycle values.
7. **Budget-aware:** wave-1 fee/gift column sums are trackable against the ~€1.5k wave-1 allocation; the recommended 3–5 Tier-A + 6–8 Tier-B mix is preserved.
8. **DRY:** outreach copy is referenced (pointer to `arbor-launch-copy-pack.md` §2/§3), not duplicated into the tracker.

### Operating-rule checks
- **No dark patterns:** outreach leads with genuine free access + a kid avatar, **no strings** (per copy pack §3); paid collab is opt-in only. Creators disclose affiliate relationships (the brief asks for authentic "real 2am moment" posts, not fake endorsements). No bot-spam, no astroturfing — brand-safety column screens out bot-comment accounts and non-parenting lifestyle accounts.
- **Privacy / COPPA-2026:** affiliate codes (`il-<handle-slug>`) and UTM values are **campaign metadata, never personal identifiers** and carry no child data. Attribution is first-party only (existing `attribution.ts`/`analytics.ts` stance — no third-party scripts). Creator-shared avatars are the privacy-safe stylized character, not a child's photo.
- **Moat read/write:** each creator link **writes** first-touch channel + creator code into the per-family attribution record that every future event inherits (seeds the moat with where each family came from); the Posted?/Installs columns **read** the `mk-p0-5` dashboard's longitudinal event stream to make per-creator yield legible for wave-2 cut/double decisions.
- **Ships-visible:** the visible win is a contact-ready, loop-wired roster that unblocks P1-2 creator seeding the moment share-export + domain are live; the attribution round-trip (AC #5) is demonstrable on the dev server, proving the links actually attribute.
