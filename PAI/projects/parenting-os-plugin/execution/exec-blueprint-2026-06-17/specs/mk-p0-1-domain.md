## mk-p0-1-domain — Buy global domain + IL vanity, verify Firebase HTTPS
**Aspects:** Marketing · **Surfaces/platforms:** landing:en, landing:he · **Priority:** P0

### Problem / why
Every public-facing Arbor URL today is the raw Firebase technical host `https://arborprd-westeu.web.app`. That string is un-sayable on a Reel, un-trustworthy in a paid ad, and un-brandable for AEO/SEO citations. It is hardcoded as canonical/OG/JSON-LD across the EN + HE landing pages (`PAI/.../html/arbor-marketing-landing-page-en.html:9-60`, `...-he.html:9-56`), in the shipped public assets (`PPPPtherapy-/PPPPtherapy-/app/public/sitemap.xml` — 19 `<loc>`, `robots.txt:28` sitemap line, `llms.txt` — every link), and as the single `origin` constant in the SEO enrichment script (`PPPPtherapy-/PPPPtherapy-/app/scripts/enrich-marketing-seo.mjs:5`).

This item is the **P0-1 gate**: it (a) buys the global brand domain + the Israel vanity `arbor.co.il`, (b) connects them as Firebase custom domains with verified HTTPS, then (c) **only after HTTPS is green** flips every canonical/sitemap/robots/llms/JSON-LD reference off the bad URL onto the real domain. It unblocks all public + share assets and the entire AEO/SEO program (mk-p1-4, mk-p0-3 share-export, mk-p0-5 attribution). Sequencing matters: switching canonical before SSL is live would 404/insecure the canonical and tank indexing.

This is a **Guy/spend gate** — Steps 1-2 (buy + DNS + Firebase add-domain) require Guy's card + console access. The agent prepares all repo edits and only executes Step 4 after Guy confirms HTTPS is verified live.

### Scope across platform domains
- **Landing EN** (`arbor-marketing-landing-page-en.html`): rewrite canonical, both `hreflang` alternates, `x-default`, `og:url`, and all 4 JSON-LD `@id`/`url`/`image` references from the `arborprd-westeu.web.app` origin to the new global domain. `/` is the canonical EN home.
- **Landing HE (RTL)** (`arbor-marketing-landing-page-he.html`): same rewrite; HE canonical becomes `https://<domain>/il` (or `https://arbor.co.il/`). Keep `dir="rtl"`/`lang="he"` untouched. HE is served on the IL vanity and/or `/il` path.
- **Web (public assets, shipped in `app/public/`)**: `sitemap.xml` (all `<loc>` + `xhtml:link` alternates), `robots.txt` (Sitemap line), `llms.txt` (all absolute links), and `enrich-marketing-seo.mjs` `origin` const — then re-run the enricher + redeploy.
- **iOS (Capacitor) / Android (Capacitor)**: out of scope for this item (native deep-link/universal-link domain association is a later mobile item). Do **not** touch `capacitor.config.ts` here.

### IA / UX / Copy / Marketing detail

This is a **marketing/infrastructure** item — no UI component renders. The deliverables are (1) registrar + DNS state, (2) Firebase custom-domain state, (3) a deterministic find-and-replace across canonical/SEO assets, (4) Search Console verification.

**Step 1 — Buy domain (Guy, card).** Check availability in priority order, buy first clean one: `joinarbor.com` → `getarbor.com` → `helloarbor.com` → `arbor.family`. Plus IL vanity `arbor.co.il`. Registrar: Cloudflare Registrar (at-cost, free DNS) or Namecheap. Enable auto-renew + WHOIS privacy. (Mirrors `marketing/arbor-domain-setup-checklist.md` Step 1.) **Record the chosen domain back into that checklist and into MEMORY so all downstream items read one value.**

**Step 2 — Firebase custom domain (Guy, console).** Firebase Console → Hosting → Add custom domain → apex + `www`. Add the shown A/TXT (and/or CNAME) records at the registrar. Wait for verification + auto SSL. Confirm green "Connected" + HTTPS on apex, `www`, and `arbor.co.il`. Keep `arborprd-westeu.web.app` alive as **technical origin only**.

**Step 3 — Routing.** `/` → global EN landing; `/il` → HE landing (or `arbor.co.il` apex serving HE; or 301 → primary `/il`); `/nl` reserved (mk-p2-1, later). No `firebase.json` rewrite changes required — the existing SPA catch-all rewrite (`firebase.json:13-16`) plus the marketing static files already resolve; the domain is purely a DNS/hosting binding.

