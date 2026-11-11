import { getProfile, saveProfile, type Profile } from './db'

// A local convenience lock, not real security: it keeps the journal behind a PIN on this device.
const enc = new TextEncoder()
const toHex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')

async function hashPin(pin: string, saltHex: string): Promise<string> {
  const salt = Uint8Array.from(saltHex.match(/../g)!.map((h) => parseInt(h, 16)))
  const key = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120_000, hash: 'SHA-256' }, key, 256)
  return toHex(bits)
}

export async function createProfile(name: string, pin: string): Promise<Profile> {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer)
  const profile: Profile = { name: name.trim(), salt, hash: await hashPin(pin, salt), createdAt: Date.now() }
  await saveProfile(profile)
  return profile
}

export async function checkPin(pin: string): Promise<Profile | null> {
  const p = await getProfile()
  if (!p) return null
  return (await hashPin(pin, p.salt)) === p.hash ? p : null
}

const FLAG = 'decluttered.unlocked'
export const isUnlocked = () => {
  try { return localStorage.getItem(FLAG) === '1' } catch { return false }
}
export const setUnlocked = (v: boolean) => {
  try { v ? localStorage.setItem(FLAG, '1') : localStorage.removeItem(FLAG) } catch { /* private mode: stay session-only */ }
}
