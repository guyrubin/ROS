import { useStore } from '../../state/store'

export function FileStats() {
  const { state } = useStore()
  const fs = state?.meta?.fileStats

  const STATS = [
    { label: 'Markdown files', value: fs?.totalMd ?? 209, note: '>200 → hygiene run' },
    { label: 'Recent writes (48h)', value: fs?.recentWrites48h ?? '—', note: '' },
    { label: 'Arbor worktrees', value: fs?.worktreeCount ?? 19, note: '>10 → prune stale' },
  ]

  return (
    <div className="card">
      <div className="head">
        <span>ROS File Stats</span>
        {!fs && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--faint)' }}>static snapshot</span>}
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', gap: 16 }}>
        {STATS.map((s) => (
          <div key={s.label} className="card2" style={{ flex: 1, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{String(s.value)}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
            {s.note && <div style={{ fontSize: 9, color: 'var(--faint)', marginTop: 2 }}>{s.note}</div>}
          </div>
        ))}
      </div>
      <div style={{ padding: '0 16px 14px', fontSize: 11, color: 'var(--faint)' }}>
        Updated nightly by Hermes via <code style={{ fontFamily: 'var(--mono)', background: 'var(--panel2)', padding: '1px 4px', borderRadius: 3 }}>nightly-ros-state-refresh</code>
      </div>
    </div>
  )
}
