# Arbor — Channels & Canonical Identity

**Single source of truth for the brand domain + owned channels.** Every OG tag, canonical URL, share deep-link, and CTA uses these exact values. Change them here and the marketing loop propagates. Owner: `arbor-marketing-lead`.

## Canonical domain
- **`https://arborparentingapp.com`** — the canonical host. Acquired 2026-06-21 (unblocks GOAL U1).
  - **Live-status (verified 2026-06-21):** resolves to a basic **GoDaddy website-builder page** headed *"Arbor — Parenting Made Simple"* with an email form. It's yours/Arbor-branded (not a squatter), but it's an **off-brand placeholder** — the *"Parenting Made Simple"* tagline is the generic framing [BRAND-STRATEGY.md](BRAND-STRATEGY.md) bans. **Action:** point DNS → Firebase Hosting to serve the real landing; kill the tagline; route/disable the GoDaddy form. No viral asset ships pointing here until it serves the real site.
  - ⚠️ **Confirm the TLD** if not `.com` — this is the only place to change it; the loop reads from here.
  - **Replaces** the old placeholders across the marketing surface: `arborprd-westeu.web.app` (Firebase default) and `arbor.family` / `arbor.co.il` (prior candidates). The AEO hub (`marketing/assets/arbor-is-this-normal-he.html`) and IL landing (`html/arbor-il.html`) still carry the old hosts — the loop's W0 sweep aligns them.
- **Canonical URL rule:** every page's `<link rel="canonical">`, `og:url`, hreflang `@id`/`url`, sitemap entries, and `llms.txt` point at `arborparentingapp.com`. HE pages at `/he/...`, EN at `/en/...`.
- **Deep-link / referral:** the loop payload resolves at `https://arborparentingapp.com/join?ref=<code>` (needs P0-2 resolver — still gated).
- **DNS/hosting wiring** (Firebase custom domain) + **prod deploy** remain Guy-gated (Level 3/4) — the domain is owned; pointing it live is the next manual step.

## Live marketing site (deployed 2026-06-22)
- **https://arbor-marketing-il.web.app** — the new landing pages are **LIVE** here (HE flagship at `/`, EN at `/en`, HE AEO hub at `/he/is-this-normal`). A **dedicated standalone Firebase Hosting site** (`arbor-marketing-il`, project `arborprd-westeu`), **fully isolated from the product app** — no app build, no `main`, no concurrent product WIP. Source + config: `PAI/projects/arbor/marketing/site/` (`firebase.json` with `"site":"arbor-marketing-il"`).
- **Redeploy (safe, repeatable):** `cd PAI/projects/arbor/marketing/site && firebase deploy --only hosting --project arborprd-westeu`. This is the correct pattern for **static landing pages** — distinct from the APP hosting (the app ships only via `main`/arbor-deploy.yml; never hand-deploy the app site).
- **To serve these at arborparentingapp.com:** Firebase Console → Hosting → site `arbor-marketing-il` → Add custom domain `arborparentingapp.com` (moves the brand domain off the app site onto the marketing site). Console step — Guy-gated.
- **Still pending:** the 3 OG share-card PNGs (`/brand/og-{he,en}-1200x630.png` + AEO hub card) for WhatsApp/social previews; native-HE human review before paid promotion.

## Owned channels
| Channel | Handle / URL | Status | Notes |
| :-- | :-- | :-- | :-- |
| Instagram | **@arborchilddevelopment** ([link](https://www.instagram.com/arborchilddevelopment/)) | ✅ created 2026-06-21 (unblocks U4) | **Primary** handle — wire into captions, creator brief, #הגיבורשלי attribution |
| Domain | arborparentingapp.com | ✅ owned | see above |
| TikTok | _to create_ | pending | IL-first; mirror IG content |
| YouTube | _to create_ | pending | manifesto + long-form |
| Facebook | _to create_ | pending | for the IL parent-group engine + Meta ads |

> Note: `arborparentingapp` may also be a secondary social handle — record it here if claimed. Primary IG remains @arborchilddevelopment.

## Identity usage rules
- All share CTAs and creator briefs name **@arborchilddevelopment** and link **arborparentingapp.com**.
- Hashtags: **#הגיבורשלי** (HE) / **#ArborHero** (EN) for the avatar challenge.
- The brand voice + the Arbor Bar still govern everything (see [BRAND-STRATEGY.md](BRAND-STRATEGY.md)).
