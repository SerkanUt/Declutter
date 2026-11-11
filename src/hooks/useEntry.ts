import { useCallback, useEffect, useRef, useState } from 'react'
import { addMedia, deleteMedia, getEntry, mediaForDate, putEntry, type Media, type MediaKind } from '../lib/db'
import { downscale } from '../lib/images'
import { useApp } from '../state'

export interface MediaItem extends Media {
  url: string
}

/** Loads one day's entry and keeps it saved as the user types and adds media. */
export function useEntry(date: string) {
  const { today, entries, reloadEntries } = useApp()
  const [text, setTextState] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const latest = useRef({ text: '', date })
  const urls = useRef<string[]>([])

  const toItems = (list: Media[]): MediaItem[] =>
    list.map((m) => {
      const url = URL.createObjectURL(m.blob)
      urls.current.push(url)
      return { ...m, url }
    })

  // (Re)load whenever the date changes.
  useEffect(() => {
    let alive = true
    setLoaded(false)
    void (async () => {
      const [entry, list] = await Promise.all([getEntry(date), mediaForDate(date)])
      if (!alive) return
      urls.current.forEach(URL.revokeObjectURL)
      urls.current = []
      latest.current = { text: entry?.text ?? '', date }
      setTextState(entry?.text ?? '')
      setMedia(toItems(list))
      setLoaded(true)
    })()
    return () => {
      alive = false
    }
  }, [date])

  useEffect(() => () => urls.current.forEach(URL.revokeObjectURL), [])

  const persist = useCallback(
    async (patch?: { counted?: boolean }) => {
      const { text: t, date: d } = latest.current
      const prev = await getEntry(d)
      const now = Date.now()
      // A day with nothing left in it (text and images all removed) can't hold a streak.
      const hasAny = t.trim().length > 0 || (await mediaForDate(d)).length > 0
      await putEntry({
        date: d,
        text: t,
        counted: hasAny ? (patch?.counted ?? prev?.counted ?? false) : false,
        savedAt: patch?.counted ? now : prev?.savedAt,
        updatedAt: now,
      })
      await reloadEntries()
    },
    [reloadEntries],
  )

  // Flush a pending autosave if the user leaves mid-typing.
  useEffect(() => {
    const flush = () => {
      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = undefined
        void persist()
      }
    }
    window.addEventListener('pagehide', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [persist])

  const setText = (t: string) => {
    setTextState(t)
    latest.current = { text: t, date }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      timer.current = undefined
      void persist()
    }, 500)
  }

  const addFiles = async (files: FileList | File[]) => {
    const added: Media[] = []
    for (const f of Array.from(files)) {
      if (!f.type.startsWith('image/')) continue
      added.push(await addMedia(date, 'photo', await downscale(f)))
    }
    setMedia((m) => [...m, ...toItems(added)])
    await persist()
  }

  const addSketch = async (blob: Blob) => {
    const item = await addMedia(date, 'sketch' satisfies MediaKind, blob)
    setMedia((m) => [...m, ...toItems([item])])
    await persist()
  }

  const removeMedia = async (id: string) => {
    await deleteMedia(id)
    setMedia((m) => m.filter((x) => x.id !== id))
    await persist()
  }

  const hasContent = text.trim().length > 0 || media.length > 0
  const entry = entries[date]
  const counted = entry?.counted ?? false
  const canCount = date === today

  /** Marks the day complete. Only today's entry can extend the streak. Returns true when this save newly counted. */
  const save = async (): Promise<boolean> => {
    clearTimeout(timer.current)
    timer.current = undefined
    if (!hasContent) return false // nothing to save; don't write an empty record
    const newly = canCount && !counted
    await persist(canCount ? { counted: true } : undefined)
    return newly
  }

  return { loaded, text, setText, media, addFiles, addSketch, removeMedia, hasContent, counted, canCount, save }
}
