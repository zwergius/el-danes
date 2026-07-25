import { expect, test, type Page } from '@playwright/test'

const sourceFlip = (page: Page) =>
  page.getByRole('switch', { name: 'Show code' })

test('only exposes the source-code flip when source is available', async ({
  page,
}) => {
  await page.goto('/en/contact/christian')
  await expect(sourceFlip(page)).toHaveCount(0)

  await page.goto('/en')
  if ((await sourceFlip(page).count()) === 0) {
    await page.getByRole('button', { name: 'Menu' }).click()
  }
  await expect(sourceFlip(page)).toBeVisible()

  await sourceFlip(page).click()
  await expect(sourceFlip(page)).toHaveAttribute('aria-checked', 'true')
  await expect(page.locator('main code')).not.toBeEmpty()

  await sourceFlip(page).click()
  await expect(sourceFlip(page)).not.toHaveAttribute('aria-checked', 'true')
  await expect(page.locator('main code')).toHaveCount(0)
})
