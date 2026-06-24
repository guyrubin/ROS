## mk-p0-7-template-kit — Content template kit
**Aspects:** Marketing · **Surfaces/platforms:** landing:he · **Priority:** P0

### Problem / why
The €10k/6-month GTM (`arbor-viral-gtm-2026-H2.md`) is organic-led: no paid acquisition, every user must bring the next one. That requires a steady drip of on-brand, repurposable creative across owned IG/TikTok/YouTube-Shorts (P1-5, P1-7) and creator-seeding briefs (P0-6, P1-2) — produced fast, at near-zero marginal cost, by a non-designer (Me/MKT). Today the asset library (`marketing/assets/`) is ad-hoc: only `arvo-avatar-1080.png`, `arbor-youtube-banner.png`, and a handful of one-off `he-frame-*.png` / `he2-*.png` stills exist. There is **no reusable template system** — no documented frames, no brand-locked tokens, no aspect-ratio contract, no caption-overlay safe zones.

Per the work item, P0-7 is **half done**: the Arvo avatar render (`arvo-avatar-1080.png`) and the YouTube banner (`arbor-youtube-banner.png`) exist. This spec defines the **remaining half** — the four template families called out in the backlog (`arbor-marketing-backlog.md:19`): **avatar-challenge frame, 2am-Reel template, answer-card style, growth-card design** — as a documented, brand-locked, reusable kit so MKT can produce dozens of variants without re-deciding brand every time.

Hard constraint: the kit's **aspect ratios, watermark, and visual frame must match the in-app branded Share export (P0-3 / `arbor-loop-eng-spec.md:32-38`)** so creator/owned content and user-generated shares look like one system. Mismatched dimensions or watermark = the loop looks bolted-on, not iOS-grade.

This is a **content/✍ item** (no app code). The single shared file it edits is the marketing backlog row.

### Scope across platform domains
- **Landing HE (RTL)** — *reference only, not edited by this item.* The HE landing page (`html/arbor-marketing-landing-page-he.html`) is the **canonical source of the brand tokens** the kit must lock to (pine-green palette, type ramp, radii, RTL rules). The kit extracts and freezes those tokens into a portable brand sheet so off-page assets stay consistent with the page users land on. (The work-item surface is tagged `landing:he` because that page is the design-system anchor; the deliverable is a template kit, not a landing edit.)
- **Web / iOS / Android** — not touched. The kit must *visually align* with the in-app Share export (same 1:1 + 9:16 frame, same "Made with Arbor" watermark, same wordmark lockup) so P0-3's renderer and these templates are interchangeable to a viewer — but this item ships no app code.

### IA / UX / Copy / Marketing detail

**Discipline applied:** `marketing:campaign-plan` + `rubin-os:copywriter` method — define the asset system (the "content calendar fuel"), the brand lock, and the exact overlay copy slots, not just loose images.

#### A. Brand lock (extracted from `html/arbor-marketing-landing-page-he.html`)
Freeze these into a one-page `BRAND.md` so every template references the same values. Exact tokens from the HE landing `:root` (lines ~120–176) and HE override block (line ~693):

- **Primary:** pine green — base `--green:oklch(0.68 0.14 178)`; deep `--green-700` (use for eyebrows/accents); `theme-color #2f5d47` is the canonical hex for non-OKLCH tools (Canva). Use `#2f5d47` as the kit's primary swatch.
- **Canvas / ink:** bg `oklch(0.985 0.008 230)` (near-white cool); ink `oklch(0.18 0.045 268)`; muted `oklch(0.52 0.025 250)`.
- **Accent set (sparingly, one per asset):** coral `oklch(0.72 0.17 35)`, cyan `oklch(0.72 0.15 210)`, amber `oklch(0.62 0.115 75)` for risk/urgency only.
- **Type — HE:** sans = `"Assistant","Heebo"` (the kit ships `arbor-2am-test/fonts/heebo-hebrew.woff2`); HE has **no separate serif** (line 693 maps `--serif` to the same Hebrew stack). **Do not use Fraunces/Inter in HE assets** — the backlog note (`:19`) says "Inter/Fraunces" but the live HE page overrides serif to Hebrew sans; the kit must follow the *live page*, and flag this discrepancy back into the backlog note.
- **Type — EN repurposes:** sans = Inter, serif (headlines) = Fraunces 500 italic for the `.serif-accent` voice.
- **Radii:** cards `--r-xl:16px` / `--r-2xl:20px`; pill CTAs `--r-pill:999px`.
- **Shadows:** soft only — `--shadow-lg` equivalent (no harsh drop shadows). Calm/premium parent register.

