// One-off: regenerate src/fonts/*.woff2 from the `geist` package (OFL).
// Run: node scripts/subset-fonts.mjs   (only needed if the glyph set changes)
import { readFile, writeFile } from 'node:fs/promises'
import subsetFont from 'subset-font'

// Basic Latin + Latin-1 + typographic punctuation used in copy.
let text = ''
for (let c = 0x20; c <= 0x7e; c++) text += String.fromCodePoint(c)
for (let c = 0xa0; c <= 0xff; c++) text += String.fromCodePoint(c)
text += '–—‘’“”•…·−→↗'

const fonts = {
  'Geist-Variable': 'geist-sans/Geist-Variable',
  'GeistMono-Variable': 'geist-mono/GeistMono-Variable',
}
for (const [out, src] of Object.entries(fonts)) {
  const buf = await readFile(`node_modules/geist/dist/fonts/${src}.woff2`)
  const sub = await subsetFont(buf, text, { targetFormat: 'woff2' })
  await writeFile(`src/fonts/${out}.woff2`, sub)
  console.log(out, buf.length, '->', sub.length)
}
