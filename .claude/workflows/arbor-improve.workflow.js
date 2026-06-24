export const meta = {
  name: 'arbor-improve',
  description: 'Arbor Continuous Improvement Loop — a critic panel evaluates the live app, scores + adversarially verifies findings into the backlog, then (weekly build mode) the orchestrator builds the top verified safe items to green on a branch and the critics re-confirm the fixes. Human approves merge+deploy. mode: "eval" (nightly) | "build" (weekly).',
  phases: [
    { title: 'Evaluate', detail: 'critic panel inspects the app in parallel' },
    { title: 'Triage', detail: 'dedupe + score + adversarially verify; write the scored backlog' },
    { title: 'Build', detail: 'orchestrator builds top verified safe items to green on a branch (build mode only)' },
    { title: 'Confirm', detail: 're-evaluate changed surfaces + roll-up for human approval' },
  ],
}

// ── config ────────────────────────────────────────────────────────────────
const MODE = (args && args.mode) || 'eval'   // 'eval' (nightly) | 'build' (weekly)

// Critic lenses, tiered for cost. CHEAP run every night; DEEP rotate nightly / run full weekly.
const CHEAP = [
  { id: 'arbor-critic-bugs',     lens: 'bugs',     effort: 'low' },
  { id: 'arbor-critic-language', lens: 'language', effort: 'low' },
  { id: 'arbor-critic-feedback', lens: 'feedback', effort: 'medium' },
]
const DEEP = [
  { id: 'arbor-critic-ia',         lens: 'ia',         effort: 'high' }, // runs the app, sees rendered UI
  { id: 'arbor-critic-ux',         lens: 'ux',         effort: 'high' }, // visual/interaction craft
  { id: 'arbor-critic-capability', lens: 'capability', effort: 'high' }, // SMART feature × market
  { id: 'arbor-critic-market',     lens: 'market',     effort: 'high' },
]
const AUDIT = [
  { id: 'arbor-safety', lens: 'safety-cost', effort: 'medium' }, // DevSecOps pod in audit mode
]

// build (weekly) = full deep panel; eval (nightly) = cheap + audit + ONE rotating deep lens (cron passes args.focus)
const FOCUS = (args && args.focus) || null // e.g. 'arbor-critic-ux' — rotate nightly: ia → ux → capability → market
const CRITICS = (MODE === 'build')
  ? [...CHEAP, ...DEEP, ...AUDIT]
  : [...CHEAP, ...AUDIT, ...DEEP.filter(d => d.id === FOCUS)]

// ── schemas (structured output the model is forced to return) ───────────────
const FINDING = {
  type: 'object',
  required: ['id', 'lens', 'title', 'surface', 'evidence', 'severity', 'userImpact', 'confidence', 'effort', 'ownerPod', 'suggestedFix', 'riskClass'],
  properties: {
    id: { type: 'string' },
    lens: { type: 'string' },
    title: { type: 'string' },
    surface: { type: 'string' },
    evidence: { type: 'string' },
    severity: { type: 'integer', minimum: 1, maximum: 5 },
    userImpact: { type: 'integer', minimum: 1, maximum: 5 },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    effort: { type: 'integer', minimum: 1, maximum: 5 },
    ownerPod: { type: 'string' },
    suggestedFix: { type: 'string' },
    riskClass: { type: 'string', enum: ['safe', 'gated'] },
  },
}
const FINDINGS_SCHEMA = {
  type: 'object',
  required: ['findings'],
  properties: { findings: { type: 'array', items: FINDING } },
}
const VERDICT_SCHEMA = {
  type: 'object',
  required: ['id', 'verified', 'reason'],
  properties: {
    id: { type: 'string' },
    verified: { type: 'boolean' },
    reason: { type: 'string' },
    riskClass: { type: 'string', enum: ['safe', 'gated'] },
  },
}

