import type { SVGProps } from 'react'

// One icon family: 24px grid, 1.75 stroke, round caps and joins.
const PATHS = {
  home: 'M4 11.2 12 4l8 7.2V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z',
  journal: 'M6 3.5h10.5a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H6zM6 3.5v17M9.5 8.5h5M9.5 12h5',
  archive: 'M4.5 6.5a1.5 1.5 0 0 1 1.5-1.5h12a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5zM4.5 10h15M8.5 3.5V7M15.5 3.5V7',
  user: 'M12 12.2a3.7 3.7 0 1 0 0-7.4 3.7 3.7 0 0 0 0 7.4zM4.8 20a7.2 7.2 0 0 1 14.4 0',
  back: 'M15 5.5 8.5 12l6.5 6.5',
  next: 'm9 5.5 6.5 6.5L9 18.5',
  expand: 'M14 4.5h5.5V10M10 19.5H4.5V14M19.5 4.5 13.5 10.5M4.5 19.5l6-6',
  image: 'M5 4.5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1zM4 16l4.5-4.5 4 4 2.5-2.5L20 17M9 9.2h.01',
  pencil: 'm4 20 1-4.2L16.3 4.5a1.8 1.8 0 0 1 2.5 0l.7.7a1.8 1.8 0 0 1 0 2.5L8.2 19zM14.5 6.3l3.2 3.2',
  flame: 'M12.2 2.8c.9 3.6 5.3 5.6 5.3 10.4a5.5 5.5 0 0 1-11 0c0-2.3 1-3.8 2.3-5 .2 1.7.9 2.6 1.9 3 .1-3.4.2-5.6 1.5-8.4z',
  plus: 'M12 5v14M5 12h14',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  trash: 'M5 7h14M10 7V5h4v2M7 7l.8 12h8.4L17 7M10.5 10.5v6M13.5 10.5v6',
  close: 'M6 6l12 12M18 6 6 18',
  undo: 'M9 8.5 4.5 13 9 17.5M4.5 13H14a5 5 0 0 1 0 10',
  eraser: 'm9 19.5-4.6-4.6a1.8 1.8 0 0 1 0-2.5l8-8a1.8 1.8 0 0 1 2.5 0l4.2 4.2a1.8 1.8 0 0 1 0 2.5l-7.4 7.4H9zM8 10.5l6.5 6.5',
  download: 'M12 4.5v11M7.5 11.5 12 16l4.5-4.5M5 19.5h14',
  logout: 'M10 4.5H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h4M14 8l4 4-4 4M18 12H9.5',
} as const

export type IconName = keyof typeof PATHS

export function Icon({ name, size = 22, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
