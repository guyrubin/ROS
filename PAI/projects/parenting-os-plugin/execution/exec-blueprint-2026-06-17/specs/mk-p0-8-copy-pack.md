## mk-p0-8-copy-pack — Launch copy pack (native HE review)
**Aspects:** Marketing, Copy · **Surfaces/platforms:** landing:en, landing:he, app:shell · **Priority:** P0

### Problem / why
The launch copy pack (`PAI/projects/parenting-os-plugin/marketing/arbor-launch-copy-pack.md`) is written and approved in EN, but it is explicitly flagged as **launch-draft Hebrew** (file line 5: "⚠ Hebrew below is launch-draft — needs a native review pass before publishing"). For a child-health product launching IL-first, the HE strings cannot ship unreviewed. Three concrete gaps block "done":

1. **No native HE sign-off.** Hero/challenge/DM/referral/listing/hooks/PR HE copy needs a fluent-native pass for tone (calm, high-agency, no fear-sell), gender-form consistency, and clinical-safety phrasing ("non-diagnostic" / לא־אבחנתי).
2. **HE form-inconsistency across surfaces.** The copy pack uses slash-gender singular ("הילד/ה שלך", line 19), but the **live HE landing hero** uses plural-formal ("הילד שלכם", `arbor-marketing-landing-page-he.html:1009`), and the **app i18n** also uses plural-formal ("ילדכם", `i18n.ts:863`). Three surfaces, three address registers. The review must pick one register and reconcile all three.
3. **Referral copy (§4) has no home in the app.** `i18n.ts` has zero `referral.*` / `invite.*` keys (verified by grep — only `consult.*`/`sec.sharing.*` "share" strings exist). The loop events `invite_sent` / `invite_activated` already exist (`loopEvents.ts:19-20, 62-63`) and `mk-p0-2-referral-loop` will build the rails, but the approved EN+HE referral strings have no `t()` keys to render. This spec lands the keys so the referral UI has copy the moment it ships.

This item is **Marketing/Copy only** — it does not build the referral UI, the share renderer, or the loop. It (a) runs the native HE review and records the verdict in the copy pack, and (b) commits the approved referral + share-sheet strings as i18n keys so downstream missions consume stable keys, not hardcoded literals.

### Scope across platform domains
- **Landing EN** — No string changes expected (EN is approved and the live EN hero `arbor-marketing-landing-page-en.html:155` already matches copy-pack §1.1). The review confirms EN↔HE parity (same claims, same CTA semantics) and flags any drift.
- **Landing HE (RTL)** — Reconcile the HE hero/sub/CTA against the chosen address register. Current live HE hero (`:1009`) is plural-formal; copy pack §1 HE is slash-gender. After native review, the **winning register** is applied to the copy-pack file AND noted as a follow-up patch for `mk-landing-parity-rebuild` (which rewrites the HE landing). This spec does NOT edit the HE landing HTML directly — it owns the *copy decision*; the rebuild mission applies it.
- **App shell (web + iOS + Android)** — Add `referral.*` and `share.line.*` i18n keys (EN + HE) to `i18n.ts` so the future referral UI and share sheet render localized, gender-consistent copy. Same `t()` keys serve all three platforms (Capacitor shells consume the same bundle). No new UI in this item.

### IA / UX / Copy / Marketing detail

#### A. Native HE review pass (the blocking deliverable)
Reviewer brief (record in the copy pack under a new `## Review log` section):
- **Register decision:** Choose ONE of: plural-formal (אתם/שלכם — current app+landing default) or slash-gender singular (את/ה — copy-pack draft). Recommendation: **plural-formal**, because it already ships in `i18n.ts` (220+ HE keys) and the live HE landing — changing the app to slash-gender is a large, error-prone sweep out of scope here. Flag the copy-pack §1–7 HE lines to be normalized to plural-formal.
- **Per-section verdict** for copy-pack §1–7 HE: `approved` / `approved-with-edit` / `rewrite`. Capture the edited string inline.
- **Safety phrasing check:** every HE claim that asserts non-diagnosis must read לא־אבחנתי / "ארבור אינו מאבחן" (cf. `i18n.ts:871` `airail.privacy.body`, `:1008` `ov.safety.body`). No HE line may imply diagnosis, urgency-scare, or medical authority.
- **Hashtag/handle check:** `#ArborAvatar` stays Latin in HE captions (do not transliterate); verify RTL punctuation around it renders cleanly.
- Update copy-pack line 5 from the ⚠ warning to a dated "HE reviewed by [name] on [date]" stamp once each section is signed off.

