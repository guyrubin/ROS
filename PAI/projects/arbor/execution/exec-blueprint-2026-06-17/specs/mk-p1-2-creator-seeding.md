## mk-p1-2-creator-seeding — Creator seeding wave 1 (~EUR1.5k)
**Aspects:** Marketing · **Surfaces/platforms:** landing:he · **Priority:** P1

### Problem / why
The €10k/6-month GTM plan (`marketing/arbor-viral-gtm-2026-H2.md`) does not buy users — it engineers a product-led loop and spends the cash only to (a) build the loop, (b) **seed it with creators**, and (c) amplify winners. Creator seeding is loop mechanic #3 (GTM §3b line 52): "micro-parenting creators get the app + a small fee to post their *real* 'is this normal at 2am' moment and their kid's avatar. Their audiences are exactly our ICP." Israel is chosen first because of dense WhatsApp class-groups, hyperactive FB parenting groups, and a large micro-creator scene that works for product + small fees (GTM §1 line 18).

This item is **P1-2** in the backlog (`marketing/arbor-marketing-backlog.md` line 31): "Creator seeding wave 1 — product + small fees + affiliate codes; brief = real 'is this normal at 2am' moment. ~€1.5k of the €3k creator bucket." It is a **spend + content gate** (💳✍), not app code.

It cannot fire until the loop is live and measurable: the backlog dependency chain (line 58, 60) and the GTM spending rule (§6 line 101) both state **"no paid euro spends until the loop is instrumented and one artifact has branded share export."** Hence `dependsOn`: `mk-p0-1-domain` (no viral asset ships pointing at a `web.app` URL — GTM §4), `mk-p0-2-referral-loop` (the Plus-month reward must actually pay before we promise it — `EXECUTION-TRACKER.md` Milestone B explicitly defers share/referral hooks "after P0-2 referral grant is live — don't promise a reward that doesn't pay yet"), and `mk-p0-3-share-export` (the avatar 9:16 export with baked referral code is the unit creators post).

The roster (`mk-p0-6-creator-list` → `marketing/arbor-il-creator-tracker.md`) and copy (`mk-p0-8-copy-pack` → `marketing/arbor-launch-copy-pack.md` §3) already exist. **This item is the execution playbook that turns that roster + copy + loop into a run-ready, budgeted, instrumented wave-1 seeding operation** — the missing piece between "we have a list and a DM" and "we have spent €1.5k and can read installs per creator." It is currently 🔒 on Guy (`EXECUTION-TRACKER.md` line "Creator outreach wave-1" + the €1.5k budget greenlight); this spec makes everything driveable the moment the gate clears.

### Scope across platform domains
- **Landing HE (RTL)** — the only product surface, and only as the *destination* of every creator link. This item **does not edit** `html/arbor-marketing-landing-page-he.html`; it **consumes** the HE landing's app-handoff CTA and the canonical URL set by `mk-p0-1-domain`, and produces the tagged URLs each creator posts (IG bio link, story swipe-up). Affiliate codes ride the already-built, unit-tested `lib/attribution.ts` capture (`?ref=` + `utm_*`) — **no app code changes here.**
- **Web / iOS / Android:** out of scope — no native or web-app edits. Installs from creator links attribute through the shipped `mk-p0-4` event layer + `attribution.ts`.

Deliverable is a Markdown ops/content asset under `marketing/` (the seeding playbook) plus pre-filled execution columns on the existing creator tracker.

### IA / UX / Copy / Marketing detail (Marketing)

The build is the **wave-1 seeding playbook** — a deterministic, budgeted, instrumented operation. Write it to `marketing/arbor-creator-seeding-wave1.md` and extend the live tracker's status columns. Five components:

