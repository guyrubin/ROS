import { useStore } from '../../state/store'

export function EASlide() {
  const { state, enqueueAction } = useStore()
  const clients = state?.clients ?? []

  const SKILLS = [
    { label: 'HLD', verb: 'skill.hld' },
    { label: 'ADR', verb: 'skill.adr' },
    { label: 'Architecture Review', verb: 'skill.architecture-review' },
    { label: 'EA Monthly Brief', verb: 'skill.ea-monthly-brief' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
      {/* Clients summary */}
      {clients.map((c) => {
        const done = c.milestones.filter((m) => m.d).length
        const total = c.milestones.length
        const pct = total ? Math.round((done / total) * 100) : 0
        const ragColor = c.status === 'red' ? 'var(--rag-red)' : c.status === 'green' ? 'var(--rag-green)' : 'var(--rag-amber)'

        return (
          <div key={c.id} className="card2" style={{ padding: 12, borderLeft: `2px solid ${ragColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{c.name}</div>
              <div style={{ fontSize: 10, color: 'var(--ea)', fontWeight: 600 }}>{done}/{total} · {pct}%</div>
            </div>
            <div style={{ height: 3, background: 'var(--line)', borderRadius: 2, marginBottom: 6 }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'var(--ea)', borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.phase} · {c.nextDecision}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {c.rosFolder && (
                <a href={`obsidian://open?vault=ROS&file=${c.rosFolder}`} style={{ fontSize: 11, color: 'var(--ea)', textDecoration: 'none' }}>→ Obsidian</a>
              )}
              {c.drive && (
                <a href={c.drive} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--blue)', textDecoration: 'none' }}>→ Drive</a>
              )}
            </div>
          </div>
        )
      })}

      {clients.length === 0 && (
        <div className="empty-state">
          <div className="icon">🏗️</div>
          <div>No clients in state.json.clients[]</div>
        </div>
      )}

      {/* Skills */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Launch Skill</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {SKILLS.map((s) => (
            <button key={s.verb} className="btn" style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11 }}
              onClick={() => enqueueAction({ verb: s.verb, args: {}, domain: 'EA', safety: 0, source: 'ea-slide' })}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'EA/MEMORY.md', href: 'obsidian://open?vault=ROS&file=EA/MEMORY.md' },
          { label: 'josephdoronrubin@gmail.com', href: 'https://mail.google.com/mail/u/josephdoronrubin@gmail.com/#inbox' },
        ].map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--ea)', textDecoration: 'none' }}>→ {l.label}</a>
        ))}
      </div>
    </div>
  )
}