// ── EVALUATE ────────────────────────────────────────────────────────────────
phase('Evaluate')
log(`CIL cycle starting · mode=${MODE}`)
const panels = await parallel(CRITICS.map(c => () =>
  agent(
    `Run your evaluation lens against the live Arbor app (PPPPtherapy-/PPPPtherapy-/app)` +
    `${MODE === 'eval' ? ', scoped where practical to surfaces changed since the last cycle (git diff)' : ' — full deep pass'}. ` +
    `Visual lenses (ia, ux): START THE PREVIEW and judge the RENDERED screen (screenshots, mobile+desktop, EN+HE/RTL) — do not infer UI quality from source. ` +
    `Clear the CRITICS.md §0 bar (benchmark vs world-class, root-cause not nits); every finding carries concrete evidence (file:line, test output, quoted string, screenshot observation, or cited source). ` +
    `Mark anything touching child-safety, consent, billing, image-gen/model cost, or child-data as riskClass:"gated".`,
    { agentType: c.id, label: `eval:${c.lens}`, phase: 'Evaluate', effort: c.effort, schema: FINDINGS_SCHEMA }
  ).catch(() => ({ findings: [] }))
))
const allFindings = panels.filter(Boolean).flatMap(p => (p.findings || []))
log(`panel returned ${allFindings.length} raw findings`)

// ── TRIAGE + VERIFY ──────────────────────────────────────────────────────────
phase('Triage')
const verified = await pipeline(
  allFindings,
  (f) => agent(
    `Adversarially verify this Arbor finding is REAL and correctly scored — try to DISPROVE it (reproduce the bug / open the file/route / confirm the competitor claim against a source). ` +
    `Force riskClass:"gated" if it touches safety/consent/billing/cost/child-data. Finding:\n${JSON.stringify(f)}`,
    { agentType: 'arbor-evaluator', label: `verify:${f.id || f.lens}`, phase: 'Triage', schema: VERDICT_SCHEMA }
  ).then(v => ({ ...f, riskClass: (v && v.riskClass) || f.riskClass, verdict: v }))
)
const real = verified.filter(Boolean).filter(f => f.verdict && f.verdict.verified)
log(`${real.length}/${allFindings.length} findings verified`)

await agent(
  `Editor pass + write (CRITICS.md §6). (1) Dedupe verified findings (merge same surface+fix, keep highest). (2) Apply the feedback lens's usage weighting (boost high-traffic/high-pain surfaces). (3) SYNTHESIZE: roll symptom nits into THEMES (name the root cause), fuse capability×market×feedback into SMART feature theses, cap to the top ~10 safe items + top 3 themes + 1 feature thesis, and write a 4–6 line "State of the app". (4) WRITE to ` +
  `PAI/projects/arbor/mesh/improvement/IMPROVEMENT-BACKLOG.md (State-of-the-app on top, then Themes, scored Open items, "Gated — needs Guy", "Dropped") + a cycle-log row, and record the cycle in mesh/MEMORY.md. Verified findings:\n${JSON.stringify(real)}`,
  { agentType: 'arbor-evaluator', label: 'synthesize+write', phase: 'Triage', effort: 'high' }
)

if (MODE === 'eval') {
  return { mode: MODE, raw: allFindings.length, verified: real.length }
}

// ── BUILD (weekly) ───────────────────────────────────────────────────────────
phase('Build')
const buildReport = await agent(
  `Weekly CIL build wave. Read mesh/improvement/IMPROVEMENT-BACKLOG.md. Select the top verified items with riskClass:"safe" (SKIP every "gated" item — those wait for Guy), respecting the CONFLICT-MAP edit order and the index.css serial chain. ` +
  `Build each to green in the .arbor-build worktree on branch claude/cil-week, dispatching the owning pods. Run the full green-gate (lint + test + check:framework + eval:safety) + DevSecOps. ` +
  `Do NOT merge to main and do NOT deploy — stop at a green branch. Return: items built, gate results, branch name, and the explicit approve-to-ship ask for Guy.`,
  { agentType: 'arbor-orchestrator', label: 'build-wave', phase: 'Build' }
)

// ── CONFIRM ──────────────────────────────────────────────────────────────────
phase('Confirm')
const confirm = await agent(
  `Re-evaluate ONLY the surfaces changed in this build wave to confirm each addressed finding is actually resolved and nothing regressed (regression guard). ` +
  `Mark each finding confirmed/not in IMPROVEMENT-BACKLOG.md and update mesh/MEMORY.md. Build report:\n${buildReport}`,
  { agentType: 'arbor-evaluator', label: 'reconfirm', phase: 'Confirm' }
)

return { mode: MODE, raw: allFindings.length, verified: real.length, build: buildReport, confirm }
