---
type: execution
title: Arbor Confirm Product Backlog
date: 2026-06-29
source: Google Doc comments/notes from 2026-06-22 and 2026-06-28
doc: https://docs.google.com/document/d/1mX2op9YrdZzunzUcK20ypCz0MG_mfOHDYgruv4tPZJU/edit?pli=1&tab=t.0
status: draft for product-team triage
---

# Arbor Confirm Product Backlog — 2026-06-29

## Source confirmation

Reviewed the shared Google Doc export. It contains two app-review note batches:

- **22/6 notes:** login, backend access-request email, Today page, Add Child, Ask Arbor, My Child, plus separate video notes.
- **28/6 notes:** English dashboard and Hebrew dashboard issues including language placement, unimplemented child-profile feedback, truncation, transparent popups, duplicate profile, unclear features/search/metrics, growth bug, footer overlap, typography, translation/context, Data & Privacy copy, child dropdown arrow, and Hebrew wording for “Story”.

## Product-team framing

The comments point to four product themes:

1. **Beta readiness blockers:** access-request email delivery, save-memory error, child-context switching failure, modal readability, page-layout bugs.
2. **Hebrew/RTL product quality:** Hebrew-first login for Israeli audience, language control placement by locale, contextual Hebrew copy, RTL dropdown alignment, typography consistency.
3. **Core IA/value clarity:** Today dashboard hierarchy, duplicated profile entry, unclear feature value, unclear search surfaces, unclear 40% metric, My Child tab order and data provenance.
4. **Child profile precision:** precise age/month input, sex/gender field, focus/input usability, age-appropriate categories and activities.

Video notes are captured separately as **Marketing/Video** backlog items and should not block app beta unless the launch video is required for release.

## P0 — Beta blockers / must fix before broader user test

### P0-01 — Access request email is not delivered

- **Area:** Backend / auth / beta access
- **Evidence:** “בקשת גישה לא מתקבלת במייל Backend”
- **Problem:** A parent asking for access does not receive the expected email.
- **Acceptance criteria:**
  - Access-request submission produces a delivered email in the intended inbox/test mailbox.
  - User sees a clear success/failure state.
  - Failure is logged with actionable backend error context.
  - Regression test or smoke test covers the route.
- **Owner:** Engineering backend
- **Status:** Needs reproduction

### P0-02 — Save memory fails in Ask Arbor

- **Area:** Ask Arbor / memory persistence
- **Evidence:** “בשמירת הזכרון מתקבלת הודעת שגיאה”
- **Problem:** Saving memory from Ask Arbor returns an error, undermining the core memory-loop promise.
- **Acceptance criteria:**
  - Saving a memory succeeds for an authenticated beta user.
  - Error states explain what happened and offer retry.
  - Saved memory appears in the child timeline/profile where expected.
  - Test covers save success and failure path.
- **Owner:** Engineering full-stack
- **Status:** Needs reproduction

### P0-03 — Adding/switching child does not update age-personalized content

- **Area:** Child profile / personalization / Today
- **Evidence:** “הכנסתי את לני, בגיל 1 אבל המסך לא התעדכן לפעילות מותאמות לגילו (נשאר על דילן)”
- **Problem:** After adding Lenny age 1, the app still shows Dylan’s activities/content.
- **Acceptance criteria:**
  - Newly added child becomes selectable immediately.
  - Active child state updates all personalized surfaces.
  - Today/My Child/activities use the selected child’s age and profile.
  - Regression test covers multi-child switch after creation.
- **Owner:** Engineering frontend/state
- **Status:** Needs reproduction

### P0-04 — English modal/popup transparency makes text unreadable

- **Area:** UI shell / modals / localization
- **Evidence:** “באנגלית, הפופאפים עולים כשקופים ורואים את הטקסט מאחורה”
- **Problem:** Popups in English show transparent overlays with background text visible.
- **Acceptance criteria:**
  - Modals/popovers have opaque readable surfaces in EN and HE.
  - Contrast meets WCAG AA for body text.
  - Visual regression screenshots cover at least one modal in both locales.
- **Owner:** Design systems + frontend
- **Status:** Needs reproduction

