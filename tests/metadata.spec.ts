import { test, expect, type Page } from '@playwright/test'
import { profile } from './helpers/profile'

const SITE = 'https://michaelmaio.com'
const meta = (page: Page, selector: string) => page.locator(selector).getAttribute('content')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('title, description and canonical', async ({ page }) => {
  await expect(page).toHaveTitle('Michael Maio — Full-stack engineer')
  expect(await meta(page, 'meta[name="description"]')).toBe(profile.positioningLine)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE}/`)
})

test('Open Graph and Twitter tags carry the title, description and absolute image URL', async ({ page }) => {
  const title = 'Michael Maio — Full-stack engineer'
  expect(await meta(page, 'meta[property="og:title"]')).toBe(title)
  expect(await meta(page, 'meta[property="og:description"]')).toBe(profile.positioningLine)
  expect(await meta(page, 'meta[property="og:url"]')).toBe(`${SITE}/`)
  expect(await meta(page, 'meta[property="og:image"]')).toBe(`${SITE}/og-image.png`)
  expect(await meta(page, 'meta[name="twitter:card"]')).toBe('summary_large_image')
  expect(await meta(page, 'meta[name="twitter:title"]')).toBe(title)
  expect(await meta(page, 'meta[name="twitter:description"]')).toBe(profile.positioningLine)
  expect(await meta(page, 'meta[name="twitter:image"]')).toBe(`${SITE}/og-image.png`)
})

test('preview image is a 1200x630 PNG served from the site', async ({ page, request }) => {
  const image = await meta(page, 'meta[property="og:image"]')
  const res = await request.get(new URL(image!).pathname)
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('image/png')
  const png = await res.body()
  expect(png.readUInt32BE(16)).toBe(1200)
  expect(png.readUInt32BE(20)).toBe(630)
})

test('favicon, PNG fallbacks and Apple touch icon load from the site', async ({ page, request }) => {
  const hrefs = await page.locator('link[rel~="icon"], link[rel="apple-touch-icon"]').evaluateAll((els) =>
    els.map((el) => (el as HTMLLinkElement).getAttribute('href')!),
  )
  expect(hrefs.some((h) => h.endsWith('.svg'))).toBe(true)
  expect(hrefs.some((h) => h.endsWith('.png'))).toBe(true)
  expect(await page.locator('link[rel="apple-touch-icon"]').count()).toBe(1)
  for (const href of hrefs) {
    expect(href.startsWith('/'), `${href} is site-relative`).toBe(true)
    const res = await request.get(href)
    expect(res.status(), href).toBe(200)
    expect(res.headers()['content-type'], href).toMatch(/image\//)
  }
})
