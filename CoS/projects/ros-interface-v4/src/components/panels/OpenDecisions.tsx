import { useStore } from '../../state/store'

export function OpenDecisions() {
  const { state } = useStore()
  const blocked = state?.tasks?.back?.filter((t) => t.t.toLowerCase().includes('decision') || t.t.toLowerCase().includes('decide')) ?? []

  return (
    <div className="card">
      <div className="head">Open Decisions</div>
      <div className="cta-amber" style={{ margin: '12px 16px', fontSize: 12 }}>
        <span>⚠</span>
        <span>No decisions captured in CoS/MEMORY.md — run <code style={{ fontFamily: 'var(--mono)', background: 'rgba(0,0,0,0.2)', padding: '1px 5px', borderRadius: 4 }}>/cos weekly-review</code> to populate</span>
      </div>
      {blocked.length > 0 && (
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>From task list</div>
          {blocked.map((t, i) => (
            <div key={i} style={{ fontSize: 12, color: 'var(--muted)', padding: '4px 0', display: 'flex', gap: 8 }}>
              <span style={{ color: 'var(--faint)' }}>◈</span>
              {t.t}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
