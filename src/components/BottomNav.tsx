import { NavLink } from 'react-router-dom'
import { Icon, type IconName } from './Icon'

const TABS: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/journal', label: 'Journal', icon: 'journal' },
  { to: '/archive', label: 'Archive', icon: 'archive' },
  { to: '/user', label: 'User', icon: 'user' },
]

export function BottomNav() {
  return (
    <nav className="nav" aria-label="Main">
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.end} className="nav__tab">
          <span className="nav__icon"><Icon name={t.icon} /></span>
          <span className="nav__label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
