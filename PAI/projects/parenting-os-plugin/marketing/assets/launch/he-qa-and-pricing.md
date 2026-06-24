# Hebrew QA Gate + IL Pricing Copy
**Owner:** arbor-localization
**Date:** 2026-06-22
**Gate:** Native-voice gate (LOCALIZATION.md §1–8); Arbor Bar (BRAND-STRATEGY.md §10)
**Confirmed IL price points:** Free / ₪49 Plus monthly / ₪75 Family monthly / ₪449 Plus annual / ₪690 Family annual
**Surfaces audited:** arbor-marketing-landing-page-he.html · arbor-il.html · arbor-2am-test-he (compositions/main-graphics.html) · arbor-israel-viral-content-calendar-30d.md (launch captions)
**Final publish gate:** Native-human reviewer required on all HE assets before L3 external publish.

---

## Part 1 — Native-HE QA Gate

### QA rubric applied to every finding

Each finding is scored against the eight-point gate:
1. Native test — a top local marketer would believe a native wrote it
2. No-calque test — zero English idioms, zero English sentence-shapes, zero over-politeness
3. Message-first test — hook leads; one clear CTA
4. Essence test — calm clinician-mentor, not hypey or fear-based
5. Claim/firewall test — no clinical/effect-size/outcome claims
6. RTL/i18n test — correct direction, font, currency
7. Back-translation check — available below for flagged lines
8. Native-human sign-off — flagged for human reviewer before publish

---

### Surface A — arbor-marketing-landing-page-he.html

#### FINDING A-1 — HERO HEADLINE [HELD]

**Quoted text:**
> לגדל ילד עם יותר ביטחון, פחות ניחושים.

**Back-translation:** "To raise a child with more confidence, fewer guesses."

**Why it reads translated:** This is a direct calque of English benefit-pair copy ("more X, less Y"). The construction is syntactically natural Hebrew, but the *idea* is abstracted — it names no enemy, traces to no record, and could run verbatim on any of the four competitors. Fails gate 1 (native: no Israeli marketer writes a launch H1 as an infinitive clause) and gate 4 (Arbor Bar first-line test: swap "ביטחון" for any parenting app benefit and it still runs). The line also breaks gate 3: it opens on the product's *effect*, not on the parent's problem — which is backwards for the IL register, where you earn attention by naming the reality first.

**Transcreated fix:**
> בשתיים בלילה, גוגל לא מכיר את הילד שלך. Arbor כן.

Back-translation: "At 2am, Google doesn't know your child. Arbor does."

Intent: names the enemy (the 2am fear-Google), states the record's differentiator, ends with Arbor's name. Native IL register: short declarative, no infinitive clause, no paired-benefit construction. Passes the one-word-swap test — "Arbor" cannot be swapped because only Arbor has the record. Note: arbor-il.html already ships a superior H1 (see Finding A-3 below) — the landing-page-he.html hero should align to it.

---

#### FINDING A-2 — HERO LEDE [HELD]

**Quoted text:**
> Arbor מרכזת סביב הילד שלכם את מה שהורים צריכים באמת: הכוונה ממומחי התפתחות, זיכרון שמכיר את הילד, משחקים ותרגולים שמתאימים לשלב שלו, סיפורים שבהם הוא הדמות הראשית, וסיכום מקצועי כשצריך עזרה אמיתית.

**Back-translation:** "Arbor centralizes around your child what parents truly need: guidance from development experts, memory that knows the child, games and exercises matching their stage, stories where he is the lead character, and a professional summary when real help is needed."

**Why it reads translated:** Three tells. (1) "מרכזת סביב הילד שלכם את מה שהורים צריכים באמת" is a feature-list construction starting with the product as subject — translated-English structure. An Israeli writer leads with the parent's reality, not a product verb. (2) "מה שהורים צריכים באמת" is the banned softness — "what parents truly need" is feel-good marketing filler; sharp Israeli copy names something specific. (3) The list that follows is enumerated with commas, English-feature-list style; Israeli body copy would break this into the concrete story or use shorter parallel constructions. Fails gate 2 (English sentence shape) and gate 3 (message not leading).

**Transcreated fix:**
> רוב האפליקציות יודעות לתעד. Arbor זוכרת — ומחברת את הזיכרון הזה להכוונה יומיומית, למשחק, לתרגול, לסיפורים שבהם הילד שלכם הוא הגיבור, ולמומחה שמגיע מוכן. מערכת אחת סביב ילד אחד, לא עשר אפליקציות בלי תמונה.

Back-translation: "Most apps know how to document. Arbor remembers — and connects that memory to daily guidance, play, practice, stories where your child is the hero, and to a professional who arrives prepared. One system around one child, not ten apps without a picture."

Intent: opens by killing the enemy (generic tracking apps), then builds the convergence argument. Shorter. IL register: concrete contrast, no enumerated "what parents truly need" abstraction.

---

#### FINDING A-3 — FEATURED BADGE TEXT [PASS WITH NOTE]

**Quoted text on .tier.feat::after:**
> Most chosen

**Issue:** This is English text in a Hebrew RTL page. A CSS pseudo-element can't receive `dir="rtl"` and is not translatable by i18n tools. It will render LTR in a RTL context. The text is also not in Hebrew.

