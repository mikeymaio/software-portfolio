import { test, expect } from '@playwright/test'

const TOTAL = 9

test.describe('All projects toggle with JavaScript', () => {
  test('starts collapsed with the total in its label', async ({ page }) => {
    await page.goto('/')
    const button = page.getByRole('button', { name: /^All projects/ })
    await expect(button).toHaveText(`All projects (${TOTAL}) +`)
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#featured-projects > li')).toHaveCount(5)
    await expect(page.locator('#more-projects')).toBeHidden()
  })

  test('expanding reveals the rest, flips state and keeps the button below the last Project', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /^All projects/ }).click()
    const button = page.getByRole('button', { name: /^Show fewer/ })
    await expect(button).toHaveText('Show fewer −')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(button).toHaveAttribute('aria-controls', 'more-projects')
    await expect(page.locator('#more-projects > li')).toHaveCount(TOTAL - 5)
    await expect(page.locator('#more-projects > li').first()).toBeVisible()
    const last = await page.locator('#more-projects > li').last().boundingBox()
    const btn = await button.boundingBox()
    expect(btn!.y).toBeGreaterThanOrEqual(last!.y + last!.height)
  })

  test('collapsing again hides them and restores the label', async ({ page }) => {
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
    await expect(page.locator('#featured-projects > li')).toHaveCount(5)
    await expect(page.locator('#more-projects > li')).toHaveCount(TOTAL - 5)
    await expect(page.locator('#more-projects > li').first()).toBeVisible()
    await expect(page.locator('#work button')).toBeHidden()
  })
})
