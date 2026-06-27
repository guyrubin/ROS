import { formatDistanceToNow, parseISO, differenceInDays, isValid, format } from 'date-fns'

export function timeAgo(iso: string): string {
  if (!iso) return '—'
  try {
    const d = parseISO(iso)
    if (!isValid(d)) return '—'
    return formatDistanceToNow(d, { addSuffix: true })
  } catch {
    return '—'
  }
}

export function daysAgo(iso: string): number {
  if (!iso) return 999
  try {
    const d = parseISO(iso)
    if (!isValid(d)) return 999
    return differenceInDays(new Date(), d)
  } catch {
    return 999
  }
}

export function freshnessColor(iso: string): string {
  const d = daysAgo(iso)
  if (d < 7)  return 'var(--rag-green)'
  if (d < 14) return 'var(--rag-amber)'
  return 'var(--rag-red)'
}

export function freshnessLabel(iso: string): string {
  if (!iso) return 'Never written'
  const d = daysAgo(iso)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  return `${d} days ago`
}

export function formatTime(iso: string): string {
  if (!iso) return ''
  try {
    return format(parseISO(iso), 'HH:mm')
  } catch {
    return iso
  }
}

export function formatDate(iso: string): string {
  if (!iso) return ''
  try {
    return format(parseISO(iso), 'dd MMM')
  } catch {
    return iso
  }
}

export function eur(amount: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)
}
