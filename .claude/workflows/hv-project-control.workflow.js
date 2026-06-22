export const meta = {
  name: 'hv-project-control',
  description: 'HV development project-control roll-up: programme + cost + procurement + risk pods report on a live project, hv-execution synthesizes the weekly RAG status + gate review.',
  whenToUse: 'Run the weekly (or on-demand) status roll-up for an in-delivery HV development project: refresh cost (AFC vs baseline), programme (critical path), procurement, and risk, then produce the RAG Project Status Report + next-gate review.',
  phases: [
    { title: 'Refresh', detail: 'cost / programme / procurement / risk pods refresh their instrument' },
    { title: 'Synthesize', detail: 'hv-execution writes the weekly RAG status + gate review' },
  ],
}

// args: { project: '<asset/path>', week: '<YYYY-WW>', focus?: string }
const a = args || {}
const project = a.project || 'the active HV development project'
const week = a.week || 'current'
const base = `Project: ${project}. Read its charter + control artifacts under HV/06_Renovation/ and the doctrine /HV/mesh/PROJECT-MODEL.md. Ground every figure in a real artifact (quote, certificate, invoice) — no fabricated progress; flag gaps.`

// ── Phase 1: instruments refresh (parallel — independent) ─────────────────────
phase('Refresh')
const [cost, programme, procurement, risk] = await parallel([
  () => agent(`${base}\nRefresh COST CONTROL: budget vs committed vs actual vs CTC → AFC and AFC-vs-baseline (€ + %); contingency remaining; open variations; next drawdown + runway. Return the cost summary + the single cost headline.`,
    { label: 'cost', phase: 'Refresh', agentType: 'hv-cost-control' }),
  () => agent(`${base}\nRefresh PROGRAMME: milestone status, critical path, completion vs baseline, 4-week look-ahead, any slippage + its completion + carry-cost impact. Return the programme summary + the date most at risk.`,
    { label: 'programme', phase: 'Refresh', agentType: 'hv-programme' }),
  () => agent(`${base}\nRefresh PROCUREMENT: tender/contract status, payment milestones due, long-lead/RFI watch, any vendor non-performance on the critical path. Return the procurement summary + any flag.`,
    { label: 'procurement', phase: 'Refresh', agentType: 'hv-procurement' }),
  () => agent(`${base}\nRefresh the RISK REGISTER: re-score, surface the top-5 (score ≥12), any triggered risk needing action now. Return the top-5 + triggers.`,
    { label: 'risk', phase: 'Refresh', agentType: 'hv-execution' }),
])

// ── Phase 2: PM lead synthesizes the weekly status + gate review ───────────────
phase('Synthesize')
const report = await agent(
  `${base}\nYou are the project director. Write the WEEKLY PROJECT STATUS REPORT for week ${week} using the status-report template: RAG on Scope/Cost/Time/Quality/Risk, % complete, this-week/next-week, top-5 risks, decisions needed, escalations. ` +
  `Run the current gate's DoD check (go/hold to next gate). The escalation tripwire is AFC-vs-baseline eroding margin/refi pull-out — call it out if live.\n\n` +
  `COST:\n${cost}\n\nPROGRAMME:\n${programme}\n\nPROCUREMENT:\n${procurement}\n\nRISK:\n${risk}`,
  { label: 'status-report', phase: 'Synthesize', agentType: 'hv-execution' },
)

return { project, week, report,
  signals: { cost: cost?.slice?.(0, 200), programme: programme?.slice?.(0, 200) } }
