import { test, expect } from '@playwright/test'
import { expectNoA11yViolationsInBothThemes } from './helpers/axe'

const visibleWave = (page: import('@playwright/test').Page) =>
  page.locator('.signature .wave:visible svg')

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
  await expect(page.locator('.signature')).toHaveAttribute('aria-hidden', 'true')
  await expect(page.getByRole('img')).toHaveCount(0)
})

test('fits the viewport without horizontal overflow', async ({ page }) => {
  await page.goto('/')
  const box = await visibleWave(page).boundingBox()
  const vw = page.viewportSize()!.width
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(vw)
})

test('played part is accent, unplayed is the muted tone, in light and dark', async ({ page }) => {
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/')
    const fills = await page.evaluate(() => {
      const f = (s: string) => getComputedStyle(document.querySelector(`.signature ${s} rect`)!).fill
      const tok = (n: string) => {
        const e = document.createElement('i')
        e.style.color = `var(${n})`
        document.body.append(e)
        const c = getComputedStyle(e).color
        e.remove()
        return c
      }
      return { played: f('.played'), rest: f('.rest'), accent: tok('--accent'), muted: tok('--wave-muted') }
    })
    expect(fills.played).toBe(fills.accent)
    expect(fills.rest).toBe(fills.muted)
  }
})

test('playhead ease-in is off under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
})

test('axe scans stay clean with the waveform', async ({ page }) => {
  await expectNoA11yViolationsInBothThemes(page)
})
