import { useStore } from '../../state/store'
import { DOMAIN_COLORS } from '../../design/domain-colors'

export function ActiveDeliverables() {
  const { state } = useStore()
  const tasks = state?.tasks?.back ?? []
  const eaTasks = tasks.filter((t) => t.domain === 'EA' || t.domain === 'PAI')

  return (
    <div className="card">
      <div className="head">Active Deliverables</div>
      <div style={{ padding: '4px 0' }}>
        {eaTasks.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <div>No EA/PAI deliverables in back-seat tasks</div>
          </div>
        ) : eaTasks.map((t, i) => {
          const color = DOMAIN_COLORS[t.domain ?? ''] ?? 'var(--faint)'
          return (
            <div key={i} style={{
              padding: '9px 16px', borderBottom: '1px solid var(--line)',
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <div style={{ width: 3, height: 36, background: color, borderRadius: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.4 }}>{t.t}</div>
                {t.domain && <span style={{ fontSize: 10, color, fontWeight: 600 }}>{t.domain}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
