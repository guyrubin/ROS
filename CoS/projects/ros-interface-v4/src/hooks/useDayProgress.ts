import { useState, useEffect } from 'react'

const DAY_START = 7   // 07:00
const DAY_END   = 19  // 19:00

function calcProgress(): number {
  const now = new Date()
  const ams = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' }))
  const h = ams.getHours() + ams.getMinutes() / 60
  const pct = ((h - DAY_START) / (DAY_END - DAY_START)) * 100
  return Math.min(100, Math.max(0, pct))
}

export function useDayProgress() {
  const [progress, setProgress] = useState(calcProgress)
  useEffect(() => {
    const id = setInterval(() => setProgress(calcProgress()), 60_000)
    return () => clearInterval(id)
  }, [])
  return progress
}
