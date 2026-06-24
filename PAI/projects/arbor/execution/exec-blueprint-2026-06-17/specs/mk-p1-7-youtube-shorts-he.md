# mk-p1-7-youtube-shorts-he — YouTube Shorts channel (HE)

## mk-p1-7-youtube-shorts-he — YouTube Shorts channel (HE)
**Aspects:** Marketing · **Surfaces/platforms:** landing:he · **Priority:** P1

> Source: backlog `P1-7` (`PAI/projects/arbor/marketing/arbor-marketing-backlog.md:36`) and strategy `PAI/projects/arbor/marketing/arbor-youtube-strategy.md` (Phase 1: Shorts only, zero net-new production, €0 spend). This is a **content/ops mission** — it stands up a distribution surface and an SOP that recycles existing vertical assets. The only file edits are (1) adding a YouTube/social link to the HE landing footer so the channel is discoverable and the loop closes back to install, and (2) checking the box in the shared marketing backlog.

### Problem / why
YouTube is the #2 search engine and one of the most-cited sources by ChatGPT/Gemini/Perplexity, yet Arbor has **no YouTube presence** and **no link from the HE landing page to any social channel** (footer at `arbor-marketing-landing-page-he.html:1553–1604` lists Product/Audience/Trust columns only — zero social row). Every vertical asset we produce for the #ArborAvatar challenge (`mk-p1-1`), the 10 hooks (copy pack §6), and creator UGC (`mk-p1-2`) currently dies on IG/TikTok and is never repurposed to a third free surface. Shorts is a near-zero-cost discovery engine: same vertical files, new surface, UTM-tagged link back to the IL landing. It must NOT pull budget or focus from the loop — Phase-1 scope is strictly cross-posting + SOP, no bespoke production (strategy doc "What NOT to do").

### Scope across platform domains
- **Landing HE (RTL)** — the only code/markup surface in scope. Add a social/YouTube link row to the footer of `PAI/projects/arbor/html/arbor-marketing-landing-page-he.html` so the channel is reachable and the inbound→install path is instrumented. RTL-correct (channel icon row mirrors with the existing `dir="rtl"` document).
- **Web app / iOS / Android** — out of scope. No app code changes. (Inbound traffic lands on the HE landing `→` app store / web app via the existing CTAs; this mission does not touch `lib/loopEvents.ts`, `lib/attribution.ts`, or any app surface.)
- **Landing EN** — out of scope for P1 (HE-first per strategy). A future EN social-footer parity item should ride `mk-landing-parity-rebuild`, not this mission.

### IA / UX / Copy / Marketing detail

#### A. Channel setup (ops — documented in the SOP file, executed by MKT/Guy)
- **Channel name:** `Arbor — הורות רגועה` (HE) / handle `@arbor.family` (match domain target from `mk-p0-1`; reserve same handle on YouTube). Brand: pine green, wordmark mark `brand/arbor-mark-transparent.png`, Inter/Fraunces.
- **Banner + avatar:** from the template kit (`mk-p0-7`). Banner safe-area 1235×338 center-safe; avatar 800×800 = wordmark mark on pine.
- **Channel description (HE):** *"ארבור — האפליקציה הרגועה שעוזרת להורים להבין מה קורה עם הילד/ה שלהם ומה לעשות עכשיו. בלי דרמות, בלי אבחנות. קליפים קצרים, רגעי 'זה נורמלי?', וטיפים מעשיים. קישור להורדה למטה 👇"*
- **Description link + pinned-comment link:** UTM-tagged landing link, NOT a raw `web.app` origin. Use the canonical IL landing URL once `mk-p0-1` resolves the domain; until then use `https://arborprd-westeu.web.app/marketing/arbor-marketing-landing-page-he.html` as origin. Link template (matches `mk-p0-5` UTM scheme): `?utm_source=youtube&utm_medium=shorts&utm_campaign=il_ignition&utm_content=<asset-slug>`.

#### B. Cross-post SOP (the durable artifact)
For each vertical asset already made for IG/TikTok:
1. Export the same 9:16 file (≤60s, ≥1080×1920) — **no re-edit, no re-render** (strategy: "Same file, new surface").
2. Title (HE), ≤40 chars, front-load the hook. Map the copy-pack hooks (§6 HE 1/2/4/8):
   - `"11 בלילה והילד לא נרדם? 👇"`
   - `"'זה נורמלי?' — מה שכל הורה מחפש ב-2 בלילה"`
   - `"הפכתי את הבת שלי לדמות 🌳"`
   - `"מה לעשות *הערב* — לא עוד מאמר ארוך"`