**Step 4 — Canonical switch (agent, ONLY after Guy confirms HTTPS green).** Define `NEW_ORIGIN = https://<chosen-domain>` (e.g. `https://joinarbor.com`). Deterministic replacements:

- **`enrich-marketing-seo.mjs:5`** — change `const origin = "https://arborprd-westeu.web.app";` → `const origin = "https://joinarbor.com";`. This single constant drives canonical fallback, OG, and all JSON-LD `@id`/`url` in the generated pages (lines 86-234). This is the highest-leverage edit.
- **EN landing head** — `canonical` → `https://joinarbor.com/`; `og:url` → same; `hreflang="en"` → `/`; `hreflang="he"` → `https://joinarbor.com/il`; `x-default` → `/`; JSON-LD Organization/WebSite/SoftwareApplication `@id`/`url`/`image` → `joinarbor.com` host.
- **HE landing head** — `canonical` → `https://joinarbor.com/il` (or `https://arbor.co.il/`); mirror alternates + `x-default`; JSON-LD host rewrite. Preserve `lang="he"`/`dir="rtl"`.
- **`public/sitemap.xml`** — replace every `arborprd-westeu.web.app` with the new host (19 `<loc>` + alternates); the EN home `<loc>` becomes `https://joinarbor.com/marketing/` (or `/` per final routing), HE `<loc>` aligns with `/il`. Bump `<lastmod>` to switch date.
- **`public/robots.txt:28`** — `Sitemap: https://joinarbor.com/sitemap.xml`.
- **`public/llms.txt`** — replace all absolute `arborprd-westeu.web.app` URLs (lines 11-59) with the new host.
- Re-run `node app/scripts/enrich-marketing-seo.mjs` to regenerate JSON-LD on the deployed `public/marketing/*.html` copies, then build + deploy. (Note: the canonical *source* HTML lives under `PAI/.../html/`; the deployed copies live under `app/public/marketing/` — keep both in sync. Confirm with `grep -rl arborprd-westeu app/public/marketing` returning 0 after the run.)

**Step 5 — Search Console + analytics.** Add `joinarbor.com` as a **Domain property** (DNS TXT). Submit `sitemap.xml`. Confirm analytics events fire on the new host (coordinate with mk-p0-4 analytics wiring for event-firing host check; this item only verifies the host loads + fires, does not add events).

**Marketing loop note:** Once the domain is live, all share/referral/UTM links (mk-p0-2, mk-p0-3, mk-p0-5) build on `NEW_ORIGIN`. Publish the canonical base URL as a single constant those items import rather than re-hardcoding.

### Files to create / edit (exact repo-relative paths)
**Edit (Step 4, after HTTPS green):**
- `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-en.html` (canonical/OG/hreflang/x-default/JSON-LD)
- `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-he.html` (same; HE → `/il`)
- `PPPPtherapy-/PPPPtherapy-/app/scripts/enrich-marketing-seo.mjs` (`origin` const, line 5)
- `PPPPtherapy-/PPPPtherapy-/app/public/sitemap.xml` (all hosts + lastmod)
- `PPPPtherapy-/PPPPtherapy-/app/public/robots.txt` (Sitemap line)
- `PPPPtherapy-/PPPPtherapy-/app/public/llms.txt` (all absolute links)
- `PPPPtherapy-/PPPPtherapy-/app/public/marketing/*.html` (regenerated by enricher — do not hand-edit JSON-LD; let the script write)

**Edit (Step 1-2 tracking, immediately):**
- `PAI/projects/parenting-os-plugin/marketing/arbor-domain-setup-checklist.md` (record chosen domain + DNS records + verification status)

**Create:** none (no new source files; this is a config/asset switch).

**No change:** `PPPPtherapy-/PPPPtherapy-/firebase.json` (existing rewrites + headers already serve marketing static + SPA; custom domain is a console/DNS binding, not a config edit). `app/capacitor.config.ts` (native domain assoc is a later item).

