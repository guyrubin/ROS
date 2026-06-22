## p2-9-coppa-consent — COPPA-2026 consent granularity
**Aspects:** IA, Copy · **Surfaces/platforms:** cross:hero, web:MyChild, web:Care, ios, android · **Priority:** Phase2

### Problem / why
Today Arbor's consent is **scattered, implicit, and coarse**. Three independent consent realities exist with no shared model:

1. **Avatar photo path** — a single transient checkbox in `AvatarCreator.tsx:167-173` ("I consent to Arbor using this photo to create a cartoon character… immediately discarded — never stored and never used to train AI."). It is per-session, ungoverned, and lost on close (`reset()` at `AvatarCreator.tsx:46-49`). There is no record that consent was ever given.
2. **Child voice (ASR)** — `server/childAsr.ts:12-14` documents the COPPA requirement ("a child voiceprint is biometric PII… gate behind parental consent at the app layer") but **no app-layer gate exists**. Audio is forwarded to Whisper/SoapBox today with zero recorded consent.
3. **GDPR data rights** — export/erase already work (`childData.ts:22-95`, server `privacyExport`/`privacyErase` at `api.ts:175-177`, share erasure `shares.ts:81-83`) but there is **no separation between "I agree to store data" vs "I agree to share with co-parent/pro" vs "I agree to use data to train AI."** The Safety tab's GDPR card (`SafetyTab.tsx:191`) is static prose, not a control.

COPPA-2026 (and the EU AI Act's children's-data posture) requires **granular, separable, revocable, provable** consent: a parent must be able to say yes to storage but no to AI-training; the app must record *when* and *what version* was consented; and biometric/photo features must be hard-gated on a stored grant — not a transient checkbox.

This item is the **umbrella legal gate**. Per the rationale it == EB #9 == PRD C6 and **blocks p2-10 (kid-ASR), p2-11 (mimic/mediapipe), and the avatar photo-path**. It does not ship those features; it ships the consent spine they read.

### Scope across platform domains
- **Web (React app)** — primary build. New consent model + store, a Consent Center in My Child / profile, and consent gates wired into `AvatarCreator` and the (future) child-ASR call site. This is where all logic lives.
- **iOS (Capacitor)** — no native code. The web Consent Center renders inside the Capacitor WKWebView; the only platform task is verifying the consent gate blocks photo/voice capture before the native plugin is invoked (the same JS gate runs). Note in `app/MOBILE.md` that biometric/photo capture MUST check `hasConsent()` before calling any native capture.
- **Android (Capacitor)** — identical to iOS: same JS gate, same WebView. No Kotlin changes.
- **cross:hero** — the Hero/Avatar identity surface consumes the gate: the avatar photo path becomes available only when `photo_avatar` consent is granted. Default avatar (descriptor, no face) stays always-available — it needs no consent.
- **Landing EN / Landing HE** — out of scope (no consent capture pre-signup). Do not touch landing HTML.

This is an **IA + Copy** item: the *information architecture* of consent (one model, one center, clear scopes) and the *copy* (the actual plain-language consent strings, EN + HE/RTL). It is explicitly **not** building the downstream ASR/mimic features.

### IA / UX / Copy detail (build-level)

#### A. The consent model (IA — single source of truth)
Create one canonical consent type. Five separable, independently-revocable scopes (do NOT collapse into a single boolean):

| Scope id | Plain meaning | Gates |
| :-- | :-- | :-- |
| `store_observations` | Save parent-approved notes & milestones | the memory moat (already implicitly on) |
| `share_trusted` | Share with co-parent / professional | `shares.ts` grant creation |
| `photo_avatar` | Use a photo once to make a cartoon | AvatarCreator photo mode |
| `child_voice` | Record my child's voice to coach speech | child-ASR call (p2-10) |
| `child_face` | Use the camera for face/mimic games | mimic studio (p2-11) |
| `ai_training` | Let Arbor improve its AI using de-identified data | **default OFF, always** |

Each grant records: `scope`, `granted: boolean`, `grantedAt: ISO|null`, `revokedAt: ISO|null`, `policyVersion: string` (so a copy/policy change can re-prompt). Retention: `child_voice`/`child_face`/`photo_avatar` raw media is **never persisted** (already true server-side, `api.ts:733`/`childAsr.ts:13`); this item only persists the *grant record*, not media.

