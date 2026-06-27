import type { ActionQueueItem } from '../state/types'

/* Format actionQueue items in AGENT-SYNC paste format */
export function formatQueueForAgent(items: ActionQueueItem[]): string {
  if (!items.length) return '(empty queue)'
  return items
    .filter((i) => i.status === 'pending')
    .map(
      (i) =>
        `[${i.safety}] ${i.verb} (${i.domain ?? 'cross'}) — ${JSON.stringify(i.args)}`
    )
    .join('\n')
}

export async function copyQueueToClipboard(items: ActionQueueItem[]): Promise<void> {
  const text = formatQueueForAgent(items)
  await navigator.clipboard.writeText(text)
}

/* Obsidian deep link helper */
export function obsLink(path: string): string {
  return `obsidian://open?vault=ROS&file=${encodeURIComponent(path)}`
}
