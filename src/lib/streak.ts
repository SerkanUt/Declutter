import { addDays } from './dates'

export interface Streaks {
  current: number
  longest: number
  doneToday: boolean
}

/**
 * `days` are the dates that count toward the streak.
 * The current streak stays alive through today: if today isn't done yet, it counts back from yesterday,
 * so an empty today never breaks yesterday's run until midnight passes.
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
