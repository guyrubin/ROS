## mk-landing-parity-rebuild — Unify EN+HE landing on one design system
**Aspects:** UI/UX, Marketing, Copy · **Surfaces/platforms:** landing:en, landing:he · **Priority:** P0

### Problem / why

The two marketing landing pages are not a localized pair — they are two unrelated designs that happen to share a brand name.

Grounded diff (verified in-repo):

| | EN (`arbor-marketing-landing-page-en.html`) | HE (`arbor-marketing-landing-page-he.html`) |
|---|---|---|
| Lines | 340 | 1822 |
| Font stack | `Manrope` (en:111, en:116) | `Noto Sans Hebrew` + `Heebo` (he:111, he:816-817) |
| Brand color | blue `--blue:oklch(0.43 0.21 263)` (en:113) | clinical blue DS `--ds-blue:oklch(0.43 0.17 248)` after layered passes (he:800) — the file's *original* pine-green (`--green`, he:119-128) is overridden by two later passes ("Clalit 2030" he:591, "DESIGN SYSTEM V2" he:792) |
| Sections | 8: hero, proof, problem, capabilities (flat 6-card grid), how, memory, who, pricing, join | 10: hero, proof, problem, **interactive capability map (SVG centerpiece)**, **capabilities explained (6 diagram-led rows)**, how, memory, who, **principles**, pricing, join |
| Interactivity | smooth-scroll only (en:308-337) | scroll progress bar, nav-scrolled state, IntersectionObserver reveals, **keyboard-navigable capability map** (he:1698-1818) |
| Pricing labels | "Seedling / Arbor Plus / Arbor Family" (en:275-277) | "התחלה / Arbor פלוס / Arbor משפחתי" with annual prices + "most chosen" badge (he:1497-1529) |
| Mockup | flat phone card (en:170-180) | layered glass `mock-card` with floating badges, foot row, risk pill (he:1005-1070) |

The HE page is the mature, shippable design system (the one PRODUCT.md / the landing-page memory describes as "built with impeccable"). EN is an earlier, off-brand draft. Result: an English visitor and a Hebrew visitor see two different products. This is **UI/UX map item M8** and **Marketing reconciliation #1**.

**This item OWNS landing:en + landing:he UI parity.** The fix is to rebuild EN as a faithful **LTR mirror of the HE design system** (same CSS token system, same section set, same components, same JS), and to align the font choice across both so they read as one product in two languages.

### Scope across platform domains

- **Landing EN** (`html/arbor-marketing-landing-page-en.html`) — **full rewrite.** Replace the 340-line Manrope/blue page with the HE design system rendered LTR in English: same `<style>` block (the *final, settled* cascade, not the legacy layered passes — see below), same 10 sections, same interactive capability map + reveal + progress JS, English copy. `lang="en"`, no `dir="rtl"`.
- **Landing HE** (`html/arbor-marketing-landing-page-he.html`) — **light touch only.** HE is the reference; do **not** restructure it. Two surgical changes: (1) collapse its three stacked legacy CSS passes into one clean design-system block so EN and HE share an identical, maintainable stylesheet (optional but strongly recommended — see "CSS consolidation"); (2) align the font to the shared decision below. If consolidation risks regressions under time pressure, ship EN-parity first and leave HE's cascade untouched except for the font line.
- **Web app / iOS / Android** — out of scope. These are static marketing HTML files served from `/marketing/`; they do not touch the React app, `navigation.ts`, or Capacitor. No app code changes here.

### IA / UX / Copy / Marketing detail

