## surf-ask — Surface audit — Ask Arbor (Coach)
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** web:Ask · **Priority:** Phase1

### Problem / why
The **Ask** pillar (one nav leaf: `coach` → `CoachTab.tsx`, see `navigation.ts:42–47`) is Arbor's highest-intent surface and works functionally — SSE streaming, multi-thread conversations, scholar-lens selector, council, photo/document vision, hands-free voice (Gemini Live + browser fallback), parent-approved memory review. But cross-aspect it has **no owner**: `ia-b6` only adds the specialist door + re-points one escalation target; `m3` only swaps hex→token. Everything else — the **scholar-lens IA facet**, the **lens picker / language toggle / scenario / council / voice / vision interaction UX**, the missing **empty/error states**, the **`ScholarTab` "Scholar Frameworks" view that is the secondary Ask leaf** (`scholar` tab, reached only via in-app nav per `navigation.ts:113`), and the **hardcoded English microcopy** that bypasses the `t()` i18n layer — is unowned. This spec is the cross-aspect polish-and-coherence pass that makes the Ask pillar read as one deliberate, Apple-grade system in both EN and HE.

Concrete defects found in the live code:
1. **Untranslated strings break HE/RTL.** `CoachTab` hardcodes English in ~12 places that should use `t()`: `FOLLOW_UPS` array (`:38–42`), `SCENARIOS` labels+emojis (`:45–51`), the lens chip "Integrated Balanced" (`:276`) and hint fallback (`:301`), `"Aligned with {lens}"` (`:385`), the hover-action labels Copy / Log this / Save to Action Plan (`:442/:452/:462`), the suggested-prompt chips "Shoe departure tantrum" / "Bilingual balance routine" (`:576/:584`), the memory-review `item.status` / Source / Retention / Frame labels (`:629/:635/:636/:637`), the voice phase labels (`:237`), and the council button `title` (`:561`). `ScholarTab.tsx` is **entirely hardcoded English** (`:17,:22,:43,:44,:63,:74`) and has no `t()` calls at all. With `uiLang === "he"` these render LTR English inside an RTL document — a visible coherence break on the pillar.
2. **No error state.** `apiError` is set in `ArborContext` (`:584,:649`) but `CoachTab` never renders it — a failed coach/council call silently leaves the loading spinner's absence with no message. There is no retry affordance.
3. **Empty-conversation state is thin.** A brand-new conversation shows scenario chips but no orienting "what Ask Arbor is" framing for first-run; the chat viewport is an empty 520px box.
4. **Lens picker a11y gaps.** The lens chips (`:269–296`) and EN/עב language toggle (`:249–262`) are plain `<button>`s with no `aria-pressed`, no radiogroup semantics, and the language toggle's only label is a `title` attr on the container (`:248`) — invisible to keyboard/SR users.
5. **`ScholarTab` is an orphan leaf** with weak IA framing: it is reachable but unsurfaced (`scholar` → `ask` fallback, `navigation.ts:113`); its only exit is a back-link to coach (`:16–18`). It needs to read as "the lens library *inside* Ask," not a stranded page.

This spec owns **IA framing of the two Ask leaves (coach + scholar lens library), the interaction/visual/a11y polish of all Ask controls, the missing error/empty/loading states, and the i18n of all Ask microcopy** — explicitly excluding the specialist door (ia-b6) and the hex sweep (m3).

### Scope across platform domains
- **Web (Ask pillar — `CoachTab.tsx` + `ScholarTab.tsx`):** the only surface that changes. All edits are React view + i18n keys. This is where the IA/UX/Copy work lands.
- **iOS (Capacitor) / Android (Capacitor):** no platform-specific code. The same web bundle renders in the Capacitor WebView; the a11y/touch-target work (44×44pt minimums on lens chips, language toggle, hover-action buttons that currently rely on `group-hover` and are unreachable by touch) **directly fixes mobile usability** — see UI/UX below. No `capacitor.config.ts` / `native.ts` edits.
- **Landing EN / Landing HE (RTL):** out of scope (separate marketing HTML).

