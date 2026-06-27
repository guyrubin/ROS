import { useStore } from '../../state/store'

export function ArborTrack() {
  const { state } = useStore()
  const paiDomain = state?.domains?.find((d) => d.k === 'PAI')

  return (
    <div className="card">
      <div className="head">
        <span>Arbor / PAI Track</span>
        <div className={`rag-dot rag-${paiDomain?.s ?? 'amber'}`} style={{ marginLeft: 'auto' }} />
      </div>
      <div style={{ padding: 16 }}>
        <div className="card2" style={{ padding: '12px 14px', borderLeft: '2px solid var(--pai)', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 4 }}>Status</div>
          <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4 }}>
            {paiDomain?.ctx || 'No PAI context in state.json'}
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>
          Pending milestones
        </div>
        {(paiDomain?.milestones ?? []).filter((m) => !m.d).map((m, i) => (
          <div key={i} style={{ fontSize: 12, color: 'var(--muted)', padding: '4px 0', display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--pai)' }}>◈</span>
            {m.t}
          </div>
        ))}
        {!(paiDomain?.milestones?.length) && (
          <div style={{ fontSize: 12, color: 'var(--faint)', fontStyle: 'italic' }}>
            Add milestones to PAI domain state to track Arbor progress here.
          </div>
        )}
        <div style={{ marginTop: 12 }}>
          <a
            href="obsidian://open?vault=ROS&file=PAI/MEMORY.md"
            style={{ fontSize: 11, color: 'var(--pai)', textDecoration: 'none' }}
          >
            → Open PAI/MEMORY.md
          </a>
        </div>
      </div>
    </div>
  )
}
