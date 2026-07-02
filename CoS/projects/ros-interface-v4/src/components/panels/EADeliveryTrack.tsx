import { useStore } from '../../state/store'
import type { Client } from '../../state/types'

const PHASE_COLOR: Record<string, string> = {
  done: 'var(--green)', active: 'var(--ea)', next: 'var(--blue)', later: 'var(--line2)',
}
const DELIV_COLOR: Record<string, string> = {
  done: 'var(--green)', active: 'var(--amber)', blocked: 'var(--red)', open: 'var(--faint)',
}

export function EADeliveryTrack() {
  const { state } = useStore()
  const clients = (state?.clients ?? []).filter((c) => c.active)

  return (
    <div className="card">
      <div className="head">
        <span>EA Delivery Track</span>
        <span style={{ color: 'var(--ea)', marginLeft: 'auto', fontSize: 10 }}>{clients.length} active</span>
      </div>
      <div style={{ padding: '8px 0' }}>
        {clients.map((c) => <ClientRow key={c.id} c={c} />)}
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

function ClientRow({ c }: { c: Client }) {
  const done = c.milestones.filter((m) => m.d).length
  const total = c.milestones.length
  const pct = total ? Math.round((done / total) * 100) : 0
  const currentPhase = c.roadmap?.find((p) => p.status === 'active') ?? c.roadmap?.find((p) => p.status === 'next')
  const backDone = c.backlog?.reduce((a, w) => a + w.done, 0) ?? 0
  const backTotal = c.backlog?.reduce((a, w) => a + w.total, 0) ?? 0
  const delivDone = c.deliverables?.filter((d) => d.status === 'done').length ?? 0

  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div className={`rag-dot rag-${c.status}`} />
        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{c.name}</span>
        {currentPhase && (
          <span className="badge" style={{ background: 'rgba(255,107,107,0.12)', color: 'var(--ea)', border: '1px solid var(--line)' }}>
            {currentPhase.id} · {currentPhase.title}
          </span>
        )}
        <span style={{ fontSize: 10, color: 'var(--faint)', marginLeft: 'auto' }}>{c.phase}</span>
      </div>

      {/* Roadmap phase strip */}
      {c.roadmap?.length ? (
        <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
          {c.roadmap.map((p) => (
            <div key={p.id} title={`${p.id} · ${p.title} (${p.status})`} style={{ flex: 1, height: 5, borderRadius: 2, background: PHASE_COLOR[p.status] ?? 'var(--line2)' }} />
          ))}
        </div>
      ) : null}

      {/* Deliverables + backlog mini-summary */}
      {(c.deliverables?.length || c.backlog?.length) ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8, flexWrap: 'wrap' }}>
          {c.deliverables?.length ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, color: 'var(--faint)' }}>Deliv {delivDone}/{c.deliverables.length}</span>
              <div style={{ display: 'flex', gap: 2 }}>
                {c.deliverables.map((d) => (
                  <span key={d.id} title={`${d.id} · ${d.title} (${d.status})`} style={{ width: 6, height: 6, borderRadius: '50%', background: DELIV_COLOR[d.status] ?? 'var(--faint)' }} />
                ))}
              </div>
            </div>
          ) : null}
          {c.backlog?.length ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 120 }}>
              <span style={{ fontSize: 10, color: 'var(--faint)' }}>Backlog {backDone}/{backTotal}</span>
              <div style={{ flex: 1, height: 4, background: 'var(--line)', borderRadius: 2 }}>
                <div style={{ width: `${backTotal ? (backDone / backTotal) * 100 : 0}%`, height: '100%', background: 'var(--ea)', borderRadius: 2 }} />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Milestones progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: 'var(--faint)' }}>Milestones</span>
        <div style={{ flex: 1, height: 4, background: 'var(--line)', borderRadius: 2 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--ea)', borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>
        <span style={{ fontSize: 10, color: 'var(--ea)', fontWeight: 600 }}>{done}/{total}</span>
      </div>

      <div style={{ fontSize: 11, color: 'var(--muted)' }}>▶ {c.nextDecision}</div>
    </div>
  )
}