#### Target IA (both pages, identical order)
1. **Nav** — brand + leafmark, 5 in-page links (`#capabilities #how #memory #who #pricing`), language toggle (EN↔עברית), ghost "How it works" + primary "Join the beta" CTA. (HE: he:981-1000)
2. **Hero** — eyebrow tag, `h1` "Know what's going on with your kid — and what to do tonight.", lede (the 2am framing), two actions, trust row, layered glass mockup with floating badges. (HE: he:1005-1070)
3. **Proof strip** — 4 cells: Experts · Personal · Daily · Continuity. (mirror en:184-191 copy into the HE `.proof` component)
4. **Problem** — `.contrast` grid: General content / Generic AI / A consult vs Arbor columns (3 rows). (HE: he:1073-1115; EN copy already exists en:201-203)
5. **Capability map (centerpiece)** — interactive SVG: "Arbor for my child" core + 8 orbiting nodes (Ask / My Child / Growth Plans / Today & Rhythm / Daily Play / Academy / Care & Experts / Trust & Safety); hover/click/arrow-key selects, side panel updates name/one-liner/long/"In the app:". (HE: he:1117-1150 markup + he:1699-1818 JS + `CAPS` data)
6. **Capabilities explained** — 6 `.cap` rows, each = text + custom SVG diagram, alternating sides. (HE: he:1153-1348)
7. **How it works** — 3 numbered `.step` cards. (HE: he:1350-1378; EN copy en:231-233)
8. **Memory moat** — drenched dark section, copy + vertical `.timeline` (Sept / Jan / Now). (HE: he:1380-1405; EN copy en:246-248)
9. **Who it helps** — 3 `.aud-card` (Parents lead / Professionals / Institutions). (HE: he:1407-1454; EN copy en:261-263)
10. **Principles** — eyebrow "Trust principles" + 4 `.prom-card` (No labels/diagnosis · Caution where it matters · Your story, your control · Calm before clever). **(EN is currently missing this section — add it.)** (HE: he:1456-1486)
11. **Pricing** — 3 `.tier` cards, middle `.feat` with "Most chosen" badge. (HE: he:1489-1533)
12. **Final CTA** — `.cta-final` drenched card. (HE: he:1536-1551)
13. **Footer** — brand + columns + bottom bar + SEO deep-guide cluster. (HE: he:1554-1604; EN deep-guide links en:298-305)

#### Shared font decision (resolves the Manrope vs Heebo split)
Use a **two-family system keyed off `lang`**, both loaded from one `<link>` per page:
- **EN page:** `--sans: "Manrope", ui-sans-serif, system-ui, …` — keep Manrope (it is already the EN choice and is a clean geometric sans that pairs with the DS). Load `family=Manrope:wght@400;500;600;700;800`.
- **HE page:** `--sans: "Heebo", "Noto Sans Hebrew", ui-sans-serif, …` — Hebrew has no good Manrope coverage; Heebo is the correct Hebrew counterpart and is already loaded (he:111). Drop the duplicate `Noto Sans Hebrew` weight load to one family if consolidating.
- **Critical:** both pages set `--serif` equal to `--sans` (the HE DS already does this, he:817 — there is no real serif; "serif-accent" is just weight/color). So "align fonts" = **same type *scale and weights*** (the DS `h-xl/h-lg/h-md/lede/eyebrow` clamps at he:824-828), differing only in the family that renders the script. Do **not** put Heebo on the EN page or Manrope on the HE page.

This is the build-level meaning of "align fonts": identical type tokens, script-appropriate family.

#### CSS consolidation (the stylesheet both pages share)
The HE file currently stacks **four** cascading layers in one `<style>`: the original pine-green system (he:118-975), a "2030 brand pass" (he:514), a "Clalit 2030 healthcare pass" (he:591), and "DESIGN SYSTEM V2" (he:792-974). Only the **last wins**. For the EN rebuild, author **one** clean stylesheet equal to the *computed final state* (DS V2 `--ds-*` tokens + the V2 component rules + the QA RTL block, minus the RTL-only rules). Concretely:
- Copy the `:root` from he:796-818 (the `--ds-*` tokens) as the single source of truth; drop `--green*` legacy vars not referenced by V2.
- Keep V2 component rules (he:819-911) and the responsive + reduced-motion blocks (he:912-927).
- **Omit** the "QA pass: stable RTL diagrams" block (he:929-974) on EN — it exists only to fix RTL bidi in SVG text (`direction:rtl; unicode-bidi:plaintext`). EN SVG text is LTR; use `direction:ltr` / default bidi.
- On EN, the capability-map node label tspan logic (he:1762-1770) splits on spaces for 2-line labels — keep it; English labels like "Today & Rhythm" / "Care & Experts" wrap fine.

