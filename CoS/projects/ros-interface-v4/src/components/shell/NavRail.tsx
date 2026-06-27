import { useStore } from '../../state/store'
import { DOMAIN_COLORS, DOMAIN_LABELS, DOMAINS } from '../../design/domain-colors'
import type { RAG } from '../../state/types'

const RAG_GLOW: Record<RAG, string> = {
  green: 'var(--rag-green)',
  amber: 'var(--rag-amber)',
  red:   'var(--rag-red)',
}

export function NavRail() {
  const { state, openSlideOver } = useStore()

  const domainStatus = (key: string): RAG => {
    const d = state?.domains?.find((d) => d.k === key)
    return d?.s ?? 'green'
  }

  return (
    <aside style={{
      width: 'var(--rail-w)',
      background: 'var(--panel)',
      borderRight: '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 12,
      gap: 6,
      flexShrink: 0,
    }}>
      {DOMAINS.map((key) => {
        const rag = domainStatus(key)
        const color = DOMAIN_COLORS[key]
        return (
          <button
            key={key}
            onClick={() => openSlideOver(key)}
            title={DOMAIN_LABELS[key]}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: `1px solid ${rag !== 'green' ? RAG_GLOW[rag] : 'var(--line)'}`,
              background: 'var(--panel2)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              transition: 'border-color 0.2s',
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: '0.05em' }}>
              {key}
            </span>
            <div
              className={`rag-dot rag-${rag}`}
              style={{ width: 6, height: 6 }}
            />
          </button>
        )
      })}
    </aside>
  )
}
