# mk-p2-8-youtube-evergreen — YouTube evergreen long-form

## mk-p2-8-youtube-evergreen — YouTube evergreen long-form
**Aspects:** Marketing · **Surfaces/platforms:** landing:en, landing:he · **Priority:** P2

> Source: backlog `P2-8` (`PAI/projects/parenting-os-plugin/marketing/arbor-marketing-backlog.md:53`) and strategy `PAI/projects/parenting-os-plugin/marketing/arbor-youtube-strategy.md` (Phase 2: "lean evergreen long-form", §27–32). This is a **content/ops + AEO mission**. It stands up the evergreen-video production line that turns the highest-traffic guide-hub articles + winning answer cards into 3–6 min explainers targeting long-tail search and AI-assistant citation. It extends — does not replace — the Shorts channel created by the dependency `mk-p1-7-youtube-shorts-he`. The only code/markup edits are (1) bringing the EN landing footer to social-link parity (HE got its `.foot-social` row in `mk-p1-7`; EN still has none) and (2) ticking the shared backlog. Everything else is the executable SOP file.

### Problem / why
- The Shorts channel (`mk-p1-7`) is a fast viral *discovery* engine but its content dies in days. Arbor still has **no durable, compounding YouTube authority asset** — no library of long-form "is this normal?" explainers that ranks for long-tail search and gets cited by ChatGPT/Gemini/Perplexity months after a Reel is forgotten (strategy `arbor-youtube-strategy.md:17`, `:40`).
- YouTube is the #2 search engine and one of the most-cited sources by AI assistants. A calm, expert-reviewed, non-diagnostic explainer library is a durable **AEO** asset — the same compounding logic as the HE guide hubs in `mk-p1-4-aeo-seo-he`, ported to video. Each video = one parenting query Arbor should own.
- The guide-hub articles already exist as scripts (e.g. EN footer "Deep Guides" cluster at `arbor-marketing-landing-page-en.html:294–305`: child-development-operating-system, ai-parenting-app-with-memory, sleep-routine-plan-child, daily-play, personalized-stories…). The cost is *recording*, not *writing* — so the rule is **repurpose, never bespoke-produce** (strategy `:34` "No high-budget produced series… It will silently eat the €10k").
- **Parity gap (the markup reason this mission touches code):** the HE landing got a `.foot-social` row with a YouTube anchor in `mk-p1-7` (`:38`, CSS at `arbor-marketing-landing-page-he.html:490`). The EN landing footer (`arbor-marketing-landing-page-en.html:289–307`) has **no social row at all** — only copyright + a Deep Guides cluster. As the channel goes long-form and EN markets open (Phase 3, `arbor-viral-gtm-2026-H2.md:84`), EN must reach the channel too, or the long-form library has no return path from the EN audience.

### Scope across platform domains
- **Landing EN** — primary code surface. Add a social/YouTube link row to the footer of `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-en.html` (it currently has none), mirroring the HE `.foot-social` pattern shipped in `mk-p1-7`. Plus an evergreen-video embed-or-link slot is **out of scope** here (no homepage video module — keep the landing fast; videos live on YouTube and are linked, not embedded).
- **Landing HE (RTL)** — the HE `.foot-social` row already exists (`mk-p1-7`). This mission only verifies the same channel handle/URL is used and, if a dedicated long-form playlist URL is preferred for HE, swaps the `href` to the playlist (one-attribute change, additive). No structural footer change.
- **Web app / iOS / Android** — out of scope. No app code. No `lib/loopEvents.ts`, `lib/attribution.ts`, or `lib/i18n.ts` edits. Inbound traffic lands on the EN/HE landing → existing CTA → app store / web app. The long-form videos drive *installs* via UTM links in descriptions; they do not read/write app state.
- **Landing EN — `/nl`** — out of scope (NL localization rides `mk-p2-1-localize-nl`, winners only). NL long-form is a later, winners-only port noted in the SOP, not built here.

### IA / UX / Copy / Marketing detail

