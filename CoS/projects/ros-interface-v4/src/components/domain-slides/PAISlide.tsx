import { useStore } from '../../state/store'

export function PAISlide() {
  const { state, enqueueAction } = useStore()
  const agents = state?.agents?.filter((a) => a.domain === 'PAI') ?? []
  const pai = state?.domains?.find((d) => d.k === 'PAI')

  const SKILLS = [
    { label: 'Arbor PRD', verb: 'skill.arbor-prd' },
    { label: 'GTM Plan', verb: 'skill.gtm-plan' },
    { label: 'Eval Loop', verb: 'skill.eval-loop' },
    { label: 'PAI Weekly', verb: 'skill.pai-weekly' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
      {/* Arbor deploy status */}
      <div className="card2" style={{ padding: 12, borderLeft: '2px solid var(--pai)' }}>
        <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 4 }}>Arbor Production</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>arborparentingapp.com</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>Firebase Hosting · main branch CI deploy</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>{pai?.ctx ?? 'AI products, PRDs, GTM, pricing, ventures'}</div>
      </div>

      {/* Running agents */}
      {agents.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Active Agents</div>
          {agents.map((a) => (
            <div key={a.id} style={{ padding: '4px 0', fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 6 }}>
              <span style={{ color: 'var(--green)', fontSize: 9 }}>●</span>
              {a.name} — {a.job}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Launch Skill</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {SKILLS.map((s) => (
            <button key={s.verb} className="btn" style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11 }}
              onClick={() => enqueueAction({ verb: s.verb, args: {}, domain: 'PAI', safety: 0, source: 'pai-slide' })}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'PAI/MEMORY.md', href: 'obsidian://open?vault=ROS&file=PAI/MEMORY.md' },
          { label: 'PAI/projects/arbor/', href: 'obsidian://open?vault=ROS&file=PAI/projects/arbor/CHARTER.md' },
          { label: 'PRODUCT-BACKLOG.md', href: 'obsidian://open?vault=ROS&file=PAI/projects/arbor/PRODUCT-BACKLOG.md' },
        ].map((l) => (
          <a key={l.href} href={l.href} style={{ fontSize: 12, color: 'var(--pai)', textDecoration: 'none' }}>→ {l.label}</a>
        ))}
      </div>
    </div>
  )
}