Store on the child document (per-child consent — a parent may consent for one child, not another). Add to `ChildProfile` in `types.ts` after the `avatar` block (~line 18):
```ts
consent?: {
  policyVersion: string;            // e.g. "2026-06-17"
  scopes: Partial<Record<ConsentScope, { granted: boolean; grantedAt: string | null; revokedAt: string | null }>>;
};
```
`ConsentScope` union + `CONSENT_SCOPES` ordered list live in a new `src/lib/consent.ts` with pure helpers: `hasConsent(child, scope): boolean` (granted && !revoked && policyVersion current), `grantConsent`, `revokeConsent`, `consentNeedsRefresh(child)`. Persistence goes through the existing `updateChild` in `ProfileContext` — no new Firestore wiring needed (consent rides the child doc, which already exports/erases via `childData.ts`).

#### B. Consent Center (IA — where it lives)
One destination, reachable from two existing entry points (no new nav leaf needed — keep IA lean per the redesign):
- **My Child** → profile editor: replace the static "Data & privacy" footer block in `ProfileEditDrawer.tsx:230-239` with the export/delete buttons **plus** a new "Consent & permissions" button that opens the Consent Center.
- **Care** → `SafetyTab.tsx:191` static "GDPR & data minimization" card becomes a live link into the same Consent Center.

The Consent Center itself is a new component `src/components/profile/ConsentCenter.tsx` (portal modal, mirror the `AvatarCreator` modal shell at `AvatarCreator.tsx:99-111` for visual consistency). Layout: one toggle row per scope (reuse the `Row` + toggle pattern from `SettingsModal.tsx:164-167,205-217`), grouped:
- **Your child's information** — `store_observations`, `share_trusted`
- **Creative & coaching features** — `photo_avatar`, `child_voice`, `child_face`
- **Helping Arbor improve** — `ai_training` (visually separated, OFF by default, never pre-checked)

Each row: title, one-line plain description, toggle, and a "Last updated {date}" / "Off" sub-line. Footer: the existing Export-data and Delete-child buttons (moved here so all data rights sit in one place), plus a `policyVersion` stamp ("Consent policy v2026-06-17").

#### C. Gating the features (IA — read the gate)
- **Avatar photo path** (`AvatarCreator.tsx`): the transient `consent` state at line 40 stays as the *per-use* affirmation, but the **photo mode tab** is only enabled when `hasConsent(child, "photo_avatar")`. If not granted, the "From a photo" toggle (`AvatarCreator.tsx:124`) shows a lock + inline "Turn on photo avatars in Consent & permissions" that deep-links to the Consent Center. Pass the active child into `AvatarCreator` (currently only `childName` is passed — add `child` prop). `canGenerate` (line 83) additionally requires `hasConsent(...,"photo_avatar")`.
- **Child voice** (`server/childAsr.ts` call site — the SpeechCoach client path, not the server): the spec defines the gate; **the wiring lands in p2-10**. Add to `consent.ts` the helper and to this spec's acceptance the requirement that `childAsr.ts`'s header comment (line 12-14) be updated to reference the concrete gate: `hasConsent(child, "child_voice")`. Do not add the call-site itself here (that's p2-10's file).
- **`ai_training`**: no current consumer. Gate is built and defaults OFF so future training pipelines have a provable opt-in. No dark pattern: never on by default, never bundled with another toggle.

#### D. Copy (actual strings — EN + HE/RTL)
Add to `src/lib/i18n.ts` in **both** the EN block (~after line 400) and the HE block (~after line 885), appending only (per the LanguageContext hotspot rule — never reorder). RTL: HE strings render right-to-left automatically via the existing `dir` handling; keep them free of LTR-only punctuation tricks.

