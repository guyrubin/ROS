import { useStore } from '../../state/store'
import { SAFETY_LABELS, SAFETY_COLORS } from '../../lib/safetyLevel'
import { DOMAIN_COLORS } from '../../design/domain-colors'
import type { ActionQueueItem, SafetyLevel } from '../../state/types'
import { copyQueueToClipboard } from '../../lib/stateIO'

export function ResolveQueue() {
  const { state, confirmAction, rejectAction } = useStore()
  const pending = state?.actionQueue?.filter((a) => a.status === 'pending') ?? []
  const confirmed = state?.actionQueue?.filter((a) => a.status === 'done').slice(-3) ?? []

  return (
    <div className="card" style={{ minHeight: 200 }}>
      <div className="head">
        <span>Resolve Queue</span>
        {pending.length > 0 && (
          <span className="badge" style={{ background: 'rgba(255,107,107,0.15)', color: 'var(--red)', border: '1px solid rgba(255,107,107,0.3)', marginLeft: 'auto' }}>
            {pending.length} pending
          </span>
        )}
        {pending.length > 0 && (
          <button className="btn" onClick={() => copyQueueToClipboard(pending)} style={{ fontSize: 10, padding: '2px 8px', marginLeft: 8 }}>
            Copy
          </button>
        )}
      </div>

      {pending.length === 0 ? (
        <div className="empty-state">
          <div className="icon">✅</div>
          <div style={{ color: 'var(--green)' }}>Queue clear</div>
          <div style={{ color: 'var(--faint)', fontSize: 11 }}>No actions pending confirmation</div>
        </div>
      ) : (
        <div style={{ padding: '8px 0' }}>
          {[...pending].sort((a, b) => b.safety - a.safety).map((item) => (
            <QueueItem key={item.id} item={item} onConfirm={confirmAction} onReject={rejectAction} />
          ))}
        </div>
      )}

      {/* Recent confirmed */}
      {confirmed.length > 0 && (
        <div style={{ borderTop: '1px solid var(--line)', padding: '8px 16px' }}>
          <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent</div>
          {confirmed.map((item) => (
            <div key={item.id} style={{ fontSize: 11, color: 'var(--faint)', padding: '3px 0' }}>
              ✓ {item.verb}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function QueueItem({ item, onConfirm, onReject }: {
  item: ActionQueueItem
  onConfirm: (id: string) => void
  onReject: (id: string) => void
}) {
  const safety = item.safety as SafetyLevel
  const domainColor = item.domain ? (DOMAIN_COLORS[item.domain] ?? 'var(--muted)') : 'var(--muted)'
  const safetyColor = SAFETY_COLORS[safety]
  const needsConfirm = safety >= 3

  return (
    <div style={{
      padding: '10px 16px',
      borderBottom: '1px solid var(--line)',
      borderLeft: `3px solid ${safetyColor}`,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="badge" style={{ background: `${safetyColor}22`, color: safetyColor, border: `1px solid ${safetyColor}44`, fontSize: 9 }}>
          S{safety} {SAFETY_LABELS[safety]}
        </span>
        {item.domain && (
          <span style={{ fontSize: 10, color: domainColor, fontWeight: 600 }}>{item.domain}</span>
        )}
        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{item.verb}</span>
      </div>
      {Object.keys(item.args).length > 0 && (
        <code style={{ fontSize: 10, color: 'var(--faint)', fontFamily: 'var(--mono)', background: 'var(--panel2)', padding: '3px 6px', borderRadius: 4 }}>
          {JSON.stringify(item.args).slice(0, 80)}
        </code>
      )}
      {needsConfirm && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => onReject(item.id)} style={{ fontSize: 11, padding: '3px 10px' }}>✕</button>
          <button className="btn btn-gold" onClick={() => onConfirm(item.id)} style={{ fontSize: 11, padding: '3px 14px' }}>✓ Confirm</button>
        </div>
      )}
    </div>
  )
}
