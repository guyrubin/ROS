import { useStore } from '../../state/store'
import { DOMAIN_COLORS } from '../../design/domain-colors'

export function TasksPanel() {
  const { state } = useStore()
  const back  = state?.tasks?.back  ?? []
  const trunk = state?.tasks?.trunk ?? []

  return (
    <div className="card">
      <div className="head">Tasks</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        {/* Back seat */}
        <div style={{ borderRight: '1px solid var(--line)', padding: '10px 0' }}>
          <div style={{ padding: '0 14px 8px', fontSize: 10, color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Back Seat
          </div>
          {back.length === 0 ? (
            <div style={{ padding: '8px 14px', fontSize: 11, color: 'var(--faint)' }}>Empty</div>
          ) : back.map((t, i) => (
            <TaskRow key={i} task={t} />
          ))}
        </div>
        {/* Trunk */}
        <div style={{ padding: '10px 0' }}>
          <div style={{ padding: '0 14px 8px', fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Trunk
          </div>
          {trunk.length === 0 ? (
            <div style={{ padding: '8px 14px', fontSize: 11, color: 'var(--faint)' }}>Empty</div>
          ) : trunk.map((t, i) => (
            <TaskRow key={i} task={t} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TaskRow({ task }: { task: { t: string; d: number; domain?: string } }) {
  const color = task.domain ? (DOMAIN_COLORS[task.domain] ?? 'var(--faint)') : 'var(--faint)'
  return (
    <div style={{
      padding: '6px 14px', display: 'flex', alignItems: 'flex-start', gap: 8,
      opacity: task.d ? 0.4 : 1,
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: 3, border: `2px solid ${task.d ? color : 'var(--line2)'}`,
        background: task.d ? color : 'transparent', flexShrink: 0, marginTop: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {task.d && <span style={{ color: '#000', fontSize: 8 }}>✓</span>}
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4, textDecoration: task.d ? 'line-through' : 'none' }}>
          {task.t}
        </span>
        {task.domain && (
          <span style={{ fontSize: 9, color, marginLeft: 6, fontWeight: 600 }}>{task.domain}</span>
        )}
      </div>
    </div>
  )
}
