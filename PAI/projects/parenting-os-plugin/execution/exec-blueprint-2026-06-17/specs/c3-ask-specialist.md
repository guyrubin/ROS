## c3-ask-specialist — Ask-a-Specialist — warm human handoff
**Aspects:** IA, UI/UX, Copy, Marketing · **Surfaces/platforms:** web:Care, web:Ask · **Priority:** Phase2

### Problem / why
The warm-handoff packet builder is fully built and shipping: `AskSpecialist.tsx` assembles a parent-redactable, non-diagnostic summary of the child's longitudinal record (`consult/packet.ts`) and lets the parent Copy / Download it (Safety L3 — nothing leaves the device until export). But the third button — **Send to an Arbor specialist** — is hard-disabled (`AskSpecialist.tsx:137-141`, label `consult.sendSoon` = "Send to an Arbor specialist (soon)"). Meanwhile the durable send transaction already exists end-to-end: `api.requestConsult()` (`lib/api.ts:180`) → `POST /api/consult-requests` (`routes/api.ts:1571`) → `buildConsultRequest` (`server/consultRequests.ts:68`) persists to Firestore and returns a `mailto`. Today that transaction is only reachable from `FindProfessional.tsx` (pick a pro → free-text note), so the rich redacted packet the parent just curated is **thrown away** — the specialist still gets a cold one-line note.

This item closes the loop: the parent curates the packet, then sends it (as the structured `note`) to a chosen Arbor specialist in one flow — the moment Arbor stops being a tool and becomes a bridge to a human. It also fixes the IA dead-end where Ask Arbor escalation drops the parent on a directory (`CoachTab.tsx:595` `onEscalate={() => setActiveTab("find-pro")}`) instead of the warm-start packet — subsuming `ia-b6-ask-specialist-from-ask`.

### Scope across platform domains
- **Web (Care › Consult › "Ask a specialist" panel):** enable the Send button; add a lightweight professional-picker + preferred-mode + confirmation step; pass the redacted packet markdown as the consult-request `note`; success/empty/error states; analytics. This is the primary surface.
- **Web (Ask Arbor escalation):** re-point `CoachTab` escalation from `find-pro` to the Consult `ask` panel (warm start) so the human handoff begins with context, not a cold directory. Carries an optional one-line seed.
- **iOS / Android (Capacitor):** no native-specific code; the web flow runs inside the shell. Only verify the picker sheet and sticky export bar respect safe-area insets (already handled globally) and that `mailto:` opens the native mail composer (Capacitor passes through to the OS handler). No new files.
- **Landing EN / Landing HE:** out of scope for this item (marketing copy for "talk to a real specialist" lives in the marketing backlog, not here). The only marketing surface touched is in-app loop instrumentation.

### IA / UX / Copy / Marketing detail

#### IA
- **Care › Consult** stays the home (`ConsultTab.tsx` HubTabs: `ask` / `brief` / `find`). The `ask` panel (`AskSpecialist`) becomes the canonical "reach a human with context" flow. `find` (`FindProfessional`) remains the raw directory; its consult CTA continues to work but is now the secondary path.
- **Ask Arbor → Consult:** change `CoachTab.tsx:595` from `onEscalate={() => setActiveTab("find-pro")}` to `onEscalate={() => setActiveTab("consult")}`. Because `ConsultTab` defaults to the first HubTabs panel (`ask`), the parent lands on the warm packet, not the directory. This is the `ia-b6-ask-specialist-from-ask` entry. (Optional: seed a one-line context via existing toast pattern, no new state required.)

#### UI/UX (AskSpecialist.tsx)
Replace the disabled Send button (lines 137-141) with an enabled button that opens a **Send sheet** (inline expandable panel below the export bar, not a modal — keeps the redaction list visible). Reuse `motion/react` (already imported) for entry.

