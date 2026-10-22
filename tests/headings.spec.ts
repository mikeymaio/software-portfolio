import { test, expect, type Page } from '@playwright/test'
import { profile } from './helpers/profile'

// The outline a screen-reader user navigates by: the name, then the section headings, then the Projects.
async function outline(page: Page) {
  await page.goto('/')
  return page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((els) =>
    els.map((e) => ({ level: Number(e.tagName[1]), text: (e.textContent ?? '').replace(/\s+/g, ' ').trim() })),
  )
}

function expectLogicalOutline(headings: { level: number; text: string }[]) {
  // Exactly one h1, first, and it is the name.
  expect(headings[0].level).toBe(1)
  expect(headings[0].text).toBe(profile.name)
  expect(headings.filter((h) => h.level === 1)).toHaveLength(1)

  // No skipped levels going down the page.
  for (let i = 1; i < headings.length; i++) {
    expect(headings[i].level - headings[i - 1].level, `after "${headings[i - 1].text}"`).toBeLessThanOrEqual(1)
  }

  // Sections in order (Work before About); every Project heading sits inside Work.
  const idx = (t: string) => headings.findIndex((h) => h.level === 2 && h.text.includes(t))
  const work = idx('Selected work')
  const about = idx('About')
  expect(work).toBeGreaterThan(0)
  expect(about).toBeGreaterThan(work)
  const projects = headings.map((h, i) => ({ ...h, i })).filter((h) => h.level === 3)
  expect(projects.length).toBeGreaterThan(0)
  for (const p of projects) {
    expect(p.i).toBeGreaterThan(work)
    expect(p.i).toBeLessThan(about)
  }
}

test('heading outline is logical', async ({ page }) => {
  expectLogicalOutline(await outline(page))
})

test.describe('with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false })
  test('heading outline is logical', async ({ page }) => {
    expectLogicalOutline(await outline(page))
  })
})
