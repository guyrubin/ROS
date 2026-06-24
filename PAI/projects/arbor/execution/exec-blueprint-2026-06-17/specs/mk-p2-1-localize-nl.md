## mk-p2-1-localize-nl — Localize top-5 winners -> NL (+ landing /nl)
**Aspects:** Marketing, Copy · **Surfaces/platforms:** app:shell, landing:en · **Priority:** P2

### Problem / why
Arbor's GTM is Israel-first with a 5-country rollout (Netherlands is country #2 per the Viral GTM plan). Today the product ships exactly two locales: `UiLang = "en" | "he"` with a 469-key `en` dict and a 490-key `he` dict in `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` (lines 14–510 and 524–1013). There is **no Dutch (`nl`)** anywhere — not in the app shell and not on the marketing landing pages, which only carry `hreflang` for `he`/`en`/`x-default`. To run paid + organic acquisition into NL, two assets must exist:
1. A complete `nl` UI dictionary so the app shell renders in Dutch when a NL visitor lands.
2. A Dutch landing page (`/nl`) so paid/organic traffic has a native-language conversion surface with correct `hreflang` reciprocity (avoids Google "wrong language" suppression and lifts CVR for non-English-fluent Dutch parents).

This is the **localize "top-5 winners"** item: rather than translating the full 469 keys blind, we localize the 5 highest-traffic surfaces (the shell nav + Today + Ask + onboarding + paywall/settings copy) to native Dutch quality first, then backfill the long tail under English fallback (which already works via `translate()`'s `?? DICTS.en[key]` chain at i18n.ts:1018).

### Scope across platform domains
- **Web (app shell):** Add `"nl"` to the `UiLang` union and a `nl: Dict` to `DICTS` in `i18n.ts`. Add a NL option to the language switcher. Because `translate()` falls back to English per-key, a partial `nl` dict is safe to ship — untranslated keys render English, never a raw key. Prioritize the top-5-winner key namespaces for native Dutch; leave the rest to fallback for a follow-up.
- **iOS / Android (Capacitor):** No native changes. Both shells load the same React bundle and the same `i18n.ts`; NL "just works" once the dict + switcher ship. Verify the language toggle is reachable in the Capacitor webview (Settings modal). No `Info.plist` / `strings.xml` localization needed — Arbor is in-app-localized, not OS-localized.
- **Landing EN:** This item does **not** rewrite the EN landing. It (a) adds a reciprocal `hreflang="nl"` `<link>` to the EN landing `<head>` pointing at the new `/nl` file, and (b) the new NL landing is built as a translation of the EN landing's post-parity structure. The EN landing is the structural source for the NL page.
- **Landing HE:** Add the reciprocal `hreflang="nl"` link to the HE landing `<head>` too (all language variants must list all alternates for valid hreflang clusters).

### IA / UX / Copy / Marketing detail

#### A. App `nl` dictionary (Copy)
`i18n.ts` structure (verified): `export type UiLang = "en" | "he"` (line 10); `const en: Dict` / `const he: Dict`; `const DICTS: Record<UiLang, Dict> = { en, he }` (line 1015); `translate(lang, key, vars)` does `DICTS[lang][key] ?? DICTS.en[key] ?? key` (line 1018) and interpolates `{var}` tokens.

**Edits:**
1. Line 10: `export type UiLang = "en" | "he" | "nl";`
2. Insert a `const nl: Dict = { … }` block immediately **after** the `he` block closes (after line 1013, before `const DICTS` at 1015).
3. Line 1015: `const DICTS: Record<UiLang, Dict> = { en, he, nl };`

**Top-5 winner key namespaces to fully translate to native Dutch** (everything else inherits EN fallback for now — acceptable, documented as the long-tail backfill):
1. **Shell nav + mobile short labels** — `nav.*` (lines 16–72): `nav.tagline`, `nav.today`, `nav.ask`, `nav.child`, `nav.grow`, `nav.care`, `nav.academy`, `nav.settings`, `nav.signout`, all `nav.tab.*` and `nav.short.*`. This is the chrome a NL user sees on every screen.
2. **Today / Overview** — `rhythm.*`, `ov.*` (e.g. `ov.track.title`, `ov.safety.*`, `ov.dailyTools`). The landing tab.
3. **Ask Arbor** — `coach.*` / Ask entry copy (the primary engagement surface).
4. **Onboarding** — `ob.*` (lines ~349–356 and surrounding), including the `ob.lang.*` set; add `"ob.lang.dutch": "Nederlands"` to `en`, `he`, **and** `nl` (the at-home-languages picker should now offer Dutch).
5. **Settings + paywall/AI-language** — `set.*`, `top.language`, and any `pay.*`/`plan.*` keys (these gate revenue; Dutch parents must understand the upgrade ask).

**Dutch copy rules (apply the rubin-os:copywriter / marketing:draft-content discipline):**
- Register: warm-professional, second-person plural-neutral. Use **`je`/`jouw`** (informal "you"), not `u` — Arbor's voice is calm-premium-but-human, and modern Dutch consumer/parenting brands (and the existing EN/HE voice) skew informal. Be consistent.
- Keep `{name}`, `{n}`, and all `{var}` tokens **verbatim** — do not translate or reorder the braces. Dutch word order may require moving the token within the sentence; that's fine as long as the literal `{token}` survives.
- Do not translate the product name "Arbor". "Ask Arbor" → "Vraag het Arbor". "Arbor Academy" → "Arbor Academy" (keep).
- Sample anchor strings (native, not literal):
  - `nav.today`: "Vandaag" · `nav.ask`: "Vraag het Arbor" · `nav.child`: "Mijn kind" · `nav.grow`: "Groeien" · `nav.care`: "Zorgnetwerk" · `nav.settings`: "Instellingen" · `nav.signout`: "Uitloggen"
  - `nav.tab.timeline`: "Verhaal" · `nav.tab.development`: "Ontwikkeling" · `nav.tab.consult`: "Overleg"
  - `rhythm.eyebrow`: "Het ritme van vandaag" · `rhythm.title`: "Hoe de dag van {name} meestal verloopt"
  - `ov.track.title`: "Ligt {name} op koers?" · `ov.safety.cta`: "Een professional inschakelen"
  - `ob.lang.dutch`: "Nederlands"
- A native Dutch review is required before wide NL release (mirror the existing i18n.ts header note for `he`); ship behind the same beta caveat.

#### B. Language switcher (UI/UX)
The only language control found is the **AI-language** toggle in `SettingsModal.tsx:151–160`, hardcoded as `[["en","EN"],["he","עב"]]`, calling `setAiLang(k)`. There is no UI-language switcher surfaced today (UI lang is read from `localStorage["arbor.uiLang"]`, default `"en"`, per `LanguageContext.tsx:23–32`).

- Add `"nl"` to that toggle as a third pill: `[["en","EN"],["he","עב"],["nl","NL"]]`. Keep the segmented-control styling already in place (active = `--arbor-clay` bg / `#fff`; touch target: the existing `px-3 py-1` pills are ~32px tall — bump to `min-h-[44px]` row hit area for AA touch compliance on mobile, or wrap in a 44px row).
- The cleaner fix (recommended): this control currently only sets **AI** language. Surface a **UI-language** row too (calls `setUiLang(k)` from `useLanguage()`, which also syncs AI lang per `LanguageContext.tsx:53`). Add a sibling `Row` using `t("set.uiLang.title")` / `t("set.uiLang.sub")` (new keys, add to all three dicts) with the `en/he/nl` segmented control bound to `setUiLang`. This makes NL actually selectable in-product, not just AI-output language.
- a11y: each pill keeps `aria-pressed` (the AI toggle lacks it — add `aria-pressed={aiLang === k}` while editing). Keyboard: pills are `<button>`, already focusable; ensure visible focus ring (`--arbor-clay` outline). `prefers-reduced-motion`: the `transition` class is opacity/color only, safe. No RTL concern for `nl` (LTR); `LanguageContext.tsx:46` sets `dir = uiLang === "he" ? "rtl" : "ltr"` — `nl` correctly resolves to `ltr`.

#### C. NL landing page (`/nl`) (Marketing)
- **Source:** Build `arbor-marketing-landing-page-nl.html` as a Dutch translation of the **rebuilt** EN landing (post `mk-landing-parity-rebuild`, which rewrites the EN file onto the HE design system — see dependency). Do not branch from the current pre-parity EN file.
- `<html lang="nl" data-theme="light">`, `dir` omitted (LTR). `<title>`: "Arbor — een besturingssysteem voor de ontwikkeling van je kind". `<meta name="description">`: Dutch translation of the EN description.
- **hreflang cluster (all three pages must list all four):** add to EN, HE, **and** NL heads:
  - `<link rel="alternate" hreflang="nl" href="https://arborprd-westeu.web.app/marketing/arbor-marketing-landing-page-nl.html" />`
  - keep existing `he`, `en`, and `x-default` links (currently EN head lines 10–12, HE head lines 10–12).
  - NL head also carries the `he`+`en`+`x-default` links, plus `<link rel="canonical">` pointing at its own NL URL.
- Translate all body copy, OG tags (`og:title`, `og:description`, `og:url` → NL URL), JSON-LD `name`/`description`. Keep brand mark image and `og:image`.
- **CTA / loop:** preserve whatever UTM/attribution wiring `mk-p0-5` lands on the rebuilt EN page; carry the same query-param scheme into NL CTAs so attribution distinguishes NL traffic (e.g. `?utm_source=...&utm_content=nl_hero`). Do not invent a new scheme — reuse the rebuilt page's links with locale annotation.
- Visible language switcher on all three landing pages: a small EN | HE | NL link group in the header/footer pointing at the sibling files (matches the hreflang set, gives humans the same choice crawlers get).

### Files to create / edit (exact repo-relative paths)
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — extend `UiLang`, add `nl` dict (top-5 namespaces native, rest EN-fallback), add `nl` to `DICTS`, add `ob.lang.dutch` to en/he/nl, add `set.uiLang.title`/`set.uiLang.sub` to en/he/nl.
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/SettingsModal.tsx` — add `nl` pill; add UI-language Row bound to `setUiLang`; add `aria-pressed`.
- **Create** `PAI/projects/arbor/html/arbor-marketing-landing-page-nl.html` — Dutch landing.
- **Edit** `PAI/projects/arbor/html/arbor-marketing-landing-page-en.html` — add `hreflang="nl"` link + NL link in switcher.
- **Edit** `PAI/projects/arbor/html/arbor-marketing-landing-page-he.html` — add `hreflang="nl"` link + NL link in switcher.

### Shared-file conflict notes
- **`PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts`** — high-contention; touched by `mk-p0-8-copy-pack`, `mk-p2-1-localize-nl` (this), `mk-p2-7-paywall-experiments`. Strategy: **`mk-p0-8-copy-pack` lands first** (it revises EN/HE strings — translating from finalized copy avoids retranslating). This item then **appends** a whole new `nl` block and only **adds** (never reorders/renames) keys to `en`/`he` (`ob.lang.dutch`, `set.uiLang.*`). `mk-p2-7-paywall-experiments` appends `pay.*` keys — coordinate so both append to the same blocks; merge is clean if neither reorders. Touch only the union type, the new `nl` block, the `DICTS` line, and the specific appended keys — leave existing en/he values to `mk-p0-8`.
- **`PAI/.../arbor-marketing-landing-page-en.html`** — `mk-landing-parity-rebuild` **rewrites this file wholesale**; `mk-p0-1` (canonical URL) + `mk-p0-5` (UTM/CTA) patch it after. This item must run **after all three** so it translates the final structure and reuses the final CTA scheme. Limit this item's EN edit to a single `<head>` `hreflang` line + one switcher link to minimize collision with `mk-p0-1`'s head edits.
- **`PAI/.../arbor-marketing-landing-page-he.html`** — same: limit to the `hreflang` line + switcher link; do not touch HE body (owned by `mk-p1-4-aeo-seo-he` / parity rebuild reference).
- **`SettingsModal.tsx`** is not on the shared-file hotspot list — low collision risk; still keep the edit scoped to the language Row.

### Dependencies (must land first)
- **`mk-landing-parity-rebuild`** (declared dep) — provides the canonical EN landing structure to translate.
- **`mk-p0-8-copy-pack`** (soft, strongly recommended) — finalizes EN/HE strings so NL is translated once, not twice.
- **`mk-p0-5-attribution-utm`** (soft) — defines the CTA/UTM scheme NL CTAs must mirror.

### Acceptance criteria (testable)
1. `UiLang` type includes `"nl"`; `DICTS` includes `nl`; `tsc` passes with no errors (run `npm run build` / `tsc --noEmit` in `app/`).
2. Existing 241-test suite stays green (`npm test` in `app/`).
3. In Settings, selecting **NL** sets `localStorage["arbor.uiLang"] = "nl"`, `document.documentElement.lang === "nl"`, `dir === "ltr"`, and the shell nav + Today + Ask + onboarding + settings render native Dutch (verified live on dev server: `npm run dev`, switch to NL, screenshot the shell).
4. No raw i18n keys appear in NL mode — untranslated long-tail keys fall back to readable English (verify by navigating every pillar).
5. `arbor-marketing-landing-page-nl.html` exists, `<html lang="nl">`, all body copy + meta + OG + JSON-LD in Dutch, `canonical` → NL URL.
6. All three landing pages carry a 4-entry hreflang cluster (`en`,`he`,`nl`,`x-default`) and a visible EN|HE|NL switcher whose links resolve to the sibling files (open NL page in browser, click each switcher link).
7. NL CTAs carry the same UTM/attribution params as the rebuilt EN page, locale-annotated.
8. Capacitor: NL selectable and rendering inside the iOS/Android webview (or documented as deferred-to-native-verification if no Mac available — iOS build needs a Mac per MEMORY).

### Operating-rule checks
- **No dark patterns:** language switch is symmetric and reversible; no pre-checked NL upsell; switcher offered to humans, not just crawlers.
- **Privacy / COPPA:** purely presentational localization — no new data collection, no new telemetry, no child PII. UI-lang persists only in `localStorage`, same as existing `he`/`en`.
- **Moat read/write:** N/A directly — this item neither reads nor writes the longitudinal memory; it localizes the chrome around it. (Once NL parents log moments, those write to the moat in Dutch via the existing `aiLang` path, no change needed.)
- **Ships-visible:** outcome is observable end-to-end — a Dutch parent gets a Dutch landing page and a Dutch app shell, switchable in Settings, verified on the dev server before merge.