EN:
```
"consent.title": "Consent & permissions",
"consent.subtitle": "You decide what Arbor can do with {name}'s information. Change any of these anytime.",
"consent.group.info": "Your child's information",
"consent.group.features": "Creative & coaching features",
"consent.group.improve": "Helping Arbor improve",
"consent.store_observations.t": "Save observations",
"consent.store_observations.d": "Keep parent-approved notes and milestones so Arbor can track {name}'s growth.",
"consent.share_trusted.t": "Share with people you choose",
"consent.share_trusted.d": "Let a co-parent or professional you invite see what you share. You set how long.",
"consent.photo_avatar.t": "Photo avatars",
"consent.photo_avatar.d": "Use a photo once to create a cartoon character. The photo is used once, then discarded — never stored, never used to train AI.",
"consent.child_voice.t": "Voice practice",
"consent.child_voice.d": "Record {name}'s voice to coach speech sounds. Audio is scored, then discarded — never stored.",
"consent.child_face.t": "Camera games",
"consent.child_face.d": "Use the camera for face and mimic games. Nothing is recorded or stored.",
"consent.ai_training.t": "Help improve Arbor's AI",
"consent.ai_training.d": "Allow de-identified data to help improve Arbor. Off by default. Turning this off never changes anything else.",
"consent.on": "On",
"consent.off": "Off",
"consent.updated": "Updated {date}",
"consent.policyStamp": "Consent policy v{version}",
"consent.locked.photo": "Turn on Photo avatars in Consent & permissions to use a photo.",
"consent.open": "Consent & permissions"
```
HE (RTL — same keys, e.g.):
```
"consent.title": "הסכמות והרשאות",
"consent.subtitle": "אתם מחליטים מה ארבור רשאי לעשות עם המידע של {name}. ניתן לשנות כל הגדרה בכל עת.",
... (translate the full set; mirror every EN key)
```