### IA / UX / Copy detail

#### A. IA — the two Ask leaves read as one system
- **Coach (`coach`)** is the primary, always-on conversational surface.
- **Scholar Frameworks (`scholar`)** is re-framed as the **"Lens library"** *inside* Ask — the place to browse/learn the lenses that the coach picker selects between. It is intentionally unsurfaced in primary nav (`navigation.ts:113` keeps `scholar→ask`); **do not add it to `SECTIONS`** (that is b5/ia-b1 nav-registry territory — see conflict notes). Instead make it reachable from CoachTab via a quiet "Browse all lenses" link beside the lens picker, and make ScholarTab clearly a sub-view of Ask (it already back-links to coach at `ScholarTab.tsx:16`; keep that, add the i18n + framing below).
- **Lens picker affordance (CoachTab `:266–308`):** add a trailing quiet link "Browse all lenses →" (routes `setActiveTab("scholar")`) so the relationship between the inline picker and the library is explicit and bidirectional (ScholarTab→coach already exists; coach→ScholarTab is the missing edge).
- **Do NOT** add the Ask-a-Specialist door here — `ia-b6` owns it (footer affordance + `onEscalate` re-point). surf-ask treats the ia-b6 affordance as canonical and must not add a duplicate specialist link (per ia-b6 conflict note §63).

#### B. UI/UX — states, motion, touch, a11y

**Lens picker (`CoachTab.tsx:266–308`)**
- Wrap the chip row in `role="radiogroup"` with `aria-label={t("coach.lens")}`; each chip `role="radio"` + `aria-checked={selectedLens === name}`. Keyboard: arrow-key navigation within the group, Enter/Space selects. This converts the current plain-button cluster into a proper single-select control.
- Each chip must meet **44×44pt** hit area on touch — current `px-3 py-2 text-xs` is ~30px tall; bump to `min-h-[44px]` (visual size can stay compact via padding, but the hit target must be ≥44).
- Keep the "Use this lens when…" hint (`:298–307`); route its strings through `t()` (see Copy).

**Language toggle (`CoachTab.tsx:248–263`)**
- This toggles **AI response language** (`setAiLang`), distinct from `uiLang`. Make that explicit: add `aria-label` per button (`t("coach.aiLang.en")` / `t("coach.aiLang.he")`) and `aria-pressed`. Move the orienting label off the `title` attr onto a visible `<span>` "Answer in" (`t("coach.aiLang.label")`) so it is not invisible to SR/keyboard. ≥44pt hit area.

**Hover-action buttons (`CoachTab.tsx:439–465`) — the biggest touch/a11y defect**
- Copy / Log this / Save to Action Plan are gated behind `opacity-0 group-hover:opacity-100` (`:440`) → **completely unreachable on touch (iOS/Android) and by keyboard**. Replace the hover gate with always-visible-but-quiet on touch / focus-revealed on desktop: use `opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100`, so touch users always see them, desktop keeps the calm hover reveal, and keyboard focus reveals them. Each is already a real `<button>`; add `aria-label` via `t()`.
- The Copy button (`:441`) uses `navigator.clipboard?.writeText` with no feedback — add a toast `t("coach.copied")` on success.

**Empty state (fresh conversation, `CoachTab.tsx:312–329` region + chat viewport `:369`)**
- When `chatMessages.length <= 1`, the 520px viewport (`:360`) is visually empty above the scenario chips. Add a calm empty-state block inside the viewport: ArborMascot + one line `t("coach.empty.title")` ("Ask Arbor anything about {name}") and a sub-line `t("coach.empty.body")`. Parent-register: muted, no animation beyond the existing `motion.div` fade. Keep the scenario fast-start chips (`:312–329`) as the primary CTA.

