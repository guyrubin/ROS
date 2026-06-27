import { useStore } from '../../state/store'

export function ArborCommand() {
  const { state } = useStore()
  const agents = state?.agents?.filter((a) => a.domain === 'PAI') ?? []

  return (
    <div className="card" style={{ borderLeft: '3px solid var(--pai)' }}>
      <div className="head">
        <span>Arbor Command</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--pai)' }}>PAI</span>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Deploy status */}
        <div className="card2" style={{ padding: '10px 14px', borderLeft: '2px solid var(--pai)' }}>
          <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 4 }}>Prod</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>arborparentingapp.com</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Firebase Hosting · main branch deploy</div>
        </div>

        {/* Active PRDs */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Open work</div>
          {[
            'Augmented avatar + best-in-market games',
            'Closed-loop growth PRD',
            'IL Hebrew market landing rebuild',
          ].map((item, i) => (
            <div key={i} style={{ fontSize: 12, color: 'var(--muted)', padding: '4px 0', display: 'flex', gap: 8 }}>
              <span style={{ color: 'var(--pai)' }}>◈</span>
              {item}
            </div>
          ))}
        </div>

        {/* PAI agents */}
        {agents.length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Running agents</div>
            {agents.map((a) => (
              <div key={a.id} style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 8, padding: '3px 0' }}>
                <span style={{ color: 'var(--green)', fontSize: 9 }}>●</span>
                {a.name} — {a.job}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a href="obsidian://open?vault=ROS&file=PAI/projects/arbor/CHARTER.md" className="btn" style={{ fontSize: 11, textDecoration: 'none' }}>Charter</a>
          <a href="obsidian://open?vault=ROS&file=PAI/MEMORY.md" className="btn" style={{ fontSize: 11, textDecoration: 'none' }}>MEMORY</a>
        </div>
      </div>
    </div>
  )
}
