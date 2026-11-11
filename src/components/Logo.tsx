// scribble that straightens out into a line
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Decluttered">
      <circle cx="24" cy="24" r="24" fill="var(--accent)" />
      <path
        d="M9 29c-3-7 4-13 9-9s-2 12-7 8 2-13 10-11 6 9 11 6c2-1 4-3 7-3"
        fill="none"
        stroke="var(--paper)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