**Error state (NEW — currently missing entirely)**
- Read `apiError` from `useArbor()` (it exists in context, `ArborContext.tsx:584/649`). When set and `!isChatLoading`, render an inline error card in the chat viewport (after the messages map, before `chatBottomRef` at `:504`): muted red surface (`var(--arbor-pink-soft)` / `var(--arbor-pink-ink)`), text `t("coach.error")`, and a **Retry** button that re-sends the last user message (`handleChatSend(lastUserText)`). `role="alert"` so SR announces it. This is the single most important missing state on the pillar.

**Loading state (`CoachTab.tsx:485–502`)** — already good (status text + Stop). Add `aria-live="polite"` to the status `<span>` (`:491`) so streaming-status changes are announced. No motion change.

**Voice control (`CoachTab.tsx:526–537`)** — `aria-pressed` already present (`:529`); add `aria-label={voiceLabel}` so the phase ("Listening…/Thinking…/Speaking…") is announced, and route `voiceLabel` strings through `t()` (`:237`). The pulsing dot (`:536`) is decorative — add `aria-hidden`.

**Motion / prefers-reduced-motion**
- The component uses `motion/react` for the container fade (`:240`) and several `hover:-translate-y-0.5` lifts (scenario chips `:321`). Add a `prefers-reduced-motion: reduce` guard: gate the `motion.div` entrance and disable the translate-lift utility classes (use a `motion-safe:` Tailwind prefix on `hover:-translate-y-0.5`). The TypewriterMarkdown reveal (`:427`) should also honor reduced motion — when reduced, render fully (pass `enabled={false}` if `matchMedia("(prefers-reduced-motion: reduce)").matches`).