#### B. Aspect-ratio + watermark contract (must match P0-3)
Per `arbor-loop-eng-spec.md:34-38`, in-app export ships `1:1` (1080×1080) and `9:16` (1080×1920). The kit standardizes on:
- **9:16 — 1080×1920** (Reels/Stories/Shorts primary).
- **1:1 — 1080×1080** (feed/answer-card).
- **4:5 — 1080×1350** (IG feed bonus crop — derive from the 1:1 master, no new layout).
- **Caption-safe zone:** keep all text inside the central 1080×1420 region of the 9:16 frame (≥250px top, ≥250px bottom clear) so platform UI chrome (TikTok caption, IG handle/CTA) never overlaps copy.
- **Watermark lockup (identical to P0-3):** Arbor wordmark + small "Made with Arbor" / HE "נוצר עם Arbor", bottom-aligned inside the safe zone, on every asset. Deep-link/referral is baked by the in-app exporter, not by these templates — but the templates **reserve the same wordmark position** so the two are visually identical.

#### C. The four template families (the remaining deliverable)

**1. Avatar-challenge frame** (`#ArborAvatar`, the viral centerpiece — copy pack §2)
- 9:16 + 1:1. Center stage = the child's Arbor character (Arvo style; `arvo-avatar-1080.png` is the style reference). Pine-green soft-gradient backdrop, tree-mark motif top, generous whitespace.
- Overlay copy slots (HE primary, from copy pack §2): top eyebrow `#ArborAvatar`; bottom CTA strip `תיצרו אחד שלכם 👇` + `קישור בביו`. EN variant slot mirrors.
- "Share-to-unlock second style" framing: a subtle "🔓 style 2" pill so the mechanic reads visually.
- States to deliver: blank frame (creator fills own avatar) + 2 worked examples (one HE, one EN).

**2. 2am-Reel template** (the "is this normal at 2am" hook — GTM §3, copy pack §6)
- 9:16 only. Dark-calm variant: deep navy `oklch(0.15 0.09 270)` ground (the "2am" mood — the only dark template; all others are light canvas), single warm accent. Large hook line top third, product-UI screenshot or answer-card mid, CTA bottom.
- Hook-line slot pre-loaded with the 4 priority HE hooks (copy pack §84-88): e.g. `"11 בלילה, הילד לא נרדם, וגוגל רק מלחיץ אותך יותר. מה שאני עושה במקום 👇"`.
- Authenticity rule baked into the brief: real parent moment > polish (copy pack §50). Template is a *frame for UGC*, not a glossy ad.

**3. Answer-card style** (the screenshot-able "Read / Risk / Do-tonight" card — GTM §44)
- 1:1 + 4:5. Mirrors the **in-app answer card** structure from `CLAUDE.md` response format: `## Read` / `## Risk Level` / `## Do Today`. Light card on canvas, pine-green header bar, risk chip (green=Low / amber=Medium / coral=High — uses the accent set, never red-alarmist).
- This is the format that must match what P0-3 exports from the live app, so a screenshot and a template look identical.
- Deliver blank + 2 filled examples (one HE "זה נורמלי?" reveal, one EN).

**4. Growth-card design** (the monthly memory-moat beat — feeds P2-6)
- 1:1 + 9:16. Visualizes "what changed this month" from the longitudinal record: 3 mini-stats + one warm milestone line. Pine-green premium treatment, serif-accent headline (EN) / Hebrew-sans (HE).
- Copy slot: `החודש אצל [שם]` / `This month with [child]`. Privacy: stats are parent-owned, no PII in the template; example uses a placeholder name.

#### D. Format & where it lives
- Two-track delivery: **(a) Canva** — a brand-kit (palette + fonts + the 4 templates as Canva pages) for MKT to fill fast; **(b) HTML/CSS source** — portable HTML templates committed to the repo using the *same tokens*, so assets can also be rendered programmatically (consistent with the existing `arbor-2am-test/` HyperFrames approach and `heebo-hebrew.woff2` font already in repo). The HTML track is the source-of-truth; Canva is the convenience layer.
- All static example renders land in `marketing/assets/templates/`.

### Files to create / edit (exact repo-relative paths)
**Create:**
- `PAI/projects/arbor/marketing/template-kit/README.md` — kit index: the four families, aspect-ratio contract, watermark rule, Canva link, how-to-fill, caption sources (→ copy pack).
- `PAI/projects/arbor/marketing/template-kit/BRAND.md` — the frozen brand lock (§A above): tokens extracted from the HE landing, HE vs EN type rules, swatch hexes for Canva, do/don't.
- `PAI/projects/arbor/marketing/template-kit/avatar-challenge.html` — 9:16 + 1:1 frame, HE+EN slots.
- `PAI/projects/arbor/marketing/template-kit/two-am-reel.html` — 9:16 dark-calm hook frame, HE hook slots pre-loaded.
- `PAI/projects/arbor/marketing/template-kit/answer-card.html` — 1:1 + 4:5, Read/Risk/Do-tonight, mirrors in-app card.
- `PAI/projects/arbor/marketing/template-kit/growth-card.html` — 1:1 + 9:16, monthly memory-moat beat.
- `PAI/projects/arbor/marketing/assets/templates/` — 8 example PNG renders (2 per family, HE+EN where relevant).