#### B. Approved referral + share strings → i18n keys
Add these keys to BOTH `en` and `he` dicts in `i18n.ts`. EN values are copy-pack §4 verbatim; HE values are the **native-reviewed, plural-formal** forms (the strings below are the proposed plural-formal normalization — they MUST be confirmed in the review pass, not shipped raw):

| Key | EN | HE (proposed, plural-formal — confirm in review) |
|---|---|---|
| `referral.cta` | `Invite a parent` | `הזמינו הורה` |
| `referral.pitch` | `Love Arbor? Give a friend a free month of Plus — you get one too when they start.` | `אוהבים את ארבור? תנו לחבר/ה חודש פלוס חינם — וגם אתם מקבלים כשהם מתחילים.` |
| `referral.sent.toast` | `Invite sent — you'll both get a free month when they join.` | `ההזמנה נשלחה — שניכם תקבלו חודש חינם כשהם יצטרפו.` |
| `referral.activated.toast` | `Your friend joined — a free month of Plus is on its way.` | `החבר/ה הצטרפו — חודש פלוס חינם בדרך אליכם.` |
| `share.line.story` | `This actually helped me figure out what's going on with {name} — try it: {link}` | `זה ממש עזר לי להבין מה קורה עם {name} — נסו: {link}` |

Notes:
- Use the existing `{name}` / `{link}` interpolation tokens — `translate()` (`i18n.ts:1017-1021`) already replaces `{var}` globally. No code change to the t() engine.
- Append the keys at the END of each dict block (before the closing `};` at `i18n.ts:522` for `en` and `:1013` for `he`) under a `// referral / share (mk-p0-8)` comment. **Append only — do not reorder existing keys** (see conflict notes).
- These are copy keys only. Wiring `referral.cta` to an onClick that fires `trackInviteSent` is `mk-p0-2-referral-loop`'s job, not this item's.

#### Copy/RTL/a11y constraints
- HE strings carry no LTR-only punctuation that breaks RTL flow; `{link}` URLs render LTR inside RTL via the existing `dir` handling in `LanguageContext.tsx` (already sets `<html dir/lang>`).
- No emoji inside i18n keys (the 🌳 in copy-pack captions is social-post copy, not app UI). Keep app keys emoji-free for screen-reader cleanliness.
- Strings stay short enough for mobile bottom-nav / toast width (toasts wrap; CTA `referral.cta` ≤ 16 chars EN to fit a button at 44px touch target).

### Files to create / edit (exact repo-relative paths)
- **Edit** `PAI/projects/parenting-os-plugin/marketing/arbor-launch-copy-pack.md` — add `## Review log` with per-section HE verdicts; replace the line-5 ⚠ warning with a dated reviewed-by stamp; normalize §1–7 HE lines to the chosen register.
- **Edit** `PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts` — append `referral.*` + `share.line.story` keys to both `en` (≈ line 521) and `he` (≈ line 1012) dicts.
- **No edit** to `arbor-marketing-landing-page-he.html` / `-en.html` in this item — the register decision is recorded as a handoff note for `mk-landing-parity-rebuild`.

