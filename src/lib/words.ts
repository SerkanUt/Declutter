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
 * The 4 words for a date: one per category, picked from the build-time Wikipedia pool.
 * Deterministic (the pools were shuffled once at build time), so every user sees the same words
 * on a given day, past days always show the right words, and nothing needs to be stored.
 * Each pool walks its list in order, so a word doesn't repeat until the whole list has been used.
 * The offset keeps the four categories from cycling in lockstep.
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
