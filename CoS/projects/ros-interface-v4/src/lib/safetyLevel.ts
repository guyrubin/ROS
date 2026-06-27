import type { SafetyLevel } from '../state/types'

export const SAFETY_LABELS: Record<SafetyLevel, string> = {
  0: 'Auto',
  1: 'Auto',
  2: 'Auto',
  3: 'Confirm',
  4: 'Financial',
  5: 'Irreversible',
}

export const SAFETY_COLORS: Record<SafetyLevel, string> = {
  0: 'var(--faint)',
  1: 'var(--faint)',
  2: 'var(--muted)',
  3: 'var(--blue)',
  4: 'var(--amber)',
  5: 'var(--red)',
}

export function requiresConfirmation(level: SafetyLevel): boolean {
  return level >= 3
}

export function isFinancial(level: SafetyLevel): boolean {
  return level >= 4
}

export function isIrreversible(level: SafetyLevel): boolean {
  return level >= 5
}