#### A. Wave-1 cohort selection (from the existing roster)
Select the wave-1 cohort from `arbor-il-creator-tracker.md` per its stated mix (line 67-68): **3–5 Tier-A coaches** (reach + relatability) + **6–8 Tier-B professionals** (trust, the Ask-a-Specialist story), filled from the directory finds to a **15–20 creator wave-1** (the 25 cap is total across waves). Carry forward the verification discipline: only DM rows whose reach/engagement was confirmed on the actual profile; Low-confidence rows get verified first or held to wave 2. Do **not** mix the Arab-Israeli sub-market in (separate Arabic wave — tracker line 48-49).

#### B. Budget allocation — ~€1.5k, deterministic per-tier
Of the €3k creator bucket (GTM §6 line 95), wave 1 = **~€1.5k**. Allocate so the spend is auditable (Safety Level 4 — amounts stated):

| Lane | Creators | Fee each | Subtotal | Notes |
| :-- | :-- | :-- | --: | :-- |
| Tier-A paid collab | 4 | €150–200 | €600–800 | One on-brand Reel + 1 story, affiliate code, posting-window commitment |
| Tier-B paid collab | 5 | €80–120 | €400–600 | SLP/psych/teacher; the Ask-a-Specialist credibility post |
| Organic gift only | 6–8 | €0 (product) | €0 | Full free access + their kid's avatar; post if it clicks (no obligation) |
| Reward/top-up buffer | — | — | ~€150 | Bonus for over-performers; pulled from `experiments/contingency` if exceeded |
| **Wave-1 total** | **15–17** | — | **≈€1,150–1,550** | Stay ≤ €1.5k; anything above needs Guy re-approval |

**Spending rule (GTM §6 line 101):** these are *seeding* fees (engineering the loop), explicitly allowed pre-proof. **Paid *amplification* (boosting) is NOT in this budget** — that stays gated behind the organic bar (P2-3). Keep the two buckets separate in the tracker so we never accidentally boost an unproven asset.

