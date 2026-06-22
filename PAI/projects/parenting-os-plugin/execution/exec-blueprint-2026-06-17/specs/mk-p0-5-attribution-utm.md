## mk-p0-5-attribution-utm — Attribution + UTM scheme + dashboard
**Aspects:** Marketing · **Surfaces/platforms:** landing:en, landing:he, app:shell · **Priority:** P0

### Problem / why
The in-app attribution capture is **done and correct**: `lib/attribution.ts` already parses `?ref=` / `utm_source` / `utm_medium` / `utm_campaign` / `utm_content` / `utm_term` from `location.search`, derives `source` and `market`, persists FIRST-TOUCH to `localStorage["arbor.attribution"]`, and `main.tsx:19-21` wires it onto every analytics event via `setGlobalProps(() => attributionProps(attribution))`. So once a visitor lands on the app origin with UTM params, the whole funnel is sliceable by channel.

The gap is **the handoff into the app**:
1. **The funnel never starts.** The marketing landing pages (`html/arbor-marketing-landing-page-en.html`, `…-he.html`) carry **no UTM and no `?ref=` capture**, and their CTAs do not point at the app. Most CTAs link to the in-page anchor `#join` (en:147, en:158, he:997, he:1012, he:1506, he:1517, he:1528), and the primary closing CTA is **literally dead**: `href="#" onclick="return false"` (en:286, he:1543). A visitor who clicks "Start now — free" goes nowhere — there is no link to `https://arborprd-westeu.web.app`, so `attribution.ts` never runs on a real acquisition visit. Every install today resolves to `source:"direct"`.
2. **No UTM scheme.** There is no documented, enforced convention for tagging the outbound links the GTM plan generates (creator links, the 2 AM-test campaign, paid, PR). Without one, `utm_*` values arrive inconsistent (`Facebook` vs `facebook` vs `fb`) and the dashboard can't aggregate.
3. **No dashboard.** Events land in Firestore `users/{uid}/events` with attribution props attached (analytics.ts:38), but there is no read surface to answer "which channel/market drove installs → activation → paid."

This item: (a) wire the landing CTAs to a single tagged app-handoff that preserves UTM + ref + market; (b) lock a UTM naming scheme as the source of truth for all outbound links; (c) ship an internal attribution dashboard view in the app shell.

### Scope across platform domains
- **Landing EN** (`html/arbor-marketing-landing-page-en.html`): replace every dead/anchor primary CTA with a real link to the app origin that **forwards** the page's own incoming UTM/ref query string; tag the landing's own default UTM; add a lightweight client capture so a `?ref=`/`utm_*` that hits the landing first is carried through to the app. Fix the dead `#` CTA.
- **Landing HE (RTL)** (`html/arbor-marketing-landing-page-he.html`): same as EN, RTL-safe (no layout change — CTAs are text links, no new geometry). Hebrew CTA strings unchanged; only `href` + a small script change.
- **app:shell** (`PPPPtherapy-/PPPPtherapy-/app`): add a read-only **Attribution dashboard** tab (internal/admin-gated) that queries the signed-in operator's own event stream and renders install → activation → paid counts sliced by `source` / `market` / `utm_campaign`. No change to `attribution.ts` capture logic itself beyond a documented `UTM_KEYS` export reused by the dashboard. iOS/Android (Capacitor) inherit the web app unchanged — the dashboard renders inside the existing shell with no native-specific work.

### IA / UX / Copy / Marketing detail

#### A. UTM scheme (source of truth — document inside this spec + the marketing backlog)
Lowercase, snake_case, ASCII only. Enforced for every outbound link the GTM plan builds.

| Param | Allowed values (canonical) | Notes |
| :-- | :-- | :-- |
| `utm_source` | `instagram` · `tiktok` · `youtube` · `facebook` · `whatsapp` · `telegram` · `creator` · `pr` · `newsletter` · `appstore` · `playstore` · `qr` | the platform/property |
| `utm_medium` | `social` · `paid_social` · `influencer` · `referral` · `email` · `organic` · `press` · `qr` | the channel class |
| `utm_campaign` | `2am_test` · `avatar_challenge` · `launch_il` · `launch_en` · `evergreen` | matches campaign names in `arbor-launch-campaign-the-2am-test.md` / GTM |
| `utm_content` | freeform slug, snake_case (e.g. `hero_video_a`, `bio_link`) | creative/placement variant for A/B |
| `utm_term` | optional — paid keyword | |
| `ref` | referral code (handled by `mk-p0-2`) | parsed by `attribution.ts` as `referralCode`; `source` becomes `"referral"` |
| `market` (path) | `/il` `/nl` `/be` `/ie` `/uk` prefix or lang fallback | `detectMarket()` already handles this; UTM does NOT carry market |

