## mk-p2-3-paid-amplifier — Paid amplifier ON (EUR3k, UK/IE weighted)
**Aspects:** Marketing · **Surfaces/platforms:** landing:en · **Priority:** P2

> Build-ready spec. Source plan: `PAI/projects/parenting-os-plugin/marketing/arbor-viral-gtm-2026-H2.md` (§3, §6, §8, §9). Backlog row: P2-3. Loop eng spec: `PAI/projects/parenting-os-plugin/marketing/arbor-loop-eng-spec.md`.

---

### Problem / why

We have €3,000 of the €10k budget earmarked for paid amplification (GTM §6). The strategic rule (GTM §6, line 101) is **buy amplification of proven winners, never discovery of unknowns**. Today none of that is spendable: the loop is only half-instrumented (attribution + events shipped at commit `e09537a`; the referral *grant* P0-2 and branded share export P0-3 are still `⏳` per `EXECUTION-TRACKER.md` Milestone C), and no organic creative has cleared the bar yet.

This work item is the **operating procedure + go-live gate + landing-page UTM/attribution readiness** for turning paid on — not a campaign that runs blind. It exists to (a) make the spend gate enforceable, (b) ensure every paid click lands on a page that attributes correctly and message-matches the ad, and (c) weight spend to UK/IE late, where the loop is already validated (GTM §5, §9 Phase 3). The hard dependency is `mk-p1-6-loop-optimization`: **no paid euro until K≥0.4 is proven AND ≥1 share artifact is live.**

The only *code/asset* surface this item changes is **landing:en** — it must carry UTM passthrough into the existing first-touch attribution (`lib/attribution.ts`) and a real install CTA (today the EN final CTA is a dead `href="#" onclick="return false"`, en.html:286). Everything else is a marketing operating procedure that lives in the GTM doc + a new runbook.

---

### Scope across platform domains

- **Landing EN** (`PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-en.html`) — the paid destination. Changes: (1) every CTA points at the canonical install URL with UTM params preserved through to the app; (2) replace the dead final-CTA anchor; (3) ensure UTM query params survive the click into the app so `parseAttribution()` captures `utm_source/medium/campaign/content/term`. **No new tracking pixels** unless a privacy review clears them (see operating-rule checks). *This item does NOT rewrite the page* — `mk-landing-parity-rebuild` owns the wholesale rewrite; this item only patches CTA hrefs/UTM on whatever the rebuilt file is.
- **Web app** (read-only dependency, no edits here) — relies on the *already-shipped* `lib/attribution.ts` + `lib/loopEvents.ts` to slice paid traffic by `source`/`utm_*`/`market`. This item must NOT edit those files; it consumes the stable event contract (see conflict notes).
- **iOS / Android (Capacitor)** — out of scope for build changes. App-store paid (UAC/ASA) is `mk-p2-4-en-launch-appstore`'s territory; this item only covers web-landing paid amplification. Note the dependency so we don't double-count budget.
- **Landing HE (RTL)** — out of scope. Paid amplifier is EN/UK-IE weighted per the work item surface (`landing:en`). HE paid, if any, is an IL-phase decision, not this item.

---

### Marketing detail — the loop / instrumentation / asset (build-level)