3. Description: 1-line hook + UTM link + 3 hashtags (`#הורות #זהנורמלי #ArborAvatar`).
4. Pin a comment with the UTM install link + referral note (mirror copy pack §4 HE referral line).
5. Tag the upload with the `utm_content=<asset-slug>` matching the IG/TikTok variant so the funnel dashboard (`mk-p0-5`) attributes per-asset.
- **Cadence:** ride `mk-p1-5` owned-account cadence (3–4/wk) — cross-post on the same day, no separate production calendar.

#### C. Landing-footer change (the markup edit)
- In `arbor-marketing-landing-page-he.html`, inside `<div class="foot-bot">` (currently `:1586–1589`) OR as a new `.foot-social` row above it, add a social link row. Minimum: YouTube; leave IG/TikTok placeholders wired to the owned handles from `mk-p1-5`/`mk-p1-1`.
- **Markup (RTL-safe, a11y-correct):**
  ```html
  <div class="foot-social" aria-label="ערוצים חברתיים">
    <a href="https://www.youtube.com/@arbor.family?sub_confirmation=1"
       rel="me noopener" target="_blank"
       aria-label="Arbor ב-YouTube">
      <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24">…</svg>
    </a>
    <!-- IG/TikTok anchors follow, same pattern -->
  </div>
  ```
- **States:** default = muted icon (`var(--muted)`); hover/focus = `var(--ink)` + visible focus ring (reuse the footer link focus style already in the stylesheet). No loading/empty/error states — static links.
- **A11y (AA):** each anchor has a text `aria-label` (icons are `aria-hidden`); icons ≥20px inside a ≥44×44px tap target (`.foot-social a{display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px}`); keyboard-focusable in DOM order; contrast of icon vs footer bg ≥4.5:1.
- **RTL:** the row sits inside the `dir="rtl"` document; use logical properties (`gap`, `margin-inline`) so icons flow right-to-left correctly. Verify the row does not collide with the existing copyright/disclaimer spans in `.foot-bot`.
- **Motion:** color transition only (`transition:color .15s ease`); wrap in nothing that animates on scroll — respect the page's existing `prefers-reduced-motion` guard (script at `:1611`).
- **No tracking script added** — the link itself carries no PII; outbound clicks are not instrumented here (first-party-only policy, per `mk-p0-4`). Inbound attribution is handled by the UTM on the *return* link in the YouTube description, not by the footer.

#### D. Loop / instrumentation
- **Loop:** Short (free surface) → UTM link in description/pinned comment → HE landing `/il` → existing landing CTA → install/web app. Closes the acquisition arm of the viral loop with €0 net-new spend.
- **Instrumentation:** entirely via the `mk-p0-5` UTM scheme + funnel dashboard — `utm_source=youtube`, `utm_medium=shorts`, per-asset `utm_content`. No new event names; reuses the canonical contract in `lib/loopEvents.ts` downstream (install/app_open already wired by `mk-p0-4`). **Do not** add or rename events.
- **KPIs (from strategy doc):** Shorts views → CTR-to-landing (UTM) → installs. Logged in the weekly K-factor/activation report (`mk-p1-6`).

### Files to create / edit (exact repo-relative paths)
- **Create** `PAI/projects/arbor/marketing/arbor-youtube-shorts-sop.md` — channel setup checklist (§A), cross-post SOP (§B), title/description/hashtag templates, UTM link templates, cadence link to `mk-p1-5`. (New file; expands the strategy doc into an executable runbook. The strategy doc itself, `arbor-youtube-strategy.md`, stays as the rationale layer — do not duplicate it.)
- **Edit** `PAI/projects/arbor/html/arbor-marketing-landing-page-he.html` — add `.foot-social` row in the footer (markup §C) + matching CSS rule near the existing footer block (`:481–482` / `:911`).
- **Edit** `PAI/projects/arbor/marketing/arbor-marketing-backlog.md` — tick `P1-7` status (append `✅ channel live + SOP + footer link` to the Notes cell at `:36`; **do not** reorder rows or touch other cells).