Market is **not** a UTM param — `attribution.ts:detectMarket()` already derives it from the path prefix or UI language. The landing pages live under `/marketing/...` (no market prefix), so landing visits resolve market via `<html lang>` (`en`→`intl`, `he`→`il`). Outbound app links from the landing should therefore carry market via the app's own routing, not UTM.

Canonical example link (Instagram bio, IL launch):
`https://arborprd-westeu.web.app/?utm_source=instagram&utm_medium=social&utm_campaign=launch_il&utm_content=bio_link`

#### B. Landing CTA → app handoff (EN + HE)
Two behaviors, one tiny inline script per page:

1. **Forward incoming attribution.** When a tagged link lands on the marketing page (e.g. a creator links to the landing, not the app), capture `location.search` and append it to the app handoff so it is not lost on the hop landing→app. Also persist to a cookie/localStorage as a backstop (the app reads its own `location.search`, so query-forward is the primary path; storage is belt-and-braces for cases where the user navigates the landing before clicking out).
2. **Tag the landing's own default UTM** so a click that arrived *untagged* (organic to the landing) still attributes to the landing itself: default `utm_source=landing&utm_medium=organic&utm_campaign=evergreen`, but **incoming params always win** (first-touch parity with `attribution.ts`).

Define the app target once:
```js
var APP_URL = "https://arborprd-westeu.web.app/";
```
Build the handoff href at runtime so we never hardcode a stale query:
```js
// Append landing's incoming UTM/ref to the app URL; incoming params win over defaults.
function appHandoffHref(){
  var incoming = new URLSearchParams(location.search);
  var out = new URLSearchParams({utm_source:"landing", utm_medium:"organic", utm_campaign:"evergreen"});
  incoming.forEach(function(v,k){ if(/^utm_|^ref$|^referral$/.test(k)) out.set(k,v); }); // incoming overrides defaults
  return APP_URL + "?" + out.toString();
}
```
Apply to all CTAs marked `data-cta="app"` (we add this attribute to the real conversion CTAs only — in-page section jumps like "See what Arbor does" stay as `#anchor`):
```js
document.querySelectorAll('a[data-cta="app"]').forEach(function(a){
  a.setAttribute("href", appHandoffHref());
  a.setAttribute("rel","noopener");
  a.addEventListener("click", function(){
    try{ sessionStorage.setItem("arbor.landing_click", new Date().toISOString()); }catch(e){}
  });
});
```
**Important interaction with the existing smooth-scroll script** (en:328-332, he equivalent): it binds `click` on `a[href^="#"]` and calls `e.preventDefault()`. The dead CTAs currently match that selector (`href="#"`). After we change them to absolute `https://…` hrefs they will **no longer match** `a[href^="#"]`, so the smooth-scroll handler will not intercept them — the navigation proceeds normally. The conversion CTAs that today point at `#join` must be re-pointed to `data-cta="app"` real links (they are conversion CTAs, not section jumps), removing them from the smooth-scroll selector too. Verify no CTA we want to convert still starts with `#`.

CTAs to convert to `data-cta="app"` real app links:
- **EN:** lines 147 (nav "Start now — free"), 158 (hero "Start now — free"), 286 (dead closing CTA — the critical fix).
- **HE:** lines 997 (nav "להצטרפות לבטא"), 1012 (hero "להתחיל עכשיו — חינם"), 1506/1517/1528 (pricing tier CTAs), 1543 (dead closing CTA — the critical fix).
- Leave as `#anchor` (in-page jumps, NOT conversions): "See what Arbor does"/"מה Arbor עושה" (en:159, he:1015), and section nav links.

Copy: **no string changes** — CTA labels stay exactly as written ("Start now — free" / "להתחיל עכשיו — חינם"). This is a destination + instrumentation change only.

