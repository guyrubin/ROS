import { Suspense, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useStateSync } from './state/useStateSync'
import { useStore } from './state/store'
import { TopBar } from './components/shell/TopBar'
import { NavRail } from './components/shell/NavRail'
import { BottomBar } from './components/shell/BottomBar'
import { SafetyGate } from './components/shell/SafetyGate'
import { SlideOver } from './components/shell/SlideOver'
import { CommandPalette } from './components/shell/CommandPalette'

export default function App() {
  useStateSync()
  const navigate = useNavigate()
  const { state } = useStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      const map: Record<string, string> = {
        '`': '/', '0': '/', '!': '/momentum', '@': '/work', '#': '/ops', '$': '/os',
      }
      if (map[e.key]) { e.preventDefault(); navigate(map[e.key]) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])

  if (!state) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--muted)', fontSize: 13 }}>
        Loading ROS state…
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <NavRail />
        <main style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
          <Suspense fallback={<div style={{ color: 'var(--muted)', padding: 32 }}>Loading…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <BottomBar />
      <SafetyGate />
      <SlideOver />
      <CommandPalette />
    </div>
  )
}
