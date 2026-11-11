import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

export interface Profile {
  name: string
  salt: string
  hash: string
  createdAt: number
}

export interface Entry {
  date: string // YYYY-MM-DD, the primary key
  text: string
  /** Set when the user presses Save on the entry's own day. Only these days extend the streak. */
  counted: boolean
  savedAt?: number
  updatedAt: number
}

export type MediaKind = 'photo' | 'sketch'

export interface Media {
  id: string
  date: string
  kind: MediaKind
  blob: Blob
  createdAt: number
}

interface Schema extends DBSchema {
  meta: { key: string; value: Profile }
  entries: { key: string; value: Entry }
  media: { key: string; value: Media; indexes: { 'by-date': string } }
}

let dbPromise: Promise<IDBPDatabase<Schema>> | null = null

function db() {
  dbPromise ??= openDB<Schema>('decluttered', 1, {
    upgrade(d) {
      d.createObjectStore('meta')
      d.createObjectStore('entries', { keyPath: 'date' })
      d.createObjectStore('media', { keyPath: 'id' }).createIndex('by-date', 'date')
    },
  })
  return dbPromise
}

export async function getProfile(): Promise<Profile | undefined> {
  return (await db()).get('meta', 'profile')
}
export async function saveProfile(p: Profile) {
  await (await db()).put('meta', p, 'profile')
}

export async function getEntry(date: string): Promise<Entry | undefined> {
  return (await db()).get('entries', date)
}
export async function allEntries(): Promise<Entry[]> {
  return (await db()).getAll('entries')
}
export async function putEntry(e: Entry) {
  await (await db()).put('entries', e)
}

export async function mediaForDate(date: string): Promise<Media[]> {
  const items = await (await db()).getAllFromIndex('media', 'by-date', date)
  return items.sort((a, b) => a.createdAt - b.createdAt)
}
export async function allMedia(): Promise<Media[]> {
  return (await db()).getAll('media')
}
export async function addMedia(date: string, kind: MediaKind, blob: Blob): Promise<Media> {
  const item: Media = { id: crypto.randomUUID(), date, kind, blob, createdAt: Date.now() }
  await (await db()).put('media', item)
  return item
}
export async function deleteMedia(id: string) {
  await (await db()).delete('media', id)
}

export async function wipeAll() {
  const d = await db()
  await Promise.all([d.clear('meta'), d.clear('entries'), d.clear('media')])
}
