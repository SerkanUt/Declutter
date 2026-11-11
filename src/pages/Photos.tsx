import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Lightbox } from '../components/Lightbox'
import { PageHeader } from '../components/PageHeader'
import { SketchCanvas } from '../components/SketchCanvas'
import { useEntry } from '../hooks/useEntry'
import { formatLong } from '../lib/dates'
import { useApp } from '../state'

export function Photos() {
  const { today } = useApp()
  const { date = today } = useParams()
  const key = /^\d{4}-\d{2}-\d{2}$/.test(date) && date <= today ? date : today
  const entry = useEntry(key)
  const file = useRef<HTMLInputElement>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [sketching, setSketching] = useState(false)
  const opened = entry.media.find((m) => m.id === openId) ?? null

  return (
    <main className="page">
      <PageHeader back title="Photos" sub={formatLong(key)} />

      {entry.loaded && entry.media.length === 0 ? (
        <div className="empty">
          <p className="empty__title">Nothing here yet.</p>
          <p>Photograph your sketchbook, a painting in progress, or anything the words made you think of.</p>
        </div>
      ) : (
        <ul className="masonry">
          {entry.media.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => setOpenId(m.id)} aria-label={`Open ${m.kind}`}>
                <img src={m.url} alt={m.kind === 'sketch' ? 'Sketch' : 'Photo'} loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="actions actions--sticky">
        <input
          ref={file}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={async (e) => {
            if (e.target.files?.length) await entry.addFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <button type="button" className="btn btn--soft" onClick={() => setSketching(true)}>
          <Icon name="pencil" size={20} /> Sketch
        </button>
        <button type="button" className="btn btn--primary actions__save" onClick={() => file.current?.click()}>
          <Icon name="plus" size={20} /> Add
        </button>
      </div>

      {sketching && (
        <SketchCanvas
          onCancel={() => setSketching(false)}
          onDone={async (png) => {
            setSketching(false)
            await entry.addSketch(png)
          }}
        />
      )}
      {opened && <Lightbox item={opened} onClose={() => setOpenId(null)} onDelete={async () => { await entry.removeMedia(opened.id); setOpenId(null) }} />}
    </main>
  )
}