### Shared-file conflict notes
Both landing files are conflict hotspots. Per the hotspot list: **`mk-landing-parity-rebuild` REWRITES `arbor-marketing-landing-page-en.html` wholesale (EN onto the HE design system) — it must run FIRST.** This item (mk-p0-1) then *patches the canonical URL into the rebuilt file*; do not run mk-p0-1's EN head edits against the old EN file or they will be clobbered by the rebuild.
- **`arbor-marketing-landing-page-en.html`** touched by: p3-ios-grade-audit, mk-p0-1, mk-p0-5, mk-landing-parity-rebuild, mk-p2-1. Order: parity-rebuild → mk-p0-1 (canonical) + mk-p0-5 (UTM/CTA) + mk-p2-1 (/nl) patch the rebuilt file → p3 polish last. mk-p0-1 only touches `<head>` meta/canonical/JSON-LD — disjoint from mk-p0-5's `<body>` CTA href edits, so they can land in either order *after* the rebuild, but coordinate the canonical/UTM base so links agree.
- **`arbor-marketing-landing-page-he.html`** touched by: p3-ios-grade-audit, mk-p0-1, mk-p0-5, mk-landing-parity-rebuild, mk-p1-4-aeo-seo-he. HE is the parity-rebuild reference build; mk-p0-1 patches its canonical to `/il`; mk-p1-4 builds SEO/AEO on the new domain — must land AFTER this item's domain switch.
- **No app `src/` shared files touched** — this item stays in `public/`, `scripts/`, and the `html/` prototypes, avoiding the `navigation.ts`/`ArborContext.tsx`/`index.css` merge magnets entirely.
- `enrich-marketing-seo.mjs` is owned solely by SEO items; mk-p1-4 also reads its output but only this item changes the `origin` const — land mk-p0-1 first, then mk-p1-4 consumes the new origin.

### Dependencies (other item ids that must land first)
- **`mk-landing-parity-rebuild`** — must rewrite the EN landing before mk-p0-1 patches its canonical (else clobbered). Hard ordering.
- **Guy/spend gate** (not an item id): Steps 1-2 (buy domain, add Firebase custom domain, verify HTTPS) require Guy's card + console access. Step 4 (canonical switch) is **blocked until Guy confirms HTTPS is green**.
- No code dependencies on app `src/`. This item unblocks: mk-p1-4 (AEO/SEO HE), mk-p0-3 (share-export URLs), mk-p0-5 (attribution/UTM base), mk-p2-1 (/nl), and all public share assets.

### Acceptance criteria (testable)
1. Chosen global domain purchased (auto-renew + WHOIS privacy on) and `arbor.co.il` registered; chosen domain recorded in `arbor-domain-setup-checklist.md` and MEMORY.
2. Firebase Console shows **Connected** + valid HTTPS for apex, `www`, and `arbor.co.il`. `curl -sI https://joinarbor.com/marketing/arbor-marketing-landing-page-en.html` returns `200` over TLS (no cert warning).
3. `/` serves EN landing; `/il` (or `arbor.co.il`) serves the HE RTL landing with `dir="rtl"` intact; `arborprd-westeu.web.app` still resolves (origin alive).
4. After Step 4 + redeploy: `grep -rl "arborprd-westeu" app/public/{sitemap.xml,robots.txt,llms.txt,marketing}` returns **zero** matches; same grep on the two `html/` source landings returns zero.
5. EN canonical = `https://joinarbor.com/`, HE canonical = `https://joinarbor.com/il`; `hreflang` pair + `x-default` consistent on both pages; JSON-LD `@id`s use the new host (validate one page through a structured-data linter / no parse errors).
6. New domain added as a **Domain property** in Google Search Console (DNS-verified); `sitemap.xml` submitted and accepted.
7. **Verified live on dev/prod host:** the EN + HE landings load over HTTPS on the real domain, View-Source shows the new canonical, and analytics fires a pageview on the new host (smoke via `app/scripts/live-smoke.mts` pointed at the new origin, or manual `curl` + browser check).

### Operating-rule checks
- **No dark patterns:** purely an addressing/hosting change; no manipulative copy, no forced friction. 301s (if used for `arbor.co.il → /il`) are transparent redirects, not cloaking.
- **Privacy / COPPA:** WHOIS privacy on; no child data involved; marketing pages remain non-account, no tracking added by this item (analytics already present). No PII in URLs.
- **Moat read/write:** N/A directly — but this item is the precondition for share/handoff assets that *do* surface the longitudinal-memory story ("tracking since…"); a clean branded domain makes those moat-bearing share links trustworthy.
- **Ships-visible:** the change is publicly observable — a real, sayable domain on the EN/HE landings with valid HTTPS, correct canonical, and a submitted sitemap. End-to-end operational, not a stub.
