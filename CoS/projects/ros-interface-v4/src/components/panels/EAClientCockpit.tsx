import { useState } from 'react'
import { useStore } from '../../state/store'
import { obsLink } from '../../lib/stateIO'
import type {
  ActionQueueItem, Client, RoadmapPhase, Deliverable, BacklogWave, StructureNode,
} from '../../state/types'

const PHASE_COLOR: Record<string, string> = {
  done: 'var(--green)', active: 'var(--ea)', next: 'var(--blue)', later: 'var(--faint)',
}
const DELIV_COLOR: Record<string, string> = {
  done: 'var(--green)', active: 'var(--amber)', blocked: 'var(--red)', open: 'var(--faint)',
}

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

  return (
    <div className="card" style={{ borderLeft: '3px solid var(--ea)', width: fullWidth ? '100%' : undefined }}>
      <div className="head">
        <span>EA Client Cockpit</span>
        <div style={{ display: 'flex', gap: 4, marginLeft: 16, flexWrap: 'wrap' }}>
          {clients.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              title={c.active ? 'Active' : 'Lapsed lead'}
              style={{
                padding: '3px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
                background: activeId === c.id ? 'rgba(255,107,107,0.15)' : 'transparent',
                border: `1px solid ${activeId === c.id ? 'var(--ea)' : 'var(--line)'}`,
                color: activeId === c.id ? 'var(--ea)' : c.active ? 'var(--muted)' : 'var(--faint)',
                opacity: c.active ? 1 : 0.55, cursor: 'pointer',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.active ? 'var(--green)' : 'var(--faint)' }} />
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <ClientEnvironment client={client} onAction={enqueueAction} />
    </div>
  )
}

function Section({ title, accent, right, children }: { title: string; accent?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: accent ?? 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>{title}</span>
        {right && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--faint)' }}>{right}</span>}
      </div>
      {children}
    </div>
  )
}