### P0-05 — Growth page bug

- **Area:** Grow / Growth page
- **Evidence:** “בעמוד צמיחה יש באג:”
- **Problem:** Reviewer notes a bug but the exported text does not include the screenshot/details.
- **Acceptance criteria:**
  - Product team retrieves the missing screenshot/context from the original Doc or reviewer.
  - Bug is reproduced and classified.
  - Fix has route-level verification.
- **Owner:** Product triage + engineering
- **Status:** Blocked on missing screenshot/detail

### P0-06 — Support Network footer overlays text

- **Area:** Support Network / layout
- **Evidence:** “ברשת תמיכה הפוטר מופיע על הטקסט כלומר צף כל הזמן ולא מופיע רק בסוף העמוד”
- **Problem:** Footer floats over page content instead of appearing after content.
- **Acceptance criteria:**
  - Footer appears only after content or is correctly sticky without occluding text.
  - Mobile and desktop layouts verified.
  - No overlap in Hebrew RTL and English LTR.
- **Owner:** Frontend
- **Status:** Needs reproduction

## P1 — Product quality / beta credibility

### P1-01 — Default login language should match Israeli target audience

- **Area:** Login / localization strategy
- **Evidence:** “מסך לוג אין - אם הקהל יעד הוא ישראלי, לא כדאי שיהיה בעברית?”
- **Product decision needed:** If the beta target is Israeli parents, default login should be Hebrew-first while still supporting English.
- **Acceptance criteria:**
  - Product decides beta default locale: Hebrew-first, browser-locale, or explicit choice.
  - Login copy and directionality match the chosen default.
  - Language switch remains accessible before login.
- **Owner:** Product + design
- **Status:** Product decision

### P1-02 — Language selector placement must follow locale direction

- **Area:** Global shell / localization
- **Evidence:** “בחירת שפה... עברית בפינה הימנית למעלה ואנגלית בפינה השמאלית”
- **Problem:** Language selector placement should feel native in RTL/LTR.
- **Acceptance criteria:**
  - Hebrew UI places language affordance on the top-right.
  - English UI places language affordance on the top-left or product-approved LTR location.
  - Position is consistent on login and app dashboard.
- **Owner:** Design + frontend
- **Status:** Ready for design spec

### P1-03 — Add Child requires precise age/month input

- **Area:** Onboarding / child profile
- **Evidence:** “להכניס במדויק את הגיל... לא ניתן להכניס גיל לפי חודשים... חצי שנה היא קריטית בהתפתחות הילד”
- **Problem:** Age input via broad scroll is not precise enough for developmental personalization.
- **Acceptance criteria:**
  - Parent can enter birthdate or age in years + months.
  - Personalization bands derive from month-level age.
  - Copy explains why precision matters.
- **Owner:** Product + engineering
- **Status:** Ready for refinement

### P1-04 — Add Child should include child/child-girl field, with sensitive wording decision

- **Area:** Onboarding / child profile / localization
- **Evidence:** “להוסיף : ילד/ילדה”
- **Product decision needed:** Whether to capture sex, gender, pronouns, or Hebrew grammar preference.
- **Acceptance criteria:**
  - Product decides data purpose and privacy wording.
  - Field supports Hebrew grammatical personalization without over-claiming clinical use.
  - Optionality and data deletion behavior are documented.
- **Owner:** Product + privacy + design
- **Status:** Product decision

### P1-05 — Add Child text input/focus behavior is broken or awkward

- **Area:** Onboarding / forms
- **Evidence:** “העכבר לא עומד אוטומטית אות אחרי אות אלא צריך לסמן עם העכבר”
- **Problem:** Text entry/focus/caret behavior requires manual mouse selection.
- **Acceptance criteria:**
  - Inputs autofocus when appropriate.
  - Caret moves normally during typing in Hebrew and English.
  - Form works keyboard-only.
- **Owner:** Frontend
- **Status:** Needs reproduction

### P1-06 — Today page visual hierarchy is unclear despite good content

