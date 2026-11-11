import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { addMonths, formatLong, formatMonth, monthGrid, parseKey } from '../lib/dates'
import { allMedia } from '../lib/db'
import { useApp } from '../state'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function Archive() {
  const { today, entries, streaks } = useApp()
  const navigate = useNavigate()
  const now = parseKey(today)
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [thumbs, setThumbs] = useState<Record<string, string>>({})

  // First image of each day becomes that day's thumbnail.
  useEffect(() => {
    let urls: string[] = []
    void (async () => {
      const first: Record<string, string> = {}
      for (const m of (await allMedia()).sort((a, b) => a.createdAt - b.createdAt)) {
        if (!first[m.date]) {
          const u = URL.createObjectURL(m.blob)
          urls.push(u)
          first[m.date] = u
        }
      }
      setThumbs(first)
    })()
    return () => urls.forEach(URL.revokeObjectURL)
  }, [entries])

  const cells = useMemo(() => monthGrid(view.year, view.month), [view])
  const monthPrefix = `${view.year}-${String(view.month + 1).padStart(2, '0')}`
  const written = (key: string) => {
    const e = entries[key]
    return !!thumbs[key] || (!!e && e.text.trim().length > 0)
  }
  const doneThisMonth = cells.filter((k) => k && k.startsWith(monthPrefix) && written(k)).length
  const atCurrent = view.year === now.getFullYear() && view.month === now.getMonth()

  const open = (key: string) => navigate(key === today ? '/journal' : `/journal/${key}`)

  return (
    <main className="page">
      <header className="page-head">
        <div className="page-head__text">
          <h1>Archive</h1>
          <p>
            {streaks.current > 0 ? `${streaks.current}-day streak` : 'No streak yet'}
            {streaks.longest > 0 ? ` · best ${streaks.longest}` : ''}
          </p>
        </div>
      </header>

      <section className="calendar" aria-label="Calendar">
        <div className="calendar__head">
          <button type="button" className="icon-btn" aria-label="Previous month" onClick={() => setView((v) => addMonths(v.year, v.month, -1))}>
            <Icon name="back" />
          </button>
          <h2 aria-live="polite">{formatMonth(view.year, view.month)}</h2>
          <button type="button" className="icon-btn" aria-label="Next month" disabled={atCurrent} onClick={() => setView((v) => addMonths(v.year, v.month, 1))}>
            <Icon name="next" />
          </button>
        </div>

        <div className="calendar__grid">
          {WEEKDAYS.map((d) => (
            <div key={d} className="calendar__dow" aria-hidden="true">{d}</div>
          ))}
          {cells.map((key, i) => {
            if (!key) return <div key={`b${i}`} aria-hidden="true" />
            const e = entries[key]
            const future = key > today
            const day = parseKey(key).getDate()
            const hasThumb = thumbs[key]
            const done = e?.counted
            const touched = written(key)
            return (
              <button
                key={key}
                type="button"
                disabled={future}
                className={`day ${key === today ? 'day--today' : ''} ${done ? 'day--done' : ''} ${touched && !done ? 'day--draft' : ''} ${hasThumb ? 'day--img' : ''}`}
                onClick={() => open(key)}
                aria-label={`${formatLong(key)}${done ? ', entry saved' : touched ? ', written, not counted in streak' : ''}`}
              >
                {hasThumb && <img src={thumbs[key]} alt="" />}
                <span className="day__n">{day}</span>
                {!hasThumb && touched && <span className="day__mark" aria-hidden="true" />}
              </button>
            )
          })}
        </div>

        <p className="calendar__legend">
          <span className="legend legend--done" /> counted <span className="legend legend--draft" /> written, not counted
        </p>
        <p className="calendar__foot">
          {doneThisMonth === 0 ? 'No entries this month yet.' : `${doneThisMonth} ${doneThisMonth === 1 ? 'day' : 'days'} written this month.`}
        </p>
      </section>
    </main>
  )
}
