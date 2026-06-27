import { useState, useEffect } from 'react'

const ZONES = [
  { label: 'AMS', tz: 'Europe/Amsterdam' },
  { label: 'BRU', tz: 'Europe/Brussels' },
  { label: 'TLV', tz: 'Asia/Jerusalem' },
]

function getTime(tz: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

export function useClocks() {
  const [times, setTimes] = useState(() =>
    ZONES.map((z) => ({ ...z, time: getTime(z.tz) }))
  )

  useEffect(() => {
    const id = setInterval(() => {
      setTimes(ZONES.map((z) => ({ ...z, time: getTime(z.tz) })))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return times
}