- **Area:** Today dashboard
- **Evidence:** “הנראות לא ברורה אבל התוכן כן טוב”; “כפתור תיעוד רגע גדול מאוד”
- **Problem:** Content is valuable, but hierarchy and CTA sizing make the page harder to understand.
- **Acceptance criteria:**
  - Today page has a clear primary question/action, secondary insight, and logging CTA.
  - “Document moment” CTA size matches design hierarchy.
  - Layout reviewed in Hebrew RTL and English LTR.
- **Owner:** Product design
- **Status:** Design refinement

### P1-07 — Moment documentation close button placement

- **Area:** Today / Document Moment modal
- **Evidence:** “בתיעוד רגע להזיז את הX שמאלה”
- **Problem:** Close affordance is misplaced for reviewer expectations.
- **Acceptance criteria:**
  - Close button position follows locale/modal convention.
  - Hit target ≥ 44px.
  - Does not overlap content.
- **Owner:** Design + frontend
- **Status:** Ready

### P1-08 — Ask Arbor memory review value proposition is unclear

- **Area:** Ask Arbor / memory review
- **Evidence:** “לא ברור הערך המוסף שמתקבל באזור סקירת זכרון”
- **Problem:** Reviewer does not understand why memory review exists or what benefit it adds.
- **Acceptance criteria:**
  - Section explains: what was remembered, why it matters, how it improves future guidance.
  - Parent can edit/delete before save.
  - Empty/first-use state is clear.
- **Owner:** Product + content design
- **Status:** Ready for copy/design

### P1-09 — My Child tab order: Story should not be first

- **Area:** My Child IA
- **Evidence:** “הטאב של סיפור צריך להיות בסוף ולא ראשון”
- **Problem:** Story tab feels less primary than profile, development, moments, or plans.
- **Acceptance criteria:**
  - Product defines My Child tab order by user task priority.
  - Story moves later/end unless data proves otherwise.
  - Deep links and empty states still work.
- **Owner:** Product design
- **Status:** Product decision

### P1-10 — My Child “Add Moment” categories are not age-appropriate

- **Area:** My Child / Moment logging / personalization
- **Evidence:** “הוספת רגע לא מותאמת לגילו, הקטגוריות”
- **Problem:** Moment categories do not adapt to the child’s age/developmental band.
- **Acceptance criteria:**
  - Categories are filtered or prioritized by age band.
  - Generic categories remain available under “Other”.
  - Category set is reviewed for Hebrew parents.
- **Owner:** Product + child-development content + engineering
- **Status:** Ready for refinement

### P1-11 — My Child data provenance and purpose are unclear

- **Area:** My Child / trust
- **Evidence:** “לא ברור המטרה ומאיפה מגיעה דאטה”; “לא ברור מה הפיצ'ר נותן”
- **Problem:** User cannot tell what the page/feature is for or where data comes from.
- **Acceptance criteria:**
  - Each child-data module states source: parent logs, profile, Arbor guidance, imported data, etc.
  - Page has a clear “what this helps you do” intro.
  - Trust copy avoids diagnostic overclaim.
- **Owner:** Product + content design
- **Status:** Ready

### P1-12 — Dashboard duplicates Dylan profile

- **Area:** Hebrew dashboard / navigation
- **Evidence:** “הפרופיל של דילן מופיע פעמיים... שיישאר רק תמונת הפרופיל בתפריט הימני”
- **Problem:** The selected child profile appears redundantly.
- **Acceptance criteria:**
  - Child profile appears once in the agreed navigation/profile location.
  - Header/sidebar avoids duplicate identity blocks.
  - Works for multi-child accounts.
- **Owner:** Design + frontend
- **Status:** Ready

### P1-13 — Dylan name truncation

- **Area:** Dashboard / profile switcher
- **Evidence:** “השם של דילן קטוע”
- **Problem:** Child name is visually cut off.
- **Acceptance criteria:**
  - Names render without clipping at common lengths.
  - Long names have product-approved truncation/tooltip/wrap behavior.
  - Verified in EN and HE.
- **Owner:** Frontend
- **Status:** Ready

### P1-14 — Dashboard whitespace wastes screen real estate

