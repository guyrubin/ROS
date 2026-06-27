export const DOMAIN_COLORS: Record<string, string> = {
  CoS: '#d6a84b',
  KK:  '#67b7ff',
  HV:  '#e8b54a',
  EA:  '#ff6b6b',
  PAI: '#b891ff',
  MKT: '#4fd6c8',
  FIN: '#55d38a',
}

export const DOMAIN_LABELS: Record<string, string> = {
  CoS: 'Chief of Staff',
  KK:  'Personal Ops',
  HV:  'HollandVest',
  EA:  'Enterprise Arch',
  PAI: 'Ventures',
  MKT: 'Marketing',
  FIN: 'Finance',
}

export const DOMAINS = ['CoS', 'KK', 'HV', 'EA', 'PAI', 'MKT', 'FIN'] as const
export type DomainKey = typeof DOMAINS[number]
