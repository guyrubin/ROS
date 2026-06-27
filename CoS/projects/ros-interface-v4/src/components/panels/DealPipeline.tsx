import { useStore } from '../../state/store'

const STAGES = ['lead', 'underwriting', 'DD', 'pre-permit', 'permitting', 'renovation', 'stabilised'] as const

export function DealPipeline() {
  const { state } = useStore()
  const hvDomain = state?.domains?.find((d) => d.k === 'HV')
  const deals = hvDomain?.tasks ?? []

  return (
    <div className="card">
      <div className="head">
        <span>HV Deal Pipeline</span>
        <span style={{ color: 'var(--hv)', marginLeft: 'auto', fontSize: 10 }}>BRRRR</span>
      </div>

      {deals.length === 0 ? (
        <div>
          {/* Static deal from state.json context */}
          <div style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Radar</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { name: 'Den Haag / Koningin Emmakade', stage: 'DD', note: 'DD follow-up pending' },
                { name: 'Smart-living dev-upside sourcing', stage: 'lead', note: 'Radar active — Den Haag / Rotterdam' },
              ].map((deal, i) => (
                <div key={i} className="card2" style={{ padding: '10px 12px', borderLeft: '2px solid var(--hv)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{deal.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, background: 'rgba(232,181,74,0.15)', color: 'var(--hv)', border: '1px solid rgba(232,181,74,0.3)', padding: '1px 8px', borderRadius: 10 }}>
                      {deal.stage}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{deal.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '8px 16px 12px' }}>
            <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Stage Pipeline</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {STAGES.map((s) => (
                <div key={s} style={{
                  flex: 1, background: 'var(--panel2)', border: '1px solid var(--line)', borderRadius: 4,
                  padding: '3px 0', textAlign: 'center', fontSize: 8, color: 'var(--faint)', fontWeight: 500,
                }}>
                  {s.slice(0, 3).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: 16 }}>
          {deals.map((deal, i) => (
            <div key={i} className="card2" style={{ padding: '10px 12px', marginBottom: 8, borderLeft: '2px solid var(--hv)' }}>
              <div style={{ fontSize: 12, color: 'var(--ink)' }}>{deal.t}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
