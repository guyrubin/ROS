import { useStore } from '../../state/store'

export function FINSlide() {
  const { state, enqueueAction } = useStore()
  const fin = state?.domains?.find((d) => d.k === 'FIN')

  const SKILLS = [
    { label: 'Invoice Tracker', verb: 'skill.invoice-tracker', safety: 0 },
    { label: 'Contract Review', verb: 'skill.contract-review', safety: 0 },
    { label: 'Tax Calendar', verb: 'skill.tax-calendar', safety: 0 },
    { label: 'Cash Flow', verb: 'skill.cash-flow', safety: 4 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
      {/* Domain status */}
      <div className="card2" style={{ padding: 12, borderLeft: '2px solid var(--fin)' }}>
        <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 4 }}>FIN Status</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{fin?.ctx ?? 'Invoices, insurance, contracts, tax, admin'}</div>
      </div>

      {/* Quick watch */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Watch Items</div>
        {[
          'BE professional card #683002 — appeal by 24 Jul 2026',
          'Tnufa funding — gated on CEO decisions',
          'RevenueCat billing rails — needs end-to-end test',
        ].map((item, i) => (
          <div key={i} style={{ fontSize: 11, color: 'var(--muted)', padding: '4px 0', display: 'flex', gap: 6 }}>
            <span style={{ color: 'var(--amber)' }}>⚠</span>
            {item}
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Launch Skill</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {SKILLS.map((s) => (
            <button key={s.verb}
              className={`btn${s.safety >= 4 ? ' btn-amber' : ''}`}
              style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11 }}
              onClick={() => enqueueAction({ verb: s.verb, args: {}, domain: 'FIN', safety: s.safety, source: 'fin-slide' })}>
              {s.label}
              {s.safety >= 4 && <span style={{ fontSize: 9, color: 'var(--amber)', marginLeft: 6 }}>€ confirm</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'FIN/MEMORY.md', href: 'obsidian://open?vault=ROS&file=FIN/MEMORY.md' },
          { label: 'FIN/CLAUDE.md', href: 'obsidian://open?vault=ROS&file=FIN/CLAUDE.md' },
        ].map((l) => (
          <a key={l.href} href={l.href} style={{ fontSize: 12, color: 'var(--fin)', textDecoration: 'none' }}>→ {l.label}</a>
        ))}
      </div>
    </div>
  )
}
