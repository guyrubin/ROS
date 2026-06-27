import { useState, useEffect } from 'react'

const LS_KEY = 'ros-brain-dump'

export function BrainDump() {
  const [text, setText] = useState(() => localStorage.getItem(LS_KEY) ?? '')

  useEffect(() => {
    localStorage.setItem(LS_KEY, text)
  }, [text])

  return (
    <div className="card">
      <div className="head">
        <span>Brain Dump</span>
        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--faint)' }}>localStorage only</span>
      </div>
      <div style={{ padding: '0 14px 14px' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Scratch pad — not saved to ROS. Use Quick Capture to promote."
          rows={6}
          style={{
            width: '100%', background: 'var(--panel2)', border: '1px solid var(--line)',
            borderRadius: 8, padding: 10, color: 'var(--ink)', fontSize: 12, resize: 'vertical',
            fontFamily: 'var(--font)', outline: 'none', lineHeight: 1.6,
          }}
        />
        {text && (
          <button
            className="btn"
            onClick={() => setText('')}
            style={{ marginTop: 8, fontSize: 11, color: 'var(--faint)' }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
