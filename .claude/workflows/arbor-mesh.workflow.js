export const meta = {
  name: 'arbor-mesh',
  description: 'On-demand dispatcher for the Arbor Agent Mesh: plan a wave from the backlog, fan out framed items to the owning domain pods, green-gate each through DevSecOps, and roll up status for PAI/CoS.',
  whenToUse: 'Run a coordinated multi-domain build wave, improvement pass, hardening sweep, or marketing campaign on Arbor. On-demand only — never scheduled or autonomous (see mesh/CHARTER.md §3.6).',
  phases: [
    { title: 'Plan', detail: 'arbor-orchestrator plans a wave: ready items, owner pod, frame, hotspot order' },
    { title: 'Build', detail: 'each framed item runs its owning pod through the dev loop (isolated worktrees)' },
    { title: 'Gate', detail: 'DevSecOps composite ship-gate per item; vetoes bounce back' },
    { title: 'Roll-up', detail: 'aggregate shipped / blocked / discovered; report to PAI/CoS' },
  ],
}

// args: { mode: 'wave'|'domain'|'hardening'|'campaign', target?: string, max?: number }
const mode = (args && args.mode) || 'wave'
const target = args && args.target
const MAX = (args && args.max) || 6

const FRAME_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          pod: { type: 'string', description: 'owning subagent id, e.g. arbor-design' },
          problem: { type: 'string' },
          acceptance: { type: 'string' },
          files: { type: 'array', items: { type: 'string' } },
          hotspot: { type: 'boolean' },
          order: { type: 'number', description: 'serial order if hotspot-locked, else 0' },
          safetyFlag: { type: 'boolean' },
        },
        required: ['id', 'pod', 'problem', 'acceptance', 'hotspot', 'order'],
      },
    },
  },
  required: ['items'],
}

const RESULT_SCHEMA = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['shipped', 'blocked', 'escalated'] },
    summary: { type: 'string' },
    gate: { type: 'string', description: 'gate output / veto reason' },
    discovered: { type: 'array', items: { type: 'string' } },
  },
  required: ['status', 'summary'],
}

// 1) PLAN — the orchestrator turns backlog + priorities into a framed, conflict-safe wave.
phase('Plan')
const planPrompt = `You are arbor-orchestrator. Mode=${mode}${target ? `, target=${target}` : ''}.
Read mesh/ORCHESTRATOR.md, mesh/ROSTER.md, the EXECUTION-BACKLOG and the CONFLICT-MAP.
Produce up to ${MAX} ready, conflict-safe framed items for this run. For each: id, owning pod (subagent id),
problem, testable acceptance, files, whether it touches a hotspot file, its serial order if so (0 if free),
and whether it needs an early safety flag. Respect the index.css chain m4→m2→m1→m5→m7→p3.`
const plan = await agent(planPrompt, { agentType: 'arbor-orchestrator', phase: 'Plan', schema: FRAME_SCHEMA })
const items = (plan && plan.items) || []
log(`Planned ${items.length} item(s) for mode=${mode}`)

// Order hotspot-locked items first by their mandated order so the pipeline respects the lock chain.
items.sort((a, b) => (a.order || 0) - (b.order || 0))

// 2+3) BUILD then GATE — each item flows through its owning pod, then the DevSecOps composite gate.
// pipeline() = no barrier: a free item can be gating while the next hotspot item is still building.
const outcomes = await pipeline(
  items,
  (item) =>
    agent(
      `You are ${item.pod}. Run the dev loop on this frame and return a verified delta.\n` +
        `Problem: ${item.problem}\nAcceptance: ${item.acceptance}\n` +
        `Files: ${(item.files || []).join(', ')}\n` +
        (item.safetyFlag ? 'SAFETY-FLAGGED: involve arbor-safety before ship.\n' : '') +
        `Build in an isolated worktree if concurrent. VERIFY with the green-gate; do not claim done without proof.`,
      { agentType: item.pod, label: `build:${item.id}`, phase: 'Build', schema: RESULT_SCHEMA },
    ),
  (built, item) =>
    agent(
      `You are arbor-devsecops-lead. Run the composite ship-gate on item ${item.id} (pod ${item.pod}).\n` +
        `Pod self-report: ${built ? built.summary : 'NO DELTA (pod failed/escalated)'}\n` +
        `Run lint+test+check:framework+eval:safety and specialist sign-off. Return PASS (status=shipped) or a veto (status=blocked) with the exact reason. Do NOT deploy to prod (Level 3 — needs human confirm).`,
      { agentType: 'arbor-devsecops-lead', label: `gate:${item.id}`, phase: 'Gate', schema: RESULT_SCHEMA },
    ).then((gate) => ({ item, built, gate })),
)

// 4) ROLL-UP — aggregate for PAI/CoS. No prod deploy happens here (Level 3 confirm required).
phase('Roll-up')
const clean = outcomes.filter(Boolean)
const shipped = clean.filter((o) => o.gate && o.gate.status === 'shipped')
const blocked = clean.filter((o) => !o.gate || o.gate.status !== 'shipped')
const discovered = clean.flatMap((o) => (o.gate && o.gate.discovered) || [])

return {
  mode,
  target: target || null,
  planned: items.length,
  shipped: shipped.map((o) => o.item.id),
  blocked: blocked.map((o) => ({ id: o.item.id, reason: (o.gate && o.gate.gate) || 'pod failed/escalated' })),
  discovered,
  note: 'No prod deploy performed — deploy-to-prod is Level 3 and requires human confirmation via the orchestrator.',
}
