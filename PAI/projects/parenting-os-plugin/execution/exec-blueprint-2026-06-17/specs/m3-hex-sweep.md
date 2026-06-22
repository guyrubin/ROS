## m3-hex-sweep — Hardcoded-hex sweep (268 -> near-zero in views)
**Aspects:** UI/UX · **Surfaces/platforms:** web:Ask, web:Academy, web:MyChild, child:PlayKit, app:shell · **Priority:** Phase2

### Problem / why
The live React app renders its design system through two layers: a clean `:root` token set in `app/src/index.css` (`--arbor-clay`, `--arbor-ink`, `--arbor-rule`, the 5 accent triads, etc.) and a large number of **hardcoded hex literals scattered through view code** that bypass it. A live grep of `app/src/**/*.tsx` finds **197 hex occurrences across 57 files** today (the "268" headline counts CSS + tsx + repeated multi-hex lines; the actionable view-code surface is these 197). The literals fall into three buckets:

1. **Tokenizable UI chrome** — `#fff`, `#29333f`, `#69747f`, `#f4f8f5`, `#1c222b`, `#a8a093`, `#e9a0b6`, the repeated CTA gradient `linear-gradient(135deg,#3cc081,var(--arbor-clay) 60%,var(--arbor-clay-deep))`. These map 1:1 onto existing or one new token and MUST be replaced.
2. **Data-keyed palette maps** — `PACK_COLORS` / `METRIC_COLORS` in `HeroJourneyTab.tsx` (`#e2562d`, `#d7aa55`, `#6f9e6f`, `#68B4FF`, `#A07AF8`, `#38C8F0`), `BRAND_CONFETTI` in `playkit.tsx`. These are semantic category colors that belong in tokens but render as `style={{ background }}`; convert to a tokenized lookup, do NOT inline-swap blindly.
3. **SVG illustration literals** — `ArborMascot.tsx` (18), `ArborMark.tsx` (8), `ParentChildIllustration.tsx` (7), `StoryIllustration.tsx` (4), avatar/illustration fills. **OUT OF SCOPE** per the work-item rationale ("leave SVG illustration literals"). Illustration art has its own palette and tokenizing it adds churn without UI-system value.

Why it matters: hardcoded hex defeats theming (no dark mode / high-contrast path), drifts from the AA-tuned token values (e.g. `#69747f` is lighter than the AA-nudged `--arbor-faint: #6b747b`), and is the exact debt m2 (token extraction) and m4 (override-layer retirement) are clearing. This is the view-code half of that cleanup.

### Scope across platform domains
- **Web (Ask / Academy / MyChild / app shell):** the only surface that changes. All edits are to React `.tsx` view files that render on web. Targets in scope: `CoachTab.tsx` (Ask, 18), `HeroJourneyTab.tsx` (Academy/Story Journeys, 13), `BehaviorsTab.tsx` (MyChild, 7), `MimicStudioTab.tsx` (child practice, 7), `SettingsModal.tsx` (app shell, 7), `Button.tsx` (shared primitive, 2), `kit.tsx` (shared primitive, 2), `playkit.tsx` (child register, 4).
- **iOS (Capacitor) / Android (Capacitor):** no code change — the Capacitor shells load the same web bundle, so the fix propagates automatically. Verify the CTA gradient and `--arbor-on-accent` still resolve inside the native WebView (they do; both are CSS vars). No `capacitor.config.ts` or `native.ts` edits.
- **Landing EN / Landing HE (RTL):** out of scope (separate HTML files, own stylesheet).

### IA / UX / Copy / Marketing detail (UI/UX)
Pure visual-correctness refactor — **zero behavioral or copy change**. The acceptance bar is "pixel-identical or AA-improved, never AA-regressed."

