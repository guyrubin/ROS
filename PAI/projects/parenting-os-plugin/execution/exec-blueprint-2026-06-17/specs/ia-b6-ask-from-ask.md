## ia-b6-ask-from-ask — Surface Ask-a-Specialist entry from Ask pillar
**Aspects:** IA, Copy · **Surfaces/platforms:** web:Ask · **Priority:** Phase2

### Problem / why
The redesigned IA map (B6) places **Ask-a-Specialist under both the Ask pillar and Care**, because a parent who has just asked Arbor a hard question is exactly the person most likely to want a human professional next — but today the Ask pillar (`coach` tab, `CoachTab.tsx`) has **no path to the specialist handoff**. The only escalation affordance in CoachTab is `TrustSafetyBar`'s `onEscalate`, which routes to `find-pro` (the *directory* of professionals), not to the **Ask-a-Specialist warm-handoff packet** flow (`AskSpecialist.tsx`, which lives as the default `ask` panel inside the `consult` tab). Result: the highest-intent moment in the app (right after a coach answer, or after a Moderate/High risk read) dead-ends at a directory instead of the redacted packet a parent can actually take to their own clinician.

B6 adds a **second, deliberate entry point** from the Ask pillar into the Ask-a-Specialist flow that c3 already owns on the Care side. B6 does **not** build or modify the handoff/packet flow itself (that is `c3-ask-specialist`'s job) — it only surfaces the door and writes the copy for it.

### Scope across platform domains
- **Web (Ask pillar / `CoachTab.tsx`):** add an "Ask a specialist" entry affordance that routes to the Ask-a-Specialist flow. This is the only surface that changes.
- **iOS (Capacitor) / Android (Capacitor):** no platform-specific code. The web `CoachTab` renders inside the Capacitor shell unchanged; the new affordance must meet the 44×44pt touch-target minimum so it works on mobile (covered under a11y below). No `capacitor.config.ts` / `native.ts` changes.
- **Landing EN / Landing HE:** not in scope.

### IA / UX / Copy detail

**IA decision — where the entry routes.**
`AskSpecialist` is the **first panel (`id: "ask"`) of `ConsultTab`'s `HubTabs`** (`ConsultTab.tsx:21`). `HubTabs` always initializes to `panels[0]` (`HubTabs.tsx:18`) and exposes **no initial-panel / deep-link prop**. Therefore routing `setActiveTab("consult")` lands the user directly on the Ask-a-Specialist panel with zero new API surface. **Route to `"consult"`, not `"find-pro"`.** Do not add a deep-link param to `HubTabs` — that file is c3/b3 territory and an initial-panel prop is out of B6 scope.

**Two placements in `CoachTab.tsx` (both small, additive):**

1. **Persistent footer affordance (primary).** In the input footer block (`CoachTab.tsx:507–538`), add a third row beneath the multimodal-capture row — a quiet, always-available text link/button: "Want a human? **Ask a specialist** →". This is the durable Ask-pillar door required by the IA map; it must exist regardless of conversation state.
   - Variant style: `text-[11px] font-bold`, `color: var(--arbor-muted)` with the action word in `var(--arbor-green-ink)`; no filled background (keep the footer calm, parent-register). Icon: `Stethoscope` from `lucide-react` (already the icon used for this flow in `ConsultTab.tsx:21`), `w-3.5 h-3.5`.
   - `onClick={() => { setActiveTab("consult"); toast(t("coach.specialist.toast"), "info"); }}`.

2. **Contextual upgrade on the TrustSafetyBar escalation (secondary, copy-only re-point).** The existing `TrustSafetyBar` (`CoachTab.tsx:591–597`) currently sends `onEscalate` to `find-pro`. Per the IA map, the *escalation* from a coach answer should lead to the **warm handoff** (packet you can hand a professional), not the raw directory. **Re-point `onEscalate` to `setActiveTab("consult")`.** This keeps directory-browsing reachable (it is the `find` panel one tap away inside Consult) while making the high-intent escalation land on the packet. Leave the `risk`/`note` props untouched (those are c3/p2-8 territory).

**States (the new footer affordance):**
- **Default:** visible, enabled, quiet link styling.
- **Loading (`isChatLoading === true`):** do **not** disable — the specialist door is navigation, not a model action; a parent mid-stream may want out to a human immediately. Keep it interactive. (Contrast with Send/Council which are disabled during load.)
- **Empty / no conversation yet:** still shown (it is a persistent pillar door, independent of `chatMessages.length`).
- **Error:** n/a — navigation only; no async, no failure path.

**Motion:** none beyond the existing `transition` utility on hover (subtle color shift). No new entrance animation — respect the calm parent register and `prefers-reduced-motion` (no transform-based motion added).

**Touch targets / a11y (AA):**
- Min hit area 44×44pt: pad the link to `py-2` and ensure the clickable element (not just the text) spans full height; if rendered as inline text, wrap in a `<button>` with `min-h-[44px]` padding on mobile.
- Keyboard: it is a real `<button>` → focusable, Enter/Space activate. Add `focus-visible` ring consistent with other footer buttons.
- Screen reader: `aria-label={t("coach.specialist.aria")}` so the truncated visual label reads as a full intent ("Ask a human specialist — open the consult handoff").
- `prefers-reduced-motion`: nothing to gate (no motion added).

**RTL (HE):** the affordance uses flex with `gap` and the lucide icon; in `dir="rtl"` (driven by `LanguageContext.tsx:46`) the icon naturally flips to the trailing side via flex order — verify the `→` arrow glyph is replaced with `←` for HE or, preferably, drop the literal arrow and rely on the `ChevronLeft`/`ChevronRight` lucide icon chosen by `uiLang` so direction is correct in both. All visible strings come from `t(...)`, never hardcoded.

**Copy (exact strings — add to `src/lib/i18n.ts`, EN block ~line 163 after `coach.deleteActive`, and HE block ~line 539+ at the matching position):**

| key | EN | HE |
| --- | --- | --- |
| `coach.specialist.cta` | `Ask a specialist` | `שאל מומחה` |
| `coach.specialist.lead` | `Want a human?` | `רוצה לדבר עם איש מקצוע?` |
| `coach.specialist.toast` | `Opening the specialist handoff — you choose what to share.` | `פותח את ההעברה למומחה — אתה בוחר מה לשתף.` |
| `coach.specialist.aria` | `Ask a human specialist — open the consult handoff` | `פנייה לאיש מקצוע — פתיחת ההעברה לייעוץ` |

Copy rationale (rubin-os:copywriter + design:ux-copy): lead with the parent's want ("Want a human?"), name the action plainly ("Ask a specialist"), and the toast sets honest expectations and reinforces parent control ("you choose what to share") — no false urgency, no implication that a specialist is instantly on call (the marketplace is Phase-2 and signalled honestly inside `AskSpecialist.tsx:11`). Do not imply a paid/booked consult exists; this is a door to the redactable packet.

### Files to create / edit (exact repo-relative paths)
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/CoachTab.tsx` — import `Stethoscope` (extend the existing `lucide-react` import on line 3); add the persistent footer affordance in the footer block (after line 538, inside the `p-4 space-y-2` container); re-point `TrustSafetyBar onEscalate` (line 595) from `"find-pro"` to `"consult"`. `setActiveTab`, `t`, and `toast` are already in scope (lines 75, 87, 88).
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append the four `coach.specialist.*` keys to the EN map (after `coach.deleteActive`, ~line 163) and the HE map (matching position, ~line 539+). **Append only; do not reorder existing keys.**
- **No edit needed to** `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.ts` — routing uses the existing `consult` tab; `consult` is already a primary item under `care` (navigation.ts:76) and `sectionForTab` resolves correctly, so the sidebar highlights Care when the user lands there. (The work-item lists navigation.ts as a shared file defensively; B6 should touch it **only if** a regression test reveals a missing fallback — none expected.)
- **No edit needed to** `PPPPtherapy-/PPPPtherapy-/app/src/context/LanguageContext.tsx` — it is a thin consumer of `i18n.ts`; the actual key store is `i18n.ts`. (Work-item/conflict map names LanguageContext, but the strings live in i18n.ts — see conflict note below.)

### Shared-file conflict notes
- **`src/lib/navigation.ts`** (hotspot: `b1/b2/b3, b5, ia-b1, ia-b6, surf-app-shell`). Per the hotspot guidance, IA edits to this file are serialized: **land b1/b2/b3 pillar reorgs first, then ia-b1 + ia-b6, then b5 last.** B6's design deliberately requires **no `navigation.ts` change** (routes to the existing `consult` tab), so B6 contributes **zero merge surface** here — it can land in its IA slot without touching SECTIONS or TAB_SECTION_FALLBACK. If b1/b2/b3 rename or relocate the Care/Consult entry, B6 only needs to confirm `"consult"` is still a valid `ActiveTab` (it is, `ArborContext.tsx:92`).
- **`src/context/LanguageContext.tsx`** (hotspot: `b5, ia-b6, surf-ask, surf-academy` — "merge by appending only; reconcile collisions in b5 final pass"). The real string additions go to **`src/lib/i18n.ts`**, not LanguageContext (LanguageContext has no string table). Add the four `coach.specialist.*` keys by **appending only**, in both EN and HE blocks; pick the unused `coach.specialist.*` namespace to avoid collision with surf-ask's `coach.*` additions. Flag for b5's final i18n reconciliation pass that these keys exist.
- **`src/components/tabs/CoachTab.tsx`** (hotspot: `ia-b6, m3-hex-sweep, surf-ask`). B6 adds a small footer block + a one-line `onEscalate` target change. **m3-hex-sweep** rewrites hardcoded hex → tokens in this file; B6 must use **CSS variables only** (`var(--arbor-muted)`, `var(--arbor-green-ink)`, `var(--arbor-rule)`) for the new affordance so it does not reintroduce hex that m3 then has to sweep. **surf-ask** is the broader Ask-pillar polish pass; coordinate so surf-ask treats the B6 affordance as the canonical specialist door and does not add a duplicate. Land B6 before surf-ask, or have surf-ask absorb it.

### Dependencies (other item ids that must land first)
- **`c3-ask-specialist`** — owns the Ask-a-Specialist flow (`AskSpecialist.tsx`, the `consult` `ask` panel, `consult/packet.ts`). B6 is a pure entry point into c3's destination; the destination must exist and be the default Consult panel before B6's door is meaningful. (It already is in the current tree, but B6 ships **after** c3 so the routed flow reflects c3's final shape.)

### Acceptance criteria (testable, including "verified live on dev server")
1. With dev server running (`npm run dev` in `PPPPtherapy-/PPPPtherapy-/app`), on the **Ask Arbor** tab a persistent "Want a human? Ask a specialist" affordance is visible in the input footer in **both** empty and active-conversation states.
2. Clicking/tapping it navigates to the **Consult** tab with the **Ask a specialist** panel active (the redactable packet view from `AskSpecialist.tsx`), and a toast reading "Opening the specialist handoff — you choose what to share." appears.
3. The affordance remains **enabled while a coach answer is streaming** (`isChatLoading === true`) — verified by clicking it mid-stream and landing on Consult.
4. The `TrustSafetyBar` escalation (shown after an AI answer) now routes to the **Consult / Ask-a-specialist** flow, not the bare `find-pro` directory — verified by triggering an AI answer and clicking the bar's escalate action.
5. Switching UI language to HE (`uiLang === "he"`) renders the Hebrew strings, RTL layout is correct, and the directional glyph points left (no literal `→` left in HE) — verified live.
6. Keyboard: the affordance is reachable via Tab, shows a visible focus ring, and activates on Enter/Space — verified live.
7. Touch target ≥ 44×44pt on a mobile viewport (DevTools device emulation) — verified live.
8. `npm run build` / `tsc` passes; existing `navigation.test.ts` and the suite stay green (no new tab id introduced, so no test churn expected).
9. No hardcoded hex in the added code (grep the diff) — only CSS variables.

### Operating-rule checks
- **No dark patterns:** the door is a quiet, opt-in link with honest copy; it never nags, never auto-routes, and does not imply an instant paid consult (the marketplace is Phase-2 and surfaced honestly downstream). Escalation re-point makes the *helpful* destination (a packet the parent controls) the default rather than steering to a directory.
- **Privacy / COPPA-2026:** B6 ships **no data**. It only navigates. All redaction/consent for what leaves the device is owned by `AskSpecialist.tsx` (c3), which keeps the packet on-device until the parent explicitly exports (Safety L3). The toast copy reinforces parent control ("you choose what to share").
- **Moat read/write:** B6 routes into the Ask-a-Specialist flow, which **reads** the longitudinal record (profile, logs, milestones, plans, approved memory — `AskSpecialist.tsx:28–41`) to build the handoff packet. B6 itself adds no new write; it strengthens the moat's payoff by making the record-derived packet reachable from the highest-intent moment. No new write path is in B6 scope.
- **Ships-visible:** the affordance is a visible, interactive element on the Ask pillar in production builds — it is not a flagged-off or backend-only change.
