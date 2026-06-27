/* Parses a GFM markdown table into an array of row objects.
   Used by agents writing to state.json — not called from the browser directly. */

export function parseMarkdownTable(md: string): Record<string, string>[] {
  const lines = md.split('\n').map((l) => l.trim()).filter(Boolean)
  const tableLines = lines.filter((l) => l.startsWith('|'))
  if (tableLines.length < 2) return []

  const headers = tableLines[0]
    .split('|')
    .map((h) => h.trim())
    .filter(Boolean)

  const rows: Record<string, string>[] = []
  for (let i = 2; i < tableLines.length; i++) {
    const cells = tableLines[i]
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean)
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = cells[idx] ?? ''
    })
    rows.push(row)
  }
  return rows
}

/* Checks if a markdown section is an unfilled placeholder (comment-only) */
export function isPlaceholder(sectionContent: string): boolean {
  const stripped = sectionContent.replace(/<!--.*?-->/gs, '').trim()
  return stripped.length === 0
}
