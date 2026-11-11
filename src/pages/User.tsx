import { useState } from 'react'
import { Icon } from '../components/Icon'
import { PageHeader } from '../components/PageHeader'
import { useToast } from '../components/Toast'
import { allMedia, wipeAll } from '../lib/db'
import { useApp } from '../state'

const toDataUrl = (blob: Blob) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result as string)
    r.onerror = () => rej(r.error)
    r.readAsDataURL(blob)
  })

export function User() {
  const { profile, entries, streaks, signOut } = useApp()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const total = Object.values(entries).filter((e) => e.counted).length

  const exportAll = async () => {
    setBusy(true)
    try {
      const media = await Promise.all(
        (await allMedia()).map(async (m) => ({ id: m.id, date: m.date, kind: m.kind, createdAt: m.createdAt, image: await toDataUrl(m.blob) })),
      )
      const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), profile: profile?.name, entries: Object.values(entries), media }, null, 2)], { type: 'application/json' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `decluttered-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
      toast('Exported your journal.')
    } finally {
      setBusy(false)
    }
  }

  const erase = async () => {
    if (!window.confirm('Erase your whole journal, images and profile from this device? This can’t be undone.')) return
    await wipeAll()
    signOut()
    window.location.reload()
  }

  return (
    <main className="page">
      <PageHeader title="You" />
      <section className="profile">
        <div className="avatar" aria-hidden="true">{(profile?.name ?? '?').slice(0, 1).toUpperCase()}</div>
        <div>
          <p className="profile__name">{profile?.name}</p>
          <p className="profile__meta">
            {streaks.current}-day streak · best {streaks.longest} · {total} {total === 1 ? 'entry' : 'entries'}
          </p>
        </div>
      </section>

      <ul className="menu">
        <li>
          <button type="button" className="menu__row" onClick={exportAll} disabled={busy}>
            <Icon name="download" /> <span>Export journal<small>Entries and images as one file you keep</small></span>
          </button>
        </li>
        <li>
          <button type="button" className="menu__row" onClick={signOut}>
            <Icon name="logout" /> <span>Log out<small>Lock the journal with your PIN</small></span>
          </button>
        </li>
        <li>
          <button type="button" className="menu__row menu__row--danger" onClick={erase}>
            <Icon name="trash" /> <span>Erase everything<small>Removes all data from this device</small></span>
          </button>
        </li>
      </ul>

      <p className="fine">Your journal lives only on this device. Export now and then so a cleared browser doesn’t take it with it.</p>
    </main>
  )
}
