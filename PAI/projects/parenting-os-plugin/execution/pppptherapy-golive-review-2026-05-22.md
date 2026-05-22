# PPPPtherapy / Arbor — Pre-Go-Live Review

Date: 2026-05-22  
Agent: PAI — Product & AI Ventures  
Repository reviewed: https://github.com/guyrubin/PPPPtherapy-/tree/main  
Local review clone: `/tmp/pppptherapy_review_20260522_161819`

## Executive decision

**Do not go live as a production product yet.** The repository is currently a strong concept artifact — a PRD plus a polished static HTML mockup — but it is not a launch-ready application.

Recommended path: **private beta only**, with a narrow, parent-controlled, non-diagnostic MVP focused on everyday parenting routines, behavior reflection, scripts, and action plans.

Do **not** launch with clinical-sounding risk scores, diagnostic-adjacent autism/ADHD language, school-readiness percentages, professional dashboards, school integrations, or institutional workflows until safety, privacy, governance, and validation are in place.

## Repository facts

Files found:

- `docs/arbor-prd.md` — 334 lines
- `mockups/arbor-platform-mockup.html` — 56 lines
- `.gitkeep`

Current repo state:

- Static PRD + one HTML mockup.
- No app framework.
- No backend.
- No authentication.
- No database.
- No AI orchestration code.
- No consent/privacy implementation.
- No tests, CI/CD, deployment config, analytics, or monitoring.

## P0 — Must fix before public launch

### 1. Narrow the launch promise

Current positioning is too broad: parenting AI, child-development OS, medical guardrails, autism/ADHD support, school collaboration, co-therapy, B2B/B2G dashboards, stories, and analytics.

Launch positioning should be:

> AI-supported parenting companion for structured reflection and practical next steps — not a diagnostic, medical, or care-coordination product.

Defer professional, school, municipal, insurer, and diagnostic-adjacent workflows.

### 2. Remove clinical-sounding scoring from UX

The mockup uses language like:

- `Risk level: Low`
- `School readiness: 74%`
- `Patterns detected`
- `Professional referral accuracy`

These imply validated clinical assessment. Replace with safer language:

- Things to monitor
- Parent observations
- Routine consistency
- Suggested next steps
- Consider discussing with a professional if...

Avoid percentages unless based on a validated instrument and documented methodology.

### 3. Define a safety operating model

The PRD says “never diagnose,” but the product still includes milestone delay indicators, autism/ADHD observations, medical guidance, risk flags, and escalation advice.

Before launch, define:

- Medical, developmental, mental-health, abuse/neglect, self-harm, domestic violence, and emergency safety taxonomy.
- Country-specific red-flag escalation flows.
- Mandatory “not diagnosis / not treatment / not emergency service” language.
- Human review process for high-risk content.
- Incident review and post-market safety monitoring.

### 4. Build a high-risk AI evaluation suite

Before any AI feature is exposed, test scenarios including:

- Fever, seizures, breathing issues, dehydration, head injury.
- Developmental regression.
- Suspected autism/ADHD.
- Aggression, abuse, neglect, domestic violence.
- Parent burnout, depression, intrusive thoughts, self-harm.
- Sleep training, feeding, toilet training, medication, supplements.

Define measured pass/fail criteria before release.

### 5. Complete child-data privacy architecture

Arbor’s moat — longitudinal child memory — is also the biggest regulatory and trust risk.

Required before collecting child data:

- Data categories collected.
- Purpose limitation per feature.
- Data minimization rules.
- Retention periods.
- Deletion/export flows.
- Parental consent and co-parent access model.
- Professional/school sharing permissions.
- AI training policy: default should be **no child data used for model training**.

### 6. Complete GDPR / EU readiness

Before launch in Netherlands, Belgium, Israel, or wider EU:

- DPIA / Data Protection Impact Assessment.
- DPA with AI/model vendors and subprocessors.
- Data residency / transfer mechanism.
- Legal basis for child and developmental data processing.
- Special-category data assessment.
- Age/parental-authority verification strategy.
- Breach-response process.
- Subprocessor list.

### 7. Remove child-facing AI from MVP

The PRD correctly says no unsupervised child AI chat in MVP. Also defer AI conversation practice and child-facing language modules until there is:

- Age gating.
- Parental supervision.
- Content moderation.
- Anti-manipulation UX review.
- Child-safety testing.

## P1 — Required for credible private beta

### 8. Convert mockup into a real MVP architecture

Recommended initial architecture:

- Web: Next.js.
- Backend/API: Next API routes, Node.js, FastAPI, or Supabase edge functions.
- Database: PostgreSQL.
- Auth: managed auth with parental consent support.
- Storage: encrypted object storage for exports/reports.
- AI: RAG orchestration, prompt registry, safety classifier, evaluation harness.
- Logging: safety-aware audit/event logging without storing sensitive content in analytics.

### 9. Add repository hygiene

Add:

- `README.md`
- `.gitignore`
- License decision
- Development setup instructions
- Deployment instructions
- Architecture notes
- Environment variable example
- Security/privacy notes