### Shared-file conflict notes
- **`PAI/.../marketing/arbor-launch-copy-pack.md`** — hotspot touched by `mk-p0-8-copy-pack`, `mk-p1-1-avatar-challenge`, `mk-p2-4-en-launch-appstore`, `mk-p2-5-pr-push`. This item only ADDS a `## Review log` section and edits the HE lines in §1–7; it does not restructure. mk-p1-1 extends §2 (challenge), mk-p2-4 extends §5 (listing), mk-p2-5 extends §7 (PR). **Land mk-p0-8 first** (it stamps HE as reviewed), then the others append their sections — no overlap if each appends to its own numbered section.
- **`PPPPtherapy-/PPPPtherapy-/app/src/lib/i18n.ts`** — hotspot touched by `mk-p0-8-copy-pack`, `mk-p2-1-localize-nl`, `mk-p2-7-paywall-experiments`. Per the LanguageContext/i18n merge rule: **append only, never reorder**. This item adds `referral.*`/`share.line.*` at the end of `en`+`he`. `mk-p2-1-localize-nl` adds a whole new `nl` dict + the referral keys' NL values (it depends on these keys existing). `mk-p2-7` adds `paywall.*` keys. All three append to distinct key namespaces → no collision as long as each PR appends and does not touch sibling blocks. Land mk-p0-8 before mk-p2-1 so NL can localize a stable key set.
- Does NOT touch `LanguageContext.tsx` (no register/dir logic change) — avoids the `b5-naming-moat-exposure` / `ia-b6-ask-from-ask` contention on that file.

### Dependencies (other item ids that must land first)
- **None hard.** This is `dependsOn: []`.
- Soft: `mk-p0-2-referral-loop` is the *consumer* of the `referral.*` keys (it wires the UI). To avoid it hardcoding strings, land mk-p0-8's keys **before or alongside** mk-p0-2. The native HE review itself is blocked on a human reviewer (Guy / native speaker) — the i18n-key work (part B) can proceed in parallel using the proposed plural-formal strings, marked provisional until review confirms.

### Acceptance criteria (testable, including "verified live on dev server")
1. `arbor-launch-copy-pack.md` line 5 no longer shows the ⚠ "needs native review" warning; a `## Review log` section records per-section (§1–7) HE verdicts with reviewer name + date.
2. A single HE address register is chosen and the copy-pack §1–7 HE lines are consistent with it (no mix of "שלך" and "שלכם" within the app-facing strings).
3. `i18n.ts` contains `referral.cta`, `referral.pitch`, `referral.sent.toast`, `referral.activated.toast`, `share.line.story` in BOTH `en` and `he` dicts; `npx tsc --noEmit` passes (no dict type break); existing 241 tests still green.
4. `translate("he","referral.pitch")` and `translate("en","share.line.story",{name:"Maya",link:"x"})` return the expected interpolated strings (unit-assert or REPL check).
5. **Verified live on dev server:** with the dev server running, switching language to HE and rendering any view that later consumes `referral.cta` shows no `referral.*` key-name fallback (the `translate` fallback chain `he → en → key` means a missing HE value would surface the raw key — confirm none does).
6. EN↔HE landing parity confirmed: the live EN hero (`-en.html:155`) and HE hero (`-he.html:1009`) make the same claim with matched CTA semantics; any drift is logged in the review log as a handoff item for `mk-landing-parity-rebuild`.

### Operating-rule checks
- **No dark patterns:** Referral copy offers a genuine mutual reward ("you get one too"), states it plainly, no fake urgency/scarcity, no pre-checked opt-ins. Share-sheet line is parent-authored framing, not a coerced testimonial.
- **Privacy / COPPA-2026:** No child PII in any string; `{name}` is the parent-entered first name only, rendered client-side, never embedded in a shared URL by this item. Share/referral copy contains no child data — the `{link}` is a referral code deep link (built by mk-p0-2), not a child-data link.
- **Moat read/write:** This item is copy-only and does not itself read/write the longitudinal memory; but `share.line.story` surfaces the moat truthfully ("what's going on with {name}") — it references the child record without exporting it. No moat data leaves the device via these strings.
- **Ships-visible:** The i18n keys render in the live app shell (web + iOS + Android via the shared bundle) the moment mk-p0-2 mounts the referral UI; the HE review stamp ships in the marketing copy pack that gates the IL ignition posts (copy-pack line 98).
