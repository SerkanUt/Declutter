import { Link, useParams } from 'react-router-dom'
import { EntryEditor } from '../components/EntryEditor'
import { PageHeader } from '../components/PageHeader'
import { StreakBadge } from '../components/StreakBadge'
import { addDays, formatLong, formatShort } from '../lib/dates'
import { useApp } from '../state'

function Recent({ current }: { current: string }) {
  const { entries, today } = useApp()
  const rows = []
  for (let i = 0; i < 14 && rows.length < 5; i++) {
    const key = addDays(today, -i)
    const e = entries[key]
    if (key !== current && e && e.text.trim()) rows.push(e)
  }
  if (rows.length === 0) return null
  return (
    <section className="recent" aria-labelledby="recent-h">
      <h2 id="recent-h">Recent entries</h2>
      <ul>
        {rows.map((e) => (
          <li key={e.date}>
            <Link to={e.date === today ? '/journal' : `/journal/${e.date}`}>
              <span className="recent__date">{e.date === today ? 'Today' : formatShort(e.date)}</span>
              <span className="recent__text">{e.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Journal() {
  const { today } = useApp()
  const { date = today } = useParams()
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(date) && date <= today
  const key = valid ? date : today
  const isToday = key === today
  return (
    <main className="page page--journal">
      <PageHeader
        back={!isToday}
        title={isToday ? 'Journal' : formatLong(key)}
        sub={isToday ? formatLong(key) : 'Past entry'}
        right={<StreakBadge />}
      />
      <EntryEditor key={key} date={key} variant="full" />
      <Recent current={key} />
    </main>
  )
}
