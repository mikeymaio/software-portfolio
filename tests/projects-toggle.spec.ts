import { test, expect } from '@playwright/test'

const FEATURED = 5

// The total is whatever the page lists: every Project item once all are visible (JavaScript off).
async function totalProjects(browser: import('@playwright/test').Browser, baseURL: string | undefined) {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()
  await page.goto('/')
  const n = await page.locator('#work').getByRole('heading', { level: 3 }).count()
  await context.close()
  return n
}

test.describe('All projects toggle with JavaScript', () => {
  test('starts collapsed with the total in its label', async ({ page, browser, baseURL }) => {
    const TOTAL = await totalProjects(browser, baseURL)
    await page.goto('/')
    const button = page.getByRole('button', { name: /^All projects/ })
    await expect(button).toHaveText(`All projects (${TOTAL}) +`)
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#featured-projects > li')).toHaveCount(FEATURED)
    await expect(page.locator('#more-projects')).toBeHidden()
  })

  test('expanding reveals the rest, flips state and keeps the button below the last Project', async ({ page, browser, baseURL }) => {
    const TOTAL = await totalProjects(browser, baseURL)
    await page.goto('/')
    await page.getByRole('button', { name: /^All projects/ }).click()
    const button = page.getByRole('button', { name: /^Show fewer/ })
    await expect(button).toHaveText('Show fewer −')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(button).toHaveAttribute('aria-controls', 'more-projects')
    await expect(page.locator('#more-projects > li')).toHaveCount(TOTAL - FEATURED)
    await expect(page.locator('#more-projects > li').first()).toBeVisible()
    const last = await page.locator('#more-projects > li').last().boundingBox()
    const btn = await button.boundingBox()
    expect(btn!.y).toBeGreaterThanOrEqual(last!.y + last!.height)
  })

  test('collapsing again hides them and restores the label', async ({ page, browser, baseURL }) => {
    const TOTAL = await totalProjects(browser, baseURL)
    await page.goto('/')
    await page.getByRole('button', { name: /^All projects/ }).click()
    await page.getByRole('button', { name: /^Show fewer/ }).click()
    const button = page.getByRole('button', { name: /^All projects/ })
    await expect(button).toHaveText(`All projects (${TOTAL}) +`)
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#more-projects')).toBeHidden()
  })

  test('is keyboard operable', async ({ page }) => {
    await page.goto('/')
    const button = page.getByRole('button', { name: /^All projects/ })
    await button.focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('#more-projects')).toBeVisible()
    await page.keyboard.press('Space')
    await expect(page.locator('#more-projects')).toBeHidden()
  })
})

test.describe('All projects toggle without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('every Project is visible and the button is not shown', async ({ page }) => {
    await page.goto('/')
    const TOTAL = await page.locator('#work').getByRole('heading', { level: 3 }).count()
    await expect(page.locator('#featured-projects > li')).toHaveCount(FEATURED)
    await expect(page.locator('#more-projects > li')).toHaveCount(TOTAL - FEATURED)
    await expect(page.locator('#more-projects > li').first()).toBeVisible()
    await expect(page.locator('#work button')).toBeHidden()
  })
})