**RTL (HE)** — driven by `document.dir` in `LanguageContext.tsx:46`. Verify after i18n:
- Conversation rows (`:371`) use `ml-auto`/`mr-auto` — these are physical, not logical. In RTL the user/AI message alignment inverts incorrectly. Replace with logical equivalents (`ms-auto`/`me-auto`) or gate on `uiLang`. This is a real RTL bug surfaced by this audit.
- The `→`/`←` directional glyphs in FOLLOW_UPS (`ArrowRight` `:479`) and the new "Browse all lenses" link must flip via `uiLang` (use `ChevronLeft`/`ChevronRight` chosen by `uiLang`, consistent with ia-b6's arrow guidance §41).
- `dir="auto"` on user/AI message text containers so mixed-script content renders correctly.

#### C. Copy — i18n all Ask microcopy (exact strings)
All new keys go to `src/lib/i18n.ts` (NOT `LanguageContext.tsx` — it has no string table, see conflict notes), **appended** to the EN block after the existing `coach.*` keys (~`:163`, after `coach.deleteActive`) and the HE block at the matching position (~`:669`, after the HE `coach.deleteActive`). **Append only — never reorder.** Use the `coach.*` namespace; coordinate with ia-b6 which adds `coach.specialist.*` (no collision — different leaf names).

| key | EN | HE |
| --- | --- | --- |
| `coach.lens.integrated` | `Integrated Balanced` | `משולב מאוזן` |
| `coach.lens.integratedHint` | `The default: connection first, then the next achievable step, then the environment. Pick a named lens when one angle should lead.` | `ברירת המחדל: קשר תחילה, אחר כך הצעד הבא בר-השגה, ואז הסביבה. בחרו עדשה ממוקדת כשצריך להוביל מזווית אחת.` |
| `coach.lens.browseAll` | `Browse all lenses` | `עיון בכל העדשות` |
| `coach.alignedWith` | `Aligned with {lens}` | `מותאם ל-{lens}` |
| `coach.action.copy` | `Copy` | `העתקה` |
| `coach.action.log` | `Log this` | `תיעוד הרגע` |
| `coach.action.plan` | `Save to Action Plan` | `שמירה לתוכנית פעולה` |
| `coach.copied` | `Copied to clipboard` | `הועתק ללוח` |
| `coach.empty.title` | `Ask Arbor anything about {name}` | `שאלו את ארבור כל דבר על {name}` |
| `coach.empty.body` | `Describe a hard moment and you'll get a calm, age-aware next step and the exact words to say.` | `תארו רגע קשה ותקבלו צעד הבא רגוע ומותאם לגיל ואת המילים המדויקות לומר.` |
| `coach.error` | `Arbor couldn't reach the guidance engine. Your question is safe — try again.` | `ארבור לא הצליח להגיע למנוע ההנחיה. השאלה שלכם נשמרה — נסו שוב.` |
| `coach.retry` | `Try again` | `נסו שוב` |
| `coach.voice.talk` | `Talk` | `דברו` |
| `coach.voice.talkHd` | `Talk (HD)` | `דברו (HD)` |
| `coach.voice.listening` | `Listening…` | `מקשיב…` |
| `coach.voice.thinking` | `Thinking…` | `חושב…` |
| `coach.voice.speaking` | `Speaking…` | `מדבר…` |
| `coach.aiLang.label` | `Answer in` | `מענה בשפה` |
| `coach.aiLang.en` | `Answer in English` | `מענה באנגלית` |
| `coach.aiLang.he` | `Answer in Hebrew` | `מענה בעברית` |
| `coach.councilHint` | `Convene 3 scholars — each weighs in, then Arbor synthesizes` | `כינוס 3 מומחים — כל אחד מחווה דעה, ואז ארבור מסכם` |
| `coach.mem.source` | `Source` | `מקור` |
| `coach.mem.retention` | `Retention` | `שמירה` |
| `coach.mem.frame` | `Frame` | `מסגרת` |
| `coach.scenario.morning` | `Morning refusal` | `סירוב בבוקר` |
| `coach.scenario.ipad` | `iPad dispute` | `מריבת מסך` |
| `coach.scenario.sibling` | `Sibling clash` | `מריבת אחים` |
| `coach.scenario.bedtime` | `Bedtime battle` | `מאבק לפני השינה` |
| `coach.scenario.dropoff` | `School dropoff` | `פרידה בגן/בית הספר` |
| `coach.suggest.shoe` | `Shoe departure tantrum` | `התפרצות בזמן נעילת נעליים` |
| `coach.suggest.bilingual` | `Bilingual balance routine` | `איזון שגרת שתי שפות` |
| `coach.followup.avoid` | `What should I avoid saying in that moment?` | `מה כדאי שאמנע מלומר באותו רגע?` |
| `coach.followup.repair` | `How do I repair the connection afterwards?` | `איך אני מתקן את הקשר אחר כך?` |
| `coach.followup.calm` | `Give me a 1-minute calming routine to try.` | `תנו לי שגרת הרגעה של דקה לנסות.` |

**ScholarTab strings** (new keys; `ScholarTab.tsx` currently has zero `t()`):

| key | EN | HE |
| --- | --- | --- |
| `scholar.back` | `Ask Arbor` | `שאל את ארבור` |
| `scholar.eyebrow` | `Ask Arbor · Lens library` | `שאל את ארבור · ספריית עדשות` |
| `scholar.title` | `Scholar Frameworks` | `מסגרות מומחים` |
| `scholar.subtitle` | `A multi-theory developmental system. Pick a scholar to load a focused lens and example prompt straight into Ask Arbor.` | `מערכת התפתחותית רב-תיאורטית. בחרו מומחה כדי לטעון עדשה ממוקדת ושאלת דוגמה ישירות אל שאל את ארבור.` |
| `scholar.focus` | `Focus: {theory}` | `מיקוד: {theory}` |
| `scholar.apply` | `Apply to {name}` | `החל על {name}` |
| `scholar.example` | `Try an example` | `נסו דוגמה` |

The dynamic seed prompts in ScholarTab (`:57,:68`) and SCENARIOS prompts in CoachTab (`:46–50`) are **AI-input strings, not UI chrome** — they are sent to the model in `aiLang`, so they may stay English (the model localizes its reply per `getAiLanguage()`). Keep prompts English; only the **visible labels** are translated. Document this distinction in a code comment so a future translator does not "fix" the prompts.

Copy rationale (rubin-os:copywriter + design:ux-copy): error copy reassures + preserves agency ("Your question is safe — try again") with no blame; empty state names the payoff plainly; aria labels spell out truncated visual labels; voice labels stay in present-progressive to match the live phase. No false urgency, no dark patterns.

### Files to create / edit (exact repo-relative paths)
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/CoachTab.tsx` — route all hardcoded UI strings through `t()` (FOLLOW_UPS, SCENARIOS labels, lens "Integrated Balanced" + hint, "Aligned with", hover-action labels, suggested chips, memory-review labels, voice labels, council title); add radiogroup a11y on lens picker; add aria-label/visible label + aria-pressed on AI-language toggle; un-gate hover-action buttons for touch+keyboard (`opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100`); add 44pt min hit areas; add empty-state block; **add the error state** (read `apiError`, render alert card + Retry); add `aria-live` to loading status; add `prefers-reduced-motion` guards; add "Browse all lenses" link; fix RTL physical→logical alignment (`ml/mr-auto`→`ms/me-auto`) and directional glyphs.
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/ScholarTab.tsx` — import + use `useLanguage().t`; replace all hardcoded strings with the `scholar.*` keys; update eyebrow to "Ask Arbor · Lens library"; ensure RTL-safe (`PageHeader`, back-link glyph). No structural/logic change.
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append the `coach.*` and `scholar.*` keys above to EN (~`:163`) and HE (~`:669`) blocks. **Append only.**
- **No edit to** `PPPPtherapy-/PPPPtherapy-/app/src/context/LanguageContext.tsx` — it is a thin consumer; the string store is `i18n.ts`. (The work-item names it defensively; surf-ask adds **zero** keys to LanguageContext, contributing no merge surface there.)
- **No edit to** `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.ts` — surf-ask uses existing tabs (`coach`, `scholar`); adds no nav leaf (per IA section A).

### Shared-file conflict notes
- **`CoachTab.tsx`** (hotspot: `ia-b6-ask-from-ask`, `m3-hex-sweep`, **surf-ask**). Strict order: **ia-b6 first** (structural: specialist footer + onEscalate re-point), **then surf-ask** (this pass — i18n + states + a11y on the settled structure), **then m3 last** (mechanical hex→token on the final JSX). surf-ask must (a) **not** add a specialist door — ia-b6 owns it; (b) leave inline colors as the existing `var(--…)`/hex *as found* so m3's sweep is clean — when surf-ask adds new JSX (empty/error blocks), use **CSS variables only** (`var(--arbor-pink-soft)`, `var(--arbor-muted)`, `var(--arbor-paper-deep)`), never new hex literals, so m3 has nothing new to sweep. If surf-ask lands before ia-b6 by scheduling accident, ia-b6 rebases its two small edits onto surf-ask's CoachTab (both are additive/local).
- **`LanguageContext.tsx`** (hotspot: `b5`, `ia-b6`, **surf-ask**, `surf-academy` — "append only; reconcile collisions in b5 final pass"). surf-ask adds **no** keys here (real strings live in `i18n.ts`). Flag for b5's final i18n reconciliation pass that surf-ask introduced the `coach.*` (28 keys) and `scholar.*` (8 keys) namespaces in `i18n.ts`; they are append-only and collision-free with ia-b6's `coach.specialist.*` and surf-academy's keys.
- **`i18n.ts`** (also touched by `mk-p0-8-copy-pack`, `mk-p2-1-localize-nl`, `mk-p2-7-paywall-experiments` per shared-file map). All append to the EN/HE maps; merge by appending only, no reordering. surf-ask's keys are uniquely `coach.*`/`scholar.*`-namespaced — no collision with marketing/paywall keys.
- **`navigation.ts`** — surf-ask contributes **zero** merge surface (no edit); it consumes the settled IA. If b1/b2/b3/ia-b1/b5 relocate the Ask leaf, surf-ask only needs `coach` and `scholar` to remain valid `ActiveTab`s (they are, `ArborContext.tsx:56,:62`).

### Dependencies (other item ids that must land first)
- **`ia-b6-ask-from-ask`** — owns the structural Ask edits (specialist footer affordance, `onEscalate` re-point) in the same file. surf-ask polishes on top of the settled structure and must not duplicate the specialist door. (ia-b6 is Phase2 in its own spec but is a hard *ordering* dependency for the CoachTab file; if ia-b6 slips, surf-ask may land first and ia-b6 rebases its two local edits — coordinate, do not block indefinitely.)
- **`m3-hex-sweep`** — ordering dependency in the *other* direction: m3 lands **after** surf-ask so it sweeps the final JSX (including surf-ask's new blocks, which by rule contain only CSS-var colors). surf-ask does not depend on m3 to function.

### Acceptance criteria (testable, including "verified live on dev server")
1. With dev server running (`npm run dev` in `PPPPtherapy-/PPPPtherapy-/app`), switching UI language to HE (`uiLang === "he"`) renders **every** visible label on the Ask tab and the Scholar Frameworks view in Hebrew — no English chrome leaks (verified by visual scan of lens chips, scenario chips, follow-ups, hover actions, memory-review labels, voice button, council, ScholarTab cards). RTL layout is correct and message rows align to the correct side.
2. A forced coach/council failure (e.g. offline or 500) renders an **inline error card with `role="alert"`** and a working **Retry** that re-sends the last user message — verified live by killing the network mid-send.
3. A fresh conversation shows the calm empty-state block (mascot + `coach.empty.*`) above the scenario chips — verified live.
4. The Copy / Log this / Save-to-plan actions are **visible and tappable on a mobile viewport** (DevTools device emulation) without hover, and reachable+activatable by keyboard (Tab → focus reveals → Enter) — verified live.
5. The lens picker is a `role="radiogroup"`; arrow keys move selection, Enter/Space selects, `aria-checked` tracks `selectedLens` — verified via keyboard + a SR/axe check.
6. All interactive Ask controls (lens chips, language toggle, hover actions, voice, council, browse-lenses) meet **≥44×44pt** hit area on mobile emulation.
7. `prefers-reduced-motion: reduce` disables the container entrance, the chip hover-lift, and the typewriter reveal (text renders complete) — verified by toggling the OS/DevTools setting.
8. "Browse all lenses" from CoachTab routes to `scholar` (Scholar Frameworks), and its back-link returns to `coach` — round-trip verified live; sidebar stays highlighted on **Ask** for both (per `sectionForTab` `scholar→ask`).
9. `npm run build` / `tsc --noEmit` passes; the 241-test suite stays green; `navigation.test.ts` unaffected (no new tab id).
10. No new hardcoded hex introduced by surf-ask's added JSX (grep the diff for `#[0-9a-fA-F]{3,8}` in the added lines → only CSS variables) — keeps m3's later sweep clean.

### Operating-rule checks
- **No dark patterns:** error copy reassures without blame and offers a real retry; empty state informs, never nags; the AI-language toggle is plainly labeled; no manufactured urgency anywhere on the pillar. The "Browse all lenses" link is a quiet, opt-in IA edge, not a steering nag.
- **Privacy / COPPA-2026:** surf-ask ships **no new data path**. It only translates labels, adds presentation states, and improves a11y. The memory-review queue (`CoachTab.tsx:599–674`) — the parent-approval gate that keeps proposed observations out of active child memory until approved — is untouched; surf-ask only translates its labels, preserving the consent gate verbatim.
- **Moat read/write:** surf-ask makes the moat's existing reads/writes **more legible** without changing them. The memory-review queue (parent-approved writes to the longitudinal record) and the coach answer's context-grounding (reads of `childProfile`/history via `handleChatSend`) are unchanged; the empty-state copy ("…anything about {name}") and "Aligned with {lens}" badge make the personalization the moat enables *visible* to the parent. No new write.
- **Ships-visible:** every change is a visible, interactive improvement on the Ask pillar in production builds (HE parity, error recovery, mobile-reachable actions, keyboard a11y) — no flagged-off or backend-only work.
