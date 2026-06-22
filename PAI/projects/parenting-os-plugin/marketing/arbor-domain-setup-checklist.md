# Arbor — Domain Buy + Firebase Hosting Setup (P0-1)

**Created:** 2026-06-17 · **Blocker for:** every public/share asset
**You do the steps with 💳 / account access; I prepped the rest.**

---

## Step 1 — Pick + buy the domain (💳, ~15 min)
Check availability in this order, buy the first clean one:
1. `joinarbor.com` *(preferred — verb-forward, brandable, says "join")*
2. `getarbor.com`
3. `helloarbor.com`
4. `arbor.family` *(great fit if the `.com`s are gone)*

Plus the Israel vanity: **`arbor.co.il`** (per existing domain memory).

Registrar: Cloudflare Registrar (at-cost, free DNS) or Namecheap. Turn on auto-renew + WHOIS privacy.

> Avoid: hyphens, "app/ai" suffixes, anything you can't say cleanly out loud on a Reel.

## Step 2 — Add as custom domain in Firebase Hosting (account access, ~10 min + propagation)
1. Firebase Console → Hosting → **Add custom domain** → enter the apex (`joinarbor.com`) and `www`.
2. Firebase shows **A / TXT (and/or CNAME)** records → add them at the registrar's DNS.
3. Wait for verification + auto SSL (minutes–hours). Confirm green "Connected" + HTTPS.
4. Point `arbor.co.il` at the same host; serve the **HE** landing on it (or 301 → primary `/il`).

## Step 3 — Routing
- `/` → global EN landing · `/il` → HE landing · `/nl` → (later).
- Keep `arborprd-westeu.web.app` alive as the **technical origin only**.

## Step 4 — DO NOT switch canonical yet (ordering matters)
Only **after** HTTPS is verified live, update in the Arbor app repo:
- `<link rel="canonical">` on all 19 marketing pages → new domain
- `sitemap.xml` (19 URLs), `robots.txt`, `llms.txt`, JSON-LD `url`/`@id` → new domain
- Re-run `app/scripts/enrich-marketing-seo.mjs`, redeploy, smoke-test `200`.

## Step 5 — Search Console + analytics (~15 min)
1. Add the new domain as a **Domain property** in Google Search Console (DNS TXT verify).
2. Submit `sitemap.xml`.
3. Confirm analytics events fire on the new host.

---

**When done, tell me** and I'll trigger the canonical-switch edits (Step 4) in the app repo and re-run the SEO enrichment.
