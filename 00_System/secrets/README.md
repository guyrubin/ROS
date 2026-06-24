# ROS Credential Store (semi-sensitive, non-money)

**Created:** 2026-06-22 · **Owner:** CoS · **This README is the ONLY tracked file in this folder.**

The env-style store for **semi-sensitive, non-money credentials** an agent needs to do real work (DNS, tooling, connector API keys/tokens). Values live in **gitignored** `*.env` files here; this README holds the **policy + a non-secret registry** (names + use, never values).

## What goes here ✅ (semi-sensitive, NOT money-related)
API keys / tokens for: DNS & domains (GoDaddy), tooling, SEO/analytics read keys, connector tokens, webhook *signing* secrets that aren't payment, etc. — anything where leakage is a nuisance, not a financial loss.

## What NEVER goes here ❌ (money / financial / high-sensitivity)
- Payment / billing keys — Stripe, RevenueCat, the billing webhook auth secret
- Bank / card / account numbers, government IDs, passwords
- Anything whose compromise moves money or exposes a person

→ **Money/financial + production app secrets belong in GCP Secret Manager** (where Arbor's `arbor-billing-*` / `arbor-rc-webhook-auth` / `GEMINI` keys already live), never in plaintext here. This split is the rule Guy set (2026-06-22): "store everything that is **not** money-related."

## Files
- **`keys.env`** — the key=value store (gitignored). Load: `set -a; source 00_System/secrets/keys.env; set +a`
- `.gitignore` guarantees `/00_System/secrets/*` is ignored **except** this README. Verify any new file is ignored (`git check-ignore <file>`) before writing a secret.

## Registry (non-secret — names + use only)
| Var | Use | Added |
| :-- | :-- | :-- |
| `GODADDY_API_KEY` / `GODADDY_API_SECRET` | GoDaddy Domains API — DNS records for `arborparentingapp.com` + future domains (base `https://api.godaddy.com/v1/domains/{domain}/records`, header `Authorization: sso-key {key}:{secret}`) | 2026-06-22 |

## Rules
- **Never commit a value.** Only this README is tracked.
- **Never echo a secret** to the terminal/transcript; use it inline (`source` + `$VAR`) and don't print it.
- **Money-related → GCP Secret Manager**, not here.
- **Rotate on exposure.** A key pasted into chat is in the transcript → rotate it, then update `keys.env`.
- Referenced by `/00_System/connectors.md` (which points here, without values).