function ClientEnvironment({ client, onAction }: {
  client: Client
  onAction: (item: Omit<ActionQueueItem, 'id' | 'ts' | 'status'>) => void
}) {
  const done = client.milestones.filter((m) => m.d).length
  const total = client.milestones.length
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Identity row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div className={`rag-dot rag-${client.status}`} style={{ width: 10, height: 10 }} />
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{client.name}</span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{client.role}</span>
        <span className="badge" style={{ background: 'var(--panel2)', color: 'var(--faint)', border: '1px solid var(--line)' }}>{client.relationship}</span>
        {!client.active && <span className="badge" style={{ background: 'rgba(232,181,74,0.1)', color: 'var(--amber)', border: '1px solid rgba(232,181,74,0.3)' }}>Lapsed</span>}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ea)', fontWeight: 600 }}>{done}/{total} milestones · {pct}%</span>
      </div>

      {/* Terms */}
      {client.terms?.length ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {client.terms.map((t) => (
            <div key={t.label} className="card2" style={{ padding: '6px 11px' }}>
              <div style={{ fontSize: 9, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 600 }}>{t.value}</div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Next decision */}
      <div className="cta-amber" style={{ alignItems: 'flex-start' }}>
        <span style={{ fontSize: 14 }}>▶</span>
        <div>
          <div style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{client.phase} · next decision</div>
          <div style={{ fontSize: 13, color: 'var(--amber)' }}>{client.nextDecision}</div>
        </div>
      </div>

      {/* Roadmap */}
      {client.roadmap?.length ? (
        <Section title="Roadmap" accent="var(--ea)" right="to Day-1 & extension">
          <Roadmap phases={client.roadmap} />
        </Section>
      ) : null}

      {/* Deliverables */}
      {client.deliverables?.length ? (
        <Section title="Deliverables" accent="var(--ea)" right={`${client.deliverables.length} from contract`}>
          <Deliverables items={client.deliverables} />
        </Section>
      ) : null}

      {/* Backlog + Structure side by side on wide */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
        {client.backlog?.length ? (
          <Section title="Backlog" accent="var(--ea)" right={backlogTotal(client.backlog)}>
            <BacklogWaves waves={client.backlog} />
          </Section>
        ) : null}

        {client.structure?.length ? (
          <Section title="Structure" accent="var(--ea)" right="click → Obsidian">
            <StructureTree nodes={client.structure} />
          </Section>
        ) : null}
      </div>

      {/* Milestones */}
      <Section title="Milestones" accent="var(--ea)" right={`${done}/${total} · ${pct}%`}>
        <div style={{ height: 4, background: 'var(--line)', borderRadius: 2, marginBottom: 10 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--ea)', borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
          {client.milestones.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12 }}>
              <div style={{
                width: 15, height: 15, borderRadius: 4, border: `2px solid ${m.d ? 'var(--ea)' : 'var(--line2)'}`,
                background: m.d ? 'var(--ea)' : 'transparent', flexShrink: 0, marginTop: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {m.d ? <span style={{ color: '#000', fontSize: 9, fontWeight: 700 }}>✓</span> : null}
              </div>
              <span style={{ color: m.d ? 'var(--faint)' : 'var(--muted)', textDecoration: m.d ? 'line-through' : 'none', lineHeight: 1.4 }}>{m.t}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Skills + links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Section title="Launch security skill">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['threat-model', 'azure-tenant-separation-review', 'zero-trust-assessment', 'nis2-control-mapping', 'iso27001-nist-mapping', 'security-review', 'HLD', 'ADR'].map((skill) => (
              <button key={skill} className="btn" style={{ fontSize: 11 }}
                onClick={() => onAction({ verb: `skill.${skill.toLowerCase().replace(/\s+/g, '-')}`, args: { client: client.id }, domain: 'EA', safety: 2, source: 'ea-cockpit' })}>
                {skill}
              </button>
            ))}
          </div>
        </Section>
        <div style={{ display: 'flex', gap: 14, fontSize: 11, flexWrap: 'wrap' }}>
          {client.rosFolder && <a href={obsLink(client.rosFolder)} style={{ color: 'var(--ea)', textDecoration: 'none' }}>→ Open folder</a>}
          {client.contextFile && <a href={obsLink(client.contextFile)} style={{ color: 'var(--ea)', textDecoration: 'none' }}>→ CONTEXT.md</a>}
          {client.identity && <a href={`https://mail.google.com/mail/u/${client.identity}/#inbox`} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)', textDecoration: 'none' }}>→ {client.identity}</a>}
        </div>
      </div>
    </div>
  )
}

function Roadmap({ phases }: { phases: RoadmapPhase[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${phases.length}, 1fr)`, gap: 8 }}>
      {phases.map((p) => {
        const color = PHASE_COLOR[p.status] ?? 'var(--faint)'
        const emphasised = p.status === 'active' || p.status === 'next'
        return (
          <div key={p.id} className="card2" style={{ padding: '10px 11px', borderTop: `3px solid ${color}`, opacity: p.status === 'later' ? 0.7 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color }}>{p.id}</span>
              <span style={{ fontSize: 8, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.status}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: emphasised ? 'var(--ink)' : 'var(--muted)', lineHeight: 1.25, marginBottom: 4 }}>{p.title}</div>
            <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: p.milestone ? 6 : 0 }}>{p.window}</div>
            {p.milestone && <div style={{ fontSize: 10, color, lineHeight: 1.3 }}>{p.milestone}</div>}
          </div>
        )
      })}
    </div>
  )
}

function Deliverables({ items }: { items: Deliverable[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))', gap: 8 }}>
      {items.map((d) => {
        const color = DELIV_COLOR[d.status] ?? 'var(--faint)'
        return (
          <div key={d.id} className="card2" style={{ padding: '8px 10px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color, flexShrink: 0, marginTop: 1 }}>{d.id}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.3 }}>{d.title}</span>
            <span title={d.status} style={{ width: 7, height: 7, borderRadius: '50%', background: color, marginLeft: 'auto', flexShrink: 0, marginTop: 4 }} />
          </div>
        )
      })}
    </div>
  )
}

function BacklogWaves({ waves }: { waves: BacklogWave[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {waves.map((w) => {
        const pct = w.total ? Math.round((w.done / w.total) * 100) : 0
        return (
          <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ea)', width: 22, flexShrink: 0 }}>{w.id}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.title}</div>
              <div style={{ height: 4, background: 'var(--line)', borderRadius: 2 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? 'var(--green)' : 'var(--ea)', borderRadius: 2 }} />
              </div>
            </div>
            <span style={{ fontSize: 10, color: 'var(--faint)', width: 30, textAlign: 'right', flexShrink: 0 }}>{w.done}/{w.total}</span>
          </div>
        )
      })}
    </div>
  )
}

function StructureTree({ nodes, depth = 0 }: { nodes: StructureNode[]; depth?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {nodes.map((n) => (
        <div key={n.label}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: depth * 14, fontSize: 11 }}>
            <span style={{ fontSize: 11 }}>{n.kind === 'folder' ? '📁' : '📄'}</span>
            {n.path
              ? <a href={obsLink(n.path)} style={{ color: 'var(--muted)', textDecoration: 'none' }} onMouseOver={(e) => (e.currentTarget.style.color = 'var(--ea)')} onMouseOut={(e) => (e.currentTarget.style.color = 'var(--muted)')}>{n.label}</a>
              : <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{n.label}</span>}
          </div>
          {n.children?.length ? <div style={{ marginTop: 4 }}><StructureTree nodes={n.children} depth={depth + 1} /></div> : null}
        </div>
      ))}
    </div>
  )
}

function backlogTotal(waves: BacklogWave[]): string {
  const done = waves.reduce((a, w) => a + w.done, 0)
  const total = waves.reduce((a, w) => a + w.total, 0)
  return `${done}/${total} items`
}
