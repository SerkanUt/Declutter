import pool from '../data/words.json'
import { dayNumber } from './dates'

export type WordKind = 'color' | 'movie' | 'object' | 'place'
export const KINDS: WordKind[] = ['color', 'movie', 'object', 'place']

export interface DailyWord {
  kind: WordKind
  word: string
}

const pools = pool as Record<WordKind, string[]>

/**
 * The 4 words for a date, one per category. The pools were shuffled once at build time and we
 * just walk through them by day number, so everyone gets the same words on the same day and
 * nothing has to be stored. A word won't repeat until its whole list is used up.
 * The offset stops all four categories from lining up.
 */
export function wordsForDate(key: string): DailyWord[] {
  const n = dayNumber(key)
  return KINDS.map((kind, i) => {
    const list = pools[kind]
    const idx = (((n + i * 7) % list.length) + list.length) % list.length
    return { kind, word: list[idx] }
  })
}

export const KIND_LABEL: Record<WordKind, string> = {
  color: 'Color',
  movie: 'Movie',
  object: 'Object',
  place: 'Place',
}