### Shared-file conflict notes
- **`PAI/projects/arbor/html/arbor-marketing-landing-page-he.html`** — hotspot touched by `p3-ios-grade-audit`, `mk-p0-1-domain`, `mk-p0-5-attribution-utm`, `mk-landing-parity-rebuild`, `mk-p1-4-aeo-seo-he`. **`mk-landing-parity-rebuild` is the reference build and may be rewritten — but for the HE file it is the source of truth, not a rewrite target (the rebuild copies HE's design system *onto EN*).** Sequencing: land `mk-p0-1` (canonical URL) and `mk-p0-5` (UTM/CTA wiring on the inbound side) BEFORE this footer edit, so the description link uses the final canonical URL. This mission's edit is **additive and footer-scoped** (one new `.foot-social` block + one CSS rule) — it does not touch the head `og:`/canonical tags (`mk-p0-1`/`mk-p1-4` territory), the hero CTAs (`mk-p0-5`), or any section markup (`p3`). Merge by appending the social block inside the existing `<footer>`; if `mk-p1-4` is editing footer SEO-cluster links concurrently (`:1591–1603`), insert the social row in `.foot-bot` (`:1586`) to stay out of the SEO-cluster region.
- **`PAI/projects/arbor/marketing/arbor-marketing-backlog.md`** — shared status table. Edit only the `P1-7` Notes cell; never reorder or rewrite other rows (other marketing missions tick their own cells in parallel).
- No app-source shared files (`loopEvents.ts`, `attribution.ts`, `navigation.ts`, etc.) are touched — this mission is deliberately app-code-free.

### Dependencies (other item ids that must land first)
- **`mk-p0-7-template-kit`** (declared `dependsOn`) — banner/avatar + on-brand frames come from the kit.
- **`mk-p0-5-attribution-utm`** — UTM scheme + funnel dashboard must exist so Shorts links are attributable (otherwise the channel is unmeasurable, violating the strategy's KPI requirement).
- **`mk-p0-1-domain`** — for the canonical IL landing URL in the description link (soft dep: fall back to `web.app` origin if domain not yet verified; swap once live, do not switch canonical prematurely).
- **Asset feeders (soft, for content flow, not for shipping the channel):** `mk-p1-1-avatar-challenge`, `mk-p1-2-creator-seeding`, `mk-p1-5` owned account, `mk-p0-8-copy-pack` (hook titles). Channel + SOP + footer link can ship before these; they fill the upload queue.

### Acceptance criteria (testable)
1. `arbor-youtube-shorts-sop.md` exists with: channel setup checklist, cross-post SOP, HE title templates for hooks 1/2/4/8, description+hashtag template, UTM link template (`utm_source=youtube&utm_medium=shorts&utm_campaign=il_ignition&utm_content=…`), and a cadence reference to `mk-p1-5`.
2. HE landing footer renders a social/YouTube link row that is keyboard-focusable, has a text `aria-label` per anchor, icons `aria-hidden`, and a ≥44×44px tap target — **verified live on dev server** (serve the html locally / on `arborprd-westeu.web.app`, tab to the footer, confirm focus ring + correct RTL ordering + link opens the channel in a new tab).
3. Lighthouse/axe a11y pass on the footer region shows no new contrast or name-role-value violations (icon contrast ≥4.5:1).
4. The YouTube description/pinned-comment link, when clicked, lands on the HE landing and the funnel dashboard (`mk-p0-5`) shows the visit attributed to `utm_source=youtube` (verified once `mk-p0-5` dashboard is live).
5. `arbor-marketing-backlog.md` `P1-7` row shows the completed status; no other rows modified (git diff scoped to one cell).
6. Net-new spend = €0; no bespoke production produced (only cross-posted existing 9:16 files) — confirmed by SOP review.

### Operating-rule checks
- **No dark patterns:** organic discovery + transparent UTM links; pinned-comment referral mirrors the honest copy-pack line ("This actually helped me…"), no fake-scarcity or fake-engagement. `sub_confirmation=1` on the channel link is a standard, non-deceptive subscribe prompt.
- **Privacy / COPPA-2026:** no child data leaves the app; Shorts content uses privacy-safe stylized avatars (per `mk-p1-1`), never a real child's face/identity. Footer link adds no tracking script, sets no cookie, sends no PII — first-party-only policy upheld (`mk-p0-4`).
- **Moat read/write:** marketing surface — does not read or write the longitudinal memory store directly; it drives installs that *seed* the moat. The hook titles (esp. "tracking one thing → the pattern was obvious", copy pack §6.9) advertise the moat truthfully.
- **Ships-visible:** the footer social row is a visible, shippable landing change (not a doc-only deliverable); the channel is a public, linkable surface. The SOP makes the recurring work executable without further research.
