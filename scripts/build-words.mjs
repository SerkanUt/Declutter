// Builds src/data/words.json from Wikipedia article titles (MediaWiki API). Run: npm run words
// The app doesn't call Wikipedia itself, it just ships the JSON.

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const API = 'https://en.wikipedia.org/w/api.php'
const UA = 'Decluttered-word-builder/0.1'
const PER_SOURCE_CAP = 30 // stops one big category taking over a pool, most-viewed titles win
const MAX_LEN = 28
// min views over 60 days per type, to skip obscure titles (colors and objects get way fewer views than films)
const MIN_VIEWS = { color: 3500, movie: 25000, object: 5000, place: 20000 }
// articles that exist but make bad prompts
const BLOCK = new Set(['mise-en-scène', 'dakar rally', 'caracal', 'bactrian camel', 'bauhaus', 'evolution of deserts',
  'endorheic basin', 'wonders of the world', 'elephant', 'm*a*s*h', 'electric chair', 'ghost market', 'archipelago',
  'island', 'lake', 'desert', 'atoll', 'clock', 'theostein', 'up forest green', 'ani', 'gatto', 'fjord', 'hoppers',
  'sea of cortez', 'one battle after another',
  // colors
  'soap', 'blood rain', 'blood red', 'methyl orange', 'color of water', 'ndhu green', 'msu green', 'hari', 'olo',
  'pitzer orange', 'unece amber', 'office green', 'fairy tale', 'caramelo', 'cadmium pigments', 'grayscale', 'india green',
  'violet light', 'copper phthalocyanine', 'haint blue', 'pale silver', 'red wine', 'mummy brown',
  // objects
  'flavor flav', 'highclere castle', 'metropolitan museum of art', 'man in the iron mask', 'ettore sottsass',
  'lászló bíró', 'danaher corporation', 'neue kerze', 'amnesty candle', 'christingle', 'new candle', 'hollow nickel case',
  'red box', 'allan variance', 'gemology', 'shoemaking', 'color temperature', 'color rendering index', 'phosphor',
  'patina', 'music instrument technology', 'corrugated fiberboard', 'melamine resin', 'mahogany', 'electrochemical cell',
  'beam splitter', 'gat', 'boss of the plains', 'juicero', 'masquerade ball', 'crazy clock game', 'doomsday clock',
  'westminster quarters', 'speaking clock', 'kasa-obake', 'drinking from shoes', 'dead drop', 'catoptromancy', 'upholstery',
  'burl', 'silo', 'billiken', 'bic cristal', 'autopen', 'halligan bar', 'sherlock holmes hat', 'blackamoor', 'ear candling',
  'suicide bag', 'erotic furniture', 'doll fetishism', 'death mask', 'whoopee cap', 'airbag', 'drum kit', 'tool', 'pen',
  'footwear', 'furniture', 'lighting', 'shoe size', 'test tube', 'celery vase', 'hogshead', 'ducking stool', 'spittoon',
  // places
  'desertification in the sahel', 'desert flora', 'desert fauna', 'sand cat', 'guano', 'cave painting', 'caves', 'sea',
  'golan heights', 'shangdu', 'cenote', 'silk road'])

/** @type {Record<string, {name: string, depth?: number}[]>} */
const SOURCES = {
  color: [
    'Shades of red', 'Shades of orange', 'Shades of yellow', 'Shades of green', 'Shades of blue',
    'Shades of purple', 'Shades of pink', 'Shades of brown', 'Shades of gray',
  ].map((name) => ({ name })),
  movie: [
    'Best Picture Academy Award winners', "Palme d'Or winners", 'Golden Lion winners',
    'Golden Bear winners', 'Studio Ghibli animated films', 'Pixar animated films',
    'Best Animated Feature Academy Award winners',
  ].map((name) => ({ name })),
  object: [
    { name: 'Furniture' }, { name: 'Chairs' }, { name: 'Hats' }, { name: 'Bags' },
    { name: 'Containers' }, { name: 'Lighting' }, { name: 'Clocks' }, { name: 'Kitchenware' },
    { name: 'Hand tools' }, { name: 'Tools' }, { name: 'Umbrellas' }, { name: 'Footwear' },
    { name: 'Jewellery' }, { name: 'Cameras' }, { name: 'Pens' }, { name: 'Brushes' }, { name: 'Mirrors' },
    { name: 'Baskets' }, { name: 'Bottles' }, { name: 'Glassware' }, { name: 'Vases' }, { name: 'Candles' },
    { name: 'Telescopes' }, { name: 'Keys' }, { name: 'Dolls' }, { name: 'Masks' },
    { name: 'Musical instruments', depth: 1 },
  ],
  place: [
    ...['Japan', 'Italy', 'India', 'Peru', 'Mexico', 'France', 'Egypt', 'China', 'Spain', 'Greece',
      'Turkey', 'Jordan', 'Cambodia', 'Brazil', 'Morocco', 'Iran', 'Germany', 'the United Kingdom']
      .map((c) => ({ name: `World Heritage Sites in ${c}` })),
    { name: 'Tourist attractions in Kyoto' }, { name: 'National parks of Iceland' },
    { name: 'Seven Wonders of the Ancient World' }, { name: 'Seas', depth: 1 },
    { name: 'Canyons and gorges' }, { name: 'Caves', depth: 1 }, { name: 'Archipelagoes' },
    { name: 'Lakes' }, { name: 'Islands' }, { name: 'Deserts', depth: 1 }, { name: 'Volcanoes', depth: 1 },
  ],
}

