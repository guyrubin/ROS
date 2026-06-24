## b3-care-consult — Care -> single Consult flow
**Aspects:** IA, UI/UX, Copy · **Surfaces/platforms:** web:Care · **Priority:** Phase2

> Build-ready spec. Grounded in the live React app at `PPPPtherapy-/PPPPtherapy-/app/src`. Every path below was confirmed to exist on 2026-06-17. Skills applied: `impeccable` (interaction/visual craft), `design:design-handoff` (states/tokens/props), `design:accessibility-review` (AA/keyboard/RTL), `design:ux-copy` (microcopy strings).

---

### Problem / why

Care today is `Care Network` with five leaves (`navigation.ts:71-82`): `consult`, `care-team`, `sharing`, `appointments`, `safety`. The `consult` leaf is itself a **three-faceted HubTabs shell** (`ConsultTab.tsx:18-24`) wrapping three legacy components that all answer the same parent job — "get expert input on my child" — three different, confusable ways:

1. **Ask a specialist** (`AskSpecialist.tsx`) — the *good* design: builds a redactable packet from the child's real record (`consult/packet.ts`), parent picks what to include, exports Markdown. This is the warm handoff and the moat surface.
2. **AI handoff brief** (`Reports.tsx`) — a grid of 8 one-click PDF report types (`Reports.tsx:9-18`) **plus** a card that deep-links to a *separate* `handoff` tab (`Reports.tsx:42-55` → `HandoffTab.tsx`) which is a *fourth* AI-brief generator with its own audience picker. Redundant with both the packet and the report grid.
3. **Find a professional** (`FindProfessional.tsx`) — a verified directory with a real consult-request transaction (`FindProfessional.tsx:73-90`).

So a parent who wants to "bring a specialist up to speed" faces: 3 hub facets + a hidden 4th tab (`handoff`) + 8 report buttons + a directory + 3 different "share a summary" buttons that toast inconsistent copy (`Reports.tsx:48`, `FindProfessional.tsx:194`, `AskSpecialist.tsx:49-61`). That is not "one verb for get expert input" — it is four overlapping export builders. Redesign B3 collapses this into **one transactional Consult flow**: *packet → choose recipient/format → export or send*. `HandoffTab` (the legacy 4th door) is retired; `Reports` becomes an export-format chooser *inside* the packet flow, not a parallel door; `FindProfessional` becomes the "send to a professional" target reached *from* the packet, not a sibling facet. Sharing / Appointments / Safety stay distinct Care leaves (different jobs: ongoing access grants, scheduling, crisis).

This mission **owns the `web:Care` surface**, **hosts `c3-ask-specialist`** (which extends the same packet/send rail), and **subsumes** the IA cleanup mission `ia-b4-care-consult-cleanup`. **GDPR sign-off gate**: nothing leaves the device without an explicit parent export action.

---

### Scope across platform domains

- **Web (primary, in scope):** Replace the `ConsultTab` HubTabs shell with a single linear Consult flow. Retire `handoff` as a routed door. Re-home `Reports` as an in-flow export-format step and `FindProfessional` as a "send" destination. Update `navigation.ts` Care section + `TAB_SECTION_FALLBACK`.
- **iOS / Android (Capacitor):** No platform-specific code. The web Care surface renders inside the Capacitor shell unchanged; verify the new sticky export bar respects safe areas (defer the actual `env(safe-area-inset-*)` work to `m1-ios-safe-area`; this spec only ensures the sticky bar uses the existing `.pb-safe`/shell padding and does not hard-pin to `bottom: 0`).
- **Landing EN / Landing HE:** Out of scope. No marketing-page change.

---

### IA / UX / Copy detail

#### A. Target IA (reconciled with `navigation.ts`)

Care section stays `Care Network` with the **same five leaves** — the change is *inside* the `consult` leaf, plus retiring `handoff` and `reports`/`find-pro` as independently-surfaced routes.

```
Care Network (id: "care")
├─ consult        → Consult (the single flow — this mission)
├─ care-team      → My Care Team        (unchanged)
├─ sharing        → Trusted Sharing      (unchanged)
├─ appointments   → Appointments         (unchanged)
└─ safety         → Safety & Escalation  (unchanged)
```

