import { useStore } from '../../state/store'
import { formatTime } from '../../lib/formatters'

export function DayStrip({ full }: { full?: boolean }) {
  const { state } = useStore()
  const events = state?.liveData?.calendar?.eventsToday ?? []
  const fetchedAt = state?.liveData?.calendar?.fetchedAt ?? ''
  const stale = !fetchedAt || Date.now() - new Date(fetchedAt).getTime() > 15 * 60 * 1000

  const now = new Date().toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' })
  const nowH = new Date(now).getHours() + new Date(now).getMinutes() / 60

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="head">
        <span>Today</span>
        {stale && <span style={{ color: 'var(--amber)', fontSize: 10, marginLeft: 'auto' }}>⚠ stale — refresh connectors</span>}
      </div>
      {events.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📅</div>
          <div>{stale ? 'Calendar data stale' : 'No events today'}</div>
          {stale && <div style={{ color: 'var(--faint)', fontSize: 11 }}>Run connector.refresh from OS view</div>}
        </div>
      ) : (
        <div style={{ padding: full ? '12px 0' : '8px 0' }}>
          {events.map((ev, i) => {
            const evH = new Date(ev.start).getHours() + new Date(ev.start).getMinutes() / 60
            const isPast = evH < nowH
            const isNext = !isPast && (i === 0 || events.slice(0, i).every((e) => {
              const h = new Date(e.start).getHours() + new Date(e.start).getMinutes() / 60
              return h < nowH
            }))
            return (
              <div key={ev.id ?? i} style={{
                display: 'flex', gap: 12, padding: '8px 16px',
                background: isNext ? 'rgba(103,183,255,0.06)' : 'transparent',
                borderLeft: isNext ? '3px solid var(--blue)' : '3px solid transparent',
                opacity: isPast ? 0.45 : 1,
              }}>
                <span style={{ fontSize: 11, color: 'var(--faint)', width: 40, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {formatTime(ev.start)}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: isNext ? 'var(--blue)' : 'var(--ink)', fontWeight: isNext ? 600 : 400 }}>
                    {ev.title}
                  </div>
                  {ev.location && (
                    <div style={{ fontSize: 11, color: 'var(--faint)' }}>📍 {ev.location}</div>
                  )}
                </div>
                <span style={{ fontSize: 11, color: 'var(--faint)' }}>
                  {formatTime(ev.start)}–{formatTime(ev.end)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