const BAD_START = /^(list|lists|index|outline|glossary|timeline|history|shades|category|template|wikipedia|portal|comparison|types|design|dictionary)\b/i
const BAD_ANY = /\b(in culture|by country|by type|by area|disambiguation|proposition|\(board game\)|\(video game\)|amusement|hair|company|ltd|inc|sons|pigment|reserve|method|eruption|rubbermaid|casket|day)\b/i

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function api(params) {
  const url = new URL(API)
  url.search = new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', ...params })
  let status = 0
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    status = res.status
    if (res.ok) return res.json()
    await sleep(2000 * (attempt + 1)) // back off on 429 / 5xx
  }
  throw new Error(`Wikipedia API failed with HTTP ${status}`)
}

async function members(cat, type) {
  const out = []
  let cont
  do {
    const data = await api({
      list: 'categorymembers', cmtitle: `Category:${cat}`, cmlimit: '500', cmtype: type,
      ...(cont ? { cmcontinue: cont } : {}),
    })
    out.push(...(data.query?.categorymembers ?? []))
    cont = data.continue?.cmcontinue
    await sleep(120)
  } while (cont && out.length < 1500)
  return out
}

async function pagesIn({ name, depth = 0 }) {
  let pages = (await members(name, 'page')).map((m) => m.title)
  if (depth > 0) {
    const subs = (await members(name, 'subcat')).filter((m) => !/stubs|lists|history|by /i.test(m.title)).slice(0, 25)
    for (const s of subs) {
      const sub = await members(s.title.replace(/^Category:/, ''), 'page')
      pages.push(...sub.slice(0, 40).map((m) => m.title))
    }
  }
  return pages
}

// Views over the last 60 days. Popular titles are ones people know, so they make better prompts.
async function viewsFor(titles) {
  const views = new Map()
  for (let i = 0; i < titles.length; i += 25) {
    const batch = titles.slice(i, i + 25)
    const data = await api({ prop: 'pageviews', pvipdays: '60', titles: batch.join('|'), redirects: '1' })
    const redirect = new Map((data.query?.redirects ?? []).map((r) => [r.from, r.to]))
    const byTitle = new Map((data.query?.pages ?? []).map((p) => [p.title, p]))
    for (const t of batch) {
      const page = byTitle.get(redirect.get(t) ?? t)
      const sum = Object.values(page?.pageviews ?? {}).reduce((a, n) => a + (n ?? 0), 0)
      views.set(t, sum)
    }
    await sleep(250)
  }
  return views
}

function clean(title, kind) {
  if (BAD_START.test(title) || BAD_ANY.test(title)) return null
  const display = title.replace(/\s*\([^)]*\)\s*$/, '').trim()
  if (display.length < 3 || display.length > MAX_LEN) return null
  if (kind !== 'movie' && /\d/.test(display)) return null
  if (kind === 'object' && /^(tool|container|furniture|hat|bag|clock|chair)s?$/i.test(display) === false && /\b(set|company|ltd)\b/i.test(display)) return null
  return display
}

// seeded PRNG so every run gives the same shuffle
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function shuffle(arr, rnd) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const result = {}
const report = []
for (const [kind, sources] of Object.entries(SOURCES)) {
  const seen = new Set()
  const pool = []
  for (const src of sources) {
    let titles = []
    try {
      titles = await pagesIn(src)
    } catch (e) {
      report.push(`  ! ${kind}: ${src.name} failed (${e.message})`)
      continue
    }
    const kept = []
    for (const t of titles) {
      const d = clean(t, kind)
      if (!d) continue
      const key = d.toLowerCase()
      if (seen.has(key)) continue
      kept.push([d, key, t])
    }
    const views = await viewsFor(kept.map((k) => k[2]))
    const picked = kept
      .filter((k) => (views.get(k[2]) ?? 0) >= MIN_VIEWS[kind] && !BLOCK.has(k[1]))
      .sort((a, b) => (views.get(b[2]) ?? 0) - (views.get(a[2]) ?? 0))
      .slice(0, PER_SOURCE_CAP)
    for (const [d, key] of picked) { seen.add(key); pool.push(d) }
    report.push(`  ${kind.padEnd(7)} ${String(picked.length).padStart(3)} / ${String(titles.length).padStart(4)}  ${src.name}`)
    if (titles.length === 0) report.push(`  ! ${src.name} returned no pages, check the category name`)
  }
  result[kind] = shuffle(pool, mulberry32(kind.length * 31 + pool.length))
}

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(here, '../src/data/words.json')
await mkdir(dirname(out), { recursive: true })
await writeFile(out, JSON.stringify(result, null, 1) + '\n')

console.log(report.join('\n'))
for (const [k, v] of Object.entries(result)) {
  console.log(`\n${k}: ${v.length} words`)
  console.log('  ' + v.slice(0, 25).join(' · '))
}
