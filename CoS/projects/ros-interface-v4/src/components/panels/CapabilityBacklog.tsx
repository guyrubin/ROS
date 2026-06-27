const BACKLOG = [
  { p: 'P0', cap: 'Shared capability optimization',            cur: 1, tgt: 3, owner: 'CoS',         next: 'Done: runbook + quality gates', done: true },
  { p: 'P1', cap: 'PAI memory compression',                   cur: 2, tgt: 3, owner: 'PAI',         next: 'Audit PAI/MEMORY.md; move stale to archive.md' },
  { p: 'P1', cap: 'ROS capability backlog in operations layer',cur: 1, tgt: 3, owner: 'CoS/KK',      next: 'Create Notion backlog rows for recurring upgrades' },
  { p: 'P2', cap: 'Domain voice coverage',                    cur: 1, tgt: 2, owner: 'CoS+domains', next: 'Add voice.md where external writing needs tone' },
  { p: 'P2', cap: 'Capability telemetry',                     cur: 0, tgt: 4, owner: 'CoS+runtimes',next: 'Track time saved, failure mode for frequent workflows' },
  { p: 'P3', cap: 'Delegated safe automations',               cur: 2, tgt: 5, owner: 'CoS+Hermes',  next: 'Promote only reversible, well-gated routines' },
]

const P_COLOR: Record<string, string> = { P0: 'var(--red)', P1: 'var(--amber)', P2: 'var(--blue)', P3: 'var(--faint)' }

export function CapabilityBacklog() {
  return (
    <div className="card">
      <div className="head">
        <span>Capability Backlog</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--faint)' }}>from 00_System/capability-optimization.md</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              {['P', 'Capability', 'Level', 'Owner', 'Next action'].map((h) => (
                <th key={h} style={{ padding: '6px 12px', textAlign: 'left', color: 'var(--faint)', fontWeight: 600, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BACKLOG.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--line)', opacity: row.done ? 0.45 : 1 }}>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: P_COLOR[row.p] }}>
                    {row.p}
                  </span>
                </td>
                <td style={{ padding: '8px 12px', color: 'var(--ink)', fontWeight: 500 }}>
                  {row.cap}
                  {row.done && <span style={{ color: 'var(--green)', marginLeft: 6, fontSize: 10 }}>✓</span>}
                </td>
                <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                  <span style={{ color: 'var(--faint)' }}>{row.cur}</span>
                  <span style={{ color: 'var(--line2)', margin: '0 4px' }}>→</span>
                  <span style={{ color: 'var(--gold)' }}>{row.tgt}</span>
                </td>
                <td style={{ padding: '8px 12px', color: 'var(--muted)' }}>{row.owner}</td>
                <td style={{ padding: '8px 12px', color: 'var(--faint)', maxWidth: 240 }}>{row.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
