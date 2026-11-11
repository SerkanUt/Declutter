import { describe, expect, it } from 'vitest'
import { addDays, addMonths, dayNumber, monthGrid, toKey } from './dates'
import { computeStreaks } from './streak'
import { KINDS, wordsForDate } from './words'

describe('dates', () => {
  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
    expect(addDays('2025-12-31', 1)).toBe('2026-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(addDays('2024-03-01', -1)).toBe('2024-02-29')
  })

  it('counts calendar days correctly across DST changes', () => {
    // US spring forward (2026-03-08) and fall back (2026-11-01)
    expect(dayNumber('2026-03-09') - dayNumber('2026-03-08')).toBe(1)
    expect(dayNumber('2026-11-02') - dayNumber('2026-11-01')).toBe(1)
    expect(addDays('2026-03-07', 2)).toBe('2026-03-09')
    expect(addDays('2026-10-31', 2)).toBe('2026-11-02')
  })

  it('formats keys with local time', () => {
    expect(toKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('wraps months', () => {
    expect(addMonths(2026, 11, 1)).toEqual({ year: 2027, month: 0 })
    expect(addMonths(2026, 0, -1)).toEqual({ year: 2025, month: 11 })
  })

  it('builds Sunday-first month grids in whole weeks', () => {
    const grid = monthGrid(2026, 10) // November 2026 starts on a Sunday
    expect(grid.length % 7).toBe(0)
    expect(grid[0]).toBe('2026-11-01')
    expect(grid.filter(Boolean)).toHaveLength(30)
    const feb = monthGrid(2026, 1) // February 2026 starts on a Sunday, 28 days
    expect(feb).toHaveLength(28)
  })
})

describe('streaks', () => {
  const today = '2026-11-09'

  it('is zero with no entries', () => {
    expect(computeStreaks([], today)).toEqual({ current: 0, longest: 0, doneToday: false })
  })

  it('keeps the streak alive when today is not done yet', () => {
    const s = computeStreaks(['2026-11-07', '2026-11-08'], today)
    expect(s.current).toBe(2)
    expect(s.doneToday).toBe(false)
  })

  it('includes today when done', () => {
    const s = computeStreaks(['2026-11-07', '2026-11-08', '2026-11-09'], today)
    expect(s.current).toBe(3)
    expect(s.doneToday).toBe(true)
  })

  it('breaks after a missed day', () => {
    const s = computeStreaks(['2026-11-05', '2026-11-06', '2026-11-07'], today)
    expect(s.current).toBe(0)
    expect(s.longest).toBe(3)
  })

  it('tracks the longest run separately from the current one', () => {
    const s = computeStreaks(['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-11-09'], today)
    expect(s.longest).toBe(4)
    expect(s.current).toBe(1)
  })

  it('runs across month, year and DST boundaries', () => {
    const days = ['2025-12-30', '2025-12-31', '2026-01-01', '2026-03-07', '2026-03-08', '2026-03-09']
    expect(computeStreaks(days, '2026-03-09').current).toBe(3)
    expect(computeStreaks(days, '2026-03-09').longest).toBe(3)
  })
})

describe('daily words', () => {
  it('returns one word per category, deterministically', () => {
    const a = wordsForDate('2026-11-09')
    const b = wordsForDate('2026-11-09')
    expect(a).toEqual(b)
    expect(a.map((w) => w.kind)).toEqual(KINDS)
    expect(a.every((w) => w.word.length > 0)).toBe(true)
  })

  it('changes day to day', () => {
    const a = wordsForDate('2026-11-09').map((w) => w.word).join('|')
    const b = wordsForDate('2026-11-10').map((w) => w.word).join('|')
    expect(a).not.toBe(b)
  })

  it('does not repeat a category word on consecutive days', () => {
    for (let i = 0; i < 60; i++) {
      const d1 = wordsForDate(addDays('2026-01-01', i))
      const d2 = wordsForDate(addDays('2026-01-01', i + 1))
      d1.forEach((w, j) => expect(w.word).not.toBe(d2[j].word))
    }
  })
})
