export const meta = {
  name: 'arbor-cil-eval',
  description: 'Arbor CIL scheduled EVAL (no-args, runtime-safe). Runs the CHEAP regression panel (bugs · language/AI-voice · feedback · safety-cost) against the live app, adversarially verifies, and updates IMPROVEMENT-BACKLOG.md. Cheap + fast for the twice-daily cadence — the expensive deep lenses (ia/ux/capability/market) run in the twice-weekly BUILD task. No build wave, no merge, no deploy.',
  phases: [
    { title: 'Evaluate', detail: 'cheap regression critics inspect the app in parallel' },
    { title: 'Triage', detail: 'verify + write the scored backlog' },
  ],
}

// Cheap regression lenses only — deterministic, no args (sidesteps the args.mode passing bug).
const CHEAP = [
  { id: 'arbor-critic-bugs',     lens: 'bugs',     effort: 'low' },
  { id: 'arbor-critic-language', lens: 'language', effort: 'low' },
  { id: 'arbor-critic-feedback', lens: 'feedback', effort: 'medium' },
  { id: 'arbor-safety',          lens: 'safety-cost', effort: 'medium' },
]

const FINDING = {
  type: 'object',
  required: ['id', 'lens', 'title', 'surface', 'evidence', 'severity', 'userImpact', 'confidence', 'effort', 'ownerPod', 'suggestedFix', 'riskClass'],
  properties: {
    id: { type: 'string' }, lens: { type: 'string' }, title: { type: 'string' }, surface: { type: 'string' },
    evidence: { type: 'string' }, severity: { type: 'integer', minimum: 1, maximum: 5 },
    userImpact: { type: 'integer', minimum: 1, maximum: 5 }, confidence: { type: 'number', minimum: 0, maximum: 1 },
    effort: { type: 'integer', minimum: 1, maximum: 5 }, ownerPod: { type: 'string' },
    suggestedFix: { type: 'string' }, riskClass: { type: 'string', enum: ['safe', 'gated'] },
  },
}
const FINDINGS_SCHEMA = { type: 'object', required: ['findings'], properties: { findings: { type: 'array', items: FINDING } } }
const VERDICT_SCHEMA = {
  type: 'object', required: ['id', 'verified', 'reason'],
  properties: { id: { type: 'string' }, verified: { type: 'boolean' }, reason: { type: 'string' }, riskClass: { type: 'string', enum: ['safe', 'gated'] } },
}

phase('Evaluate')
log('CIL scheduled eval (cheap regression panel)')
const panels = await parallel(CHEAP.map(c => () =>
  agent(
    `Run your evaluation lens against the live Arbor app (PPPPtherapy-/PPPPtherapy-/app), scoped where practical to surfaces changed since the last cycle (git diff). ` +
    `Clear the CRITICS.md §0 bar (benchmark vs world-class, root-cause not nits); every finding carries concrete evidence (file:line, test output, quoted string, cited source). ` +
    `Mark anything touching child-safety, consent, billing, image-gen/model cost, or child-data as riskClass:"gated".`,
    { agentType: c.id, label: `eval:${c.lens}`, phase: 'Evaluate', effort: c.effort, schema: FINDINGS_SCHEMA }
  ).catch(() => ({ findings: [] }))
))
const allFindings = panels.filter(Boolean).flatMap(p => (p.findings || []))
log(`panel returned ${allFindings.length} raw findings`)

phase('Triage')
const verified = await pipeline(
  allFindings,
  (f) => agent(
    `Adversarially verify this Arbor finding is REAL and correctly scored — try to DISPROVE it (reproduce the bug / open the file/route / confirm the claim). ` +
    `Force riskClass:"gated" if it touches safety/consent/billing/cost/child-data. Finding:\n${JSON.stringify(f)}`,
    { agentType: 'arbor-evaluator', label: `verify:${f.id || f.lens}`, phase: 'Triage', schema: VERDICT_SCHEMA }
  ).then(v => ({ ...f, riskClass: (v && v.riskClass) || f.riskClass, verdict: v }))
)
const real = verified.filter(Boolean).filter(f => f.verdict && f.verdict.verified)
log(`${real.length}/${allFindings.length} findings verified`)

await agent(
  `Editor pass + MERGE into the existing backlog (CRITICS.md §6). READ PAI/projects/parenting-os-plugin/mesh/improvement/IMPROVEMENT-BACKLOG.md and PRESERVE prior findings still open. Dedupe vs existing + each other (keep highest score). Re-score the combined queue with (severity×userImpact×confidence)÷effort×4. Update the "State of the app" (note this is a CHEAP regression eval — deep lenses run weekly), roll nits into themes, cap to top ~12 safe + gated list. Mark any finding a prior build wave shipped as confirmed/regressed. WRITE the backlog (new cycle row on top, dated) + append a one-line cycle entry to mesh/MEMORY.md. Verified findings:\n${JSON.stringify(real)}`,
  { agentType: 'arbor-evaluator', label: 'synthesize+write', phase: 'Triage', effort: 'high' }
)

return { mode: 'eval-cheap', raw: allFindings.length, verified: real.length }