Routes `reports`, `handoff`, `find-pro` remain **valid deep-link tabs** in `VALID_TABS` (`ArborContext.tsx:96-100`) so existing links/bookmarks don't 404, but they are no longer surfaced as primary items and `TAB_SECTION_FALLBACK` continues to map them to `"care"` (`navigation.ts:121-124`). `handoff` is the one capability genuinely *deleted* (it is a strict subset of the packet + reports) — its fallback entry is removed and the route resolves to the Consult flow.

#### B. The single Consult flow (`ConsultTab.tsx`, rewritten)

Replace the HubTabs wrapper with a **single scrollable page** that promotes `AskSpecialist`'s packet as the spine and folds reports/find-pro in as actions, not facets. Structure top→bottom:

1. **Header** — reuse the existing strings: eyebrow `t("consult.eyebrow")`, title `t("consult.title")`, subtitle `t("consult.subtitle", { name })` (already in `i18n.ts:124-126`, both EN+HE).
2. **Trust line (Safety L3)** — keep the green `ShieldCheck` band, `t("consult.trust")` (`i18n.ts:127`). This is the GDPR/COPPA promise; it must stay above the fold.
3. **Packet builder** — the redactable sections from `AskSpecialist.tsx:88-120` (drives off `buildConsultPacket`). This is the moat read: it surfaces approved longitudinal memory ("Context worth knowing", `packet.ts:118-128`).
4. **Export & send bar (sticky)** — the single transactional control. Replaces the three scattered export buttons. Contains:
   - **`{n} details selected`** counter — `t("consult.selected", { n })` (`i18n.ts:128`).
   - **Copy** (`t("consult.copy")`) — Markdown to clipboard (existing `copy()` in `AskSpecialist.tsx:49-52`).
   - **Download** (`t("consult.download")`) — Markdown `.md` (existing `download()` `AskSpecialist.tsx:53-61`).
   - **Export as PDF ▾** — *new* menu that replaces the standalone `Reports` grid. Opens a small popover listing the 8 report types from `Reports.tsx:9-18` (Weekly Insight, Teacher Handoff, Therapist Summary, Pediatrician Summary, Development Snapshot, Behavior Pattern, Language Transition, Growth Plan Progress). Each calls the existing `buildReport(type, ctx)` → `openPrintableReport(doc, name)` (`reportExport.ts:43,114`) — no new export engine. New i18n key `consult.exportPdf` = `"Export as PDF"`.
   - **Send to a professional** — replaces the dead `t("consult.sendSoon")` disabled button. In Phase-2 this opens the directory + consult-request transaction from `FindProfessional.tsx` (kept as a component, rendered in a `Modal` or routed to `find-pro` with the current packet handed off). The button carries the **selected packet** so the consult note prefills from it instead of the hardcoded string at `FindProfessional.tsx:68`. New i18n key `consult.send` = `"Send to a professional"`.

> Net result: one page, one spine (the packet), one action bar with four honest verbs (Copy / Download / Export as PDF / Send). No HubTabs, no hidden `handoff` door, no triple "share a summary" buttons with inconsistent toasts.

#### C. UI states (design:design-handoff)

For the **rewritten `ConsultTab`** and the **Export-as-PDF popover**:

- **Default:** packet rendered, all items checked, counter shows total, all four actions enabled (Send may be visually de-emphasized as secondary if the directory isn't yet wired — but it must *do something* real, not a `disabled` no-op; if c3 hasn't landed, route to `find-pro`).
- **Loading:** packet build is synchronous (pure `buildConsultPacket`), so no spinner for the spine. The PDF export uses `openPrintableReport` which opens a new tab — show a 1-line inline status `"Opening report…"` (new key `consult.opening`) for ~600ms via toast (reuse `useToast`).
- **Empty:** if the child record yields zero packet sections (new profile, no logs/milestones/memory — `buildConsultPacket` returns `sections: []`), render an empty state inside the spine: heading "Nothing to summarise yet" + body "Log a moment or check a milestone and Arbor will build a shareable summary here." + CTA button → `setActiveTab("behaviors")`. New keys `consult.empty.title`, `consult.empty.body`, `consult.empty.cta`. Export/Send buttons disabled when `includedCount === 0` (existing pattern `AskSpecialist.tsx:127-135`).
- **Error:** clipboard failure already handled (`AskSpecialist.tsx:51` → toast "Could not copy. Try Download instead."). PDF: if `buildReport` throws, toast `consult.exportError` = `"Couldn't build that report — try again."`. Send: directory fetch failure already falls back to `FALLBACK` list (`FindProfessional.tsx:92-104`) — preserve.

