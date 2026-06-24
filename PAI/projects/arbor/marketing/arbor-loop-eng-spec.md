# Arbor — Viral Loop Engineering Spec (P0-2 / P0-3 / P0-4)

**Created:** 2026-06-17 · **For:** the Arbor build agent / eng (repo: `guyrubin/PPPPtherapy-`, app on `main`)
**Goal:** make the loop *real and measurable*. Until these ship, no paid euro spends.
**Constraints:** privacy-first (parent-owned data, non-diagnostic, AVG/GDPR), entitlements already off-by-default, local-first stores with Firestore swap-in seam.

---

## P0-4 — Analytics events (build FIRST; everything else needs it)
Wire a single event layer (Amplitude or GA4) with these events + props. Without this there is no loop to manage.

| Event | Key props |
|---|---|
| `install` / `app_open` | source, utm_*, referral_code |
| `profile_created` | child_count, band |
| `first_plan` | frame, latency_ms |
| `share_initiated` | artifact (avatar\|story\|answer_card\|growth_card), surface |
| `share_completed` | artifact, channel |
| `invite_sent` | channel |
| `invite_activated` | inviter_id, new_user_id |
| `trial_start` / `paid` | tier (plus\|family), source |

Global props on every event: `market` (il/nl/be/ie/uk), `source`, `referral_code`, `utm_*`. One funnel dashboard: install → profile_created → first_plan → share → invite_activated → paid, sliceable by market + source.

## P0-2 — Referral loop
- Generate a stable **referral code** per user; encode in deep links (`/?ref=CODE` → store through install via deferred deep-link / fingerprint fallback).
- On a new user's `profile_created` **and** `first_plan` (activation, not just install — prevents fraud/empty invites), credit the **inviter** a free **Plus month** and grant the **invitee** a perk (extra avatar style or 7-day Plus trial).
- Fulfilment via the existing entitlements system (off-by-default → grant). Server-side `invite_activated` attribution; cap rewards / dedupe by device+account to stop abuse.
- Surfaces: post-activation moment, settings, and baked into every share export (P0-3).

## P0-3 — One-tap branded Share export (highest leverage)
For all four artifacts, a single **Share** button that produces a branded, watermarked asset + deep link with the user's `referral_code`.

- **Avatar** → square + 9:16 image, Arbor wordmark + small "Made with Arbor" + deep link.
- **Personalized story** → cover image (9:16, Reel-ready) + link to read.
- **"Is this normal?" answer card** → render the Read / Risk / Do-tonight card as a clean branded image (redact child name by default — privacy).
- **Monthly growth card** → recap image from the child's record.
- Implementation: server-side or canvas render → PNG/Story-sized; aspect ratios `1:1` and `9:16`; pre-fill share-sheet caption from the copy pack; **share-to-unlock** hook (sharing avatar unlocks a second style).
- Privacy gate: never export raw child PII; stylized avatar is non-photoreal; default-redact names on answer/growth cards.

---

## Acceptance / exit gate
- Funnel dashboard shows all events end-to-end, sliced by market + source.
- At least the **avatar** artifact has working 1-tap branded 9:16 export with referral code in the link.
- Referral credits a real Plus month on invitee activation, attributed server-side, abuse-capped.

> Verify in-browser/app per the repo's standard (tsc + tests + live check), then report back so marketing turns on paid amplification.