- **Send button (default):** enabled when `includedCount > 0`; same disabled-on-empty rule as Copy/Download (`disabled={includedCount === 0}`). Style as a secondary outline button (NOT the clay gradient — that stays the primary Download for the privacy-first "you keep it" default). Icon `Send` (already imported).
- **Send sheet contents:**
  1. Professional picker — a compact `<select>` (or radio list) of `ARBOR_PROFESSIONALS` (fetch from `/api/professionals` with `authHeaders()`, exact pattern at `FindProfessional.tsx:96-99`; fall back to a single "Arbor care team" option if the fetch fails). Each option: name + role.
  2. Preferred mode — three chips: Video / In person / Either (maps to `preferredMode: "video" | "in_person" | "either"`, server coerces at `consultRequests.ts:85`).
  3. A read-only reassurance line showing exactly what will be sent: "{n} details you selected above, plus your contact email." No hidden fields.
  4. Confirm button: "Send to {proName}".
- **States:**
  - *default:* sheet collapsed, Send button visible.
  - *loading:* on confirm, button shows spinner + "Sending…", inputs disabled (mirror `consultBusy` pattern, `FindProfessional.tsx:63,75-88`).
  - *empty:* if `includedCount === 0` the Send button is disabled (can't send an empty packet) — consistent with Copy/Download.
  - *success:* collapse sheet, show a green confirmation card: "Sent. {proName} will reach out by email." If the server returns a `mailto` (intake-email configured), also render a secondary "Open email draft" link (`<a href={mailto}>`) — gives the parent a copy and a fallback. Fire success toast (reuse `useToast`).
  - *error:* keep sheet open, inline error text under the confirm button (reuse `err.message` pattern), error toast: "Couldn't send — try again, or Download and email it yourself." Always offer the Download fallback (already present) so the parent is never stuck.
- **Motion:** sheet expand/collapse `height`/`opacity` transition ~200ms; respect `prefers-reduced-motion` (the existing `motion.div` wrapper sets the precedent — gate any non-essential transform). No autoplay/parallax.
- **Touch targets:** all buttons/chips ≥44×44px (existing buttons use `py-2.5 px-4` ≈ 44px; match for new chips).
- **A11y (AA):** Send button and chips keyboard-focusable; picker is a native `<select>` (keyboard + screen-reader free). Chips use `aria-pressed`. Confirmation card uses `role="status"`/`aria-live="polite"` so the result is announced. Error text linked via `aria-describedby` on the confirm button. Maintain the existing `aria-pressed` redaction-toggle pattern (lines 102-104). Contrast: green-on-green-soft trust styling already passes; do not introduce new low-contrast text.
- **RTL:** all new text via `t(...)` keys; flex rows must not hardcode `flex-direction` (Tailwind logical defaults are fine). Verify the chip row and sheet mirror under `lang="he"` (LanguageContext drives `dir`).

#### Copy (new i18n keys — append to BOTH blocks in `lib/i18n.ts`: EN block near line 131, HE block near line 637; append-only, no reordering)
- `consult.send` — EN "Send to a specialist" / HE "שליחה למומחה"
- `consult.sendPick` — EN "Choose who to send to" / HE "בחרו למי לשלוח"
- `consult.sendMode` — EN "How would you like to meet?" / HE "איך תרצו להיפגש?"
- `consult.sendModeVideo` / `consult.sendModeInPerson` / `consult.sendModeEither` — EN "Video" / "In person" / "Either" ; HE "וידאו" / "פגישה" / "גמיש"
- `consult.sendWhat` — EN "{n} details you selected, plus your contact email." / HE "{n} פרטים שבחרתם, ועוד כתובת המייל שלכם."
- `consult.sendConfirm` — EN "Send to {name}" / HE "שליחה אל {name}"
- `consult.sending` — EN "Sending…" / HE "שולח…"
- `consult.sendDone` — EN "Sent. {name} will reach out by email." / HE "נשלח. {name} יחזרו אליכם במייל."
- `consult.sendDraft` — EN "Open email draft" / HE "פתחו טיוטת מייל"
- `consult.sendError` — EN "Couldn't send — try again, or download and email it yourself." / HE "השליחה נכשלה — נסו שוב, או הורידו ושלחו בעצמכם."
- **Retire/repurpose** `consult.sendSoon` ("...(soon)") — no longer the button label. Leave the key in place (harmless) or delete in the `b5` final cleanup pass; do not rename it (it may be referenced by tests). The live button now uses `consult.send`.

Tone: warm, plain, honest, non-diagnostic — matches the existing `consult.trust` register. No urgency/pressure language.

#### Marketing (loop instrumentation only)
- This is the highest-intent action in Care; instrument it as a **loop conversion**, not a viral share. Fire `track("consult_send_initiated", { proRole, mode, itemCount })` when the sheet opens to confirm, and `track("consult_send_completed", { proRole, mode })` on success, via `lib/analytics.ts` `track(event, props)` (`analytics.ts:27`).
- Do **not** add these to the `LoopEvent` enum in `loopEvents.ts` — that enum is the canonical share/referral contract owned by `mk-p0-4` and dashboards depend on its exact names (see hotspot). Use raw `track()` string events instead, so this mission never touches `loopEvents.ts` and avoids the merge magnet. If a canonical consult event is later wanted, `mk-p0-4` adds it.

### Files to create / edit (exact repo-relative paths)
**Edit:**
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/AskSpecialist.tsx` — replace disabled Send (137-141) with enabled Send + inline send sheet (picker, mode chips, confirm, states); add `requestConsult` call passing `note = serializePacket(packet, excluded)`; add professional fetch + `useState` for sheet/busy/done/error/selectedPro/mode; add `track()` calls. **Primary file, owned by this mission.**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append the new `consult.*` keys to EN (~line 131) and HE (~line 637) blocks. Append-only.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/CoachTab.tsx` — repoint `onEscalate` (line 595) from `find-pro` to `consult` (the `ia-b6` entry). Single-line change.

**No edit needed (verify only):**
- `PPPPtherapy-/PPPPtherapy-/app/src/consult/packet.ts` — `serializePacket(packet, excluded)` already produces exactly the redacted markdown to send. **Do not modify** unless `b3` lands a shared change first (see conflict notes); read-only here.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/api.ts` — `requestConsult` (line 180) already accepts `note`; the serialized packet fits within the server's 2000-char cap (`consultRequests.ts:86`). **No signature change needed** — if the packet can exceed 2000 chars, truncate client-side with a "…(continued in attached download)" note rather than widening the contract. Avoids touching the api.ts hotspot.
- `PPPPtherapy-/PPPPtherapy-/app/src/server/consultRequests.ts` / `src/routes/api.ts` — endpoint already persists `note` + returns `mailto`. No change.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/sections/Reports.tsx` — listed as shared; **not touched by c3** (clinical PDF path stays with `b3`/`p2-8`). Leave alone.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/reportExport.ts` — listed as shared; **not touched by c3**. The send path uses the markdown packet, not the print/PDF exporter. Leave the single clinical `buildReport` exporter untouched.

### Shared-file conflict notes
- **`consult/packet.ts`** (hotspot: b3-care-consult, b5, c3, p2-8): "Land b3+c3 together (same flow), then p2-8 extends the same packet; b5 adds moat copy last." → c3 only *reads* `buildConsultPacket`/`serializePacket`/`countIncluded`; it does not change the builder. Coordinate so b3 lands any packet structure changes first; c3 consumes the result. No packet schema edits from this mission.
- **`lib/api.ts`** (hotspot: p1-comic-reader, p4-operational-hardening, c3): c3 makes **no edit** to api.ts — `requestConsult` already exists with the needed `note` param. This removes c3 from that merge magnet entirely. (If a future need forces a signature change, append-only and after p4.)
- **`Reports.tsx`** (hotspot: p2-hero-everywhere, b3, c3): c3 does **not** edit Reports.tsx despite the manifest listing it — the brief/PDF path is b3/p2-8's. Removing c3 from this file avoids a clobber. Note this divergence in the PR.
- **`reportExport.ts`** (hotspot: clinical PDF vs branded-image): c3 does **not** edit; send uses markdown, not the exporter. Out of the way.
- **`ConsultTab.tsx`** (b3, c3): if both touch the HubTabs config, append panels — don't reorder. c3 likely needs **no** ConsultTab edit (panel already exists).
- **`navigation.ts`** (IA triad): c3 does **not** edit navigation.ts — the `consult` tab and `find-pro` fallback already exist (`navigation.ts:76,124`). The Ask→Consult repoint is in `CoachTab.tsx`, not nav. Stays clear of the IA serialization order.
- **`loopEvents.ts`** (canonical event contract): c3 deliberately uses raw `track()` strings, **not** the `LoopEvent` enum — zero edits to `loopEvents.ts`. Avoids the dashboard-name hotspot.
- **`i18n.ts`** (mk-p0-8, mk-p2-1, mk-p2-7): append `consult.*` keys only; reconcile any key collision in the b5/mk final pass. No reordering.

### Dependencies (must land first)
- **`b3-care-consult`** — same flow from the feature angle; b3 settles the Consult reorg and any `packet.ts` structure. c3 builds the Send action on top. Sequence b3 → c3 (per hotspot: "Land b3+c3 together"). If b3 is delayed, c3 can still ship against the current packet (which already works), but rebase onto b3's packet shape if it changes.

### Acceptance criteria (testable)
1. With ≥1 packet item selected, the **Send** button is enabled in Care › Consult › Ask a specialist; with 0 items it is disabled (parity with Copy/Download).
2. Tapping Send opens an inline sheet with a professional picker (populated from `/api/professionals`, graceful fallback), mode chips, a "{n} details + your email" disclosure line, and a "Send to {name}" confirm.
3. Confirm calls `api.requestConsult({ professionalId, childId, note: serializePacket(packet, excluded), preferredMode })`; a durable consult request is created (verify a row/doc and the returned `request.id`).
4. The `note` received server-side equals the redacted markdown — **excluded items are absent**, included items present (verify by toggling an item off then sending).
5. Success state renders the confirmation card with `aria-live`, fires the success toast, and (when intake email configured) shows a working "Open email draft" `mailto` link.
6. Error path: server failure keeps the sheet open, shows inline error + error toast, and the Download fallback still works.
7. Ask Arbor escalation (`CoachTab` `onEscalate`) now lands on Care › Consult's Ask-a-specialist panel (the warm packet), not the directory.
8. `track("consult_send_initiated", …)` and `track("consult_send_completed", …)` fire at the right moments (verify in analytics debug/console).
9. All new strings render correctly in EN and HE (RTL), via `t()` keys — no hardcoded copy.
10. `tsc` clean and existing tests green; **verified live on dev server** (npm run dev): real send round-trips, redaction respected, EN+HE both render, keyboard-only operable, reduced-motion honored.

### Operating-rule checks
- **No dark patterns:** Download (you keep it on-device) remains the visual primary; Send is a deliberate secondary opt-in. The disclosure line states *exactly* what is transmitted (selected items + contact email) before the parent confirms — no hidden payload, no pre-selected "share more", no urgency.
- **Privacy / COPPA-2026:** nothing transmits until the parent explicitly confirms Send (Safety L3 honored). Only parent-curated, non-diagnostic, redacted items leave the device; the packet is parent observations only by construction (`packet.ts` header). No child PII beyond what the parent selected; contact email is the parent's. GDPR/Guy-gate: the send transport (`CONSULT_INTAKE_EMAIL`) is server-config-gated and the directory is Arbor-vetted pros only.
- **Moat read/write:** the packet **reads** the longitudinal record (logs, milestones, plans, approved memory — `AskSpecialist.tsx:22-41`), surfacing "Context worth knowing" from approved memory (`packet.ts:118-128`) — Arbor's differentiation. A successful send is the closed-loop write (a durable `consultRequest` tied to the child), feeding future "you reached out about X" continuity.
- **Ships-visible:** a real, enabled Send button replacing a dead "(soon)" stub — an end-to-end human handoff a parent can complete today, demoable on the dev server.