#### D. Motion & touch (impeccable + accessibility)

- Page mount: keep the existing `motion.div` fade+rise (`AskSpecialist.tsx:64-66`, `opacity 0→1, y 10→0, duration 0.2`). Wrap in `prefers-reduced-motion` — if reduced, drop the `y` translate and set duration 0 (Motion `useReducedMotion` or a CSS `@media` guard).
- Export-as-PDF popover: scale/opacity in (150ms), `transform-origin` bottom; under reduced-motion, opacity-only.
- Sticky bar shadow `var(--shadow-md)` (existing). Do not animate on scroll.
- **Touch targets:** all action buttons ≥ 44×44 CSS px. Current export buttons are `px-4 py-2.5` (~40px tall) — bump to `py-3` to clear 44px. Redaction checkboxes (`AskSpecialist.tsx:104`) are `py-2` rows with a 20px box but the full-width `button` row is the hit area (≥44px) — keep that, do not shrink to the box.

#### E. Accessibility (design:accessibility-review, WCAG 2.1 AA)

- Redaction toggles already use `aria-pressed` + strikethrough (`AskSpecialist.tsx:103,110`) — keep; add `aria-label` on each row: "Include: {item text}" / announce state via `aria-pressed`.
- Export-as-PDF popover: trigger `aria-haspopup="menu" aria-expanded`; popover `role="menu"`, items `role="menuitem"`; Esc closes and returns focus to trigger; arrow-key navigation between items; focus trapped while open.
- Counter "{n} details selected" must be in an `aria-live="polite"` region so screen readers hear the count change when items are toggled.
- Color contrast: the green CTA gradient text is white on `#3cc081`→clay — verify ≥ 4.5:1; the muted counter text (`--arbor-muted`) on elevated paper must hit ≥ 4.5:1 (flag for `m3-hex-sweep` if it fails, do not hardcode a new hex here).
- **RTL:** flow is already document-`dir`-driven (`LanguageContext.tsx:43-48`). The sticky bar must use logical properties (`gap`, `margin-inline`) not `mr-auto`-left assumptions — replace `mr-auto` (`AskSpecialist.tsx:124`) with `me-auto` (margin-inline-end) so the counter sits correctly in HE. The Export popover must open toward the inline-start in RTL.

#### F. Copy (design:ux-copy) — exact strings to add to `lib/i18n.ts` (both `en` and `he` dicts)

| Key | EN | HE |
| --- | --- | --- |
| `consult.exportPdf` | Export as PDF | ייצוא כ-PDF |
| `consult.send` | Send to a professional | שליחה לאיש מקצוע |
| `consult.opening` | Opening report… | פותח דוח… |
| `consult.exportError` | Couldn't build that report — try again. | לא הצלחנו לבנות את הדוח — נסו שוב. |
| `consult.empty.title` | Nothing to summarise yet | אין עדיין מה לסכם |
| `consult.empty.body` | Log a moment or check a milestone and Arbor will build a shareable summary here. | תעדו רגע או סמנו אבן דרך, וארבור יבנה כאן סיכום לשיתוף. |
| `consult.empty.cta` | Log a moment | תיעוד רגע |

