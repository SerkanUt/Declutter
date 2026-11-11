import { addDays } from './dates'

export interface Streaks {
  current: number
  longest: number
  doneToday: boolean
}

/**
 * `days` = dates that count toward the streak.
 * If today isn't done yet we count back from yesterday, so the streak
 * only breaks once midnight passes with nothing saved.
 */
export function computeStreaks(days: Iterable<string>, today: string): Streaks {
  const set = new Set(days)

  let longest = 0
  let run = 0
  let prev: string | null = null
  for (const d of [...set].sort()) {
    run = prev !== null && addDays(prev, 1) === d ? run + 1 : 1
    longest = Math.max(longest, run)
    prev = d
  }

  let cursor = set.has(today) ? today : addDays(today, -1)
  let current = 0
  while (set.has(cursor)) {
    current++
    cursor = addDays(cursor, -1)
  }

  return { current, longest, doneToday: set.has(today) }
}