#### A. Evergreen production line (the durable SOP artifact)
Strict "repurpose, batch, winners-only" discipline (strategy `:27–32`):
- **Source selection:** only articles/answer-cards that are *already winning* — top guide-hub pages by search impressions (from `mk-p1-4` Search Console) + top "is this normal?" answer cards by Shorts CTR (from `mk-p1-6` weekly report). Never script a video from scratch; the article *is* the script.
- **Format:** 3–6 min, calm face-to-camera OR product-screen-record, single take where possible. End card → app (UTM link). Brand: pine green lower-third, Inter/Fraunces, wordmark mark `brand/arbor-mark-transparent.png` (same kit as `mk-p0-7`).
- **Batch cadence:** record 4–6 in one sitting monthly; zero standalone studio days. Editing time only — €0 net-new production spend (no paid crew, no animation).
- **One-query-one-video mapping:** each title maps to a long-tail intent the article already targets. HE-first then EN as Phase 3 opens; NL winners-only later.

#### B. Title / description / AEO templates (copy — actual strings)
- **HE titles** (≤60 char, front-load query, calm not clickbait):
  - `"הילד בן 3 לא מדבר במשפטים — זה נורמלי? (מדריך רגוע)"`
  - `"שגרת שינה לפעוט שעובדת — בלי דרמות, צעד אחר צעד"`
  - `"מה זה 'מערכת הפעלה התפתחותית' למשפחה — ולמה זה משנה"`
- **EN titles:**
  - `"My 3-year-old isn't talking in sentences — is it normal? (calm guide)"`
  - `"A toddler sleep routine that actually works — step by step"`
  - `"What a 'developmental operating system' for your family means"`
- **Description block (both langs)** — 2-line summary of the answer (so AI assistants can extract it) + chaptered timestamps + UTM install link + "Arbor is non-diagnostic; not a doctor" disclaimer line (mirror `arbor-marketing-landing-page-en.html:292`) + link to the matching guide-hub article (cross-link for AEO authority).
- **UTM link template** (matches `mk-p0-5` scheme, distinct medium from Shorts): `?utm_source=youtube&utm_medium=longform&utm_campaign=evergreen&utm_content=<article-slug>`.
- **AEO instrumentation:** add the video URL to the matching guide-hub page as a `VideoObject` JSON-LD reference and embed/link it from the article, so the article + video reinforce each other for citation (parallels the HE hub cluster work in `mk-p1-4`). Submit videos to Search Console; track AI-assistant citations for the target queries (strategy KPI `:40`).

#### C. EN landing-footer change (the markup edit — parity with HE `mk-p1-7`)
- The EN footer (`arbor-marketing-landing-page-en.html:289–307`) wraps content in `<div class="wrap">` then a Deep Guides `<section>`. Insert a `.foot-social` row **inside `<div class="wrap">`, after the two `<p>` lines (`:291–292`), before the closing `</div>` at `:293`** — keeps it out of the Deep Guides SEO cluster (`:294–305`, `mk-p0-1`/AEO territory).
- **Markup (a11y-correct, LTR):**
  ```html
  <div class="foot-social" aria-label="Arbor on social">
    <a href="https://www.youtube.com/@arbor.family?sub_confirmation=1"
       rel="me noopener" target="_blank" aria-label="Arbor on YouTube">
      <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24"><!-- YouTube glyph --></svg>
    </a>
    <!-- IG/TikTok anchors follow, same pattern, handles from mk-p1-5 -->
  </div>
  ```
- **CSS** (add near footer styles; reuse HE rule from `arbor-marketing-landing-page-he.html:490` region):
  ```css
  .foot-social{display:flex;gap:.4rem;margin-top:1rem}
  .foot-social a{display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;color:var(--muted);transition:color .15s ease}
  .foot-social a:hover,.foot-social a:focus-visible{color:var(--ink)}
  ```
