import { useStore } from '../../state/store'

export function KKSlide() {
  const { state, enqueueAction } = useStore()
  const events = state?.liveData?.calendar?.eventsToday ?? []
  const tasks = state?.tasks?.back ?? []
  const kkTasks = tasks.filter((t) => !t.domain || t.domain === 'KK')

  const SKILLS = ['Triage Inbox', 'Schedule Day', 'Batch Reply', 'EOD Capture']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
      {/* Calendar */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Today's Calendar</div>
        {events.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--faint)' }}>No events loaded — connector may be stale</div>
        ) : events.map((e, i) => (
          <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid var(--line)', fontSize: 11, color: 'var(--muted)' }}>
            <span style={{ color: 'var(--kk)', marginRight: 8 }}>{new Date(e.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {e.title}
          </div>
        ))}
      </div>

      {/* KK tasks */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>KK Tasks</div>
        {kkTasks.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--faint)' }}>No tasks in KK domain</div>
        ) : kkTasks.slice(0, 8).map((t, i) => (
          <div key={i} style={{ padding: '4px 0', fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 6 }}>
            <span style={{ color: 'var(--kk)' }}>○</span>
            {t.t}
          </div>
        ))}
      </div>

      {/* Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {SKILLS.map((s) => (
          <button key={s} className="btn" style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11 }}
            onClick={() => enqueueAction({ verb: `skill.${s.toLowerCase().replace(/\s+/g, '-')}`, args: {}, domain: 'KK', safety: 0, source: 'kk-slide' })}>
            {s}
          </button>
        ))}
      </div>

      {/* Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'KK/MEMORY.md', href: 'obsidian://open?vault=ROS&file=KK/MEMORY.md' },
          { label: 'Gmail (bguy)', href: 'https://mail.google.com/mail/u/0/#inbox' },
        ].map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--kk)', textDecoration: 'none' }}>→ {l.label}</a>
        ))}
      </div>
    </div>
  )
}
