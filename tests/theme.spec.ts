import { test, expect, type Page } from '@playwright/test'

const DARK_BG = 'rgb(20, 18, 14)'
const LIGHT_BG = 'rgb(245, 242, 235)'
const bodyBg = (page: Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor)

test('follows the system colour scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  expect(await bodyBg(page)).toBe(DARK_BG)
  await page.emulateMedia({ colorScheme: 'light' })
  expect(await bodyBg(page)).toBe(LIGHT_BG)
})

test('a theme attribute on the root overrides the system scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'))
  expect(await bodyBg(page)).toBe(LIGHT_BG)
  await page.emulateMedia({ colorScheme: 'light' })
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'))
  expect(await bodyBg(page)).toBe(DARK_BG)
})

test('no animations run under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.mouse.wheel(0, 300)
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
})
