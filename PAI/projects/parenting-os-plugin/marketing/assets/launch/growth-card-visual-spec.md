ARBOR-SAFETY GATE: The Growth Card render pipeline and the demo-account fictional data both require arbor-safety sign-off before any card is rendered from real user data. This spec governs the design; production of real user cards is a separate engineering+safety gate. The sample/marketing card uses fictional data only.

NATIVE HE REVIEW GATE: All Hebrew copy on the card (the logged moments, the Rhythm insight, the safety line) requires native-HE reviewer sign-off before any card is distributed externally.

C2PA/SYNTHID NOTE: Every Growth Card rendered by the Arbor system — whether from the marketing demo account or from a real user's data — must carry a C2PA content credential and a SynthID watermark before distribution. This is a hard requirement, not a best practice. Engineering must confirm the render pipeline signs cards before the Growth Card feature launches. arbor-safety co-owns this gate.

---

# Arbor Growth Card — Hero Share Artifact Visual Spec

**Asset ID:** LAUNCH-002
**What this is:** The monthly share artifact. A 9:16 card rendered from the child's real record (or, for marketing purposes, from a fictional demo account). The loop payload: every card that a parent shares to WhatsApp or Stories carries an embedded referral deep-link (`/join?ref=`) that is the instrumented loop entry.
**Brief source:** `arbor-israel-viral-campaign-brief.md` (ECD definition) + `arbor-israel-viral-content-calendar-30d.md` §1A (on-card copy)
**Output destination:** in-app generated artifact (engineering spec) + marketing sample card (Canva-built, for use in the "שנה שלמה" film and the Day 26 preview post)
**Designer/engineer handoff:** this document is the single source for layout, copy, and technical requirements

---

## 1. Card Dimensions and Format

| Property | Value |
|----------|-------|
| Orientation | 9:16 portrait — vertical |
| Pixel dimensions | 1080 × 1920 px (standard Instagram Stories / WhatsApp Status export) |
| File format (export) | PNG (lossless, no compression artifacts — the card is the brand) |
| Color space | sRGB |
| Safe area | 60px margin all sides (WhatsApp crops the outer edge; no load-bearing content in the outer 60px) |
| RTL layout | The card is composed right-to-left throughout. Hebrew text anchors right. The HeroAvatar is in the center-to-left zone. The brand bar anchors bottom. |

---

## 2. Layout — Zone Map (top to bottom, 9:16 portrait)

The card is divided into four vertical zones. All measurements are in pixels (1080 × 1920 canvas).

### Zone A — Comic World Panel (top 60% of card)
**Pixel range:** y 0–1152 (1152px tall)
**Purpose:** The child-as-hero illustration. This zone is entirely visual — no marketing copy, no brand elements, no product UI.

**Contents:**
- **HeroAvatar:** The generic Arbor hero character rendered in the PlayKit / Academy comic-world visual language. Centered horizontally with a slight left lean (leaving visual breathing room on the right). The hero occupies approximately 55% of the zone height — large, readable, playful. The hero's pose should suggest forward motion or an active moment — not static standing.
- **Comic-world background:** A simplified environment consistent with the PlayKit comic aesthetic — warm, illustrated, the same visual language as the Academy hero sequences. The environment is abstract/suggestive, not photorealistic. Color palette: warm ochre / sage / ivory with accents of emerald clay. No photography, no real-world imagery in this zone.
- **Mission badge (optional):** A small illustrated badge in the upper-right corner of the comic panel — a simple icon (shield, star, book) representing the child's "virtue" or active theme from the Academy Journey, if the child has an active Journey. If no Journey is active, omit the badge entirely. Never fabricate a badge for a child who has not earned one.
- **The child's name — Zone A treatment:** Displayed at the very top of the comic panel as a "comic title" in a hand-lettered or display font consistent with the PlayKit visual language. Frank Ruhl Libre italic may serve as the display font for the name if a hand-lettered alternative is not available in the design system. The name is the parent-supplied first name only — no surname, no age, no identifiable information beyond the first name. If the parent has opted out of displaying the name, this line is blank; the card renders without a name rather than substituting a placeholder.

