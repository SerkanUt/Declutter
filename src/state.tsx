import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { checkPin, createProfile, isUnlocked, setUnlocked } from './lib/auth'
import { allEntries, getProfile, type Entry, type Profile } from './lib/db'
import { toKey } from './lib/dates'
import { computeStreaks, type Streaks } from './lib/streak'

interface AppState {
  ready: boolean
  profile: Profile | null
  unlocked: boolean
  today: string
  entries: Record<string, Entry>
  streaks: Streaks
  reloadEntries: () => Promise<void>
  signUp: (name: string, pin: string) => Promise<void>
  signIn: (pin: string) => Promise<boolean>
  signOut: () => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [unlocked, setUnlockedState] = useState(isUnlocked())
  const [entries, setEntries] = useState<Record<string, Entry>>({})
  const [today, setToday] = useState(toKey())

  const reloadEntries = useCallback(async () => {
    const list = await allEntries()
    setEntries(Object.fromEntries(list.map((e) => [e.date, e])))
  }, [])

  useEffect(() => {
    void (async () => {
      setProfile((await getProfile()) ?? null)
      await reloadEntries()
      setReady(true)
    })()
  }, [reloadEntries])

  // Roll "today" over at midnight, and when the app comes back to the foreground.
  useEffect(() => {
    const tick = () => setToday((t) => (toKey() === t ? t : toKey()))
    const id = setInterval(tick, 30_000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])

  const streaks = useMemo(
    () => computeStreaks(Object.values(entries).filter((e) => e.counted).map((e) => e.date), today),
    [entries, today],
  )

  const value: AppState = {
    ready, profile, unlocked, today, entries, streaks, reloadEntries,
    signUp: async (name, pin) => {
      setProfile(await createProfile(name, pin))
      setUnlocked(true)
      setUnlockedState(true)
    },
    signIn: async (pin) => {
      const p = await checkPin(pin)
      if (!p) return false
      setProfile(p)
      setUnlocked(true)
      setUnlockedState(true)
      return true
    },
    signOut: () => {
      setUnlocked(false)
      setUnlockedState(false)
    },
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside <AppProvider>')
  return v
}
