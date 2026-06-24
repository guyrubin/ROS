export const meta = {
  name: 'arbor-product-council',
  description: 'Arbor Product Council — the feature-request INTAKE. Fuses four streams (Advisory worth-building rubric, Clinical requirements + gate, Marketing demand/feature-requests, CIL findings) into one scored candidate queue, applies the binding clinical gate, and appends a dated Council Intake block to PRODUCT-BACKLOG.md for the Orchestrator. Decides WHAT to build; never builds, merges, or deploys. Hang-proof: no live preview.',
  phases: [
    { title: 'Sense', detail: 'gather the four streams: advisory + clinical (live agents) + marketing demand + CIL findings (on disk)' },
    { title: 'Review', detail: 'advisor rubric score + binding clinical gate on each candidate' },
    { title: 'Score+Write', detail: 'dedupe, score, append the dated Council Intake block to PRODUCT-BACKLOG.md; surface gated/founder items' },
  ],
}

const CANDIDATE = {
  type: 'object',
  required: ['id', 'title', 'stream', 'surface', 'rationale', 'reach', 'impact', 'confidence', 'effort', 'ownerPod', 'touchesClinical', 'riskClass'],
  properties: {
    id: { type: 'string' }, title: { type: 'string' },
    stream: { type: 'string', enum: ['philosophy', 'clinical', 'demand', 'cil'] },
    surface: { type: 'string' }, rationale: { type: 'string' },
    reach: { type: 'integer', minimum: 1, maximum: 5 }, impact: { type: 'integer', minimum: 1, maximum: 5 },
    confidence: { type: 'number', minimum: 0, maximum: 1 }, effort: { type: 'integer', minimum: 1, maximum: 5 },
    ownerPod: { type: 'string' },
    touchesClinical: { type: 'boolean' },          // development/behavior/speech/health/claims?
    claim: { type: 'string' },                      // the developmental/medical/effect-size claim, or "none"
    riskClass: { type: 'string', enum: ['safe', 'gated'] },
  },
}
const CANDIDATES_SCHEMA = { type: 'object', required: ['candidates'], properties: { candidates: { type: 'array', items: CANDIDATE } } }
const RUBRIC_SCHEMA = {
  type: 'object', required: ['id', 'verdict', 'why'],
  properties: { id: { type: 'string' }, verdict: { type: 'string', enum: ['aligned', 'tension', 'off-rubric'] }, why: { type: 'string' }, reframe: { type: 'string' } },
}
const CLINICAL_SCHEMA = {
  type: 'object', required: ['id', 'soundness', 'claims', 'riskClass'],
  properties: {
    id: { type: 'string' }, soundness: { type: 'string', enum: ['pass', 'concerns', 'veto'] },
    claims: { type: 'string', enum: ['none', 'substantiated', 'unsubstantiated'] },
    riskClass: { type: 'string', enum: ['safe', 'gated'] }, required_fixes: { type: 'array', items: { type: 'string' } },
  },
}

const APP = 'a longitudinal, parent-owned child-development "OS" (ages 0–12), live at arborprd-westeu.web.app; source at PPPPtherapy-/PPPPtherapy-/app'
const GATE = 'Mark riskClass:"gated" for anything touching child-safety/consent, billing/entitlements, image-gen or model cost, child-data schema, store submission, OR carrying any developmental/medical/effect-size claim, OR surfacing the product-philosophy adviser identity. Those never auto-build.'

// ── SENSE ──────────────────────────────────────────────────────────────────
phase('Sense')
log('Product Council — gathering the four streams (no preview, hang-proof)')

const sensors = [
  { id: 'arbor-advisor', stream: 'philosophy',
    task: `Propose product candidates from the WORTH-BUILDING rubric (competence/order/responsibility/truth/meaning). Read PRODUCT-BACKLOG.md, mesh/improvement/IMPROVEMENT-BACKLOG.md and the product CLAUDE.md. Surface ideas that raise competence/meaning AND reframes that convert any engagement-bait/off-rubric items already in flight into competence-building versions. NEVER surface the source thinker's identity — internal rubric only.` },
  { id: 'arbor-clinical-lead', stream: 'clinical',
    task: `Originate CLINICAL requirements — the things Arbor should build to be developmentally responsible and safe (correct preterm correction, non-alarmist red-flag UX, clear escalation/referral copy, age-appropriate targets). Read mesh/teams/advisory.md, the product CLAUDE.md safety rules, lib/milestoneData.ts/monitoring.ts. Cite CDC-2022/AAP/ASHA basis. Set touchesClinical:true and the claim field honestly.` },
  { id: 'arbor-marketing-lead', stream: 'demand',
    task: `Hand over the current FEATURE-REQUESTS the funnel owes product: competitor-gap features + demand-signal asks. Read mesh/marketing/MARKETING-BACKLOG.md (the "feature-requests handed to product" items) and BRAND-STRATEGY.md. Frame each as a product candidate on Arbor's moat (the parent-owned longitudinal record). Do not propose marketing/asset work here — product features only.` },
]

