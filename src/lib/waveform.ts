/** Build-time Signature waveform: a DAW-clip style mirrored bar waveform as static SVG.
 *  Ported from the prototype generator (docs/design/prototype/wave.js). Deterministic. */

function rng(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function lattice(seed: number, n: number): number[] {
  const r = rng(seed)
  return Array.from({ length: n + 1 }, () => r())
}

function noise(tab: number[], x: number): number {
  const i = Math.floor(x)
  const a = tab[i % tab.length]
  const b = tab[(i + 1) % tab.length]
  const f = x - i
  return a + (b - a) * (f * f * (3 - 2 * f))
}

function smooth(e0: number, e1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

// Song-shaped loudness: quiet intro, build, verse/chorus dynamics, short break, last chorus, tail.
const KEYS: [number, number][] = [
  [0, 0.02], [0.03, 0.14], [0.1, 0.18], [0.13, 0.3], [0.22, 0.62], [0.3, 0.58], [0.4, 0.66],
  [0.44, 0.92], [0.56, 0.96], [0.6, 0.4], [0.65, 0.44], [0.69, 0.98], [0.84, 1], [0.89, 0.55],
  [0.95, 0.16], [1, 0.02],
]

function envelope(t: number): number {
  for (let i = 1; i < KEYS.length; i++) {
    if (t <= KEYS[i][0]) {
      const [a, b] = [KEYS[i - 1], KEYS[i]]
      return a[1] + (b[1] - a[1]) * smooth(a[0], b[0], t)
    }
  }
  return 0
}

export interface WaveformOptions {
  width: number
  height: number
  /** Fraction of the clip that is "played" (0..1). */
  played: number
  seed: number
}

export function waveformSvg({ width, height, played, seed }: WaveformOptions): string {
  const fine = lattice(seed, 1200)
  const slow = lattice(seed * 2 + 1, 60)
  const level = (t: number) => {
    const beat = 0.8 + 0.2 * Math.pow(Math.abs(Math.cos(t * Math.PI * 64)), 4)
    return Math.min(
      1,
      envelope(t) * beat * (0.62 + 0.38 * noise(fine, t * 1100)) * (0.9 + 0.1 * noise(slow, t * 50)) * 1.08,
    )
  }

  const pitch = 4
  const bar = 2
  const mid = height / 2
  const n = Math.floor((width + (pitch - bar)) / pitch)
  const x0 = Math.floor((width - (n * pitch - (pitch - bar))) / 2)
  const split = Math.round(n * played)
  const playedBars: string[] = []
  const restBars: string[] = []
  for (let i = 0; i < n; i++) {
    const h = Math.max(1, Math.round(level((i + 0.5) / n) * (mid - 3)))
    const rect = `<rect x="${x0 + i * pitch}" y="${mid - h}" width="${bar}" height="${2 * h}"/>`
    ;(i < split ? playedBars : restBars).push(rect)
  }
  return (
    `<svg class="wave-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" ` +
    `shape-rendering="crispEdges" aria-hidden="true" focusable="false">` +
    `<g class="played">${playedBars.join('')}</g><g class="rest">${restBars.join('')}</g>` +
    `<rect class="playhead" x="${x0 + split * pitch - 1}" y="0" width="1" height="${height}"/></svg>`
  )
}