Reuse existing `consult.*` keys (`i18n.ts:121-131`) for header/trust/counter/copy/download. **Remove** `consult.sendSoon` usage (the dead disabled button) — leave the key in the dict to avoid HE-collision churn (cleanup deferred to `b5-naming-moat-exposure`'s i18n pass). The legacy facet labels `consult.ask`/`consult.brief`/`consult.find` (`i18n.ts:121-123`) become unused once HubTabs is gone — also leave for b5.

---

### Files to create / edit (exact repo-relative paths)

**Edit:**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/ConsultTab.tsx` — **rewrite**: remove HubTabs wrapper; compose the single flow (header + trust + packet builder + export/send bar). Lift the packet/redaction logic from `AskSpecialist.tsx` (or render `AskSpecialist` as the spine and add the new export bar around it — preferred to minimise duplication while c3 is in flight).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/AskSpecialist.tsx` — extend the export bar: replace the disabled `sendSoon` button with **Export as PDF ▾** (menu) and **Send to a professional**; wire `buildReport`/`openPrintableReport`; pass the serialized packet to the send path. (This is the shared seam with `c3-ask-specialist` — see conflict notes.)
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/Reports.tsx` — **demote**: remove the "School & Care Handoff" deep-link card (`Reports.tsx:42-55`, kills the `handoff` door) and the page chrome; export the 8-type list/`exportReport` as a reusable hook/array so the Consult export menu consumes it. Keep `reports` route resolving (renders the export menu standalone for deep links).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/FindProfessional.tsx` — accept an optional incoming packet/note prop so "Send to a professional" prefills the consult-request note from the selected packet instead of the hardcoded `FindProfessional.tsx:68` string; fix the inconsistent toast at line 194 to route into the Consult flow.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/navigation.ts` — Care section already correct (`navigation.ts:75-81`); remove `handoff` from `TAB_SECTION_FALLBACK` (`navigation.ts:124`) since the door is retired, keep `reports`/`find-pro` mapping to `"care"`.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — add the 7 new keys above to both `en` and `he` dicts (append after the existing `consult.*` block at `i18n.ts:131` / `:627`; append-only, no reorder).

**Retire (do not delete the file; stop routing to it):**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/HandoffTab.tsx` — no longer reachable as a primary route. Leave the file (a later cleanup pass deletes it) but remove all `setActiveTab("handoff")` callers (only `Reports.tsx:48`). Its sole non-redundant feature (audience-tailored AI brief) is already covered by the `teacher`/`therapist`/`pediatrician` report types in `Reports.tsx:11-13`.

**No new files required** — the flow reuses existing components and the existing `consult/packet.ts` + `reportExport.ts` engines.

---

### Shared-file conflict notes

Per the conflict hotspot list:

- **`navigation.ts`** (hotspot: serialize all IA edits — "land b1/b2/b3 pillar reorgs first, then ia-b1 + ia-b6, then b5"). This mission's nav change is **small and additive-removal only** (one line out of `TAB_SECTION_FALLBACK`). Land it in the b1→b2→**b3** wave. Touch **only** the Care section + the single `handoff` fallback line; do **not** reorder `SECTIONS` or rename ids (that is b5's final pass). Coordinate with `surf-app-shell` which consumes the settled result.
- **`consult/packet.ts`** (hotspot: "Land b3+c3 together (same flow), then p2-8 extends the same packet; b5 adds moat copy last"). **b3 and c3-ask-specialist must land as one PR** — they share the packet spine and the export/send bar. This spec does **not** change `packet.ts`'s shape; c3 owns the packet content/section additions, b3 owns the flow/IA shell around it. Do not change `BuildPacketInput` here — p2-8 (red-flag) extends it after.
- **`ConsultTab.tsx`** (touchedBy b3 + c3): b3 owns the structural rewrite; c3 layers specialist content. Do the rewrite first, hand c3 the stable component.
- **`Reports.tsx`** (touchedBy p2-hero-everywhere + b3 + c3): keep the **clinical PDF path single** — b3 only *re-homes* the existing `buildReport` call; it must not fork a second exporter. p2-hero adds branding to the same `buildReport` doc. Coordinate so all three import the one exporter.
- **`reportExport.ts`** (hotspot: "clinical PDF vs branded-image share — build image renderer beside, not inside, buildReport"). b3 is a **clinical-PDF consumer only** — it calls `buildReport`/`openPrintableReport` as-is, adds nothing. Stay out of the marketing image-share renderer (`mk-p0-3`).
- **`FindProfessional.tsx`** (touchedBy b3 only) — low conflict; the prop addition is self-contained.
- **`LanguageContext.tsx` / `i18n.ts`** (hotspot: append-only, reconcile collisions in b5): append the 7 new keys at the end of the `consult.*` block in both dicts; never reorder. Leave dead `consult.sendSoon`/`consult.ask`/`consult.brief`/`consult.find` keys for b5's i18n cleanup.