#### C. The brief (what each creator posts) — copy is locked
Brief comes verbatim from `arbor-launch-copy-pack.md` §3 ("Brief for the post") + §2 (#ArborAvatar challenge) + §6 HE hooks 1/2/4/8. Two post types:
1. **Avatar post (primary, rides #ArborAvatar challenge):** creator makes their kid's privacy-safe Arbor avatar via the shipped Avatar Creator, shares the `mk-p0-3` 9:16 branded export (referral code baked into its deep link), uses caption from copy-pack §2 HE, tags `#ArborAvatar`, link in bio.
2. **"2am moment" post (Tier-B credibility):** creator shows a real "is this normal at 2am" moment + the Read/Risk/Do-tonight answer card; HE hook from §6 (1, 2, 4, or 8). Authenticity > polish (copy-pack §3 directive).
- **Outreach DM:** copy-pack §3 HE verbatim (free access + an avatar of *their* kid, no strings; small paid collab if it clicks). No corporate stiffness.
- **Brand voice guardrail:** calm, direct, humane; never fear-sell, never preach, never diagnose (GTM §2 personality; project CLAUDE.md safety rules). Reject any creator angle that fear-sells or implies diagnosis — that breaks positioning and COPPA/non-diagnostic posture.

#### D. Per-creator link + affiliate-code wiring (instrumentation — the load-bearing build)
Reuse the convention already locked in `mk-p0-6-creator-list` (do **not** invent a new one — that breaks dashboard aggregation):
- **`ref` / affiliate code:** `il-<handle-slug>` (lowercase ASCII, `@` and dots stripped — `@galtamari1` → `il-galtamari1`). Parsed by `attribution.ts:64` (`p.get("ref")`) → stored as `referralCode`.
- **`utm_content`:** same `il-<handle-slug>` (per-creator creative slug, parsed `attribution.ts:75`).
- **Channel UTM (canonical set from `mk-p0-5`, lowercase snake_case — do not deviate):** `utm_source=instagram|tiktok`, `utm_medium=influencer`, `utm_campaign=avatar_challenge` (avatar posts) or `launch_il` (2am-moment seeding posts).
- **Canonical creator link (recorded per row):**
  `https://<canonical-origin>/?utm_source=instagram&utm_medium=influencer&utm_campaign=avatar_challenge&utm_content=il-galtamari1&ref=il-galtamari1`
  where `<canonical-origin>` = the `mk-p0-1-domain` value once verified (e.g. `joinarbor.com`), else `arborprd-westeu.web.app`. **Do not bake links until `mk-p0-1` resolves the origin** — note this in the playbook so codes aren't shipped stale.
- This rides the shipped, first-touch, unit-tested `attribution.ts` capture (commit `e09537a`) → global props on every `mk-p0-4` event → installs/activation per creator readable in the `mk-p0-5` funnel dashboard, sliced by `referral_code` and `utm_content`. **Once `mk-p0-2` referral grant is live, an install on a creator's `ref` also pays the creator's friend a Plus month** — so the affiliate code doubles as the reward rail.

#### E. Tracker status columns + measurement loop
Extend the live tracker (`arbor-il-creator-tracker.md` table lines 57-63, already given `Affiliate code`/`Posted?`/`Installs` columns by `mk-p0-6`) into a wave-1 run sheet: add **Wave**, **Fee (€)**, **Post type** (avatar/2am), **Post URL**, **Posted date**, **Installs (from dashboard)**, **Activations**, **Cost-per-activation**. Read weekly per backlog P1-6 (`mk-p1-6-loop-optimization`): kill under-performers, double down on winners, log the post as a candidate winning creative for the P1 exit gate (≥3 proven creatives). Wave-1 success target rolls into the P1 gate: K ≥ 0.4, activation ≥ 35%.

### Files to create / edit (exact repo-relative paths)
- **Create:** `PAI/projects/arbor/marketing/arbor-creator-seeding-wave1.md` — the wave-1 seeding playbook (cohort, budget table, brief, link/UTM convention, run sheet, measurement loop). This is the primary deliverable and avoids touching the shared backlog.
- **Edit:** `PAI/projects/arbor/marketing/arbor-il-creator-tracker.md` — extend the tracker table (lines 57-63) with the wave-1 run-sheet columns (Wave, Fee, Post type, Post URL, Posted date, Installs, Activations, CPA) and pre-fill the wave-1 cohort rows with their `il-<slug>` codes + canonical links.
- **Edit (shared, append-only):** `PAI/projects/arbor/marketing/arbor-marketing-backlog.md` — flip P1-2 status note to reference the new playbook doc. Single-line append; see conflict notes.
- **No app code, no landing HTML edits.**

### Shared-file conflict notes
- **`marketing/arbor-marketing-backlog.md`** (this item's declared `sharedFile`): many marketing missions append status to this backlog. **Edit only the P1-2 row's Notes cell** (append a doc link), never reorder rows or touch other rows. If another mission's spec is editing the same table concurrently, merge by appending only.
- **`html/arbor-marketing-landing-page-he.html`** (hotspot — touched by `mk-landing-parity-rebuild`, `mk-p0-1-domain`, `mk-p0-5-attribution-utm`, `mk-p1-4-aeo-seo-he`, `p3-ios-grade-audit`): this item **does not edit it** — it only consumes the canonical URL and CTA. No clobber risk; the dependency is one-directional (we read the origin `mk-p0-1` sets).
- **`lib/attribution.ts`** (touched by `mk-p0-2-referral-loop`, `mk-p0-5-attribution-utm`): this item **does not edit it** — it consumes the shipped parser. The `il-<slug>` + canonical UTM convention must stay byte-identical to what `mk-p0-6-creator-list` and `mk-p0-5` define; if those specs change the scheme, this playbook's pre-baked links must be regenerated. Treat `mk-p0-5`'s canonical UTM set as source of truth.
- **`lib/loopEvents.ts`** (hotspot, event-name contract): not edited here; we only *read* the resulting funnel. Do not rename events.

### Dependencies (other item ids that must land first)
- `mk-p0-1-domain` — canonical brandable origin must be verified before baking creator links (no `web.app` in a viral asset; GTM §4).
- `mk-p0-2-referral-loop` — the Plus-month reward must actually pay on activation before we promise it in the affiliate codes / DMs (`EXECUTION-TRACKER.md` Milestone B).
- `mk-p0-3-share-export` — the avatar 9:16 branded export (referral code baked in) is the unit creators post.
- Soft prerequisites (already shipped/written, not blocking): `mk-p0-4-analytics-wiring` (events, ✅ done commit `e09537a`), `mk-p0-5-attribution-utm` (UTM scheme + dashboard), `mk-p0-6-creator-list` (roster), `mk-p0-8-copy-pack` (DM + brief copy).

### Acceptance criteria (testable)
1. `marketing/arbor-creator-seeding-wave1.md` exists with: a named wave-1 cohort (15–20 creators drawn from the tracker, Tier-A + Tier-B mix), a per-tier budget table totalling **≤ €1.5k**, the locked brief (copy-pack §2/§3/§6), and the per-creator link/UTM convention matching `mk-p0-5`.
2. The creator tracker has wave-1 run-sheet columns and every wave-1 row carries a pre-computed `ref` code = `il-<handle-slug>` and a canonical link with the exact canonical UTM set (`utm_medium=influencer`, `utm_source∈{instagram,tiktok}`, `utm_campaign∈{avatar_challenge,launch_il}`, `utm_content=il-<slug>`).
3. Every link's origin is a placeholder/note tied to `mk-p0-1` (no stale `web.app` baked when a domain is pending).
4. Budget table sums to ≤ €1,500 and separates *seeding fees* (allowed pre-proof) from *paid amplification* (gated to P2-3) — no boosting euros in this wave.
5. A measurement loop is defined: installs/activations per creator readable via `referral_code` + `utm_content` in the `mk-p0-5` dashboard; weekly kill/double per `mk-p1-6`; winning posts logged toward the P1 ≥3-winning-creatives gate.
6. The backlog P1-2 row links the new playbook doc (append-only edit, no other rows touched).
7. **Verified live on dev server:** N/A for app code (none changed); instead verify the attribution chain is real by confirming a tagged creator URL — `?ref=il-galtamari1&utm_source=instagram&utm_medium=influencer&utm_campaign=avatar_challenge&utm_content=il-galtamari1` — is parsed correctly by the running app (`attribution.ts` `parseAttribution` → `referralCode=il-galtamari1`, `source=instagram`, `market=il`), e.g. via the existing `attribution.test.ts` or a dev-server load of the HE path with that query string showing the persisted `arbor.attribution` localStorage entry.

### Operating-rule checks
- **No dark patterns:** organic-gift creators have *no obligation* to post (copy-pack §3 "no strings"); affiliate reward only pays on genuine invitee **activation** (profile + first plan), never on a hollow install — abuse-capped server-side by `mk-p0-2`. We do not promise a reward that doesn't yet pay (gate on `mk-p0-2`).
- **Privacy / COPPA:** creators post the **privacy-safe stylized avatar** (non-photoreal) and default-name-redacted answer cards from `mk-p0-3` — never raw child PII. The DM offers an avatar of *their* kid created by the creator themselves in-app, under parent-owned data. No child data leaves the creator's control. Non-diagnostic framing enforced in every brief (project CLAUDE.md safety rules; GTM risk table line 150).
- **Moat read/write:** the seeded artifacts (avatar, answer card) are the memory-moat made visible — every install a creator drives starts a child's longitudinal record; the "2am moment" brief showcases the moat ("it gave me *my kid's* answer", copy-pack §6 hook 6). The wave reads the loop's funnel (write happens in-product on activation).
- **Ships-visible:** the deliverable is a run-ready playbook + instrumented tracker a marketer executes the moment the loop gate clears; success is visible as per-creator installs/activations in the live `mk-p0-5` funnel dashboard, not a buried doc.
