## mk-p1-4-aeo-seo-he — AEO/SEO HE (Search Console, guide hubs)
**Aspects:** Marketing, Copy · **Surfaces/platforms:** landing:he · **Priority:** P1

### Problem / why
The Hebrew AEO/SEO foundation already exists and is shipped: a HE guides hub (`app/public/marketing/guides.html`), 7 HE deep-guide articles (`app/public/marketing/he/*.html`), the LLM-citation file `arbor-he.md`, a 23-URL `sitemap.xml`, a bot-permissive `robots.txt` (GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot/Google-Extended all `Allow`), and a JSON-LD enricher (`app/scripts/enrich-marketing-seo.mjs`). The GTM plan (`marketing/arbor-viral-gtm-2026-H2.md:77`) names the goal precisely: *"the live guide hubs + `arbor-he.md` so ChatGPT/Gemini/Perplexity recommend Arbor for Hebrew parenting questions. Submit Search Console after domain."*

Three concrete deficits block that goal:
1. **No FAQPage schema anywhere.** `grep -lE "FAQPage" he/*.html` and `grep -c "FAQPage" guides.html` both return zero. Answer-engines (ChatGPT/Gemini/Perplexity) and Google AI Overviews preferentially lift Q&A-structured content. This is the single highest-leverage AEO lever and it is entirely absent.
2. **Every public URL still points at the un-citable Firebase origin** `https://arborprd-westeu.web.app` — across `arbor-he.md` (9 links), `sitemap.xml` (23 `<loc>`), `llms.txt` (27 refs), and all HE guide canonicals. AEO citations on a `*.web.app` host are un-trustworthy and un-sayable. This switch is owned by **mk-p0-1-domain** (the `origin` const in `enrich-marketing-seo.mjs:5` is the master driver). mk-p1-4 **consumes** the post-switch origin; it does not re-edit it.
3. **HE intent coverage has gaps.** The 7 live HE guides cover product-concept intents (what-is-an-OS, memory app, AI-for-parents, daily play, stories, sleep routine, professional handoff). They do **not** cover the high-volume *symptom/worry* long-tail HE parents actually type at 2am (e.g. "האם זה נורמלי ש...", "מתי לפנות למומחה", "התקפי זעם בגיל שנתיים"). The backlog item (`marketing/arbor-marketing-backlog.md:33`) calls for "fill top 10 HE intent gaps."

This is **Marketing P1-4**. It depends hard on `mk-p0-1-domain` (canonical URLs must be live before Search Console submission, else indexing tanks).

### Scope across platform domains
- **Landing HE (RTL)** — the only surface in scope. Specifically the HE marketing static set, all served from `app/public/marketing/`:
  - HE guides hub `guides.html` — add `FAQPage` JSON-LD + a visible RTL FAQ section.
  - 7 existing HE guide articles `he/*.html` — add per-article `FAQPage` JSON-LD + a visible "שאלות נפוצות" section.
  - `arbor-he.md` — refresh links to new origin (post mk-p0-1) + add a "תשובות קצרות לשאלות נפוצות" Q&A block (the AEO grounding file LLMs ingest).
  - 3–5 **new** HE guide articles covering the top symptom/worry intent gaps.
  - `sitemap.xml` — add the new article `<loc>`s; bump `<lastmod>`.
  - `enrich-marketing-seo.mjs` — extend to emit `FAQPage` from a per-page FAQ data source so new + existing pages stay enriched on every build.
  - **Source-of-truth mirror:** the canonical prototype `PAI/projects/arbor/html/arbor-marketing-landing-page-he.html` (the listed sharedFile) — add the HE FAQ section + FAQPage JSON-LD here too so the prototype and the deployed `app/public/marketing/` copy stay in sync (the prototype is the human-edited source; `app/public/marketing/arbor-marketing-landing-page-he.html` is the deployed copy the enricher writes).
- **Landing EN** — out of scope (EN AEO is a P2 / separate item). Do not touch EN guides or `arbor-en.md`.
- **Web app / iOS / Android (Capacitor)** — out of scope. No `app/src/**` files touched. This item stays entirely in `public/marketing/`, `scripts/`, and the `html/` prototype.

### IA / UX / Copy / Marketing detail

**A. FAQPage schema — the core AEO build (highest leverage).**

The enricher currently builds `Organization` / `WebSite` / `SoftwareApplication` / `WebPage|CollectionPage` / `Article` / `BreadcrumbList` (`enrich-marketing-seo.mjs:101-198`) but never `FAQPage`. Extend it:

