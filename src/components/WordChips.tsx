import { KIND_LABEL, type DailyWord } from '../lib/words'

interface Props {
  words: DailyWord[]
  text: string
  onPick?: (word: string) => void
  compact?: boolean
}

/** Today's four words as tags. A tag goes dark once its word is in the text. */
export function WordChips({ words, text, onPick, compact }: Props) {
  const lower = text.toLowerCase()
  return (
    <ul className={`chips ${compact ? 'chips--compact' : ''}`}>
      {words.map((w, i) => {
        const used = lower.includes(w.word.toLowerCase())
        return (
          <li key={w.kind} style={{ ['--i' as string]: i }}>
            <button
              type="button"
              className={`chip chip--${w.kind} ${used ? 'chip--used' : ''}`}
              onClick={() => onPick?.(w.word)}
              aria-label={`${KIND_LABEL[w.kind]}: ${w.word}${used ? ', used in your writing' : ''}. Add to writing`}
            >
              <span className="chip__kind">{KIND_LABEL[w.kind]}</span>
              <span className="chip__word">{w.word}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
