// All dates are local calendar days as "YYYY-MM-DD" keys.
// We never divide milliseconds by 86,400,000 on local times, because DST makes days 23 or 25 hours long.

const pad = (n: number) => String(n).padStart(2, '0')

export function toKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Whole days since 1970-01-01 for a key. Uses UTC so DST can't shift it. */
export function dayNumber(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000)
}

export function addDays(key: string, n: number): string {
  const d = parseKey(key)
  d.setDate(d.getDate() + n)
  return toKey(d)
}

export function addMonths(year: number, month: number, n: number): { year: number; month: number } {
  const total = year * 12 + month + n
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 }
}

/** Sunday-first month grid (like the wireframe). Null cells pad the first and last week. */
export function monthGrid(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1)
  const count = new Date(year, month + 1, 0).getDate()
  const cells: (string | null)[] = Array(first.getDay()).fill(null)
  for (let day = 1; day <= count; day++) cells.push(toKey(new Date(year, month, day)))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function formatLong(key: string): string {
  return parseKey(key).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

export function formatMonth(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export function formatShort(key: string): string {
  return parseKey(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
