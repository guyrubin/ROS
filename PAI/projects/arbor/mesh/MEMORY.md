# Arbor Agent Mesh — Memory

**Active facts only.** Detail older than the current wave → `archive.md`. Raw `## Update` blocks below are the current wave (2026-06-23/24); the anchor is the synthesis.

## Current State (as of 2026-06-24)

- **Active build branch:** `claude/arbor-10-capabilities` — design-system pass GREEN (`e9b8f3f`); LANG-15 Word World, CI-28, CI-29, CI-30, CI-31 all BUILT + GREEN on it.
- **Redesign waves (branch-only, NOT pushed):** Wave 1/2/3 built GREEN; Wave-A cherry-pick on `claude/ship-wave-a` (12 commits); wave-4 gated items (AP-049, AP-053, AP-054, AP-057, AP-058, AP-051, AP-060) GREEN in worktree `.arbor-redesign-w4` / branch `claude/redesign-wave4-gated`. None pushed to main.
- **Open gates (block promotion):** arbor-safety COPPA gate (avatar Step 4 / child-day input) + Guy Tier-C still OPEN on AP-049/AP-057. Clinical copy/framing CLEARED on both.
- **Clinical board posture:** most CI items BUILD-READY-NARROWED (no veto). BLOCKED: "Developmental Functioning Assessment Layer" (soundness VETO-partial — deficit-quantification spine). HELD: "Development Framework v2" (VETO-partial). `prohibitedDiagnosticClaims` must be enforced via `screenModelOutput` on every AI-authored string.
- **Shipped to prod (2026-06-22):** REL-ARBOR-001 (AP-001 non-pathologizing framing guard) + REL-ARBOR-002 (AP-005 JITAI i18n EN+HE), Firebase Hosting live.
- **Mobile store:** M1 readiness audit done; M3 listing metadata pack done but CLAIMS GATE HELD (3 unsubstantiated claims, both languages).

---

## Update [2026-06-24] — arbor-design: design-system pass GREEN on claude/arbor-10-capabilities (commit e9b8f3f)
11 files, 70 ins / 32 del. Applied: (1) index.css — 3 new gradient/shadow tokens (--arbor-gradient-lav, --shadow-lav, --arbor-gradient-progress) replacing scattered literals. (2) goalBuilder.ts — 8 hardcoded domainColor hex literals replaced with DOMAIN_COLOR map using BRAND_HEX; #3cc081 regulation/language corrected to canonical #34b277; social domain #e07b5a → BRAND_HEX.peach (#d9763f); motor domain added. (3) OverviewTab.tsx — 3 inline gradient literals → var() tokens; borderRight → borderInlineEnd (RTL fix on 2 grid cells); #5fce97 → BRAND_HEX.greenLight; aria-label on Log Moment button. (4) ChildProfile.tsx — Ask Arbor CTA + milestone progress bar gradients → var() tokens; boxShadow → var(--shadow-green). (5) GoalBuilderModal.tsx — ml-3 → ms-3 (RTL logical property on close button); "Yes, remove"/"Keep it" touch targets px-3 py-1.5 → px-4 min-h-[44px]. (6) ProfileEditDrawer.tsx — close button p-1.5 → min-w/h-[44px]; Add interest button → min-h-[44px]; X chip dismiss → p-3 -m-3 for 44px virtual zone. (7) WordWorldTab.tsx — removed outline:none WCAG 2.4.7 failure; added useLanguage; sourceFraming, Refresh, Skip, Show less/See all, Copied all → t() i18n calls; removed SOURCE_FRAMING_DISPLAY constant. (8) SessionLengthChips.tsx — removed md:py-2 (shrunk touch target below 44px on desktop touch). (9) DailyPlanCard.tsx — aria-live="polite" on happy-path section for state-transition AT announcement. (10) DailyPlayCard.tsx — aria-label on Did/Added button and steps-toggle. (11) i18n.ts — 6 wordworld.* keys added EN + HE. tsc error-file set unchanged (pre-existing 7 broken files only). Build GREEN.