**Fix:** Change the pseudo-element content to Hebrew, and confirm RTL rendering. Suggested:
> הכי פופולרי

Note: arbor-il.html already has the correct Hebrew "הכי פופולרי" on the same element — this is a divergence between the two files. Align landing-page-he.html to arbor-il.html.

---

#### FINDING A-4 — PRICING BLOCK — WRONG CURRENCY [HELD]

**Quoted text:**
> ₪12.99 / חודש ... €119 בשנה (Plus tier)
> ₪19.99 / חודש ... €179 בשנה (Family tier)

**Why this fails:** The monthly prices are shown in ₪ but the annual prices switch to €. This is an i18n defect (gate 6) and a trust defect — an Israeli parent reads ₪49 monthly and then €119 annually and does not know what the product costs in their currency. The prices also predate the confirmed IL price points (₪49 / ₪75 monthly; ₪449 / ₪690 annual) — they show the old EU EUR prices. This page is not ready to ship at IL prices.

**Fix:** Replace the entire pricing block with the confirmed IL pricing (see Part 2 below for the drop-in copy).

---

#### FINDING A-5 — CAPABILITY SECTION HEADING [HELD]

**Quoted text:**
> מה Arbor פותרת

**Back-translation:** "What Arbor solves."

**Why it reads translated:** "מה X פותר" is a direct translation of "What X solves" — a common EN marketing construction. It abstracts the problem. An Israeli marketer names the problem directly. The register here is softer and less concrete than the IL voice calls for.

**Transcreated fix:**
> ארבעה מצבים שהורים ישראלים מכירים היטב

Back-translation: "Four situations Israeli parents know well."

Intent: grounds the section in local specificity (IL parents), not generic problem-solving. Still passes the claim gate — no clinical language.

---

#### FINDING A-6 — CAPABILITY SECTION BODY COPY [HELD — CALQUE PATTERN]

**Quoted text (problem/solution pairs):**
> "חיפוש ותוכן כללי" / "נותן עוד עצה, עוד סרטון, עוד שיטה. הוא לא יודע מי הילד, מה ניסיתם ומה עובד בבית שלכם."

**Back-translation:** "Search and general content / Gives another tip, another video, another method. It doesn't know who the child is, what you tried and what works in your home."

**Why it reads translated:** The "עוד... עוד... עוד" construction is borrowed directly from the English "more... more... more" pattern. It is grammatically correct but rhythmically alien to IL marketing. The line also ends with a parenthetical ("בבית שלכם") that buries the sharpest claim. In native IL copy, the record-specific claim leads.

**Transcreated fix:**
> "חיפוש ותוכן כללי" / "הוא לא מכיר את הילד שלך. כל תשובה מאפס, כל פעם. הפחד שחיפשת ב-2 בלילה מגיע לכולם — לא לך."

Back-translation: "Search and general content / It doesn't know your child. Every answer from zero, every time. The fear you searched at 2am arrives for everyone — not for you."

Intent: sharper, IL rhythm, names the enemy (the 2am fear-Google), ends with the specificity claim. Shorter, no list.

---

#### FINDING A-7 — HOW IT WORKS SECTION [CONDITIONAL PASS]

**Quoted text (Step 2 heading):**
> מקבלים הכוונה ופעולה

**Back-translation:** "Receive guidance and action."

**Why it is marginal:** The plural imperative construction "מקבלים" without a subject is a passive form — not incorrect, but it reads as template copy. Native IL marketing prefers second-person active. It is not egregious enough to hold the section but should be revised.

**Transcreated fix:**
> ארבור מחזירה קריאה ותוכנית להערב

Back-translation: "Arbor returns a read and a plan for tonight."

Improvement: specifies the output (a read + a plan for tonight) rather than the abstract "guidance and action." Puts the product as subject, not the parent as passive recipient.

---

#### FINDING A-8 — MOAT SECTION [PASS]

The "למה Arbor שונה" section and the timeline of Maya's story pass the native-voice gate. The copy is concrete, uses the Arbor lexicon correctly, and the timeline is a strong proof artifact. No calques. Passes gates 1–5.

---

#### FINDING A-9 — PRINCIPLES SECTION [PASS WITH ONE FLAG]

**Quoted text:**
> בלי תוויות, בלי אבחנות

This is good. Direct, concrete, honors the claim firewall.

**Flag on:**
> רגוע לפני חכם

**Back-translation:** "Calm before smart."

This is the strongest line in the principles section — it is genuinely native-feeling and encapsulates the brand essence in three words. Passes. Worth keeping verbatim.

---

#### FINDING A-10 — FOOTER LEGAL LINE [HELD — FORMALITY DEFECT]

**Quoted text:**
> Arbor אינו רופא, מטפל או שירות חירום. במקרה חירום יש לפנות לגורמי החירום המקומיים.

**Why it reads translated:** "יש לפנות" is formal passive that reads like a translated legal disclaimer — correct but cold and bureaucratic in a way no Israeli product would write. Also, "גורמי החירום המקומיים" does not give the number — Israeli parents reading this at 2am need a number.

**Transcreated fix (note: arbor-il.html already has this right):**
> Arbor אינה רופא, מטפל או שירות חירום. במקרה חירום פנו לגורמי החירום המקומיים (101 / 1201).