const sensed = await parallel(sensors.map(s => () =>
  agent(
    `You are sensing for the Arbor Product Council. Arbor is ${APP}. ${s.task} ` +
    `Return product CANDIDATES (not built code). For each: a stable id (prefix ${s.stream.toUpperCase().slice(0,3)}-), title, the owning pod (arbor-ai/avatar/practice/growth/memory/billing/safety/native/api/design), surface, a one-line rationale, and reach/impact/confidence/effort. ${GATE}`,
    { agentType: s.id, label: `sense:${s.stream}`, phase: 'Sense', effort: 'high', schema: CANDIDATES_SCHEMA }
  ).catch(() => ({ candidates: [] }))
))
const candidates = sensed.filter(Boolean).flatMap(r => (r.candidates || []))
log(`sensed ${candidates.length} candidates across philosophy/clinical/demand (CIL findings merged at write-time from IMPROVEMENT-BACKLOG.md)`)

// ── REVIEW ─────────────────────────────────────────────────────────────────
// Each candidate gets an advisor rubric score; clinical-touching ones get the binding gate.
phase('Review')
const reviewed = await pipeline(
  candidates,
  (c) => agent(
    `Score this Arbor product candidate on the worth-building rubric (aligned/tension/off-rubric) with a one-line why; if tension/off-rubric, give the competence-building reframe. Candidate:\n${JSON.stringify(c)}`,
    { agentType: 'arbor-advisor', label: `rubric:${c.id}`, phase: 'Review', schema: RUBRIC_SCHEMA }
  ).then(r => ({ ...c, rubric: r })),
  (c) => c.touchesClinical
    ? agent(
        `Run the BINDING clinical gate on this candidate — is it developmentally sound, and does it carry an unsubstantiated developmental/medical/effect-size claim? Cite CDC/AAP/ASHA. A veto or an unsubstantiated claim forces riskClass:"gated" and holds the item. Candidate:\n${JSON.stringify(c)}`,
        { agentType: 'arbor-clinical-lead', label: `clinical:${c.id}`, phase: 'Review', schema: CLINICAL_SCHEMA }
      ).then(v => ({ ...c, clinical: v, riskClass: (v && v.riskClass) || c.riskClass }))
    : ({ ...c, clinical: { soundness: 'n/a', claims: 'none' } })
)
const live = reviewed.filter(Boolean)
const buildReady = live.filter(c => c.riskClass === 'safe' && (!c.clinical || c.clinical.soundness !== 'veto'))
log(`reviewed ${live.length} candidates — ${buildReady.length} safe & build-ready, ${live.length - buildReady.length} gated/held`)

// ── SCORE + WRITE ──────────────────────────────────────────────────────────
phase('Score+Write')
const today = '2026-06-21'  // workflows can't read the clock; stamp + correct on write
await agent(
  `You are the Arbor Product Council scribe. Follow PAI/projects/arbor/mesh/PRODUCT-COUNCIL.md exactly. ` +
  `INPUTS: (1) these reviewed candidates from advisory/clinical/demand; (2) the top verified findings already in PAI/projects/arbor/mesh/improvement/IMPROVEMENT-BACKLOG.md (READ it and fold in the top few as stream:"cil"). ` +
  `STEPS: dedupe across streams (one root cause, not ten symptoms); score each priority = (reach×impact×confidence×strategic_fit)÷effort, where strategic_fit folds in the advisor rubric (aligned>tension>off-rubric) and Arbor's moat/retention; keep the top ~12. ` +
  `WRITE: APPEND a new "## Council Intake — ${today}" block to PAI/projects/arbor/PRODUCT-BACKLOG.md using the table format in PRODUCT-COUNCIL.md §5 (ID|Title|Stream|riskClass|Priority|Clinical|Advisor|Owner pod|Note). PRESERVE the entire existing file — append only, never rewrite the canonical body. ` +
  `Below the table write: (a) the 3-5 top SAFE build-ready items flagged for arbor-orchestrator's next wave; (b) an explicit "Gated — needs Guy" decision list (claim-bearing/safety/billing/cost items + any [FOUNDER] calls), each with the one decision needed. ` +
  `Finally append a one-line cycle entry to mesh/MEMORY.md AND /PAI/MEMORY.md: streams pulled, candidates written, top build-ready, gated decisions surfaced. Correct the date if the real date differs. ` +
  `Reviewed candidates:\n${JSON.stringify(live)}`,
  { agentType: 'arbor-evaluator', label: 'council:score+write', phase: 'Score+Write', effort: 'high' }
)

return { sensed: candidates.length, reviewed: live.length, buildReady: buildReady.length, gated: live.length - buildReady.length }