**Edit (shared file — see conflict notes):**
- `PAI/projects/arbor/marketing/arbor-marketing-backlog.md` — update only the P0-7 row (`:19`): mark the 4 templates done, link the kit README, and **correct the "Inter/Fraunces" note to reflect the live HE Hebrew-sans override** (Assistant/Heebo).

**Reference only (do NOT edit):**
- `PAI/projects/arbor/html/arbor-marketing-landing-page-he.html` (brand-token source).
- `PAI/projects/arbor/marketing/arbor-launch-copy-pack.md` (all overlay strings).
- `PAI/projects/arbor/marketing/arbor-loop-eng-spec.md` (aspect/watermark contract from P0-3).

### Shared-file conflict notes
- **`arbor-marketing-backlog.md`** is this item's only shared file (sharedFiles list). It is **not** in the high-traffic `conflictHotspots` set (those are app-code files like `loopEvents.ts`, `navigation.ts`, `index.css`). The backlog is edited per-row by many marketing items; **avoid clobber by editing only the single P0-7 table row** — do not reflow the table, renumber, or touch other rows. Append-only discipline on the status/notes cells.
- This item touches **zero app-code hotspots** — by design it is a content kit, so it runs fully parallel to every engineering mission with no serialization needed.
- The kit *reads from* but does not edit `arbor-marketing-landing-page-he.html` (a `mk-landing-parity-rebuild` / `mk-p0-1` / `mk-p0-5` hotspot). No write conflict. If the parity rebuild changes brand tokens later, re-sync `BRAND.md` — note this dependency in the README.
- The kit's frame/watermark spec must stay in lockstep with **P0-3 share-export** (`mk-p0-3-share-export`, which builds the in-app image renderer beside the clinical `reportExport.ts`). These two are not the same file, but they must agree on dimensions and watermark — flag in README that P0-3's renderer is the binding spec for the in-app side and this kit mirrors it.

### Dependencies (other item ids that must land first)
- **None hard-blocking.** The kit can be authored now from the live HE landing tokens + copy pack (both exist).
- **Soft alignment (not blocking):** `mk-p0-3-share-export` defines the exact in-app watermark/aspect output. If P0-3 finalizes first, copy its exact dimensions/watermark lockup verbatim. If this kit ships first, P0-3 must match the kit. Coordinate so the two never diverge.
- **Soft input:** `mk-p0-8-copy-pack` (✅ done — `arbor-launch-copy-pack.md`) supplies every overlay string.

### Acceptance criteria (testable)
1. `template-kit/BRAND.md` exists and its swatch hexes/OKLCH values **match the HE landing `:root`** (spot-check `#2f5d47`, `oklch(0.68 0.14 178)`, Assistant/Heebo HE stack).
2. All four HTML templates exist, each render at exactly **1080×1920 (9:16)** and/or **1080×1080 (1:1)** with text inside the defined caption-safe zone (verified by opening each HTML at the target viewBox in a browser and screenshotting — no copy clipped, no chrome overlap).
3. Every template shows the **"Made with Arbor" / "נוצר עם Arbor" wordmark in the same bottom position** as the P0-3 export spec.
4. HE templates render correctly **RTL** (text right-aligned, mirrored layout, no Latin-serif fonts) using the bundled `heebo-hebrew.woff2`.
5. 8 example PNGs exist in `marketing/assets/templates/`, demonstrating each family filled with real copy-pack strings.
6. Backlog P0-7 row updated: 4 templates marked done, README linked, Inter/Fraunces note corrected.
7. **Verified live on dev server:** open each template HTML on the local static dev server (e.g. `npx serve PAI/projects/arbor/marketing/template-kit`) and confirm fonts load, RTL renders, and the frame matches the HE landing brand at the three aspect ratios.

### Operating-rule checks
- **No dark patterns:** templates are honest creative frames; the "share-to-unlock style" mechanic is disclosed visually on the avatar frame, not hidden. No fake urgency, no manufactured scarcity, no fear-sell (the 2am template uses a calm, not alarmist, tone — risk chips cap at coral, never red-alarm).
- **Privacy / COPPA-2026:** the avatar template uses the **privacy-safe stylized** Arvo character (not photo-real), per GTM risk mitigation (`:150`). Growth-card examples use placeholder names, zero PII. Templates never instruct users to post a child's face or real data.
- **Moat read/write:** the growth-card and answer-card templates *surface* the longitudinal memory moat (monthly change, "your kid's answer not a generic one") — they make the moat visible in shareable form. This is a content artifact, so it reads the moat's value prop; no app write.
- **Ships-visible:** the kit is rendered, example PNGs committed, and verified live on a static server at all three aspect ratios — a competent MKT person can open Canva/HTML and produce a post the same day.