A11y / states: links remain plain `<a>` with visible text (no JS-only buttons), so keyboard + screen-reader behavior is unchanged; if JS fails, the href is set server-side to the bare `APP_URL` as a static fallback in the markup (`href="https://arborprd-westeu.web.app/"`) so the CTA is **never dead even without JS** — the script only upgrades it with forwarded params. RTL: text links, no geometry; nothing to mirror. `prefers-reduced-motion`: untouched (no animation added).

#### C. App-side: minimal `UTM_KEYS` export (no capture change)
Add to `lib/attribution.ts` a single exported constant so the dashboard and any future query share one definition (DRY):
```ts
export const UTM_KEYS = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"] as const;
```
Do **not** alter `parseAttribution` / `captureAttribution` / `attributionProps` — they are already correct and unit-tested. This is purely additive.

#### D. Attribution dashboard (app:shell, internal)
A read-only tab that reads the operator's own `users/{uid}/events` collection (same path analytics.ts writes to) and aggregates client-side:
- **Funnel by channel:** group events by `props.source` (and a `utm_campaign` sub-filter) → count distinct of `install`, `first_plan` (activation), `paid`. Show conversion rates install→activation, activation→paid.
- **By market:** group by `props.market` (`il`/`nl`/`intl`/…).
- **States:** default (table populated); **loading** (skeleton rows while Firestore query resolves); **empty** ("No events yet — share a tagged link to start measuring." with the canonical UTM example); **error** ("Couldn't load analytics" + retry). 
- **Gating:** render only for an allowlisted operator uid (reuse the existing entitlement/admin check pattern; do **not** invent a new auth path). Not in the parent-facing nav.
- **Touch targets:** ≥44px rows/controls. **a11y:** the funnel table is a real `<table>` with `<th scope>`; AA contrast via existing tokens (`kit.tsx`); keyboard-navigable filter `<select>`s; `prefers-reduced-motion` respected (no count-up animation, or gate it behind the media query). **RTL:** numbers LTR inside an RTL table when HE is active.

### Files to create / edit (exact repo-relative paths)
**Edit:**
- `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-en.html` — add `data-cta="app"` + static `href="https://arborprd-westeu.web.app/"` to the 3 conversion CTAs (lines ~147, ~158, ~286; 286 removes `onclick="return false"`); add the `appHandoffHref()` + binding script next to the existing smooth-scroll IIFE.
- `PAI/projects/parenting-os-plugin/html/arbor-marketing-landing-page-he.html` — same for the HE conversion CTAs (~997, ~1012, ~1506, ~1517, ~1528, ~1543; 1543 removes `onclick="return false"`); add the same script (RTL-safe, no layout change).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/attribution.ts` — add `export const UTM_KEYS` only (additive; no logic change).
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.ts` — register the dashboard tab (append a leaf under an internal/Care-adjacent or settings section; do not reorder existing entries).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/Shell.tsx` — register the tab in `tabRegistry` (append only).
- `PAI/projects/parenting-os-plugin/marketing/arbor-launch-copy-pack.md` (or `arbor-marketing-backlog.md`) — paste the UTM scheme table as the canonical reference for link-builders.

**Create:**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/AttributionTab.tsx` — the dashboard view (Firestore read + client aggregation + table; uses `UTM_KEYS`, `kit.tsx` primitives).

### Shared-file conflict notes
- **`html/arbor-marketing-landing-page-en.html`** (hotspot: `mk-landing-parity-rebuild` REWRITES this file wholesale, then `mk-p0-1-domain` + `mk-p0-5` + `mk-p2-1-localize-nl` patch it). **Sequence: land `mk-landing-parity-rebuild` FIRST**, then apply this item's CTA/script edits to the rebuilt file. Coordinate the canonical URL with `mk-p0-1-domain` — if `mk-p0-1` sets a custom domain, update `APP_URL` to match (use the production app origin, not the marketing path). Confine my edits to (a) the conversion CTAs and (b) one appended `<script>` block — do not touch hero/section markup the rebuild owns.
- **`html/arbor-marketing-landing-page-he.html`** — same ordering; HE is the parity reference build, so it changes least. Append-only script, CTA href/attr edits only.
- **`lib/attribution.ts`** (touchedBy `mk-p0-2-referral-loop`, `mk-p0-5`). `mk-p0-2` owns the `ref`/referral capture + persistence; this item only **appends** the `UTM_KEYS` export and reads existing functions. No overlap if `mk-p0-2` lands first; if parallel, merge is trivial (additive export). Do **not** modify `parseAttribution`/`captureAttribution`.
- **`navigation.ts` / `Shell.tsx`** (heavy IA hotspots). Append the dashboard leaf/registry entry **after** the IA reorg train (`b1/b2/b3` → `ia-b1`/`ia-b6` → `b5`) and `surf-app-shell` have settled, to avoid clobbering `SECTIONS`/`tabRegistry`. The dashboard is internal/admin and order-insensitive, so it can land last with a single appended entry.
- **`loopEvents.ts`** is consumed read-only here (dashboard reads `install`/`first_plan`/`paid` names). Per hotspot rule, **do not rename events**; `mk-p0-4` wires them first — this item depends on that.

