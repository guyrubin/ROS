import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../state/store'
import { copyQueueToClipboard } from '../../lib/stateIO'

interface Command {
  id: string
  label: string
  category: string
  action: () => void
  keys?: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { state, openSlideOver } = useStore()

  const COMMANDS: Command[] = [
    { id: 'now',      label: 'Go to NOW view',      category: 'Navigate', action: () => navigate('/'),         keys: '⌘`' },
    { id: 'momentum', label: 'Go to MOMENTUM view', category: 'Navigate', action: () => navigate('/momentum') },
    { id: 'work',     label: 'Go to WORK view',     category: 'Navigate', action: () => navigate('/work') },
    { id: 'ops',      label: 'Go to OPS view',      category: 'Navigate', action: () => navigate('/ops') },
    { id: 'os',       label: 'Go to OS view',       category: 'Navigate', action: () => navigate('/os') },
    { id: 'backlog',  label: 'Go to BACKLOG — all domains', category: 'Navigate', action: () => navigate('/backlog'), keys: '⌘^' },
    { id: 'map',      label: 'Go to MAP — system graph', category: 'Navigate', action: () => navigate('/map'), keys: '⌘%' },
    { id: 'cos',      label: 'Open CoS',    category: 'Domain', action: () => openSlideOver('CoS'), keys: '⌘8' },
    { id: 'kk',       label: 'Open KK',     category: 'Domain', action: () => openSlideOver('KK'),  keys: '⌘1' },
    { id: 'hv',       label: 'Open HV',     category: 'Domain', action: () => openSlideOver('HV'),  keys: '⌘2' },
    { id: 'ea',       label: 'Open EA',     category: 'Domain', action: () => openSlideOver('EA'),  keys: '⌘3' },
    { id: 'pai',      label: 'Open PAI',    category: 'Domain', action: () => openSlideOver('PAI'), keys: '⌘4' },
    { id: 'mkt',      label: 'Open MKT',    category: 'Domain', action: () => openSlideOver('MKT'), keys: '⌘5' },
    { id: 'fin',      label: 'Open FIN',    category: 'Domain', action: () => openSlideOver('FIN'), keys: '⌘6' },
    {
      id: 'drain-queue', label: 'Drain Queue — copy to clipboard', category: 'Agent',
      action: async () => {
        if (state?.actionQueue) await copyQueueToClipboard(state.actionQueue)
      }
    },
    { id: 'weekly-review', label: 'Run weekly review (/cos weekly-review)', category: 'Workflow', action: () => navigate('/momentum') },
    { id: 'okr',           label: 'Set OKRs (/cos okr-tracker)',             category: 'Workflow', action: () => navigate('/momentum') },
    { id: 'check-os',      label: 'Check memory freshness',                  category: 'OS',      action: () => navigate('/os') },
    { id: 'refresh-conn',  label: 'Refresh connectors',                      category: 'OS',      action: () => navigate('/os') },
  ]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  const filtered = query
    ? COMMANDS.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : COMMANDS

  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80, background: 'rgba(0,0,0,0.5)' }}>
      <div className="card" style={{ width: 560, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--faint)', fontSize: 13 }}>⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--ink)', fontSize: 14, fontFamily: 'var(--font)',
            }}
          />
        </div>
        <div style={{ maxHeight: 360, overflow: 'auto' }}>
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => { cmd.action(); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', width: '100%',
                padding: '9px 16px', background: 'transparent',
                border: 'none', borderBottom: '1px solid var(--line)',
                cursor: 'pointer', gap: 12, textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--panel2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 9, color: 'var(--faint)', width: 60, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {cmd.category}
              </span>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{cmd.label}</span>
              {cmd.keys && (
                <kbd style={{ fontSize: 10, color: 'var(--faint)', background: 'var(--panel2)', border: '1px solid var(--line)', borderRadius: 4, padding: '1px 5px' }}>
                  {cmd.keys}
                </kbd>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
