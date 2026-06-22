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
