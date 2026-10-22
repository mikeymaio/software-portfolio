import { test, expect, type Page } from '@playwright/test'
import { expectNoA11yViolations } from './helpers/axe'

const DARK_BG = 'rgb(20, 18, 14)'
const LIGHT_BG = 'rgb(245, 242, 235)'
const bodyBg = (page: Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor)
const toggle = (page: Page) => page.getByRole('button', { name: /dark mode/i })

test('switches the palette both ways and updates its pressed state', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false')
  await toggle(page).click()
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true')
  await expect.poll(() => bodyBg(page)).toBe(DARK_BG)
  await toggle(page).click()
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false')
  await expect.poll(() => bodyBg(page)).toBe(LIGHT_BG)
})

test('reflects the system scheme before any choice is made', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true')
})

test('the choice survives a reload and overrides the system scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await toggle(page).click()
  await page.reload()
  await expect.poll(() => bodyBg(page)).toBe(DARK_BG)
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true')

  await page.emulateMedia({ colorScheme: 'dark' })
  await toggle(page).click() // choose light while the system says dark
  await page.reload()
  await expect.poll(() => bodyBg(page)).toBe(LIGHT_BG)
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false')
})

test('a stored choice is applied before first paint', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
  await page.goto('/')
  // The head script ran before the body existed: the attribute is already set at DOMContentLoaded.
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('dark')
  await expect.poll(() => bodyBg(page)).toBe(DARK_BG)
})

test('is keyboard-operable', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await toggle(page).focus()
  await page.keyboard.press('Enter')
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press('Space')
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false')
})

test('fits the header without horizontal overflow at 390px and 320px', async ({ page }) => {
  await page.goto('/')
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 800 })
    const box = await toggle(page).boundingBox()
    expect(box!.x + box!.width).toBeLessThanOrEqual(width)
    expect(box!.height).toBeGreaterThanOrEqual(24)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('axe is clean with the toggle in either state', async ({ page }) => {
  await page.goto('/')
  for (let i = 0; i < 2; i++) {
    await toggle(page).click()
    // Scan the settled palette, not a frame of the cross-fade.
    await expect(page.locator('html')).not.toHaveAttribute('data-theme-fading')
    await expectNoA11yViolations(page)
  }
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('the toggle is hidden and the system scheme applies', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await expect(toggle(page)).toBeHidden()
    expect(await bodyBg(page)).toBe(DARK_BG)
  })
})

test('under reduced motion the switch is instant, with no transitions', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
  await page.goto('/')
  await toggle(page).click()
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
  await expect.poll(() => bodyBg(page)).toBe(DARK_BG)
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true')
})

test('with motion allowed the switch still lands on the right palette', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' })
  await page.goto('/')
  await toggle(page).click()
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true')
  await expect.poll(() => bodyBg(page)).toBe(DARK_BG)
  await toggle(page).click()
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false')
  await expect.poll(() => bodyBg(page)).toBe(LIGHT_BG)
})
