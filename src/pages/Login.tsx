import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { useApp } from '../state'

export function Login() {
  const { ready, profile, unlocked, signIn, signUp } = useApp()
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!ready) return null
  if (unlocked && profile) return <Navigate to="/" replace />

  const creating = !profile

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (creating && name.trim().length < 1) return setError('Add a name so the journal knows it’s yours.')
    if (!/^\d{4,8}$/.test(pin)) return setError('Use a PIN of 4 to 8 digits.')
    setBusy(true)
    try {
      if (creating) await signUp(name, pin)
      else if (!(await signIn(pin))) setError('That PIN doesn’t match. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="login">
      <div className="login__brand">
        <Logo size={56} />
        <span className="login__name">Decluttered</span>
      </div>

      <h1 className="login__headline">
        Artblock?
        <br />
        <em>Never exists.</em>
        <br />
        Record, write, create.
      </h1>

      <p className="login__how">
        Four new words every morning. Write what they spark, add a photo or a sketch, and keep the streak going.
      </p>

      <form className="login__form" onSubmit={submit} noValidate>
        {creating ? (
          <div className="field">
            <label htmlFor="name">Your name</label>
            <input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Frida" />
          </div>
        ) : (
          <p className="login__welcome">Welcome back, {profile.name}.</p>
        )}
        <div className="field">
          <label htmlFor="pin">{creating ? 'Choose a PIN' : 'PIN'}</label>
          <input
            id="pin"
            type="password"
            inputMode="numeric"
            autoComplete={creating ? 'new-password' : 'current-password'}
            maxLength={8}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="4 to 8 digits"
            aria-describedby={error ? 'login-error' : undefined}
            aria-invalid={!!error}
          />
        </div>
        {error && <p id="login-error" className="field-error" role="alert">{error}</p>}
        <button className="btn btn--primary btn--block" disabled={busy}>
          {creating ? 'Start journaling' : 'Log in'}
        </button>
        {creating && <p className="login__note">Your journal stays on this device. The PIN only keeps it private here.</p>}
      </form>
    </main>
  )
}
