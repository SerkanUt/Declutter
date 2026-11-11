import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { useApp } from '../state'

export function StreakBadge() {
  const { streaks } = useApp()
  const prev = useRef(streaks.current)
  const [bump, setBump] = useState(false)

  // little bounce when the streak goes up after saving (not on first render)
  useEffect(() => {
    if (streaks.current > prev.current) {
      setBump(true)
      const t = setTimeout(() => setBump(false), 700)
      prev.current = streaks.current
      return () => clearTimeout(t)
    }
    prev.current = streaks.current
  }, [streaks.current])

  const n = streaks.current
  return (
    <div
      className={`streak ${n > 0 ? 'streak--on' : ''} ${streaks.doneToday ? 'streak--done' : ''} ${bump ? 'streak--bump' : ''}`}
      aria-label={`${n} day streak${streaks.doneToday ? ', today done' : ''}`}
      role="status"
    >
      <Icon name="flame" size={18} />
      <span className="streak__n">{n}</span>
    </div>
  )
}
