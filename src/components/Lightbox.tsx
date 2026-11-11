import { useEffect, useState } from 'react'
import { Icon } from './Icon'
import type { MediaItem } from '../hooks/useEntry'

export function Lightbox({ item, onClose, onDelete }: { item: MediaItem; onClose: () => void; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.kind === 'sketch' ? 'Sketch' : 'Photo'} onClick={onClose}>
      <div className="lightbox__bar" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-btn icon-btn--light" onClick={onClose} aria-label="Close">
          <Icon name="close" />
        </button>
        {confirming ? (
          <div className="confirm-pill" role="alertdialog" aria-label="Confirm delete">
            <span>Delete this image?</span>
            <button type="button" className="btn btn--sm btn--light" onClick={() => setConfirming(false)}>Keep</button>
            <button type="button" className="btn btn--sm btn--danger" onClick={onDelete} autoFocus>Delete</button>
          </div>
        ) : (
          <button type="button" className="icon-btn icon-btn--light" onClick={() => setConfirming(true)} aria-label="Delete image">
            <Icon name="trash" />
          </button>
        )}
      </div>
      <img src={item.url} alt={item.kind === 'sketch' ? 'Your sketch' : 'Your photo'} onClick={(e) => e.stopPropagation()} />
    </div>
  )
}
