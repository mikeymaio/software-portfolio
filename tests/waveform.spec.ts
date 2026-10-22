import { test, expect } from '@playwright/test'
import { expectNoA11yViolationsInBothThemes } from './helpers/axe'

type Page = import('@playwright/test').Page

// The waveform is decorative (aria-hidden), so it has no role; its container carries a test id.
const signature = (page: Page) => page.getByTestId('signature')
const visibleWave = (page: Page) => signature(page).locator('svg').filter({ visible: true })
// Bars are the rects of the visible waveform; the last rect is the playhead line.
const bars = (page: Page) => visibleWave(page).locator('rect')
const fillOf = (rect: import('@playwright/test').Locator) =>
  rect.evaluate((el) => getComputedStyle(el).fill)

test.describe('Signature waveform with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false })

  test('is present and drawn', async ({ page }) => {
    await page.goto('/')
    const svg = visibleWave(page)
    await expect(svg).toHaveCount(1)
    const box = await svg.boundingBox()
    expect(box!.width).toBeGreaterThan(200)
    expect(box!.height).toBeGreaterThan(40)
  })
})

test('is hidden from assistive technology', async ({ page }) => {
  await page.goto('/')
  await expect(signature(page)).toHaveAttribute('aria-hidden', 'true')
  await expect(page.getByRole('img')).toHaveCount(0)
})

test('fits the viewport without horizontal overflow', async ({ page }) => {
  await page.goto('/')
  const box = await visibleWave(page).boundingBox()
  const vw = page.viewportSize()!.width
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(vw)
})

test('bars render at about 2px wide at every width, so they stay crisp', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await expect(visibleWave(page)).toHaveCount(1)
    const bar = (await bars(page).first().boundingBox())!
    expect(Math.abs(bar.width - 2), `bar width at ${width}px`).toBeLessThanOrEqual(0.25)
  }
})

test('played portion shows in every density and ends before the unplayed rest', async ({ page }) => {
  for (const width of [320, 390, 520, 768, 1000, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const wave = (await visibleWave(page).boundingBox())!
    const head = (await bars(page).last().boundingBox())!
    const share = (head.x - wave.x) / wave.width
    expect(share, `played share at ${width}px`).toBeGreaterThan(0.3)
    expect(share).toBeLessThan(0.4)
  }
})

test('played part matches the accent, unplayed is a quieter tone, in light and dark', async ({ page }) => {
  const seen: { played: string; rest: string }[] = []
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/')
    const played = await fillOf(bars(page).first())
    const rest = await fillOf(bars(page).nth(-2))
    const button = await page
      .locator('#top')
      .getByRole('link', { name: 'Resume' })
      .evaluate((el) => getComputedStyle(el).backgroundColor)
    // Same accent colour as the primary button; the unplayed part is visibly different.
    expect(played).toBe(button)
    expect(rest).not.toBe(played)
    seen.push({ played, rest })
  }
  // Colours follow the theme.
  expect(seen[0].rest).not.toBe(seen[1].rest)
})

test('playhead ease-in is off under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
})

test('axe scans stay clean with the waveform', async ({ page }) => {
  await expectNoA11yViolationsInBothThemes(page)
})