- **Area:** Dashboard layout
- **Evidence:** “יש המון רווח מיותר, חבל על הנדלן והמקום”
- **Problem:** Layout uses excessive whitespace, reducing useful content density.
- **Acceptance criteria:**
  - Product/design defines responsive density target.
  - Key above-the-fold content improves on laptop and mobile.
  - No regression to cluttered or overwhelming IA.
- **Owner:** Design
- **Status:** Design refinement

### P1-15 — Two search fields are confusing

- **Area:** Search / IA
- **Evidence:** “מה ההבדל בין שני שדות החיפוש”
- **Problem:** Users cannot distinguish between search surfaces.
- **Acceptance criteria:**
  - Either consolidate into one search or label scopes clearly.
  - Placeholder copy explains searchable content.
  - Results behavior matches label.
- **Owner:** Product + frontend
- **Status:** Product decision

### P1-16 — 40% metric is unclear

- **Area:** Analytics / dashboard metric
- **Evidence:** “מה הכוונה 40%?”
- **Problem:** Percent metric lacks label, context, or interpretation.
- **Acceptance criteria:**
  - Metric is renamed or accompanied by plain-language explanation.
  - It states denominator/time period and whether higher/lower is good.
  - Remove metric if not actionable/trustworthy.
- **Owner:** Product + data
- **Status:** Product decision

### P1-17 — Hebrew contextual translation pass is needed

- **Area:** Localization / content design
- **Evidence:** “יש לשפר את התרגום... לא כפשוטו אלא עם קונטקסט”; examples include “instead”, Data & Privacy, and “Story”.
- **Problem:** Hebrew copy feels literal or culturally off.
- **Acceptance criteria:**
  - Native Hebrew product-copy review covers all top-level nav, modals, settings, privacy, and child-profile flows.
  - Literal machine-like phrases are replaced with contextual Hebrew.
  - Sensitive child-development copy remains non-diagnostic and warm.
- **Owner:** Content design / Hebrew reviewer
- **Status:** Ready for copy review

### P1-18 — Rename/rethink Hebrew “Story” tab

- **Area:** My Child IA / localization
- **Evidence:** “הטאב של המילה ‘סיפור’ בעצם נלקח מהביטוי What his story?... בעברית זה לא נשמע טוב”
- **Problem:** “סיפור” as a direct translation of “What’s his story?” does not fit Hebrew product tone.
- **Candidate directions:** “רקע”, “הילד/ה שלי”, “פרופיל”, “מסע”, “תמונה כללית” — requires product-copy decision.
- **Acceptance criteria:**
  - Hebrew label selected by content/product.
  - English can remain “Story” only if paired with Hebrew-specific label mapping.
  - All references updated consistently.
- **Owner:** Product + content design
- **Status:** Product decision

### P1-19 — Typography system consistency across app

- **Area:** Design system
- **Evidence:** “לאורך כל האתר, יש להשתמש בפונט אחד בהיררכיות שונות”; video notes also request consistent title font/color/hierarchy.
- **Problem:** Fonts/colors/hierarchy feel inconsistent.
- **Acceptance criteria:**
  - One app typography token set for headings/body/captions/buttons.
  - Hebrew and English font pairing tested.
  - Components use tokens instead of one-off styles.
- **Owner:** Design systems + frontend
- **Status:** Ready

### P1-20 — Child dropdown arrow alignment is wrong

- **Area:** Child switcher / RTL layout
- **Evidence:** “החץ של פתיחת רשימת הילדים לא ממוקם נכון”
- **Problem:** Dropdown chevron is mispositioned, likely RTL issue.
- **Acceptance criteria:**
  - Chevron aligns correctly in Hebrew and English.
  - Hit target remains accessible.
  - Visual regression screenshot added.
- **Owner:** Frontend
- **Status:** Ready

### P1-21 — Data & Privacy text bug

- **Area:** Settings / trust & privacy
- **Evidence:** “יש באג בטקסט של DATA&PRIVACY”
- **Problem:** Copy/format bug in privacy section; exact issue not exported.
- **Acceptance criteria:**
  - Retrieve screenshot/context if needed.
  - Fix broken text, casing, overflow, or untranslated string.
  - Privacy copy reviewed in EN and HE.
- **Owner:** Product/content + frontend
- **Status:** Needs reproduction/detail

