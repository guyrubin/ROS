## mk-p2-4-en-launch-appstore — BE/IE/UK English launch + app-store localization
**Aspects:** Marketing, Copy · **Surfaces/platforms:** landing:en, ios, android · **Priority:** P2

### Problem / why
GTM Phase 3 (Weeks 17–26, `arbor-viral-gtm-2026-H2.md` §5, §9) goes live in Belgium, Ireland, and the UK only **after** the IL loop has cleared its gate (K ≥ 0.4, activation ≥ 35%, ≥3 proven creatives — the output of `mk-p1-6-loop-optimization`). EN rollout is "live & available in English with the **proven** creative, concentrate paid amplification where the loop is validated, plus a PR/launch push." Two things are currently missing or wrong for an English store launch:

1. **The store listings have no localized metadata.** `capacitor.config.ts:18` still ships the placeholder bundle id `app.arbor.family`, and MOBILE.md notes the id "cannot be changed after a store listing exists" — so listing metadata must be authored and the real id locked before first submission. The launch copy pack (`arbor-launch-copy-pack.md` §5) only has a one-line subtitle/promo; App Store Connect and Google Play each need full localized field sets (title, subtitle, keywords/short-desc, full description, what's-new, screenshots, locale-specific privacy answers).
2. **The EN landing page has no app-store install path and a wrong canonical.** `arbor-marketing-landing-page-en.html` CTAs all point at `#join`/`#` (lines 147, 158, 286) and the canonical is the un-shareable `web.app` URL (line 9). For BE/IE/UK, the landing must offer App Store + Google Play badges with locale-tagged, UTM-stamped deep links so paid/creator/PR traffic lands → installs → attributes.

This item is **content + spend** (✍💳 per backlog P2-4): it produces the localized store metadata, the EN-market badge/CTA wiring on the landing, the per-market UTM/deep-link scheme for the three English markets, and the creator-seeding + paid-amplification brief. It does **not** build new app features.

### Scope across platform domains
- **iOS (Capacitor):** Author the App Store Connect listing for the `en-GB` (primary EN) locale + `en-AU`/`en-US` fallbacks as App Store Connect requires; provide localized name, subtitle, promotional text, keywords (100-char field), description, "What's New", and the App Privacy answers. Confirm the locked bundle id is propagated. No code in `ios/` changes beyond the one-time bundle-id set (already owned by `m1`/`surf-ios`; this item only **consumes** the locked id).
- **Android (Capacitor):** Author the Google Play Console "Main store listing" for `en-GB` (+ `en-AU` if targeting AU later) — app name (30 char), short description (80 char), full description (4000 char), and the localized graphic-asset checklist. Confirm Data Safety form answers match Arbor's privacy posture.
- **Landing EN:** Add an app-store badge pair (App Store + Google Play) to the hero and footer CTA blocks of `arbor-marketing-landing-page-en.html`, each carrying per-market UTM params and the App Store / Play locale hints. Fix CTA hrefs (currently `#`/`#join`) to point at the live store URLs / web signup. Reconcile with `mk-landing-parity-rebuild` and `mk-p0-1-domain` (see conflict notes — rebuild + canonical land first).
- **Landing HE (RTL):** Out of scope. EN-only rollout; HE landing is untouched here.
- **Web:** No app code. The in-app `attribution.ts` already recognizes `be`/`ie`/`uk` markets (`Market` union, `attribution.ts:15`, `MARKET_PATHS` :31) and slices every analytics event by them — so no web change is needed for the new markets to attribute correctly. We only have to **emit the right UTM/path values** from the landing and store links.

### IA / UX / Copy / Marketing detail

#### A. App-store metadata (Copy — the core deliverable)
Append a new section **"§8. App-store listing (full, EN)"** to `arbor-launch-copy-pack.md` (do not overwrite §5; §5 is the short tagline, §8 is the field-complete set). Voice per the pack header: calm, direct, humane, high-agency; never fear-sell, never preach; non-diagnostic, expert-reviewed, parent-owned data.

**Apple App Store (en-GB primary):**
- **App name (30 char):** `Arbor: Calm Parenting Help`
- **Subtitle (30 char):** `Know what to do tonight` (reuse the pack §1 promise; ≤30 chars — verify count)
- **Promotional text (170 char):** `Arbor reads any parenting moment, gives you a plan for tonight, and remembers your child — so the advice actually fits. Non-diagnostic. Expert-reviewed.`
- **Keywords (100 char, comma-no-space):** `parenting,toddler,child development,sleep,tantrums,milestones,speech,behaviour,routine,advice` (note: en-GB spelling "behaviour"; verify ≤100 chars; no spaces after commas to save budget; do not repeat words already in the name/subtitle)
- **Description (full):** lead with the §1 promise, then the four-capability ladder (read the moment → plan for tonight → remembers your child → involve a professional when it matters), then the trust block (non-diagnostic, expert-reviewed, your data stays yours, you approve every memory). Close with a soft CTA. Reuse `PRODUCT.md` capability language; no medical claims, no "diagnose/treat/cure".
- **What's New:** `We've launched in the UK and Ireland. Calmer guidance, your child's living record, and a plan for tonight — now closer to home.`
- **App Privacy answers:** Data used to track = none (first-party only, per `analytics.ts`/`attribution.ts` "no third-party scripts"). Data linked to user = the child profile/memory the parent creates; declare under "Health & Fitness / Other" with "you can see and delete it anytime". No third-party ad SDKs.

**Google Play (en-GB):**
- **App name (30 char):** `Arbor: Calm Parenting Help`
- **Short description (80 char):** `Calm, non-diagnostic guidance and a living record of your child's development.`
- **Full description (≤4000 char):** same narrative as Apple, Play-formatted (Play indexes the full description, so naturally include the keyword set; no keyword stuffing). End with the trust block + soft CTA.
- **Data Safety form:** mirror the Apple privacy answers — no data shared with third parties; data collected (account, child profile, app activity) is encrypted in transit and deletable on request; no data used for advertising/tracking.

**Locale handling note (for the executor):** Apple requires a per-locale entry; create `en-GB` and copy it to `en-AU`; the US default (`en-US`) can carry the same EN text. Play uses BCP-47 (`en-GB`); IE traffic falls under the `en-*` defaults (Play has no `en-IE`). Belgium is bilingual (NL/FR) — for BE, ship the EN listing now and flag NL listing as the dependency on `mk-p2-1-localize-nl` (do not author FR here; out of scope).

#### B. Landing-page install path (Marketing + UI)
In `arbor-marketing-landing-page-en.html`, after `mk-landing-parity-rebuild` and `mk-p0-1-domain` have landed:
- **Hero CTA block (around current lines 158–159) and footer CTA (around 286):** add an app-store badge pair beside the existing primary CTA. Use official badge SVGs (Apple "Download on the App Store", Google "Get it on Google Play") served locally from `../brand/` (do not hotlink). Keep the existing **"Start now — free"** web CTA as the primary; badges are secondary so web-signup still works for desktop visitors.
- **Hrefs (fix the dead `#`/`#join`):**
  - App Store badge → `https://apps.apple.com/gb/app/{appslug}/id{APPLE_ID}` (locale segment `/gb/` for UK; the same listing serves IE).
  - Play badge → `https://play.google.com/store/apps/details?id={LOCKED_BUNDLE_ID}&hl=en_GB`
  - Append UTM to **both**: `?utm_source=landing&utm_medium=appbadge&utm_campaign=en-launch&utm_content={hero|footer}` plus a market tag the in-app loop reads (`&ref=`-style not needed; market is path-derived — so badges on `/be`, `/ie`, `/uk` paths auto-attribute via `detectMarket`, `attribution.ts:34`). For the single global EN page, set `utm_content` to distinguish market via campaign suffix (`en-launch-uk` / `en-launch-ie` / `en-launch-be`).
- **States / a11y / motion:**
  - **default / hover / focus-visible:** badges are real `<a>` links with a visible focus ring (reuse the landing's existing `:focus-visible` token); each `<img>` has descriptive `alt` ("Download Arbor on the App Store" / "Get Arbor on Google Play").
  - **loading/empty/error:** N/A (static badges), but the badge SVGs must be `loading="lazy"` below the fold and have explicit width/height to avoid CLS.
  - **touch targets:** ≥44×44 px tap area on mobile (the official badges meet this; ensure padding not clipped).
  - **prefers-reduced-motion:** no badge animation; if the hero block has entrance motion, gate it behind the page's existing reduced-motion guard.
  - **a11y AA:** badge contrast is fixed by Apple/Google art; ensure surrounding text meets AA.
  - **RTL:** N/A here (EN page, LTR only).
- **`<title>` / OG / canonical:** leave canonical to `mk-p0-1-domain` (it owns the URL switch — do **not** also edit line 9 here, to avoid clobber). This item only adds the badge markup + UTM.

#### C. Marketing loop / instrumentation / assets
- **Proven-creative gate:** this item ships only the ≥3 creatives validated by `mk-p1-6-loop-optimization` (its acceptance criteria define "winning creative"). Re-cut the IL/NL winners with EN captions (reuse `arbor-launch-copy-pack.md` §6 EN hooks 1–10 and §2 #ArborAvatar EN caption). No bespoke production — repurpose only (GTM §5 EN rollout, §6 spending rule).
- **Creator seeding (UK/IE):** reuse the §3 EN creator-outreach DM verbatim; affiliate codes route through the existing `?ref=` first-touch capture (`attribution.ts:64`). Spend draws from the €3k creator bucket, weighted late per GTM §6.
- **Paid amplification:** boost only past-the-bar assets (GTM §6 "no euro to paid until an asset clears an organic bar"). All paid links use the landing UTM scheme above so spend is sliceable by `market`/`source`/`utm_campaign` on the existing funnel dashboard (`mk-p0-5-attribution-utm`).
- **Instrumentation is already in place** — `install`, `profile_created`, `first_plan`, `share_*`, `invite_*`, `trial_start`, `paid` with `market`+`source` global props (backlog P0-4 ✅; `attribution.ts` already includes be/ie/uk). This item adds **no new events**; it only feeds correct UTM/market values in.

### Files to create / edit (exact repo-relative paths)
- **Edit** `PAI/projects/arbor/marketing/arbor-launch-copy-pack.md` — append "§8. App-store listing (full, EN)" with the Apple + Play field-complete sets above. **Append only; do not touch §1–§7** (shared-file hotspot — see below).
- **Edit** `PAI/projects/arbor/html/arbor-marketing-landing-page-en.html` — add App Store + Play badge links (hero + footer CTA blocks) with UTM/locale hrefs; fix the dead `#`/`#join` CTA hrefs to live targets. **Do not edit canonical/OG (line 9–19) — owned by `mk-p0-1-domain`.**
- **Create** `PAI/projects/arbor/marketing/arbor-en-launch-playbook.md` — the BE/IE/UK execution playbook: market table (UK/IE EN listing; BE EN-now/NL-later), creator-seeding brief, paid-amplification rules, UTM/deep-link reference, and a "before submission" checklist (bundle id locked, store metadata authored, badges live, CORS redeploy per MOBILE.md done).
- **Reference (read-only, do NOT edit):** `PPPPtherapy-/PPPPtherapy-/app/MOBILE.md` (submission process), `PPPPtherapy-/PPPPtherapy-/app/capacitor.config.ts` (bundle id), `PAI/projects/arbor/PRODUCT.md` (capability copy).
- **New brand assets:** drop official badge SVGs into `PAI/projects/arbor/html/brand/` (e.g. `app-store-badge.svg`, `google-play-badge.svg`) — referenced by the landing as `../brand/...` consistent with the existing `../brand/arbor-mark-transparent.png` pattern (line 138).

### Shared-file conflict notes
- **`arbor-launch-copy-pack.md`** — hotspot touched by `mk-p0-8-copy-pack`, `mk-p1-1-avatar-challenge`, **this item**, and `mk-p2-5-pr-push`. **Avoid clobber by appending a new numbered section only** (§8). Never reorder or rewrite §1–§7. If `mk-p2-5-pr-push` lands first and adds its own section, just take the next free number. No collisions on existing sections.
- **`arbor-marketing-landing-page-en.html`** — hotspot touched by `p3-ios-grade-audit`, `mk-p0-1-domain`, `mk-p0-5-attribution-utm`, `mk-landing-parity-rebuild`, `mk-p2-1-localize-nl`, and this item. Per the hotspot note: **`mk-landing-parity-rebuild` REWRITES this file wholesale — run it FIRST.** Then `mk-p0-1-domain` (canonical/URL) and `mk-p0-5` (UTM/CTA wiring) patch it. **This item must run AFTER all of those** and confine itself to adding badge markup + the EN-launch UTM on the badge hrefs — do **not** re-touch canonical, OG, or the global UTM helper (owned by p0-1/p0-5). `p3-ios-grade-audit` polish runs last.
- **Bundle id (`capacitor.config.ts`)** — owned/changed by `m1-ios-safe-area`/`surf-ios`/`surf-android`. This item **consumes** the locked id for store links; it does not edit `capacitor.config.ts`. If the id is still the placeholder `app.arbor.family` at execution time, **block on it** (MOBILE.md: id can't change after a listing exists) and surface that as a dependency.

### Dependencies (other item ids that must land first)
- **`mk-p1-6-loop-optimization`** (declared `dependsOn`) — provides the ≥3 proven creatives and the validated loop that gate any EN spend (GTM Phase-1 exit gate → Phase-3).
- **`mk-landing-parity-rebuild`** — rewrites the EN landing; must precede any landing edit here.
- **`mk-p0-1-domain`** — owns canonical/URL + must be verified before public store/landing links point anywhere but `web.app`.
- **`mk-p0-5-attribution-utm`** — defines the UTM scheme this item's badge links must conform to.
- **Soft pre-req:** the real App Store / Play bundle id must be locked (`m1`/`surf-ios`) before listings are submitted.

### Acceptance criteria (testable)
1. `arbor-launch-copy-pack.md` contains a new "§8 App-store listing (full, EN)" with: Apple name ≤30, subtitle ≤30, promo ≤170, keywords ≤100 (no-space, en-GB spelling), full description, What's-New, App Privacy answers; and Play name ≤30, short desc ≤80, full desc ≤4000, Data Safety answers — **character limits verified** (state counts inline).
2. §1–§7 of the copy pack are byte-for-byte unchanged (diff shows only an appended section).
3. `arbor-marketing-landing-page-en.html` renders an App Store badge and a Google Play badge in both the hero and footer CTA blocks; **no CTA href is `#` or `#join` anymore** — each resolves to a live store URL or the web-signup target.
4. Every badge href carries `utm_source=landing&utm_medium=appbadge&utm_campaign=en-launch*` and the correct store-locale segment (`/gb/` Apple; `hl=en_GB` Play).
5. Badges have descriptive `alt`, visible `:focus-visible` ring, ≥44px touch target, explicit width/height (no CLS), and `loading="lazy"` below the fold; reduced-motion respected.
6. `arbor-en-launch-playbook.md` exists with the market table, creator/paid briefs, UTM reference, and a "before submission" checklist that cites the locked bundle id and the MOBILE.md CORS redeploy.
7. **Verified live on dev server:** open the EN landing on the local dev/preview server, confirm both badge links navigate to the correct store URLs with UTM intact, focus ring shows on keyboard tab, and the page passes an AA contrast spot-check on the CTA block. Confirm a path-tagged visit (`/uk`, `/ie`, `/be`) is attributed to `market: uk|ie|be` (verify against `attribution.ts` `detectMarket`).
8. The playbook explicitly states that no paid euro is spent until the `mk-p1-6` loop gate (K ≥ 0.4, activation ≥ 35%) is met.

### Operating-rule checks
- **No dark patterns:** badges are honest secondary CTAs; the free web path stays primary; no fake urgency, no forced-install interstitial. Store copy makes no medical/diagnostic claims and no fear-sell hooks (pack voice rule).
- **Privacy / COPPA-2026:** store privacy answers (Apple App Privacy + Play Data Safety) state first-party-only, no third-party ad SDKs/tracking, parent-owned/deletable data — matching `analytics.ts`/`attribution.ts` ("no third-party scripts"). No child PII is exposed in any listing or asset. Non-diagnostic stance stated in the description.
- **Moat read/write:** the listing copy foregrounds the memory moat ("remembers your child — so the advice actually fits"); attribution writes `market`/`source` into the loop so EN-market activation/retention is sliceable (read/write of the growth-loop record). No feature change, so no new app-side moat writes.
- **Ships-visible:** the user sees real install badges on the EN landing and a live, localized listing in the UK/IE App Store and Play — a parent in those markets can find, read, and install Arbor in their own English with attribution intact.