**1. Spend gate (hard, enforced before any euro).** Codify in the runbook and in GTM §6. Paid is OFF until ALL true:
- `mk-p1-6-loop-optimization` reports **K ≥ 0.4** (GTM §8 floor) sliced from the funnel dashboard (install → profile_created → first_plan → invite_activated), AND
- **≥1 share artifact** has working 1-tap branded export with `referral_code` in the deep link (P0-3 exit gate — avatar at minimum), AND
- **≥3 proven winning organic creatives** identified (P1 exit gate). A "winner" = clears the organic engagement/share bar defined in `mk-p1-6` (record the exact numeric bar in the runbook; default proposal: share-rate ≥ 3% of reach OR save+share-rate top-quartile vs the account's own median, on ≥1,000 organic impressions).

If any condition fails, the runbook says STOP and route budget to creator seeding / contingency (GTM §6 buckets).

**2. Budget shape (€3,000).** Per GTM §6 line 96 ("weighted to UK/IE late"):
- Phase 2 (NL anchor, weeks 9–16): ≤ €600 — only to *retarget* and boost already-validated IL winners localized to NL; small, learning-only.
- Phase 3 (EN rollout BE/IE/UK, weeks 17–26): ~€2,400, **weighted to UK/IE**, concentrated on the single best Reel/hook + retargeting of landing visitors who didn't activate.
- Two-line allocation only: **~70% boost proven Reels** (cold prospecting on winners), **~30% retargeting** (landing-visit / install-no-activation audiences). No new top-of-funnel creative gets paid spend — discovery stays organic.

**3. Per-creative UTM contract (the instrumentation).** Every paid placement uses a deterministic UTM scheme that maps onto the shipped `Attribution` type (`lib/attribution.ts:16-27`):
- `utm_source` = platform (`meta` | `tiktok` | `youtube`)
- `utm_medium` = `paid_social` (cold) | `retargeting`
- `utm_campaign` = `{market}-{phase}-{objective}` e.g. `uk-p3-winners`, `ie-p3-retarget`
- `utm_content` = the creative id (must match the winner id logged by `mk-p1-6`), e.g. `2am-reel-03`
- `utm_term` = audience/placement label
- Destination URL carries the market path prefix so `detectMarket()` resolves correctly: e.g. `https://<canonical>/uk?utm_source=meta&utm_medium=paid_social&utm_campaign=uk-p3-winners&utm_content=2am-reel-03`. (`detectMarket` reads the first path segment — `/uk`, `/ie` — `attribution.ts:35-43`.)
- Because `lib/attribution.ts` is **first-touch**, the acquiring paid click wins attribution for the whole funnel; no extra app code needed. The runbook must state: never strip query params on the landing→app handoff.

**4. Kill/double rule (GTM §8 line 130, §10).** Monthly: any paid creative/campaign with blended CAC ≥ €4 OR not beating its organic-equivalent share/activation for 14 days gets cut; budget moves to the best performer. The leaky-funnel guard: if activation (install→profile+plan) drops below 35% for paid cohorts, **pause paid** — do not pour spend into a leaking funnel. Read these from the existing funnel dashboard sliced by `utm_*`/`source` (already supported — `loopEvents.ts` global props).

**5. Landing-page asset changes (the only code/file deliverable).**
- Replace the dead final CTA (`en.html:286` `<a class="btn btn-primary" href="#" onclick="return false">Start now — free</a>`) with a live anchor to the canonical install URL. Until the domain (P0-1 / `mk-p0-1-domain`) is verified, point at the current origin `https://arborprd-westeu.web.app/` (NOT the `/marketing/` path) and leave a `<!-- TODO mk-p0-1: swap to canonical domain -->` marker.
- All three primary CTAs (`en.html:147`, `:158`, `:286`) must use the SAME install URL and preserve inbound UTM params. Add a tiny inline script (no third-party dependency) that reads `window.location.search` and appends the existing UTM params to every `a.btn-primary[href]` on DOMContentLoaded, so an ad's UTMs flow ad → landing → app and into `parseAttribution()`. Keep it under ~15 lines, vanilla JS, no cookies, no external calls.
- Message-match: the boosted Reel's hook and the hero H1 must say the same thing (GTM §2 consumer promise / "The 2am Test" campaign). If a winning creative uses a specific hook, note in the runbook that the matching landing variant/H1 must echo it (handled via `mk-landing-parity-rebuild`, referenced not duplicated).

**6. Deliverable runbook (the durable artifact).** Create `marketing/arbor-paid-amplifier-runbook.md`: the gate checklist, budget allocation table, UTM contract table, kill/double thresholds, and a per-creative spend log table (creative id, platform, market, spend, installs, activations, CAC, decision). This is what an operator follows to turn paid on safely.

---

### Files to create / edit (exact repo-relative paths)

Create:
- `PAI/projects/parenting-os-plugin/marketing/arbor-paid-amplifier-runbook.md` — gate + budget + UTM contract + kill/double + spend-log template.

Edit:
- `PAI/projects/parenting-os-plugin/marketing/arbor-viral-gtm-2026-H2.md` — §6: add the explicit spend-gate preconditions + the 70/30 boost/retarget split + UK/IE phase weighting note pointing to the runbook. (This is the declared `sharedFiles` entry for this item.)
- `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-en.html` — replace dead final CTA (`:286`); unify CTA hrefs (`:147`, `:158`, `:286`) to the canonical install URL; add the ~15-line UTM-passthrough inline script.
- `PAI/projects/parenting-os-plugin/marketing/EXECUTION-TRACKER.md` — flip P2-3 status and link the runbook.

Read-only (do NOT edit — consume the contract): `PPPPtherapy-/PPPPtherapy-/app/src/lib/attribution.ts`, `PPPPtherapy-/PPPPtherapy-/app/src/lib/loopEvents.ts`, `PPPPtherapy-/PPPPtherapy-/app/src/lib/analytics.ts`.

---

### Shared-file conflict notes

- **`PAI/projects/parenting-os-plugin/marketing/arbor-viral-gtm-2026-H2.md`** — declared shared file for this item; not in the cross-item hotspot list (no other item edits it), so low collision risk. Append to §6 only; do not reorder existing sections.
- **`PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-en.html`** — HOT (hotspot list: `mk-landing-parity-rebuild`, `mk-p0-1-domain`, `mk-p0-5-attribution-utm`, `mk-p2-1-localize-nl`, `p3-ios-grade-audit`). Sequence per the hotspot note: `mk-landing-parity-rebuild` REWRITES the file first → then `mk-p0-1` (canonical URL) + `mk-p0-5` (UTM/CTA wiring) patch it → this item layers on top. **Critical overlap with `mk-p0-5-attribution-utm`**: that item owns the UTM/CTA wiring. To avoid clobber, **this item must NOT independently rebuild the UTM passthrough** — if `mk-p0-5` already added it, this item only verifies CTA hrefs point at the canonical install URL and adds the paid-specific destination/market-path guidance to the runbook. Land `mk-p0-5` first; treat the inline-script edit here as a fallback only if `mk-p0-5` hasn't shipped it. Coordinate the single canonical URL with `mk-p0-1-domain`.
- **`lib/attribution.ts` / `lib/loopEvents.ts` / `lib/analytics.ts`** — these are in hotspots (touched by `mk-p0-4`, `mk-p1-6`, etc.). This item is **read-only** on all three; `mk-p0-4-analytics-wiring` wires/owns the event names first, everyone else (including this item's UTM scheme) consumes the stable names. Do not rename events.

---

### Dependencies (other item ids that must land first)

- `mk-p1-6-loop-optimization` — **hard gate** (declared). Must report K≥0.4, activation≥35%, and ≥3 winning creatives before any spend.
- `mk-p0-3-share-export` — ≥1 branded share artifact live (loop must work, else paid amplifies a leaking funnel).
- `mk-p0-2-referral-loop` — referral grant live (the loop's compounding mechanic).
- `mk-p0-4-analytics-wiring` — funnel dashboard + stable event names (already ✅ shipped at `e09537a`, but UTM slicing depends on it).
- `mk-p0-5-attribution-utm` — owns the landing UTM/CTA wiring; land before this item's landing edits to avoid clobber.
- `mk-p0-1-domain` — canonical install URL; if not yet live, this item points at the `web.app` origin with a TODO marker.
- Soft-coordinate-after: `mk-landing-parity-rebuild` (rebuilds the EN file).

---

### Acceptance criteria (testable)

1. `arbor-paid-amplifier-runbook.md` exists with: the 3-condition spend gate, the €3k allocation table (≤€600 NL / ~€2.4k UK-IE-weighted), the UTM contract table mapping to the `Attribution` fields, the kill/double thresholds (CAC ≥ €4 / activation < 35% → pause), and an empty per-creative spend-log table.
2. GTM `§6` now states the spend gate preconditions explicitly and the 70/30 boost/retarget split, and references the runbook.
3. In `arbor-marketing-landing-page-en.html`: no CTA uses `href="#"`/`onclick="return false"`; all three `.btn-primary` CTAs resolve to the same install URL; the UTM-passthrough script appends inbound `utm_*` params to those hrefs (verified by loading the page with `?utm_source=meta&utm_campaign=uk-p3-winners` and confirming the primary CTA href carries them).
4. A simulated paid click `https://<canonical>/uk?utm_source=meta&utm_medium=paid_social&utm_campaign=uk-p3-winners&utm_content=2am-reel-03` resolves `detectMarket()→"uk"` and `parseAttribution()` returns all five `utm_*` fields (verify against `attribution.ts` parse, e.g. a unit assertion or console check).
5. **Verified live on dev server:** the EN landing renders with the UTM params reflected in the CTA href in the browser (DevTools: inspect the anchor `href` after load); no console errors; no new third-party network requests added (Network tab shows only fonts + brand image, matching the privacy stance).
6. EXECUTION-TRACKER P2-3 row updated with status + runbook link.

---

### Operating-rule checks

- **No dark patterns:** the spend gate explicitly forbids amplifying an unproven/leaking funnel; we never buy installs we can't retain (GTM §10 "retention gate before paid"). No fake urgency/scarcity in boosted creative — message-match to the calm, non-fear-selling brand (GTM §2). Referral rewards already pay before being promised (`EXECUTION-TRACKER` Milestone B note); paid creative must not promise rewards that aren't live.
- **Privacy / COPPA-2026 (AVG/GDPR):** the landing UTM-passthrough is **first-party only** — vanilla JS reading `location.search`, no cookies, no third-party pixels. If Meta/TikTok pixels are later wanted for retargeting, that is a separate gated decision requiring a consent banner + privacy-policy update + explicit approval — flagged in the runbook, NOT added here. Child PII never enters UTM/attribution (codes/utm only; matches `attribution.ts` which captures no PII).
- **Moat read/write:** paid amplifies the share artifacts that *expose* the memory moat (avatar / growth card / answer card per GTM §3a); attribution writes `source`/`utm_*` onto the funnel so we learn which channel produces *retained* (moat-building) families, not vanity installs. No new moat reads/writes in this item — it routes traffic into the existing loop.
- **Ships-visible:** the deliverable is operator-visible (runbook + GTM update an operator follows) and user-visible (live, working CTAs on the EN landing replacing a dead anchor) — verifiable on the dev server.
