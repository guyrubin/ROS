# Arbor Localization & Transcreation Standard

**The rule that kills translated-feeling copy.** Owner: `arbor-localization`. Source message: `arbor-content`. Voice + claims: [BRAND-STRATEGY.md](BRAND-STRATEGY.md). Every localized asset clears the **native-voice gate** below or it does not ship.

> **Transcreation, not translation.** Translation tracks the source *sentence*. Transcreation re-creates the source *effect* in the target market — a native marketer writing the idea fresh. If a line can't land natively, change the line and keep the meaning. **A line that reads translated is a defect, not a draft.** (Why it matters: the brand spine, §8 — "Israeli parents smell translated-English instantly"; the same is true in every market.)

---

## The native-voice gate (every localized asset passes ALL)
1. **Native test** — would a top *local* marketer believe a native wrote this for this market? (not "is it grammatically correct.")
2. **No-calque test** — zero English idioms carried over, zero English sentence-shapes, zero over-polite constructions (e.g. HE "אנו שמחים ל…", DE corporate stiffness). 
3. **Message-first test** — the hook/insight survives; the copy leads with it; one clear CTA. It's marketing, not a feature description.
4. **Essence test** — still calm clinician-mentor, never hypey/fear-based; the Arbor Bar one-word-swap test passes *in-language*.
5. **Claim/firewall test** — no clinical/diagnostic/effect-size/outcome claims in any language; banned-word list honored per locale; child face/voice/data never a payload.
6. **RTL/i18n test** — correct script direction, locale font, numerals/dates/currency; no mirrored-afterthought layout; no hard-coded strings.
7. **Back-translation check** — a short literal back-translation + intent notes accompany the asset so the ECD + a native reviewer verify meaning without reading the language.
8. **Native-human sign-off** (publish-bound / high-stakes) — the agent transcreates to the bar and self-checks; a **native reviewer is the final gate** before L3 publish. Honest flag if a line isn't confidently native — mark "needs native review," never ship calqued.

## The transcreation method (per asset)
1. **Receive the brief from `arbor-content`** — the insight, the hook, the must-keep meaning, the CTA, what's culturally load-bearing (not the English copy to translate).
2. **Write fresh in the target language** from the concept — local idiom, rhythm, references.
3. **Self-check against the gate** (1–8); produce the back-translation + intent notes.
4. **Flag for native review** if publish-bound; file to the asset library / queue.
5. **Update the matrix** (status per locale).

---

## The locale matrix (CONFIRMED 2026-06-22)
Set locked with Guy: **Hebrew + English + Dutch + German + French.** Hebrew is live and is the named quality problem — **re-transcreate to native quality first (AM-L1).** Each locale needs a native-human reviewer before publish.

| Locale | Market | Status | Script | Display / body font | Currency | Voice register (inside the Arbor essence) |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| **he-IL** | Israel (beachhead) | **FIXES APPLIED 2026-06-22 — awaiting native-human sign-off before L3 publish** (all HELD findings from `marketing/assets/launch/he-qa-and-pricing.md` applied to 3 surfaces; confirmed ₪49/₪75/₪449/₪690 prices live; Arbor gender = feminine throughout; Frank Ruhl Libre confirmed loaded; 6 human-review flags remain as publish gate) | RTL | Frank Ruhl Libre / Heebo | ₪ ILS | Concrete, a little blunt, unsentimental; respects the parent's intelligence; no over-politeness, no flattery |
| **en** | International (source) | source / master | LTR | Fraunces / Inter | € / local | Calm, direct, specific; the master voice |
| **nl-NL** | Netherlands (anchor) | **draft done (AM-L4 2026-06-22) — awaiting native review** | LTR | per brand | € EUR | Direct, plain, no fluff; Dutch readers distrust hype and superlatives |
| **de-DE** | DACH (DE/AT/CH) | **draft done (AM-L4 2026-06-22) — awaiting native review** | LTR | per brand | € EUR | Precise, sober, trust-through-clarity; no corporate stiffness, no hype |
| **fr-FR / fr-BE** | France + Belgium (Fr.) | **draft done (AM-L4 2026-06-22) — awaiting native review** | LTR | per brand | € EUR | Warm, considered; avoid anglicisms; respect the reader's intelligence |

> **Matrix locked.** No Arabic / other markets in scope for now (revisit if the rollout expands). `arbor-localization` owns this table; the **native-human reviewer per market** is the final publish gate (the agent transcreates + self-checks to the gate, but is not the sign-off).

## RTL rules (he, and ar if added)
Compose right-to-left structurally (share cards, the record, the comic world, layouts) — never mirror an LTR layout as an afterthought. Locale font per the matrix. Chevrons/arrows flip. `dir="auto"` on user/AI-generated strings.

## Boundaries
- Localizes **marketing surfaces** (landing, social, email, share cards, blog/AEO). The app's product i18n strings are the product's — coordinate, never silently fork keys.
- Reports to `arbor-marketing-lead`; the ECD (`arbor-brand`) holds the essence veto in every language; `arbor-safety` the claim/child-data veto in every language.
