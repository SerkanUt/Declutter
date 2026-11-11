import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

type Point = { x: number; y: number }
type Stroke = { color: string; size: number; points: Point[] }

const PAPER = '#fbf8f1'
const COLORS = [
  { name: 'Ink', value: '#1b2033' },
  { name: 'Cobalt', value: '#2a3fc7' },
  { name: 'Vermilion', value: '#d9432b' },
  { name: 'Ochre', value: '#d99a1e' },
  { name: 'Sage', value: '#4f8a63' },
]
const SIZES = [
  { name: 'Fine', value: 2 },
  { name: 'Medium', value: 5 },
  { name: 'Broad', value: 12 },
]

function paint(ctx: CanvasRenderingContext2D, w: number, h: number, strokes: Stroke[], background = true) {
  if (background) {
    ctx.fillStyle = PAPER
    ctx.fillRect(0, 0, w, h)
  }
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const s of strokes) {
    ctx.strokeStyle = s.color
    ctx.fillStyle = s.color
    ctx.lineWidth = s.size
    const p = s.points
    if (p.length === 1) {
      ctx.beginPath()
      ctx.arc(p[0].x, p[0].y, s.size / 2, 0, Math.PI * 2)
      ctx.fill()
      continue
    }
    ctx.beginPath()
    ctx.moveTo(p[0].x, p[0].y)
    for (let i = 1; i < p.length - 1; i++) {
      const mx = (p[i].x + p[i + 1].x) / 2
      const my = (p[i].y + p[i + 1].y) / 2
      ctx.quadraticCurveTo(p[i].x, p[i].y, mx, my)
    }
    ctx.lineTo(p[p.length - 1].x, p[p.length - 1].y)
    ctx.stroke()
  }
}

export function SketchCanvas({ onDone, onCancel }: { onDone: (png: Blob) => void; onCancel: () => void }) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const strokes = useRef<Stroke[]>([])
  const live = useRef<Stroke | null>(null)
  const raf = useRef(0)
  const [color, setColor] = useState(COLORS[0].value)
  const [size, setSize] = useState(SIZES[1].value)
  const [erasing, setErasing] = useState(false)
  const [count, setCount] = useState(0)
  const [discarding, setDiscarding] = useState(false)
  const closeBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    return () => { document.body.style.overflow = '' }
  }, [])

  const redraw = useCallback(() => {
    const c = canvas.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    const dpr = window.devicePixelRatio || 1
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    paint(ctx, c.width / dpr, c.height / dpr, live.current ? [...strokes.current, live.current] : strokes.current)
  }, [])

  useEffect(() => {
    const el = wrap.current
    const c = canvas.current
    if (!el || !c) return
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const r = el.getBoundingClientRect()
      c.width = Math.round(r.width * dpr)
      c.height = Math.round(r.height * dpr)
      redraw()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    return () => ro.disconnect()
  }, [redraw])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const pos = (e: React.PointerEvent): Point => {
    const r = canvas.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const schedule = () => {
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(redraw)
  }

  const down = (e: React.PointerEvent) => {
    if (live.current || !e.isPrimary) return // ignore a second finger mid-stroke
    canvas.current!.setPointerCapture(e.pointerId)
    live.current = { color: erasing ? PAPER : color, size: erasing ? size * 2.5 : size, points: [pos(e)] }
    schedule()
  }
  const move = (e: React.PointerEvent) => {
    if (!live.current || !e.isPrimary) return
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent]
    const r = canvas.current!.getBoundingClientRect()
    for (const ev of events) live.current.points.push({ x: ev.clientX - r.left, y: ev.clientY - r.top })
    schedule()
  }
  const up = (e: React.PointerEvent) => {
    if (!live.current || !e.isPrimary) return
    strokes.current.push(live.current)
    live.current = null
    setCount(strokes.current.length)
    schedule()
  }

  const undo = () => {
    strokes.current.pop()
    setCount(strokes.current.length)
    redraw()
  }

  const close = () => {
    if (strokes.current.length === 0) return onCancel()
    setDiscarding((d) => !d)
  }

  // Crop to the drawn area plus a margin so the thumbnail isn't mostly blank paper.
  const done = () => {
    const all = strokes.current
    if (all.length === 0) return onCancel()
    const pad = 28
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const s of all) if (s.color !== PAPER) for (const p of s.points) {
      minX = Math.min(minX, p.x - s.size); minY = Math.min(minY, p.y - s.size)
      maxX = Math.max(maxX, p.x + s.size); maxY = Math.max(maxY, p.y + s.size)
    }
    const w = Math.max(240, Math.ceil(maxX - minX + pad * 2))
    const h = Math.max(240, Math.ceil(maxY - minY + pad * 2))
    const scale = 2
    const out = document.createElement('canvas')
    out.width = w * scale
    out.height = h * scale
    const ctx = out.getContext('2d')!
    ctx.scale(scale, scale)
    ctx.translate(-(minX - (w - (maxX - minX)) / 2), -(minY - (h - (maxY - minY)) / 2))
    ctx.fillStyle = PAPER
    ctx.fillRect(minX - w, minY - h, w * 3, h * 3)
    paint(ctx, 0, 0, all, false)
    out.toBlob((b) => b && onDone(b), 'image/png')
  }

  return (
    <div className="sketch" role="dialog" aria-modal="true" aria-label="Sketch">
      <header className="sketch__bar">
        <button ref={closeBtn} type="button" className="icon-btn" onClick={close} aria-label="Close sketch">
          <Icon name="close" />
        </button>
        <div className="sketch__title">Sketch</div>
        <button type="button" className="btn btn--primary btn--sm" onClick={done} disabled={count === 0}>
          Done
        </button>
      </header>

      {discarding && (
        <div className="discard" role="alertdialog" aria-label="Discard sketch?">
          <span>Discard this sketch?</span>
          <button type="button" className="btn btn--sm btn--soft" onClick={() => setDiscarding(false)}>Keep drawing</button>
          <button type="button" className="btn btn--sm btn--danger" onClick={onCancel}>Discard</button>
        </div>
      )}

      <div className="sketch__paper" ref={wrap}>
        <canvas
          ref={canvas}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          aria-label="Drawing area"
        />
      </div>

      <footer className="sketch__tools">
        <div className="swatches" role="radiogroup" aria-label="Color">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              role="radio"
              aria-checked={!erasing && color === c.value}
              aria-label={c.name}
              className="swatch"
              onClick={() => {
                setColor(c.value)
                setErasing(false)
              }}
            >
              <span style={{ background: c.value }} />
            </button>
          ))}
        </div>
        <div className="sketch__row">
          <div className="seg" role="radiogroup" aria-label="Brush size">
            {SIZES.map((s) => (
              <button
                key={s.value}
                type="button"
                role="radio"
                aria-checked={size === s.value}
                aria-label={s.name}
                className="seg__btn"
                onClick={() => setSize(s.value)}
              >
                <span className="dot" style={{ width: s.value + 4, height: s.value + 4 }} />
              </button>
            ))}
          </div>
          <button
            type="button"
            className={`icon-btn ${erasing ? 'icon-btn--on' : ''}`}
            onClick={() => setErasing((v) => !v)}
            aria-pressed={erasing}
            aria-label="Eraser"
          >
            <Icon name="eraser" />
          </button>
          <button type="button" className="icon-btn" onClick={undo} disabled={count === 0} aria-label="Undo">
            <Icon name="undo" />
          </button>
        </div>
      </footer>
    </div>
  )
}
