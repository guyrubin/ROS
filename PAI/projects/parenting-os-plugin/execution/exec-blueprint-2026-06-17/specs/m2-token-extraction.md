## m2-token-extraction — Design-token extraction to typed TS
**Aspects:** UI/UX · **Surfaces/platforms:** app:shell, web:Today, web:Grow, child:PlayKit · **Priority:** Phase2

### Problem / why
The design system has **one source of truth in CSS** (`src/index.css` `:root`, lines 14–62: surfaces, brand green, the 6 pastel accent triads, type scale, radii, shadows, ring) but **three uncoordinated re-declarations in TS**:

- `src/components/ui/kit.tsx:6–14` — `PASTEL` hand-maps 6 tones to `{soft, ink}` as `var(--arbor-*)` strings, plus a one-off `cardCls` literal at line 17 (`border-[rgba(41,51,63,0.06)] shadow-[0_2px_10px_rgba(41,51,63,0.05)]`).
- `src/components/ui/playkit.tsx:45–61` — `TONE_INK` and `TONE_SOFT` hand-map a **different, overlapping** 6-tone set (`clay`/`lav`/`sky`/`yellow`/`pink`/`peach`) to the same `var(--arbor-*)` strings, plus `BRAND_CONFETTI` (line 16) hardcodes 6 hex literals (`#34b277`, `#5fce97`, `#d9763f`, `#3f8cc9`, `#7a6bd8`, `#c2882a`) that duplicate the brand/pastel values.
- ~40 component files reference raw `var(--arbor-*)` strings inline (746 occurrences), and `kit.PASTEL`/`PastelKey` is imported by ~10 section files (CareTeam, ChildProfile, FindProfessional, Reports, Strengths, etc.).

`kit.PASTEL` and `playkit.TONE_*` describe the **same token vocabulary** with two different key sets (`mint`/`coral` vs `clay`/`peach`) and no shared type. There is no single typed export, so every new view re-invents `style={{ color: "var(--arbor-ink)" }}` and `m3-hex-sweep` (the hex literal cleanup) has no canonical map to sweep *toward*.

This mission creates **`src/lib/tokens.ts`** as the single typed TS face of the CSS `:root`: it (a) exports a `T` accessor for every `--arbor-*` variable as a `var()` string, (b) re-exports `PASTEL`, `TONE_INK`, `TONE_SOFT` derived from one shared tone table so the two key sets stay consistent, and (c) exports the raw brand hex values (`BRAND_HEX`) for the few places that genuinely need a literal (confetti canvas, PDF/image export, SVG `fill`). `kit.tsx` and `playkit.tsx` then **import from `tokens.ts` instead of hand-declaring**. No visual change ships — this is a refactor that lands a stable contract **before** `m3-hex-sweep` consumes it.

CSS `:root` remains the runtime source of truth (it drives the override layer and RTL/`html[lang=he]` font swaps). `tokens.ts` is a **typed mirror**, not a replacement — the JS doc comment must state this so nobody deletes the CSS.

### Scope across platform domains
- **Web (parent surfaces — Today/Grow + all section pages):** `kit.tsx` consumers (`PASTEL`, `PastelKey`, `cardCls`) get identical values via re-export; zero behavior change. New `T.*` accessor available for future inline styles.
- **child:PlayKit (Practice register):** `playkit.tsx` `TONE_INK`/`TONE_SOFT`/`PlayTone` and `BRAND_CONFETTI` source from `tokens.ts`; the `.arbor-play` CSS register (index.css lines 416–489) is untouched.
- **app:shell:** Shell/nav components that read `var(--arbor-*)` inline are unaffected this mission (they keep working); they become eligible for `T.*` migration in `m3`.
- **iOS / Android (Capacitor):** No native change. Capacitor wraps the same web bundle, so the typed tokens ship to mobile automatically; no `capacitor.config.ts` or `native.ts` edits.
- **Landing EN / Landing HE:** Out of scope — landing pages are standalone HTML prototypes with their own inline styles, not consumers of the app bundle.