**Critical rule — animated hero:** The HeroAvatar in Zone A is ALWAYS the generic customizable hero character from the Arbor design system. It is NEVER rendered from or derived from a real child's photograph, face scan, biometric data, or likeness. Even if the in-app avatar uses face-derivation, the Growth Card — which is the shareable, externally-distributed artifact — uses the generic hero. This rule is non-negotiable and is co-owned by arbor-safety.

---

### Zone B — The Record Strip (middle 20% of card)
**Pixel range:** y 1152–1536 (384px tall)
**Background:** sage paper (#F5F0E8 or the canonical Arbor sage value from the brand system — confirm hex with the design system before production)
**Purpose:** Three plainly-stated logged moments from the child's actual record, displayed as quiet notes. This is the "record does the talking" beat — no interpretation, no clinical framing, no flags.

**Contents:**

Three logged moments, each on its own line. Layout: a thin left-border accent in emerald clay, then the text.

```
[moment 1]
[moment 2]
[moment 3]
```

**Content rules for the three logged moments (enforced by the render pipeline, not the designer):**
- Source: the three most recent positively-noted or neutrally-noted observations from the child's timeline. Never a flag, a concern, a clinical descriptor, or anything that could be read as an assessment.
- Tone: plainly factual. Parent-written observations. "אמרה 'אני אוהבת אותך' לאחיה." "בנה מגדל מבלי לבקש עזרה." "ישן שלוש לילות ברציפות."
- Length: each moment is a maximum of 10 words. If the parent's log entry is longer, the render pipeline truncates at the last complete word before 10.
- Hebrew: the moments are rendered exactly as the parent wrote them (parent's voice is the point). No editorial cleaning. The render pipeline must handle any RTL/LTR conflicts in mixed-language entries.
- arbor-safety gate: the render pipeline must run a content filter on each moment before it is included in a card. Any moment that contains diagnostic language, a developmental concern, a medical term, or a flag is excluded from the card rendering and replaced by the next positively/neutrally-noted moment in the timeline. If fewer than three qualifying moments exist in the record, the card renders with however many qualify — never fabricating or inferring moments.

**Typography (Zone B):**
- Each moment line: Heebo, 28px, dark charcoal (#2C2C2C or the canonical Arbor dark from the brand system)
- Left-border accent: 4px vertical line, emerald clay, full height of the moment text
- Line spacing: 16px between moments
- Left margin from left safe-area edge: 60px (RTL — the text anchors right, the accent bar is on the right side)

**Sample (fictional, for the marketing card / "שנה שלמה" film):**
```
אמרה 'אני אוהבת אותך' לאחיה.
בנתה מגדל מבלי לבקש עזרה.
שאלה 'למה?' על כל דבר היום.
```

---

### Zone C — Rhythm Insight + Defining Line (next 12% of card)
**Pixel range:** y 1536–1766 (230px tall)
**Background:** continues sage paper, a subtle horizontal rule (1px, emerald clay, 20% opacity) separates Zone B from Zone C
**Purpose:** One Rhythm insight (the concrete, pattern-derived read) and one defining line (a parent-chosen or system-suggested characterization of this month).

**Rhythm insight line:**
- Format: "חלון השקט של [שם]: [time range]" (the child's calm window, drawn from the Rhythm data)
- ARBOR-SAFETY: the Rhythm insight must use the approved "based on your logs" framing and must describe a pattern band, not a prediction. The insight is the parent-observed record, not an algorithmic forecast. Exact copy for the Rhythm line on the Growth Card requires arbor-safety confirmation of the template string before the render pipeline goes live.
- Approved template (draft, pending arbor-safety): "חלון השקט של [שם] לפי הלוגים: [HH:MM]–[HH:MM]"
- Typography: Heebo, 24px, medium weight, emerald clay color

**Defining line:**
- One short line — the month's defining character for this child, in the parent's voice or offered by Arbor as a suggestion the parent confirms. Maximum 8 words.
- This is the "story beat" of the card — the thing that makes it feel like a chapter in the child's life, not a report.
- If the parent has not set a defining line, Arbor may suggest one based on the most frequent positive tag in the logs this month — but the suggestion is never auto-applied. The parent must confirm it before it appears on the card.
- arbor-safety: the suggested defining line must not use developmental descriptors, milestones, or clinical language. It is a character observation, not an assessment.
- Typography: Frank Ruhl Libre italic, 26px, dark charcoal, centered

**Sample (fictional, for the marketing card):**
```
חלון השקט שלה לפי הלוגים: 9:00–10:30

"החודש שהחלה לבנות."
```

---

### Zone D — Brand Bar (bottom 8% of card)
**Pixel range:** y 1766–1920 (154px tall)
**Background:** deep sage / near-charcoal — distinct from the sage paper above, creating a visual "title card" effect that separates the brand from the record above it
**Purpose:** Brand identification, safety line, and the invisible referral payload.

**Left side (RTL — this anchors on the RIGHT in the actual layout):**
- Child's name + Arbor wordmark: "[שם הילד] — ארבור"
- Typography: Frank Ruhl Libre, 18px, white on dark
- This is the only instance of the Arbor wordmark on the card — one time, in the brand bar, reading as the comic's title credit

**Right side (RTL — this anchors on the LEFT in the actual layout):**
- Safety line: "הכרטיס שלך, הנתונים שלך" (Heebo, 14px, white, 75% opacity)
- This line is not marketing copy — it is a trust signal. It confirms that the card is the parent's artifact, derived from their data, and controlled by them. It must appear on every card without exception.

**Referral deep-link payload:**
- The card's PNG file metadata (EXIF / XMP) carries the referral string: `/join?ref=[parent_user_id]`
- When the card is shared natively (iOS Share Sheet / Android share), the referral string is passed in the share payload
- The referral string is NEVER displayed visually on the card — it is invisible to the recipient
- Engineering must confirm this deep-link mechanism before the Growth Card render pipeline launches

**C2PA / SynthID watermark:**
- Every Growth Card carries a C2PA content credential in the file metadata, declaring: the generation method (Arbor system, not a human illustrator), the data source (parent's own record, no third-party data), and the date of generation
- A SynthID invisible watermark is also embedded in the image data for post-distribution verification
- Both are invisible to the end user and do not alter the visual appearance of the card
- These credentials are a brand trust asset — in 2026, a C2PA-signed artifact is proof of provenance, not just a compliance checkbox. The brand may surface these credentials in the app's card-generation screen as a trust signal

---

## 3. Marketing Sample Card (Canva Build Spec)

For use in the "שנה שלמה" film (shot 9), the Day 26 preview post, and any press/media use. This card uses the fictional "נועה" account — no real user's data.

**Canva setup:**
- Canvas: 1080 × 1920 px, custom size
- Brand kit: Arbor brand kit (sage paper, emerald clay, charcoal, Frank Ruhl Libre, Heebo) — confirm the kit is loaded before building
- Artboard background: sage paper (#F5F0E8)

**Zone A (Canva build):**
- Import the Arbor generic HeroAvatar illustration file (SVG or high-res PNG) from the PlayKit asset library. Place centered, slight left lean, occupying 55% of zone height.
- Add the comic-world background as a separate layer behind the avatar — use the existing PlayKit environment illustrations from `arbor-playkit-viral-2026-06-20/` as reference.
- Add the name title at the top: "נועה" in Frank Ruhl Libre italic, white, RTL aligned.

**Zone B (Canva build):**
- Three text boxes, each with the left-border accent (use Canva's border element, 4px, emerald clay, positioned on the RIGHT side for RTL).
- Sample moments (fictional, native-HE review required before any external use):
  - "אמרה 'אני אוהבת אותך' לאחיה."
  - "בנתה מגדל מבלי לבקש עזרה."
  - "שאלה 'למה?' על כל דבר היום."
- Note: RTL means the emerald accent bar appears on the right edge of each text block in the Canva layout, even though conceptually it is the "left" border of the text in reading direction. Test in both Canva and on a physical device before finalizing.

**Zone C (Canva build):**
- Thin horizontal rule: 1px line, emerald clay, 20% opacity, full width inside safe area.
- Rhythm insight: "חלון השקט שלה לפי הלוגים: 9:00–10:30" — Heebo medium, 24px, emerald clay, RTL.
- Defining line: "החודש שהחלה לבנות." — Frank Ruhl Libre italic, 26px, charcoal, centered.

**Zone D (Canva build):**
- Rectangle fill: the deep sage / near-charcoal background. Confirm the exact hex value from the brand system — use a color dropper on the `he2-end.png` existing asset in `assets/` as a reference reference point if the brand system hex is not confirmed.
- Name + wordmark: "נועה — ארבור" in Frank Ruhl Libre 18px, white, RTL anchored to the right.
- Safety line: "הכרטיס שלך, הנתונים שלך" in Heebo 14px, white 75%, LTR anchored to the left (the safety line in Hebrew is grammatically RTL but its position in the design is the left side of the bar — maintain the Hebrew RTL character direction while visually positioning it on the left of the brand bar).

**Export:** PNG, 1080 × 1920, sRGB, maximum quality. Name the file: `arbor-growth-card-noa-sample-marketing.png`. Do NOT export with "קומיקס" or "avatar" in the filename — the filename is an internal reference, not a label for the card.

---

## 4. Arbor Bar Self-Check (run before handing to ECD and arbor-safety)

1. Memory test: the card visibly traces to this child's record — the three moments are her actual logged observations, the Rhythm insight is derived from her pattern data, the defining line is her month in her parent's voice. A card rendered for a different child would show different moments, a different insight, a different line. Not generic. Pass.
2. Enemy test: the card does not directly name an enemy — it is the artifact, not the argument. The share caption (in `arbor-israel-viral-content-calendar-30d.md` §1B) carries the enemy frame. The card is the thing that makes the parent say "I want one of those." Pass (enemy is the context, not the card).
3. Composure test: the card is a quiet record of a child's month. No urgency, no achievement pressure, no competitive framing. A parent looking at it at 11pm should feel: "this is my child, held." Pass.
4. Convergence test: the card demonstrates Child Memory (the three moments), Rhythm (the calm window insight), and the Academy hero world (the HeroAvatar in the comic panel) — three surfaces visible on one artifact. Pass.
5. First-line test: "הכרטיס שלך, הנתונים שלך" — cannot run on any competitor's page because no competitor generates this card from a parental record of this kind. The name + Arbor brand bar passes because "נועה — ארבור" is the child's title, not a product tagline. Pass.
6. 11pm test: a parent looking at their child's Growth Card at night should feel: seen, calm, connected to the record they have built. Not pressured. Pass — confirm on the finished sample card with a real parent if possible.
7. Clinician test: the three logged moments are parent-voice observations, not clinical descriptors. The Rhythm insight is pattern-language, not diagnostic. The defining line is a character observation. A senior child psychologist would not object to any line on this card. Pass — pending arbor-safety confirmation of the Rhythm template string.
8. Decision test: the parent who sees this card knows their child's month was held. The CTA is in the share caption, not on the card — the card does not end in a call to action; it ends in the child's story. Pass.

---

## 5. Engineering Integration Notes (for the render pipeline team)

The design above describes the visual and copy spec. The engineering implementation of the Growth Card render pipeline must also satisfy:

- **Render trigger:** monthly, on the anniversary of the child's first log entry in Arbor (not on the calendar month). The parent is notified in-app; they preview and confirm before the card is generated.
- **Parent confirmation gate:** the parent reviews the three logged moments, the Rhythm insight, and the defining line before the card renders. They may remove any moment, adjust the defining line, or opt out of the card entirely. The card is never auto-generated and shared without parent review.
- **No real child face/data as the payload:** the Growth Card's shareable artifact is the illustrated HeroAvatar + the parent-reviewed text record. The card's PNG file contains no identifiable biometric data. The referral deep-link is in metadata only, not in any visible layer.
- **C2PA + SynthID:** see Zone D spec above. Both credentials must be embedded before the card is available for export. The card's generation screen in the app may display a "signed and provenance-certified" trust badge — this is a brand decision, not only a compliance requirement.
- **Referral deep-link:** `/join?ref=[parent_user_id_hash]` — use a one-way hash of the user ID, not the raw user ID, in the referral parameter. The link resolves to the Arbor join flow with the referrer credited. Engineering must confirm the referral attribution system is live before the Growth Card ships.
- **Fictional demo account:** The marketing sample card (for the "שנה שלמה" film and the Day 26 preview post) must be generated from a seeded fictional account ("נועה", fictional logs, fictional Rhythm data). This account must be clearly flagged in the Firestore data as a marketing demo account — no real user should be able to interact with or query this account's data.