Intent: "פנו" (imperative, not passive); numbers included. Match to arbor-il.html's working version.

---

**SURFACE A VERDICT: HELD** — Pricing block must be replaced (confirmed IL prices + currency consistency). Hero H1 and lede need transcreation. "Most chosen" badge must be Hebrew. Three body-copy sections need tightening. Footer must match arbor-il.html. Once these are addressed: re-gate for native-human review.

---

### Surface B — arbor-il.html

This page is substantially better than arbor-marketing-landing-page-he.html. The H1 is native-quality. The pricing block is in ₪. Most body copy reads as written-for-IL. Issues below are targeted and do not block the page but must be addressed before publish.

#### FINDING B-1 — HERO H1 [PASS]

**Quoted text:**
> בשתיים בלילה, גוגל רק מפחיד. Arbor כבר מכירה את הילד שלך.

**Back-translation:** "At 2am, Google just scares you. Arbor already knows your child."

This is native. Short, blunt, names the enemy, states the record without abstraction. Passes all eight gate criteria. This is the quality bar for the landing-page-he.html H1 to match.

---

#### FINDING B-2 — HERO LEDE [CONDITIONAL PASS — ONE CALQUE]

**Quoted text:**
> קריאה רגועה של מה שקורה, תוכנית מעשית להערב, וזיכרון פרטי שמכיר את הילד שלכם וגדל איתו. מבוסס מומחי התפתחות, בלי אבחון ובלי דרמה. הנתונים נשארים שלכם.

**Back-translation:** "A calm read of what's happening, a practical plan for tonight, and a private memory that knows your child and grows with them. Based on development experts, without diagnosis and without drama. The data remains yours."

Nearly native. One flag: "מבוסס מומחי התפתחות" is a calque of "based on development experts" — a passive English construction. In Hebrew this would more naturally read "עם הסכמת מומחי התפתחות" or "ידע שנבנה עם מומחי התפתחות" or simply dropped (the proof system shows the mechanism elsewhere).

**Transcreated fix (minor edit):**
> קריאה רגועה של מה שקורה, תוכנית מעשית להערב, וזיכרון פרטי שמכיר את הילד שלכם וגדל איתו. לא אבחוני. לא מלחיץ. הנתונים שלכם.

Intent: dropped the passive "מבוסס" calque; shortened and sharpened the trust line to three noun-clauses, IL rhythm.

---

#### FINDING B-3 — PRICING BLOCK — PRICE POINT WRONG [HELD]

**Quoted text:**
> ₪79 / חודש ... ₪749 בשנה (Family tier)

**Issue:** The confirmed Family price is ₪75 monthly / ₪690 annually. The page shows ₪79 / ₪749. These are the old unconfirmed estimates. Must update to confirmed numbers before publish.

**Fix:** See Part 2 pricing block — use ₪75 / ₪690 for Family.

---

#### FINDING B-4 — PRICING RIBBON [HELD — ENGLISH WORD]

**Quoted text on .ribbon:**
> הכי פופולרי

This is correct Hebrew. However, in the CSS the `.tier.feat::after` on the *other* landing page reads "Most chosen" in English. Confirm which element controls the ribbon in arbor-il.html — in the HTML it shows "הכי פופולרי" which is native and passes. No issue on this page; track the discrepancy with landing-page-he.html.

---

#### FINDING B-5 — PRICE DISCLAIMER [CONDITIONAL PASS]

**Quoted text:**
> מחירי ההשקה לישראל מוצגים לפני אישור סופי · ללא כרטיס אשראי בהתחלה · ביטול בכל עת.

**Back-translation:** "IL launch prices are shown before final approval · No credit card to start · Cancel at any time."

"לפני אישור סופי" (before final approval) — this disclaimer was correct when prices were unconfirmed estimates. Now that prices are confirmed (₪49 / ₪75 / ₪449 / ₪690), this disclaimer must be removed or updated. Leaving it on the page after prices are locked undermines confidence.

**Fix:** Replace with:
> ₪ שקלים. בלי כרטיס אשראי להתחלה. ביטול בכל עת.

---

#### FINDING B-6 — 2AM EMOTIONAL-HOOK SECTION [PASS]

The mock Google search timeline ("למה ילד בן 3 קם כל בוקר בחמש?" / "התקפי זעם — מתי לדאוג?") is native. It captures what an IL parent actually types, in the register they use. The "2:14 / 2:21 / 2:34 / 2:48" timestamps are a strong specificity device. Passes.

---

#### FINDING B-7 — COMPARE SECTION [PASS]

The binary comparison ("אפליקציות מעקב רגילות" vs. "Arbor") is clean and native. The bullet points are direct without being hypey. No calques.

---

#### FINDING B-8 — MEMORY MOAT SECTION [PASS — ONE NOTE]

**Quoted text:**
> כל אפליקציה נותנת תוכן. Arbor מכירה את הילד שלך.

This is the one-liner done right in Hebrew. Native, direct, passes the one-word-swap test. The sentence structure mirrors the English master ("Every parenting app gives you content. Arbor actually knows my kid.") but arrives in native Hebrew syntax, not translated. Strong.

