import { useStore } from '../../state/store'

export function EADeliveryTrack() {
  const { state } = useStore()
  const clients = state?.clients ?? []

  return (
    <div className="card">
      <div className="head">
        <span>EA Delivery Track</span>
        <span style={{ color: 'var(--ea)', marginLeft: 'auto', fontSize: 10 }}>{clients.filter((c) => c.active).length} active</span>
      </div>
      <div style={{ padding: '8px 0' }}>
        {clients.map((c) => {
          const done = c.milestones.filter((m) => m.d).length
          const total = c.milestones.length
          const pct = total ? Math.round((done / total) * 100) : 0
          return (
            <div key={c.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div className={`rag-dot rag-${c.status}`} />
                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{c.name}</span>
                <span style={{ fontSize: 10, color: 'var(--faint)', marginLeft: 'auto' }}>{c.phase}</span>
              </div>
              {/* Progress */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ flex: 1, height: 4, background: 'var(--line)', borderRadius: 2 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--ea)', borderRadius: 2, transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ fontSize: 10, color: 'var(--ea)', fontWeight: 600 }}>{done}/{total}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                ▶ {c.nextDecision}
              </div>
            </div>
          )
        })}
        {clients.length === 0 && (
          <div className="empty-state" style={{ padding: 20 }}>
            <div className="icon">🏗️</div>
            <div>No active EA clients</div>
          </div>
        )}
      </div>
    </div>
  )
}