- Add a per-page FAQ map keyed by public path, e.g. a new module `app/scripts/seo-faqs.mjs` exporting `{ "/marketing/guides.html": [{q,a},…], "/marketing/he/…": […], … }`. Keep answers ≤ 50 words, plain-text, self-contained (answer-engines extract them verbatim).
- In `jsonLdFor()`, after the Article push, if the page's path has FAQ entries, push:
  ```js
  graph.push({
    "@type": "FAQPage",
    "@id": `${canonical}#faq`,
    "mainEntity": faqs.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a },
    })),
  });
  ```
- Schema must **mirror visible on-page content** (Google requirement: FAQ markup without matching visible text is a violation). So each article also gets a visible RTL `<section class="box"><h2>שאלות נפוצות</h2>…</section>` whose Q/A text is byte-identical to the schema.

**B. Visible FAQ copy (HE, RTL) — actual strings.**

Append to each of the 7 existing HE articles + new ones. Example for `he/maarechet-hafala-hitpatchut-hayeled.html` (place before the final `.box.cta` section so the CTA stays last):
```html
<section class="box">
<h2>שאלות נפוצות</h2>
<h3>מהי מערכת הפעלה להתפתחות הילד?</h3>
<p>שכבת תוכנה שמחברת את הזיכרון על הילד, שאלות ההורה, הכוונה ממומחי התפתחות, משחק יומי, תוכניות וסיכום מקצועי — כדי שההורה ידע מה לעשות היום ומתי לערב איש מקצוע.</p>
<h3>האם Arbor מחליפה רופא או מטפל?</h3>
<p>לא. Arbor היא מערכת תמיכה להורים, לא כלי אבחון ולא שירות חירום. כשצריך, היא מכינה סיכום מסודר כדי לפנות לאיש מקצוע.</p>
<h3>למי Arbor מתאימה?</h3>
<p>להורים לילדים בגיל 0–12 שרוצים פחות ניחושים ויותר בהירות סביב שינה, שפה, רגשות, התנהגות, מעברים ומשחק.</p>
</section>
```
Each article gets 3 questions tuned to its intent (memory-app article → "למה צריך זיכרון על הילד?"; sleep article → "איך בונים שגרת שינה רגועה?"; handoff article → "מה כולל סיכום מקצועי לרופא?"). Tone per `arbor/CLAUDE.md`: calm, direct, non-alarmist, no diagnosis, no medication, child-development framed. Keep the existing safety disclaimer pattern from `arbor-he.md` ("אינה כלי אבחוני… אינה שירות חירום").

**C. New HE intent-gap guides (fill the symptom/worry long-tail).** Create 3–5 (min 3) new articles in `app/public/marketing/he/` mirroring the existing article skeleton (`<head>` canonical+hreflang+description+JSON-LD, `<main>` crumb → header → sections → FAQ → CTA). Target HE intents the live set misses, prioritized:
1. `meta-lifnot-lemumche-hitpatchut.html` — "מתי לפנות למומחה התפתחות?" (when to escalate — ties directly to the moat's professional-handoff story).
2. `haim-ze-normali-hitpatchut-yeled.html` — "האם זה נורמלי? איך הורה מבדיל בין שונות לדגל אדום" (normal vs. flag — non-alarmist).
3. `hitkefei-zaam-peuteot.html` — "התקפי זעם וויסות רגשי אצל פעוטות" (tantrums / co-regulation).
Optional 4–5: `ikuv-safa-yeled.html` (speech-delay worry), `maavar-megan-lebeit-sefer.html` (kindergarten→school transition). Each new article: HE `dir="rtl"`/`lang="he"`, `hreflang="he"` self + `hreflang="en"` pointing to the EN equivalent only if it exists (otherwise omit the EN alternate rather than 404). Internal-link each new article to ≥2 existing guides + the HE landing (builds the hub topology answer-engines crawl).

**D. `arbor-he.md` refresh (the LLM grounding file).** After mk-p0-1 flips the origin, update the 9 absolute links to the new domain, append the new article URLs, and add a Q&A block:
```md
## תשובות קצרות לשאלות נפוצות
**מתי לפנות למומחה התפתחות?** כשיש דאגה מתמשכת, נסיגה ביכולת, או פער עקבי מול בני הגיל — Arbor עוזרת לארגן את התמונה ולהכין סיכום לאיש מקצוע.
**האם AI יכול להחליף ייעוץ מקצועי?** לא. Arbor נותנת הקשר והכוונה רגועה, אך אינה מאבחנת ואינה מחליפה רופא או מטפל.
```

**E. Search Console + AEO verification (the marketing instrumentation).** After mk-p0-1 confirms the domain is live + sitemap submitted (mk-p0-1 acceptance #6), this item: (1) confirms the HE guide URLs + new articles are in `sitemap.xml` and request indexing for the top 3 in GSC; (2) runs the FAQ rich-results check (Google Rich Results Test) on guides.html + 1 article — must show valid `FAQPage`; (3) logs an AEO baseline: query ChatGPT / Gemini / Perplexity with 5 HE prompts ("מה זו אפליקציית הורות עם זיכרון?", "אפליקציה שעוזרת לדעת מתי לפנות למומחה התפתחות", etc.) and record whether Arbor is cited + which URL — this is the testable AEO outcome, re-checked at +4 weeks. No code event; the instrument is the GSC property + the logged citation baseline in `marketing/EXECUTION-TRACKER.md`.

**A11y / RTL (visible FAQ sections):** reuse the article's existing `.box` styling (no new CSS). `<h3>` question headings under the `<h2>שאלות נפוצות</h2>` keep heading order (no skipped levels). Inherits page `dir="rtl"` — no per-element direction overrides. No motion/JS added (static FAQ; no accordion → nothing to make keyboard-/`prefers-reduced-motion`-unsafe). Contrast inherits the page tokens (already AA). Touch targets: the only interactive elements are the existing `.links` anchors (unchanged).

### Files to create / edit (exact repo-relative paths)
**Create:**
- `PPPPtherapy-/PPPPtherapy-/app/scripts/seo-faqs.mjs` — per-path HE FAQ map (q/a), imported by the enricher.
- `PPPPtherapy-/PPPPtherapy-/app/public/marketing/he/meta-lifnot-lemumche-hitpatchut.html` — new guide.
- `PPPPtherapy-/PPPPtherapy-/app/public/marketing/he/haim-ze-normali-hitpatchut-yeled.html` — new guide.
- `PPPPtherapy-/PPPPtherapy-/app/public/marketing/he/hitkefei-zaam-peuteot.html` — new guide.
- (optional) `…/he/ikuv-safa-yeled.html`, `…/he/maavar-megan-lebeit-sefer.html`.

**Edit:**
- `PPPPtherapy-/PPPPtherapy-/app/scripts/enrich-marketing-seo.mjs` — import `seo-faqs.mjs`; push `FAQPage` into the graph when the path has FAQ entries. (Read-only on `origin`; do NOT change the const — that is mk-p0-1's.)
- `PPPPtherapy-/PPPPtherapy-/app/public/marketing/guides.html` — add visible FAQ section (schema written by enricher).
- `PPPPtherapy-/PPPPtherapy-/app/public/marketing/he/maarechet-hafala-hitpatchut-hayeled.html` + the other 6 `he/*.html` — add visible FAQ sections.
- `PPPPtherapy-/PPPPtherapy-/app/public/marketing/arbor-he.md` — link refresh + new URLs + Q&A block.
- `PPPPtherapy-/PPPPtherapy-/app/public/sitemap.xml` — add new article `<loc>`s; bump `<lastmod>`.
- `PAI/projects/arbor/html/arbor-marketing-landing-page-he.html` — add the HE FAQ section + matching `FAQPage` JSON-LD (keep prototype in sync with deployed copy; preserve `lang="he"`/`dir="rtl"`).
- `PAI/projects/arbor/marketing/EXECUTION-TRACKER.md` — log GSC submission + AEO citation baseline.

**Run after edits:** `node app/scripts/enrich-marketing-seo.mjs` (regenerates JSON-LD incl. new FAQPage on all `public/marketing/*.html`), then build + deploy.

### Shared-file conflict notes
- **`PAI/.../html/arbor-marketing-landing-page-he.html`** (the listed sharedFile) — hotspot, touched by `p3-ios-grade-audit, mk-p0-1, mk-p0-5, mk-landing-parity-rebuild, mk-p1-4`. Per the hotspot note, **HE is the reference build for `mk-landing-parity-rebuild`** and `mk-p0-1` rewrites its canonical to `/il`. **Ordering: `mk-landing-parity-rebuild` → `mk-p0-1` (canonical/origin) → `mk-p1-4` (this item).** mk-p1-4's edit is **append-only**: a new `<section>` in `<body>` + a `FAQPage` object appended to the existing JSON-LD `@graph` array. It does **not** touch the `<head>` canonical/hreflang/og/`@id`s that mk-p0-1 owns, nor the layout/hero that the parity-rebuild owns — so it is disjoint and lands cleanly after both. Do not reorder existing JSON-LD nodes; append only.
- **`enrich-marketing-seo.mjs`** — per mk-p0-1 spec it is "owned solely by SEO items; mk-p1-4 also reads its output but only [mk-p0-1] changes the `origin` const." mk-p1-4 adds a NEW `FAQPage` branch + a new import; it must **not** edit line 5 (`origin`). Land mk-p0-1 first so the regenerated JSON-LD already carries the new host; mk-p1-4's enricher run then emits FAQPage on the correct origin.
- **`sitemap.xml` / `llms.txt` / `arbor-he.md`** — mk-p0-1 owns the host rewrite across all of these. mk-p1-4 only **adds new `<loc>` rows** (new articles) and **appends** the Q&A block to `arbor-he.md`. Sequence after mk-p0-1's host switch so new rows use the new host from birth (avoids a second find-replace pass / merge churn).
- No `app/src/**` shared files touched — avoids the `navigation.ts` / `ArborContext.tsx` / `index.css` / `loopEvents.ts` merge magnets entirely.

### Dependencies (other item ids that must land first)
- **`mk-p0-1-domain`** (hard) — canonical/origin/sitemap/`llms.txt` must be on the real domain before Search Console submission and before new article canonicals are written; the enricher `origin` const must already be flipped so FAQPage `@id`s use the new host.
- **`mk-landing-parity-rebuild`** (ordering, for the HE prototype edit only) — must land before mk-p1-4 appends to `arbor-marketing-landing-page-he.html` so the FAQ section is added to the settled layout.
- **Guy/access gate** (not an item id): Search Console domain-property verification + "request indexing" need Guy's GSC access (same account as mk-p0-1's DNS-verified property). AEO citation re-check at +4wk is a manual marketing task.

### Acceptance criteria (testable, incl. verified live)
1. `grep -lE "FAQPage" app/public/marketing/he/*.html` returns **all** HE articles (7 existing + new), and `grep -c "FAQPage" app/public/marketing/guides.html` returns ≥ 1 — up from 0 today.
2. Every `FAQPage` schema's `Question`/`Answer` text is byte-identical to a visible `<h3>`/`<p>` pair on the same page (no markup-without-visible-content violation). Google Rich Results Test on `guides.html` + 1 article reports **valid FAQ**, no errors.
3. ≥ 3 new HE guide articles exist under `app/public/marketing/he/`, each with HE `dir="rtl"`/`lang="he"`, a self `hreflang="he"`, a visible FAQ section, the safety disclaimer, and ≥ 2 internal links to other guides + the HE landing.
4. `sitemap.xml` includes a `<loc>` for every new article on the **new domain** (post mk-p0-1); `<lastmod>` bumped; XML still well-formed (`xmllint --noout sitemap.xml` passes).
5. `arbor-he.md` links all resolve on the new domain (zero `arborprd-westeu` after mk-p0-1) and include the new articles + the "תשובות קצרות לשאלות נפוצות" block.
6. `node app/scripts/enrich-marketing-seo.mjs` runs clean (exit 0), reports the enriched page count, and the regenerated pages still parse as valid JSON-LD (no syntax errors); the `origin` const is unchanged by this item (`git diff` on line 5 is empty).
7. **Verified live on dev/prod host:** the HE guides hub + ≥1 article + ≥1 new article load over HTTPS on the real domain; View-Source shows the `FAQPage` JSON-LD and the visible FAQ section renders RTL; URLs are in the submitted GSC sitemap and the top 3 have "request indexing" fired.
8. **AEO baseline logged:** 5 HE prompts run against ChatGPT/Gemini/Perplexity with citation result (cited Y/N + URL) recorded in `EXECUTION-TRACKER.md`, with a +4-week re-check scheduled (target: ≥1 engine cites an Arbor HE URL).

### Operating-rule checks
- **No dark patterns:** all-organic content SEO/AEO. No cloaking (visible text == schema text), no doorway pages (each guide is genuinely useful standalone), no keyword stuffing. Robots stays permissive and honest.
- **Privacy / COPPA:** marketing pages are non-account, collect no child data, add no tracking (analytics already present via mk-p0-4; this item adds none). No PII in any URL or FAQ answer. FAQ answers explicitly state Arbor is not a diagnostic/medical/emergency tool (consistent with `arbor/CLAUDE.md` safety rules).
- **Moat read/write:** content surfaces the longitudinal-memory story to answer-engines — the "when to involve a professional / handoff" guide + FAQ make the *memory→professional-handoff* moat the thing LLMs cite. No app moat data is read/written (marketing surface), but the copy is the public articulation of the moat.
- **Ships-visible:** publicly observable end-to-end — real FAQ sections render on the live HE pages, valid FAQ rich-results validate, new guides are crawlable + in the sitemap, and the AEO citation outcome is measured, not stubbed.