**Note:** The section uses "Arbor" as feminine ("Arbor מכירה") consistently on this page, but switches to masculine ("Arbor מזהה", "Arbor ענה") in the mockup on the same page. Hebrew agreement of a proper noun brand name is genuinely ambiguous, but inconsistency within a page reads as an error to native speakers. Pick one gender for "Arbor" and apply it uniformly across both pages. Recommendation: feminine ("Arbor מכירה", "Arbor מחברת") — this is the choice on the stronger lines.

---

#### FINDING B-9 — FAQ [PASS]

The FAQ answers are the best-written Hebrew on either page. Concrete, direct, non-diagnostic, uses natural Israeli sentence rhythm. Passes.

---

**SURFACE B VERDICT: CONDITIONAL PASS** — Two changes required before publish: (1) Family price corrected to ₪75 / ₪690, (2) price disclaimer removed/updated. One Arbor gender-agreement pass needed (masculine/feminine consistency). Minor H1 lede edit (drop "מבוסס" calque). After those: native-human review still required for final L3 publish.

---

### Surface C — arbor-2am-test-he (compositions/main-graphics.html)

This is the 48-second motion-graphics piece (scenes 1–8).

#### FINDING C-1 — SCENE 2 LINE [PASS]

**Quoted text:**
> אתם לא מחפשים בגוגל כי אתם הורים גרועים.

**Back-translation:** "You're not Googling because you're bad parents."

Native and strong. This is what an IL parent actually thinks at 2am, said back to them directly. Not over-polite, not English-structured. Passes gate 2. The directness here is exactly right for the IL register.

---

#### FINDING C-2 — SCENE 3 LINE [PASS]

**Quoted text:**
> אתם דואגים. והאינטרנט מחזיר לכם פחד.

**Back-translation:** "You're worried. And the internet gives you back fear."

Clean. "מחזיר לכם פחד" (gives back fear) is native Hebrew — not "the internet makes you scared" (calque). The period break between the two clauses creates the right punch rhythm for a video. Passes.

---

#### FINDING C-3 — SCENE 4 LINE [HOLD — REGISTER SLIP]

**Quoted text:**
> הילד שלכם הוא לא סימפטום לחיפוש.

**Back-translation:** "Your child is not a symptom to search for."

**Why it is marginal:** "סימפטום לחיפוש" (symptom to search for) is an interesting concept but the construction is awkward — "סימפטום" carries clinical weight that is jarring in a parent-facing emotional moment. The line is trying to say "your child is not a Google query" but the clinical register of "סימפטום" works against the calm-mentor voice. This reads as a translation of a concept rather than a native line.

**Transcreated fix:**
> הילד שלכם הוא לא שאלה בגוגל.

**Back-translation:** "Your child is not a Google question."

Intent: more direct, no clinical word, names the enemy (Google) explicitly, one clause. Works on screen as a single motion-graphics line.

---

#### FINDING C-4 — SCENE 5 LINE [PASS]

**Quoted text:**
> אתם לא צריכים עוד פאניקה.

**Back-translation:** "You don't need more panic."

Short, direct, uses "פאניקה" which is the colloquial IL-Hebrew word (not "בהלה" which would be more formal). Native register. Passes.

---

#### FINDING C-5 — SCENE 6 LINE [HELD — CALQUE]

**Quoted text:**
> משהו שזוכר — כך שזה מצטבר.

**Back-translation:** "Something that remembers — so that it accumulates."

**Why it reads translated:** "כך שזה מצטבר" is a direct calque of "so that it compounds" (financial/tech English). "מצטבר" is a correct Hebrew word but in this context it reads as imported English business-speak. The construction "כך ש-" + clause is also English-structure calquing. An Israeli writer would not reach for a financial compound-growth metaphor here.

**Transcreated fix:**
> משהו שזוכר. שכל שאלה מוסיפה לתמונה.

**Back-translation:** "Something that remembers. Where every question adds to the picture."

Intent: "מוסיפה לתמונה" (adds to the picture) is native and concrete; "התמונה" (the picture) is already established as a brand concept. No calque.

---

#### FINDING C-6 — SCENE 7 — MAIN SLOGAN [CONDITIONAL PASS — ONE WORD REVIEW]

**Quoted text:**
> תפסיקו לחפש את הילד שלכם מתוך פחד.

**Back-translation:** "Stop searching for your child out of fear."

This is strong. "מתוך פחד" (out of fear / from a place of fear) is native Hebrew idiom. The imperative plural "תפסיקו" is the right register — direct, not over-polite. However: "לחפש את הילד שלכם" could be misread as "searching for your child" (like a lost child) rather than "Googling about your child." In context with the preceding scenes this is clear, but as a standalone card it is ambiguous.

**Transcreated alternative (if the ambiguity concern is confirmed by native reviewer):**
> תפסיקו לחפש את הילד שלכם בגוגל.

Simpler, removes ambiguity. Test against native reviewer preference — the existing line may be intentionally poetic.

---

#### FINDING C-7 — SCENE 8 — END CARD TAGLINE [HELD]

**Quoted text:**
> חוות הדעת הרגועה שגדלה עם המשפחה שלכם.

**Back-translation:** "The calm opinion that grows with your family."