### IA / UX / Copy / Marketing detail
This is a **UI/UX systems** mission (design-tokens), not a visual or copy change. Build-level detail:

**1. Create `src/lib/tokens.ts`** with these exports:

- `CSS_VARS` — a `const` object literal that is the **typed inventory** of every `:root` custom property name → its `var()` string. One entry per property in index.css lines 16–61. Group by section with comments mirroring the CSS (Surfaces, Primary green, Pastel accents, Type, Radii, Shadows, Ring). Example shape:
  ```ts
  export const CSS_VARS = {
    paper: "var(--arbor-paper)",
    paperElevated: "var(--arbor-paper-elevated)",
    ink: "var(--arbor-ink)",
    inkSoft: "var(--arbor-ink-soft)",
    muted: "var(--arbor-muted)",
    // … brand, pastels, radii, shadows, ring
  } as const;
  export type TokenName = keyof typeof CSS_VARS;
  export const T = CSS_VARS; // short alias for inline styles: style={{ color: T.ink }}
  ```
- `TONES` — the **single shared tone table**. Each tone declares its `soft`, `ink`, and (where the accent has a saturated fill) `solid` `var()` string, plus its raw `hex` for literal-only contexts:
  ```ts
  export const TONES = {
    mint:   { soft: T.greenSoft, ink: T.greenInk, solid: T.clay,   hex: "#34b277" },
    coral:  { soft: T.peachSoft, ink: T.peachInk, solid: T.peach,  hex: "#d9763f" },
    lav:    { soft: T.lavSoft,   ink: T.lavInk,   solid: T.lav,    hex: "#7a6bd8" },
    yellow: { soft: T.yellowSoft,ink: T.yellowInk,solid: T.yellow, hex: "#c2882a" },
    pink:   { soft: T.pinkSoft,  ink: T.pinkInk,  solid: T.pink,   hex: "#d65f87" },
    sky:    { soft: T.skySoft,   ink: T.skyInk,   solid: T.sky,    hex: "#3f8cc9" },
    clay:   { soft: T.greenSoft, ink: T.clayDeep, solid: T.clay,   hex: "#2a9c66" },
    peach:  { soft: T.peachSoft, ink: T.peachInk, solid: T.peach,  hex: "#d9763f" },
  } as const;
  export type Tone = keyof typeof TONES;
  ```
  Note the two legacy key sets must both be preserved: `kit.PASTEL` uses `mint/coral/lav/yellow/pink/sky`; `playkit.TONE_*` uses `clay/lav/sky/yellow/pink/peach`. `TONES` is the **superset** so both derive without changing any consumer's tone string.
- Derived re-exports for **back-compat** (so no consumer file changes its import shape this mission):
  ```ts
  export const PASTEL = { mint:..., coral:..., lav:..., yellow:..., pink:..., sky:... } as const; // { soft, ink } only — exact current kit.tsx keys
  export type PastelKey = keyof typeof PASTEL;
  export const TONE_INK:  Record<string,string> = { clay: TONES.clay.ink,  lav: TONES.lav.ink,  ... };
  export const TONE_SOFT: Record<string,string> = { clay: TONES.clay.soft, lav: TONES.lav.soft, ... };
  export type PlayTone = keyof typeof TONE_INK;
  export const BRAND_HEX = { green: "#34b277", greenLight: "#5fce97", peach: "#d9763f", sky: "#3f8cc9", lav: "#7a6bd8", ochre: "#c2882a" } as const;
  export const BRAND_CONFETTI: readonly string[] = [BRAND_HEX.green, BRAND_HEX.greenLight, BRAND_HEX.peach, BRAND_HEX.sky, BRAND_HEX.lav, BRAND_HEX.ochre];
  export const cardCls = "bg-white rounded-[22px] border border-[rgba(41,51,63,0.06)] shadow-[0_2px_10px_rgba(41,51,63,0.05)]";
  ```
  **Values must be byte-identical** to today's `kit.tsx`/`playkit.tsx` so the refactor is a no-op visually. Verify each derived value against the current literals before committing.

