export const meta = {
  name: 'ros-improve',
  description: 'ROS Continuous Improvement Loop — audits ROS-the-company across lenses (freshness, management, reality, +domains/standard/tooling in deep mode), scores + adversarially verifies findings into CoS/ROS-BACKLOG.md, writes a State of the Company, applies safe fixes, and surfaces gated ones. Human ships gated. mode: "light" (weekly) | "deep" (monthly).',
  phases: [
    { title: 'Audit', detail: 'lens panel inspects the company in parallel' },
    { title: 'Synthesize', detail: 'score + verify + State of the Company → ROS-BACKLOG' },
    { title: 'Fix', detail: 'apply safe fixes on a branch; surface gated (deep mode)' },
  ],
}

const MODE = (args && args.mode) || 'light'

const FINDINGS_SCHEMA = {
  type: 'object', required: ['findings'],
  properties: { findings: { type: 'array', items: {
    type: 'object',
    required: ['id','lens','title','evidence','severity','impact','confidence','effort','ownerMesh','suggestedFix','riskClass'],
    properties: {
      id: { type: 'string' }, lens: { type: 'string' }, title: { type: 'string' },
      evidence: { type: 'string' }, severity: { type: 'integer', minimum: 1, maximum: 5 },
      impact: { type: 'integer', minimum: 1, maximum: 5 }, confidence: { type: 'number', minimum: 0, maximum: 1 },
      effort: { type: 'integer', minimum: 1, maximum: 5 }, ownerMesh: { type: 'string' },
      suggestedFix: { type: 'string' }, riskClass: { type: 'string', enum: ['safe','gated'] },
    },
  } } },
}

// Lenses. light = the cheap always-on checks; deep adds domain self-audits + standard + tooling.
const LIGHT = [
  { id: 'freshness', lens: 'freshness/reality', agent: 'ros-evaluator', effort: 'medium',
    ask: 'Audit ROS for (a) domain MEMORY git-freshness (run/read build-state.mjs — which domains are stale?), and (b) doc-vs-reality drift: compare 00_System/agent-framework/SCHEDULED-LOOPS.md to Hermes /home/guyru/.hermes/cron/jobs.json (only 2 live crons), and each mesh vs 00_System/notion_database_registry.md. File a finding per real gap.' },
  { id: 'mgmt', lens: 'management', agent: 'ros-conductor', effort: 'medium',
    ask: 'Audit management adherence: is the operating cadence running (CoS/mesh/MESH.md Operating Rhythm)? is the Notion cockpit fresh? are decisions-needed cleared, OKRs tracked (CoS/OKRs/)? per-principal (Guy/Joseph) coverage? File findings for what is NOT being managed.' },
]
const DEEP_EXTRA = [
  { id: 'tooling', lens: 'tooling/skills', agent: 'research-agent', effort: 'high',
    ask: 'Audit tooling & skills currency: are the right tools/skills wired+used per connectors.md + the Hermes skill catalog? what is missing, underused, or newly relevant in the ecosystem? File findings (acquisition = gated).' },
  { id: 'hv', lens: 'domain:HV', agent: 'hv-orchestrator', effort: 'medium', ask: 'Self-audit the HV mesh against its DoD + the Smart-Living scan state. What is stale, broken, or not running? File scored findings.' },
  { id: 'kk', lens: 'domain:KK', agent: 'kk-ops', effort: 'low', ask: 'Self-audit the KK mesh against its DoD. What is stale or unmanaged? File scored findings.' },
  { id: 'ea', lens: 'domain:EA', agent: 'ea-lead', effort: 'low', ask: 'Self-audit the EA mesh (CONTEXT freshness per client, confidentiality). File scored findings.' },
  { id: 'fin', lens: 'domain:FIN', agent: 'fin-admin', effort: 'low', ask: 'Self-audit the FIN mesh (obligations/deadlines tracked?). File scored findings.' },
]
const LENSES = MODE === 'deep' ? [...LIGHT, ...DEEP_EXTRA] : LIGHT

phase('Audit')
log(`ROS-CIL cycle · mode=${MODE} · ${LENSES.length} lenses`)
const panels = await parallel(LENSES.map(L => () =>
  agent(
    `${L.ask}\n\nReturn scored findings per the ROS-CIL (CRITICS schema): each with concrete evidence (a file, a stale date, a count, a doc-vs-reality mismatch), severity/impact/confidence/effort, ownerMesh, suggestedFix, and riskClass ("gated" for anything needing a Notion write, a live cron, or any external/send/spend/deploy action). Evidence or drop it.`,
    { agentType: L.agent, label: `audit:${L.lens}`, phase: 'Audit', effort: L.effort, schema: FINDINGS_SCHEMA }
  ).catch(() => ({ findings: [] }))
))
const all = panels.filter(Boolean).flatMap(p => (p.findings || []))
log(`audit returned ${all.length} findings`)

phase('Synthesize')
await agent(
  `Editor pass for the ROS-CIL. (1) Dedupe + score (severity×impact×confidence÷effort). (2) Adversarially verify each finding against the real file/state; drop the unsubstantiated; force riskClass:"gated" on anything Level 3+. (3) SYNTHESIZE: roll into themes, cap to top ~10 safe + top themes, and write a 4–6 line "State of the Company". (4) WRITE to CoS/ROS-BACKLOG.md (State-of-the-Company on top, then a dated ROS-CIL section: safe items, gated items, dropped) + record the cycle in /MEMORY.md or /CoS/MEMORY.md. Findings:\n${JSON.stringify(all)}`,
  { agentType: 'ros-evaluator', label: 'synthesize+write', phase: 'Synthesize', effort: 'high' }
)

if (MODE === 'light') return { mode: MODE, findings: all.length }

phase('Fix')
const fix = await agent(
  `ROS-CIL fix wave. From the verified safe items just written to CoS/ROS-BACKLOG.md, apply the top few riskClass:"safe" fixes (refresh stale domain memory, refresh the cockpit via build-state.mjs, fix doc-vs-reality drift, tighten a mesh) on branch claude/ros-cil. Do NOT do any gated action (no Notion writes, no live crons, no external/send/spend). Re-confirm each fix landed. Return what was fixed + the gated items needing Guy.`,
  { agentType: 'ros-evaluator', label: 'fix-wave', phase: 'Fix', effort: 'high' }
)
return { mode: MODE, findings: all.length, fix }
