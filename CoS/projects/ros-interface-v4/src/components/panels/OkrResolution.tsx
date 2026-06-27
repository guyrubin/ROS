import { useStore } from '../../state/store'
import { DOMAIN_COLORS, DOMAINS } from '../../design/domain-colors'

export function OkrResolution() {
  const { state } = useStore()

  const domainsWithOkrs = DOMAINS.map((key) => {
    const d = state?.domains?.find((d) => d.k === key)
    return { key, okrs: d?.okrs ?? [] }
  })

  const hasAnyOkrs = domainsWithOkrs.some((d) => d.okrs.length > 0)

  return (
    <div className="card">
      <div className="head">
        <span>OKR Resolution — Q2 2026</span>
        {!hasAnyOkrs && (
          <span className="badge" style={{ background: 'rgba(232,181,74,0.15)', color: 'var(--amber)', border: '1px solid rgba(232,181,74,0.3)', marginLeft: 'auto' }}>
            NOT SET
          </span>
        )}
      </div>

      {!hasAnyOkrs ? (
        <div style={{ padding: 20 }}>
          <div className="cta-amber" style={{ marginBottom: 16, flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>⚠ Q2 2026 OKRs not set</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              CoS/MEMORY.md shows placeholder OKRs for all domains. Run <code style={{ background: 'rgba(0,0,0,0.2)', padding: '1px 5px', borderRadius: 4, fontFamily: 'var(--mono)' }}>/cos okr-tracker</code> to set objectives for HV, EA, PAI, MKT, and KK.
            </div>
          </div>
          {/* Preview of what populated OKRs look like */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {DOMAINS.map((key) => (
              <div key={key} className="card2" style={{ padding: '10px 12px', borderLeft: `2px solid ${DOMAIN_COLORS[key]}44`, opacity: 0.4 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: DOMAIN_COLORS[key], marginBottom: 4 }}>{key}</div>
                <div style={{ fontSize: 11, color: 'var(--faint)' }}>No objective set</div>
                <div style={{ height: 4, background: 'var(--line)', borderRadius: 2, marginTop: 8 }}>
                  <div style={{ width: '0%', height: '100%', background: DOMAIN_COLORS[key], borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {domainsWithOkrs.map(({ key, okrs }) => (
            <div key={key} className="card2" style={{ padding: '12px 14px', borderLeft: `2px solid ${DOMAIN_COLORS[key]}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: DOMAIN_COLORS[key], marginBottom: 8 }}>{key}</div>
              {okrs.map((okr, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.3 }}>{okr.objective}</div>
                  {okr.keyResults.map((kr, j) => (
                    <div key={j} style={{ marginBottom: 5 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{kr.text}</span>
                        <span style={{ fontSize: 10, color: DOMAIN_COLORS[key], fontWeight: 600 }}>{kr.progress}%</span>
                      </div>
                      <div style={{ height: 3, background: 'var(--line)', borderRadius: 2 }}>
                        <div style={{ width: `${kr.progress}%`, height: '100%', background: DOMAIN_COLORS[key], borderRadius: 2, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