#### RTL / LTR handling (the core of "LTR mirror")
- EN: `<html lang="en">` (no `dir`). All `margin-inline`, `border-inline`, logical props in the DS already flip correctly; LTR is the default so no overrides needed.
- Geometry that is **hardcoded left/right** must be checked. In HE these read RTL-naturally; in EN verify: `.mock-badge.b1{left:-1.6rem}` / `.b2{right:-1.4rem}` (he:305-306), `.tl::before{left:6px}` + `.tl{padding-left:1.6rem}` (he:416-417), `.step .si{right:1.5rem}` (he:395). For LTR these are visually fine as-is (badges on both sides, timeline rail on the left reads correctly LTR). Keep them; do not mirror — LTR is the *natural* reading for a left-anchored timeline.
- SVG capability map: arrow-key order in HE goes RTL; in EN `ArrowRight` should advance clockwise. The existing handler (he:1813-1814) maps Right/Down→next, Left/Up→prev by array index — index order is layout-direction-agnostic, so **leave the handler unchanged**; it is already correct for LTR.
- `text-anchor="middle"` SVG labels are direction-neutral; English renders correctly without the RTL bidi QA block.

#### Copy (English strings — reuse the approved EN draft, upgraded to fill new sections)
The current EN page already holds approved, on-message English copy for hero, proof, problem, capabilities, how, memory, who, pricing, CTA, footer (en:154-306). **Reuse it verbatim** where a 1:1 slot exists. Net-new copy needed for sections EN lacks:

- **Capability map side-panel** (8 entries — English mirror of `CAPS` he:1699-1731). Example entries:
  - Ask Arbor — *one:* "Expert-informed guidance that knows your child." *in the app:* "A structured answer: what's happening, how urgent, what to do today, what to keep."
  - My Child — *one:* "Your child's living developmental profile." *in the app:* "A timeline and insights showing what changed, what repeats, and what's worth noticing."
  - Growth Plans — *one:* "Development and routine plans you can run at home."
  - Today & Rhythm — *one:* "What to do today, and when your child likely needs you more."
  - Daily Play — *one:* "Daily games that build real skill, with things you have at home."
  - Academy — *one:* "Stories and masterclasses shaped around your child."
  - Care & Experts — *one:* "When you need a real person, they get the right context."
  - Trust & Safety — *one:* "A product that companions a child has to be careful."
- **Capabilities-explained** 6 rows — English mirror of he:1163-1348 (headings: "One question, an expert-informed answer" · "Today: your child's rhythm" · "Grow: games and plans that develop" · "Academy: your child inside the story" · plus My Child + Care rows). Reuse the existing EN capability one-liners (en:215-220) as the row leads.
- **Principles** 4 cards (English mirror of he:1466-1482): "No labels, no diagnoses" / "Caution where it counts" / "Your story, in your control" / "Calm before clever."
- **Pricing**: align labels to the HE/payment-model naming — keep EN "Seedling / Arbor Plus / Arbor Family" (en:275-277) but add the **annual price + "Most chosen" badge** the HE tier carries (€119/yr, €179/yr; he:1511,1522) so the offer is identical across languages. (Per `arbor-payment-model-2026-06-17.md`: Free / Plus €12.99 / Family €19.99.)
- **Final CTA** must keep the closing line "Next time you worry — you'll have a calm answer." (en:284) and add the `fine` reassurance line (mirror he:1548): "No card to start. Not diagnostic. Memory only with parent approval. Export or delete anytime."