---

### Dependencies (must land first / together)

- **`c3-ask-specialist` — land *together* in the same PR** (shared packet flow + export bar). Not a "before" dependency; a co-dependency.
- **`b1-daily-home` and `b2-mychild-story-spine` — land *before*** (navigation.ts serialization order: b1 → b2 → b3 → ia-b1 → ia-b6 → b5).
- No hard dependency on p2-8 (red-flag) or b5 — those extend after b3.

---

### Acceptance criteria (testable)

1. The `consult` leaf renders **one scrollable flow** (header → trust → packet → export/send bar), **no `role="tablist"` HubTabs** sub-nav. (`ConsultTab.tsx` no longer imports `HubTabs`.)
2. The export/send bar shows exactly four actions: **Copy, Download, Export as PDF (menu), Send to a professional** — and **no disabled "Send to an Arbor specialist (soon)" button** remains.
3. **Export as PDF** menu lists all 8 report types and each opens a printable report via the existing `openPrintableReport` (no second export engine introduced; `grep` shows `buildReport` called from one place).
4. The `handoff` route is **no longer reachable from any UI button** (`grep setActiveTab(\"handoff\")` returns 0 hits); deep-linking `#/handoff` resolves into the Care/Consult surface (still in `VALID_TABS`).
5. **GDPR gate:** nothing is transmitted or written off-device on page load or on toggle; data only leaves on an explicit Copy / Download / Export / Send action. (Verified: no network call fires from `ConsultTab` mount except the existing `find-pro` directory `GET /api/professionals`.)
6. Empty state appears when the packet has zero sections, with a working "Log a moment" CTA → `behaviors` tab; export buttons disabled.
7. **Keyboard:** Tab reaches every action; Export menu opens/closes with Enter/Esc, arrow-navigable, focus returns to trigger.
8. **RTL:** in `he`, the counter sits inline-start, the export menu opens inline-start, no left-pinned `mr-auto` regressions.
9. **reduced-motion:** mount + popover animations collapse to opacity-only (or none).
10. **Verified live on dev server:** run the app (`npm run dev` in `PPPPtherapy-/PPPPtherapy-/app`), open `#/consult`, confirm: single flow renders, redaction toggles update the live counter, "Export as PDF → Therapist Summary" opens a printable tab, "Send to a professional" reaches the directory + consult request, HE toggle mirrors layout. `tsc` clean and existing tests green.

---

### Operating-rule checks

- **No dark patterns:** all data sharing is parent-initiated and explicit; the "Send" action is honest (no fake-disabled "soon" teaser — it does a real thing or is removed); redaction defaults to *everything included but every item one tap to remove*, with the trust line stating nothing leaves until export.
- **Privacy / COPPA-2026 + GDPR sign-off gate:** packet is built client-side from already-loaded child state; no new collection, no auto-transmit; Safety-L3 trust band stays above the fold; the consult-request note shares only the parent-written/packet-selected text, never the raw profile (preserve `FindProfessional.tsx:259-261` promise).
- **Moat read/write:** the flow *reads* the longitudinal moat — approved memory facts surface as "Context worth knowing" (`packet.ts:118-128`), making the warm-handoff differentiation visible. No moat write in this mission (c3/b5 own writes/"tracking since" copy).
- **Ships-visible:** a parent immediately sees fewer, clearer choices — one Consult page with four honest verbs instead of 3 facets + a hidden tab + 8 buttons + 3 inconsistent "share" CTAs.
