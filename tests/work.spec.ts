import { test, expect } from '@playwright/test'
import { expectNoA11yViolationsInBothThemes } from './helpers/axe'

const FEATURED = [
  'ChatCEC',
  'Dayworker',
  'Daki & JOKR',
  'Yes.Fit',
  'Settle In',
]
const REST = [
  'PushPress Member Portal & Screens',
  'Futuri Engage Mobile',
  'Go Deed DEED',
  'OLD_SPORT band website',
]
// Listings known dead on 2026-10-22: JOKR (stores, site) and PushPress Screens.
const RETIRED_PRODUCT_URLS = [
  'jokr.com',
  'id1561652691',
  'com.jokr.delivery',
  'pushpress.com/launcher/screens-app-tv',
  'B0762BGDVY',
]

test.describe('Work section with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false })

  test('five Featured Projects appear in order, numbered 01-05, each with all four credits', async ({ page }) => {
    await page.goto('/')
    const tracks = page.locator('#featured-projects > li')
    await expect(tracks).toHaveCount(5)
    for (const [i, name] of FEATURED.entries()) {
      const track = tracks.nth(i)
      await expect(track.getByRole('heading', { level: 3 })).toHaveText(name)
      await expect(track).toContainText(String(i + 1).padStart(2, '0'))
      for (const term of ['Client', 'Role', 'Years', 'Stack'])
        await expect(track.getByRole('term').filter({ hasText: new RegExp(`^${term}$`) })).toBeVisible()
    }
  })

  test('the rest follow in the same format, numbered 06-09, in their own list', async ({ page }) => {
    await page.goto('/')
    const tracks = page.locator('#more-projects > li')
    await expect(tracks).toHaveCount(4)
    for (const [i, name] of REST.entries()) {
      await expect(tracks.nth(i).getByRole('heading', { level: 3 })).toHaveText(name)
      await expect(tracks.nth(i)).toContainText(String(i + 6).padStart(2, '0'))
      await expect(tracks.nth(i)).toBeVisible()
    }
  })
})

test('Retired companions are credited by name with no links to them', async ({ page }) => {
  await page.goto('/')
  const daki = page.locator('#featured-projects > li', { hasText: 'Daki & JOKR' })
  await expect(daki).toContainText('JOKR (retired)')
  await expect(daki.getByRole('link')).toHaveCount(3)
  const pp = page.locator('#more-projects > li', { hasText: 'PushPress' })
  await expect(pp).toContainText('Screens (retired)')
})

test('no Project link points to a known-retired product; external links are safe and written out', async ({ page }) => {
  await page.goto('/')
  const links = page.locator('#work .tracks a')
  const n = await links.count()
  expect(n).toBeGreaterThan(0)
  for (let i = 0; i < n; i++) {
    const a = links.nth(i)
    const href = (await a.getAttribute('href'))!
    for (const dead of RETIRED_PRODUCT_URLS) expect(href).not.toContain(dead)
    await expect(a).toHaveAttribute('target', '_blank')
    await expect(a).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(a).toHaveText(/^(Website|App Store|Google Play|Code)$/)
  }
})

test('credits stack under the summary on narrow screens and sit beside it on wide ones', async ({ page }) => {
  await page.goto('/')
  const track = page.locator('#featured-projects > li').first()
  const head = (await track.locator('.summary').boundingBox())!
  const credits = (await track.getByRole('term').first().boundingBox())!
  if ((page.viewportSize()?.width ?? 0) < 600) expect(credits.y).toBeGreaterThan(head.y + head.height - 1)
  else expect(credits.x).toBeGreaterThan(head.x + head.width)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('the header Work link reaches the section', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Work' }).click()
  await expect(page).toHaveURL(/#work$/)
  await expect(page.getByRole('heading', { level: 2, name: /Selected work/ })).toBeInViewport()
})

test('axe scans stay clean with the Work section', async ({ page }) => {
  await expectNoA11yViolationsInBothThemes(page)
})

test.describe('TODO(michael) marker in the normal build', () => {
  test('renders in muted italics where a Project credit is still a gap', async ({ page }) => {
    await page.goto('/')
    const marker = page.locator('#featured-projects').getByText('TODO(michael)').first()
    await expect(marker).toBeVisible()
    await expect(marker).toHaveCSS('font-style', 'italic')
    const color = await marker.evaluate((el) => getComputedStyle(el).color)
    const ink = await page.locator('h3').first().evaluate((el) => getComputedStyle(el).color)
    expect(color).not.toBe(ink)
  })
})
