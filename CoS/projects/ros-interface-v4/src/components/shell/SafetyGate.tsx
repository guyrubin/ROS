import { useState, useEffect } from 'react'
import { useStore } from '../../state/store'
import { SAFETY_LABELS, SAFETY_COLORS } from '../../lib/safetyLevel'
import type { ActionQueueItem, SafetyLevel } from '../../state/types'

export function SafetyGate() {
  const { state, confirmAction, rejectAction } = useStore()
  const [current, setCurrent] = useState<ActionQueueItem | null>(null)

  const pending = state?.actionQueue?.filter(
    (a) => a.status === 'pending' && a.safety >= 3
  ) ?? []

  useEffect(() => {
    if (!current && pending.length > 0) {
      setCurrent(pending[0])
    }
  }, [pending, current])

  if (!current) return null

  const safety = current.safety as SafetyLevel
  const isIrrev = safety >= 5
  const isFin   = safety >= 4

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: isIrrev ? 'rgba(255,107,107,0.08)' : 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className="card" style={{ width: 440, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Safety badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge" style={{
            background: `${SAFETY_COLORS[safety]}22`,
            color: SAFETY_COLORS[safety],
            border: `1px solid ${SAFETY_COLORS[safety]}44`,
          }}>
            Safety {safety} — {SAFETY_LABELS[safety]}
          </span>
          {isIrrev && (
            <span style={{ color: 'var(--red)', fontSize: 12, fontWeight: 600 }}>
              ⚠ IRREVERSIBLE
            </span>
          )}
        </div>

        {/* Action detail */}
        <div style={{ fontSize: 13, color: 'var(--ink)' }}>
          <div style={{ color: 'var(--muted)', marginBottom: 6, fontSize: 11 }}>ACTION</div>
          <code style={{
            display: 'block',
            background: 'var(--panel2)',
            border: '1px solid var(--line)',
            borderRadius: 6,
            padding: '8px 12px',
            fontFamily: 'var(--mono)',
            fontSize: 12,
            color: 'var(--ink)',
            wordBreak: 'break-all',
          }}>
            {current.verb}
            {Object.keys(current.args).length > 0 && ` — ${JSON.stringify(current.args)}`}
          </code>
        </div>

        {/* EUR amount for financial */}
        {isFin && current.args.amount != null && (
          <div style={{
            background: 'rgba(232,181,74,0.1)',
            border: '1px solid rgba(232,181,74,0.3)',
            borderRadius: 8,
            padding: '10px 14px',
            color: 'var(--amber)',
            fontWeight: 700,
            fontSize: 18,
          }}>
            € {String(current.args.amount)}
          </div>
        )}

        {/* Domain */}
        {current.domain && (
          <div style={{ fontSize: 12, color: 'var(--faint)' }}>
            Domain: <span style={{ color: 'var(--muted)' }}>{current.domain}</span>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            className="btn"
            onClick={() => { rejectAction(current.id); setCurrent(null) }}
            style={{ flex: 1 }}
          >
            Reject
          </button>
          <button
            className="btn btn-gold"
            onClick={() => { confirmAction(current.id); setCurrent(null) }}
            style={{ flex: 2 }}
          >
            {isIrrev ? '⚠ Confirm irreversible' : isFin ? '✓ Confirm financial action' : '✓ Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
