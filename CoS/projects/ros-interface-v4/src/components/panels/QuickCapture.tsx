import { useState } from 'react'
import { useStore } from '../../state/store'

export function QuickCapture() {
  const [text, setText] = useState('')
  const [type, setType] = useState<'task' | 'note'>('task')
  const { enqueueAction } = useStore()

  const submit = () => {
    if (!text.trim()) return
    enqueueAction({
      verb: type === 'task' ? 'task.add' : 'note.promote',
      args: { text: text.trim() },
      safety: type === 'task' ? 0 : 2,
      source: 'dashboard',
    })
    setText('')
  }

  return (
    <div className="card">
      <div className="head">Quick Capture</div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['task', 'note'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                padding: '3px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                background: type === t ? 'rgba(103,183,255,0.15)' : 'transparent',
                border: `1px solid ${type === t ? 'var(--blue)' : 'var(--line)'}`,
                color: type === t ? 'var(--blue)' : 'var(--muted)', cursor: 'pointer',
              }}
            >
              {t === 'task' ? 'Task' : 'Note'}
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
          placeholder={type === 'task' ? 'Capture a task… (⌘↵ to submit)' : 'Capture a note to promote to ROS…'}
          rows={3}
          style={{
            width: '100%', background: 'var(--panel2)', border: '1px solid var(--line2)',
            borderRadius: 8, padding: 10, color: 'var(--ink)', fontSize: 12, resize: 'none',
            fontFamily: 'var(--font)', outline: 'none',
          }}
        />
        <button
          className="btn btn-gold"
          onClick={submit}
          disabled={!text.trim()}
          style={{ alignSelf: 'flex-end', fontSize: 12 }}
        >
          {type === 'task' ? '+ Task' : '→ ROS'}
        </button>
      </div>
    </div>
  )
}
