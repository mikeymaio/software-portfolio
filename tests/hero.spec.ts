import { test, expect } from '@playwright/test'
import { profile } from './helpers/profile'

test.describe('hero with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false })

  test('shows name, Positioning Line and context sentence at once', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: profile.name })).toBeVisible()
    await expect(page.getByText(profile.positioningLine)).toBeVisible()
    await expect(page.getByText(profile.contextSentence)).toBeVisible()
  })

  test('Resume resolves to /resume.pdf and Email is a mailto to the configured address', async ({
    page,
    request,
  }) => {
    await page.goto('/')
    const hero = page.locator('#top')
    const resume = hero.getByRole('link', { name: 'Resume' })
    await expect(resume).toHaveAttribute('href', '/resume.pdf')
    await expect(resume).toHaveAttribute('target', '_blank')
    await expect(resume).toHaveAttribute('rel', 'noopener noreferrer')
    const res = await request.get('/resume.pdf')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('pdf')
    await expect(hero.getByRole('link', { name: /^Email/ })).toHaveAttribute(
      'href',
      `mailto:${profile.contactEmail}`,
    )
  })
})

test('header keeps Work, About, Contact and Resume inline at every width', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Primary' })
  const links = ['Work', 'About', 'Contact', 'Resume']
  for (const name of links) await expect(nav.getByRole('link', { name })).toBeVisible()
  const boxes = await Promise.all(links.map((n) => nav.getByRole('link', { name: n }).boundingBox()))
  const top = boxes[0]!.y
  for (const b of boxes) expect(Math.abs(b!.y - top)).toBeLessThan(4)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('header links reach their sections', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Primary' })
  for (const [name, id] of [['Work', 'work'], ['About', 'about'], ['Contact', 'contact']]) {
    await nav.getByRole('link', { name }).click()
    await expect(page).toHaveURL(new RegExp(`#${id}$`))
    await expect(page.locator(`#${id}`)).toBeAttached()
  }
})

test('header gains the paper background once scrolled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const header = page.getByRole('banner')
  const bg = () => header.evaluate((el) => getComputedStyle(el).backgroundColor)
  const solid = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  await page.evaluate(() => {
    document.body.style.minHeight = '3000px'
    window.scrollTo({ top: 400, behavior: 'instant' })
  })
  await expect.poll(bg).toBe(solid)
})

test('every link and button shows a focus style', async ({ page }) => {
  await page.goto('/')
  const links = page.locator('header a, main a').filter({ visible: true })
  const n = await links.count()
  for (let i = 0; i < n; i++) {
    await links.nth(i).focus()
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Tab')
    const outline = await links.nth(i).evaluate((el) => getComputedStyle(el).outlineStyle)
    expect(outline).not.toBe('none')
  }
})