#### UI states / motion / a11y / touch (apply the HE DS behavior to EN)
- **Default/loaded:** content is visible by default; `.reveal`/`.stagger` only add the hidden `.pre` state via JS when the tab is visible (he:1662-1696) — this preserves SSR/screenshot/no-JS visibility. Port this exactly so EN never ships blank.
- **Empty/error:** static marketing page — no data states. The one dynamic surface (capability map) must **render its default selection** (`select("ask")` he:1818) on load and remain fully usable if JS is the only thing that failed to bind nodes (nodes are built in JS; if JS is disabled the `.map-stage` shows the core box only — acceptable for a marketing page, but the side panel must contain real default copy in the markup, as HE does he:1142-1145, so something meaningful shows without JS).
- **Motion:** scroll progress bar, nav-scrolled blur, reveal transitions, mock hover lift, capability-node scale. All gated behind `@media(prefers-reduced-motion:reduce)` which kills animations/transitions/transforms (he:924-927). Port the reduced-motion block verbatim.
- **Touch targets:** `.btn{min-height:44px}` (he:837) — already AA. Capability nodes are `tabindex="0" role="button"` rects ≥190×66px (he:1734) — large enough.
- **Keyboard:** capability map is fully keyboard-operable: nodes focusable, Enter/Space selects, arrows cycle (he:1811-1815). `:focus-visible{box-shadow:var(--ring)}` (he:197) gives a visible ring. Nav links + all CTAs are real `<a>`. Port unchanged.
- **A11y (AA):** `aria-label` on map group + nodes (he:1127, he:1759), `aria-live="polite"` on the side panel (he:1140) so screen readers announce selection changes, `aria-pressed` toggled per node (he:1799). Decorative SVGs `aria-hidden`; diagram SVGs have `role="img"` + `aria-label` (he:1176 etc.) — translate those aria-labels to English. Color contrast: the DS blue-on-white and white-on-blue combos already pass; verify the `--ds-muted` proof text on `--ds-card` (≥4.5:1).
- **RTL:** N/A for EN (LTR); for HE leave intact.

#### Marketing instrumentation (coordinate, do not duplicate)
This item rebuilds the markup; **mk-p0-5-attribution-utm** owns CTA→app wiring and UTM forwarding, and **mk-p0-1-domain** owns canonical URLs. To avoid clobber, the rebuild must **leave the right hooks in place** for those items:
- Every conversion CTA (hero primary, nav primary, pricing buttons, final CTA) must be a real `<a>` with a **static `href="https://arborprd-westeu.web.app/"`** fallback and the attribute **`data-cta="app"`** (this is exactly the selector mk-p0-5 scripts against, per that spec lines 59-78). Do **not** ship the dead `href="#" onclick="return false"` pattern that exists today (en:286, he:1543) — replacing it is in-scope here; the UTM *forwarding script* is mk-p0-5's job.
- In-page section jumps ("See what Arbor does" → `#capabilities`) stay as `#anchor` and remain caught by the smooth-scroll handler. Keep the smooth-scroll script's `a[href^="#"]` binding intact.
- Keep the existing `<link rel="canonical">` + `hreflang` block (en:9-12, he:9-12) so mk-p0-1 has a single place to update.

