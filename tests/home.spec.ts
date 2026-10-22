import { test, expect } from '@playwright/test'

const NAME = 'Michael Maio'
const POSITIONING_LINE = 'Full-stack engineer. I ship mobile apps and AI products, start to finish.'

test.describe('with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false })

  test('name and Positioning Line are visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: NAME })).toBeVisible()
    await expect(page.getByText(POSITIONING_LINE)).toBeVisible()
  })
})

test('every request during page load goes to the site origin', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin
  const foreign: string[] = []
  page.on('request', (req) => {
    const u = req.url()
    if (u.startsWith('data:') || u.startsWith('blob:')) return
    if (new URL(u).origin !== origin) foreign.push(u)
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  expect(foreign).toEqual([])
})