#### E. States / motion / a11y / touch
- **Default:** toggles reflect stored grants; `ai_training` shows Off.
- **Loading:** writes go through `updateChild` (async) — toggle shows optimistic state, reverts + toast on failure (reuse `useToast`).
- **Empty:** a child with no `consent` object → all scopes treated as not-granted except `store_observations` (implicit, since the moat is the product) — but render it as an explicit On grant on first open and persist, so it's provable.
- **Error:** save failure → `toast(t("...error"), "error")` and revert toggle.
- **Motion:** modal uses the same `motion` enter/exit as AvatarCreator; respect `prefers-reduced-motion` (the app's motion config already honors it — verify no hardcoded transition bypasses it).
- **Touch targets:** toggles ≥44×44px (the `SettingsModal` toggle is `w-11 h-6` = 44px wide; pad the hit area to 44px tall for mobile).
- **a11y AA:** each toggle is a `<button role="switch" aria-checked>` with an associated label; keyboard operable (Space/Enter toggles, Tab order top-to-bottom); focus ring visible; contrast AA against `--arbor-paper`/`--arbor-ink`. The lock state on the photo tab gets `aria-disabled` + descriptive label, not just opacity.
- **RTL:** Consent Center inherits `dir` from LanguageContext; verify toggle slides to the correct side and group order reads right-to-left in HE.

### Files to create / edit (exact repo-relative paths)
**Create:**
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/consent.ts` — ConsentScope union, CONSENT_SCOPES, pure helpers (`hasConsent`, `grantConsent`, `revokeConsent`, `consentNeedsRefresh`), `CONSENT_POLICY_VERSION = "2026-06-17"`.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/profile/ConsentCenter.tsx` — the modal.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/consent.test.ts` — unit tests for the helpers (grant/revoke/version-refresh/default).

**Edit:**
- `PPPPtherapy-/PPPPtherapy-/app/src/types.ts` — add `consent?` to `ChildProfile` (after the `avatar` block ~line 18).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/profile/AvatarCreator.tsx` — accept `child` prop; gate photo mode on `hasConsent(child,"photo_avatar")`; lock the "From a photo" toggle + deep-link copy when not granted.
- `PPPPtherapy-/PPPPtherapy-/app/src/components/profile/ProfileEditDrawer.tsx` — pass `child={activeChild}` to AvatarCreator; add "Consent & permissions" entry to the Data & privacy block (~line 230-239), opening ConsentCenter; move Export/Delete into the center (or keep + cross-link — keep both reachable).
- `PPPPtherapy-/PPPPtherapy-/app/src/components/tabs/SafetyTab.tsx` — make the static GDPR card (~line 191) a live link into ConsentCenter.
- `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append `consent.*` keys to EN and HE blocks.
- `PPPPtherapy-/PPPPtherapy-/app/src/server/childAsr.ts` — update the header comment (lines 12-14) to name the concrete app-layer gate `hasConsent(child,"child_voice")`. **Comment/doc only — no logic change here** (the call-site wiring is p2-10).
- `PPPPtherapy-/PPPPtherapy-/app/MOBILE.md` — note: native photo/voice/face capture MUST check `hasConsent()` before invoking any Capacitor capture plugin.

### Shared-file conflict notes
Three shared files from the conflict map are touched:
- **`AvatarCreator.tsx`** (touchedBy: `p2-9-coppa-consent`, `mk-p0-3-share-export`). mk-p0-3 builds the branded-image share renderer; this item touches the **photo-mode gating + props**, not the share/export render path. Coordinate: land p2-9's prop change (`child`) first since it's a signature change; mk-p0-3 should rebase onto the new prop. No overlap in the JSX regions (gate is the mode toggle ~line 124; share work is downstream of `result`).
- **`storage.ts`** (listed in the item's sharedFiles, not in the broader conflict map). This item does **not** edit `storage.ts` — `uploadChildPhoto` already never stores raw reference photos (avatars are generated). It is in scope only as the thing the consent gate *protects*. Leave it untouched to avoid a needless conflict; if a later reviewer expects a retention comment, add it as a one-line doc only.
- **`childAsr.ts`** (touchedBy: `p2-9-coppa-consent`, `p2-10-kid-asr`). **Comment-only** change here; p2-10 owns the call-site logic. Land p2-9's doc edit first (trivial), then p2-10 imports `hasConsent` and gates the actual ASR call. Do not add the gate call in this file — that is p2-10's job and would clobber.
- Not touching `navigation.ts` / `Shell.tsx` / `ArborContext.tsx` / `LanguageContext.tsx` structurally — only **appending** i18n keys to `i18n.ts` (append-only, no reorder, per the LanguageContext hotspot note).

### Dependencies (other item ids that must land first)
None. This is the umbrella gate — it has `dependsOn: []` and is itself a blocker for `p2-10-kid-asr`, `p2-11-mimic-mediapipe`, and the avatar photo path. Land before those three.

### Acceptance criteria (testable)
1. `ChildProfile.consent` type exists; `src/lib/consent.ts` exports `ConsentScope`, `CONSENT_SCOPES` (6 scopes), `hasConsent`, `grantConsent`, `revokeConsent`, `consentNeedsRefresh`, `CONSENT_POLICY_VERSION`.
2. `consent.test.ts` passes: granting then revoking a scope flips `hasConsent`; a stale `policyVersion` makes `consentNeedsRefresh` true; `ai_training` defaults to NOT granted; `store_observations` resolves granted-by-default on first open.
3. Consent Center opens from both **My Child** (ProfileEditDrawer) and **Care** (SafetyTab), shows 6 toggles in 3 groups, the policy-version stamp, and Export/Delete reachable.
4. `ai_training` toggle is **OFF on first render** and is never pre-checked or bundled with another toggle.
5. Avatar photo mode is **disabled** until `photo_avatar` is granted; the locked state shows the deep-link copy and is keyboard-reachable; granting it in the Consent Center then enables the "From a photo" tab without reload.
6. Toggling a scope persists across app reload (rides the child doc via `updateChild`); a save failure reverts the toggle and toasts an error.
7. Consent grants are included in the GDPR export (they live on the child doc, which `exportChildData` already serializes) and are removed by `deleteChildData` — verify the exported JSON contains the `consent` block.
8. All copy renders in EN and HE; HE renders RTL with correct group order and toggle side.
9. a11y: every toggle is `role="switch"` with `aria-checked`, keyboard-operable, AA contrast; reduced-motion honored.
10. `childAsr.ts` header references `hasConsent(child,"child_voice")`; **verified live on dev server** — Consent Center opens, toggles persist, photo gate locks/unlocks, no console errors; `tsc` clean and existing 241 tests still green.

### Operating-rule checks
- **No dark patterns:** `ai_training` is opt-in, off by default, never bundled; every scope is independently revocable; copy is plain-language and states what's discarded vs stored. Turning OFF a scope never silently disables an unrelated one (copy says so explicitly).
- **Privacy / COPPA-2026:** separable share-vs-train consent, biometric (voice/face) and photo features hard-gated on a *stored, versioned, provable* grant; raw media still never persisted (unchanged server behavior); retention = grant record only; provable deletion via existing `deleteChildData` erasure path.
- **Moat read/write:** consent rides the child doc (the moat's root). It **reads** the moat (per-child grants) and **writes** a durable, exportable, erasable consent ledger into it — strengthening, not bypassing, the longitudinal record.
- **Ships-visible:** parents see a real Consent Center with working toggles and a policy stamp; the avatar photo lock is visibly gated. Not a backend-only change.