### Files to create / edit (exact repo-relative paths)
- **EDIT (full rewrite):** `PAI/projects/arbor/html/arbor-marketing-landing-page-en.html`
- **EDIT (font line + optional CSS consolidation only):** `PAI/projects/arbor/html/arbor-marketing-landing-page-he.html`
- **Asset (already exists, no change):** `PAI/projects/arbor/brand/arbor-mark-transparent.png` — both pages reference it as `../brand/arbor-mark-transparent.png`; verify the path resolves from `html/`.
- No new files. (The EN footer's `/marketing/en/*.html` deep-guide links point at deploy-time pages not in this repo; keep the links, they are out of scope.)

### Shared-file conflict notes
Both shared files are in the conflict hotspot list. Per the hotspot note for `…-en.html` and `…-he.html`: **"mk-landing-parity-rebuild REWRITES this file wholesale — run it FIRST, then mk-p0-1 + mk-p0-5 + mk-p2-1 patch the rebuilt file; p3 polish last."**
- **Run order (en.html):** `mk-landing-parity-rebuild` → `mk-p0-1-domain` (canonical URL) → `mk-p0-5-attribution-utm` (UTM/`data-cta` script) → `mk-p2-1-localize-nl` (/nl variant) → `p3-ios-grade-audit` (polish). Land this spec's rewrite before any of those touch the file, or they will be writing into a file that's about to be replaced.
- **Run order (he.html):** this item makes only light edits; sequence the same — do this item's font/CSS touch before mk-p0-1/mk-p0-5/`mk-p1-4-aeo-seo-he`/p3.
- **Do-not-clobber contract:** ship the `data-cta="app"` attribute + static app-origin `href` on conversion CTAs and keep the smooth-scroll `a[href^="#"]` script — that is the exact interface mk-p0-5 expects (its spec, lines 59-78). Keep the `canonical`/`hreflang` block as a single editable unit for mk-p0-1. Do not rename section `id`s (`#capabilities #how #memory #who #pricing #join`) — nav, mk-p0-5 CTA targets, and mk-p1-4 all depend on them.

### Dependencies (other item ids that must land first)
- **None.** `dependsOn: []`. This is the upstream item for the whole landing-page hotspot chain; everything else on these two files depends on **this** landing first.

### Acceptance criteria (testable)
1. `arbor-marketing-landing-page-en.html` renders the same 10-section IA as HE, in the same order, using the `--ds-*` design tokens (no `--blue:oklch(0.43 0.21 263)` legacy blue, no flat 6-card capabilities grid).
2. EN and HE share an identical type scale (`h-xl/h-lg/lede/eyebrow` clamps), differing only in `--sans` family (Manrope on EN, Heebo on HE); `--serif === --sans` on both.
3. EN has the interactive capability map (8 nodes + core), keyboard-operable (Tab to a node, arrows cycle, Enter selects), with the side panel updating via `aria-live`, default selection `ask` shown on load.
4. EN includes the **Principles** section (4 cards) it previously lacked.
5. EN pricing shows 3 tiers with the middle "Most chosen" badge and annual prices, matching the payment model (Free / €12.99 / €19.99).
6. No dead CTA: every conversion CTA is a real `<a data-cta="app" href="https://arborprd-westeu.web.app/">…</a>`; the old `href="#" onclick="return false"` is gone. In-page jumps still smooth-scroll.
7. `prefers-reduced-motion: reduce` disables all animation/reveal/transform on EN (verified by toggling the OS/devtools setting).
8. With JS disabled, EN shows all sections (no blank `.reveal` content) and a meaningful default capability-panel.
9. Language toggle round-trips: EN "עברית" → he.html, HE "EN" → en.html.
10. **Verified live on dev server:** serve `/marketing/` locally (e.g. `npx serve PAI/projects/arbor` or the app's dev server pointed at the marketing dir), load `arbor-marketing-landing-page-en.html`, and visually confirm it is indistinguishable in system, layout, and polish from the HE page rendered LTR; capture before/after screenshots at 1280px and 390px widths.
11. Lighthouse/axe a11y pass on EN ≥ the HE page's score (no new contrast or name-role-value violations); brand asset `../brand/arbor-mark-transparent.png` loads (no 404).

### Operating-rule checks
- **No dark patterns:** CTAs are honest ("Join the beta", "Start now — free"), no fake scarcity beyond the existing truthful "private beta · limited founding spots", no pre-checked upsells, no manipulative urgency. Pricing is shown plainly with annual equivalents.
- **Privacy / COPPA-2026:** the page makes only privacy-positive claims ("Private by default", "You approve what is remembered", "Export or delete anytime"). No tracking pixels added here; analytics/UTM capture is mk-p0-5's scoped, first-touch, consent-respecting concern. No child PII collected on the marketing page.
- **Moat read/write:** the memory moat is the page's central narrative (capability map core = "Arbor for my child", memory-moat section, "grows with your child" timeline) — the rebuild *strengthens* the moat story by adding the capability map + principles the EN page lacked. Marketing artifact only; no app read/write.
- **Ships-visible:** the deliverable is a self-contained static HTML file that renders end-to-end on a dev server (criterion 10) — fully visible and operational, not a stub. Apple-grade craft is the explicit bar (parity with the impeccable-built HE page).
