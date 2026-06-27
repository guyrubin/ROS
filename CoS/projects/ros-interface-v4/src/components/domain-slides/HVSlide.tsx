import { useStore } from '../../state/store'

const STAGES = ['Lead', 'Underwriting', 'DD', 'Pre-permit', 'Permitting', 'Renovation', 'Stabilised']

export function HVSlide() {
  const { state, enqueueAction } = useStore()
  const hv = state?.domains?.find((d) => d.k === 'HV')
  const tasks = state?.tasks?.back?.filter((t) => t.domain === 'HV') ?? []

  const SKILLS = [
    { label: 'BRRRR Calc', verb: 'skill.brrrr-calc' },
    { label: 'Deal Research', verb: 'skill.deal-research' },
    { label: 'HV Dev Deal', verb: 'skill.hv-dev-deal' },
    { label: 'Permit Check', verb: 'skill.permit-check' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
      {/* Domain status */}
      <div className="card2" style={{ padding: 12, borderLeft: '2px solid var(--hv)' }}>
        <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 4 }}>Domain status</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{hv?.ctx ?? 'EU dual-exit development engine · Antwerp focus'}</div>
      </div>

      {/* BRRRR pipeline */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>BRRRR Stage Pipeline</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {STAGES.map((stage) => (
            <div key={stage} style={{
              fontSize: 10, padding: '4px 8px', borderRadius: 8,
              background: 'var(--panel2)', border: '1px solid var(--line)',
              color: 'var(--faint)',
            }}>
              {stage}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--faint)' }}>Deal data lives in HV/MEMORY.md → run /hv-dev-deal for full pipeline</div>
      </div>

      {/* HV tasks */}
      {tasks.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Open Tasks</div>
          {tasks.map((t, i) => (
            <div key={i} style={{ padding: '4px 0', fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 6 }}>
              <span style={{ color: 'var(--hv)' }}>○</span>
              {t.t}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {SKILLS.map((s) => (
          <button key={s.verb} className="btn" style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11 }}
            onClick={() => enqueueAction({ verb: s.verb, args: {}, domain: 'HV', safety: 0, source: 'hv-slide' })}>
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'HV/MEMORY.md', href: 'obsidian://open?vault=ROS&file=HV/MEMORY.md' },
          { label: 'HV/CLAUDE.md', href: 'obsidian://open?vault=ROS&file=HV/CLAUDE.md' },
        ].map((l) => (
          <a key={l.href} href={l.href} style={{ fontSize: 12, color: 'var(--hv)', textDecoration: 'none' }}>→ {l.label}</a>
        ))}
      </div>
    </div>
  )
}