**2. Refactor `kit.tsx`** — replace the local `PASTEL`/`PastelKey`/`cardCls` declarations (lines 6–17) with `export { PASTEL, cardCls } from "../../lib/tokens"; export type { PastelKey } from "../../lib/tokens";`. Components currently doing `import { PASTEL, PastelKey } from "../ui/kit"` keep working unchanged (kit re-exports).

**3. Refactor `playkit.tsx`** — replace `TONE_INK`/`TONE_SOFT`/`PlayTone` (lines 45–61) and `BRAND_CONFETTI` (line 16) with imports from `../../lib/tokens`. The `celebrateBurst`, `MascotSay`, `PlayButton`, `ChoiceTile`, `ProgressPips`, `StatBubble`, `PlayPanel` bodies stay untouched.

**4. index.css** — **no edits in this mission.** The `:root` block stays the runtime source. (Per the hotspot order, `m4` deletes the override layer first, then `m2`; if `m2` runs after `m4`, only verify `:root` is intact — do not add or remove vars.)

**States / motion / a11y / RTL:** N/A — no rendered output changes. `tokens.ts` is pure data; it has no DOM, no states, no motion. The `prefers-reduced-motion` guard (index.css 401–407) and RTL font swap (80–93) are CSS-side and untouched. Because tokens stay as `var()` strings, runtime theming (the `html[lang=he]` font override) still resolves correctly — values are not inlined at build time.

**Copy / Marketing:** none.

### Files to create / edit (exact repo-relative paths)
- **Create** `PPPPtherapy-/PPPPtherapy-/app/src/lib/tokens.ts` — the typed token module described above.
- **Create** `PPPPtherapy-/PPPPtherapy-/app/src/lib/tokens.test.ts` — vitest unit test (acceptance below).
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/kit.tsx` — remove local `PASTEL`/`PastelKey`/`cardCls`, re-export from `tokens.ts`. (Lines 6–17.)
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/ui/playkit.tsx` — remove local `TONE_INK`/`TONE_SOFT`/`PlayTone`/`BRAND_CONFETTI`, import from `tokens.ts`. (Lines 16, 45–61.)
- **No edit** `PPPPtherapy-/PPPPtherapy-/app/src/index.css` — CSS `:root` unchanged (declared shared because `m4`/`m1`/`p3` also touch it; this mission only reads it).

Import path: use the existing relative style (`../../lib/tokens` from `components/ui/`) to match the codebase convention; `@/lib/tokens` also resolves (tsconfig `paths` maps `@/*`→`./src/*`) but relative keeps the diff consistent with neighbors.

### Shared-file conflict notes
Three shared files, all on the hotspot list:
- **`src/index.css`** (hotspot: items `p3-ios-grade-audit`, `m1-ios-safe-area`, `m2-token-extraction`, `m4-retire-override-layer`; ordering note: *"m4 (delete override layer) then m2 then m1; p3 last. Never parallelize."*). **This mission must NOT parallelize with `m4`.** Run after `m4` lands. Because `m2` is now spec'd to **not edit index.css at all** (only read `:root`), the merge surface is reduced to zero — `m2` touches index.css read-only, which removes it as a conflict source for `m1`/`p3`. If a reviewer expects `m2` to move `:root` *into* a CSS-module, that is explicitly out of scope here.
- **`src/components/ui/kit.tsx`** (hotspot: `p3-ios-grade-audit`, `m2-token-extraction`, `m3-hex-sweep`). `m2` defines the canonical map; **`m3` must land after `m2`** (rationale: "Should land before m3 hex sweep"). `m3` sweeps inline hex → `T.*`/`TONES`; do not let `m3` start until `tokens.ts` is merged. `p3` polish is continuous/visual and won't collide with the export-only kit edit.
- **`src/components/ui/playkit.tsx`** (hotspot note: *"m2 + m7 settle the API first; feature missions (p1/p2-7/p2-11) then consume stable primitives"*). **`m2` and `m7-playkit-completeness` settle the primitive module before** `p1-comic-reader`, `p2-7-phonics-tracing`, `p2-11-mimic-mediapipe` build on it. Coordinate with `m7`: `m2` only changes the **token source** (imports + the 4 const blocks), `m7` changes the **component API**; keep the two diffs in non-overlapping line ranges (m2 = lines 16 + 45–61, m7 = component bodies) and land `m2` first.

