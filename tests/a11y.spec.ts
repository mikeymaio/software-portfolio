import { test } from '@playwright/test'
import { expectNoA11yViolationsInBothThemes } from './helpers/axe'

test('no WCAG 2.2 AA violations in light or dark', async ({ page }) => {
  await expectNoA11yViolationsInBothThemes(page)
})
