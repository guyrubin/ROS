import { useEffect } from 'react'
import { useStore } from '../../state/store'
import { DOMAIN_COLORS, DOMAIN_LABELS } from '../../design/domain-colors'
import { CoSSlide } from '../domain-slides/CoSSlide'
import { KKSlide } from '../domain-slides/KKSlide'
import { HVSlide } from '../domain-slides/HVSlide'
import { EASlide } from '../domain-slides/EASlide'
import { PAISlide } from '../domain-slides/PAISlide'
import { MKTSlide } from '../domain-slides/MKTSlide'
import { FINSlide } from '../domain-slides/FINSlide'

const SLIDES: Record<string, React.FC> = {
  CoS: CoSSlide, KK: KKSlide, HV: HVSlide,
  EA: EASlide, PAI: PAISlide, MKT: MKTSlide, FIN: FINSlide,
}

export function SlideOver() {
  const { slideOver, closeSlideOver } = useStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSlideOver()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeSlideOver])

  if (!slideOver) return null

  const SlideContent = SLIDES[slideOver]
  const color = DOMAIN_COLORS[slideOver] ?? 'var(--muted)'
  const label = DOMAIN_LABELS[slideOver] ?? slideOver

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeSlideOver}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }}
      />
      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 720,
        background: 'var(--panel)',
        borderLeft: `2px solid ${color}`,
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'var(--panel2)',
        }}>
          <span style={{ fontWeight: 700, color, fontSize: 14, letterSpacing: '0.08em' }}>
            {slideOver}
          </span>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>{label}</span>
          <div style={{ flex: 1 }} />
          <button
            className="btn"
            onClick={closeSlideOver}
            style={{ padding: '4px 10px', fontSize: 12 }}
          >
            ✕ Close  <kbd style={{ opacity: 0.5, fontSize: 10 }}>Esc</kbd>
          </button>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {SlideContent ? <SlideContent /> : <div style={{ color: 'var(--muted)' }}>No content</div>}
        </div>
      </div>
    </>
  )
}
