import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from './Icon'

export function BackButton({ fallback = '/' }: { fallback?: string }) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label="Back"
      onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate(fallback))}
    >
      <Icon name="back" />
    </button>
  )
}

export function PageHeader({ title, sub, back, right }: { title: string; sub?: string; back?: boolean; right?: ReactNode }) {
  return (
    <header className="page-head">
      {back && <BackButton />}
      <div className="page-head__text">
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {right}
    </header>
  )
}
