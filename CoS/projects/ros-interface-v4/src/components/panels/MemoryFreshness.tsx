import { useStore } from '../../state/store'
import { DOMAIN_COLORS, DOMAINS } from '../../design/domain-colors'
import { freshnessColor, freshnessLabel, daysAgo } from '../../lib/formatters'

export function MemoryFreshness() {
  const { state } = useStore()
  const dates = state?.meta?.memoryDates ?? {}

  return (
    <div className="card">
      <div className="head">Memory Freshness</div>
      <div style={{ padding: '4px 0' }}>
        {DOMAINS.map((key) => {
          const iso = dates[key as keyof typeof dates] ?? ''
          const color = freshnessColor(iso)
          const label = freshnessLabel(iso)
          const d = daysAgo(iso)
          const isStale = d >= 14

          return (
            <div key={key} style={{
              padding: '8px 16px', borderBottom: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', gap: 10,
              background: isStale ? 'rgba(255,107,107,0.04)' : 'transparent',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0,
                boxShadow: isStale ? `0 0 6px ${color}` : 'none' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: DOMAIN_COLORS[key], width: 36 }}>{key}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)', flex: 1 }}>{key}/MEMORY.md</span>
              <span style={{ fontSize: 11, color, fontWeight: isStale ? 600 : 400 }}>{label}</span>
              {isStale && (
                <span style={{ fontSize: 10, color: 'var(--red)' }}>→ run /session-audit</span>
              )}
            </div>
          )
        })}
        {Object.keys(dates).length === 0 && (
          <div style={{ padding: '12px 16px' }}>
            <div className="cta-amber" style={{ fontSize: 11 }}>
              <span>⚠</span>
              <span>Memory dates not yet tracked. Hermes writes <code style={{ fontFamily: 'var(--mono)', background: 'rgba(0,0,0,0.2)', padding: '1px 4px', borderRadius: 3 }}>meta.memoryDates</code> nightly.</span>
            </div>
            {/* Static known stale memory from context */}
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Known stale (from state.json)</div>
              <div style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--rag-red)', boxShadow: '0 0 6px var(--rag-red)' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cos)', width: 36 }}>CoS</span>
                <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 600 }}>Last updated 2026-05-15 → 43+ days stale</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
