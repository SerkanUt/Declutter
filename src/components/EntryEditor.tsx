import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { Lightbox } from './Lightbox'
import { SketchCanvas } from './SketchCanvas'
import { useToast } from './Toast'
import { WordChips } from './WordChips'
import { useEntry } from '../hooks/useEntry'
import { wordsForDate } from '../lib/words'
import { useApp } from '../state'

interface Props {
  date: string
  variant: 'compact' | 'full'
}

export function EntryEditor({ date, variant }: Props) {
  const entry = useEntry(date)
  const { streaks, today } = useApp()
  const toast = useToast()
  const words = wordsForDate(date)
  const area = useRef<HTMLTextAreaElement>(null)
  const file = useRef<HTMLInputElement>(null)
  const [sketching, setSketching] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const opened = entry.media.find((m) => m.id === openId) ?? null
  const full = variant === 'full'

  // Where to put the caret after a word is inserted. Applied right after React commits the new text,
  // so fast typing can't race it.
  const pendingCaret = useRef<number | null>(null)
  useLayoutEffect(() => {
    const el = area.current
    if (pendingCaret.current === null || !el) return
    el.focus()
    el.setSelectionRange(pendingCaret.current, pendingCaret.current)
    pendingCaret.current = null
  }, [entry.text])

  const insertWord = (word: string) => {
    const el = area.current
    const t = entry.text
    const start = el?.selectionStart ?? t.length
    const end = el?.selectionEnd ?? t.length
    const before = t.slice(0, start)
    const needsSpace = before.length > 0 && !/\s$/.test(before)
    const insert = `${needsSpace ? ' ' : ''}${word} `
    pendingCaret.current = before.length + insert.length
    entry.setText(before + insert + t.slice(end))
  }

  const onSave = async () => {
    if (!entry.hasContent) return toast('Write a line or add an image first.')
    const newly = await entry.save()
    if (!entry.canCount) return toast('Saved. Only today’s entry adds to your streak.')
    // streaks.current is updated by the app state after the save; compute the optimistic number.
    const next = newly ? streaks.current + 1 : streaks.current
    toast(newly ? `Saved. Day ${next} of your streak.` : 'Saved.')
  }

  return (
    <div className={`editor editor--${variant}`}>
      <WordChips words={words} text={entry.text} onPick={insertWord} compact={full} />

      <div className="writer">
        <label className="sr-only" htmlFor={`text-${variant}`}>Your writing for {date}</label>
        <textarea
          id={`text-${variant}`}
          ref={area}
          value={entry.text}
          onChange={(e) => entry.setText(e.target.value)}
          placeholder="Write a thought, or describe an image…"
          disabled={!entry.loaded}
          enterKeyHint="enter"
        />
        {!full && (
          <Link to={`/journal${date === today ? '' : '/' + date}`} className="icon-btn writer__expand" aria-label="Open in Journal">
            <Icon name="expand" size={20} />
          </Link>
        )}
      </div>

      {entry.media.length > 0 && (
        <ul className="strip" aria-label="Images in this entry">
          {entry.media.map((m) => (
            <li key={m.id}>
              <button type="button" className="strip__item" onClick={() => setOpenId(m.id)} aria-label={`Open ${m.kind}`}>
                <img src={m.url} alt="" />
              </button>
            </li>
          ))}
          {full && (
            <li>
              <Link to={`/photos${date === today ? '' : '/' + date}`} className="strip__item strip__more" aria-label={`View all ${entry.media.length} images`}>
                <Icon name="expand" size={22} />
                <span>View all</span>
              </Link>
            </li>
          )}
        </ul>
      )}

      {entry.canCount && entry.hasContent && !entry.counted && (
        <p className="hint">Draft kept on this device. Press Save to count today toward your streak.</p>
      )}

      <div className="actions">
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
        <button type="button" className="btn btn--soft" aria-label="Add image" onClick={() => file.current?.click()}>
          <Icon name="image" size={20} /> <span className="lbl lbl--long">Add image</span><span className="lbl lbl--short">Image</span>
        </button>
        <button type="button" className="btn btn--soft" aria-label="Add sketch" onClick={() => setSketching(true)}>
          <Icon name="pencil" size={20} /> <span className="lbl lbl--long">Add sketch</span><span className="lbl lbl--short">Sketch</span>
        </button>
        <button type="button" className="btn btn--primary actions__save" onClick={onSave}>
          <Icon name="check" size={20} /> {entry.counted ? 'Saved' : 'Save'}
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
    </div>
  )
}
