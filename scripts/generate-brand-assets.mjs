// Regenerates the MM monogram icons and the 1200x630 link-preview card into public/.
// Run: node scripts/generate-brand-assets.mjs   (devDeps: satori, @resvg/resvg-js; sharp comes with astro)
// Text is converted to vector paths by satori, so the SVG favicon needs no font at runtime.
import { readFileSync, writeFileSync } from 'node:fs'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'

const root = new URL('../', import.meta.url)
const out = (f) => new URL(`public/${f}`, root)
const font = (f) => readFileSync(new URL(`node_modules/geist/dist/fonts/${f}`, root))
const profile = JSON.parse(readFileSync(new URL('src/content/profile.json', root), 'utf8'))

// Light-palette tokens from src/styles/global.css
const PAPER = '#f5f2eb'
const INK = '#16140f'
const ACCENT = '#b23a0a'

const fonts = [
  { name: 'Geist', data: font('geist-sans/Geist-Regular.ttf'), weight: 400 },
  { name: 'Geist', data: font('geist-sans/Geist-SemiBold.ttf'), weight: 600 },
  { name: 'Geist Mono', data: font('geist-mono/GeistMono-SemiBold.ttf'), weight: 600 },
]
const h = (type, style, children) => ({ type, props: { style: { display: 'flex', ...style }, children } })

async function monogram(size, radius) {
  return satori(
    h(
      'div',
      { width: size, height: size, background: INK, borderRadius: radius, alignItems: 'center', justifyContent: 'center' },
      h('div', { fontFamily: 'Geist', fontWeight: 600, fontSize: size * 0.56, color: PAPER, letterSpacing: -size * 0.04, lineHeight: 1 }, 'MM'),
    ),
    { width: size, height: size, fonts },
  )
}
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng()
const squash = (buf) => sharp(buf).png({ compressionLevel: 9, palette: true }).toBuffer()

// Favicon: SVG (rounded), PNG fallbacks, Apple touch icon (full-bleed square; iOS rounds it)
const svg64 = await monogram(64, 14)
writeFileSync(out('favicon.svg'), svg64)
writeFileSync(out('favicon-32.png'), await squash(png(svg64, 32)))
writeFileSync(out('icon-192.png'), await squash(png(await monogram(192, 42), 192)))
writeFileSync(out('apple-touch-icon.png'), await squash(png(await monogram(180, 0), 180)))

// favicon.ico (single 32px PNG-in-ICO) for clients that request /favicon.ico directly
const p32 = readFileSync(out('favicon-32.png'))
const head = Buffer.alloc(22)
head.writeUInt16LE(1, 2) // type: icon
head.writeUInt16LE(1, 4) // image count
head[6] = 32 // width
head[7] = 32 // height
head.writeUInt16LE(1, 10) // colour planes
head.writeUInt16LE(32, 12) // bits per pixel
head.writeUInt32LE(p32.length, 14) // image size
head.writeUInt32LE(22, 18) // image offset
writeFileSync(out('favicon.ico'), Buffer.concat([head, p32]))

// Open Graph / Twitter card, 1200x630
const card = await satori(
  h(
    'div',
    { width: 1200, height: 630, background: PAPER, color: INK, flexDirection: 'column', justifyContent: 'space-between', padding: 80, boxSizing: 'border-box', borderTop: `12px solid ${ACCENT}` },
    [
      h('div', { fontFamily: 'Geist Mono', fontWeight: 600, fontSize: 28, color: ACCENT }, 'michaelmaio.com'),
      h('div', { flexDirection: 'column' }, [
        h('div', { fontFamily: 'Geist', fontWeight: 600, fontSize: 104, letterSpacing: -4, lineHeight: 1.05 }, profile.name),
        h('div', { fontFamily: 'Geist', fontWeight: 400, fontSize: 44, lineHeight: 1.3, marginTop: 28, maxWidth: 940 }, profile.positioningLine),
      ]),
    ],
  ),
  { width: 1200, height: 630, fonts },
)
writeFileSync(out('og-image.png'), await squash(png(card, 1200)))
console.log('brand assets written to public/')