### Dependencies
- **`mk-p0-4-analytics-wiring`** (hard) — must land first: it wires the loop event exports and the global-props/attribution plumbing the dashboard reads. Event names must be stable before the dashboard queries them.
- **`mk-landing-parity-rebuild`** (ordering) — rebuilds the EN landing; apply CTA edits to the rebuilt file.
- **`mk-p0-1-domain`** (soft) — if it changes the canonical app origin, `APP_URL` must match it.
- **`mk-p0-2-referral-loop`** (soft) — owns `ref` capture in `attribution.ts`; coordinate the additive `UTM_KEYS` merge.

### Acceptance criteria (testable)
1. **No dead CTA:** `grep -n 'onclick="return false"' html/arbor-marketing-landing-page-en.html` and `…-he.html` return **zero matches on conversion CTAs**; the former dead CTAs now carry `href="https://arborprd-westeu.web.app/"` and `data-cta="app"`.
2. **Handoff forwards UTM:** loading `…-en.html?utm_source=instagram&utm_medium=social&utm_campaign=launch_il`, the rendered href of each `data-cta="app"` link contains `utm_source=instagram&utm_medium=social&utm_campaign=launch_il` (incoming wins over the `landing/organic/evergreen` defaults). With **no** incoming params, the href carries the landing defaults.
3. **No-JS fallback:** with JavaScript disabled, every `data-cta="app"` CTA still navigates to `https://arborprd-westeu.web.app/` (static href present in markup).
4. **Smooth-scroll not broken:** in-page `#anchor` CTAs (e.g. "See what Arbor does") still smooth-scroll; `data-cta="app"` links are NOT intercepted by the scroll handler (verified live: clicking a converted CTA navigates to the app origin with the query string intact).
5. **Capture round-trip:** landing → app handoff results in `localStorage["arbor.attribution"]` on the app origin showing the forwarded `utm_*` (and `source` = the `utm_source`), confirming `attribution.ts` consumed the forwarded params.
6. **`UTM_KEYS` exported** and imported by `AttributionTab`; `tsc` + existing test suite green (incl. `attribution.test.ts` unchanged-passing).
7. **Dashboard live on dev server:** an allowlisted operator sees the Attribution tab; it renders install/activation/paid counts grouped by `source` and `market` from real `users/{uid}/events` data; empty state shows for a fresh account; non-allowlisted users do **not** see the tab. Verified on the dev server (`npm run dev` in `PPPPtherapy-/PPPPtherapy-/app`).
8. **UTM scheme documented** in the marketing copy/backlog doc as the single source of truth.

### Operating-rule checks
- **No dark patterns:** CTAs keep their honest labels; we only fix a broken link and instrument the click. No fake scarcity added, no consent dodging. UTM tagging is industry-standard first-party attribution, not cross-site tracking.
- **Privacy / COPPA-2026:** attribution is first-party only (already the stance in `attribution.ts` / `analytics.ts` — no third-party scripts, no PII in UTM, events scoped to `users/{uid}`). The dashboard reads only the operator's own event collection; no child data, no cross-user reads. UTM values are campaign metadata, never personal identifiers.
- **Moat read/write:** the dashboard **reads** the longitudinal event stream (the memory moat's growth signal) to make acquisition→activation legible; the landing handoff **writes** first-touch channel into the per-family attribution record that every future event inherits — i.e. it seeds the moat with where each family came from.
- **Ships-visible:** the user-visible win is the closing CTA finally works (today it goes nowhere) and clicks land on the live app with channel attribution; the operator-visible win is a working funnel dashboard. Both verifiable on the dev server / live landing.
