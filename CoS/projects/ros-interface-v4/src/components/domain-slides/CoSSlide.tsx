import { useStore } from '../../state/store'

export function CoSSlide() {
  const { enqueueAction } = useStore()

  const SKILLS = [
    { label: 'Weekly Review', verb: 'skill.weekly-review', safety: 0 },
    { label: 'OKR Tracker', verb: 'skill.okr-tracker', safety: 0 },
    { label: 'Session Audit', verb: 'skill.session-audit', safety: 0 },
    { label: 'Cross-domain Sync', verb: 'skill.cross-domain-sync', safety: 0 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
      {/* Skills */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Launch Skill</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {SKILLS.map((s) => (
            <button
              key={s.verb}
              className="btn btn-gold"
              style={{ padding: '10px 14px', textAlign: 'left' }}
              onClick={() => enqueueAction({ verb: s.verb, args: {}, domain: 'CoS', safety: s.safety, source: 'cos-slide' })}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* OKR editor placeholder */}
      <div className="card2" style={{ padding: 14 }}>
        <div style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>OKR Status</div>
        <div className="cta-amber" style={{ fontSize: 11 }}>
          <span>⚠</span>
          <span>Q2 2026 OKRs not set. Run /cos okr-tracker to populate.</span>
        </div>
      </div>

      {/* Decision log */}
      <div className="card2" style={{ padding: 14 }}>
        <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Open Decisions</div>
        <div style={{ fontSize: 11, color: 'var(--faint)' }}>No open decisions captured in CoS/MEMORY.md — good state or gaps?</div>
        <button className="btn" style={{ marginTop: 8, fontSize: 11 }}
          onClick={() => enqueueAction({ verb: 'skill.weekly-review', args: {}, domain: 'CoS', safety: 0, source: 'cos-slide' })}>
          Run weekly review
        </button>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'CoS/MEMORY.md', href: 'obsidian://open?vault=ROS&file=CoS/MEMORY.md' },
          { label: 'CoS/CLAUDE.md', href: 'obsidian://open?vault=ROS&file=CoS/CLAUDE.md' },
          { label: 'AGENTS.md', href: 'obsidian://open?vault=ROS&file=AGENTS.md' },
        ].map((l) => (
          <a key={l.href} href={l.href} style={{ fontSize: 12, color: 'var(--cos)', textDecoration: 'none' }}>→ {l.label}</a>
        ))}
      </div>
    </div>
  )
}