## P2 — Polish and content improvements

### P2-01 — Today “Document Moment” button is oversized

- **Area:** Today / CTA design
- **Evidence:** “כפתור תיעוד רגע גדול מאוד”
- **Acceptance criteria:** CTA is sized proportionally, still discoverable, and touch-safe.
- **Owner:** Design + frontend
- **Status:** Ready

### P2-02 — Login / app title hierarchy and color cleanup

- **Area:** Visual design
- **Evidence:** Cross-note request for one font/color hierarchy.
- **Acceptance criteria:** All major headings follow design tokens; no ad hoc title colors.
- **Owner:** Design systems
- **Status:** Ready

### P2-03 — Form and modal keyboard usability sweep

- **Area:** Accessibility / forms
- **Evidence:** Add Child input/caret complaint and modal issues.
- **Acceptance criteria:** Keyboard-only happy path works through login, add child, ask/save memory, document moment.
- **Owner:** Frontend
- **Status:** Ready

## Marketing / Video backlog — separate from app beta blockers

### MKT-01 — Standardize video title typography/color/hierarchy

- **Evidence:** “כל הכותרות צריכות להיות באותו פונט וצבע, גודל הפונט לפי היררכיית הטקסט”
- **Acceptance criteria:** Title style guide applied across all video screens.
- **Owner:** Marketing/design
- **Status:** Ready

### MKT-02 — Video screen 1: sequence text and make question more specific

- **Evidence:** Two texts appear together; reviewer asks to show the question first, then footer; example bedtime meltdown question provided.
- **Acceptance criteria:** Animation sequence separates focal question from footer; question uses concrete parent scenario.
- **Owner:** Marketing/design
- **Status:** Ready

### MKT-03 — Video screen 2: swap hierarchy

- **Evidence:** “קודם הטקסט בפוטר ואחר צילום המסך של האפליקציה”
- **Acceptance criteria:** Footer/text lead appears before app screenshot.
- **Owner:** Marketing/design
- **Status:** Ready

### MKT-04 — Video screen 3: stagger text entrance

- **Evidence:** “המסך מהמם רק הטקסט צריך להיכנס בתורות”
- **Acceptance criteria:** Text appears in sequential beats.
- **Owner:** Marketing/design
- **Status:** Ready

### MKT-05 — Video screen 4: clarify “children area” for non-users

- **Evidence:** “מי שלא מכיר את האפליקציה לא יודע שיש אזור ילדים ולכן הכותרת לא ברורה”
- **Acceptance criteria:** Title explains the child/profile area without requiring prior app knowledge.
- **Owner:** Marketing/content
- **Status:** Ready

### MKT-06 — Video screen 5 approved

- **Evidence:** “מהמם”
- **Acceptance criteria:** Preserve direction; only apply global typography if needed.
- **Owner:** Marketing/design
- **Status:** Accepted

## Suggested triage agenda with product team

1. **30 min — Confirm release gate:** Decide whether P0-01/P0-02/P0-03/P0-04/P0-06 block the next beta push.
2. **30 min — Hebrew-first strategy:** Decide default login language, language selector placement, and Hebrew naming for Story.
3. **45 min — Child profile model:** Decide exact age input, child/child-girl/grammar field, and how age bands drive activity/category selection.
4. **45 min — Dashboard IA cleanup:** Resolve duplicate profile, search scopes, 40% metric, whitespace, Today hierarchy.
5. **30 min — Assign owners and test plan:** Pair design/content/engineering owners to each P0/P1 and create screenshot-based acceptance checks.

## Immediate recommendation

Run a one-sprint **Arbor Confirm Beta Polish** lane:

- **Day 1:** Reproduce P0s with screenshots/console logs; retrieve missing Growth/Data & Privacy screenshots from the Doc if needed.
- **Days 2–3:** Fix P0 engineering issues and obvious layout defects.
- **Day 4:** Product/design lock Hebrew IA/copy decisions.
- **Day 5:** Apply Hebrew/RTL copy/layout pass and run smoke tests in EN+HE across login, add child, Today, Ask Arbor, My Child, Grow, Support Network, Settings.