**Token mapping (literal -> token).** Use only tokens that exist in `index.css` today, plus the two new ones m2 must add:
| Literal in view code | Replace with | Notes |
| --- | --- | --- |
| `#fff` / `#ffffff` (as text-on-accent, e.g. `color: "#fff"` on a clay/green button) | `var(--arbor-on-accent)` (NEW, m2 = `#ffffff`) | semantic: "ink that sits on a saturated accent". Do not reuse `--arbor-paper-elevated` (that's a surface, not a text role). |
| `#fff` (as a white **surface**, e.g. `background: "#fff"` on a card/pill/input) | `var(--arbor-paper-elevated)` | already `#ffffff` (index.css:17) |
| `#29333f` | `var(--arbor-ink)` | index.css:20 |
| `#69747f` | `var(--arbor-faint)` | index.css:23 (`#6b747b`, AA-nudged — slight darken, acceptable) |
| `#f4f8f5` / `#f3faf6` | `var(--arbor-paper-deep)` | index.css:18 (`#f4f8f5`) |
| `#eef1f0` (kit pill bg) | `var(--arbor-paper-deep)` | visually equivalent well |
| `#1c222b` (MimicStudio camera stage bg) | `var(--arbor-cam-stage)` (NEW, m2 = `#1c222b`) | dark media surface; one of two consumers (Mimic + future camera views) |
| `#a8a093` (camera placeholder text) | `var(--arbor-on-dark-muted)` (NEW, m2 = `#a8a093`) | muted text on the dark cam stage |
| `#e9a0b6` (camera error text) | `var(--arbor-pink-soft)` is too light — use `var(--arbor-pink)` (`#d65f87`) | error text on dark needs AA; verify ≥4.5:1 on `#1c222b` (pass) |
| `linear-gradient(135deg,#3cc081,var(--arbor-clay) 60%,var(--arbor-clay-deep))` (5+ files) | `var(--gradient-cta)` (NEW, m2) | the single most-repeated literal; collapse the inline `#3cc081` start-stop into one token |
| `PACK_COLORS` / `METRIC_COLORS` map values (HeroJourneyTab) | move to `var(--arbor-pack-courage)` … `--arbor-metric-empathy` token set (NEW, m2 category palette) | see "Data-keyed maps" below |
| `BRAND_CONFETTI` array (playkit) | `var(--arbor-confetti-*)` or read from the category tokens via `getComputedStyle` at runtime | confetti needs raw hex (canvas API can't take CSS vars) — see note |

**Two literals that are NOT plain hex but must also go:** `rgba(207,111,55,0.28)` and the several `rgba(52,178,119,0.30)` / `rgba(41,51,63,0.x)` borders in CoachTab/HeroJourneyTab. `rgba(52,178,119,...)` is the clay channel — replace with `color-mix(in oklab, var(--arbor-clay) 30%, transparent)` or a new `--arbor-clay-border` token (defer the rgba sweep to m2 if it lands the token; otherwise leave a `// TODO(m4): rgba` and do not block on it). The work-item is the **hex** sweep — rgba is m4's override-layer concern. Do NOT expand scope.

**Data-keyed maps (HeroJourneyTab `PACK_COLORS` / `METRIC_COLORS`, lines 45–58).** These render as `style={{ background, color }}` and as `${color}22` / `${color}55` opacity suffixes (lines 293, 313). Pure CSS-var substitution breaks the `${color}22` string concat. Convert the maps to **CSS-var references** and replace the `${color}22` pattern with `color-mix(in oklab, var(--…) 13%, transparent)` (22 hex ≈ 13%) and `${color}55` with `33%`. Keep the `Record<HeroPackId,string>` shape but store `"var(--arbor-pack-courage)"` etc. Verify the inline progress-bar fill (line 271 `background: METRIC_COLORS[m]`) still renders — CSS vars work in inline `style`.

**Canvas confetti exception (playkit `BRAND_CONFETTI`, line 16; HeroJourneyTab uses `canvas-confetti`).** `canvas-confetti` cannot consume CSS variables — it needs literal hex. Resolve this by reading the tokens at call time: `getComputedStyle(document.documentElement).getPropertyValue('--arbor-clay').trim()`. Add a tiny helper `readToken(name)` (place in `app/src/lib/` or inline in playkit). This keeps confetti theme-correct without re-introducing literals as the source of truth. Acceptable fallback if a token resolves empty: keep the current hex as the `|| "#34b277"` default.

**States (default / loading / empty / error).** No new states. Each touched element keeps its existing default/hover/disabled/active variants — only the color *source* changes. Specifically verify after swap: CoachTab send-button gradient (default + `disabled:opacity-60`), HeroJourney "Start journey" gradient (default + loading `RefreshCw` spin), BehaviorsTab analyze button gradient, MimicStudio camera-off empty state (`#1c222b` bg + `#a8a093` text) and camera **error** state (`#e9a0b6` -> token), SettingsModal plan-CTA buttons.

**Motion / prefers-reduced-motion.** Untouched — no animation logic changes. The confetti calls (HeroJourneyTab `chooseOption`/`finishJourney`) already fire imperatively; this sweep does not add motion, so no new `prefers-reduced-motion` guard is required by m3 (that guard, if missing, is m5/p3 territory — do not add here).

**Touch targets.** Untouched — no sizing changes.

**Accessibility (AA, keyboard, RTL).** (a) **Contrast must not regress.** The risky swaps are `#69747f -> --arbor-faint (#6b747b, darker = safer)` and `#e9a0b6 -> --arbor-pink (#d65f87)` on `#1c222b` — both verified ≥4.5:1; spot-check with the design:accessibility-review method. (b) **Keyboard/focus:** unchanged; tokens don't touch focus rings (`--arbor-clay` outline lives in index.css:397). (c) **RTL:** HeroJourneyTab and CoachTab already use `dir="auto"` on user content (HeroJourneyTab:202,439); color tokens are direction-agnostic, so RTL is unaffected — but re-run the HE language path once to confirm no literal was inside an RTL-only branch.

### Files to create / edit (exact repo-relative paths)
**Edit (view code — replace hex with tokens):**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/CoachTab.tsx` — 18 literals: `#fff` (text-on-accent at :252,:259 → `--arbor-on-accent`; surfaces at :274,:287,:289,:346,:496,:514,:522,:533,:548,:563,:574,:582,:653,:664 → `--arbor-paper-elevated`), `#29333f` (:322 → `--arbor-ink`), the CTA gradient (:554 → `--gradient-cta`). Leave `rgba(207,111,55,...)`/`rgba(52,178,119,...)` borders (m4) or color-mix if m2 token exists.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/HeroJourneyTab.tsx` — 13 literals: `PACK_COLORS`/`METRIC_COLORS` maps (:45–58 → category tokens + color-mix for `${color}22/55`), CTA gradient (:332,:450 → `--gradient-cta`), `#fff` surfaces (:284,:293 → `--arbor-paper-elevated`).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/BehaviorsTab.tsx` — 7 literals: CTA gradients (:368,:409 → `--gradient-cta` / clay variant), `#fff` (:372,:488,:494 → `--arbor-paper-elevated`), `linear-gradient(120deg,#eef6f1,…)` (:435 → keep or `--gradient-insight` if m2 adds). The `#14160f`/`#ccc`/`#f0ece0` at :194 are inside a **print/export `<style>` string** for a printed report — these are print-media literals, treat like SVG: **leave them** (document in code comment `// print stylesheet — intentional literals`).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/practice/MimicStudioTab.tsx` — 7 literals: `#f3faf6` (:113 → `--arbor-paper-deep`), `#fff` (:141,:145 → `--arbor-paper-elevated`), `#1c222b` (:153 → `--arbor-cam-stage`), `#a8a093` (:157,:158 → `--arbor-on-dark-muted`), `#e9a0b6` (:164 → `--arbor-pink`).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/layout/SettingsModal.tsx` — 7 literals: `#fff` text-on-accent (:133,:139,:142,:155,:179 → `--arbor-on-accent`), `#fff` surface (:90 → `--arbor-paper-elevated`), `linear-gradient(120deg,#eef6f1,…)` (:87 → keep/`--gradient-insight`).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/Button.tsx` — 2 literals: `#29333f`/`#69747f`/`#f4f8f5` in the `secondary`/`ghost` Tailwind arbitrary classes (:10–12). Replace `bg-[#f4f8f5]`→`bg-[var(--arbor-paper-deep)]`, `text-[#29333f]`→`text-[var(--arbor-ink)]`, `text-[#69747f]`→`text-[var(--arbor-faint)]`. The `rgba(52,178,119,0.28)` shadow (:8) → m4/color-mix.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/kit.tsx` — 2 literals: `#fff` on `PASTEL[tone].ink` button (:82 → `--arbor-on-accent`), `#eef1f0`/`#69747f` pill (:93 → `--arbor-paper-deep` / `--arbor-faint`).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/playkit.tsx` — 4 literals: `BRAND_CONFETTI` (:16 → runtime `readToken` helper, keep hex as fallback), `#fff` text-on-tone (:144 → `--arbor-on-accent`), `#fff` neutral tile (:182 → `--arbor-paper-elevated`), `#fff` in color-mix (:285 → `--arbor-paper-elevated`).

**Do NOT edit (explicitly out of scope):** `ArborMascot.tsx`, `ArborMark.tsx`, `ParentChildIllustration.tsx`, `StoryIllustration.tsx`, `Avatar.tsx`, `HeroAvatar.tsx` (SVG illustration art); the BehaviorsTab print `<style>` block (print media).

**Create:** none. New tokens are added by **m2** in `index.css` (this spec lists the names m2 must provide — coordinate so m3 consumes them). If m2 has not yet added `--arbor-on-accent` / `--arbor-cam-stage` / `--arbor-on-dark-muted` / `--gradient-cta` / category palette by the time m3 runs, **add those `:root` entries in m2's section of `index.css` (append-only, after the existing accent block ~index.css:40) as part of landing m3** — but flag it as the m2 contract.

### Shared-file conflict notes
Per the conflict hotspot list:
- **`app/src/components/ui/kit.tsx`** — touched by `p3-ios-grade-audit`, `m2-token-extraction`, **m3**. Sequence: m2 settles the token API first, then m3 consumes; p3 polish is continuous. m3 only edits the two color literals at :82/:93 — keep the diff to those lines; do not touch `cardCls`/`TrustSafetyBar` structure (p3's concern).
- **`app/src/components/tabs/CoachTab.tsx`** — touched by `ia-b6-ask-from-ask`, **m3**, `surf-ask`. IA-b6 reorganizes the Ask flow/structure; m3 only swaps inline color values. **Land m3 after ia-b6's structural edits** to avoid rebasing color swaps onto moved JSX. If running near-parallel, m3 must rebase onto ia-b6's CoachTab, not vice-versa (color swaps are mechanical to re-apply).
- **`app/src/components/tabs/HeroJourneyTab.tsx`** — touched by `p1-comic-reader`, **m3**, `surf-academy`. p1 adds the comic reader (new JSX/logic); m3 only edits `PACK_COLORS`/`METRIC_COLORS` (top of file) + 4 gradient/surface lines. Low collision (different regions) — but land **after p1** if p1 restructures the catalog. Coordinate on the `canvas-confetti` calls: m3 changes confetti colors via `readToken`, p1 may add new confetti — agree on one helper.
- **`app/src/components/ui/Button.tsx`** — touched **only by m3**. No conflict.
- **`app/src/index.css`** — the #1 merge magnet (`p3`, `m1`, `m2`, `m4`). m3 does **not** edit index.css itself; it consumes tokens m2 adds. If m3 must add the new tokens (m2 not landed), append only after index.css:40, never reorder, and hand the additions to m2 to absorb. Strict order from hotspot: m4 → m2 → m1 → p3 for index.css.
- General rule: m3 is a leaf consumer — keep every diff to color-literal lines only; never refactor structure in a shared file (that belongs to the IA/feature missions sharing it).

### Dependencies (other item ids that must land first)
- **`m2-token-extraction`** (hard dependency) — m3 consumes the token vocabulary. Specifically m2 must publish: `--arbor-on-accent`, `--arbor-cam-stage`, `--arbor-on-dark-muted`, `--gradient-cta`, and the category palette (`--arbor-pack-*`, `--arbor-metric-*`). If m2 omits any, m3 adds them in m2's index.css block and notifies m2.
- Soft ordering: prefer to land **after** `ia-b6-ask-from-ask` (CoachTab) and `p1-comic-reader` (HeroJourneyTab) to avoid rebasing color swaps; both are mechanical to re-apply if they land first instead.

### Acceptance criteria (testable, including "verified live on dev server")
1. `rg -n '#[0-9a-fA-F]{3,8}\b' app/src/components/tabs/CoachTab.tsx app/src/components/tabs/HeroJourneyTab.tsx app/src/components/tabs/BehaviorsTab.tsx app/src/components/practice/MimicStudioTab.tsx app/src/components/layout/SettingsModal.tsx app/src/components/ui/Button.tsx app/src/components/ui/kit.tsx app/src/components/ui/playkit.tsx` returns **only** documented exceptions: the BehaviorsTab print `<style>` block, and the `BRAND_CONFETTI` / `readToken` fallback hexes (each annotated with a justifying comment). Net new-zero literals = all chrome/UI hex removed.
2. `npm run build` (or `tsc --noEmit`) passes with zero new type errors; the 241-test suite stays green.
3. **Verified live on dev server** (`npm run dev`, `https://arborprd-westeu.web.app` or local): Ask tab (CoachTab) — send/council buttons, lens chips, scenario chips, memory-review cards render visually identical to pre-change (screenshot diff or side-by-side). Academy/Story Journeys (HeroJourneyTab) — pack filter chips, metric bars, story-card gradients, confetti on choice all render with correct colors. MyChild (BehaviorsTab) — log form gradient + chips. MimicStudio camera-off + error states show correct dark-stage colors. SettingsModal plan CTAs correct.
4. AA contrast spot-check (design:accessibility-review method) on the two risk swaps (`--arbor-faint` text, `--arbor-pink` error on `--arbor-cam-stage`) confirms ≥4.5:1; no element regresses below its pre-change ratio.
5. HE/RTL pass: switch AI language to Hebrew in CoachTab and HeroJourneyTab; confirm no missed literal in an RTL-only branch and colors render correctly.
6. Native sanity: confirm the CTA gradient + new tokens resolve inside the Capacitor WebView (token vars cascade; quick check via the iOS/Android dev build or a WebView preview) — no native code edit required.
7. SVG illustration files (`ArborMascot`, `ArborMark`, `ParentChildIllustration`, `StoryIllustration`) are **unchanged** (git diff shows no edits) — out-of-scope respected.

### Operating-rule checks
- **No dark patterns:** purely cosmetic-source refactor; no copy, flow, pricing, or consent change. SettingsModal plan CTAs keep identical labels/behavior.
- **Privacy / COPPA-2026:** no data, telemetry, or child-facing behavior change. MimicStudio camera handling untouched (only the stage/placeholder *colors* change).
- **Moat read/write:** N/A — no read/write of longitudinal memory; this is presentation-layer only. HeroJourney run-save logic (`runsCol.upsert`, the development-metric write to the moat) is untouched.
- **Ships-visible:** the change is invisible-by-design (pixel-identical) but unblocks the visible wins — theming, dark/high-contrast mode, and m4's override-layer deletion. Verified visually on the dev server per AC#3.
