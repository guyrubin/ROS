import { useState } from 'react'
import { useStore } from '../../state/store'
import type { ActionQueueItem, Client } from '../../state/types'

export function EAClientCockpit({ fullWidth }: { fullWidth?: boolean }) {
  const { state, enqueueAction } = useStore()
  const clients = state?.clients ?? []
  const [activeId, setActiveId] = useState(clients[0]?.id ?? '')
  const client = clients.find((c) => c.id === activeId) ?? clients[0]

  if (!client) {
    return (
      <div className="card">
        <div className="head">EA Client Cockpit</div>
        <div className="empty-state"><div className="icon">🏗️</div><div>No EA clients in state.json</div></div>
      </div>
    )
  }

  const done = client.milestones.filter((m) => m.d).length
  const total = client.milestones.length
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <div className="card" style={{ borderLeft: '3px solid var(--ea)' }}>
      <div className="head">
        <span>EA Client Cockpit</span>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginLeft: 16 }}>
          {clients.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              style={{
                padding: '3px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                background: activeId === c.id ? 'rgba(255,107,107,0.15)' : 'transparent',
                border: `1px solid ${activeId === c.id ? 'var(--ea)' : 'var(--line)'}`,
                color: activeId === c.id ? 'var(--ea)' : 'var(--muted)', cursor: 'pointer',
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <ClientCard client={client} pct={pct} done={done} total={total} onAction={enqueueAction} />
    </div>
  )
}

function ClientCard({ client, pct, done, total, onAction }: {
  client: Client
  pct: number
  done: number
  total: number
  onAction: (item: Omit<ActionQueueItem, 'id' | 'ts' | 'status'>) => void
}) {
  return (
    <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
      {/* Left */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Role + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className={`rag-dot rag-${client.status}`} style={{ width: 10, height: 10 }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{client.name}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{client.role}</span>
          <span className="badge" style={{ background: 'var(--panel2)', color: 'var(--faint)', border: '1px solid var(--line)', marginLeft: 'auto' }}>
            {client.relationship}
          </span>
        </div>

        {/* Phase + next decision */}
        <div className="card2" style={{ padding: '10px 14px' }}>
          <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 3 }}>Phase</div>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{client.phase}</div>
          <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 8, marginBottom: 3 }}>Next decision</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{client.nextDecision}</div>
        </div>

        {/* Domain focus */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 4 }}>Domain focus</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{client.domainFocus}</div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['HLD', 'ADR', 'Architecture Review', 'Kickoff'].map((action) => (
            <button
              key={action}
              className="btn"
              style={{ fontSize: 11 }}
              onClick={() => onAction({ verb: `skill.${action.toLowerCase().replace(/\s+/g, '-')}`, args: { client: client.id }, domain: 'EA', safety: 2, source: 'dashboard' })}
            >
              {action}
            </button>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
          {client.rosFolder && (
            <a href={`obsidian://open?vault=ROS&file=${client.rosFolder}`} style={{ color: 'var(--ea)', textDecoration: 'none' }}>
              → Obsidian
            </a>
          )}
          {client.drive && (
            <a href={client.drive} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)', textDecoration: 'none' }}>
              → Drive
            </a>
          )}
        </div>
      </div>

      {/* Right — milestones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Milestones</span>
          <span style={{ fontSize: 11, color: 'var(--ea)', fontWeight: 600 }}>{done}/{total} · {pct}%</span>
        </div>
        <div style={{ height: 4, background: 'var(--line)', borderRadius: 2, marginBottom: 6 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--ea)', borderRadius: 2 }} />
        </div>
        {client.milestones.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 4, border: `2px solid ${m.d ? 'var(--ea)' : 'var(--line2)'}`,
              background: m.d ? 'var(--ea)' : 'transparent', flexShrink: 0, marginTop: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {m.d && <span style={{ color: '#000', fontSize: 9, fontWeight: 700 }}>✓</span>}
            </div>
            <span style={{ color: m.d ? 'var(--faint)' : 'var(--muted)', textDecoration: m.d ? 'line-through' : 'none', lineHeight: 1.4 }}>
              {m.t}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