- **States:** default = muted icon (`var(--muted)`); hover/focus = `var(--ink)` + visible focus ring (reuse the page's existing link focus style). No loading/empty/error states — static links.
- **A11y (AA):** each anchor has a text `aria-label`; icons `aria-hidden="true" focusable="false"`; icon ≥20px inside a ≥44×44px tap target; keyboard-focusable in DOM order; icon contrast vs footer bg ≥4.5:1.
- **Motion:** color transition only (`.15s ease`); nothing scroll-animated; respect the page's `prefers-reduced-motion` behaviour (no JS animation added).
- **RTL:** EN page is LTR; row flows left-to-right. (HE row already RTL-correct from `mk-p1-7`; use logical `gap`, no physical margins, so the same rule is RTL-safe if ported.)
- **No tracking script added** — outbound link carries no PII, sets no cookie (first-party-only policy, `mk-p0-4`). Inbound attribution is via the UTM on the *return* link in the YouTube description, not the footer.

#### D. Loop / instrumentation
- **Loop:** evergreen video (durable, search/AEO-discovered) → UTM `medium=longform` link in description + end card → EN/HE landing → existing landing CTA → install/web app → seeds the moat. Slower-compounding arm of the same loop the Shorts (`mk-p1-7`) feed; distinct `utm_medium` keeps the two funnels separable in the `mk-p0-5` dashboard.
- **Instrumentation:** entirely via `mk-p0-5` UTM scheme + funnel dashboard. **No new event names; no edits to `lib/loopEvents.ts`** — reuses the canonical install/app_open contract already wired by `mk-p0-4`. Add `utm_medium=longform` as a tracked dimension only.
- **KPIs (strategy `:40`):** search impressions, watch-through, CTR-to-landing (UTM), and **AI-assistant citations** for the target HE/EN queries. Logged in the weekly report (`mk-p1-6`) under a long-form section.

### Files to create / edit (exact repo-relative paths)
- **Create** `PAI/projects/parenting-os-plugin/marketing/arbor-youtube-longform-sop.md` — evergreen production line: source-selection rule (winners only, from `mk-p1-4`/`mk-p1-6` data), batch-record cadence, format spec, HE+EN title/description/timestamp templates, UTM link template (`utm_medium=longform`), `VideoObject` JSON-LD + article cross-link AEO step, Search-Console submission step, NL winners-only note. (New file; the executable Phase-2 runbook. The strategy doc `arbor-youtube-strategy.md` stays the rationale layer — do not duplicate it. The Shorts SOP `arbor-youtube-shorts-sop.md` from `mk-p1-7` stays Shorts-only — link, don't merge.)
- **Edit** `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-en.html` — add `.foot-social` row inside `<div class="wrap">` (after `:292`, before `:293`) + the three `.foot-social` CSS rules in the head `<style>`. Additive only.
- **Edit (optional, ≤1 attribute)** `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-he.html` — only if a dedicated HE long-form playlist URL is preferred over the channel root; swap the existing `.foot-social` YouTube `href` (from `mk-p1-7`, `:38`). No structural change.
- **Edit** `PAI/projects/parenting-os-plugin/marketing/arbor-marketing-backlog.md` — tick `P2-8` status (append `✅ SOP + EN footer parity` to the Notes cell at `:53`; **do not** reorder rows or touch other cells).

### Shared-file conflict notes
- **`PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-en.html`** — hotspot touched by `p3-ios-grade-audit`, `mk-p0-1-domain`, `mk-p0-5-attribution-utm`, `mk-landing-parity-rebuild`, `mk-p2-1-localize-nl`. **`mk-landing-parity-rebuild` REWRITES this file wholesale (EN onto HE's design system) — it MUST land first.** This footer edit must therefore be applied to the **rebuilt** file: the `.foot-social` pattern will already exist post-rebuild (the rebuild ports HE's design system, which includes the `.foot-social` block from `mk-p1-7`). If so, this mission's EN footer work collapses to *verifying* the social row carries the YouTube anchor — do not duplicate. If the rebuild has not landed, apply the additive block above and flag for re-merge. Sequence after `mk-p0-1` (canonical URL) and `mk-p0-5` (UTM/CTA) so description links use the final canonical URL. This edit is footer-scoped and additive — it does not touch the head `og:`/canonical tags (`mk-p0-1`), hero CTAs (`mk-p0-5`), the Deep Guides cluster (`:294–305`, AEO), or `/nl` content (`mk-p2-1`).
- **`PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-he.html`** — hotspot touched by `mk-p1-7` (the `.foot-social` row), `mk-p0-1`, `mk-p0-5`, `mk-landing-parity-rebuild`, `mk-p1-4-aeo-seo-he`. This mission's HE touch is at most a single-attribute `href` swap on the already-shipped social anchor; do **not** re-add the row (it exists). Stay out of the `.foot-bot` SEO-cluster region (`:1591–1603`, `mk-p1-4` territory).
- **`PAI/projects/parenting-os-plugin/marketing/arbor-marketing-backlog.md`** — shared status table. Edit only the `P2-8` Notes cell; never reorder or rewrite other rows (other marketing missions tick their own cells in parallel).
- **No app-source shared files** (`loopEvents.ts`, `attribution.ts`, `i18n.ts`, `navigation.ts`, etc.) are touched — this mission is deliberately app-code-free, so it does not collide with any app hotspot.

### Dependencies (other item ids that must land first)
- **`mk-p1-7-youtube-shorts-he`** (declared `dependsOn`) — the channel itself, the `@arbor.family` handle, the brand banner/avatar, and the HE `.foot-social` pattern all come from the Shorts mission. Long-form is a new content *line on the same channel*, not a new channel.
- **`mk-landing-parity-rebuild`** — must land first for the EN file (it rewrites EN wholesale; apply the footer edit to the rebuilt output, see conflict note).
- **`mk-p0-5-attribution-utm`** — UTM scheme + funnel dashboard must exist so `utm_medium=longform` links are attributable.
- **`mk-p0-1-domain`** — canonical landing URL for description links (soft dep: fall back to `web.app` origin, swap once verified; do not switch canonical prematurely).
- **`mk-p1-4-aeo-seo-he`** — provides the Search-Console foundation + guide-hub article structure the videos cross-link into; supplies the search-impression data that picks winners.
- **`mk-p1-6-loop-optimization`** — supplies the winning-asset list (top answer cards / hub pages) that gates which articles become videos (winners-only rule). Soft dep for content flow; the SOP + EN footer can ship before it.

### Acceptance criteria (testable)
1. `arbor-youtube-longform-sop.md` exists with: winners-only source-selection rule (citing `mk-p1-4`/`mk-p1-6` data sources), batch-record cadence, 3–6 min format spec, HE+EN title templates (≥3 each), description+timestamp+disclaimer template, UTM link template (`utm_source=youtube&utm_medium=longform&utm_campaign=evergreen&utm_content=…`), `VideoObject` JSON-LD + article cross-link step, Search-Console submission step, and NL winners-only note.
2. EN landing footer renders a social/YouTube link row that is keyboard-focusable, has a text `aria-label` per anchor, icons `aria-hidden`, and a ≥44×44px tap target — **verified live on dev server** (serve the html locally or on `arborprd-westeu.web.app`, tab to the footer, confirm focus ring + LTR ordering + link opens the channel in a new tab). If `mk-landing-parity-rebuild` already added the row, criterion is met by verifying the YouTube anchor is present and correct.
3. axe/Lighthouse a11y pass on the EN footer region shows no new contrast or name-role-value violations (icon contrast ≥4.5:1).
4. The long-form description/end-card link, when clicked, lands on the EN/HE landing and the funnel dashboard (`mk-p0-5`) attributes the visit to `utm_source=youtube` + `utm_medium=longform`, separable from Shorts (`utm_medium=shorts`) — verified once `mk-p0-5` dashboard is live.
5. `arbor-marketing-backlog.md` `P2-8` row shows completed status; no other rows modified (git diff scoped to one cell).
6. Net-new production spend = €0; no bespoke studio/animation produced (only batch-recorded repurposes of existing winning articles/cards) — confirmed by SOP review.
7. HE footer untouched except (optionally) the single YouTube `href` swap; the `.foot-social` row from `mk-p1-7` is not duplicated.

### Operating-rule checks
- **No dark patterns:** evergreen discovery + transparent UTM links; titles are calm/honest answers to real queries, never fear-bait or clickbait (brand "the adult in the room", `arbor-viral-gtm-2026-H2.md:33`). `sub_confirmation=1` is a standard, non-deceptive subscribe prompt. No fake engagement, no manufactured scarcity.
- **Privacy / COPPA-2026:** no child data leaves the app; videos are explainers/screen-records of the product UI and privacy-safe stylized avatars (per `mk-p1-1`), never a real child's face/identity. Footer link adds no tracking script, sets no cookie, sends no PII — first-party-only policy upheld (`mk-p0-4`). Every video carries the non-diagnostic disclaimer.
- **Moat read/write:** marketing surface — does not read or write the longitudinal memory store directly; it drives installs that *seed* the moat. The explainers truthfully advertise the moat (memory that grows with the child, the "developmental operating system" framing) without overclaiming.
- **Ships-visible:** the EN footer social row is a visible, shippable landing change (not doc-only); the long-form videos are public, searchable, linkable surfaces. The SOP makes the recurring production executable without further research.