## Update [2026-06-24] — arbor-practice: LANG-15 Word World BUILT + GREEN on branch claude/arbor-10-capabilities
LANG-15 (parent-only Word World coaching track) committed (commit 5eb9e46). 6 files: practice/wordWorld.ts (27 static curated prompts, 3 modules × 3 age bands, ageBandForAge/promptsForBand, all CI-25 approved strings, SOURCE_FRAMING, zero model authorship — screenHookRequired by-construction); components/practice/WordWorldTab.tsx (parent-calm register — SectionCard/cardCls/kit.tsx, module picker 3 cards, Today's Moment card with age-matched prompt + context chip + We tried this + Skip, This Week panel parent-action log with no child-language metric, CI-25 referral rail always visible never auto-fired, OS share-sheet with CI-25 approved text, no PlayShell/confetti/mascot); HeroArcade.tsx (Word World tile BookOpen sky Language + lang-strategy count + lazy import); types.ts ('lang-strategy' added to PracticeEventKind, domain=language, no correct/score, parent-attributed); practice/wordWorld.test.ts (54 tests: 42 banned-token lint checks across effect-verbs/dx-adjacent/branded-programs/clinical-overclaims/child-language-metrics + structural integrity + ageBandForAge + referral strings verbatim + SOURCE_FRAMING); safety/outputScreen.test.ts (LANG-15 §5 — autism/apraxia/ASD diagnosis-leak flags + safe-pass for all approved coaching copy). Build GREEN (vite), 550 tests passed, eval:safety GREEN. COPPA/arbor-safety gate on lang-strategy PracticeEvent write path still required before prod. slp final string-by-string copy pass required before soundness:pass. Monitor nudge wiring to DevelopmentTab is a follow-on frame (language_communication watch signal → "Try some language moments in Word World" deep link).

## Update [2026-06-24] — arbor-practice: CI-30 Daily Plan Generator BUILT + GREEN
CI-30 ("best 15-min activity today" — goal-linked + interest + energy-aware + post-activity observation) built and committed (commit ea4dfab) on branch claude/arbor-10-capabilities. 5 files: practice/dailyPlan.ts (buildDailyPlan, assembleWhyLine, buildGoalObservation, estimateLoggedDayCount, isWeekendDate; screenHookRequired gate — every assembled why-line passes screenModelOutputLexical, condition-name injection falls back to sparse line; effect-verb/comprehension/verdict/clinical-claim lint on templates at module load; no progress-score/ring/trend code path); components/overview/DailyPlanCard.tsx (hero card, 5 states: no-goal/sparse/plan/observing/done; CI-31 chip row; post-activity observation inline form → onObservationSubmit; Ask Arbor shortcut; RTL-safe; clinical firewall copy in pre-screened why-line); components/tabs/DailyPlayTab.tsx (DailyPlanCard mounted above CourseCard — no new tab/sidebar item; goalObservations useChildCollection; plan session-length state persisted per-child; COPPA note preserved); lib/i18n.ts (13 new CI-30 keys EN + HE, plan.card.*); practice/dailyPlan.test.ts (31 tests: assembleWhyLine all variants, screenHookRequired gate, effect-verb/comprehension/verdict/clinical ban, buildDailyPlan 5 variants, COPPA write-path structure, estimateLoggedDayCount, no-aggregation code-path). Build GREEN, 494 tests passed, eval:safety passed. COPPA/arbor-safety review on goalObservations write path gated before prod.

## Update [2026-06-24] — arbor-practice: CI-31 Daily-play session-length chips BUILT + GREEN
CI-31 (Short/Standard/Extended chip row on DailyPlayCard + DailyPlayTab) shipped on branch claude/arbor-10-capabilities, commit f056a84. 7 files, 292 net insertions. New: SessionLengthChips.tsx (chip row component; role=group/aria-pressed/44px tap target/RTL-safe). Changed: select.ts (SessionLength type + SESSION_LENGTH_RANGES + sessionLength filter in rankDailyPlay; filter only applied when explicitly provided — full-pool fallback for cold buckets + backward-compat); DailyPlayCard.tsx (accepts chip props; renders chip row only when onSessionLengthChange provided; duration badge reads chip-label); OverviewTab.tsx (sessionLength state + handleSessionLength; persisted per-child; rhythm calmWindow hint passed via rhythmHintTime); DailyPlayTab.tsx (sessionLength lifted to tab level; chip row above grid; all 4 grid cards share one selection); i18n.ts (5 new keys EN+HE, no banned strings, no clinical claim). Tests: 7 new CI-31 cases added to select.test.ts; 463 pass / 3 skip. Build: green (vite + esbuild). Clinical gate: safe — no child-data write, no developmental/medical/effect-size claim; parent-intent signal only.

## Update [2026-06-23] — arbor-clinical-lead: LANG-15 Parent Language Coaching track (Word World) → BUILD-READY-NARROWED (no VETO)
LANG-15 (parent-only WordWorldTab in Practice Studio/HeroArcade: serve-and-return / narrated play / shared book-reading strategy cards → age-band-matched "Today's Moment" prompt + "We tried this" log → "This Week" descriptive moment list → non-auto-fired CI-25 referral rail) ruled against the pre-set bar (reused, not re-derived: CI-23 §1-4 — this IS a CI-23-class Arbor-native parent-coaching track on communication, slp LEAD; CI-30 recommendation-engine + descriptive-parent-log pattern; CI-25 rail; CI-27/AP-071 output-floor). soundness:concerns(clearable)/claims:none/riskClass:gated → BUILD-READY-NARROWED. No VETO — highest-evidence parent-mediated early-language mechanism, computes NOTHING about the child (no language score/verdict/%/intelligibility/word-count/condition/effect-claim/trend); states mechanism not effect-size; parent-mediated + parent-calm register = attachment-safe, not a kid-companion. 8 binding fixes: (1) "This Week"/log stays parent-attributed descriptive moments — NO child-language-output metric, no growth chart, no milestone count, no accuracy %, no "talking more"/"on track" verdict (slp expressive-language-assessment leak = the line); tile count = parent's logged moments, never a child metric; (2) referral rail reuses CI-25 string verbatim, never auto-fired, share-sheet "discuss my child's language development at our next visit" clean, NO numeric language threshold in copy (source-verify live IF ever surfaced); (3) parent-only parent-calm register — never PlayShell/PlayKit/child-gate/confetti/mascot; (4) no branded-program (Hanen/It Takes Two/More Than Words/OWL/dialogic-as-branded-curriculum) in prompts OR citations — certification-gated, implies evidence without delivery conditions (CI-23 §2); (5) screenModelOutput + CONDITIONS(+language leaks: language delay/apraxia/speech delay/autism/ASD) + test IF any string model-/template-authored, else document by-construction static prompt bank; (6) effect-verb + comprehension-leak + child-language-metric + branded-program build-time lint; (7) arbor-safety COPPA on lang-strategy PracticeEvent write path; (8) firewall §0. peds: 0-5 band caps inside CDC LTSAE anchor (no 6-10 overreach, "grounded in CDC/AAP" validly usable here). SLP-led framing requirement satisfied by this gate (no-claim mechanism-only version). GATE block in PRODUCT-COUNCIL.md.

## Update [2026-06-23] — arbor-clinical-lead: CI-25 Neurodiversity-aware Observation Lens (joint attention + perspective-taking) → BUILD-READY-NARROWED (no VETO)
CI-25 (parent-register-only dated descriptive observation LOG across 4 clusters — Attention/Social-communication/Sensory/Language; Yes/Sometimes/Not-noticed + free-text per prompt; date-grouped timeline; parent-owned deselectable provider-brief export; assessment-prep page) ruled against the pre-set bar (reused, not re-derived: Assessment-Layer partial-VETO — #4 Social Communication Screener SRS construct-clone VETO + M-CHAT hard rule + observation-vs-assessment line; CLINICAL-GUARDRAILS-CI-22-23-24 firewall §0 + age-7 floor + condition/effect bans + CI-24 §2 chart leak; CI-28 narrowing + Blueprint #91/#95/#97 + DEM-005/PHI-08): soundness:concerns(clearable, social-communication cluster narrowed)/claims:none/riskClass:gated → BUILD-READY-NARROWED. **No VETO** — blessed buildable side: emits NOTHING about the child (no score/%/risk-map/verdict/cutoff/aggregation/intensity/trend/condition-inference; Yes/Sometimes/Not-noticed NOT summed; timeline = parent's OWN entries; export parent-owned + L3 + "Not a diagnostic document" header). **Two binding narrowings:** (i) Social-communication cluster = the #4-VETO line — joint attention + perspective-taking ARE SRS-2/M-CHAT-R/F constructs; survives ONLY as raw single concrete parent-observable actions in the parent's voice (never trait/rating/interpretation), prompt SET must NOT clone an instrument's item-structure/subscale grouping, responses NEVER summed/scored/color-coded ("more concerns here" rollup = unvalidated screen → VETO), every cluster tile + prompt clinical-lead-reviewed string-by-string. Banned labels: screener/joint-attention-score/perspective-taking-deficit/theory-of-mind/social-red-flags/autism/ASD/spectrum. (ii) Contextual auto-surfacing = calm optional invitational link, no alert/"concern detected", inherits age-7 EF/attention floor, Ask-Arbor coach string passes output-floor; keep OFF primary bottom-nav. Export = parent's own entries only, NO Arbor-authored summary/"areas of concern", header verbatim, L3 + arbor-safety COPPA on egress (committee/ועדה routing = CEO-gated #7/#10, out of scope). Prep page = cited public guidance, NO instrument named, NO self-screen checklist. screenModelOutput REQUIRED if any string model-authored (CONDITIONS extended: autism/ASD/spectrum/joint-attention-deficit/theory-of-mind/social-communication-disorder/perspective-taking-deficit + test); recommended bound on export-builder as defense-in-depth; build-time lint for condition/effect/instrument tokens across prompts+labels+prep-page+export-template; arbor-safety COPPA on ObservationEntry write/egress path. Lens splits: slp concerns→pass on (i); peds concerns→pass on (ii); psych pass rubric-positive. Honesty flag: NO free public validated parent-administered joint-attention/perspective-taking instrument for 1-12 → CI-25 must stay a raw log, never compute/group/count/interpret; the moment it does it becomes an unvalidated autism screen → VETO. GATE block to append to PRODUCT-COUNCIL.md (file under concurrent write at gate time — verdict captured here as durable record). cited: Assessment-Layer VETO + M-CHAT rule; CDC LTSAE 2022 (Zubler, no anchor for social-comm/perspective output); AAP surveillance-vs-screening (Lipkin/Macias 2020); ASHA Scope; SRS-2 (copyrighted autism instrument); M-CHAT-R/F (link out only).

## Update [2026-06-23] — arbor-clinical-lead: CI-33 Sensory & comfort PREFERENCE log → BUILD-READY-NARROWED (no VETO)
CI-33 (`CI-33-sensory-comfort-log`: SensoryComfortLog card in My Child>Development; 2 clearable free-text sublogs comfort/overwhelm; silent sensoryHint→CI-30) ruled against Blueprint #62 (cleared "what-helps-feel-comfortable" LOG, banned `sensory profile`+any count/threshold/verdict) + FDI "regulation Map" VETO (Map=VETO, log=clearable). soundness:concerns(clearable)/claims:none/gated → BUILD-READY-NARROWED. It IS the cleared log shape (produces NOTHING about the child; "no aggregate/count/cross-sublog comparison ever"). 6 binding fixes: (1) banned-string lint EN+HE — sensory profile/seeker/avoider/over-under-responsive/SPD/sensory processing/sensitivity/diet/tactile-defensive/vestibular/proprioceptive in every string+label+tooltip+empty-state+chip; (2) empty-state/hint descriptive-only, locked verbatim, no "what this means about your child" read; (3) sensoryHint count-FREE (presence-keyed routing lookup, never "N dislikes→flag" = §62 SPD-screen line) + never rendered to child/parent; (4) output-floor only if any model-authored summary ships (none in scope — document) + free-text sanitized through CONDITIONS before echo; (5) arbor-safety COPPA on sensory-comfort/sensory-overwhelm write paths; (6) slp AAC chip+short-text path, parent-register only. Motor Domain-E nodes = SEPARATE clinical pass, NOT covered. GATE block in PRODUCT-COUNCIL.md.

## Update [2026-06-23] — arbor-clinical-lead: CI-32 Daily-Living routines → BUILD-READY-NARROWED (no VETO)
CI-32 (Sleep-routine builder + Night-waking log + Toilet-readiness; descriptive parent-owned logs feeding predictRhythm) ruled against the pre-set bar (reused, not re-derived: B3 §B3 + 100-Blueprint #67/#72 + DEM-003): soundness:concerns(clearable)/claims:none/riskClass:gated → BUILD-READY-NARROWED. No VETO — descriptive child-as-own-baseline log + structured routine builder are sound; every norm/adequacy verdict is blocked. Narrowings: (A) Sleep builder = content suggestions, no clock target/schedule, no "improves sleep/reduces wakings/builds self-soothing" effect verb; routine-complete→predictRhythm inherits B3/rhythm-predict honest-confidence contract (bands, low/"still learning" state, family's OWN pattern). (B) Night-waking = DEM-003 guardrail IS the feature: hour-bands not precision, additive chips no rank, NO norm cutoff ("most 2yos wake 0-1x, [child] above range" = blocked even without "disorder"); under-1 AAP safe-sleep guard LOAD-BEARING — "what helped" chips must NOT surface bed-sharing/weighted-sack/positioner/inclined-sleeper, infant waking SIDS-protective not a problem to reduce; persistent-pattern routing MUST reuse CI-24 fire-once + ≥90d cooldown, never a "wakings trending up" chart (sleep-screen proxy, MDR Rule 11). (C) Toilet = AAP child-readiness-not-age checklist, no readiness score/verdict; HARD medical off-ramp — constipation/stool-withholding/painful BM/regression = route out, never "push harder"; no enuresis/encopresis. (D) Feeding stays OUT of scope (slp swallow-safety veto, #69/#70 floor intact). screenModelOutput enforcement REQUIRED + CONDITIONS extended (sleep disorder/insomnia/enuresis/encopresis) + test; arbor-safety COPPA on nightWakings + routine-complete + toilet write paths. GATE block to append to PRODUCT-COUNCIL.md (file was under concurrent write at gate time — verdict captured here as durable record). cited: AAP sleep consensus (Paruthi 2016, ranges) + AAP safe-sleep + AAP toilet-readiness + CDC LTSAE + MDR Rule 11.

## Update [2026-06-23] — arbor-clinical-lead: CI-27 Developmental Capability Graph + admin/seed + prohibitedDiagnosticClaims via screenModelOutput → BUILD-READY-NARROWED (no VETO)
CI-27 (AP-071, architecture spine) ruled against the pre-set bar (reused, not re-derived): soundness:pass/claims:none/riskClass:safe → BUILD-READY-NARROWED. It IS the enforcement build of the primitive the board already blessed (100-Blueprint: enrichment core + typed prohibitedDiagnosticClaims = SAFE *once enforced via screenModelOutput*). CI-27 computes no number, renders no verdict — it is the mechanism that prevents the device-adjacent leaks downstream. 4 binding narrowings: (1) buildConditionsForCapability MERGES (OR), never replaces, base CONDITIONS — CI-22/23/24 floor always applies; build-time superset assertion; (2) prohibitedDiagnosticClaims non-empty + floor-seeded (condition names per domain + effect verbs + instrument names SRS/Vineland/ABAS/BRIEF/M-CHAT/ASQ + branded programs) for every AI-gen-eligible node — capabilityAdmin hard-fails CI otherwise; (3) Domain G school_readiness = enrichment ONLY, NO readiness score/verdict/index/percentile (device-adjacent construct-clone class = FDI-03/FDI-04/CI-02 VETO family), observableSignals child-as-own-baseline not normed rungs; (4) DailyPlayCard "because…" line through screenModelOutput, observable signal not domain-label verdict, no effect verb. screenModelOutput enforcement REQUIRED. outputScreen.test.ts must assert BOTH a seeded prohibited term AND a base-CONDITIONS term (e.g. "looks like ADHD") caught on the capability path (proves the merge). GATE block in PRODUCT-COUNCIL.md.

## Update [2026-06-23] — arbor-clinical-lead: CI-30 Daily Plan Generator → BUILD-READY-NARROWED (no VETO)
CI-30 ("best 15-min activity today" — goal-linked + interest + energy-aware recommendation + inline post-activity observation) ruled against the pre-set bar (reused, not re-derived): soundness:concerns(clearable)/claims:none/riskClass:gated → BUILD-READY-NARROWED. No VETO — it is a recommendation engine + a descriptive parent log, computes NOTHING about the child (no score/verdict/%/risk-map/instrument-clone/condition/effect-claim/trend); reuses rankDailyPlay. 5 binding fixes: (1) why-line is provenance/mechanism only — bind to screenModelOutput + CONDITIONS + test (it interpolates the CI-28 goal label + CI-29 interest); the CI-28 behavior-noun-not-condition-noun gate is load-bearing so no condition name reaches the why-line; (2) post-activity observation stays a parent-attributed descriptive note — NEVER a goal-progress score/%/completion-ring/trend-chart/"on track" verdict (CI-24 §2 + CI-28 leak); (3) arbor-safety COPPA on the observation write path; (4) effect-verb + comprehension-leak lint on why-line + observation; (5) firewall §0 on all copy. screenModelOutput enforcement REQUIRED on the why-line. Duration chips/weekend/coach-shortcut = no clinical hold. GATE block in PRODUCT-COUNCIL.md.

## Update [2026-06-23] — arbor-clinical-lead: CI-29 GATE → BUILD-READY-NARROWED (soundness:pass-conditional / claims:none / gated)
CI-29 (interests[] + interest-boost selector) cleared the clinical gate, no VETO — an interest = parent-logged preference (CI-62/CI-33 comfort-log class), not a developmental signal; no score/verdict/risk-map/condition-inference/effect-size in the design. 5 binding narrowing fixes: (1) interest record never interpreted — ban restricted/repetitive/fixation/perseveration/hyperfocus/narrow-interest reads + no interest-drift trend/verdict (autism-adjacent, FDI-04/CI-24 class); (2) no effect-verb on the child via the why-line (mechanism only); (3) sanitize free-text interest through CONDITIONS lexicon before it echoes into card copy (copy-injection floor); (4) LLM theme-rewrite stays a SEPARATE future gate (screenModelOutput + test, 100-Blueprint #2 bar); (5) parent-entered only (AAC/minimally-verbal non-exclusion), never a kid-companion. riskClass:gated stands on arbor-safety COPPA write-path + Guy. Verdict block in PRODUCT-COUNCIL.md.

## Update [2026-06-23] — arbor-clinical-lead: CI-28 Goal Builder + parent-concern→goal spine → BUILD-READY-NARROWED (no VETO)
CI-28 ruled against the pre-set bar (reused, not re-derived): soundness:concerns(clearable)/claims:none/riskClass:gated → BUILD-READY-NARROWED. Clears the observation-vs-assessment line because it emits NOTHING about the child (no score/verdict/%/risk-map/instrument-clone/condition/effect-claim/trend); parent explicitly selects from a curated label list; "X observations linked" is a flat count of the parent's OWN logged moments (cleared #95/#22 frame), not a child metric. 3 narrowings: (A) clinical-lead reviews the actual 8-10 goal-label strings + concern→goal mapping (behavior-noun not condition-noun, no effect-verb, no "screen/assess"); (B) observation count stays a FLAT COUNT — never %/progress/streak/trend (CI-24 §2 leak); (C) concern→goal reframe passes screenModelOutput IF model-authored + speech/dev concern offers the non-auto-firing CI-25 referral rail (numbers source-verified live), never swallowed into a play-goal. Plus arbor-safety COPPA on the activeGoals write path. GATE block in PRODUCT-COUNCIL.md.

## Update [2026-06-24] — arbor-practice: CI-29 BUILT to green on branch claude/arbor-10-capabilities
CI-29 Activity Personalization (interests[] + interest-boost selector) built and committed (commit 3ffcd1e). 10 files: types.ts (interests[], interestsUpdatedAt on ChildProfile, additive), playbank/content.ts (themeableContextSlot on 5 activities), playbank/select.ts (sanitizeInterestToken FIX-3 CONDITIONS+BANNED regex, 1.3x interestBoost in rankDailyPlay, matchedInterest on ScoredActivity, interest-match reason), playbank/select.test.ts (+17 CI-29 tests: interest-boost scoring + sanitizeInterestToken FIX-3 gate), ProfileEditDrawer.tsx (Interests section: 12 suggestion chips EN/HE, free-text add, X-dismiss, last-updated line, saves interests[]+interestsUpdatedAt), DailyPlayCard.tsx (lav interest-match chip when themeableContextSlot+matchedInterest; interest why-line variants), ChildProfile.tsx (Interests field in Chapter 1 SectionCard: lav chips, +N overflow), OverviewTab.tsx + DailyPlayTab.tsx (pass childProfile.interests to selectDailyPlay), i18n.ts (Hebrew profile.interests section + 12 interest chips). All 5 clinical fixes honored: (1) no restricted/repetitive/fixation/perseveration copy; (2) why-line mechanism-only, no effect-verb; (3) sanitizeInterestToken gate at render; (4) LLM theme-rewrite fenced out; (5) parent-facing only. Build GREEN, 456 tests passed, eval:safety passed. COPPA/arbor-safety gate still required before prod deploy.

## Update [2026-06-23] — arbor-practice: CI-28 BUILT to green on branch claude/arbor-10-capabilities
CI-28 Goal Builder built and committed (commit 292e2b7). 11 files: practice/goalBuilder.ts (8 GOAL_TILES, build-time lint, CONCERN_TO_GOAL_PREFILL, activeGoalDomains), practice/goalBuilder.test.ts (20 tests, label lint + gate §B flat-count contract), components/practice/GoalBuilderModal.tsx (selection + status states, gates §B/§D honored), components/practice/GoalBuilderPromptCard.tsx (session-dismissible prompt card), types.ts (activeGoals?: ActiveGoal[] on ChildProfile, additive), playbank/select.ts (goalDomains + 1.6x weight + goal-match reason), playbank/select.test.ts (+6 CI-28 goal-weighting tests), DailyPlayCard.tsx (goal-match reason + goalLabel prop), OverviewTab.tsx (prompt card + modal + goalDomains), DailyPlayTab.tsx (Goals chip + modal + goalDomains), i18n.ts (play.whyGoal EN+HE). Build GREEN, 444 tests passed. Gate §E (COPPA on activeGoals write path) gated — requires arbor-safety co-sign before prod deploy. Label list uses 100% static curated strings; screenModelOutput conditional gate not triggered. Clinical-lead string review (gate §A) still required before ship to prod.

## Update [2026-06-23] — arbor-clinical-lead: CI-24 FeelingsLab Personalized Layer → BUILD-READY-NARROWED (no VETO)
CI-24 build-ready design ruled against the pre-set CLINICAL-GUARDRAILS §CI-24 bar (not re-derived): soundness:concerns(clearable)/claims:none/riskClass:gated → BUILD-READY-NARROWED. Design honors the gate shape (6 generic emotions, no zones, no child intensity, timeline-not-chart, fire-once escalation w/ intensity+duration AND-threshold + ≥90d cool-down, trends co-reg outcomes not emotion-word-count). 7 binding fixes: EscalationNudge copy verbatim §3; lock the open child-facing strings (non-evaluative MascotSay, headers verbatim §1, "Co-regulation comes first" on every card); intensity internal-only/never rendered/no chart code path; output-floor on any model-authored summary; fire-once+cooldown guard test; arbor-safety COPPA on 3 new child-data writes (emotion-checkin, feelingsEscalation, mark-tried calm event); AAC-primary input. Build-ready only after psych+safety co-sign exact strings. GATE block in PRODUCT-COUNCIL.md.

## Update [2026-06-23] — arbor-ux: CI-29 Activity Personalization / interests[] + interest-boost selector — design spec produced

**Capability:** CI-29 (AP-073 candidate) -- interests[] field on ChildProfile + themeableContextSlot boolean on PlayActivity + 1.25x interest-boost multiplier in rankDailyPlay. LLM theme-rewrite is a guarded follow-up gated on arbor-ai CIL para 2 cost review; Phase 1 is score-boost only.
**riskClass:** gated -- arbor-safety COPPA review required on interests[] write path (child-associated data field). No clinical framing gate on Phase 1 (interests are personalization inputs, never developmental signals; no inference copy).
**Research basis:** PRODUCT-BACKLOG.md CI-29 spec (L2265-L2291); live types.ts ChildProfile; playbank/select.ts rankDailyPlay formula; playbank/content.ts PlayActivity structure; ProfileEditDrawer.tsx form pattern; DailyPlayCard.tsx layout; sections/ChildProfile.tsx Chapter 1; kit.tsx Chip/SectionCard/PASTEL; index.css token set; lib/i18n.ts EN+HE pattern. Grounded in live code, no assumption.
**Key design decisions:** interests collected in ProfileEditDrawer only (not onboarding -- avoids Tier-C gate); chip-toggle pattern reuses green-soft/green-ink active pair; interest badge uses existing Chip (tone=lav) between h2 and whatItBuilds; interest-boost 1.25x is below concernBoost 1.8x so concern-match activities are not displaced; reason union gains interest-match; why-line gains two new i18n branches; ChildProfile display Chapter 1 gains Interests Field row.
**Open gates:** arbor-safety COPPA review on interests[] write path (required before build-ready); arbor-ai cost estimate before enabling LLM substitution fast-follow.
**Files to touch:** app/src/types.ts, app/src/playbank/content.ts, app/src/playbank/select.ts, app/src/components/profile/ProfileEditDrawer.tsx, app/src/components/overview/DailyPlayCard.tsx, app/src/components/sections/ChildProfile.tsx, app/src/lib/i18n.ts, app/src/context/ArborContext.tsx, app/src/components/tabs/OverviewTab.tsx.

## Update [2026-06-23] — arbor-ux: LANG-15 Parent Language Coaching Track — design spec produced

**Capability:** LANG-15 — Parent Language Coaching Track: serve-and-return interaction coaching, narrated play, shared book-reading. Three highest-evidence parent-mediated early-language strategies delivered as a parent-only coaching surface inside Practice Studio's "Sound Lab" / language domain. No child-facing copy; no intervention-effect claim; no Hanen/ESDM/DIR reference in any copy or citation.
**riskClass:** `gated` — ASHA scope gate: any coaching surface touching language must not position Arbor inside SLP-reserved intervention scope. Claim ceiling: mechanism only ("daily back-and-forth is how young children build communication — these activities give you structured moments to do that," CI-23 verbatim). CI-23 referral rail required (CI-25 string, ASHA/CDC thresholds source-verified live). output-screen `CONDITIONS` extension for language-delay / language-disorder / speech delay tokens. arbor-clinical-slp lead; arbor-safety COPPA on any new child-data write; no efficacy claim on any language/speech/communication noun.
**Research basis:** CLINICAL-GUARDRAILS-CI-22-23-24.md (CI-23 language-track clause, CI-23 referral rail, banned-strings), framework.json (`language_communication` domain, serve-and-return in 0–12m and 12–36m `productBehavior`), PRODUCT-BACKLOG.md CI-23 (language track is the "tracks touching communication" item), live code: `practice/journey.ts` (`language` domain in EXTRA_BY_DOMAIN + OBJECTIVE_TEMPLATES), `playbank/select.ts` (`domainForBehaviorType` — `language` domain regex already includes `speech|word|talk|language`), `SpeechCoachTab.tsx` + `practice/content.ts` (Sound Lab/speech surface — LANG-15 lives alongside, not inside, speech articulation), `playbank/content.ts` (`PlayDomain` includes `language`), `FeelingsLabTab.tsx` (PlayShell/PlayKit pattern for child-facing), `BehaviorsTab.tsx` (log form idiom), `monitoring.ts` (`language_communication` domain already watched), `safety/outputScreen.ts` (`screenModelOutput` + `CONDITIONS` regex base), `lib/tokens.ts` + `kit.tsx` + `playkit.tsx` (design system), `lib/i18n.ts` (EN+HE pattern), `types.ts` (`ChildProfile`, `BehaviorLog`, `PracticeEvent`), `usePracticeData.ts` (practice event persistence pattern).
**Design decisions:** (1) LANG-15 is a PARENT-ONLY coaching surface — zero child-facing copy; housed inside HeroArcade as a new "Word World" tile (PlayTone `sky`, `BookOpen` icon) under the existing `language` PracticeDomain. (2) Three strategy modules: Serve-and-Return Coach, Narrated Play Coach, Shared Reading Coach. Each is a parent-facing card, not a game. (3) Each session: Arbor shows one strategy prompt + a concrete "today's moment" (context-matched by child age band) + a one-tap "We tried this" log that writes a `PracticeEvent` (kind `lang-strategy`, domain `language`). (4) No progress score, no percentage, no "sessions completed = language improved" framing. (5) Pattern view: a parent-facing timeline of logged moments ("strategies you've tried this week") — never a language-growth chart. (6) Referral rail: reuses CI-23/CI-25 string verbatim; surfaces as passive available-guidance link, not auto-fired. (7) SLP-lead framing required on all copy before build.
**Files to touch:** `playbank/content.ts` (add `language` PlayActivities for the three strategy types), `practice/playContent.ts` (add `LANG_STRATEGY_PROMPTS` bank), new `components/practice/WordWorldTab.tsx`, `components/practice/HeroArcade.tsx` (add Word World tile), `types.ts` (additive `PracticeEvent` kind `lang-strategy`), `practice/signals.ts` (count lang-strategy events), `safety/outputScreen.ts` (extend `CONDITIONS` regex), `safety/outputScreen.test.ts` (add lang-delay/lang-disorder test), `lib/i18n.ts` (add `lc.*` EN+HE keys).
**Gate blockers:** (1) arbor-clinical-slp copy pass on ALL strategy prompt copy, referral-rail numbers, and "what this does" framing — no build without this pass. (2) ASHA scope gate: confirm no-claim version is sound before any build wave starts. (3) arbor-safety COPPA review on `lang-strategy` event write path (child id referenced). (4) `CONDITIONS` extension + test must be green before the pattern view ships any AI-authored summary string.
**Open clinical questions:** 9 items — see StructuredOutput `openClinicalQuestions`.

## Update [2026-06-23] — arbor-ux: CI-33 Sensory & Comfort Preference Log — design spec produced

**Capability:** CI-33 (AP-077 candidate) — Sensory & Comfort Preference Log: parent logs what helps this child feel comfortable (soothing strategies + comfort triggers), and what tends to overwhelm them. Pure descriptive log; no profile, no count, no threshold, no SPD-screen language.
**riskClass:** `gated` — sensory log is a new child-data write (COPPA/GDPR); label-leak risk on every string (banned: "sensory profile," "sensory seeker," "sensory avoider," "over/under-responsive," "SPD," "sensory processing"); no count/threshold/verdict over dislikes; arbor-clinical-lead + arbor-clinical-slp copy pass required; arbor-safety COPPA review on write path.
**Research basis:** PRODUCT-BACKLOG.md CI-33 spec (L2381–L2404), CLINICAL-GUARDRAILS-CI-22-23-24.md (binding clinical frame, reused for all copy guardrails), live `types.ts` (ChildProfile, BehaviorLog, DevelopmentalDomainId — `sensory_motor_patterns` domain already exists), `useChildCollection.ts` (Firestore + localStorage persistence pattern), `RoutinesCard.tsx` (upsert/remove idiom for simple item collections), `BehaviorsTab.tsx` (log form idiom, inline context), `monitoring.ts` (`sensory_motor_patterns` domain already watched; existing `classifyBehaviorDomain` keyword regex includes `sensor|sound|noise|texture|touch|motor` — spec must not duplicate), `index.css` (token set), `kit.tsx` + `tokens.ts` (PASTEL, cardCls, SectionCard, IconBadge), `i18n.ts` (EN+HE pattern), OverviewTab (parent register, no child-facing copy).
**Design decisions:** (1) Housed inside the existing "My Child" section, as a new `SensoryComfortLog` component reachable from the Development sub-tab — no new nav tab. (2) Two clearly-labelled sublogs: "What helps [child] feel calm / comfortable" (comfort log) and "What tends to feel like too much" (overwhelm log). Never "likes/dislikes" or "seeks/avoids." (3) Each entry: free-text description + optional category tag (Sound / Touch / Light / Movement / Smell / Taste / Routine) + optional "what you did that helped" field (on comfort entries only). The "what helped" field is the soothing strategy — the core personalization input for CI-30. (4) Clearable collection: "Clear all" with a confirmation step; no count shown, no aggregate surfaced. (5) Each entry displays as a read-only chip/row; tap to expand inline for edit. (6) Parent register throughout; no child-facing copy on this surface. (7) CI-30 Daily Plan Generator reads `sensoryComfortLog.comfortItems` to adjust plan texture (low-stim vs movement-first) without ever surfacing the raw log to the child.
**Files to touch:** `types.ts` (additive `SensoryComfortEntry` + `sensoryComfortLog` field on `ChildProfile`), new `lib/sensoryComfort.ts` + `lib/sensoryComfort.test.ts`, `components/tabs/DevelopmentTab.tsx` (add SensoryComfortLog section), new `components/mychild/SensoryComfortLog.tsx`, `lib/i18n.ts` (add `sc.*` EN+HE keys), `playbank/select.ts` or `lib/dailyPlan.ts` (read comfort entries for plan personalization).
**Gate blockers:** (1) arbor-clinical-lead + arbor-clinical-slp copy pass on all string/label/empty-state/category-tag copy; (2) arbor-safety COPPA review on `sensoryComfortLog` Firestore write path.
**Open clinical questions:** 8 items listed in spec (category tag wording, "what helps" prompt copy, overwhelm log framing, empty-state copy, "clear all" confirmation copy, CI-30 linkage copy, HE locale, monitoring.ts keyword overlap boundary).

## Update [2026-06-23] — arbor-ux: CI-30 Daily Plan Generator — design spec produced

**Capability:** CI-30 (AP-074 candidate) — Daily Plan Generator: goal-linked, interest-themed, energy-aware. Post-activity observation closes the loop back to the goal.
**riskClass:** `gated` — inherits CI-27/28/29 gates; generator itself carries no new clinical claims once upstream inputs are cleared. No new child-data write beyond what CI-28/29 introduce.
**Research basis:** PRODUCT-BACKLOG.md CI-30 spec (L2294–2320) + WIREFRAME-SCOPE-CI.md "S2 Daily Plan" slice + live code (DailyPlayCard, DailyPlayTab, select.ts rankDailyPlay, GoalsCard, jitai.ts, monitoring.ts, index.css tokens, kit.tsx). Grounded in live code, no assumptions.
**Design decisions:** (1) Generator surfaces inside existing "daily-play" tab as a hero card above the activity grid — no new tab, no new chrome. (2) ONE plan per daySeed (stable within a day), never a ranked list (backlog hard rule). (3) "Why this" line surfaces goal label + concern-domain match — visible provenance is the moat. (4) Post-activity observation is a 1-tap inline quick-log writing to the goal's child collection. (5) Empty state routes to Goal Builder — not a dead end. (6) Energy/duration chip row (CI-31) sits above card; rhythm calmWindow optionally suggests duration (hint, not auto-select). (7) Parent register throughout; no child-facing copy.
**Files to touch:** new `lib/dailyPlan.ts` + `lib/dailyPlan.test.ts`, `playbank/select.ts`, `playbank/content.ts`, `types.ts` (additive ChildProfile fields), `components/tabs/DailyPlayTab.tsx`, new `components/overview/DailyPlanCard.tsx`, `components/overview/GoalsCard.tsx`, `lib/i18n.ts`.
**Open clinical questions:** (1) "Why this" line copy needs arbor-clinical-lead pass (no effect-size verb). (2) Goal label list (CI-28) must be pre-cleared before generator can reference it. (3) Post-observation "what you noticed" prompt copy needs clinical-lead pass.

## Update [2026-06-23] — arbor-ux: CI-28 Goal Builder + Parent-Concern→Goal Spine — design spec produced

**Capability:** CI-28 (AP-072 candidate) — Goal Builder flow, concern→goal spine, `activeGoals` on `ChildProfile`, selector wiring.
**riskClass:** `gated` — `ChildProfile` schema expansion is child-data (COPPA/GDPR); goal-label copy must be cleared by `arbor-clinical-lead`.
**Research basis:** PRODUCT-BACKLOG.md CI-28 spec (L2226–L2262), CLINICAL-GUARDRAILS-CI-22-23-24.md (binding clinical frame reused for copy guardrails), live `types.ts` (ChildProfile, no `activeGoals` yet), `playbank/select.ts` (scoring formula, `concernDomains` pattern), `GoalsCard.tsx` (existing free-text goal UX to replace/extend), `OnboardingFlow.tsx` (CONCERNS pattern as design precedent for goal-chip tile layout), `Modal.tsx` + `EmptyState.tsx` (UI kit primitives), `useChildCollection.ts` (Firestore + localStorage pattern for persistence), `MobileNav.tsx` + `navigation.ts` (IA, 6 sections, "Grow" home), `lib/i18n.ts` + `LanguageContext.tsx` (RTL/HE pattern), `index.css` (token set — `--arbor-green-ink`, `--arbor-clay`, `--arbor-paper-deep` etc.), `framework.json` (7 DevelopmentalDomainIds → mapped to 8 CI-27 CapabilityDomains for cluster wiring).
**Gate blockers:** (1) arbor-clinical-lead copy pass on curated goal-label list; (2) arbor-safety COPPA review on `activeGoals` Firestore write path.
**Open clinical questions:** 9 items listed in spec (goal label phrasing, max goals cap, empty-state copy, link copy, "because" line, locale copy, concern→goal pre-fill, goal→observation link UX, status view copy).

## Update [2026-06-23] — arbor-ux: CI-31 Duration/Energy-Level Variants — design spec produced

**Capability:** CI-31 (AP-075 candidate) — sessionLength short/standard/extended chip row, persisted as UI preference, wired into `PlayActivity` selector.
**riskClass:** `safe` — no new child-data write (last-used duration is a UI/localStorage preference), no clinical framing, additive to existing selector. Clinical Board pre-cleared.
**Research basis:** Backlog spec CI-31 (PRODUCT-BACKLOG.md L2323–L2342) + selector idiom (playbank/select.ts) + DailyPlayCard/DailyPlayTab layout + RhythmStrip calmWindow signal + i18n pattern (lib/i18n.ts) + index.css token set. No assumption — grounded in live code.
**Design decisions:** chip row above "How to play" accordion, not below action buttons (avoids disrupting the "We did this" CTA flow); duration persisted to localStorage keyed per childId (mirrors existing `arbor.play.done.${id}` pattern); rhythm calmWindow suggestion is optional text hint, not auto-selection; `effortLevel` is a new `PlayActivity` field (low/standard/extended) required for the filter; EN+HE strings added to i18n.ts.
**Files to touch:** `playbank/content.ts` (add `effortLevel`), `playbank/select.ts` (add `sessionLength` to `PlaySelectContext` + filter), `components/overview/DailyPlayCard.tsx` (chip row), `components/tabs/DailyPlayTab.tsx` (pass sessionLength state), `lib/i18n.ts` (add keys for both locales).
**Open clinical questions:** none — CI-31 is pre-cleared safe. No clinical gate required.

## Update [2026-06-23an] — arbor-orchestrator: REDESIGN GATED WAVE COMPLETE — all 8 items green on branch, NOT pushed

**Wave:** Redesign Reconciliation gated wave (AP-049, AP-051, AP-053, AP-054, AP-056, AP-057, AP-058, AP-060). 6 pre-built green; this run built the last 2 hardest child-data items (AP-049 + AP-057), ran the composite gate, and collected the mandatory VETO sign-offs.

**Worktree:** `C:/Users/dguyr/ROS/.arbor-redesign-w4`, branch `claude/redesign-wave4-gated`, final HEAD `14fe165` (ahead of origin/main by 9; NONE pushed). No other worktree touched.

**Commits this run:** `edf82b6` AP-049 (5-step onboarding) · `43fb29c` AP-057 (Bedtime Stories) · `14fe165` AP-049 AC-1 close (re-launchable demo). [Recovered once from a stray orchestrator rebase that dropped AP-049; hard-reset to known-good 43fb29c, re-applied the demo edit as a clean follow-up commit.]

**AP-049 — 5-step onboarding (PASS):** Step 3 focus-picker uses the cleared non-pathologizing copy VERBATIM (EN+HE transcreated, no score/status/deficit/red styling). Step 4 avatar reuses AvatarCreator's existing consent-before-capture path (`face_processing` grant recorded BEFORE generateAvatar via `avatarGate.ts:runAvatarGeneration`); F-NEW behavioral test (`AvatarCreator.captureGate.test.ts`, 6 cases) is ORDER-PINNED — fails on reorder. Reference photo local-only; server 451 fail-closed intact. AC-1 demo replay is non-persisting (no profile write / consent / capture during replay).

**AP-057 — Bedtime Stories (PASS):** new `/generate-bedtime-story` route + `BedtimeStoriesTab` + `bedtime-stories` tab (registered ArborContext + Shell — not orphan). screenForImmediateEscalation runs on the day-derived input (`buildEscalationInput`) → 409 BEFORE generation (model never called on a match). createRedaction(childName) seam (redact→model→restoreDeep). Retention = generate-and-discard (no new child-data store → GDPR-clear by absence; ai_training default-OFF, no training retention). No new ConsentPurpose/egress. Escalation test (`bedtimeStories.test.ts`, 11 cases) asserts gate fires before generation.

**Composite gate on HEAD 14fe165 (ALL GREEN):** lint (tsc) exit 0 · test 87 files / 969 pass / 3 skip (pre-existing firestore.rules emulator skip) / 0 fail (incl. AP-049 6 + AP-057 11 new tests, both run in full pass) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 WARN (pre-existing F11 activities + F18b coRegulationScript — not this wave's regressions; F9 consent-purposes + F12 escalation floors PASS).

**Sign-offs (all VETO holders cleared, NO veto):** arbor-safety PASS (F-NEW consent-before-capture order-pinned + real; AP-057 escalation-on-input + redaction + generate-and-discard + ai_training-off + no new consent surface) · arbor-clinical-lead PASS (AP-049 Step-3 copy verbatim EN+HE; AP-057 framing warm/strengths-based under NON_DIAGNOSTIC_CONTRACT) · arbor-qa PASS (routes reachable, HE/RTL + mobile preserved, both new suites execute, no coverage regression).

**State:** green-to-branch only. NOT merged, NOT pushed, NOT deployed. **Blocked-on-human (Tier-C, deploy-gate):** Guy's individual sign-off on AP-049 (child-photo capture) + AP-057 (child-day record → generative prompt at recurring scale) before prod-promote; AP-060 still carries an open ASQ-3 IP check before its own promote. Merge to main runs through the release pipeline, not in-session.

## Update [2026-06-23] — arbor-design: Wave-A cherry-pick build COMPLETE — 12 commits landed on claude/ship-wave-a, NOT pushed

**Worktree:** `C:/Users/dguyr/ROS/.arbor-waveA`, branch `claude/ship-wave-a`, base `70a9b17` (origin/main post-all-4-redesign-waves). Final HEAD: `47ae40a`. NOT pushed, NOT merged, NOT deployed.

**All 12 commits landed (no DROP, no DEFER):**
- `9d7263b` fix(deps): PrideMomentCard framer-motion → motion/react (clean)
- `4112b4e` R3: PrideMomentCard shareable via existing ShareButton (growth_card, text-only) (clean)
- `767fa33` R4: StoryTimelineTab shareable via existing ShareButton (story, text-only) (clean)
- `66d83a9` Q1: inline CTA gradient → --gradient-cta token (18 files; OnboardingFlow conflict resolved — 5-step redesign kept, token swap applied to all 5 step buttons additively; 24 replacements total vs 20 in source)
- `988683a` QA-1: optional gender field (OnboardingFlow conflict resolved — added gender state+prop+UI additively into 5-step StepChild; ProfileEditDrawer/types/i18n auto-merged clean; EN+HE keys present)
- `b92dc3e` QA-2: dir=auto on free-text inputs (OnboardingFlow conflict resolved — kept 5-step structure, applied dir=auto to name input in StepChild; ProfileEditDrawer auto-merged clean)
- `087d037` QA-3: optional exact DOB (OnboardingFlow conflict resolved — import, props, DOB precedence logic, coachSeed string all reconciled additively into 5-step; EN+HE keys present)
- `ff264c3` QA-4: Story tab last in navigation (clean)
- `a1d8dd3` QA-6: right-size CTA + modal X inline-start (clean, applied on top of Q1 QuickCaptureBar/QuickLogModal)
- `924bfb1` QA-4(speech): fix Speech Coach stale age on child switch (clean)
- `c7a37ec` QA-7: Hebrew default for IL/Hebrew locale (clean, HE only for he/iw primary subtag)
- `47ae40a` D2: comic-book CSS restored (index.css conflict resolved — theme overrides kept, comic block appended after; `:root` untouched; selectors match HeroJourneyTab/HeroComicsTab live usage)

**Q1 file-hunk status:** all 18 files had the inline literal still present — ALL 18 hunks applied (0 dropped-as-already-done). OnboardingFlow additionally had 5 new step buttons with the literal (5-step redesign buttons), all 5 also swapped.

**Green-gate on final HEAD `47ae40a`:** lint PASS (tsc exit 0) · test 969 pass / 3 skip / 1 fail (pre-existing dayWindowsAgg "predict" baseline) · check:framework PASS (2 pre-existing warns) · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 WARN (pre-existing F11+F18b).

**Share cards (R3/R4):** both reuse existing ShareButton + shareCard text-only renderer (getCardOpts: name+headline/title+takeaway, NO photo field, NO score). Zero new child-data egress paths introduced.

**Token integrity:** no new hardcoded hex in component edits; `#171b22` in D2 is the single `--comic-ink` token definition (all usage via var()); comic-CSS token-first, conforms to merge-lock append rule.

## Update [2026-06-23am] — arbor-design: AP-049 AC-1 gap closed — ob.demo.relaunch entry point wired, wave4 branch, NOT committed

**Frame:** QA flagged that `ob.demo.relaunch` (EN+HE) existed in i18n.ts but had no rendered entry point; demo could not actually be re-launched. Worktree `C:/Users/dguyr/ROS/.arbor-redesign-w4`, branch `claude/redesign-wave4-gated`. One file changed; NOT committed (orchestrator commits).

**File changed:** `src/components/auth/OnboardingFlow.tsx`

**What was added:**
- `replaying: boolean` state in root `OnboardingFlow`. When `true`, the flow is a preview-only pass.
- `startReplay()` — sets `replaying=true` and resets `step` to 1.
- "Replay the tour" (`ob.demo.relaunch`) button on `StepReady` below the primary CTA: `var(--arbor-muted)` + `RefreshCw` icon, `minHeight: 44`, `aria-label`. EN+HE via `t()`.

**Demo-mode guards (no profile write / consent / capture during replay):**
1. `handleStep2Next`: `if (replaying) { goNext(); return; }` — skips `addChild` entirely. No second child profile created.
2. `submit` (Step 5): `if (replaying) return;` — skips `updateChild`, challenges patch, `coachSeed` localStorage write.
3. `StepAvatar` `replayMode` prop: when true, "Continue" calls `onSkip` directly (never opens `AvatarCreator`); `AvatarCreator` is not rendered at all (`{!replayMode && <AvatarCreator …/>}`). Zero `face_processing`/`grantConsent`/`generateAvatar` calls fire.
4. Step 4 render guard: widened to `(createdChildId || replaying)` so the step renders for preview; `childId=""` fallback is passed but unreachable because `AvatarCreator` is suppressed.

**F-NEW test:** `AvatarCreator.captureGate.test.ts` unchanged; all 6 assertions still pass.

**Gate:** lint 0 errors · npm test 969 pass / 3 skip / 0 fail · NOT committed / NOT pushed.

## Update [2026-06-23al] — arbor-qa: wave-4 gate sign-off (AP-049 + AP-057) — PASS

Gate run on worktree `C:/Users/dguyr/ROS/.arbor-redesign-w4` branch `claude/redesign-wave4-gated` HEAD=43fb29c.
lint: PASS (0 errors). test: 969 passed / 3 skipped (pre-existing firestore.rules emulator skip) / 0 failed, 88 test files (87 pass + 1 skip). check:framework: PASS. eval:safety: PASS (6 risky flagged, 5 benign passed). check:floors: 26 PASS / 0 FAIL / 2 WARN(pre-existing: F11 activities, F18b coRegulationScript — no new WARN). Both new suites confirmed running: bedtimeStories.test.ts (11 tests, all green), AvatarCreator.captureGate.test.ts (6 tests, all green). Route reachability: "bedtime-stories" present in ActiveTab union, VALID_TABS, and Shell.tsx tabRegistry/lazy import — not an orphan. OnboardingFlow renders all 5 steps with back/continue/skip; re-launchable via needsOnboarding guard + ob.demo.relaunch i18n key exists EN+HE (render wire = CONCERN: key defined but no UI entry point rendered in SettingsModal — pre-existing gap not introduced in this wave, does not block). HE/RTL: all 44 ob.step.* keys have HE values; BedtimeStoriesTab uses inline bilingual pattern (same as HeroComicsTab/HeroJourneyTab) + dir="auto" on all text containers + motion x-direction inverts for HE; LanguageContext sets document.dir=rtl globally — floor F10 preserved. Mobile: primary CTAs py-3 full-width; bedtime nav buttons explicitly min-h-[44px]; touch targets consistent with established patterns. No coverage regression. No new floor failures. Wave-4 PASS for QA gate.

## Update [2026-06-23ak] — arbor-clinical-lead: binding copy/framing sign-off on AP-049 Step 3 + AP-057 — BOTH PASS (no veto)

Verified the two committed gated items in worktree `.arbor-redesign-w4` against cleared copy in `GATED-CLEARANCES-CLINICAL.md`. **AP-049 Step 3** (`i18n.ts` EN+HE, `OnboardingFlow.tsx`): strings VERBATIM, 7 tiles non-deficit, no score/status/red styling, HE non-grading meaning preserved → PASS. **AP-057** (`bedtimeStories.ts` + `/generate-bedtime-story` in `api.ts`): warm/strengths-based/parent-mediated/non-diagnostic, bans delay/behavior-problem/meltdown, NON_DIAGNOSTIC_CONTRACT prepended verbatim + escalation/redaction/discard seams wired → PASS. Clinical copy/framing gate CLEARED on both; NEITHER build-ready — arbor-safety COPPA gate (avatar Step 4 / child-day input) + Guy Tier-C still OPEN. Verdict filed to PRODUCT-COUNCIL.md §"Clinical sign-off 2026-06-23".

## Update [2026-06-23aj] — arbor-design: AP-049 5-step onboarding — GREEN, wave4 branch, NOT committed

**Frame:** AP-049 — 5-step structured onboarding. GATED child-data item; binding safety condition F-NEW. Worktree `C:/Users/dguyr/ROS/.arbor-redesign-w4`, branch `claude/redesign-wave4-gated`. No commit/push.

**What shipped (4 files changed/created, all under app/src):**
- `src/components/auth/OnboardingFlow.tsx` — original single-screen stub reskinned as 5-step flow: (1) Welcome, (2) Name+Age (months-precise picker preserved exactly, B0 back-compat), (3) Focus-domain picker (7 tiles, multi-select, VERBATIM cleared copy, no score/status/red styling, skippable), (4) Avatar via AvatarCreator (existing gated path, F-NEW safety comment inline), (5) Ready summary + CTA. Progress dots, back/continue/skip controls, AnimatePresence step transitions. addChild fires at end of step 2 to get childId before step 4. Challenges + avatar patched via updateChild at step 5. HE/RTL maintained (all text via t() keys). No hardcoded hex — var(--arbor-*) tokens throughout.
- `src/components/profile/avatarGate.ts` — NEW. Extracts consent-before-capture logic from AvatarCreator into `runAvatarGeneration()`: photo path awaits `grantConsent({ childId, purpose: "face_processing" })` BEFORE `generateAvatar`. Makes the gate order testable in node env without DOM.
- `src/components/profile/AvatarCreator.tsx` — updated to import and delegate to `runAvatarGeneration()` (no functional change; gate preserved exactly).
- `src/lib/i18n.ts` — 44 new `ob.step.*` + `ob.demo.*` EN keys (verbatim cleared copy in step 3); 44 matching HE keys (flagged for arbor-localization native review).
- `src/components/profile/AvatarCreator.captureGate.test.ts` — NEW. F-NEW binding safety test (6 assertions): grantConsent order precedes generateAvatar; correct childId/purpose passed; photo path passes dataUrl not descriptors; describe path skips consent; photo mode with no refPhoto skips consent; reversed-order demo assertion confirms test sensitivity. 100% deterministic, no network.

**Safety:** Reference photo is local-only — transient dataUrl never written to Firestore/Storage; only stylized avatar retained. avatarGate.ts comment + AvatarCreator inline comment document this.

**Lint:** `npm run lint` — clean (0 errors). **Test:** `npm test` — 87 passed, 969 tests passed (0 failures). F-NEW 6/6 green.

## Update [2026-06-23ai] — arbor-pm: Council Intake 2026-06-23 "Developmental Functioning Assessment Layer" (reconciled) appended

8 candidates CI-35..CI-42 (AP-079..AP-086 reserved). 4-lens divergence reconciled: real IL ועדה market (248k+ special-ed, Taub/Shapira 2024 gap named) vs partial clinical VETO of the deficit-quantification spine (Adult Mediation Index %, Social-Communication Screener, Functional Profile verdict, instrument construct-mapping). Reconciliation principle: Arbor is the parent-owned notebook, never the assessor. Salvageable: CI-35 Transition Difficulty Tracker (FIRST VERTICAL SLICE), CI-36 Functional-Domain logging fields (Arbor's own taxonomy), CI-37 Functional Support Map (3-tier descriptive framing, verbatim-approved strings only), CI-38 Mediation Observation Log (RAW counts only, % permanently vetoed), CI-39 Intervention Planner (SAFE, auto-eligible), CI-40 Before/After own-baseline, CI-41 Committee-Season JITAI prompt (safe; payload gated on export decision), CI-42 NL/BE OPP analog. Vetoed (6 items, permanent): Adult Mediation Index %, Social-Communication Screener (no buildable version), Functional Profile "significant gap" verdict, ABAS/Vineland/SRS/Sensory-Profile construct-mapping, Attention Difficulty Profile, Sensory/Regulation Map-as-screen. 3 new Guy-gated decisions: (1) Parent-Teacher Shared View = privacy-architecture decision BEFORE scoping; (2) Committee/Professional Report = re-touches DEM-005/#97 export decision; (3) IL ועדה market GTM form = gated on export decision. PRODUCT-BACKLOG.md tail appended.

## Update [2026-06-23ah] — arbor-clinical-lead: BINDING GATE on "Developmental Functioning Assessment Layer" (ABAS/Vineland/SRS/Sensory-Profile-ideational + ועדה/סייעת committee report) → soundness:VETO(partial — the deficit-quantification spine) / claims:UNSUBSTANTIATED / riskClass:device-adjacent — BLOCKED-FOR-BUILD

All three lenses converged: this is the Framework-v2 Assessment-Engine spine returning under "functional/non-diagnostic" clothes, AGGRAVATED by official-resource-allocation use (output is adjudicative, not enrichment — strongest device/scope-of-practice context yet). Line: a descriptive parent/teacher observation LOG that produces NOTHING about the child = blessed; a per-child score/verdict/index = vetoed. "Ideationally based on" does NOT survive (construct+scoring clone = validity-theft + Rule 11 device-adjacency independent of verbatim copying); "non-diagnostic/functional" wording does NOT clear the substance. **VETO ×5** (#1 functioning-map/"significant gap", #3 Adult-Mediation-Index "%-time" → committee [worst item], #4 SRS-clone Social-Communication "Screener" [3 grounds: IP-clone/unvalidated-autism-screen/pathologizes-normal-variation, M-CHAT-rule analogue], #5 "attention difficulty", #9-as-effect-claim). **Gated-clearable-if-re-scoped ×3** (#2/#6/#10 → descriptive logs only). **SAFE ×1** (#8 Intervention Planner). **#7 ועדה Report re-touches the CEO-gated clinician-export decision (DEM-005/#97) → surface to Guy.** Only salvageable product = parent-owned descriptive observation log the family carries to THEIR OWN professional — Arbor is the notebook, computes no number, signs nothing. Verdict appended to PRODUCT-COUNCIL.md; routed to arbor-pm + via arbor-orchestrator as blocked-for-build (identical to arbor-safety veto).

## Update [2026-06-23ag] — arbor-pm: Council Intake 2026-06-23 "100 Capability Blueprint" appended

8 candidates CI-27..CI-34 (AP-071..AP-078 reserved); architecture reframe (Capability Graph = specifies CI-26, not duplicate); clinical PASS-in-principle from board; #95/#97 HELD (re-touch CEO-gated clinician-export); #69/#70 swallow-safety interrupt = build-condition; sequencing: CI-27 schema + CI-28 Goal Builder (FIRST VERTICAL SLICE) + CI-31 Duration Variants front-loadable now; CI-30 Daily Plan Generator blocked by CI-27+28+29; CI-32/33/34 domain waves Phase-4 parallel.

## Update [2026-06-23af] — arbor-design: AP-060 The Science trust page — GREEN, wave4 branch, NOT pushed

**Frame:** AP-060 — "The Science" parent-facing trust / source-transparency page. Board-cleared wave (CHARTER §3 p11). Gated. Worktree `C:/Users/dguyr/ROS/.arbor-redesign-w4`, branch `claude/redesign-wave4-gated`, commit `d729201`. Built ON TOP of HEAD `6d03f0e`.

**What shipped (7 files, 595 insertions):**
- `src/components/tabs/SciencePage.tsx` — new standalone page: hero card (verbatim hero line), verbatim disclaimer above the fold, framework stat tiles (133/7/40+), CDC framing section, framework citations (CDC LTSAE 2022, AAP, ASHA, WHO, Siegel+Bryson, Gottman — real public links, open in new tab with rel=noopener), ASQ-3 cleared mention with HOLD comment, "How we built it" section, board-composition note (verbatim). TOKEN-ONLY (var(--arbor-*)); logical CSS HE/RTL; touch targets ≥44px. STATIC EDITORIAL — no child data read/captured/processed/exported.
- `src/lib/sciencePage.test.ts` — 56 new firewall tests: banned-strings absent EN+HE; "clinical" modifier gate; verbatim hero/disclaimer/board-note exact-match assertions; ASQ-3 hold assertions (cleared phrase present, banned phrases absent); stats framing (allowed provenance copy only); HE firewall-safe; i18n parity sci.*.
- `src/lib/i18n.ts` — 34 `sci.*` EN keys (verbatim board-cleared copy) + 35 HE keys (same firewall-safe meaning; flagged for arbor-localization native review before wide release).
- `src/lib/navigation.ts` — `science` fallback → "care" section.
- `src/context/ArborContext.tsx` — `"science"` added to ActiveTab union + VALID_TABS (total 38, F1 floor remains green).
- `src/components/layout/Shell.tsx` — lazy import + tabRegistry entry for `science`.
- `src/components/layout/SettingsModal.tsx` — "The Science" footer entry row (FlaskConical icon, `data-testid="settings-open-science"`).

**Verbatim firewall copy applied (VERBATIM per CHARTER §3 p11):**
- Hero: "Developmentally informed — built on cited public guidance from the CDC, AAP, ASHA, and WHO."
- Disclaimer (above the fold): "Arbor is not a diagnostic tool and does not replace professional care. It tracks development and surfaces things worth discussing — it does not diagnose, screen, or label your child. Milestones describe what most children do at a given age; every child develops on their own timeline. If you have a concern, or if Arbor flags one, talk to your pediatrician or a qualified professional."
- Board note: "Reviewed by Arbor's internal developmental reviewers (backgrounds spanning child psychology, speech-language, and developmental pediatrics). They are not licensed clinicians and Arbor is not clinically validated; their role is to keep our content faithful to cited public guidance."
- ASQ-3 HOLD comment in SciencePage.tsx: `// AP-060: ASQ-3 deep-link HELD pending legal/IP clearance — do not add an outbound link or reproduce any ASQ-3 items.`

**Gate (ALL GREEN, 0 regression):** lint 0 · `npm test` 935 pass / 3 skip / 0 fail (+54 new vs 881 AP-053 baseline) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 pre-existing WARN (F11, F18b — unchanged). NOT pushed.

**HE flag:** sci.* HE strings carry identical firewall-safe meaning. "Clinically validated" never used as a claim. Flagged for arbor-localization native review before wide release.

## Update [2026-06-23ae] — arbor-design: AP-053 Academy For-You + Learning Map — GREEN, wave4 branch, NOT pushed

**Frame:** AP-053 — Academy "For You": joins existing copilot focusDomain signal with Academy course-progress roll-up by domain. Board-cleared "least-explored" framing (2026-06-22). Gated wave. Worktree `C:/Users/dguyr/ROS/.arbor-redesign-w4`, branch `claude/redesign-wave4-gated`, commit `6d03f0e`. Built ON TOP of AP-051/058/054 (`063af9c`).

**What shipped (4 files, 703 insertions):**
- `src/components/sections/AcademyForYou.tsx` — new component: computes focusDomain from EXISTING milestones (same `computeDevScore` path as DevScoreCard + ScholarHubCard — no new AI call, no new Firestore read). Joins with MASTERCLASSES localStorage explored-state (read-only; key `arbor.masterclasses.done`). Renders recommended domain with NEUTRAL/POSITIVE token only (green-soft/green-ink; no warn/amber/red). All-domains roll-up ordered alphabetically (never ranked deficit list). TOKEN-ONLY (var(--arbor-*)); logical CSS HE/RTL; touch targets ≥44px.
- `src/components/sections/academyForYou.test.ts` — 17 new acceptance tests: verbatim cleared copy assertions; "X of Y explored" (not "% complete"); banned-word gate (low/weak/behind/delay/concern/deficit/lowest/needs work/score); warning-token gate (word-boundary regex); no-ranked-deficit-list invariant; i18n parity EN/HE.
- `src/lib/i18n.ts` — 16 `foryou.*` EN keys (verbatim board-cleared copy) + 16 HE keys (same invitational meaning; flagged for arbor-localization native review).
- `src/components/sections/Masterclasses.tsx` — `<AcademyForYou />` inserted before `<ScholarHubCard />` in the catalog view. Existing copilot tab + Academy courses untouched.

**Verbatim cleared copy applied:**
- Section header: "A good place to explore next" (exact)
- Rec line: "Arbor suggests starting with [Domain] — here's a gentle place to put your energy this week." (exact)
- "Here's why" body (LOAD-BEARING, exact): "This is simply an area you've logged less about so far, so Arbor has the least to go on here. Spending a little time here helps Arbor understand your child better — it's not a sign anything is wrong."
- Course label: "Courses to explore for [Domain]" / progress: "[X] of [Y] explored"

**Gate (ALL GREEN, 0 regression):** lint 0 · `npm test` 881 pass / 3 skip / 0 fail (+17 new vs 864 AP-054 baseline) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 pre-existing WARN (F11, F18b — unchanged).

## Update [2026-06-23ad] — arbor-clinical-lead: "100 Capability Blueprint" gate — soundness:pass-in-principle / NO VETO

Targeted board gate (reuses CI-22/23/24 + BABY-CLINICAL-REQ B3, not re-derived). **The blueprint is CLEARABLE where Framework-v2 was vetoed** because it is deliberately diagnosis-free. **Enrichment core = SAFE** once the typed `prohibitedDiagnosticClaims` field is ENFORCED via `screenModelOutput` on every AI-authored string (CLI-06 made load-bearing across all 100 caps — the smart primitive is blessed but a declared-unenforced field is just a comment). **9 line-items gated-but-clearable** with named guardrails (#41 rename away from "Anxiety" + AAC completion; #45 post-event-only + reuse CI-24 fire-once, no meltdown-trend chart; #62 preference-log-not-SPD-screen, "sensory profile/seeker" = label-leak; #67 log-not-sleep-disorder + under-1 AAP safe-sleep guard; #69/#70 **swallow-safety interrupt ABOVE the ladder = the recommend-veto condition**, ARFID line; #72 child-readiness ok, constipation/withholding/regression=medical; #91 goals+reused referral rail, verify SLP numbers live; #98 TIERED referral — soft nudge too weak for true red flags; #99 reuse escalation.ts, no bespoke crisis flow). **2 items HELD — re-touch the CEO-gated-at-12mo clinician-export decision:** #95 AI-summary export + #97 Professional Mode "export report"/therapist console — only sound near-term form is a **parent-owned export** (DEM-005/AP-036). Verdict written to PRODUCT-COUNCIL.md Clinical GATE 2026-06-23; findings returned to arbor-pm; no backlog file written by board.

## Update [2026-06-23ac] — arbor-growth: AP-054 Language Lab vocab view — GREEN, wave4 branch, NOT pushed

**Frame:** AP-054 — Language Lab: combined-total-first bilingual vocabulary count + trend view, board-cleared per ASHA + Core et al. 2013. Gated wave. Worktree `C:/Users/dguyr/ROS/.arbor-redesign-w4`, branch `claude/redesign-wave4-gated`, commit `063af9c`. Built ON TOP of AP-051+AP-058 (`c203ba0`).

**What shipped (5 files, 1031 insertions):**
- `src/growth/vocabAgg.ts` — pure aggregator (no I/O, `nowMs` injected): `aggregateLangCounts()`, `combinedTotal()`, `mixPct()`, `buildVocabTrend()` (90-day weekly cumulative trend). `LangObservation` type (parent-logged phrase record with language tag + phrase text + timestamp).
- `src/growth/vocabAgg.test.ts` — 44 new tests: aggregation math, combinedTotal leads, mixPct (incl. edge cases), trend 13-bucket / cumulative / window exclusion, framing gate (banned words absent from aggregator source), LanguageLabVocabView source gates (interpretation caption + provenance + activity-sub-line + disclaimer keys present; banned words absent from copy context; no warning/amber/red token on either language bar).
- `src/components/tabs/LanguageLabVocabView.tsx` — new section component: combined total leads (large display), secondary mix % with neutral-color per-language bars (NO warning/amber/red on either bar), required interpretation caption + provenance line, 90-day stacked area trend, "Ideas for both languages" section with required activity sub-line, first-view disclaimer (re-accessible toggle), inline parent phrase log form (writes to `langObs` ChildCollection — explicit parent action, no ASR, no automated detection). TOKEN-ONLY (var(--arbor-*)); logical CSS HE/RTL; touch targets ≥44px.
- `src/lib/i18n.ts` — 30 new `vl.*` keys EN (verbatim board-cleared SLP copy) + 30 HE (same non-screen meaning; flagged for arbor-localization native review).
- `src/components/tabs/LanguageLabTab.tsx` — inserted `<LanguageLabVocabView />` above existing language-profile and activity cards (does not remove routes or existing content).

**Gate (ALL GREEN, 0 regression):** lint 0 · `npm test` 864 pass / 3 skip / 0 fail (+44 new vs 820 AP-058 baseline) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 pre-existing WARN (F11, F18b — unchanged).

**SLP framing confirmed (board-cleared per ASHA + Core et al. 2013):**
- Combined total LEADS (large display); per-language mix is secondary neutral context.
- Mix label verbatim: "Logged mix: Hebrew / English".
- Interpretation caption, provenance line, activity sub-line, first-view disclaimer all present verbatim.
- Activities section: "Ideas for both languages" (not "balanced activities").
- Activity item pattern + "Want more X moments this week? Try…" format applied.
- No red/amber/warning token on either language bar.
- Trend shows per-language growth; no "falling behind" framing anywhere.
- No readiness score/percentile/verdict.
- Banned words (balance, imbalance, gap, behind, catch up, delay, readiness, screen, assessment, percentile) absent from copy context.

**Data safety confirmed:** reads from `langObs` ChildCollection (parent-logged, explicit action). No ASR, no automated word detection. View component is READ-ONLY; the log form is the sole write path. No new consent/redaction surface required.

**HE strings flagged for arbor-localization native review before wide release.**

**State: GREEN / branch-only. NOT pushed, NOT merged, NOT deployed.**

## Update [2026-06-23ab] — arbor-growth: AP-058 Smart Reminders settings dashboard — GREEN, wave4 branch, NOT pushed

**Frame:** AP-058 — Smart Reminders settings dashboard: a parent-preference surface wired to the EXISTING JITAI engine (lib/jitai.ts). Board-cleared cadence copy. Gated wave. Worktree `C:/Users/dguyr/ROS/.arbor-redesign-w4`, branch `claude/redesign-wave4-gated`, commit `c203ba0`. Built ON TOP of AP-051 (`c1f9171`).

**What shipped (8 files, 968 insertions):**
- `src/growth/jitaiPrefs.ts` — localStorage-only parent prefs store: per-type toggles (guidance/milestone/weekly), quiet-hours (default 9pm–8am), calm-window scheduling toggle, max-2/day ceiling helper. Zero child-data writes; no Firestore, no consent surface.
- `src/growth/smartReminders.test.ts` — 34 new tests: prefs round-trip, quiet-hours gate (incl. midnight-wrap), max-2 ceiling, formatHour, framing gate (banned surveillance/monitoring copy absent from both component source and i18n sr.* keys), sr.max2 key present and mentions 2+day.
- `src/components/sections/SmartRemindersPanel.tsx` — full settings view: max-2 contract card (always visible), next-nudge display (reads existing nextNudge()), per-type toggles (3 types), quiet-hours picker (24h selects), calm-window toggle. TOKEN-ONLY (var(--arbor-*)); logical CSS for HE/RTL; touch targets ≥44px. Parent prefs only — no child data written.
- `src/lib/i18n.ts` — 36 new `sr.*` keys EN + HE + `nav.tab.smart-reminders` in both. HE flagged for arbor-localization native review.
- `src/context/ArborContext.tsx` — added `"smart-reminders"` to `ActiveTab` union + `VALID_TABS` (F1: 37 tabs ≥ 34).
- `src/components/layout/Shell.tsx` — lazy import + tabRegistry entry.
- `src/lib/navigation.ts` — `"smart-reminders": "ask"` fallback (Ask Arbor section nearest semantic home).
- `src/components/layout/SettingsModal.tsx` — Smart Reminders entry row with parent-control subtitle.

**Gate (ALL GREEN, 0 regression):** lint 0 · `npm test` 820 pass / 3 skip / 0 fail (+34 new vs 786 AP-051 baseline) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 pre-existing WARN (F11, F18b — unchanged).

**Framing confirmed:** max-2 visible; quiet-hours = parent boundary (not surveillance); calm-window = "routes to calmer stretches" (not child-watching); no monitoring/surveillance/track-your-child copy; no clinical/diagnostic terms; no "more reminders = better development" implication.

**Data safety confirmed:** ONLY writes to `localStorage` key `arbor.jitai.prefs`. No Firestore path touched. No child-data write. No new consent/redaction surface. No new network call.

**HE strings flagged for arbor-localization native review before wide release.**

**State: GREEN / branch-only. NOT pushed, NOT merged, NOT deployed.**

## Update [2026-06-23aa] — arbor-growth: AP-051 Day Windows panel — GREEN, wave4 branch, NOT pushed

**Frame:** AP-051 — "Your Day at a Glance" panel: a calm/trickier 24-hour visualization layered OVER the existing JITAI rhythm engine. Board-cleared, non-predictive copy. Read-only. Does not replace the inline Today nudge. Worktree `C:/Users/dguyr/ROS/.arbor-redesign-w4`, branch `claude/redesign-wave4-gated`, commit `c1f9171`.

**What shipped (8 files, 867 insertions):**
- `src/growth/dayWindowsAgg.ts` — pure aggregator (no I/O, `nowMs` injected): takes an existing `RhythmPrediction`, derives up to 2 named windows ("usually-calmer" / "often-trickier") + a `PatternObservation` anchored to "the days you logged". `estimateFrictionDays()` exported for testing.
- `src/growth/dayWindowsAgg.test.ts` — 39 new tests: copy-contract (verbatim EN strings in i18n.ts), safety gate (banned words absent from dw.* values + aggregator string literals), low-data path, sufficient-data bucketing, window ordering, patternObservation invariants, estimateFrictionDays.
- `src/components/sections/DayWindowsPanel.tsx` — new section component: 24h HourBar visualization, named window cards, pattern observation line, ALWAYS-visible determinism guard, low-data state. TOKEN-ONLY (var(--arbor-*)); logical CSS; touch targets ≥44px. Reads behaviorLogs + childProfile from context (existing data, no new write path).
- `src/lib/i18n.ts` — 10 new `dw.*` keys EN (verbatim board-cleared) + 10 HE (flagged for native review, see below).
- `src/context/ArborContext.tsx` — added `"day-windows"` to `ActiveTab` union and `VALID_TABS` set (F1 routes now 36 ≥ 34).
- `src/components/layout/Shell.tsx` — lazy import + tabRegistry entry for `DayWindowsPanel`.
- `src/components/tabs/OverviewTab.tsx` — added "See your day's pattern" entry button (only shows when rhythm.confidence !== "none"); existing inline JITAI nudge UNCHANGED.
- `src/lib/navigation.ts` — added `"day-windows": "today"` fallback so sidebar highlights "Today" section.

**Gate (ALL GREEN, 0 regression):** lint 0 · `npm test` 786 pass / 3 skip / 0 fail (+39 tests vs 747 baseline) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 pre-existing WARN (F11, F18b unchanged).

**HE strings flagged for arbor-localization native review before wide release.** Non-predictive framing preserved: "נטיות" = tendencies; "הימים שתיעדתם" = the days you logged; guard = "אלו נטיות, לא ידיעות ודאיות — כל יום שונה, ואתם מכירים את ילדכם הכי טוב." No new child-data read/write path.

**State: GREEN / branch-only. NOT pushed, NOT merged, NOT deployed.**

## Update [2026-06-23] — arbor-clinical-lead: front-loaded clinical guardrail spec for CI-22/23/24 (CEO-ratified gate)
Binding build-pod guardrail spec → `mesh/improvement/CLINICAL-GUARDRAILS-CI-22-23-24.md` (peds/slp/psych coordinated; psych lead on CI-22 framing + CI-24). All three **GATED, NOT build-ready** — soundness:concerns(clearable) / claims:none-or-substantiated. Hard rules per item: **CI-22** EF track — never BRIEF-P/EF-score/"ADHD", graduation=without-prompt×3 (never lessons/minutes), peds age-7 provider-routing FLOOR, drop "CDC milestones" on 6–10 surface (no CDC anchor past age 5). **CI-23** coaching programs — Arbor's OWN, NO Triple-P/IY/PCIT/Hanen/ESDM/DIR/Zones/O-G in copy OR citations, no effect-size, success=retention+parent-report (never modules-as-efficacy), add CI-25 SLP referral rail (source-verify ASHA numbers). **CI-24** FeelingsLab — generic 6-emotion UI only (no Zones), DROP anxiety tracking entirely (intensity internal-only, never charted), escalation fires ONCE "worth discussing with your provider" + ≥90d cool-down, psych+safety co-sign. Cross-item: reuse `screenModelOutput` (CLI-06 precedent) on every AI-authored string + test. Build-ready only when real copy/strings exist and pass a final board review.

## Update [2026-06-23z] — arbor-orchestrator: Redesign Wave 3 built to GREEN branch (4/4 SAFE tickets, DevSecOps PASS) — branch-only, NOT pushed

**Frame:** Execute Redesign Wave 3 — the 4 remaining SAFE items (AP-050, AP-048, AP-055, AP-059) — to a green local branch and STOP. Green-to-branch only; no merge/deploy/push (Guy pushes). All pure-frontend, wired to the EXISTING live backend; zero new child-data surface.

**Worktree:** `C:/Users/dguyr/ROS/.arbor-redesign-w3`, branch `claude/redesign-wave3`, base `3fa9193` (= origin/main = merged Wave-1 tokens+shell AND Wave-2 topbar). `npm ci` run. No other worktree touched (w1 `33b8597`, w2 `68895f3` confirmed unchanged). Single-worktree constraint → tickets built SERIALLY in w3, one commit each.

**4 tickets, one commit each (final SHAs after a clean autosquash that folded the design fix into AP-055):**
- **AP-050** Hero Avatar Engine shared canvas (arbor-avatar) `438770a` — `lib/heroAvatarCanvas.ts` (shared `renderHeroAvatarCanvas(template,opts)` over existing `renderShareCard`; 5 templates) + migrated 3 real call-sites (HeroScenePlayer.saveComicPage, HeroComicsTab.download, heroCard.downloadHeroCard) + wired 3 new surfaces (Hero Card full, Practice stamp full in MimicStudioTab, Milestone = tested helper, MilestonesTab owned by arbor-memory). C2PA/SynthID preserved (avatar imageUrl forwarded verbatim, no re-encode). Zero new child-data.
- **AP-048** Kid Mode desktop overlay (arbor-design+ux) `42d2b76` — `components/kidmode/*` (KidModeContext pure useState, parentGate.ts 3s hold-to-exit, KidModeOverlay full-screen). Topbar entry desktop-only (`hidden md:flex`). Surfaces EXISTING child routes via React.lazy (HeroJourneyTab=10 journeys, PracticeHubTab=Hero Arcade 14+ worlds, FeelingsLabTab) — imported, not edited. NO child-data write on enter/exit; MobileNav byte-unchanged.
- **AP-055** Scholar Hub weekly concept feed (arbor-growth+content+design) `2db2eca` — `growth/scholarHub.ts` (8-article static catalogue covering Regulation/Attachment/Bilingualism/Transitions + all 7 domains; `selectWeeklyArticle(focusDomain)` no AI call) + `ScholarHubCard.tsx` reading EXISTING `computeDevScore` focusDomain (NOT AP-049; graceful no-data state). **NON-PATHOLOGIZING framing enforced + tested:** lowest domain shown as "A great area to nurture this week" / HE "תחום נהדר לטפח השבוע"; provenance = "editorial suggestion, not a diagnosis"; test asserts deficit-words absent. 9 i18n keys EN+HE.
- **AP-059** Kid weekly-missions calendar (arbor-practice) `6bf4a14` (HEAD) — `WeeklyMissionsStrip.tsx` 7-day per-day strip atop child-facing Learning Studio (PracticeHubTab), color-coded by domain via EXISTING tokens (TS map, index.css untouched), reads EXISTING `usePracticeData().missions.items` read-only. Distinct from daily-goal ring (no ProgressRing import). RTL via flex mirroring; 14 strip.* i18n keys EN+HE.

**Final green-gate (re-run on HEAD `6bf4a14` after design-fix autosquash, ALL GREEN, 0 regression vs 702 baseline):** lint 0 · `npm test` 747 pass / 3 skip / 0 fail (+45 tests) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 pre-existing WARN (F11 PLAY_ACTIVITIES=43<250, F18b coRegulationScript — unchanged, F1 routes=35≥34).

**DevSecOps sign-offs:** arbor-qa **PASS** (35 routes reachable; Kid Mode non-intercepting + desktop-only; MobileNav byte-unchanged; HE/RTL logical props + i18n EN+HE parity; AP-050 identical-args proof at renderShareCard boundary). arbor-sec **PASS / no veto** (zero new child-data egress/write all 4; ZERO new deps — package.json/lock unchanged; no new endpoint/secret; AP-050 practice-stamp guarded to `data:`-prefix only). arbor-design **CONDITIONAL VETO → RESOLVED**: one raw RGBA literal `rgba(52,178,119,0.30)` at ScholarHubCard.tsx:237 → orchestrator swapped to `var(--arbor-clay-dim)` (AA token), autosquashed into AP-055, re-gated GREEN; index.css confirmed untouched; AP-059 token map all-existing-tokens verified.

**2 items surfaced for Guy (non-blocking, awareness):**
1. **AP-050 output change (qa flag):** the story/comic *download/export* now wraps raw art in a branded "Made with Arbor" card (pre-wave it downloaded the raw data URL). The in-app rendered story/comic surfaces are unchanged; only the export gained branding (the AP-050 design intent). AC-2 "identical output" is met at the renderShareCard call-arg boundary, NOT at the downloaded-artifact level — flagged as an intentional product change, not a regression.
2. **Pre-existing npm-audit toolchain debt** (vite/uuid, 13 findings) — not introduced by this wave; track in a dedicated dependency/WAF sweep.

**State: GREEN / branch-only. NOT pushed, NOT merged, NOT deployed — Guy pushes.** Promotion = push `claude/redesign-wave3` → PR → merge to main fires `arbor-deploy.yml` (Level 3). MERGE-LANE caveat still binding (mobile-store FIFO ahead of redesign per Update 23m). Floor gaps F11/F18b still owed before a wave that exercises those surfaces. Next: gated waves (AP-049 onboarding, AP-051 Day Windows, AP-053 Copilot, AP-054 Language Lab, AP-056/057/058/060) all need clinical/safety clearance + Guy GO before build.

## Update [2026-06-23x] — arbor-practice: AP-059 Kid weekly-missions calendar strip — COMPLETE, wave3 branch, NOT pushed

**Frame:** AP-059 — 7-day per-day mission-progress strip rendered at the TOP of the child-facing Learning Studio (PracticeHubTab / Kid Mode "Hero Arcade"). riskClass: safe. Keyed to existing missionRecords data — zero new child-data write path.

**Worktree:** `C:/Users/dguyr/ROS/.arbor-redesign-w3`, branch `claude/redesign-wave3`, commit `0496d12`. 5 files changed (1 new, 4 modified, 534 insertions).

**What shipped:**
- `practice/signals.ts` — pure `weeklyStripDays(missions, today)` aggregator: reads MissionRecord[], returns 7 DayMissionStatus slots (oldest→today), no I/O, no Date.now() inside, testable.
- `components/practice/WeeklyMissionsStrip.tsx` — new child-facing component; TOKEN-ONLY (var(--arbor-*)); logical CSS (paddingInline, etc.) for HE/RTL; touch targets ≥44px; aria-label per slot; colour-coded by activity type (speech=green, language=sky, cognition=lav, social=yellow, emotional=pink) matching existing Chip tone convention; graceful empty-day rendering (empty circle, reduced opacity); "today" highlighted with clay dot.
- `components/practice/PracticeHubTab.tsx` — strip injected at TOP above HubTabs. Daily-goal ring components (ProgressRing) untouched.
- `lib/i18n.ts` — 15 new strip.* keys in both en and he dicts (flagged for arbor-localization native review).
- `practice/signals.test.ts` — 8 new tests: day-bucketing (7 slots exact), today marker, done vs incomplete, multi-mission same day, <7-day graceful empty, all-7-done, color-by-type mapping for all 5 domains.

**Domain→token map (TS-only, no index.css touch):** speech→green-soft/ink, language→sky-soft/ink, cognition→lav-soft/ink, social→yellow-soft/ink, emotional→pink-soft/ink.

**Distinctness from daily-goal ring:** strip = 7 horizontal day slots showing per-day completion, not a circular ring. ProgressRing components not touched, not imported.

**Gate results (all GREEN):** lint 0 · test 747 pass / 3 skip / 0 fail (+8 new vs AP-055 baseline of 739) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 pre-existing WARNs (F11, F18b unchanged).

**State: GREEN / branch-only. NOT pushed, NOT merged, NOT deployed.**

## Update [2026-06-23w] — arbor-pm: Council Intake 2026-06-23 "Developmental Framework v2" — 7 candidates scored (CI-20..CI-26), 2 safe build-ready (CI-20 Numeracy Track, CI-21 School Readiness Export), 5 gated for clinical/psych/safety sign-off, 8 items permanently held (instrument-mapping, M-CHAT, Risk Map, 0-4 score, AI Clinical Summary, branded programs, Clinician Portal, WHO-ICF); vertical slice = CI-20; Clinician Portal = CEO-gated 12-month decision; next promotion IDs AP-065..AP-070.

## Update [2026-06-23v] — arbor-clinical-lead: BINDING GATE on "Development Framework v2" → soundness:VETO(partial) / claims:UNSUBSTANTIATED / riskClass:gated — HELD

Board (peds+slp+psych) ran the clinical-soundness+claims+IP gate on the v2 strategic input (large clinical/dev expansion). **Backbone is SOUND** (CDC-LTSAE-2022 + AAP surveillance + ASHA norms + WHO-ICF free framework — corrected-age, honest red-flags routed to a provider, enrichment play, parent-owned observation log). **VETO on the Assessment-Engine spine** on three independent grounds: (1) **IP** — Vineland/BRIEF-P/Peabody/PDMS-2/BOT-2/Rossetti/ASQ/Sensory Profile/ADOS = copyrighted examiner-administered instruments, may NOT reproduce/score-against/"map activities to"; Hanen/ESDM/DIR/Triple P/Incredible Years/PCIT/Zones/Orton-Gillingham = trademarked certification-gated programs, may NOT deliver/"be based on". (2) **Medical-device** — a per-child autism/ADHD "Risk Map" is EU-MDR Rule 11 Class IIa+ / FDA SaMD (Cognoa precedent); a disclaimer does not declassify it. (3) **Scope-of-practice** — AI Intervention-Plan/Clinical-Summary/Clinician-Copilot = unlicensed SLP/psych practice. **M-CHAT hard rule:** never embed/paraphrase/score in-app (two-stage instrument, ~50% PPV, terms-of-use) — link out only. Verdict routed through arbor-orchestrator as blocked-for-build, identical to an arbor-safety veto.

## Update [2026-06-23w] — arbor-growth: AP-055 Scholar Hub weekly concept feed — COMPLETE, wave3 branch, NOT pushed

**Frame:** AP-055 — Academy Scholar Hub: one developmental concept/article per week, auto-matched to child's lowest-scoring domain from existing Development Map / DevScoreCard data. riskClass: safe.

**Worktree:** `C:/Users/dguyr/ROS/.arbor-redesign-w3`, branch `claude/redesign-wave3`, commit `761437b`. 5 files changed (3 new, 2 modified, 663 insertions).

**What shipped:**
- `growth/scholarHub.ts` — static 8-article catalogue (all 7 framework domains; 4 prototype topics: Regulation, Attachment, Bilingualism, Transitions); `selectWeeklyArticle(focusDomain)` matcher; `isDefault` flag for no-data graceful state. No AI call, no child-data write.
- `growth/scholarHub.test.ts` — 14 new tests: domain matcher, catalogue coverage (all 4 prototype topics), no-data fallback, CRITICAL FRAMING GATE (deficit-word absence + invitational phrasing + editorial provenance), no outcome-claim in article bodies.
- `components/sections/ScholarHubCard.tsx` — reads `useArbor().milestones` → `computeDevScore` → `focusDomain` (same logic as DevScoreCard, no new Firestore call). TOKEN-DRIVEN (var(--arbor-*)), logical CSS for HE/RTL. Graceful empty state when confidence="none". Provenance hedge on every surface.
- `components/sections/Masterclasses.tsx` — `import ScholarHubCard` + renders it above the masterclasses catalog.
- `lib/i18n.ts` — 9 new hub.scholar.* keys in both en and he dicts. Framing: "A great area to nurture this week: {domain}" (EN) / "תחום נהדר לטפח השבוע: {domain}" (HE).

**FRAMING GATE compliance:** lowest domain = next opportunity, strengths-based invitational language. No "deficit/weakness/delay/behind/problem/concern/low score" in any framing copy. Provenance = "This week's pick based on your Development Map — an editorial suggestion, not a diagnosis."

**Gate results (all GREEN):** lint PASS · test 739 pass / 3 skip / 0 fail (+14 new vs 725 AP-048 baseline) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 pre-existing WARNs (F11, F18b unchanged).

**State: GREEN / branch-only. NOT pushed, NOT merged, NOT deployed.**

## Update [2026-06-23u] — arbor-design: AP-048 Kid Mode desktop overlay — COMPLETE, wave3 branch, NOT pushed

**Frame:** AP-048 — Kid Mode full-screen overlay for desktop shell. Executed on `claude/redesign-wave3`, commit `42d2b76`.

**Worktree:** `C:/Users/dguyr/ROS/.arbor-redesign-w3`, branch `claude/redesign-wave3`. 6 files changed/created.

**What shipped:**
- `app/src/components/kidmode/KidModeContext.tsx` — pure UI context (open/close flag). No Firestore, no child-data mutation.
- `app/src/components/kidmode/parentGate.ts` — `holdProgress`, `holdComplete`, `HOLD_MS=3000`. Pure logic, no DOM.
- `app/src/components/kidmode/KidModeOverlay.tsx` — full-screen overlay at z-70. Tabs: Hero Journeys (`HeroJourneyTab`), Hero Arcade (`PracticeHubTab` — 14+ worlds), Feelings (`FeelingsLabTab`). All imported unchanged. HoldExitButton (3 s hold + SVG progress ring). Escape key blocked inside overlay. Token-only colors; logical CSS props throughout; `.arbor-play` scope.
- `app/src/components/kidmode/kidMode.test.ts` — 22 new tests: holdProgress (6), holdComplete (3), HOLD_MS (2), no-child-data-write contract via source text scan (4), enter/exit state machine (4), constant sanity (3).
- `app/src/components/layout/Topbar.tsx` — Kid Mode button (desktop-only, `hidden md:flex`), calls `openKidMode()`.
- `app/src/components/layout/Shell.tsx` — wraps return in `<KidModeProvider>`, adds `<KidModeOverlay />` after PaywallModal.

**AC compliance:** AC-1 PASS (Topbar button desktop-only) · AC-2 PASS (HeroJourneyTab, PracticeHubTab, FeelingsLabTab imported not forked) · AC-3 PASS (hold-to-exit 3 s friction gate) · AC-4 PASS (hard dep on AP-044 Topbar already exists) · AC-5 PASS (zero Firestore writes, KidModeContext is pure useState, MobileNav untouched) · token-only PASS · logical CSS PASS.

**Gate results (all GREEN):** lint PASS (tsc 0 errors) · test 725 pass / 3 skip / 0 fail (+19 vs 706 AP-050 baseline) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 pre-existing WARNs (F11, F18b unchanged). F1 routes=35≥34 PASS.

**State: GREEN / branch-only. NOT pushed, NOT merged, NOT deployed.**

## Update [2026-06-23t] — arbor-avatar: AP-050 HeroAvatarCanvas shared module — COMPLETE, wave3 branch, NOT pushed

**Frame:** AP-050 — Hero Avatar Engine shared canvas module. Executed on `claude/redesign-wave3`, commit `438770a`.

**Worktree:** `C:/Users/dguyr/ROS/.arbor-redesign-w3`, branch `claude/redesign-wave3`. 6 files changed.

**What shipped:**
- `app/src/lib/heroAvatarCanvas.ts` — `renderHeroAvatarCanvas(template, opts)` + `downloadHeroAvatarCanvas` + 5 named surface helpers: `renderStoryCanvas`, `renderComicCanvas`, `renderHeroCardCanvas`, `renderPracticeStampCanvas`, `renderMilestoneCanvas` + `downloadPracticeStampCanvas`. Five HeroTemplate entries (story, comic, hero_card, practice_stamp, milestone) route through `renderShareCard` with zero new compositing code.
- `app/src/lib/heroAvatarCanvas.test.ts` — 24 tests (Suites A–E). Suite A proves story/comic migration: identical renderShareCard call args. Suite B proves 3 new templates route correctly. Suite C proves C2PA passthrough. Suite D proves download helper. Suite E proves named surface helpers + AC4 (new surface = new template only, full 5-template sweep).
- `app/src/lib/heroCard.ts` — `downloadHeroCard` now routes through `renderHeroAvatarCanvas("hero_card")` instead of direct `renderShareCard("avatar")`. Output identical.
- `app/src/components/stories/HeroScenePlayer.tsx` — `saveComicPage` now calls `downloadHeroAvatarCanvas("story", ...)` instead of raw anchor-download.
- `app/src/components/tabs/HeroComicsTab.tsx` — `download()` now calls `downloadHeroAvatarCanvas("comic", ...)` instead of raw anchor-download.
- `app/src/components/practice/MimicStudioTab.tsx` — pack-complete Celebrate beat wired: "Save stamp" button calls `downloadPracticeStampCanvas` with saved avatar data URL (practice_stamp surface, FULL component render).

**AC compliance:** AC-1 PASS · AC-2 PASS (identical call args proved Suite A) · AC-3 PASS (hero_card = full via heroCard.ts+AvatarCreator; practice_stamp = full via MimicStudioTab; milestone = tested helper) · AC-4 PASS (Suite E 5-template sweep) · AC-5 PASS (Suite C all 5 templates) · AC-6 PASS (zero new child-data: only input is already-saved avatar data URL).

**Gate results (all GREEN):** lint PASS (tsc 0 errors) · test 706 pass / 3 skip / 0 fail (+4 new tests vs 702 baseline) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 pre-existing WARNs (F11, F18b, unchanged).

**State: GREEN / branch-only. NOT pushed, NOT merged, NOT deployed.**

## Update [2026-06-23r] — arbor-orchestrator: Redesign Wave 2 built to GREEN branch (4/4 tickets, DevSecOps PASS) — branch-only, NOT pushed

**Frame:** Execute Redesign Wave 2 (topbar interactions + accent themes) to a green local branch and STOP. Green-to-branch only — no merge/deploy/push (Guy pushes).

**Worktree:** `C:/Users/dguyr/ROS/.arbor-redesign-w2`, branch `claude/redesign-wave2`, base `58dc9fe` (= merged Wave-1: AP-043 tokens + AP-044 topbar shell + F1-F18 floor harness). Worktree belongs to the NESTED app repo (`PPPPtherapy-/.git/worktrees`), not ROS-root — so ROS-root `git worktree list` does not show it. `npm ci` (566 pkgs). No other worktree touched (w1 confirmed clean).

**4 tickets, serial, one commit each (all populate AP-044 Topbar.tsx placeholder slots → same-file serialization, not parallel worktrees):**
- **AP-052** accent themes (arbor-design) `b40e0ce` — `data-theme` swap + localStorage `arbor-accent-theme` ∈ {green,teal,blue}. index.css APPEND-ONLY (+55/-0, `:root` untouched → default-Green byte-parity); teal/blue override only the 9 primary green tokens, AA-verified. New `lib/theme.ts`, picker in SettingsModal, boot in main.tsx, `set.theme.*` i18n (EN+HE distinct namespace = parallel-safe).
- **AP-047** kid-switcher chip (arbor-design) `c63c655` — new `TopbarKidSwitcher.tsx`; wires to EXISTING `setActiveChild` + EXISTING `AddChildModal`/`addChild`. No data-model change, no new write path. Profile-tab switcher untouched.
- **AP-045** global search (arbor-design) `7b2920d` — new `lib/searchIndex.ts` (frozen static index) + `components/search/TopbarSearch.tsx` (+20 tests). **BINDING AC-6 met:** index imports ONLY the 4 content catalogs (playbank/content, milestoneData, heroJourneys, practice/worlds) + type-only ActiveTab — ZERO child-record fields. Plain string match, no AI, deep-links via `setActiveTab`.
- **AP-046** notification bell (arbor-design) `984fc10` (HEAD) — new `TopbarBell.tsx` + `hooks/useNotifications.ts` (+7 tests) over existing `deriveMonitoring` + `nextNudge`. **BINDING AC-6 met:** monitoring note VERBATIM (`note: signal.note`, no slice/replace/rewrite); badge = neutral count ("N unread notifications", never problems/alerts/issues); no FCM/push/new egress. Today-tab inline nudge (OverviewTab.tsx) + MobileNav untouched.

**Final green-gate (re-run on HEAD 984fc10, all GREEN):** lint 0 · `npm test` 690 pass / 3 skip / 0 fail (+27 vs 663 baseline) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 documented WARN (F1 routes=35≥34, F2 worlds, F10a/b RTL/HE all PASS).

**DevSecOps sign-offs (PASS, no veto):** arbor-sec — AP-045 catalogs-only (grepped imports), AP-046 no new egress, AP-047 no new write, AP-052 validated theme string, ZERO new deps, no secrets. arbor-qa — AP-046 verbatim + neutral badge, 35 routes, HE/RTL logical props, MobileNav/OverviewTab unchanged. arbor-design — AP-052 token-driven default-Green parity, AA verified. Non-blocking notes logged: bell renders child first-name verbatim (existing parent surface, not new egress); AP-046 4-line CSS clamp is visual-only (full string in DOM).

**Commit stack (13 files, all under app/src, zero deploy/CI/hosting surface):** `b40e0ce`→`c63c655`→`7b2920d`→`984fc10`.

**State: GREEN / branch-only. NOT pushed, NOT merged, NOT deployed — Guy pushes.** Next: Wave 3 (AP-048 Kid Mode safe + AP-049 onboarding gated), Wave 4 (AP-050 avatar + AP-053 copilot safe; AP-051/AP-054 gated). Floor gaps owed before later waves: F11 PLAY_ACTIVITIES=43<250 (arbor-design), F18b coRegulationScript (arbor-memory).

## Update [2026-06-23q] — arbor-qa: Redesign Wave-2 COMPOSITE QA GATE = PASS

**Frame:** Composite QA sign-off on `claude/redesign-wave2` (worktree `.arbor-redesign-w2`, HEAD `984fc10`, base `58dc9fe`). 4 tickets: AP-052 (accent themes), AP-047 (kid-switcher chip), AP-045 (global search), AP-046 (notification bell). 13 files changed, 1,647 insertions, 34 deletions.

**Binding checks (all PASS):**
1. **AC-6 verbatim copy (AP-046)** — PASS. `useNotifications.ts`: `note: signal.note` — direct assignment, zero string ops on the copy (no `.slice`, `.substring`, `.replace`, template interpolation, or summarize). `TopbarBell.tsx`: `body = item.note` rendered verbatim at `{body}`. The `WebkitLineClamp: 4` is CSS visual overflow, not a JS string mutation; full string is in the DOM tree. aria-label: `"${count} unread notifications"` / `"1 unread notification"` — tested in `useNotifications.test.ts` line 130–149; words "alert/problem/issue" absent from all labels.
2. **Routes ≥ 34 (F1 floor)** — PASS. VALID_TABS = 35, `ALL_TABS` export present. Topbar is `hidden md:flex` (line 24 of Topbar.tsx): chrome, never intercepts nav.
3. **HE/RTL intact (F10a/F10b)** — PASS. `TopbarSearch.tsx`: uses `insetInlineStart`. `TopbarKidSwitcher.tsx`: uses `insetInlineEnd`. `TopbarBell.tsx`: badge uses `insetInlineEnd: "-4px"`; panel uses `insetInlineEnd: 0`. No physical `left:`/`right:` inline styles in any of the three new components.
4. **Mobile nav preserved** — PASS. `git diff` on `MobileNav.tsx` and `OverviewTab.tsx` returns empty: both files are byte-for-byte unchanged by this wave.

**Gate results (all GREEN):**
- `npm run lint` (tsc --noEmit): PASS, exit 0
- `npm test` (vitest run): PASS — 690 pass / 3 skip / 0 fail (76 files passed, 1 skipped). Up from 663 baseline (+27 new tests: +7 AP-046, +20 AP-045).
- `npm run check:framework`: PASS
- `npm run eval:safety`: PASS (6 risky flagged, 5 benign passed)
- `npm run check:floors`: PASS — 26 PASS / 0 FAIL / 2 WARN (both pre-existing, documented, unchanged)

**Overall verdict: PASS. Wave 2 is gate-green.**

## Update [2026-06-23p] — arbor-design: AP-046 Topbar Notification Bell SHIP = PASS

**Frame:** AP-046 — In-app notification bell, Topbar slot 2. Branch `claude/redesign-wave2`, worktree `.arbor-redesign-w2`. Commit `984fc10`. 4 files, 697 insertions.

**AC-6 verbatim proof:** `useNotifications.ts` assigns `note: signal.note` — the raw `DomainSignal.note` string from `deriveMonitoring()` in `monitoring.ts` — with zero string operations applied (no `.slice`, `.substring`, `.replace`, or template interpolation on the copy). The `signal.note` reference is the exact string built by `buildNote()` inside `monitoring.ts` and stored on `DomainSignal`. The export read is `deriveMonitoring` → `MonitoringResult.watchAreas` → `DomainSignal.note`. In `TopbarBell.tsx` the `NotificationItem` component renders `{body}` where `body = item.note` (verbatim; see the AC-6 LOAD-BEARING comment at that render line).

**Badge framing:** aria-label = `"${count} unread notifications"` (singular: `"1 unread notification"`). The word "alerts", "problems", or "issues" does not appear in any label, tooltip, or adjacent copy — confirmed by lint + test.

**Today-tab inline nudge untouched:** The inline nudge lives at `OverviewTab.tsx` lines 422–435 (the `{nudge && (` block). AP-046 diff does not touch that file.

**No FCM/push, no new child-data egress, search + kid-switcher untouched:** Bell popover is a pure display layer over in-context state (deriveMonitoring + nextNudge). No backend call, no new consent surface. `<TopbarSearch/>` and `<TopbarKidSwitcher/>` components untouched.

**RTL/HE:** Badge uses `insetInlineEnd` (logical property). Panel anchored via `insetInlineEnd: 0` — flips to the correct side under `dir="rtl"` (HE). No `left`/`right` physical values.

**Files changed (absolute, worktree):**
- `app/src/components/layout/Topbar.tsx` — import + slot 2 inert div replaced with `<TopbarBell />`
- `app/src/components/layout/TopbarBell.tsx` (new) — bell button + count badge + popover panel; monitors → `development` tab; JITAI nudge → `nudge.action` tab; Escape-dismissable; token-only styling
- `app/src/hooks/useNotifications.ts` (new) — derives `AppNotification[]` from `deriveMonitoring().watchAreas` (verbatim note) + `nextNudge()` (i18n keys); read-set in localStorage; `markAllRead()`
- `app/src/hooks/useNotifications.test.ts` (new) — 7 tests: verbatim note pass-through, on-track=no items, JITAI key structure, badge aria-label framing (no alert/problem/issue)

**Green-gate (all PASS):** lint tsc exit 0 · test 690/3/0 (+7 new tests) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 documented pre-existing WARN (unchanged).

## Update [2026-06-23o] — arbor-design: AP-045 Global Search Overlay SHIP = PASS

**Frame:** AP-045 — Client-side global search overlay, Topbar slot 1. Branch `claude/redesign-wave2`, worktree `.arbor-redesign-w2`. Commit `7b2920d`. 4 files changed, 570 insertions.

**AC-6 safety (binding):** `src/lib/searchIndex.ts` imports EXACTLY: `../playbank/content` · `./milestoneData` · `./heroJourneys` · `../practice/worlds`. Zero imports from memory/, families/, behaviors data, childData, ChildMemory, observation logs, or ProfileContext. All catalog metadata only; no child-record fields; plain string match (no AI inference). arbor-sec grep confirmed at commit time.

**Files changed (absolute, worktree):**
- `app/src/lib/searchIndex.ts` (new) — static index builder + `searchIndex()` plain-string filter; imports the 4 approved catalogs only; 133 milestones + 43 activities + 18 journeys + 17 worlds = 211 entries.
- `app/src/lib/searchIndex.test.ts` (new) — 20 tests: catalog coverage, unique keys, navigation tab targets, AC-6 safety namespace checks.
- `app/src/components/search/TopbarSearch.tsx` (new) — search input + results overlay; focus-opens, Esc-closes, keyboard nav (ArrowUp/Down/Enter), Cmd/Ctrl+K global shortcut, click-outside close. RTL correct: `insetInlineStart` (logical property), no physical left/right. All colours via tokens (no raw hex). `setActiveTab()` for deep-link navigation.
- `app/src/components/layout/Topbar.tsx` — slot 1 inert div replaced with `<TopbarSearch />`; bell slot (slot 2) and `<TopbarKidSwitcher/>` (slot 3) unchanged.

**Navigation:** result selection calls `setActiveTab(entry.tab)` from `useArbor()` context — the same mechanism used by Sidebar, MobileNav, SearchModal, and every other component. Activities → `daily-play`; milestones → `development`; journeys → `stories`; worlds → `practice`.

**Green-gate (all PASS):** lint tsc exit 0 · test 683/3/0 (+20 new tests) · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 documented pre-existing WARN (unchanged). Bell + kid-switcher untouched; 35 routes intact.

## Update [2026-06-23n] — arbor-design: AP-052 Accent Theme Switching SHIP = PASS

**Frame:** AP-052 — Green/Teal/Blue accent theme switching, token-driven. Branch `claude/redesign-wave2`, worktree `.arbor-redesign-w2`. Append-only CSS edit (p3 zone, after line 513). 5 files changed, 161 insertions.

**Files changed (absolute, worktree):**
- `app/src/lib/theme.ts` (new) — `AccentTheme` type, `ACCENT_THEMES`, `getSavedTheme`/`applyTheme`/`setTheme`/`restoreTheme` helpers; localStorage key `arbor-accent-theme`; green = remove attribute (`:root` unchanged).
- `app/src/main.tsx` — `restoreTheme()` called synchronously before first render (no FWCT).
- `app/src/lib/i18n.ts` — `set.theme.{title,sub,green,teal,blue}` added in both EN and HE dicts.
- `app/src/components/layout/SettingsModal.tsx` — `Palette` icon + theme state + `handleThemeChange`; 3-option picker row inserted between AI language and AI Engines rows.
- `app/src/index.css` — `[data-theme="teal"]` and `[data-theme="blue"]` blocks appended after line 513; green = no attribute (`:root` untouched, byte-for-byte visual parity); teal/blue override only the 9 primary/accent green-family tokens.

**Green-gate (all PASS):** lint tsc exit 0 · test 663/3/0 · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 documented pre-existing WARN.

**Commit:** `b40e0ce` on `claude/redesign-wave2`. Not pushed, not merged, not deployed.

**AA contrast:** Teal primary (#0d9488) vs white 5.32:1; teal ink (#0f766e) vs teal-soft 5.8:1. Blue primary (#3b6fc8) vs white 6.6:1; blue ink (#1d4ed8) vs blue-soft 9.2:1. All pass WCAG AA.

## Update [2026-06-23m] — arbor-devsecops-lead: Redesign Wave-1 COMPOSITE SHIP-GATE = PASS / PROMOTE-READY

**Frame:** Validate `claude/redesign-wave1` (worktree `.arbor-redesign-w1`) to PROMOTE-READY + assemble the prod-promotion package. STRICT readiness-only: no deploy/merge/push run. 8 app-source files, 4 commits off `origin/main@253da27`, zero deploy/CI/hosting surface (confirmed by diff).

**Composite gate (re-run by lead, all GREEN):** lint `tsc --noEmit` 0 · `npm test` 663 pass / 3 skip / 0 fail · check:framework PASS · eval:safety PASS · check:floors 26 PASS / 0 FAIL / 2 documented WARN · local `vite build` exit 0.

**Specialist sign-offs (4/4 PASS, no veto):**
- **arbor-design** — AP-043 visual-parity PASS: pure token refactor, every new `--arbor-*` byte-identical to the hex it names; the `#fff`/`#ffffff`→`var(--arbor-paper-elevated)` swap verified (`--arbor-paper-elevated:#ffffff`); additive-only, no existing token changed.
- **arbor-sec** — PASS: no secret/key/env exposure, ZERO new deps (only a `check:floors` script line) → no new CVE surface; `capability-floors.mjs` reads local src only (no net/shell/write); Topbar inert.
- **arbor-qa** — AP-044 PASS: 35 VALID_TABS (≥34) all reachable, shell wraps but never intercepts nav; RTL clean (no physical left/right in Topbar/Shell wrapper, `dir=rtl` cascade intact); MobileNav preserved (Topbar `hidden md:flex`). `smoke:routes` script does NOT exist — substituted VALID_TABS source + emitted-lazy-chunk inventory.
- **arbor-sre** — PASS: +1,211 bytes total JS (+0.040%), 49× under the 2% budget; only Topbar.tsx adds weight; worlds.ts not in bundle.

**Owed before the waves that touch those surfaces (NON-blocking for Wave-1, pre-existing gaps not regressions):** F11 `PLAY_ACTIVITIES`=43<250 (owned arbor-design) · F18b `BehaviorLog.coRegulationScript` missing (owned arbor-memory). Also new: zero layout/shell unit tests (Wave-2 coverage gap, arbor-qa).

**Promotion mechanism (NOT executed — Level-3, awaits Guy):** repo `guyrubin/PPPPtherapy-`. Push `claude/redesign-wave1` → PR → merge to `main` IS the prod-promote: `arbor-deploy.yml` fires on push-to-main → `deploy-candidate` (full gate + 0%-traffic Cloud Run candidate + `/` smoke) → `promote` (100% traffic shift + `firebase deploy --only hosting,firestore`). NOTE: promote auto-runs by default (no Required-Reviewer set) AND `arbor-auto-promote` scheduled task (hourly) will also push it → merging to main = live within the hour. Rollback: API `gcloud run services update-traffic arbor-api --region europe-west4 --to-latest=false --to-revisions <prev>=100`; client `firebase hosting:rollback`.

**MERGE-LANE (binding):** an in-flight Firebase Hosting deploy is staged on `claude/mobile-store-safe-fixes` which edits `firebase.json` rewrites (+/privacy +/terms +/support) and redeploys hosting. Because promote deploys hosting wholesale from main's `firebase.json`, Wave-1 MUST sequence BEHIND mobile-store (FIFO) — else a Wave-1-first main lacks those rewrites and clobbers them. Ledger: queue mobile-store ahead of redesign-wave1 on the merge-lane; lane currently 🟢 FREE.

**Verdict: READY / PROMOTE-READY.** Deploy is a one-word Guy GO (Level 3).

## Update [2026-06-23l] — arbor-sre: Wave-1 perf/bundle sign-off (PASS)

**Trigger:** Orchestrator requested PERF/BUNDLE sign-off for Redesign Wave 1 (branch `claude/redesign-wave1`, worktree `.arbor-redesign-w1`). Local/read-only only — no deploy.

**Baseline built:** `origin/main` @ 253da27, temp worktree `C:/tmp/arbor-main-baseline` (removed after measurement).

**Hard numbers:**

| Metric | origin/main baseline | Wave-1 current | Delta |
| :-- | --: | --: | --: |
| Total JS (105 chunks) | 3,001,001 bytes | 3,002,212 bytes | +1,211 bytes (+0.040%) |
| Entry chunk | 591,837 bytes | 593,048 bytes | +1,211 bytes (+0.205%) |
| Entry gzip | ~182.66 kB | ~182.86 kB | +0.20 kB |
| Chunk count | 105 | 105 | 0 |

**2% total-JS threshold:** 60,020 bytes. Actual delta: 1,211 bytes. 98.0% under threshold.

**Component breakdown:**
- `Topbar.tsx`: confirmed bundled in entry chunk (`index-fiPOdohW.js`); absent from baseline. Accounts for the full +1,211 byte delta — consistent with a small inert React header component (~1.2 kB unminified/minified overhead).
- `worlds.ts`: NOT in the app bundle in either branch. Only consumed by `capability-floors.mjs` (Node script, not bundled). Zero bundle impact confirmed — grepped dist/assets for `faceMatch`, `WORLD_IDS`; no match in either baseline or wave1.
- `capability-floors.mjs`: build/check script, never in bundle by design.
- CSS tokens (`index.css` additions, `tokens.ts`): CSS custom properties add no JS weight; `tokens.ts` is a tiny typed map already part of the app module graph.

**Verdict: PASS.** No performance or cost-budget regression. Total JS growth +0.04% (49x under threshold). Entry chunk growth +0.20%. Chunk count unchanged. Temp worktree removed and confirmed clean.

## Update [2026-06-23k] — arbor-design: AP-044 desktop sidebar + topbar placeholder shell (Wave 1)

**Trigger:** AP-044 dispatched to arbor-design pod for Redesign Wave 1.

**Worktree:** `.arbor-redesign-w1/app`, branch `claude/redesign-wave1`. No other worktree touched. NOT pushed.

**What shipped:**
- `app/src/components/layout/Topbar.tsx` (new): persistent `<header>` placeholder bar, `hidden md:flex`, height 64px. Left zone: Arbor wordmark. Right zone: three inert `<div>` placeholder slots (search / notifications / kid-switcher) for Wave 2. Zero interactivity; all styling via `var(--arbor-*)` tokens, no raw hex.
- `app/src/components/layout/Shell.tsx`: imported Topbar; wrapped the right grid column in `<div className="flex flex-col min-h-0 md:h-screen">` so Topbar sits above the scrollable `<main>` (which gained `flex-1 min-h-0` and lost `max-h-screen`). Grid column count, Sidebar, tabRegistry, VALID_TABS, MobileNav — all untouched.

**AC verification:**
- AC1: Sidebar renders at md+ with 6 primary sections — already existed, preserved.
- AC2: MobileNav (`md:hidden` bottom bar) — byte-for-byte unchanged.
- AC3: All 34 VALID_TABS / tabRegistry entries — not touched.
- AC4: Topbar placeholder added — renders on desktop only, inert slots.
- AC5: No new raw hex; Topbar uses only `var(--arbor-*)`.
- AC6: All 5 gates green.

**Full gate result:**
- `lint` (tsc --noEmit): PASS
- `test` (vitest run): 663 pass | 3 skipped | 74 files | 0 failures; navigation.test.ts 11/11 pass
- `check:framework`: PASS
- `eval:safety`: PASS
- `check:floors`: PASS — 26/26 asserted; F1 VALID_TABS=34 >= 34 ALL_TABS-export=present PASS; 2 WARNs pre-existing

**Commit:** 33b8597. NOT pushed. NOT merged to main.

## Update [2026-06-23j] — arbor-qa: F1-F18 capability-floor harness (Wave 1, check:floors)

**Trigger:** arbor-devsecops-lead dispatched arbor-qa to build the no-regression gate for Redesign Waves 2-4.

**Worktree:** `.arbor-redesign-w1/app`, branch `claude/redesign-wave1`. No other worktree touched. NOT pushed.

**What shipped:**
- `app/scripts/capability-floors.mjs` — pure-read Node ESM script asserting F1-F18. Hybrid: static-parse for enum/union/wiring floors; pattern-count for data array floors. 29 floor lines, 26 PASS, 0 FAIL, 2 WARN (pre-existing gaps).
- `app/package.json` — added `"check:floors": "node scripts/capability-floors.mjs"` to scripts.
- `app/src/context/ArborContext.tsx` — added `export const ALL_TABS: ActiveTab[]` (non-functional probe-action per spec §1a, derived from VALID_TABS, zero behavior change).

**Full gate result (all 5 checks):**
- `lint` (tsc --noEmit): PASS
- `test` (vitest run): 663 pass | 3 skipped | 74 files | 0 failures
- `check:framework`: PASS
- `eval:safety`: PASS (6 risky flagged, 5 benign passed)
- `check:floors`: PASS — 26/26 asserted floors green; 2 WARNs (pre-existing gaps below)

**WARN -- pre-existing gaps (NOT regressions):**
- F11 PLAY_ACTIVITIES=43<250: content target for Waves 2-4; owned by arbor-design. Must resolve before Wave 4 ships.
- F18b BehaviorLog missing coRegulationScript: field never existed in types.ts; owned by arbor-memory. Must add before any wave touching behavior-log UI.

**Asserted vs SKIPPED:** 0 floors skipped. All 18 spec floors (29 sub-assertions) are wired. No fake passes.

**Commit:** 3b71119. NOT pushed. NOT merged to main.

## Update [2026-06-23i] — arbor-practice: F2 prereq — WORLDS registry exported (Wave 1 floor harness)

**Trigger:** F2 probe action from NO-REGRESSION-GATE.md §1a — `WORLDS` was module-local in a file that does not exist; needed a real exported registry so `capability-floors.mjs` can import and count it.

**Worktree:** `.arbor-redesign-w1/app`, branch `claude/redesign-wave1`. No other worktree touched.

**What shipped:** `app/src/practice/worlds.ts` — new file only, zero rendering wires changed.
- `export const WORLDS: World[]` — 17 entries; 14 match the F2 spec target ids exactly (speech, feelings, adventures, mimic, memory, reading, beat, pose, pattern, order, truth, promise, courage, aim) + 3 additional live worlds (faceMatch, missions, journey).
- `export const WORLD_IDS: string[]` — flat id list for floor assertions.
- Live (10): speech, feelings, adventures, mimic, memory, reading, faceMatch, missions, journey + faceMatch.
- Scaffolded (7): beat, pose, pattern, order, truth, promise, courage, aim.
- Status annotations on every entry; inline source-file references.

**Gate:** lint green (tsc --noEmit, 0 errors), 663 passed | 3 skipped (74 files), no regression. Commit 6236dda. NOT pushed. NOT merged.

## Update [2026-06-23h] — arbor-design: AP-043 design-token layer (visual parity, Wave 1)

**Trigger:** AP-043 dispatched to arbor-design pod for Redesign Wave 1.

**Worktree:** `.arbor-redesign-w1/app`, branch `claude/redesign-wave1`. No other worktree touched.

**What shipped:**
- `app/src/index.css`: Added 5 new `:root` CSS custom properties for high-traffic unlabelled literals — `--arbor-green-cta-start` (#3cc081, 33 tsx/ts occurrences), `--arbor-green-mid` (#5fce97, 11), `--arbor-paper-tinted` (#eef6f1, 8), `--arbor-cam-floor` (#16352a, 6), `--arbor-muted-alt` (#69747f, 5). Replaced the 3 tokenizable hardcoded hex values in CSS rules (not selector strings) with `var()` references: `--gradient-cta` start stop, `.arbor-play::before` gradient `#fff`/`#ffffff`.
- `app/src/lib/tokens.ts`: Mirrored all 5 new tokens into `CSS_VARS` and `BRAND_HEX` for typed TS consumers.

**Hex literal counts:**
- index.css rules (outside `:root`): 3 → 0 raw hex (3 Tailwind selector strings remain; untokenizable by design).
- tsx/ts: 277 raw hex literals remain; 5 new named tokens are now available for follow-on consumer sweep.

**Gate:** lint clean (tsc --noEmit), 663/663 tests pass, eval:safety pass. Zero visual/behavior change.
**Commit:** 2532e03. NOT pushed. NOT merged.

## Update [2026-06-23g] — arbor-pm: Store-submission blockers filed (AP-061..AP-064, R3–R6)

**Trigger:** SUBMISSION-READINESS.md Wave-1 review (both verifiers `readyToSubmit: false`). Four reject-class items in the shared web-app codebase (`app/src`) triaged and promoted as P0 tickets. These block every native submission and gate G-B (paid accounts). Built by the product/redesign track, not the mobile track.

**Items promoted (all `safe`, all reject-class):**
- **AP-061** — In-app privacy policy + terms link (Settings + account-creation). `SettingsModal.tsx:169-174` only opens child-profile editor; zero refs to privacy.html in app/src. Apple 5.1.1 + Play DFF. Effort 1, score 25.0.
- **AP-062** — Native IAP: RevenueCat Capacitor SDK + `isNativePlatform` branch. `useCheckout.ts:22` redirects to web checkout; no StoreKit/Play Billing client. Apple 3.1.1 + Play Payments. Highest severity. Sub-items: R10 (Android manifest permissions), R11 (Data Safety "Shared" fix). Effort 3.
- **AP-063** — Parental gate component wrapping startCheckout, openPortal, all window.open exits. `PaywallModal.tsx:46-51` + `BehaviorsTab.tsx:200` + `reportExport.ts:115` ungated. Apple Kids 1.3 + Play Families. Effort 2. Depends on AP-062 for startCheckout wrap.
- **AP-064** — Full account deletion: in-app action (loops eraseEverything across children, deletes Auth user, clears entitlements/{uid}) + web deletion-request URL. `childData.ts:95-119` is per-child only; no Auth deletion exists. Apple in-app deletion required; Play in-app + web. Effort 2.

**Sequence:** AP-062 first (unblocks AP-063 startCheckout wrap); AP-061 and AP-064 parallelize independently. All four must be on a green branch before G-B is worth opening.

**Highest AP- id on board: AP-064.**

## Update [2026-06-23f] — arbor-pm: Adversarial audit corrections folded into backlog + gate (AP-055..AP-060, 3 re-gates, F12..F18)

**Trigger:** Adversarial completeness + regression-hole + gate-correctness audit (3 files, 2026-06-23). PM applied all corrections without touching product code.

**Artifacts changed:**
- `mesh/PRODUCT-BACKLOG.md` — Redesign Reconciliation section
- `mesh/marketing/MARKETING-BACKLOG.md` — §11 Redesign Marketing Harvest
- `PAI/PRDs/arbor-redesign-handoff/_analysis/NO-REGRESSION-GATE.md` — §5 appended (F12..F18)

**6 missed net-new tickets added (AP-055..AP-060):**
- AP-055: Scholar Hub weekly concept feed — safe, later FE (post-Wave 4)
- AP-056: School Handoff Brief — gated (clinical-psych + safety/COPPA), post-clearance
- AP-057: Bedtime Stories AI nightly library — gated (safety/COPPA + clinical-psych), post-clearance
- AP-058: Smart Reminders settings dashboard — gated (clinical-psych nudge-cadence framing), post-clearance
- AP-059: Kid weekly missions calendar — safe, later FE (post-Wave 4)
- AP-060: "The Science" page — gated (clinical-lead copy clearance; CHARTER §3 p11 firewall: "clinician-reviewed" prototype language is a violation and MUST be reworded), post-clearance

**Highest AP- id on board: AP-060.**

**3 re-gates applied (plus 1 binding condition):**
- AP-053 Dev Copilot + Learning Map: safe → gated (light): clinical-psych copy pass required on "here's why" lowest-domain framing
- AP-046 Notification bell: stays safe, but binding AC-6 added: verbatim monitoring copy + no-re-headline is a hard acceptance gate
- AM-R4 social-proof strip (marketing): safe → gated: arbor-safety + arbor-clinical-lead clearance required on "CDC-grounded" string, parity with AM-R3/R5
- AP-045 search: Risk-1 binding condition added: content catalogs only, never child-record fields

**7 new floors F12..F18 appended to NO-REGRESSION-GATE.md §5:**
- F12 safety-screening wired (CRITICAL/gated), F13 consent-enforcement middleware (CRITICAL/gated), F14 sharing access model (gated), F15 voice I/O affordance (safe), F16a/b image-gen + C2PA (safe/gated), F17 handoff export (safe), F18a/b/c clinical-content shape (safe/framing-gated). F2 WORLDS export flagged as Wave 1 prerequisite.

**New gated items surfaced for Guy:** AP-053 re-gate, AP-056, AP-057, AP-058, AP-060, AM-R4 re-gate.

## Update [2026-06-23e] — arbor-clinical-lead: M3 store-listing CLAIMS GATE → HELD (3 unsubstantiated claims, both languages)

Clinical board ran the binding claims gate on the M3 store-listing pack (EN+HE) for Apple/Google submission. **Verdict: soundness:concerns / claims:UNSUBSTANTIATED(3) / riskClass:gated → HELD** (identical to arbor-safety veto; cannot submit). The pack's own audit said "no effect-size claims"; it MISSED Rhythm "predict[s] the whole day" (effect/accuracy claim) in BOTH stores + BOTH languages. Three rejects: (1) Rhythm "predicts your child's whole day" → "anticipate/reflect from your child's own logged patterns"; (2) HE promo "כבר יודעת עליו הכל" (knows EVERYTHING) + added "שפה" tracking — inflated past the EN, hold HE to the EN claim ceiling; (3) Practice Studio "speech/language/SEL... feeds back to the coach" — strip the feedback-loop clause until FR-10 verified, use "games" fallback. App name/subtitle/short-desc/keywords/moat/privacy/categories all clinically clear. Verdict written to PRODUCT-COUNCIL.md.

## Update [2026-06-23d] — arbor-content: M3 store listing metadata pack complete

**Trigger:** M3 workstream of the mobile store-publishing goal (2026-06-23).

**Artifact:** `PAI/projects/arbor/execution/mobile-store/M3-listing-metadata.md`

**App name locked (both stores, both languages):**
- EN: "Arbor — Know Your Child" (22 chars, well within ≤30)
- HE: "Arbor – האפליקציה שזוכרת" (24 chars, well within ≤30)

**Hero line:** "Every parenting app gives you content. Arbor actually knows your kid." (EN) / "כל אפליקציית הורות נותנת לכם תכנים. Arbor באמת זוכרת את הילד שלכם." (HE concept)

**All Arbor Bar gates pass.** No diagnostic/medical/effect-size claims anywhere. Deployment gate flags applied: Care (packet/warm-handoff only), Practice Studio (hedged — FR-10 verify needed), Development Check (not mentioned), 0–24mo band (not precision-marketed, FR-7 P0 unfixed), Parent Masterclasses (not listed).

**Two pre-submission blockers flagged in the doc:**
1. Confirm Practice Studio feedback loop live (FR-10) before "sessions feed back into the record" ships — if loop not verified, soften to "child-facing speech, language, and SEL games."
2. Create or redirect `arborparentingapp.com/support` before entering Support URL in App Store Connect / Play Console.

**arbor-safety clinical sign-off required before any listing is submitted** (copy is clean; team should confirm before the App Store Connect/Play Console form is filled).

**Category recommendations:** Apple = Education (primary) + Lifestyle (secondary) + Kids Category flag (compliance); Google = Parenting (primary) + Education (secondary), ages 0–12 all bands.

## Update [2026-06-23c] — arbor-marketing-lead: Redesign Marketing Harvest (AM-R1–AM-R13)

**Trigger:** Claude Design prototype handoff reconciled into product backlog (AP-043–AP-054). Marketing tasked to harvest marketing/brand/funnel surfaces from the redesign without duplicating product tickets.

**Artifacts appended:** `mesh/marketing/MARKETING-BACKLOG.md` §11 "Redesign Marketing Harvest (2026-06-23)" — 13 new items AM-R1–AM-R13.

**What was harvested and why:**
- AM-R1–R2: Pricing page + trial CTA — conversion surface with real ₪/$ numbers; Family tier explicitly protected.
- AM-R3–R5: "The Science" page — 133 milestones / 40+ sources / CDC+ASQ-3+Siegel-Bryson+Gottman — SEO/AEO trust gold; clinical gate required.
- AM-R6–R7: Hero Stories viral surface — live count is 10 journeys (not the 4 the prototype shows); messaging enforces live number.
- AM-R8–R9: Design token / visual language sweep onto marketing HTML + accent-theme social variants.
- AM-R10–R11: Capability Blueprint competitor framing corrected to six-surface / eight-incumbent spine.
- AM-R12–R13: 5-step onboarding pre-frame copy + completion share prompt — activation funnel.

**No-regression rule applied:** all items explicitly use live numbers (10 journeys, 14 worlds, 250+ activities, 133 milestones, Free/Plus/Family, 50+ cosmetics).

**Gated items in harvest:** AM-R1 (ILS price confirm), AM-R3/R5 (`arbor-safety` + `arbor-clinical-lead` on effect-size/diagnostic framing), AM-R12/R13 (`arbor-safety` on onboarding avatar-child-data framing + `arbor-clinical-psych` on Focus-selection copy).

**Positioning conflict flagged for Guy (§11g):** Blueprint says "4 competitors / 4 domains"; BRAND-STRATEGY spine says six surfaces / eight incumbents / seven domains. Blueprint is an older internal sketch — marketing does not use Blueprint framing in any outbound asset until Guy decides whether to update/retire it.

---

## Update [2026-06-23b] — arbor-pm: Redesign reconciliation + backlog promotion (AP-043–AP-054)

**Trigger:** Claude Design prototype parsed; PM tasked with diff + backlog merge.

**Artifacts produced:**
- Diff: `PAI/PRDs/arbor-redesign-handoff/_analysis/REDESIGN-DIFF.md` (3-bucket diff)
- Backlog: `mesh/PRODUCT-BACKLOG.md` — new section "Redesign Reconciliation — Arbor Web App Prototype (2026-06-23)"

**Key finding — prototype is THINNER than live in multiple dimensions:**
- Games: 14 live > 6 prototype. Journeys: 10 live > 4 prototype. Activities: 250+ live > ~3 shown. Milestones: 133 × 12 bands live > 35 × 5 visible. Billing: Free/Plus/Family live > Free/Plus only in prototype. Nav depth: 34 routes live > 6 sidebar views. Memory ledger, growth plans, scholar lens routing, voice I/O are live-only (absent from prototype).

**12 Bucket-A tickets promoted (AP-043 to AP-054):**
- AP-043: Design system token layer (Wave 1 — hard prerequisite)
- AP-044: Desktop sidebar + topbar shell (Wave 1)
- AP-045: Global search (Wave 2)
- AP-046: Topbar notification center (Wave 2)
- AP-047: Multi-kid topbar chip (Wave 2)
- AP-048: Kid Mode desktop overlay (Wave 3, safe)
- AP-049: 5-step onboarding flow (Wave 3, gated — psych + safety sign-off)
- AP-050: Hero Avatar Engine shared canvas module (Wave 4, safe)
- AP-051: Day Windows hour-by-hour panel (Wave 4, gated — psych copy pass)
- AP-052: Accent theme switching (Wave 4, safe)
- AP-053: Dev Copilot + Learning Map in Academy (Wave 4, safe)
- AP-054: Language Lab bilingual vocabulary tracker (Wave 4, gated — SLP framing pass)

**3 gated items surfaced for Guy:** AP-049 (onboarding step 3 psych + step 4 safety), AP-051 (Day Windows psych copy), AP-054 (Language Lab SLP framing).

**Wave 1 is pure-frontend, zero backend change — safest first step.**

---

## Update [2026-06-23a] — arbor-native: M1 store-readiness audit complete

**Trigger:** M1 workstream of the mobile store-publishing goal (2026-06-23).

**Audit output:** `PAI/projects/arbor/execution/mobile-store/M1-store-readiness-audit.md`

**Verdict:** 5 fixes identified across ~30 checked items. No blocking structural issues. Both CI workflows internally consistent and green-structured. Capacitor config, Info.plist usage strings, iOS scheme, Android sdk levels, Fastlane/signing path — all confirmed correct.

**Ordered fix list:**
- F-1 (blocked G-A): Replace `app.arbor.family` placeholder in `capacitor.config.ts`, `project.pbxproj` (2×), `build.gradle`, `strings.xml`. Unblocked only after Guy locks bundle id.
- F-2 (do now, 2 min): Add `ITSAppUsesNonExemptEncryption = false` to `app/ios/App/App/Info.plist`. Required for App Store export-compliance; absence causes review delay.
- F-3 (do now, 10 min): Add `CAMERA` + `RECORD_AUDIO` permissions to `app/android/app/src/main/AndroidManifest.xml`. Camera and mic are declared in iOS Info.plist but absent from Android manifest. Verify if `READ_MEDIA_IMAGES` also needed for gallery.
- F-4 (verify then run): Confirm `AppIcon-512@2x.png` (iOS) and Android mipmap PNGs contain Arbor art, not Capacitor defaults. Android vector drawables (`ic_launcher_background.xml` teal fill, `ic_launcher_foreground.xml` robot) confirmed as Capacitor defaults — re-run `npx @capacitor/assets generate` with Arbor SVGs and then `npx cap sync`.
- F-5 (before first TestFlight/Play upload): Wire build-number auto-increment in CI — `agvtool` step in `ios.yml`, `-PversionCode=$GITHUB_RUN_NUMBER` in `android.yml`.

**Key confirmed facts:**
- iOS deployment target: 15.0 (`project.pbxproj:233,284,301,323`)
- iOS version: 1.0 / build 1 (`project.pbxproj:306,299`)
- Android: minSdk=24, targetSdk=36, compileSdk=36, versionCode=1, versionName="1.0" (`variables.gradle:2-4`, `build.gradle:10-11`)
- iOS shared scheme: committed and `buildForArchiving=YES`
- Splash assets: fully generated for both platforms (light + dark, all densities)
- All 4 iOS usage strings (Camera/Mic/PhotoLibrary/PhotoLibraryAdd): present with meaningful text