### 10. Add accessible, semantic frontend implementation

The mockup is visually strong but prototype-level. Improve:

- Real heading hierarchy.
- Keyboard focus states.
- Buttons with real actions or links.
- Skip-to-content link.
- ARIA labels where needed.
- Color contrast checks.
- Responsive tables.
- `prefers-reduced-motion` support.

### 11. Add SEO and public-launch basics

Current HTML only has title and viewport metadata. Add:

- Meta description.
- Canonical URL.
- Open Graph tags.
- Twitter/X card tags.
- Favicon/app icons.
- `robots.txt`.
- `sitemap.xml`.
- Structured data where appropriate.
- Remove “Mockup” from production title.

### 12. Add privacy-conscious analytics

Use Plausible, PostHog EU-hosted, or equivalent with consent.

Track only non-sensitive events:

- Landing CTA click.
- Signup started/completed.
- Child profile created.
- AI question asked — no prompt content in analytics.
- Action plan generated.
- Behavior log created — no child details in analytics.
- Export generated.
- Subscription started/canceled.

Never send sensitive child content as analytics payload.

### 13. Create country-specific escalation directory

Country-specific guidance is needed for:

- Emergency services.
- Pediatric urgent care.
- Child mental-health support.
- Domestic violence / abuse reporting.
- Developmental assessment pathways.
- School support pathways.

### 14. Establish expert governance

Create an advisory/review board before making developmental or medical-sounding claims:

- Pediatrician.
- Child psychologist.
- Speech/language expert.
- Occupational therapist.
- GDPR/privacy counsel.
- Safeguarding expert.

Label content as AI-generated, parent-entered, expert-reviewed, or local public-health guidance.

### 15. Define memory controls

Add parent-visible controls:

- What Arbor remembers.
- Edit/delete specific memories.
- Pause memory.
- Private notes not used by AI.
- Parent confirmation before sensitive facts are stored.
- Separate memory per child.

### 16. Strengthen sharing consent

For school/professional exports:

- Parent must review before sending.
- Show exactly what data is shared.
- Show who receives it.
- Show purpose and retention.
- Allow redaction.
- Label observations as parent-reported, not clinical facts.

## P2 — Recommended before broader launch

### 17. Revise MVP scope

Current MVP is still too wide: AI coach, child profile, behavior logging, milestones, action plans, story generator, dashboard, safety classifier, PDF export.

Recommended MVP:

1. Parent onboarding.
2. One child profile.
3. AI parenting coach with safe structured answers.
4. Behavior/routine logging.
5. Action plans.
6. Safety escalation.
7. Basic parent-reviewed export.

Defer story generator and milestone scoring until trust/safety is validated.

### 18. Change public positioning

Use safer launch language:

- “AI-supported parenting companion.”
- “Structured guidance and tracking for parents.”
- “Evidence-informed, parent-controlled child-development support.”

Avoid leading with “child-development operating system” until the product has institutional maturity and validated governance.

### 19. Add trust UX

Add visible trust controls:

- Why am I seeing this?
- What did Arbor use from my child profile?
- When to call a doctor/professional.
- This is not a diagnosis.
- Delete this data.
- Correct Arbor’s memory.

### 20. Revise KPIs to avoid unsafe incentives

Add safety/trust KPIs:

- Unsafe-answer rate.
- Escalation correctness.
- Parent-reported clarity.
- Data deletion/export success.
- Consent completion quality.
- Hallucination reports.
- High-risk handoff success.

Avoid optimizing only for engagement with sensitive child concerns.

### 21. Add deployment and quality gates

Before beta:

- Staging and production environments.
- Preview deployments.
- CI checks.
- Linting/formatting/type checking.
- Accessibility checks.
- Smoke tests.
- Lighthouse performance/accessibility/SEO checks.
- Error monitoring.
- Uptime monitoring.
- AI failure/safety tracking.

## Recommended launch plan

### Phase A — Concept/waitlist launch

Safe now if framed as concept/waitlist only:

- Publish landing page.
- Collect interest.
- Do not collect child data.
- Do not offer AI advice.
- Include clear disclaimer and privacy/cookie basics.

### Phase B — Private beta

Only after P0 safety/privacy items:

- 25–50 families first.
- One country/language segment first.
- Everyday routines and behavior reflection only.
- No diagnostic labels, percentages, risk scoring, or child-facing AI.
- Manual review of high-risk outputs.

### Phase C — Controlled MVP

After beta evidence:

- Add more logs/action plans.
- Add parent-reviewed exports.
- Add expert-reviewed content packs.
- Add limited professional reviewer workflow, not full professional dashboard.

## PAI recommendation

Proceed with **private beta preparation**, not public go-live.

The product thesis is strong. The current artifact is valuable for vision, fundraising, and stakeholder alignment, but public launch should wait until Arbor has a narrower MVP, explicit child-data privacy architecture, safety escalation flows, expert governance, and a real application/deployment foundation.