### Dependencies (other item ids that must land first)
- **Hard:** none (`dependsOn: []`).
- **Sequencing (soft, from hotspots):** if `m4-retire-override-layer` is in the same wave, land `m4` before `m2` (both list index.css). `m2` must land **before** `m3-hex-sweep` and before the playkit feature missions (`p1`, `p2-7`, `p2-11`). Coordinate parallel landing with `m7-playkit-completeness` on playkit.tsx.

### Acceptance criteria (testable)
1. `src/lib/tokens.ts` exists and exports `CSS_VARS`/`T`, `TokenName`, `TONES`, `Tone`, `PASTEL`, `PastelKey`, `TONE_INK`, `TONE_SOFT`, `PlayTone`, `BRAND_HEX`, `BRAND_CONFETTI`, `cardCls`.
2. `kit.tsx` and `playkit.tsx` no longer declare `PASTEL`/`TONE_INK`/`TONE_SOFT`/`BRAND_CONFETTI`/`cardCls` locally; they import/re-export from `tokens.ts`. (`grep -n "const PASTEL\|const TONE_INK\|const BRAND_CONFETTI" src/components/ui/{kit,playkit}.tsx` returns nothing.)
3. **No value drift:** `tokens.test.ts` asserts every `PASTEL[k].soft/ink`, `TONE_INK[k]`, `TONE_SOFT[k]`, `BRAND_CONFETTI[i]`, and `cardCls` equals the exact pre-refactor string (snapshot the current literals into the test). `npm test` passes.
4. **No CSS drift:** `tokens.test.ts` parses `src/index.css` `:root` and asserts every `var(--arbor-*)` referenced in `CSS_VARS`/`TONES` resolves to a declared custom property (no typo'd var names, no orphaned tokens). 
5. `npm run lint` (`tsc --noEmit`) passes — `TokenName`/`Tone`/`PastelKey`/`PlayTone` are correctly typed and all ~10 `kit.PASTEL` consumers + `playkit` consumers still typecheck.
6. **Verified live on dev server:** `npm run dev` (tsx server.ts) builds and serves; load the app, open a **Today** view (uses `kit` `cardCls`/`Chip`), a **Grow/section** view that imports `PASTEL` (e.g. ChildProfile, Strengths), and a **Practice/PlayKit** tab (uses `TONE_*` + confetti). Confirm pixel-identical rendering (pastel chips, play tiles, confetti colors) vs. pre-change — screenshot before/after, no visual diff.
7. No new files import the deleted symbols from the wrong module; the full `npm test` + `tsc` suite is green.

### Operating-rule checks
- **No dark patterns:** N/A — internal refactor, no user-facing surface or flow.
- **Privacy / COPPA-2026:** No data, no PII, no network, no child input touched. `tokens.ts` is static design data.
- **Moat read/write:** N/A — this mission does not read or write the longitudinal memory; it is infrastructure that *enables* consistent rendering of moat-driven views (chips/scores) downstream. Does not regress any moat read/write path.
- **Ships-visible:** Ships **invisibly by design** (zero pixel change is the success condition). Its visible payoff is unblocking `m3-hex-sweep` and giving every later mission one typed import instead of scattered `var()` strings — call this out in the PR so reviewers don't expect a screenshot diff.
