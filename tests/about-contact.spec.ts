import { test, expect } from '@playwright/test'
import { profile } from './helpers/profile'

for (const name of ['About', 'Contact']) {
  test(`header ${name} link reaches its section`, async ({ page }) => {
    await page.goto('/')
    await page.locator('header').getByRole('link', { name, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`#${name.toLowerCase()}$`))
    const target = page.locator(`#${name.toLowerCase()}`)
    // Poll: smooth scrolling is asynchronous.
    await expect
      .poll(async () => {
        const box = await target.boundingBox()
        const height = page.viewportSize()!.height
        return box !== null && box.y < height && box.y + box.height > 0
      })
      .toBe(true)
  })
}

test('About shows the story and toolkit, and no portrait placeholder', async ({ page }) => {
  await page.goto('/')
  const about = page.locator('#about')
  await expect(about.getByRole('heading', { level: 2, name: 'Side B · About' })).toBeVisible()
  await expect(about.getByText(profile.aboutText)).toBeVisible()
  await expect(about.getByText(profile.toolkit)).toBeVisible()
  await expect(about.getByRole('img')).toHaveCount(0)
})

test('Contact shows the closing line and every way to reach Michael', async ({ page }) => {
  await page.goto('/')
  const contact = page.locator('#contact')
  await expect(contact.getByText(profile.closingLine)).toBeVisible()
  await expect(contact.getByRole('link', { name: profile.contactEmail })).toHaveAttribute(
    'href',
    `mailto:${profile.contactEmail}`,
  )
  const github = contact.getByRole('link', { name: 'GitHub' })
  await expect(github).toHaveAttribute('href', profile.githubUrl)
  await expect(github).toHaveAttribute('rel', 'noopener noreferrer')
  await expect(github).toHaveAttribute('target', '_blank')
  await expect(contact.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    profile.linkedinUrl,
  )
  await expect(contact.getByRole('link', { name: 'Resume' })).toHaveAttribute('href', '/resume.pdf')
})

test('every Resume link opens in a new tab', async ({ page }) => {
  await page.goto('/')
  const links = page.getByRole('link', { name: 'Resume' })
  expect(await links.count()).toBe(3) // header, hero, contact
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
})

test('footer shows the year and name', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('footer')).toContainText(
    `© ${new Date().getFullYear()} ${profile.name}`,
  )
})