**Why it reads translated:** "חוות הדעת" (opinion, as in a doctor's professional opinion) is an interesting word choice — it could work — but combined with "הרגועה" it becomes a strange collocation: a "calm opinion" does not mean anything concrete in Hebrew. This feels like a translated attempt to render "the steady hand" or "the calm read." The brand's end-card tagline must be strong.

**Transcreated fix:**
> הזיכרון שמכיר את הילד שלכם. גדל איתו, נשאר שלכם.

**Back-translation:** "The memory that knows your child. Grows with them, stays yours."

Intent: leads with the moat (the record/memory), names the two key differentiators (longitudinal + parent-owned). Frank Ruhl Libre register — weight of a good closing line. No clinical calque.

---

**SURFACE C VERDICT: HELD** — Scenes 4, 6, and 8 must be transcreated before this piece ships. Scene 7 slogan: flag for native reviewer to confirm ambiguity read. Scene 2 and 3 are the strongest lines in the piece — do not touch them.

---

### Surface D — Launch Captions (arbor-israel-viral-content-calendar-30d.md)

Selected captions audited. Full calendar is large — flagging the highest-risk and highest-visibility items.

#### FINDING D-1 — WHATSAPP CAPTION E [HELD — ONE CALQUE]

**Quoted text:**
> יצרתי את זה עם ארבור — אפליקציה שבונה קומיקס מהתמונה שלו ועונה על שאלות הורות שיש לי עליו. הגיבור הזה כל כך הוא.

**Back-translation:** "I made this with Arbor — an app that builds a comic from their photo and answers parenting questions I have about them. This hero is so them."

The last clause "הגיבור הזה כל כך הוא" is an attempt to render the English "This hero is so them" in Hebrew. It does not work. "כל כך הוא" is not natural Hebrew — it reads as a word-for-word translation. An Israeli parent would say this differently.

**Transcreated fix:**
> יצרתי את זה עם ארבור — אפליקציה שמייצרת קומיקס מהתמונה שלו ועונה לי על שאלות הורות שיש לי עליו. הגיבור הזה בדיוק הוא.

"בדיוק הוא" (exactly him) is native. Shorter. Works.

---

#### FINDING D-2 — VIDEO 1 VOICEOVER [PASS]

**Quoted text:**
> שתיים בלילה, והאינטרנט רק מלחיץ יותר. ניסיתי ארבור. שאלתי את השאלה שהייתה לי על [שם הילד]. הוא ידע מי זה [שם הילד]. לא תשובה כללית — תשובה שמחזיקה את הילד שלי בתוכה.

**Back-translation:** "2am, and the internet is just making it worse. I tried Arbor. I asked the question I had about [child name]. It knew who [child name] was. Not a general answer — an answer that holds my child inside it."

"תשובה שמחזיקה את הילד שלי בתוכה" — this is beautiful Hebrew. "מחזיקה בתוכה" is a native metaphor (holds inside itself). The whole VO reads as a real IL parent speaking. Passes gate 1 and 2. The register is first-person testimonial which is exactly right for this format.

---

#### FINDING D-3 — VIDEO 4 MANIFESTO 30-SECOND CUT [CONDITIONAL PASS]

**Quoted text:**
> [13–19s] "ארבור בנוי להחזיק מה שאתה נושא."

**Back-translation:** "Arbor is built to hold what you carry."

The brand manifesto line. This is the core metaphor and it lands in Hebrew. "מה שאתה נושא" (what you carry) is native. However: "ארבור בנוי" is masculine — inconsistency with the feminine gender used elsewhere. Also: "להחזיק" (to hold) is correctly the Arbor verb, not "לשמור" (to keep/save). Passes on content; flag gender for consistency fix across the piece.

---

#### FINDING D-4 — SECTION 5B, 2AM LANDING, BLOCK 2 [CONDITIONAL PASS — ONE CLAIM CHECK]

**Quoted text:**
> לא "ייתכן שמדובר ב...". קריאה. מה קורה ולמה. מה עושים הלילה.

**Back-translation:** Not "this could be about..." A read. What's happening and why. What to do tonight.

This is strong and native. The three-noun-clause construction ("קריאה. מה קורה ולמה. מה עושים הלילה.") is the Arbor decision format delivered in Hebrew rhythm. Passes. arbor-safety flag on this block is noted in the calendar and stands — pre-clearance before publish.

---

#### FINDING D-5 — SECTION 5A, HEADLINE OPTION 2 [PASS]

**Quoted text:**
> הפסיקו לחפש בגוגל בשתיים בלילה. ארבור מכיר את הילד שלך.

This is native. Direct, IL register, imperative, names the enemy. Passes. Same note as above: "ארבור מכיר" is masculine — align to chosen gender.

---

#### FINDING D-6 — SECTION 3, WEEK 0, DAY -5 STORY BODY [HELD — FORMALITY TELL]

**Quoted text:**
> כתבנו משהו על סגנון ההורות שאנחנו בונים בשבילו. קריאה של שלוש דקות.

**Back-translation:** "We wrote something about the parenting style we're building for. A three-minute read."

"שאנחנו בונים בשבילו" — this construction is over-formal and slightly passive. "בשבילו" (for it) as a pronoun for "the parenting style" is also ambiguous. An IL brand IG story would be more direct.

**Transcreated fix:**
> כתבנו למה אנחנו בונים את ארבור. שלוש דקות של קריאה. שווה.

**Back-translation:** "We wrote why we're building Arbor. Three minutes of reading. Worth it."

Intent: "שווה" (worth it) is native IL social shorthand. Removes the awkward pronoun.

---

**SURFACE D VERDICT: HELD ON D-1 AND D-6; CONDITIONAL PASS ON D-3 (gender fix); PASS ON D-2, D-4, D-5.** The video VO copy (Section 2A) is the strongest HE copy in the calendar. The caption layer (Sections 1B, 3) has isolated calques that must be fixed before publish. Gender agreement of "Arbor" must be standardized across the entire calendar.

---

### Cross-Surface Issues (all surfaces)

#### CROSS-1 — ARBOR GENDER AGREEMENT [MUST FIX BEFORE PUBLISH]

"Arbor" is treated as masculine in some places ("Arbor ענה", "ארבור בנוי") and feminine in others ("Arbor מכירה", "Arbor מחברת"). Hebrew requires a consistent choice. This inconsistency is an immediate native-speaker tell.

**Recommendation:** Feminine throughout. Rationale: the strongest lines already use feminine ("Arbor כבר מכירה את הילד שלך" — the IL landing H1); the brand persona (calm, warm, holding) maps to feminine register in Hebrew; and "מערכת" (system) — which Arbor is called — is grammatically feminine. Apply uniformly: "Arbor מכירה, מחברת, זוכרת, ענתה, בנויה."

#### CROSS-2 — FONT COMPLIANCE [CONDITIONAL — VERIFY IN RENDER]

LOCALIZATION.md specifies Frank Ruhl Libre (gravitas) / Heebo (warmth) for he-IL. The landing-page-he.html CSS loads "Noto Sans Hebrew" and "Heebo" — Frank Ruhl Libre is absent. The 2am video uses "Assistant" as its font. Neither loads Frank Ruhl Libre.

The brand spec: Frank Ruhl Libre carries the gravitas of a good book and is the specified he-IL header font. Its absence on the main landing page is an RTL/i18n defect (gate 6). arbor-il.html should be checked to confirm font loading.

**Required action:** Add Frank Ruhl Libre to the landing page head and apply it to h1/h2 elements. The 2am video font fix is lower priority (motion-graphics renders; check if the font matters for the final render output).

---

## Part 2 — Hebrew Pricing Copy (Confirmed IL Price Points)

**Confirmed prices:** Free / ₪49 Plus monthly / ₪75 Family monthly / ₪449 Plus annual / ₪690 Family annual
**Frame:** convergence (one product replacing the stack), not a discount pitch.
**Claim gate:** No clinical/effect-size/outcome claims. No "peace of mind." No fear-bait.
**Registration:** feminine Arbor gender throughout.
**Back-translations follow each block.**

---

### Section heading

**HE:**
> מסלולים

Back-translation: "Plans" (simple, no marketing spin on the label itself — the copy below does the work).

### Section subhead

**HE:**
> המשפחה הממוצעת מוציאה 60–100 שקל בחודש על שש אפליקציות שלא מדברות זו עם זו. ארבור מחליפה את כולן על רשומה אחת פרטית של הילד שלכם.

**Back-translation:** "The average family spends ₪60–100 a month on six apps that don't talk to each other. Arbor replaces all of them on one private record of your child."

Intent: the convergence argument stated bluntly, in ₪, with a specific problem (apps that don't talk to each other). No discount language. No "peace of mind." The contrast is the moat — not the price.

---

### Free Tier

**Tier name:**
> התחלה

**Price display:**
> חינם

**For-line (descriptor under price):**
> פותחים פרופיל ילד ראשון. שואלים שאלות. מתחילים לבנות את הרשומה.

Back-translation: "Open a first child profile. Ask questions. Start building the record."

**Feature bullets:**
> + 5 שאלות עם הקשר של הילד בחודש
> + סיפור ילד אחד ואבני דרך בסיסיות
> + פרטיות ובטיחות כבר בפנים

**CTA:**
> להתחיל בחינם

---

### Plus Tier (recommended / featured)

**Ribbon label:**
> הכי פופולרי

**Tier name:**
> Arbor פלוס

**Price display:**
> ₪49 / חודש

**Annual note (inside the for-line):**
> ₪449 בשנה — שווה ערך לחודשיים חינם

Back-translation: "₪449 per year — equivalent to two months free."
Intent: states the value of the annual plan in concrete terms (two months free) rather than "save X%" — Israeli parents prefer concrete over percentages in this category.

**For-line:**
> למשפחות שרוצות את ארבור כמערכת יומיומית: הכוונה, משחק, תרגול, אקדמיה ותוכנית להערב — הכול על הרשומה של הילד שלכם.

Back-translation: "For families who want Arbor as a daily system: guidance, play, practice, academy, and a plan for tonight — all on your child's record."

Intent: "תוכנית להערב" (a plan for tonight) closes the value proposition at the product's single most concrete output. The "all on your child's record" ending is the convergence claim stated simply.

**Feature bullets:**
> + שאלות ממומחים עם ההקשר של הילד — כמה שצריך, בלי מגבלה
> + משחק יומי, תרגול ואקדמיית סיפורים ללא הגבלה
> + תוכניות גדילה וקצב יומי
> + סיכומים לאנשי מקצוע — עם הלוג שבניתם
> + Growth Card חודשי — הסיפור של הילד לפי הרשומה

Back-translation of the fourth bullet: "Professional summaries — with the log you built." Intent: "עם הלוג שבניתם" (with the log you built) is the record-specificity claim that separates Arbor from a generic chatbot. The record is the moat; it belongs in the feature bullet.

**CTA:**
> להצטרף עכשיו

---

### Family Tier

**Tier name:**
> Arbor משפחתי

**Price display:**
> ₪75 / חודש

**Annual note:**
> ₪690 בשנה — שווה ערך לחודשיים חינם

**For-line:**
> ליותר מהורה אחד, ליותר מילד אחד. רשומה אחת ברורה לכל מי שגדל את הילד — ולכל ילד שגדל.

Back-translation: "For more than one parent, more than one child. One clear record for everyone raising the child — and for every child growing."

Intent: the "who raises the child" frame (second guardian, shared context) is the sharpest differentiator for the Family tier. "לכל ילד שגדל" names the multi-child use case directly. No abstract "family plan" language.

**Feature bullets:**
> + כל מה שבפלוס, לכולם
> + הקשר משותף בין ההורים — פחות "ספרי לי מה קרה"
> + רשומה נפרדת לכל ילד, מבט אחד לכל המשפחה
> + לינק לשיתוף מאובטח עם בן/בת הזוג, גנן/ת, מטפל/ת

Back-translation of bullet 2: "Shared context between parents — less 'tell me what happened.'" Intent: "פחות 'ספרי לי מה קרה'" is the specific pain of a two-parent household — one parent who knows and one who doesn't. Named, not abstracted.

**CTA:**
> להצטרף עכשיו

---

### Tier note (below the grid)

**HE:**
> ₪ שקלים. בלי כרטיס אשראי להתחלה. ביטול בכל עת.

Back-translation: "₪ shekels. No credit card to start. Cancel at any time."

Intent: currency stated explicitly (removes any EUR ambiguity from a page that previously mixed currencies), trust signals plain and short. No legal passive ("יש לפנות" style). Three declarative clauses, IL rhythm.

---

### Full block — ready to drop into the HE landing

The following is ready to replace the current pricing section in both arbor-marketing-landing-page-he.html and arbor-il.html. The arbor-il.html prices (₪79 / ₪749 Family) must be corrected to ₪75 / ₪690.

```html
<!-- PRICING SECTION — confirmed IL prices 2026-06-22 -->
<section class="sec" id="pricing">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">מסלולים</span>
      <h2 class="h-lg">מסלולים</h2>
      <p class="lede">המשפחה הממוצעת מוציאה 60–100 שקל בחודש על שש אפליקציות שלא מדברות זו עם זו. ארבור מחליפה את כולן על רשומה אחת פרטית של הילד שלכם.</p>
    </div>
    <div class="tiers stagger">

      <!-- Free -->
      <div class="tier">
        <div class="tname">התחלה</div>
        <div class="price"><b>חינם</b></div>
        <div class="for">פותחים פרופיל ילד ראשון. שואלים שאלות. מתחילים לבנות את הרשומה.</div>
        <ul>
          <li><span class="tick">+</span>5 שאלות עם הקשר של הילד בחודש</li>
          <li><span class="tick">+</span>סיפור ילד אחד ואבני דרך בסיסיות</li>
          <li><span class="tick">+</span>פרטיות ובטיחות כבר בפנים</li>
        </ul>
        <a class="btn btn-ghost" href="https://arborparentingapp.com/">להתחיל בחינם</a>
      </div>

      <!-- Plus -->
      <div class="tier feat">
        <div class="tname">Arbor פלוס</div>
        <div class="price"><b>₪49</b><span>/ חודש</span></div>
        <div class="for">למשפחות שרוצות את ארבור כמערכת יומיומית: הכוונה, משחק, תרגול, אקדמיה ותוכנית להערב — הכול על הרשומה של הילד שלכם. <span class="yr">₪449 בשנה — שווה ערך לחודשיים חינם</span></div>
        <ul>
          <li><span class="tick">+</span>שאלות ממומחים עם ההקשר של הילד — כמה שצריך, בלי מגבלה</li>
          <li><span class="tick">+</span>משחק יומי, תרגול ואקדמיית סיפורים ללא הגבלה</li>
          <li><span class="tick">+</span>תוכניות גדילה וקצב יומי</li>
          <li><span class="tick">+</span>סיכומים לאנשי מקצוע — עם הלוג שבניתם</li>
          <li><span class="tick">+</span>Growth Card חודשי — הסיפור של הילד לפי הרשומה</li>
        </ul>
        <a class="btn btn-primary" href="https://arborparentingapp.com/">להצטרף עכשיו</a>
      </div>

      <!-- Family -->
      <div class="tier">
        <div class="tname">Arbor משפחתי</div>
        <div class="price"><b>₪75</b><span>/ חודש</span></div>
        <div class="for">ליותר מהורה אחד, ליותר מילד אחד. רשומה אחת ברורה לכל מי שגדל את הילד — ולכל ילד שגדל. <span class="yr">₪690 בשנה — שווה ערך לחודשיים חינם</span></div>
        <ul>
          <li><span class="tick">+</span>כל מה שבפלוס, לכולם</li>
          <li><span class="tick">+</span>הקשר משותף בין ההורים — פחות "ספרי לי מה קרה"</li>
          <li><span class="tick">+</span>רשומה נפרדת לכל ילד, מבט אחד לכל המשפחה</li>
          <li><span class="tick">+</span>לינק לשיתוף מאובטח עם בן/בת הזוג, גנן/ת, מטפל/ת</li>
        </ul>
        <a class="btn btn-ghost" href="https://arborparentingapp.com/">להצטרף עכשיו</a>
      </div>

    </div>
    <p class="tier-note">₪ שקלים. בלי כרטיס אשראי להתחלה. ביטול בכל עת.</p>
  </div>
</section>
```

---

## Part 3 — Human Native Reviewer Flags

The following items require a native-HE human reviewer before L3 external publish. This is the final gate per LOCALIZATION.md — the transcreation above is written to native bar, but the agent does not self-certify as the final sign-off.

### Flag 1 — Scene 7 slogan ambiguity (Surface C)

> תפסיקו לחפש את הילד שלכם מתוך פחד.

A native reviewer should confirm whether "לחפש את הילד שלכם" reads ambiguously as "searching for your child" (lost child connotation) vs. "Googling your child." If ambiguous in a 48-second video context: use "תפסיקו לחפש את הילד שלכם בגוגל." If the poetic ambiguity is the intent and a native speaker confirms it reads clearly: keep.

### Flag 2 — Arbor gender (all surfaces)

The gender-agreement decision (feminine recommended) must be confirmed by a native reviewer because it affects every verb on every surface. This is not a safety call — it is a style/register call where a native speaker has final authority. Once confirmed, the gender must be applied uniformly before any asset ships.

### Flag 3 — Pricing convergence claim (Part 2, section subhead)

> המשפחה הממוצעת מוציאה 60–100 שקל בחודש על שש אפליקציות שלא מדברות זו עם זו.

The ₪60–100 / six apps estimate is the EU EUR equivalent translated. A native reviewer should confirm this figure is credible for the Israeli market specifically (Israeli parents may subscribe to different stacks). If not credible, replace the specific figure with a more defensible one or remove it and let the convergence argument stand without the quantification.

### Flag 4 — Video VO register (Surface C, VO copy)

The 2am VO is the highest-stakes IL asset (the primary acquisition creative). Every line should be read aloud by a native speaker before the final record to confirm the register feels like a real IL parent, not an actor. This is a performance gate as much as a copy gate. The copy passes on the page; the VO delivery must be confirmed.

### Flag 5 — "ייתכן שמדובר ב..." (Surface D, Section 5B)

> לא "ייתכן שמדובר ב...". קריאה. מה קורה ולמה. מה עושים הלילה.

This line quotes the clinical hedging language of a generic AI. A native reviewer should confirm the exact quoted phrase ("ייתכן שמדובר ב...") is recognizable to IL parents as the specific frustration they feel when reading a ChatGPT answer — i.e., that it will land as a known pain, not a non-sequitur. If a different phrase better captures how IL parents describe AI hedging, substitute it.

### Flag 6 — Frank Ruhl Libre font loading (all surfaces)

A native reviewer rendering the page on IL devices should confirm Frank Ruhl Libre loads correctly. If it falls back to Noto Sans Hebrew (which is loaded in landing-page-he.html), the gravitas register the brand specification requires is lost. This is a technical confirm, not a copy confirm, but it affects how the copy reads on screen.

---

## Summary of Verdicts

| Surface | Verdict | Action required before publish |
| :-- | :-- | :-- |
| arbor-marketing-landing-page-he.html | HELD | Hero H1 + lede transcreated; pricing block replaced (IL ₪ prices); "Most chosen" badge → Hebrew; gender consistency; footer legal line fixed; Frank Ruhl Libre font added; native-human review |
| arbor-il.html | CONDITIONAL PASS | Family price corrected (₪75/₪690); price disclaimer removed; lede "מבוסס" calque dropped; gender consistency; native-human review |
| arbor-2am-test-he / main-graphics.html | HELD | Scenes 4, 6, 8 transcreated; Scene 7 native-reviewer confirmation; gender consistency; native-human review |
| Launch captions (30d calendar) | HELD on D-1, D-6 | Caption E "הגיבור הזה כל כך הוא" → "בדיוק הוא"; Day -5 story body fix; gender consistency across all calendar; native-human review before any external publish |

No asset ships externally until the native-human reviewer sign-off is complete. This is gate 8 in LOCALIZATION.md and it is not waivable for publish-bound copy.

---

*Memory entry: he-qa-and-pricing.md written 2026-06-22. Locale matrix status: he-IL remains HELD pending native re-transcreation (this document is the re-transcreation + QA; native-human sign-off is the remaining gate). Confirmed IL prices (₪49/₪75/₪449/₪690) locked into the pricing block and reflected in all surface verdicts. Arbor gender: feminine recommended, pending native-reviewer confirmation.*
