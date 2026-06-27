import { useStore } from '../../state/store'

export function MKTSlide() {
  const { state, enqueueAction } = useStore()
  const mkt = state?.domains?.find((d) => d.k === 'MKT')

  const SKILLS = [
    { label: 'Marketing Loop', verb: 'skill.marketing-loop' },
    { label: 'Content Brief', verb: 'skill.content-brief' },
    { label: 'LinkedIn Post', verb: 'skill.linkedin-post' },
    { label: 'GTM Plan', verb: 'skill.gtm-plan' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
      {/* Domain status */}
      <div className="card2" style={{ padding: 12, borderLeft: '2px solid var(--mkt)' }}>
        <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 4 }}>MKT Focus</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{mkt?.ctx ?? 'Arbor marketing · content, copy, campaigns, brand, social'}</div>
      </div>

      {/* Active campaigns */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Active Campaigns</div>
        {[
          'IL Hebrew landing — 2035 pass built (not deployed)',
          'Viral GTM plan — €10k/6mo Israel-first',
          'Localization: HE/EN/NL/DE/FR pipeline',
        ].map((item, i) => (
          <div key={i} style={{ fontSize: 11, color: 'var(--muted)', padding: '4px 0', display: 'flex', gap: 6 }}>
            <span style={{ color: 'var(--mkt)' }}>◈</span>
            {item}
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Launch Skill</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {SKILLS.map((s) => (
            <button key={s.verb} className="btn" style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11 }}
              onClick={() => enqueueAction({ verb: s.verb, args: {}, domain: 'MKT', safety: 0, source: 'mkt-slide' })}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'MKT/MEMORY.md', href: 'obsidian://open?vault=ROS&file=MKT/MEMORY.md' },
          { label: 'VIRAL-ENGINE.md', href: 'obsidian://open?vault=ROS&file=PAI/projects/arbor/VIRAL-ENGINE.md' },
          { label: 'MARKETING-BACKLOG.md', href: 'obsidian://open?vault=ROS&file=PAI/projects/arbor/MARKETING-BACKLOG.md' },
        ].map((l) => (
          <a key={l.href} href={l.href} style={{ fontSize: 12, color: 'var(--mkt)', textDecoration: 'none' }}>→ {l.label}</a>
        ))}
      </div>
    </div>
  )
}
