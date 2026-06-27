import { useStore } from '../../state/store'
import { DOMAIN_COLORS, DOMAIN_LABELS, DOMAINS } from '../../design/domain-colors'
import type { RAG } from '../../state/types'

export function DomainPulse() {
  const { state, openSlideOver } = useStore()

  const getStatus = (key: string): { rag: RAG; ctx: string } => {
    const d = state?.domains?.find((d) => d.k === key)
    return { rag: d?.s ?? 'green', ctx: d?.ctx ?? '' }
  }

  return (
    <div className="card" style={{ padding: '14px 16px' }}>
      <div className="head" style={{ padding: 0, marginBottom: 12, border: 'none' }}>Domain Pulse</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {DOMAINS.map((key) => {
          const { rag, ctx } = getStatus(key)
          const color = DOMAIN_COLORS[key]
          return (
            <button
              key={key}
              onClick={() => openSlideOver(key)}
              title={ctx || DOMAIN_LABELS[key]}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 10,
                background: 'var(--panel2)',
                border: `1px solid ${rag !== 'green' ? `var(--rag-${rag})` : 'var(--line)'}`,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div className={`rag-dot rag-${rag}`} />
              <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.06em' }}>{key}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {DOMAIN_LABELS[key]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
