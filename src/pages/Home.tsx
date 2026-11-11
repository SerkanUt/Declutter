import { EntryEditor } from '../components/EntryEditor'
import { Logo } from '../components/Logo'
import { StreakBadge } from '../components/StreakBadge'
import { formatLong } from '../lib/dates'
import { useApp } from '../state'

export function Home() {
  const { today, profile } = useApp()
  return (
    <main className="page">
      <div className="topbar">
        <div className="topbar__brand">
          <Logo size={32} />
          <span>Decluttered</span>
        </div>
        <StreakBadge />
      </div>
      <header className="hello">
        <h1>Today’s words</h1>
        <p>{formatLong(today)}{profile ? ` · hi, ${profile.name}` : ''}</p>
      </header>
      <EntryEditor date={today} variant="compact" />
    </main>
  )
}
